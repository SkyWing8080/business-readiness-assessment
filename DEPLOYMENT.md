# Business Readiness Assessment - Deployment Guide

## Overview
Complete deployment guide for the Business Transformation Readiness Assessment app with Vercel Postgres and Resend email nurturing integration.

## Architecture
```
User completes assessment
    ↓
api/submit-results
    ├─ Saves to Vercel Postgres
    └─ Sends Email #1 (Welcome)
    ↓
Vercel Cron (daily at 9 AM SGT)
api/cron/send-emails
    ├─ Sends Email #2 (Day 4)
    └─ Sends Email #3 (Day 8)
```

## Prerequisites
✅ Vercel Postgres database "Neon-Sky-Wing" (already created)
✅ Resend API key: `re_fUkdDEgn_H1QuafAhcpdwoYDW2TZxaEG2`
✅ Sender email configured: `contact@inflection-advisory.com`

## Step-by-Step Deployment

### Step 1: Run Database Schema (5 minutes)

1. Go to Vercel Dashboard → Your Project → Storage tab
2. Click on "neon-sky-wing" database
3. Click "Open in Neon" (top right)
4. In Neon Console → Click "SQL Editor" (left sidebar)
5. Copy the contents of `schema.sql` file
6. Paste and click "Run Query"
7. You should see confirmation that the `leads` table was created

### Step 2: Add Environment Variables (5 minutes)

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these three variables:

| Key | Value | Environments |
|-----|-------|--------------|
| `RESEND_API_KEY` | `re_fUkdDEgn_H1QuafAhcpdwoYDW2TZxaEG2` | ✓ All |
| `CRON_SECRET` | (generate random 32+ char string) | ✓ All |
| `NEXT_PUBLIC_APP_URL` | `https://business-readiness-assessment.vercel.app` | ✓ All |

To generate CRON_SECRET, use this in terminal:
```bash
openssl rand -base64 32
```

### Step 3: Update Files in GitHub (10 minutes)

Replace/add these 10 files in your GitHub repository:

**New files to add:**
1. `schema.sql` (root directory)
2. `vercel.json` (root directory)
3. `api/submit-results/route.js`
4. `api/cron/send-emails/route.js`
5. `api/unsubscribe/route.js`
6. `emails/WelcomeEmail.jsx`
7. `emails/EducationalEmail.jsx`
8. `emails/ConversionEmail.jsx`

**Files to replace:**
9. `package.json` (updated with new dependencies)
10. `public/index.html` (updated with API integration - if needed)

### Step 4: Commit and Push to GitHub (2 minutes)

```bash
git add .
git commit -m "Add Postgres + Resend email nurture integration"
git push origin main
```

Vercel will automatically deploy (2-3 minutes).

### Step 5: Verify Deployment (5 minutes)

**Check 1: Deployment Status**
- Go to Vercel Dashboard → Deployments
- Wait for "Ready" status (green checkmark)

**Check 2: Test Form Submission**
1. Go to your live URL: https://business-readiness-assessment.vercel.app
2. Complete the assessment with YOUR email
3. Check your inbox for Email #1 (within 1 minute)

**Check 3: Verify Database Entry**
1. Go to Neon Console → SQL Editor
2. Run: `SELECT * FROM leads ORDER BY created_at DESC LIMIT 5;`
3. You should see your test entry with:
   - Your name, email, company
   - Assessment scores
   - `email_sequence_step = 1`
   - `last_email_sent_at` timestamp

**Check 4: Verify Cron Job**
1. Vercel Dashboard → Your Project → Cron
2. You should see: `/api/cron/send-emails` scheduled for "0 1 * * *"
3. Status should be "Active"

### Step 6: Clean Up Test Data (1 minute)

After confirming everything works, remove your test entry:

In Neon Console → SQL Editor:
```sql
DELETE FROM leads WHERE email = 'your-test-email@example.com';
```

## Email Sequence Timeline

| Day | Email | Subject | Content | Trigger |
|-----|-------|---------|---------|---------|
| 0 | Welcome | "advice from operators who've been in your shoes" | Readiness results + operator credibility | Form submission |
| 4 | Educational | "Three questions every business leader should ask" | Strategic questions framework | Cron job |
| 8 | Conversion | "ready to discuss your transformation roadmap?" | Discovery call CTA | Cron job |

## Cron Job Schedule

The cron job runs daily at **9 AM Singapore Time (SGT)** which is 1 AM UTC.

Schedule: `0 1 * * *`
- `0` = minute (top of the hour)
- `1` = hour (1 AM UTC = 9 AM SGT)
- `*` = every day of month
- `*` = every month
- `*` = every day of week

## Monitoring & Management

### View All Leads
Neon Console → SQL Editor:
```sql
SELECT 
  name, 
  email, 
  company, 
  percentage, 
  email_sequence_step,
  created_at
FROM leads
ORDER BY created_at DESC;
```

### Check Email Sequence Status
```sql
-- Leads awaiting Email #2 (Day 4)
SELECT COUNT(*) FROM leads
WHERE email_sequence_step = 1
  AND last_email_sent_at <= NOW() - INTERVAL '4 days'
  AND unsubscribed = false;

-- Leads awaiting Email #3 (Day 8)
SELECT COUNT(*) FROM leads
WHERE email_sequence_step = 2
  AND last_email_sent_at <= NOW() - INTERVAL '4 days'
  AND unsubscribed = false;

-- Sequence complete
SELECT COUNT(*) FROM leads
WHERE email_sequence_step = 3;
```

### View Cron Job Logs
Vercel Dashboard → Your Project → Logs → Filter by `/api/cron/send-emails`

### Resend Email Dashboard
Check email delivery status at: https://resend.com/emails

## Troubleshooting

### Issue: Emails not sending
**Check:**
1. RESEND_API_KEY environment variable is set correctly
2. Sender email `contact@inflection-advisory.com` is verified in Resend
3. Check Resend dashboard for error messages

### Issue: Cron job not running
**Check:**
1. CRON_SECRET environment variable is set
2. Vercel Dashboard → Cron shows job as "Active"
3. Check function logs for errors

### Issue: Database connection errors
**Check:**
1. Vercel Postgres connection strings are auto-configured
2. Database is in same region as your app
3. Check Neon Console for database status

### Issue: Form submission fails
**Check:**
1. Browser console for errors
2. Vercel function logs
3. Database table exists (run schema.sql again if needed)

## Security Notes

- `CRON_SECRET` prevents unauthorized cron job triggers
- `RESEND_API_KEY` is server-side only (never exposed to client)
- Postgres credentials auto-managed by Vercel
- Unsubscribe links are tokenized by email address

## What Happens Next

After deployment:
1. ✅ Users complete assessment → Email #1 sent immediately
2. ✅ Day 4 → Cron job sends Email #2
3. ✅ Day 8 → Cron job sends Email #3
4. ✅ Sequence complete (email_sequence_step = 3)

## Cost

Everything on free tiers:
- **Vercel Postgres**: Free tier (60 compute hours/month)
- **Resend**: Free tier (3,000 emails/month = 750 assessments)
- **Vercel Cron**: Included free
- **Total**: $0/month (for moderate traffic)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Resend dashboard
3. Check Neon Console database logs
4. Review this guide

## Next Steps

Once deployed and tested:
1. Remove test data from database
2. Monitor first few real submissions
3. Check email deliverability (inbox vs. spam)
4. Adjust email copy if needed
5. Scale as traffic grows

---

**Deployment Date**: December 2025  
**Version**: 1.0  
**Status**: Ready for production
