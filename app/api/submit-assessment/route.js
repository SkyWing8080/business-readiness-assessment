import { sql } from '@vercel/postgres';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Health check endpoint
export async function GET() {
  return Response.json({
    status: 'ok',
    message: 'Assessment API is running',
    timestamp: new Date().toISOString(),
    env: {
      hasPostgres: !!process.env.POSTGRES_URL,
      hasResend: !!process.env.RESEND_API_KEY
    }
  });
}

// Main submission handler
export async function POST(request) {
  console.log('=== Assessment Submission Started ===');
  
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Received body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return Response.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Extract and normalize fields (handle various naming conventions)
    const email = body.email || body.Email || '';
    const fullName = body.fullName || body.name || body.full_name || body.Name || 'Unknown';
    const company = body.company || body.companyName || body.company_name || body.Company || '';
    const phone = body.phone || body.phoneNumber || body.phone_number || body.Phone || '';
    const role = body.role || body.jobTitle || body.job_title || body.Role || '';
    const industry = body.industry || body.Industry || '';
    const companySize = body.companySize || body.company_size || body.employees || body.Employees || '';
    
    // Handle scores - could be object or already calculated
    const scores = body.scores || body.answers || body.Scores || {};
    let totalScore = body.totalScore || body.total_score || body.score || body.Score || 0;

    // Validate email
    if (!email || !email.includes('@')) {
      console.error('Invalid email:', email);
      return Response.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Calculate score if not provided or if we have individual scores
    if (!totalScore && Object.keys(scores).length > 0) {
      totalScore = calculateScore(scores);
      console.log('Calculated score from answers:', totalScore);
    }

    // Ensure score is a valid number
    totalScore = Math.max(0, Math.min(100, parseInt(totalScore) || 0));
    console.log('Final score:', totalScore);

    // Save to database
    let leadId = null;
    let dbSuccess = false;
    
    try {
      console.log('Attempting database save...');
      const result = await sql`
        INSERT INTO leads (
          email, 
          full_name, 
          company, 
          phone, 
          role, 
          industry, 
          company_size,
          total_score,
          scores_json,
          email_sequence_step,
          created_at,
          updated_at
        ) VALUES (
          ${email},
          ${fullName},
          ${company},
          ${phone},
          ${role},
          ${industry},
          ${companySize},
          ${totalScore},
          ${JSON.stringify(scores)},
          0,
          NOW(),
          NOW()
        )
        ON CONFLICT (email) DO UPDATE SET
          full_name = EXCLUDED.full_name,
          company = EXCLUDED.company,
          phone = EXCLUDED.phone,
          role = EXCLUDED.role,
          industry = EXCLUDED.industry,
          company_size = EXCLUDED.company_size,
          total_score = EXCLUDED.total_score,
          scores_json = EXCLUDED.scores_json,
          updated_at = NOW()
        RETURNING id, total_score
      `;
      
      leadId = result.rows[0]?.id;
      totalScore = result.rows[0]?.total_score || totalScore;
      dbSuccess = true;
      console.log('Database save successful, lead ID:', leadId);
    } catch (dbError) {
      console.error('Database error:', dbError.message);
      console.error('Full database error:', dbError);
      // Continue without database - still try to send email
    }

    // Send welcome email
    let emailSent = false;
    let emailError = null;
    
    try {
      console.log('Attempting to send email to:', email);
      const emailResult = await resend.emails.send({
        from: 'Inflection Advisory <contact@inflection-advisory.com>',
        to: email,
        subject: `Your Business Transformation Readiness Score: ${totalScore}%`,
        html: generateWelcomeEmail(fullName, totalScore, company, email)
      });
      
      console.log('Email API response:', emailResult);
      
      if (emailResult.error) {
        throw new Error(emailResult.error.message || 'Email send failed');
      }
      
      emailSent = true;
      console.log('Email sent successfully');

      // Update email status in database
      if (leadId && dbSuccess) {
        try {
          await sql`
            UPDATE leads 
            SET email_sequence_step = 1, last_email_sent_at = NOW()
            WHERE id = ${leadId}
          `;
          console.log('Updated email sequence step');
        } catch (updateError) {
          console.error('Failed to update email sequence:', updateError.message);
        }
      }
    } catch (emailErr) {
      emailError = emailErr.message;
      console.error('Email error:', emailErr.message);
      console.error('Full email error:', emailErr);
    }

    // Return success response
    const response = {
      success: true,
      score: totalScore,
      leadId: leadId,
      emailSent: emailSent,
      dbSaved: dbSuccess,
      message: 'Assessment processed successfully'
    };

    // Add warnings if something failed
    if (!dbSuccess) {
      response.warning = 'Database save failed but results were calculated';
    }
    if (!emailSent) {
      response.emailWarning = emailError || 'Email send failed';
    }

    console.log('=== Assessment Submission Complete ===');
    console.log('Response:', JSON.stringify(response, null, 2));
    
    return Response.json(response);

  } catch (error) {
    console.error('=== Assessment Submission Failed ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    return Response.json(
      { 
        success: false, 
        error: 'Failed to process assessment',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Score calculation function
function calculateScore(scores) {
  const values = Object.values(scores);
  if (values.length === 0) return 0;

  let totalPoints = 0;
  let maxPoints = 0;

  values.forEach(value => {
    let points;
    
    if (typeof value === 'number') {
      // Numeric value (1-4 or 1-5 scale)
      points = value;
      maxPoints += 4; // Assume 4-point scale
    } else if (typeof value === 'string') {
      // Letter answer (a, b, c, d)
      const answerMap = { 
        'a': 1, 'b': 2, 'c': 3, 'd': 4,
        'A': 1, 'B': 2, 'C': 3, 'D': 4,
        '1': 1, '2': 2, '3': 3, '4': 4
      };
      points = answerMap[value] || 2;
      maxPoints += 4;
    } else {
      points = 2; // Default middle value
      maxPoints += 4;
    }
    
    totalPoints += points;
  });

  if (maxPoints === 0) return 0;
  return Math.round((totalPoints / maxPoints) * 100);
}

// Email template generator
function generateWelcomeEmail(name, score, company, email) {
  const scoreLevel = score >= 70 ? 'Strong' : score >= 40 ? 'Emerging' : 'Early Stage';
  const scoreColor = score >= 70 ? '#22c55e' : score >= 40 ? '#eab308' : '#ef4444';
  
  const firstName = name.split(' ')[0] || name;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your Assessment Results</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  
  <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px;">
      <h1 style="color: #1e3a5f; margin: 0; font-size: 24px; font-weight: 700;">INFLECTION</h1>
      <p style="color: #3b82f6; margin: 5px 0 0 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">ADVISORY</p>
    </div>

    <!-- Greeting -->
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${firstName},</p>

    <p style="font-size: 16px; margin-bottom: 25px;">Thank you for completing the Business Transformation Readiness Assessment. Here are your results:</p>

    <!-- Score Card -->
    <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); border-radius: 16px; padding: 35px; text-align: center; margin: 25px 0;">
      <p style="color: rgba(255,255,255,0.8); margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px;">Your Readiness Score</p>
      <p style="color: white; font-size: 56px; font-weight: 800; margin: 0; line-height: 1;">${score}%</p>
      <p style="color: ${scoreColor}; font-size: 15px; margin: 12px 0 0 0; font-weight: 600;">${scoreLevel} Readiness</p>
    </div>

    <!-- Score Interpretation -->
    <h2 style="color: #1e3a5f; font-size: 18px; margin-top: 30px; margin-bottom: 15px;">What This Means${company ? ` for ${company}` : ''}</h2>

    ${score >= 70 ? `
    <p style="font-size: 15px; color: #4b5563;">Your organization demonstrates <strong style="color: #1e3a5f;">strong readiness</strong> for business transformation initiatives. You have solid foundations across key dimensions. The focus now should be on optimizing execution and accelerating your transformation journey.</p>
    ` : score >= 40 ? `
    <p style="font-size: 15px; color: #4b5563;">Your organization is in an <strong style="color: #1e3a5f;">emerging readiness</strong> state. You have important foundations in place, but there are clear opportunities to strengthen capabilities before major transformation initiatives.</p>
    ` : `
    <p style="font-size: 15px; color: #4b5563;">Your organization is in the <strong style="color: #1e3a5f;">early stages</strong> of transformation readiness. This presents a significant opportunity to build strong foundations before investing in major transformation initiatives.</p>
    `}

    <!-- Next Steps -->
    <h2 style="color: #1e3a5f; font-size: 18px; margin-top: 30px; margin-bottom: 15px;">What's Next?</h2>

    <p style="font-size: 15px; color: #4b5563;">We're preparing a detailed analysis of your results across five key dimensions:</p>
    
    <ul style="color: #4b5563; font-size: 15px; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Data Infrastructure & Integration</li>
      <li style="margin-bottom: 8px;">Process Maturity & Automation</li>
      <li style="margin-bottom: 8px;">Team Capabilities & Change Readiness</li>
      <li style="margin-bottom: 8px;">Strategic Clarity & Alignment</li>
      <li style="margin-bottom: 8px;">Technology Foundation</li>
    </ul>

    <p style="font-size: 15px; color: #4b5563;">You'll receive this detailed analysis in a follow-up email, along with specific recommendations tailored to your situation.</p>

    <!-- About Box -->
    <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 30px 0; border-left: 4px solid #3b82f6;">
      <p style="margin: 0; font-size: 14px; color: #64748b;">
        <strong style="color: #1e3a5f;">About Inflection Advisory:</strong> We're business operators who've led transformations at companies like Campari, GSK, Philips, and Coca-Cola. We don't just advise - we've done the work ourselves.
      </p>
    </div>

    <!-- Sign Off -->
    <p style="font-size: 15px; color: #4b5563; margin-top: 25px;">Best regards,</p>
    <p style="font-size: 15px; color: #1e3a5f; margin-top: 5px;">
      <strong>Justin Pher & Praveen Raman</strong><br>
      <span style="color: #64748b; font-size: 14px;">Partners, Inflection Advisory</span>
    </p>

  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; padding: 20px;">
    <p style="font-size: 12px; color: #9ca3af; margin: 0;">
      You received this email because you completed the Business Transformation Readiness Assessment.
    </p>
    <p style="font-size: 12px; color: #9ca3af; margin: 10px 0 0 0;">
      <a href="https://business-readiness-assessment.vercel.app/api/unsubscribe?email=${encodeURIComponent(email)}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
    </p>
  </div>

</body>
</html>
  `.trim();
}
