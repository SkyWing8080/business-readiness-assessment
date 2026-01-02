import { Resend } from 'resend';
import { google } from 'googleapis';

const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Google Sheets
async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

// Health check endpoint
export async function GET() {
  return Response.json({
    status: 'ok',
    message: 'Assessment API is running',
    timestamp: new Date().toISOString(),
    env: {
      hasGoogleSheets: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL && !!process.env.GOOGLE_SHEET_ID,
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

    // Extract and normalize fields
    const email = body.email || body.Email || '';
    const fullName = body.fullName || body.name || body.full_name || body.Name || 'Unknown';
    const company = body.company || body.companyName || body.company_name || body.Company || '';
    const phone = body.phone || body.phoneNumber || body.phone_number || body.Phone || '';
    
    // Handle scores
    let totalScore = body.totalScore || body.total_score || body.score || body.Score || 0;
    const readinessLevel = body.readinessLevel || body.readiness_level || '';
    const dataScore = body.dataScore || body.data_score || 0;
    const processScore = body.processScore || body.process_score || 0;
    const teamScore = body.teamScore || body.team_score || 0;
    const strategicScore = body.strategicScore || body.strategic_score || 0;
    const changeScore = body.changeScore || body.change_score || 0;

    // Validate email
    if (!email || !email.includes('@')) {
      console.error('Invalid email:', email);
      return Response.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Ensure score is a valid number
    totalScore = Math.max(0, Math.min(100, parseInt(totalScore) || 0));
    console.log('Final score:', totalScore);

    // Determine readiness level if not provided
    let readinessLevelText = readinessLevel;
    if (!readinessLevelText) {
      if (totalScore >= 75) {
        readinessLevelText = 'High Readiness';
      } else if (totalScore >= 50) {
        readinessLevelText = 'Moderate Readiness';
      } else {
        readinessLevelText = 'Foundation Building';
      }
    }

    // Save to Google Sheets
    let sheetsSaved = false;
    
    try {
      console.log('Attempting Google Sheets save...');
      const sheets = await getGoogleSheetsClient();
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      
      const timestamp = new Date().toISOString();
      
      // Append row to sheet
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:L',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            timestamp,
            email,
            fullName,
            company,
            phone,
            totalScore,
            readinessLevelText,
            dataScore,
            processScore,
            teamScore,
            strategicScore,
            changeScore
          ]]
        }
      });
      
      sheetsSaved = true;
      console.log('Google Sheets save successful');
    } catch (sheetsError) {
      console.error('Google Sheets error:', sheetsError.message);
      console.error('Full Sheets error:', sheetsError);
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
        html: generateWelcomeEmail(fullName, totalScore, company, email, readinessLevelText, dataScore, processScore, teamScore, strategicScore, changeScore)
      });
      
      console.log('Email API response:', emailResult);
      
      if (emailResult.error) {
        throw new Error(emailResult.error.message || 'Email send failed');
      }
      
      emailSent = true;
      console.log('Email sent successfully');

    } catch (emailErr) {
      emailError = emailErr.message;
      console.error('Email error:', emailErr.message);
      console.error('Full email error:', emailErr);
    }

    // Return success response
    const response = {
      success: true,
      score: totalScore,
      emailSent: emailSent,
      sheetsSaved: sheetsSaved,
      message: 'Assessment processed successfully'
    };

    // Add warnings if something failed
    if (!sheetsSaved) {
      response.sheetsWarning = 'Google Sheets save failed but results were calculated';
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

// Email template generator
function generateWelcomeEmail(name, score, company, email, readinessLevel, dataScore, processScore, teamScore, strategicScore, changeScore) {
  const firstName = name.split(' ')[0] || name;
  const companyText = company ? ` for ${company}` : '';
  
  // Determine interpretation based on score
  let interpretation = '';
  if (score >= 75) {
    interpretation = `Your organization demonstrates strong foundational capabilities. You're well positioned to pursue transformation initiatives with reasonable confidence in success.`;
  } else if (score >= 50) {
    interpretation = `You have some foundational elements in place, but critical gaps need addressing before major transformation investments. Companies at this level risk failed implementations if they move too quickly.`;
  } else {
    interpretation = `Your organization has significant foundational gaps across multiple dimensions. Pursuing transformation initiatives now carries high risk. A systematic approach to build readiness first will dramatically improve your success rate.`;
  }
  
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
      <p style="color: #93c5fd; font-size: 15px; margin: 12px 0 0 0; font-weight: 600;">${readinessLevel}</p>
    </div>

    <!-- Dimensional Scores -->
    <h2 style="color: #1e3a5f; font-size: 18px; margin-top: 30px; margin-bottom: 15px;">Your Dimensional Scores</h2>
    
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 0; color: #4b5563;">Data Infrastructure & Quality</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #1e3a5f;">${dataScore}/12</td>
      </tr>
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 0; color: #4b5563;">Process Maturity & Documentation</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #1e3a5f;">${processScore}/12</td>
      </tr>
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 0; color: #4b5563;">Team Capabilities & Technology Fluency</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #1e3a5f;">${teamScore}/12</td>
      </tr>
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 0; color: #4b5563;">Strategic Readiness & Business Case Clarity</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #1e3a5f;">${strategicScore}/12</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #4b5563;">Organizational Change Readiness</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #1e3a5f;">${changeScore}/12</td>
      </tr>
    </table>

    <!-- Interpretation -->
    <h2 style="color: #1e3a5f; font-size: 18px; margin-top: 30px; margin-bottom: 15px;">What This Means${companyText}</h2>
    <p style="font-size: 15px; color: #4b5563; line-height: 1.7;">${interpretation}</p>

    <!-- Why We Built This -->
    <h2 style="color: #1e3a5f; font-size: 18px; margin-top: 30px; margin-bottom: 15px;">Why We Built This Assessment</h2>
    <p style="font-size: 15px; color: #4b5563; line-height: 1.7;">Most transformation initiatives fail not because the technology was wrong, but because the organization wasn't ready.</p>
    <p style="font-size: 15px; color: #4b5563; line-height: 1.7;">We've seen this pattern repeatedly across our combined 50+ years leading commercial operations at companies like Campari, GSK, Philips, Coca-Cola, and Unilever. The companies that succeed don't just buy better tools. They build readiness first.</p>
    <p style="font-size: 15px; color: #4b5563; line-height: 1.7;">That's what Inflection Advisory is about. We're not career consultants selling frameworks. We're operators who've sat in your chair, managed P&Ls, navigated organizational politics, and delivered results under real constraints.</p>

    <!-- What's Next -->
    <h2 style="color: #1e3a5f; font-size: 18px; margin-top: 30px; margin-bottom: 15px;">What's Next</h2>
    <p style="font-size: 15px; color: #4b5563; line-height: 1.7;">Over the next week, I'll share some perspectives on transformation that we've found valuable when working with companies at your readiness level.</p>
    <p style="font-size: 15px; color: #4b5563; line-height: 1.7;">In the meantime, if you have questions about your results or want to discuss what they mean${companyText} specifically, just reply to this email.</p>

    <!-- Sign Off -->
    <p style="font-size: 15px; color: #4b5563; margin-top: 30px;">Best regards,</p>
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
