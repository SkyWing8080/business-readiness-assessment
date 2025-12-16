import { sql } from '@vercel/postgres';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { NextResponse } from 'next/server';
import EducationalEmail from '../../../emails/EducationalEmail';
import ConversionEmail from '../../../emails/ConversionEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const emailsSent = {
      email2: 0,
      email3: 0,
      errors: []
    };

    // Find leads ready for Email #2 (4 days after Email #1)
    const leadsForEmail2 = await sql`
      SELECT id, email, name, percentage, data_score, process_score, team_score, strategic_score, change_score
      FROM leads
      WHERE email_sequence_step = 1
        AND last_email_sent_at <= NOW() - INTERVAL '4 days'
        AND unsubscribed = false
      LIMIT 50
    `;

    // Send Email #2 to eligible leads
    for (const lead of leadsForEmail2.rows) {
      try {
        const emailHtml = render(
          EducationalEmail({ 
            name: lead.name.split(' ')[0],
            email: lead.email,
            percentage: lead.percentage
          })
        );

        await resend.emails.send({
          from: 'Justin Pher & Praveen Raman <contact@inflection-advisory.com>',
          to: lead.email,
          subject: 'Three questions every business leader should ask before transformation',
          html: emailHtml,
        });

        // Update lead record
        await sql`
          UPDATE leads
          SET email_sequence_step = 2,
              last_email_sent_at = NOW(),
              updated_at = NOW()
          WHERE id = ${lead.id}
        `;

        emailsSent.email2++;
      } catch (error) {
        console.error(`Failed to send Email #2 to ${lead.email}:`, error);
        emailsSent.errors.push({ leadId: lead.id, email: lead.email, error: error.message });
      }
    }

    // Find leads ready for Email #3 (4 days after Email #2 = 8 days total)
    const leadsForEmail3 = await sql`
      SELECT id, email, name, percentage, data_score, process_score, team_score, strategic_score, change_score
      FROM leads
      WHERE email_sequence_step = 2
        AND last_email_sent_at <= NOW() - INTERVAL '4 days'
        AND unsubscribed = false
      LIMIT 50
    `;

    // Send Email #3 to eligible leads
    for (const lead of leadsForEmail3.rows) {
      try {
        const emailHtml = render(
          ConversionEmail({ 
            name: lead.name.split(' ')[0],
            email: lead.email,
            percentage: lead.percentage
          })
        );

        await resend.emails.send({
          from: 'Justin Pher & Praveen Raman <contact@inflection-advisory.com>',
          to: lead.email,
          subject: `${lead.name.split(' ')[0]}, ready to discuss your transformation roadmap?`,
          html: emailHtml,
        });

        // Update lead record (sequence complete)
        await sql`
          UPDATE leads
          SET email_sequence_step = 3,
              last_email_sent_at = NOW(),
              updated_at = NOW()
          WHERE id = ${lead.id}
        `;

        emailsSent.email3++;
      } catch (error) {
        console.error(`Failed to send Email #3 to ${lead.email}:`, error);
        emailsSent.errors.push({ leadId: lead.id, email: lead.email, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        email2Sent: emailsSent.email2,
        email3Sent: emailsSent.email3,
        totalSent: emailsSent.email2 + emailsSent.email3,
        errors: emailsSent.errors.length
      },
      errors: emailsSent.errors
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
