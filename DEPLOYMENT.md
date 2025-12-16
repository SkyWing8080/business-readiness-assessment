# Deployment Guide: Business Readiness Assessment with Postgres + Resend

## Overview
This guide will help you deploy your assessment app with:
- ✅ Vercel Postgres database (stores all leads)
- ✅ Resend email service (automated 3-email nurture sequence)
- ✅ Automated cron job (sends emails daily at 9 AM SGT)
- ✅ Complete tracking and analytics

**Estimated setup time: 30 minutes**

---

## Step 1: Update Your Vercel Project (5 minutes)

### 1.1 Replace Files in Your GitHub Repo

Copy all files from this deployment package to your existing `business-readiness-assessment` repository:

```
business-readiness-assessment/
├── api/
│   ├── submit-results/
│   │   └── route.js              [NEW]
│   ├── cron/
│   │   └── send-emails/
│   │       └── route.js          [NEW]
│   └── unsubscribe/
│       └── route.js               [NEW]
├── emails/
│   ├── WelcomeEmail.jsx           [NEW]
│   ├── EducationalEmail.jsx       [NEW]
│   └── ConversionEmail.jsx        [NEW]
├── public/
│   └── index.html                 [REPLACE - Updated with API integration]
├── package.json                   [REPLACE]
├── vercel.json                    [NEW]
└── schema.sql                     [NEW - For reference]
```

### 1.2 Commit and Push to GitHub

```bash
cd business-readiness-assessment
git add .
git commit -m "Add Postgres + Resend email nurture integration"
git push origin main
```

Vercel will auto-deploy, but it won't work yet - we need to set up the database and environment variables first.

---

## Step 2: Create Vercel Postgres Database (5 minutes)

### 2.1 Create Database

1. Go to https://vercel.com/dashboard
2. Select your `business-readiness-assessment` project
3. Click **Storage** tab (left sidebar)
4. Click **Create Database**
5. Select **Postgres**
6. Name it: `assessment-leads`
7. Choose region: **Singapore** (closest to target users)
8. Click **Create**

✅ Environment variables are auto-added to your project

### 2.2 Initialize Database Schema

1. In Vercel Dashboard → Storage → `assessment-leads`
2. Click **`.sql` Query** tab
3. Copy the contents of `schema.sql` file
4. Paste into the query editor
5. Click **Run Query**

✅ Your `leads` table is now created with all necessary indexes

---

## Step 3: Configure Environment Variables (5 minutes)

### 3.1 Add Resend API Key

1. In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add new variable:
   - **Key**: `RESEND_API_KEY`
   - **Value**: `re_fUkdDEgn_H1QuafAhcpdwoYDW2TZxaEG2`
   - **Environments**: Check all (Production, Preview, Development)
3. Click **Save**

### 3.2 Add Cron Secret (Security)

Generate a random secret for cron job authentication:

```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use any random string generator
```

1. In Environment Variables, add:
   - **Key**: `CRON_SECRET`
   - **Value**: `[your-generated-random-string]`
   - **Environments**: Check all
2. Click **Save**

---

## Step 4: Verify Domain Authentication (Already Done)

Your Resend sender email `contact@inflection-advisory.com` should already be verified.

To check:
1. Go to https://resend.com/domains
2. Verify `inflection-advisory.com` shows ✅ Verified

If not verified, follow Resend's DNS setup instructions.

---

## Step 5: Enable Vercel Cron (2 minutes)

### 5.1 Verify Cron Configuration

Your `vercel.json` file contains:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-emails",
      "schedule": "0 1 * * *"
    }
  ]
}
```

This runs daily at:
- **1:00 AM UTC** = **9:00 AM Singapore Time (UTC+8)**

### 5.2 Deploy to Activate Cron

1. In Vercel Dashboard → Your Project → **Deployments**
2. Click **⋯** on latest deployment → **Redeploy**
3. Wait for deployment to complete (~2 minutes)

✅ Cron job is now active and will run daily at 9 AM SGT

---

## Step 6: Test the Complete Flow (10 minutes)

### 6.1 Test Assessment Submission

1. Go to your live URL: `https://business-readiness-assessment.vercel.app`
2. Fill out the contact form with YOUR email
3. Complete the assessment
4. **Check your email within 1 minute** - you should receive Email #1 (Welcome)

### 6.2 Verify Database Entry

1. Vercel Dashboard → Storage → `assessment-leads`
2. Click **Data** tab
3. Click **Browse Data**
4. You should see your test entry with:
   - Your name, email, company
   - Assessment scores
   - `email_sequence_step = 1`
   - `last_email_sent_at = [current timestamp]`

### 6.3 Test Unsubscribe (Optional)

1. Open the welcome email you received
2. Click the **Unsubscribe** link at the bottom
3. You should see a confirmation page
4. Check database - your record should show `unsubscribed = TRUE`

### 6.4 Manually Test Cron Job (Optional)

To test without waiting for 9 AM:

1. Go to: `https://business-readiness-assessment.vercel.app/api/cron/send-emails`
2. You'll see: `401 Unauthorized` (expected - needs auth header)
3. To properly test, use this curl command (replace with your CRON_SECRET):

```bash
curl -X GET \
  'https://business-readiness-assessment.vercel.app/api/cron/send-emails' \
  -H 'Authorization: Bearer YOUR_CRON_SECRET'
```

This will immediately check for any leads ready for Email #2 or #3 and send them.

---

## Step 7: Monitor & Manage (Ongoing)

### View All Leads

1. Vercel Dashboard → Storage → `assessment-leads` → Data tab
2. Browse all submissions with scores and email status
3. Export to CSV if needed

### Check Email Logs

1. Go to https://resend.com/emails
2. View all sent emails, delivery status, open rates
3. Filter by recipient to track individual lead engagement

### Cron Job Logs

1. Vercel Dashboard → Your Project → **Logs** tab
2. Filter by: `/api/cron/send-emails`
3. View execution logs every day at 9 AM

---

## How the System Works

### Email Sequence Timeline

**Day 0 (Immediate):**
- User completes assessment
- Data saved to Postgres (`email_sequence_step = 1`)
- Email #1 (Welcome) sent immediately via Resend

**Day 4:**
- Cron job runs at 9 AM SGT
- Finds leads where `email_sequence_step = 1` AND `last_email_sent_at` is 4+ days ago
- Sends Email #2 (Educational - 3 Questions Framework)
- Updates: `email_sequence_step = 2`, `last_email_sent_at = NOW()`

**Day 8:**
- Cron job runs at 9 AM SGT
- Finds leads where `email_sequence_step = 2` AND `last_email_sent_at` is 4+ days ago
- Sends Email #3 (Conversion - Schedule Call CTA)
- Updates: `email_sequence_step = 3` (sequence complete)

### Database Schema

```sql
leads table:
- id, email (unique), name, company, phone
- total_score, percentage, readiness_level
- data_score, process_score, team_score, strategic_score, change_score
- email_sequence_step (0-3)
- last_email_sent_at
- unsubscribed (boolean)
- created_at, updated_at
```

---

## Troubleshooting

### Emails Not Sending

1. **Check Resend API Key:**
   - Vercel Dashboard → Settings → Environment Variables
   - Verify `RESEND_API_KEY` is set correctly

2. **Check Resend Domain:**
   - Go to https://resend.com/domains
   - Ensure `inflection-advisory.com` is verified

3. **Check Logs:**
   - Vercel Dashboard → Logs
   - Look for errors in `/api/submit-results`

### Database Connection Errors

1. **Verify Postgres is Running:**
   - Vercel Dashboard → Storage
   - Ensure `assessment-leads` database shows as Active

2. **Check Environment Variables:**
   - Settings → Environment Variables
   - Verify all `POSTGRES_*` variables are present (auto-added)

### Cron Job Not Running

1. **Check vercel.json:**
   - Ensure `vercel.json` exists in root directory
   - Verify cron schedule format

2. **Force Redeploy:**
   - Deployments tab → Redeploy latest
   - Cron jobs activate after deployment

3. **Check Cron Logs:**
   - Logs tab → Filter: `/api/cron/send-emails`
   - Verify execution at expected times

---

## Cost Summary

**Current Setup (Everything FREE):**

| Service | Plan | Cost | Usage Limits |
|---------|------|------|--------------|
| Vercel Hosting | Hobby | $0 | Unlimited |
| Vercel Postgres | Free Tier | $0 | 256 MB, 60 compute hours/month |
| Resend Email | Free Tier | $0 | 3,000 emails/month |
| Vercel Cron | Included | $0 | Daily jobs included |

**Projected Usage (100 assessments/month):**
- Database: ~10 MB used (~4% of limit)
- Emails: 400 sent (Email #1 + #2 + #3 + unsubscribes) (~13% of limit)
- **Total Cost: $0/month**

**At what point do you need to upgrade?**
- **750+ assessments/month** → Exceed Resend free tier (3,000 emails)
- **Database never** → 256 MB handles 100,000+ records

---

## What Users Experience

### Day 0 - Assessment Completion
- Complete assessment on your site
- See results on screen immediately
- Receive Email #1 within 1 minute (Welcome + Credibility)

### Day 4
- Receive Email #2 at 9 AM SGT (Educational - 3 Strategic Questions)

### Day 8
- Receive Email #3 at 9 AM SGT (Conversion - Book Discovery Call)

### Anytime
- Can unsubscribe with one click
- Can reply to any email to start conversation

---

## Next Steps

✅ **Your system is now live!**

### For Real Production Use:

1. **Remove Test Data:**
   ```sql
   DELETE FROM leads WHERE email = 'your-test-email@example.com';
   ```

2. **Monitor First Week:**
   - Check daily at 9 AM if cron executed
   - Review Resend dashboard for delivery rates
   - Watch for any error logs

3. **Promote Your Assessment:**
   - Share URL: `https://business-readiness-assessment.vercel.app`
   - Add to your website
   - Include in LinkedIn posts
   - Use in email signatures

4. **Weekly Review:**
   - Check database for new leads
   - Review email engagement in Resend
   - Respond to any replies manually

---

## Support

**If something isn't working:**

1. Check logs in Vercel Dashboard
2. Verify all environment variables are set
3. Test with your own email first
4. Review Resend email logs for delivery issues

**Common Issues:**
- **401 errors** → Check API keys in environment variables
- **Database errors** → Verify Postgres is running and schema is initialized
- **No emails** → Check Resend domain verification and API key

---

**Deployment Date:** December 16, 2025  
**Version:** 1.0  
**Configured By:** Claude (for Justin Pher - Inflection Advisory)
