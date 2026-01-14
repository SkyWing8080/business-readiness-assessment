import { Resend } from 'resend';
import { google } from 'googleapis';

const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Google Sheets
async function getGoogleSheetsClient() {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

// Save lead to Google Sheets
async function saveToGoogleSheets(data) {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    const timestamp = new Date().toISOString();
    const row = [
      timestamp,
      data.email || '',
      data.fullName || '',
      data.company || '',
      data.phone || '',
      data.totalScore || 0,
      data.readinessLevel || '',
      data.dataScore || 0,
      data.processScore || 0,
      data.teamScore || 0,
      data.strategicScore || 0,
      data.changeScore || 0
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Assessment Leads!A:L',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row]
      }
    });

    console.log('Successfully saved to Google Sheets');
    return true;
  } catch (error) {
    console.error('Google Sheets error:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
    return false;
  }
}

// Health check endpoint
export async function GET() {
  return Response.json({
    status: 'ok',
    message: 'Assessment API is running',
    timestamp: new Date().toISOString(),
    env: {
      hasGoogleSheets: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL && !!process.env.GOOGLE_SHEETS_PRIVATE_KEY && !!process.env.GOOGLE_SHEET_ID,
      hasResend: !!process.env.RESEND_API_KEY
    }
  });
}

// Main submission handler
export async function POST(request) {
  console.log('=== Assessment Submission Started ===');
  
  let sheetsSaved = false;
  let emailSent = false;
  let sheetsWarning = '';
  let emailWarning = '';

  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Received submission for:', body.email);
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
    const readinessPercentage = body.readinessPercentage || body.readiness_percentage || 0;
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
    totalScore = Math.max(0, Math.min(60, parseInt(totalScore) || 0));
    console.log('Processing submission - Email:', email, 'Score:', totalScore);

    // Save to Google Sheets
    const leadData = {
      email,
      fullName,
      company,
      phone,
      totalScore,
      readinessLevel,
      dataScore,
      processScore,
      teamScore,
      strategicScore,
      changeScore
    };

    sheetsSaved = await saveToGoogleSheets(leadData);
    if (!sheetsSaved) {
      sheetsWarning = 'Google Sheets save failed but results were calculated';
    }

    // Send welcome email
    try {
      const emailResult = await resend.emails.send({
        from: 'Inflection Advisory <hello@inflection-advisory.com>',
        to: email,
        subject: `Your Business Transformation Readiness Score: ${readinessPercentage}%`,
        html: generateWelcomeEmail(fullName, totalScore, readinessPercentage, readinessLevel, dataScore, processScore, teamScore, strategicScore, changeScore)
      });
      
      if (emailResult.error) {
        console.error('Resend error:', emailResult.error);
        emailWarning = emailResult.error.message || 'Email sending failed';
      } else {
        emailSent = true;
        console.log('Welcome email sent successfully');
      }
    } catch (emailError) {
      console.error('Email error:', emailError.message);
      emailWarning = emailError.message || 'Email sending failed';
    }

    // Return success with warnings if any
    return Response.json({
      success: true,
      score: totalScore,
      emailSent,
      sheetsSaved,
      message: 'Assessment processed successfully',
      ...(sheetsWarning && { sheetsWarning }),
      ...(emailWarning && { emailWarning })
    });

  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Unknown error',
        emailSent,
        sheetsSaved
      },
      { status: 500 }
    );
  }
}

// Generate welcome email HTML
function generateWelcomeEmail(name, score, percentage, level, dataScore, processScore, teamScore, strategicScore, changeScore) {
  const firstName = name.split(' ')[0];
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="color: #1e3a5f; font-size: 24px; margin: 0;">INFLECTION</h1>
      <p style="color: #0891b2; font-size: 14px; margin: 4px 0 0 0; letter-spacing: 2px;">ADVISORY</p>
    </div>
    
    <!-- Main Content -->
    <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Hi ${firstName},
      </p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Thank you for completing the Business Transformation Readiness Assessment. Here are your results:
      </p>
      
      <!-- Score Box -->
      <div style="background: linear-gradient(135deg, #1e3a5f 0%, #0891b2 100%); border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
        <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Your Readiness Score</p>
        <p style="color: white; font-size: 48px; font-weight: bold; margin: 0;">${percentage}%</p>
        <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 8px 0 0 0;">${level}</p>
      </div>
      
      <!-- Dimension Scores -->
      <div style="margin: 24px 0;">
        <p style="color: #1e3a5f; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">Your scores across 5 dimensions:</p>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #374151; border-bottom: 1px solid #e5e7eb;">Data Infrastructure</td>
            <td style="padding: 8px 0; color: #1e3a5f; font-weight: 600; text-align: right; border-bottom: 1px solid #e5e7eb;">${dataScore}/12</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #374151; border-bottom: 1px solid #e5e7eb;">Process Maturity</td>
            <td style="padding: 8px 0; color: #1e3a5f; font-weight: 600; text-align: right; border-bottom: 1px solid #e5e7eb;">${processScore}/12</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #374151; border-bottom: 1px solid #e5e7eb;">Team Capabilities</td>
            <td style="padding: 8px 0; color: #1e3a5f; font-weight: 600; text-align: right; border-bottom: 1px solid #e5e7eb;">${teamScore}/12</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #374151; border-bottom: 1px solid #e5e7eb;">Strategic Clarity</td>
            <td style="padding: 8px 0; color: #1e3a5f; font-weight: 600; text-align: right; border-bottom: 1px solid #e5e7eb;">${strategicScore}/12</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #374151;">Change Readiness</td>
            <td style="padding: 8px 0; color: #1e3a5f; font-weight: 600; text-align: right;">${changeScore}/12</td>
          </tr>
        </table>
      </div>
      
      <!-- Operator Credibility -->
      <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">
          <strong style="color: #1e3a5f;">Why Inflection Advisory?</strong><br><br>
          We're not traditional consultants. We're seasoned operators with 50+ years of combined experience leading business transformation at companies like Unilever, Coca-Cola, GSK, and Philips across Asia Pacific. We've sat in your chair and understand the real challenges of driving change.
        </p>
      </div>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
        Over the next week, we'll share practical insights to help you think through your transformation journey. No sales pitch, just value.
      </p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
        Best regards,<br>
        <strong style="color: #1e3a5f;">Justin & Praveen</strong><br>
        <span style="color: #6b7280; font-size: 14px;">Inflection Advisory</span>
      </p>
      
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        Inflection Advisory | Business Transformation Experts
      </p>
      <p style="font-size: 12px; color: #9ca3af; margin: 10px 0 0 0;">
        <a href="https://business-readiness-assessment.vercel.app/api/unsubscribe?email=${encodeURIComponent(email)}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
      </p>
    </div>

  </div>

</body>
</html>
  `.trim();
}
