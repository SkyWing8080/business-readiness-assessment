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
// EMAIL #2 CONTENT (Day 4)
// ============================================
function getEmail2Content(firstName, email) {
  const unsubscribeUrl = `https://business-readiness-assessment.vercel.app/api/unsubscribe?email=${encodeURIComponent(email)}`;
  
  return {
    subject: 'Three questions that separate satisfying transformations from expensive failures',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.7; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <p>Hi ${firstName},</p>
  
  <p>In 20+ years of leading commercial operations, we've seen transformation initiatives fail more often than succeed. Not because the technology was wrong, but because three fundamental questions weren't answered first.</p>
  
  <p><strong style="color: #2c3e50;">Question 1: What specific business problem are we solving?</strong></p>
  
  <p>Most transformation initiatives start with "we need AI" or "we should digitize." That's not a problem statement. That's a solution looking for a problem.</p>
  
  <p>The transformations that succeed start differently. They start with quantified pain: "Our sales force effectiveness is 64% and attrition is 30%, costing us millions in lost productivity." Or: "We're losing 15% margin to inefficient trade spend we can't even measure."</p>
  
  <p>Clear problem. Quantified impact. Measurable success criteria.</p>
  
  <p><strong style="color: #2c3e50;">Question 2: How will we measure success, and do we have baseline data?</strong></p>
  
  <p>"Improved efficiency" and "better customer experience" aren't measurements. They're hopes.</p>
  
  <p>Before any transformation, you need answers to: What's the baseline today? What's the target? How will we track progress monthly, not annually? What leading indicators will tell us if we're on track before it's too late to course-correct?</p>
  
  <p>We've seen companies invest millions in transformation initiatives without baseline data. Twelve months later, no one could say whether the initiative succeeded or failed. That's not transformation. That's expensive activity.</p>
  
  <p><strong style="color: #2c3e50;">Question 3: Is our organization actually ready for change?</strong></p>
  
  <p>The best strategy fails without execution capability. This isn't about technology readiness. It's about organizational readiness.</p>
  
  <p>Does your team have capacity to absorb change while running the business? Are incentives aligned with transformation goals, or working against them? Is leadership willing to make difficult decisions when the data demands it?</p>
  
  <p>We've watched organizations agree on strategy in the boardroom, then walk out and continue doing exactly what they were doing before. Real readiness means the metrics people are measured on actually drive the behaviors transformation requires.</p>
  
  <p><strong style="color: #2c3e50;">The Pattern:</strong></p>
  
  <p>Successful transformations start with clarity. Clear problem definition. Clear success metrics. Clear organizational readiness assessment.</p>
  
  <p>The technology is the easy part.</p>
  
  <p>When you're ready to discuss your transformation roadmap, we approach it through these three questions first. Not because we're trying to delay technology decisions, but because clarity on these questions determines whether transformation succeeds or becomes another failed initiative.</p>
  
  <p>Best regards,</p>
  
  <p><strong>Justin & Praveen</strong></p>
  
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

// ============================================
// EMAIL #3 CONTENT (Day 8)
// ============================================
function getEmail3Content(firstName, company, score, email) {
  const unsubscribeUrl = `https://business-readiness-assessment.vercel.app/api/unsubscribe?email=${encodeURIComponent(email)}`;
  
  return {
    subject: `${firstName}, a different kind of conversation`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.7; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <p>Hi ${firstName},</p>
  
  <p>Over the past week, you've seen how we think about transformation: starting with clear problem definition, establishing measurable success criteria, and ensuring organizational readiness before making technology decisions.</p>
  
  <p>If you're considering how to apply this thinking to ${company}, we'd like to offer something we call a <strong>"Different Kind of Conversation."</strong></p>
  
  <p><strong style="color: #2c3e50;">Here's what makes it different:</strong></p>
  
  <p><strong>We review your actual assessment results.</strong><br>
  Your ${score}% readiness score tells a specific story. We'll walk through what it means for your transformation sequencing, which gaps to address first, and which you can work around for now.</p>
  
  <p><strong>We share relevant examples from our experience.</strong><br>
  We've led transformations across consumer goods, healthcare, and beverage companies in Asia Pacific. Chances are, we've seen situations similar to yours. We'll share what worked, what failed, and why.</p>
  
  <p><strong>We're honest about fit.</strong><br>
  If we're not the right fit for your situation, we'll tell you. If you're not ready for external support yet, we'll tell you that too. We're selective about the companies we work with because genuine value matters more than billable hours.</p>
  
  <p><strong>No slides. No sales pitch.</strong><br>
  We'll discuss your challenges, share our perspective, and explain how we typically work. If it makes sense to continue the conversation, great. If not, you'll still walk away with useful insights from operators who've been in your shoes.</p>
  
  <p><strong style="color: #2c3e50;">What happens on the call (45 minutes):</strong></p>
  <ul style="padding-left: 20px;">
    <li style="margin-bottom: 8px;">First 15 minutes: You walk us through your current situation and what prompted the assessment</li>
    <li style="margin-bottom: 8px;">Next 20 minutes: We discuss your results, share relevant examples, and outline potential approaches</li>
    <li style="margin-bottom: 8px;">Final 10 minutes: We answer your questions and discuss next steps, only if you want to</li>
  </ul>
  
  <p><strong style="color: #2c3e50;">Ready to talk?</strong></p>
  
  <p>Reply to this email with a few times that work for you over the next two weeks, and we'll find a slot.</p>
  
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

// ============================================
// Check if email is unsubscribed
// ============================================
async function isUnsubscribed(email) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Unsubscribes!A:B',
    });
    
    const rows = response.data.values || [];
    // Skip header row, check email column (B)
    const unsubscribedEmails = rows.slice(1).map(row => row[1]?.toLowerCase().trim());
    
    return unsubscribedEmails.includes(email.toLowerCase().trim());
  } catch (error) {
    console.error('Error checking unsubscribe status:', error);
    return false; // If error, assume not unsubscribed to avoid blocking
  }
}

// ============================================
// Update email sequence step in Google Sheets
// ============================================
async function updateEmailStep(email, newStep) {
  try {
    // Get all leads to find the row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:N',
    });
    
    const rows = response.data.values || [];
    let rowIndex = -1;
    
    // Find the row with matching email (email is in column B, index 1)
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1]?.toLowerCase().trim() === email.toLowerCase().trim()) {
        rowIndex = i + 1; // Sheets is 1-indexed
        break;
      }
    }
    
    if (rowIndex > 0) {
      // Update columns M (email_step) and N (last_email_sent)
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Sheet1!M${rowIndex}:N${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[newStep, new Date().toISOString()]],
        },
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating email step:', error);
    return false;
  }
}

// ============================================
// Get leads ready for emails
// ============================================
async function getLeadsForEmail(targetStep, daysAgo) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:N',
    });
    
    const rows = response.data.values || [];
    if (rows.length <= 1) return []; // No data or only header
    
    const leads = [];
    const now = new Date();
    
    // Column mapping based on your actual sheet:
    // A: timestamp, B: email, C: full_name, D: company, E: phone
    // F: total_score, G: readiness_level
    // H: data_score, I: process_score, J: team_score, K: strategic_score, L: change_score
    // M: email_step (NEW), N: last_email_sent (NEW)
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      // Extract first name from full_name
      const fullName = row[2] || 'there';
      const firstName = fullName.split(' ')[0] || 'there';
      
      const lead = {
        timestamp: row[0],
        email: row[1],
        firstName: firstName,
        fullName: fullName,
        company: row[3] || 'your company',
        phone: row[4] || '',
        totalScore: parseInt(row[5]) || 0,
        readinessLevel: row[6] || '',
        dataScore: parseInt(row[7]) || 0,
        processScore: parseInt(row[8]) || 0,
        teamScore: parseInt(row[9]) || 0,
        strategicScore: parseInt(row[10]) || 0,
        changeScore: parseInt(row[11]) || 0,
        emailStep: parseInt(row[12]) || 1, // Default to 1 if not set (Email #1 was sent)
        lastEmailSent: row[13] || row[0], // Use original timestamp if no last email date
      };
      
      // Determine the reference date for comparison
      const referenceDate = new Date(lead.lastEmailSent);
      const daysSinceReference = Math.floor((now - referenceDate) / (24 * 60 * 60 * 1000));
      
      // Check if this lead is ready for the target email
      // For Email #2 (targetStep=2): emailStep should be 1, and 4+ days since Email #1
      // For Email #3 (targetStep=3): emailStep should be 2, and 4+ days since Email #2
      if (lead.emailStep === targetStep - 1 && daysSinceReference >= daysAgo) {
        leads.push(lead);
      }
    }
    
    return leads;
  } catch (error) {
    console.error('Error getting leads:', error);
    return [];
  }
}

// ============================================
// MAIN CRON HANDLER
// ============================================
export async function GET(request) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const results = {
    email2: { sent: 0, skipped: 0, failed: 0, details: [] },
    email3: { sent: 0, skipped: 0, failed: 0, details: [] },
  };
  
  try {
    // ========================================
    // Process Email #2 (Day 4)
    // Leads at step 1, 4+ days since Email #1
    // ========================================
    const leadsForEmail2 = await getLeadsForEmail(2, 4);
    console.log(`Found ${leadsForEmail2.length} leads ready for Email #2`);
    
    for (const lead of leadsForEmail2) {
      // Check unsubscribe status BEFORE sending
      if (await isUnsubscribed(lead.email)) {
        results.email2.skipped++;
        results.email2.details.push({ email: lead.email, status: 'skipped - unsubscribed' });
        console.log(`Skipped ${lead.email} - unsubscribed`);
        continue;
      }
      
      try {
        const emailContent = getEmail2Content(lead.firstName, lead.email);
        
        await resend.emails.send({
          from: 'Justin Pher & Praveen Raman <contact@inflection-advisory.com>',
          to: lead.email,
          subject: emailContent.subject,
          html: emailContent.html,
        });
        
        // Update step to 2
        await updateEmailStep(lead.email, 2);
        
        results.email2.sent++;
        results.email2.details.push({ email: lead.email, status: 'sent' });
        console.log(`Sent Email #2 to ${lead.email}`);
      } catch (error) {
        results.email2.failed++;
        results.email2.details.push({ email: lead.email, status: 'failed', error: error.message });
        console.error(`Failed to send Email #2 to ${lead.email}:`, error.message);
      }
    }
    
    // ========================================
    // Process Email #3 (Day 8)
    // Leads at step 2, 4+ days since Email #2
    // ========================================
    const leadsForEmail3 = await getLeadsForEmail(3, 4);
    console.log(`Found ${leadsForEmail3.length} leads ready for Email #3`);
    
    for (const lead of leadsForEmail3) {
      // Check unsubscribe status BEFORE sending
      if (await isUnsubscribed(lead.email)) {
        results.email3.skipped++;
        results.email3.details.push({ email: lead.email, status: 'skipped - unsubscribed' });
        console.log(`Skipped ${lead.email} - unsubscribed`);
        continue;
      }
      
      try {
        const emailContent = getEmail3Content(lead.firstName, lead.company, lead.totalScore, lead.email);
        
        await resend.emails.send({
          from: 'Justin Pher & Praveen Raman <contact@inflection-advisory.com>',
          to: lead.email,
          subject: emailContent.subject,
          html: emailContent.html,
        });
        
        // Update step to 3 (sequence complete)
        await updateEmailStep(lead.email, 3);
        
        results.email3.sent++;
        results.email3.details.push({ email: lead.email, status: 'sent' });
        console.log(`Sent Email #3 to ${lead.email}`);
      } catch (error) {
        results.email3.failed++;
        results.email3.details.push({ email: lead.email, status: 'failed', error: error.message });
        console.error(`Failed to send Email #3 to ${lead.email}:`, error.message);
      }
    }
    
    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
    
  } catch (error) {
    console.error('Cron job error:', error);
    return Response.json({
      success: false,
      error: error.message,
      results,
    }, { status: 500 });
  }
}
