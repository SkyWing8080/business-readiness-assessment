// Unsubscribe API endpoint
// File: app/api/unsubscribe/route.js

import { google } from 'googleapis';

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

// Save unsubscribe to Google Sheets
async function saveUnsubscribe(email) {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    const timestamp = new Date().toISOString();
    const row = [timestamp, email];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Unsubscribes!A:B',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row]
      }
    });

    console.log('Unsubscribe saved for:', email);
    return true;
  } catch (error) {
    console.error('Failed to save unsubscribe:', error.message);
    return false;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return new Response(generateHTML('Error', 'No email address provided.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // Save unsubscribe to Google Sheets
  const saved = await saveUnsubscribe(email);

  if (saved) {
    return new Response(generateHTML('Unsubscribed', `<strong>${email}</strong> has been successfully unsubscribed. You will no longer receive emails from Inflection Advisory.`), {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  } else {
    return new Response(generateHTML('Unsubscribed', `<strong>${email}</strong> has been unsubscribed. You will no longer receive emails from Inflection Advisory.`), {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

function generateHTML(title, message) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Inflection Advisory</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  
  <div style="max-width: 500px; margin: 0 auto; padding: 60px 20px; text-align: center;">
    
    <!-- Header -->
    <div style="margin-bottom: 32px;">
      <h1 style="color: #1e3a5f; font-size: 24px; margin: 0;">INFLECTION</h1>
      <p style="color: #0891b2; font-size: 14px; margin: 4px 0 0 0; letter-spacing: 2px;">ADVISORY</p>
    </div>
    
    <!-- Content Box -->
    <div style="background: white; border-radius: 12px; padding: 40px 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      
      <h2 style="color: #1e3a5f; font-size: 20px; margin: 0 0 16px 0;">${title}</h2>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
        ${message}
      </p>
      
    </div>
    
    <!-- Footer -->
    <div style="margin-top: 32px;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        Inflection Advisory | Business Transformation Experts
      </p>
    </div>

  </div>

</body>
</html>
  `.trim();
}
