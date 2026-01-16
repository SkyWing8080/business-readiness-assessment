import { Resend } from 'resend';
import { google } from 'googleapis';

const resend = new Resend(process.env.RESEND_API_KEY);

// Google Sheets setup
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

// ============================================
// EMAIL #1 CONTENT (Day 0 - Immediate)
// ============================================
function getEmail1Content(firstName, company, score, readinessLevel, dataScore, processScore, teamScore, strategicScore, changeScore, email) {
  const unsubscribeUrl = `https://business-readiness-assessment.vercel.app/api/unsubscribe?email=${encodeURIComponent(email)}`;
  
  // Score interpretation based on thresholds
  let interpretation;
  if (score >= 70) {
    interpretation = "Your organization shows strong foundations across multiple dimensions. You're well-positioned to pursue transformation initiatives with confidence. The key now is sequencing: identifying which opportunities will deliver the highest impact given your current capabilities.";
  } else if (score >= 40) {
    interpretation = "Your organization has solid foundations in some areas but faces specific gaps that could derail transformation efforts if not addressed. The good news? These gaps are identifiable and addressable. Success will come from building capability in your weaker dimensions before pursuing ambitious initiatives.";
  } else {
    interpretation = "Your organization is in the early stages of transformation readiness. This isn't a limitation; it's clarity. Many companies rush into transformation without this honest assessment and waste significant resources. You now have the insight to build systematically.";
  }
  
  return {
    subject: `Your Business Transformation Readiness Score: ${score}%`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.7; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <p>Hi ${firstName},</p>
  
  <p>Thank you for completing the Business Transformation Readiness Assessment.</p>
  
  <!-- Score Card -->
  <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 25px 0;">
    <p style="color: rgba(255,255,255,0.8); margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Your Readiness Score</p>
    <p style="color: white; font-size: 48px; font-weight: 800; margin: 0; line-height: 1;">${score}%</p>
    <p style="color: #93c5fd; font-size: 14px; margin: 10px 0 0 0; font-weight: 600;">${readinessLevel}</p>
  </div>
  
  <p><strong style="color: #2c3e50;">Your Dimension Breakdown:</strong></p>
  
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
  
  <p><strong style="color: #2c3e50;">What This Means:</strong></p>
  
  <p>${interpretation}</p>
  
  <p><strong style="color: #2c3e50;">Why We Built This Assessment:</strong></p>
  
  <p>We've seen too many transformation initiatives fail. Not from lack of effort or investment, but from lack of honest self-assessment upfront.</p>
  
  <p>We're not career consultants. We're operators who've spent 50+ combined years building and transforming commercial operations across Asia Pacific, leading teams from 50 to 500+ people, and delivering measurable results in consumer goods, healthcare, and beverage companies.</p>
  
  <p>We've sat in the chair you're sitting in now. We've made the decisions you're making. And we've learned, sometimes the hard way, what actually separates successful transformations from expensive failures.</p>
  
  <p><strong style="color: #2c3e50;">What's Next?</strong></p>
  
  <p>Over the next week, we'll share a framework we use to help companies evaluate transformation priorities. No sales pitch, just practical guidance from operators who've been in your shoes.</p>
  
  <p>Best regards,</p>
  
  <p><strong>Justin Pher & Praveen Raman</strong><br>
  Inflection Advisory</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  
  <p style="font-size: 12px; color: #888;">
    Inflection Advisory<br>
    contact@inflection-advisory.com<br><br>
    <a href="${unsubscribeUrl}" style="color: #888;">Unsubscribe</a>
  </p>
  
</body>
</html>
    `,
  };
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    const {
      full_name,
      email,
      company,
      phone,
      total_score,
      readiness_level,
      data_score,
      process_score,
      team_score,
      strategic_score,
      change_score,
    } = data;

    // Extract first name
    const firstName = full_name?.split(' ')[0] || 'there';

    // Save to Google Sheets
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A:N',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            new Date().toISOString(),  // A: timestamp
            email,                      // B: email
            full_name,                  // C: full_name
            company,                    // D: company
            phone,                      // E: phone
            total_score,                // F: total_score
            readiness_level,            // G: readiness_level
            data_score,                 // H: data_score
            process_score,              // I: process_score
            team_score,                 // J: team_score
            strategic_score,            // K: strategic_score
            change_score,               // L: change_score
            1,                          // M: email_step (1 = Email #1 sent)
            new Date().toISOString(),   // N: last_email_sent
          ]],
        },
      });
      console.log('Lead saved to Google Sheets');
    } catch (sheetError) {
      console.error('Failed to save to Google Sheets:', sheetError);
      // Continue even if sheet save fails
    }

    // Send Email #1 via Resend
    try {
      const emailContent = getEmail1Content(
        firstName,
        company,
        total_score,
        readiness_level,
        data_score,
        process_score,
        team_score,
        strategic_score,
        change_score,
        email
      );

      await resend.emails.send({
        from: 'Justin Pher & Praveen Raman <contact@inflection-advisory.com>',
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
      });
      
      console.log(`Email #1 sent to ${email}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the entire request if email fails
    }

    return Response.json({
      success: true,
      message: 'Assessment submitted successfully',
      score: total_score,
      readinessLevel: readiness_level,
    });

  } catch (error) {
    console.error('Submit assessment error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
