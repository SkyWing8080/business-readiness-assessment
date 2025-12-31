import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { saveAssessmentLead, getLeadByEmail } from '@/lib/db';
import { getWelcomeEmail } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/submit-assessment
 * Handles assessment form submission
 */
export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'company', 'jobTitle', 'industry', 'companySize'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if lead already exists
    const existingLead = await getLeadByEmail(body.email);
    if (existingLead) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'This email has already been submitted. Please check your inbox for your assessment results.',
          duplicate: true
        },
        { status: 409 }
      );
    }

    // Calculate assessment score (example scoring logic)
    const assessmentScore = calculateAssessmentScore(body);

    // Prepare lead data
    const leadData = {
      fullName: body.fullName,
      email: body.email,
      company: body.company,
      jobTitle: body.jobTitle,
      phone: body.phone || null,
      industry: body.industry,
      companySize: body.companySize,
      currentChallenges: body.currentChallenges || '',
      businessGoals: body.businessGoals || '',
      timeframe: body.timeframe || '',
      budget: body.budget || '',
      decisionMakingRole: body.decisionMakingRole || '',
      additionalInfo: body.additionalInfo || null,
      consentMarketing: body.consentMarketing || false,
      assessmentScore: assessmentScore
    };

    // Save to database
    const savedLead = await saveAssessmentLead(leadData);

    // Send welcome email via Resend
    try {
      const emailConfig = getWelcomeEmail({
        fullName: body.fullName,
        email: body.email,
        company: body.company,
        assessmentScore: assessmentScore
      });

      const { data: emailData, error: emailError } = await resend.emails.send(emailConfig);

      if (emailError) {
        console.error('Resend email error:', emailError);
        // Don't fail the request if email fails - lead is already saved
      } else {
        console.log('Welcome email sent successfully:', emailData);
      }
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue - lead is saved even if email fails
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Assessment submitted successfully',
      data: {
        id: savedLead.id,
        email: savedLead.email,
        assessmentScore: assessmentScore,
        createdAt: savedLead.created_at
      }
    });

  } catch (error) {
    console.error('Assessment submission error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process assessment submission. Please try again.' 
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate assessment score based on responses
 * This is a simplified example - adjust based on your actual assessment questions
 */
function calculateAssessmentScore(data) {
  let score = 50; // Base score

  // Company size factor
  const sizeScores = {
    '1-10': 10,
    '11-50': 15,
    '51-200': 20,
    '201-500': 15,
    '500+': 10
  };
  score += sizeScores[data.companySize] || 10;

  // Timeframe factor (urgency)
  const timeframeScores = {
    'immediate': 20,
    '1-3 months': 15,
    '3-6 months': 10,
    '6-12 months': 5,
    'exploring': 0
  };
  score += timeframeScores[data.timeframe] || 0;

  // Decision-making role factor
  const roleScores = {
    'final decision maker': 20,
    'strong influence': 15,
    'recommend': 10,
    'research only': 5
  };
  score += roleScores[data.decisionMakingRole] || 0;

  // Ensure score is between 0 and 100
  return Math.min(Math.max(score, 0), 100);
}

/**
 * GET /api/submit-assessment
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Assessment API is running',
    timestamp: new Date().toISOString()
  });
}
