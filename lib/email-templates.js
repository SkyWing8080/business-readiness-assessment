/**
 * Email templates for Resend
 */

/**
 * Welcome email template (immediate after assessment)
 * @param {Object} data - Lead data
 * @returns {Object} Email configuration
 */
export function getWelcomeEmail(data) {
  const { fullName, assessmentScore, company } = data;
  
  const scoreCategory = 
    assessmentScore >= 80 ? 'Advanced' :
    assessmentScore >= 60 ? 'Intermediate' :
    assessmentScore >= 40 ? 'Developing' :
    'Foundation';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container { 
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      padding: 0;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .score-badge {
      display: inline-block;
      background: #667eea;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 25px;
      font-size: 18px;
      font-weight: 600;
      margin: 20px 0;
    }
    .cta-button {
      display: inline-block;
      background: #667eea;
      color: #ffffff;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      transition: background 0.3s;
    }
    .cta-button:hover {
      background: #764ba2;
    }
    .footer {
      background: #f8f8f8;
      padding: 30px;
      text-align: center;
      font-size: 13px;
      color: #666666;
    }
    .divider {
      border: 0;
      height: 1px;
      background: #e0e0e0;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You, ${fullName}!</h1>
      <p style="margin: 0; font-size: 16px; opacity: 0.95;">Your Business Readiness Assessment Results</p>
    </div>
    
    <div class="content">
      <p>Hi ${fullName},</p>
      
      <p>Thank you for completing the Business Transformation Readiness Assessment for ${company}.</p>
      
      <div style="text-align: center;">
        <div class="score-badge">
          Readiness Level: ${scoreCategory} (${assessmentScore}%)
        </div>
      </div>
      
      <p>Your assessment indicates that ${company} is at the <strong>${scoreCategory}</strong> stage of business transformation readiness. This is a valuable benchmark for understanding where you are and where you can go.</p>
      
      <hr class="divider">
      
      <h2 style="color: #667eea; font-size: 20px;">What's Next?</h2>
      
      <p>Over the next few days, we'll send you:</p>
      <ul style="line-height: 2;">
        <li><strong>Day 2:</strong> A detailed analysis of your readiness score and actionable insights</li>
        <li><strong>Day 5:</strong> Real-world case studies from companies at similar stages</li>
        <li><strong>Day 8:</strong> A customized roadmap to accelerate your transformation journey</li>
      </ul>
      
      <hr class="divider">
      
      <h2 style="color: #667eea; font-size: 20px;">Ready to Take Action?</h2>
      
      <p>If you'd like to discuss your results and explore how Inflection Advisory can help ${company} accelerate its transformation, we're here to help.</p>
      
      <div style="text-align: center;">
        <a href="mailto:justin@inflectionadvisory.com?subject=Business Readiness Assessment Follow-up" class="cta-button">
          Schedule a Consultation
        </a>
      </div>
      
      <p style="margin-top: 30px;">We look forward to supporting your transformation journey.</p>
      
      <p style="margin-top: 20px;">
        Best regards,<br>
        <strong>Justin Pher</strong><br>
        Partner, Inflection Advisory
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Inflection Advisory LLP</strong></p>
      <p>Transforming mid-market businesses through practical AI and operational excellence</p>
      <p style="margin-top: 15px; font-size: 12px; color: #999999;">
        You're receiving this email because you completed our Business Readiness Assessment.<br>
        If you'd prefer not to receive future emails, <a href="#" style="color: #667eea;">unsubscribe here</a>.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    from: 'Inflection Advisory <justin@inflectionadvisory.com>',
    to: [data.email],
    subject: `Your Business Readiness Assessment Results - ${scoreCategory} Level`,
    html: htmlContent,
  };
}

/**
 * Email 2: Detailed Analysis (Day 2)
 * @param {Object} data - Lead data
 * @returns {Object} Email configuration
 */
export function getAnalysisEmail(data) {
  const { fullName, assessmentScore, company } = data;
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container { 
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      padding: 0;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .content {
      padding: 40px 30px;
    }
    .insight-box {
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .cta-button {
      display: inline-block;
      background: #667eea;
      color: #ffffff;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background: #f8f8f8;
      padding: 30px;
      text-align: center;
      font-size: 13px;
      color: #666666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Deep Dive: Your Readiness Analysis</h1>
    </div>
    
    <div class="content">
      <p>Hi ${fullName},</p>
      
      <p>Following up on your assessment for ${company}, I wanted to share some specific insights based on your ${assessmentScore}% readiness score.</p>
      
      <h2 style="color: #667eea;">What Your Score Means</h2>
      
      <div class="insight-box">
        <h3 style="margin-top: 0; color: #333;">Key Findings:</h3>
        <p>Companies at your readiness level typically face three critical challenges:</p>
        <ol>
          <li><strong>Operational Fragmentation:</strong> Systems and processes that don't talk to each other</li>
          <li><strong>Data Utilization Gaps:</strong> Collecting data but not leveraging it for decisions</li>
          <li><strong>Change Management Resistance:</strong> Technology investment without organizational buy-in</li>
        </ol>
      </div>
      
      <p>The good news? These are exactly the areas where focused intervention creates outsized returns.</p>
      
      <h2 style="color: #667eea;">Actionable Next Steps</h2>
      
      <p>Based on working with similar organizations, here are three immediate actions that deliver measurable impact:</p>
      
      <ol style="line-height: 2;">
        <li><strong>Process Audit:</strong> Map your top 3 revenue-critical workflows to identify automation opportunities</li>
        <li><strong>Data Inventory:</strong> Catalog what data you collect vs. what decisions you need to make</li>
        <li><strong>Stakeholder Alignment:</strong> Create a transformation steering committee with cross-functional representation</li>
      </ol>
      
      <p>In our next email (Day 5), I'll share specific case studies from pharma and FMCG companies that moved from your current readiness level to measurable transformation outcomes.</p>
      
      <div style="text-align: center;">
        <a href="mailto:justin@inflectionadvisory.com?subject=Readiness Analysis Discussion" class="cta-button">
          Discuss Your Specific Situation
        </a>
      </div>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>Justin Pher</strong><br>
        Partner, Inflection Advisory
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Inflection Advisory LLP</strong></p>
      <p style="margin-top: 15px; font-size: 12px; color: #999999;">
        Email 2 of 3 in your Business Readiness Series<br>
        <a href="#" style="color: #667eea;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    from: 'Inflection Advisory <justin@inflectionadvisory.com>',
    to: [data.email],
    subject: `${company}: Deep Dive into Your Transformation Readiness`,
    html: htmlContent,
  };
}

/**
 * Email 3: Roadmap (Day 5)
 * @param {Object} data - Lead data
 * @returns {Object} Email configuration
 */
export function getRoadmapEmail(data) {
  const { fullName, company } = data;
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container { 
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      padding: 0;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .content {
      padding: 40px 30px;
    }
    .roadmap-phase {
      background: #f8f9fa;
      padding: 20px;
      margin: 15px 0;
      border-radius: 6px;
      border-left: 4px solid #667eea;
    }
    .cta-button {
      display: inline-block;
      background: #667eea;
      color: #ffffff;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background: #f8f8f8;
      padding: 30px;
      text-align: center;
      font-size: 13px;
      color: #666666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Customized Transformation Roadmap</h1>
    </div>
    
    <div class="content">
      <p>Hi ${fullName},</p>
      
      <p>For the final email in this series, I wanted to provide ${company} with a practical roadmap based on your assessment results and industry benchmarks.</p>
      
      <h2 style="color: #667eea;">90-Day Transformation Sprint</h2>
      
      <div class="roadmap-phase">
        <h3 style="margin-top: 0; color: #333;">Phase 1: Foundation (Days 1-30)</h3>
        <ul style="margin-bottom: 0;">
          <li>Complete operational process mapping</li>
          <li>Establish baseline metrics for key workflows</li>
          <li>Identify quick-win automation opportunities</li>
          <li>Secure executive sponsorship and budget allocation</li>
        </ul>
      </div>
      
      <div class="roadmap-phase">
        <h3 style="margin-top: 0; color: #333;">Phase 2: Pilot (Days 31-60)</h3>
        <ul style="margin-bottom: 0;">
          <li>Deploy pilot automation in one high-impact workflow</li>
          <li>Implement data collection and tracking infrastructure</li>
          <li>Train core team on new processes and tools</li>
          <li>Document results and build internal case study</li>
        </ul>
      </div>
      
      <div class="roadmap-phase">
        <h3 style="margin-top: 0; color: #333;">Phase 3: Scale (Days 61-90)</h3>
        <ul style="margin-bottom: 0;">
          <li>Expand successful pilots across departments</li>
          <li>Develop internal champions and change agents</li>
          <li>Create governance framework for ongoing optimization</li>
          <li>Plan next wave of transformation initiatives</li>
        </ul>
      </div>
      
      <h2 style="color: #667eea;">Expected Outcomes</h2>
      
      <p>Organizations that follow this phased approach typically see:</p>
      <ul>
        <li><strong>20-30% efficiency gains</strong> in piloted workflows</li>
        <li><strong>15-25% reduction</strong> in operational costs</li>
        <li><strong>2-3x faster</strong> decision-making cycles</li>
        <li><strong>Measurable ROI</strong> within the first 90 days</li>
      </ul>
      
      <h2 style="color: #667eea;">How Inflection Advisory Can Help</h2>
      
      <p>We specialize in guiding mid-market companies through exactly this type of transformation. Our approach combines:</p>
      <ul>
        <li>Deep operational expertise from seasoned P&L leaders</li>
        <li>Practical AI implementation (not theoretical consulting)</li>
        <li>Hands-on execution support (not just PowerPoint recommendations)</li>
        <li>Measurable results with accountability</li>
      </ul>
      
      <p><strong>Would you like to discuss how this roadmap applies specifically to ${company}?</strong></p>
      
      <div style="text-align: center;">
        <a href="mailto:justin@inflectionadvisory.com?subject=Transformation Roadmap Discussion" class="cta-button">
          Schedule a Strategy Session
        </a>
      </div>
      
      <p style="margin-top: 30px;">Looking forward to potentially working together.</p>
      
      <p style="margin-top: 20px;">
        Best regards,<br>
        <strong>Justin Pher</strong><br>
        Partner, Inflection Advisory
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Inflection Advisory LLP</strong></p>
      <p style="margin-top: 15px; font-size: 12px; color: #999999;">
        Final email in your Business Readiness Series<br>
        <a href="#" style="color: #667eea;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    from: 'Inflection Advisory <justin@inflectionadvisory.com>',
    to: [data.email],
    subject: `${company}: Your 90-Day Transformation Roadmap`,
    html: htmlContent,
  };
}
