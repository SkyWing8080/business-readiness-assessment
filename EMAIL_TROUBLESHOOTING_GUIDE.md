# EMAIL TROUBLESHOOTING GUIDE

## Issues Fixed in This Update

### 1. React Email Components Not Rendering
**Problem**: Original code used `react: Component` but Resend needs `html: render(Component)`

**Fixed Files**:
- `api/submit-results/route.js` - Now imports and uses `render()` from `@react-email/render`
- `api/cron/send-emails/route.js` - Now imports and uses `render()` for both emails

**Before**:
```javascript
await resend.emails.send({
  from: '...',
  to: email,
  subject: '...',
  react: WelcomeEmail({ name, percentage }) // ❌ Wrong
});
```

**After**:
```javascript
const emailHtml = render(WelcomeEmail({ name, email, percentage }));
await resend.emails.send({
  from: '...',
  to: email,
  subject: '...',
  html: emailHtml // ✅ Correct
});
```

### 2. Unsubscribe Links Using Placeholder
**Problem**: All email templates had `{{email}}` placeholder instead of actual email

**Fixed Files**:
- `emails/WelcomeEmail.jsx` - Now accepts `email` prop and uses it
- `emails/EducationalEmail.jsx` - Now accepts `email` prop and uses it
- `emails/ConversionEmail.jsx` - Now accepts `email` prop and uses it

---

## Deployment Steps

1. **Update GitHub**:
   ```bash
   cd business-readiness-assessment
   git add .
   git commit -m "Fix: Render React emails to HTML and fix unsubscribe links"
   git push origin main
   ```

2. **Vercel Auto-Deploy**: Wait 2-3 minutes for automatic deployment

3. **Verify Environment Variables** in Vercel Dashboard:
   - `RESEND_API_KEY` = re_fUkdDEgn_H1QuafAhcpdwoYDW2TZxaEG2
   - `CRON_SECRET` = (your secret)
   - `NEXT_PUBLIC_APP_URL` = https://business-readiness-assessment.vercel.app

---

## Testing Checklist

### Test 1: Verify Form Submission Works
1. Go to your live app: https://business-readiness-assessment.vercel.app
2. Complete the assessment with YOUR email
3. Submit the form
4. **Expected**: You see success message + results page

### Test 2: Check Database Entry
Run this query in Neon Console:
```sql
SELECT 
  name, 
  email, 
  percentage, 
  email_sequence_step, 
  last_email_sent_at,
  created_at
FROM leads
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Results**:
- Your entry appears
- `email_sequence_step` = 1
- `last_email_sent_at` = recent timestamp

### Test 3: Check Resend Dashboard
1. Go to https://resend.com/emails
2. Look for email sent to your address
3. **If you see it**: Click to view details (status, opens, clicks)
4. **If you don't see it**: Email failed to send (see troubleshooting below)

### Test 4: Check Your Inbox
1. Check your email inbox (including spam/promotions folder)
2. **Expected**: Email #1 with subject "YourName, advice from operators who've been in your shoes"
3. Verify:
   - Your first name appears correctly
   - Readiness percentage shows correctly
   - Dimensional scores are accurate
   - Unsubscribe link exists and works

---

## Common Issues & Solutions

### Issue 1: No Email Received

#### Cause A: Resend API Key Not Set
**Check**: Vercel Dashboard → Settings → Environment Variables → `RESEND_API_KEY`

**Solution**:
```
RESEND_API_KEY=re_fUkdDEgn_H1QuafAhcpdwoYDW2TZxaEG2
```
Then redeploy.

#### Cause B: Sender Domain Not Verified
**Check**: Go to https://resend.com/domains

**If using custom domain** (contact@inflection-advisory.com):
1. Domain must be verified in Resend
2. DNS records must be added (SPF, DKIM, DMARC)
3. Verification can take up to 48 hours

**Quick Fix**: Use Resend's default sender temporarily:
In `api/submit-results/route.js` line 92, change:
```javascript
from: 'onboarding@resend.dev', // Temporary - works immediately
```

#### Cause C: API Call Failed Silently
**Check Vercel Logs**:
1. Vercel Dashboard → Your Project → Logs
2. Filter by `/api/submit-results`
3. Look for errors with keyword "resend" or "email"

Common errors:
- `401 Unauthorized` = Wrong API key
- `403 Forbidden` = Domain not verified
- `422 Unprocessable Entity` = Invalid email format

#### Cause D: Frontend Not Calling API
**Check browser console** (F12 → Console tab):
1. Submit assessment
2. Look for network errors
3. Check if `/api/submit-results` was called

**Test API directly**:
```bash
curl -X POST https://business-readiness-assessment.vercel.app/api/submit-results \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your-email@example.com",
    "company": "Test Co",
    "phone": "",
    "scores": {
      "data": 8,
      "process": 6,
      "team": 7,
      "strategic": 9,
      "change": 10
    }
  }'
```

**Expected response**:
```json
{
  "success": true,
  "leadId": 123,
  "results": { ... }
}
```

---

### Issue 2: Email #2 and #3 Not Sending

#### Cause A: Cron Job Not Running
**Check**: Vercel Dashboard → Your Project → Cron Jobs

**Expected**:
- Path: `/api/cron/send-emails`
- Schedule: `0 1 * * *` (daily at 1 AM UTC = 9 AM SGT)
- Last Run: Recent timestamp
- Status: Success

**If missing**: Add `vercel.json` to your repo root:
```json
{
  "crons": [{
    "path": "/api/cron/send-emails",
    "schedule": "0 1 * * *"
  }]
}
```

#### Cause B: Not Enough Time Passed
Email #2 sends 4 days after Email #1.

**Check timing**:
```sql
SELECT 
  email,
  email_sequence_step,
  last_email_sent_at,
  NOW() - last_email_sent_at AS time_since_last_email
FROM leads
WHERE email_sequence_step = 1
  AND unsubscribed = false;
```

**If `time_since_last_email` < 4 days**: Wait longer

**To test immediately** (temporary):
```sql
-- ⚠️ Testing only - manually trigger Email #2
UPDATE leads
SET last_email_sent_at = NOW() - INTERVAL '5 days'
WHERE email = 'your-test-email@example.com'
  AND email_sequence_step = 1;
```

Then wait for next cron run or manually trigger:
```bash
curl https://business-readiness-assessment.vercel.app/api/cron/send-emails \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

#### Cause C: CRON_SECRET Not Set
**Check**: Vercel Dashboard → Settings → Environment Variables → `CRON_SECRET`

**If missing**:
```bash
# Generate a secure secret
openssl rand -base64 32
```

Add to Vercel environment variables, then redeploy.

---

### Issue 3: Emails Going to Spam

#### Solution 1: Verify Sender Domain
In Resend Dashboard:
1. Add DNS records (SPF, DKIM, DMARC)
2. Wait for verification (can take 24-48 hours)
3. Send test email after verification

#### Solution 2: Improve Email Content
- Avoid spam trigger words: "Free", "Act now", "Limited time"
- Include physical address in footer
- Ensure unsubscribe link works
- Use recipient's name (already doing this ✓)

#### Solution 3: Warm Up Sender Reputation
- Start with small batches (5-10 emails/day)
- Gradually increase volume over 2-3 weeks
- Monitor bounce rates and spam complaints

---

## Manual Testing Commands

### Test Email #1 (Immediate)
```bash
curl -X POST https://business-readiness-assessment.vercel.app/api/submit-results \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "YOUR_EMAIL@example.com",
    "company": "Test Company",
    "phone": "+65-1234-5678",
    "scores": {
      "data": 10,
      "process": 8,
      "team": 9,
      "strategic": 11,
      "change": 12
    }
  }'
```

### Test Cron Job Manually
```bash
curl https://business-readiness-assessment.vercel.app/api/cron/send-emails \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Expected response**:
```json
{
  "success": true,
  "summary": {
    "email2Sent": 0,
    "email3Sent": 0,
    "totalSent": 0,
    "errors": 0
  },
  "errors": []
}
```

### Check Specific Lead Status
```sql
SELECT 
  id,
  name,
  email,
  percentage,
  readiness_level,
  email_sequence_step,
  last_email_sent_at,
  unsubscribed,
  created_at,
  CASE 
    WHEN email_sequence_step = 0 THEN 'Not started'
    WHEN email_sequence_step = 1 THEN 'Awaiting Email #2 (Day 4)'
    WHEN email_sequence_step = 2 THEN 'Awaiting Email #3 (Day 8)'
    WHEN email_sequence_step = 3 THEN 'Sequence complete'
  END AS status_description,
  CASE
    WHEN email_sequence_step = 1 AND last_email_sent_at <= NOW() - INTERVAL '4 days' 
      THEN 'Ready for Email #2'
    WHEN email_sequence_step = 2 AND last_email_sent_at <= NOW() - INTERVAL '4 days' 
      THEN 'Ready for Email #3'
    ELSE 'Waiting'
  END AS next_email_status
FROM leads
WHERE email = 'YOUR_EMAIL@example.com';
```

---

## Quick Diagnostic Script

Run this to get full status:

```sql
-- Overview
SELECT 
  COUNT(*) AS total_leads,
  COUNT(*) FILTER (WHERE email_sequence_step = 0) AS not_started,
  COUNT(*) FILTER (WHERE email_sequence_step = 1) AS awaiting_email_2,
  COUNT(*) FILTER (WHERE email_sequence_step = 2) AS awaiting_email_3,
  COUNT(*) FILTER (WHERE email_sequence_step = 3) AS completed,
  COUNT(*) FILTER (WHERE unsubscribed = true) AS unsubscribed
FROM leads;

-- Ready to send now
SELECT 
  COUNT(*) FILTER (
    WHERE email_sequence_step = 1 
    AND last_email_sent_at <= NOW() - INTERVAL '4 days'
    AND unsubscribed = false
  ) AS ready_for_email_2,
  COUNT(*) FILTER (
    WHERE email_sequence_step = 2 
    AND last_email_sent_at <= NOW() - INTERVAL '4 days'
    AND unsubscribed = false
  ) AS ready_for_email_3
FROM leads;
```

---

## Next Steps After Deployment

1. ✅ Update GitHub with fixed files
2. ✅ Verify deployment succeeded (green check in Vercel)
3. ✅ Confirm environment variables are set
4. ✅ Test with your own email
5. ✅ Check Resend dashboard for sent email
6. ✅ Verify email arrives in inbox
7. ✅ Test unsubscribe link works
8. ✅ Delete test data from database
9. ✅ Monitor Vercel logs for any errors

---

## Support Resources

- **Resend Docs**: https://resend.com/docs
- **Resend Status**: https://status.resend.com
- **Vercel Logs**: Dashboard → Your Project → Logs
- **Neon Console**: https://console.neon.tech

---

## If Still Not Working

Provide me with:
1. **Resend Dashboard** screenshot (showing sent emails or lack thereof)
2. **Vercel Logs** screenshot (filtered for `/api/submit-results`)
3. **Neon Query Result** of: `SELECT * FROM leads ORDER BY created_at DESC LIMIT 1`
4. **Browser Console** screenshot when submitting assessment

This will help diagnose the exact issue.
