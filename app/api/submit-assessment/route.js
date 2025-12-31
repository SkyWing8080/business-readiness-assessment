import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Assessment API is running',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // FIXED: Only require fullName, email, company (jobTitle, industry, companySize are now optional)
    const requiredFields = ['fullName', 'email', 'company'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Extract data with defaults for optional fields
    const {
      fullName,
      email,
      company,
      phone = '',
      jobTitle = '',
      industry = '',
      companySize = '',
      totalScore,
      readinessPercentage,
      readinessLevel,
      dataScore,
      processScore,
      teamScore,
      strategicScore,
      changeScore,
      data_1, data_2, data_3,
      process_1, process_2, process_3,
      team_1, team_2, team_3,
      strategic_1, strategic_2, strategic_3,
      change_1, change_2, change_3
    } = body;

    // Insert into database
    const result = await sql`
      INSERT INTO leads (
        full_name, email, company, phone,
        job_title, industry, company_size,
        total_score, readiness_percentage, readiness_level,
        data_score, process_score, team_score, strategic_score, change_score,
        data_1, data_2, data_3,
        process_1, process_2, process_3,
        team_1, team_2, team_3,
        strategic_1, strategic_2, strategic_3,
        change_1, change_2, change_3,
        created_at
      ) VALUES (
        ${fullName}, ${email}, ${company}, ${phone},
        ${jobTitle}, ${industry}, ${companySize},
        ${totalScore}, ${readinessPercentage}, ${readinessLevel},
        ${dataScore}, ${processScore}, ${teamScore}, ${strategicScore}, ${changeScore},
        ${data_1}, ${data_2}, ${data_3},
        ${process_1}, ${process_2}, ${process_3},
        ${team_1}, ${team_2}, ${team_3},
        ${strategic_1}, ${strategic_2}, ${strategic_3},
        ${change_1}, ${change_2}, ${change_3},
        NOW()
      )
      RETURNING id
    `;

    const leadId = result.rows[0].id;

    // Send email via Resend
    try {
      await resend.emails.send({
        from: 'Inflection Advisory <assessments@inflection-advisory.com>',
        to: email,
        subject: `Your Business Transformation Readiness Assessment Results - ${readinessPercentage}%`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
    .score-circle { 
      background: #0066cc; 
      color: white; 
      width: 150px; 
      height: 150px; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      margin: 30px auto; 
      font-size: 48px; 
      font-weight: bold; 
    }
    .badge { 
      background: #e6f2ff; 
      color: #0066cc; 
      padding: 10px 20px; 
      border-radius: 20px; 
      display: inline-block; 
      margin: 20px 0; 
    }
    .section { margin: 30px 0; }
    .section h2 { color: #0066cc; }
    .cta-button { 
      background: #0066cc; 
      color: white; 
      padding: 15px 30px; 
      text-decoration: none; 
      border-radius: 5px; 
      display: inline-block; 
      margin: 20px 0; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Assessment Results</h1>
    </div>
    
    <p>Hi ${fullName},</p>
    
    <p>Thank you for completing the Business Transformation Readiness Assessment. Here are your results:</p>
    
    <div class="score-circle">${readinessPercentage}%</div>
    
    <div style="text-align: center;">
      <span class="badge">${readinessLevel}</span>
    </div>
    
    <div class="section">
      <h2>Your Dimensional Scores</h2>
      <ul>
        <li><strong>Data Infrastructure:</strong> ${dataScore}/12</li>
        <li><strong>Process Maturity:</strong> ${processScore}/12</li>
        <li><strong>Team Capabilities:</strong> ${teamScore}/12</li>
        <li><strong>Strategic Readiness:</strong> ${strategicScore}/12</li>
        <li><strong>Change Readiness:</strong> ${changeScore}/12</li>
      </ul>
    </div>
    
    <div class="section">
      <h2>Next Steps</h2>
      <p>Our team will review your results and follow up with you within 7 working days to discuss:</p>
      <ul>
        <li>Detailed interpretation of your assessment</li>
        <li>Specific recommendations for your organization</li>
        <li>Potential engagement options</li>
      </ul>
    </div>
    
    <div style="text-align: center;">
      <a href="mailto:contact@inflection-advisory.com" class="cta-button">
        Schedule a Consultation
      </a>
    </div>
    
    <div class="section" style="font-size: 12px; color: #666;">
      <p>Best regards,<br>The Inflection Advisory Team</p>
      <p>Email: contact@inflection-advisory.com<br>Website: inflection-advisory.com</p>
    </div>
  </div>
</body>
</html>
        `
      });

      console.log('Email sent successfully to:', email);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the whole request if email fails
    }

    return NextResponse.json({
      success: true,
      leadId,
      message: 'Assessment submitted successfully'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
