import { sql } from '@vercel/postgres';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { NextResponse } from 'next/server';
import WelcomeEmail from '../../../emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const data = await request.json();
    
    const {
      name,
      email,
      company,
      phone,
      scores, // { data, process, team, strategic, change }
    } = data;

    // Calculate total score and percentage
    const totalScore = scores.data + scores.process + scores.team + scores.strategic + scores.change;
    const percentage = Math.round((totalScore / 60) * 100); // 60 = max score (12 pts per dimension * 5)
    
    // Determine readiness level
    let readinessLevel;
    if (percentage >= 75) {
      readinessLevel = 'High Readiness - Ready to Execute';
    } else if (percentage >= 50) {
      readinessLevel = 'Moderate Readiness - Build Foundation First';
    } else {
      readinessLevel = 'Foundation Building - Strategic Assessment Needed';
    }

    // Insert into Postgres (with conflict handling for duplicate emails)
    const result = await sql`
      INSERT INTO leads (
        email,
        name,
        company,
        phone,
        total_score,
        percentage,
        readiness_level,
        data_score,
        process_score,
        team_score,
        strategic_score,
        change_score,
        email_sequence_step,
        last_email_sent_at
      )
      VALUES (
        ${email},
        ${name},
        ${company},
        ${phone || null},
        ${totalScore},
        ${percentage},
        ${readinessLevel},
        ${scores.data},
        ${scores.process},
        ${scores.team},
        ${scores.strategic},
        ${scores.change},
        1,
        NOW()
      )
      ON CONFLICT (email)
      DO UPDATE SET
        name = ${name},
        company = ${company},
        phone = ${phone || null},
        total_score = ${totalScore},
        percentage = ${percentage},
        readiness_level = ${readinessLevel},
        data_score = ${scores.data},
        process_score = ${scores.process},
        team_score = ${scores.team},
        strategic_score = ${scores.strategic},
        change_score = ${scores.change},
        email_sequence_step = 1,
        last_email_sent_at = NOW(),
        updated_at = NOW()
      RETURNING id
    `;

    const leadId = result.rows[0].id;

    // Send Email #1 via Resend
    try {
      const emailHtml = render(
        WelcomeEmail({ 
          name: name.split(' ')[0], 
          email,
          percentage,
          readinessLevel,
          scores 
        })
      );

      await resend.emails.send({
        from: 'Justin Pher & Praveen Raman <contact@inflection-advisory.com>',
        to: email,
        subject: `${name.split(' ')[0]}, advice from operators who've been in your shoes`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the entire request if email fails
    }

    return NextResponse.json({
      success: true,
      leadId,
      results: {
        totalScore,
        percentage,
        readinessLevel,
        scores
      }
    });

  } catch (error) {
    console.error('Error processing assessment:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process assessment. Please try again.' 
      },
      { status: 500 }
    );
  }
}
