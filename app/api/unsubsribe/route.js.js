import { google } from 'googleapis';

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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  if (!email) {
    return new Response(generateHTML('Error', 'No email address provided.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }
  
  try {
    // Check if already unsubscribed
    const existingResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Unsubscribes!A:B',
    });
    
    const existingRows = existingResponse.data.values || [];
    const alreadyUnsubscribed = existingRows.slice(1).some(
      row => row[1]?.toLowerCase() === email.toLowerCase()
    );
    
    if (alreadyUnsubscribed) {
      return new Response(
        generateHTML('Already Unsubscribed', 'This email address has already been unsubscribed from our mailing list.'),
        { status: 200, headers: { 'Content-Type': 'text/html' } }
      );
    }
    
    // Add to Unsubscribes sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Unsubscribes!A:B',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[new Date().toISOString(), email]],
      },
    });
    
    console.log(`Unsubscribed: ${email}`);
    
    return new Response(
      generateHTML('Unsubscribed Successfully', 'You have been successfully unsubscribed from our mailing list. You will no longer receive emails from Inflection Advisory.'),
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
    
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new Response(
      generateHTML('Error', 'There was an error processing your request. Please try again or contact us directly at contact@inflection-advisory.com'),
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }
}

function generateHTML(title, message) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Inflection Advisory</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 48px;
      max-width: 500px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 {
      color: #2c3e50;
      margin-bottom: 16px;
      font-size: 28px;
    }
    p {
      color: #666;
      line-height: 1.6;
      font-size: 16px;
    }
    .logo {
      font-size: 14px;
      color: #999;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <p>${message}</p>
    <div class="logo">Inflection Advisory</div>
  </div>
</body>
</html>
  `;
}
