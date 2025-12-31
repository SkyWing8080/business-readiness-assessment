import { sql } from '@vercel/postgres';

/**
 * Save assessment lead to database
 * @param {Object} leadData - The lead information
 * @returns {Promise<Object>} The created lead record
 */
export async function saveAssessmentLead(leadData) {
  try {
    const {
      fullName,
      email,
      company,
      jobTitle,
      phone,
      industry,
      companySize,
      currentChallenges,
      businessGoals,
      timeframe,
      budget,
      decisionMakingRole,
      additionalInfo,
      consentMarketing,
      assessmentScore
    } = leadData;

    const result = await sql`
      INSERT INTO leads (
        full_name,
        email,
        company,
        job_title,
        phone,
        industry,
        company_size,
        current_challenges,
        business_goals,
        timeframe,
        budget,
        decision_making_role,
        additional_info,
        consent_marketing,
        assessment_score,
        created_at
      ) VALUES (
        ${fullName},
        ${email},
        ${company},
        ${jobTitle},
        ${phone || null},
        ${industry},
        ${companySize},
        ${currentChallenges},
        ${businessGoals},
        ${timeframe},
        ${budget},
        ${decisionMakingRole},
        ${additionalInfo || null},
        ${consentMarketing},
        ${assessmentScore},
        NOW()
      )
      RETURNING id, email, full_name, assessment_score, created_at
    `;

    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to save lead to database');
  }
}

/**
 * Get lead by email
 * @param {string} email - Lead email address
 * @returns {Promise<Object|null>} The lead record or null
 */
export async function getLeadByEmail(email) {
  try {
    const result = await sql`
      SELECT * FROM leads 
      WHERE email = ${email} 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

/**
 * Update lead email sequence status
 * @param {string} email - Lead email address
 * @param {number} emailNumber - Email sequence number (1, 2, or 3)
 * @returns {Promise<boolean>} Success status
 */
export async function updateEmailStatus(email, emailNumber) {
  try {
    const field = `email_${emailNumber}_sent_at`;
    await sql`
      UPDATE leads 
      SET ${sql(field)} = NOW()
      WHERE email = ${email}
    `;
    return true;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
}
