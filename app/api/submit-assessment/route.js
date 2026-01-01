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