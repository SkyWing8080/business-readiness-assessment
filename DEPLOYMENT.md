# Deployment Instructions for Business Readiness Assessment

## Quick Deployment (Recommended - 5 Minutes)

### Option 1: Vercel CLI Deployment

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to project directory**:
   ```bash
   cd business-readiness-assessment
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   
   First deployment will ask:
   - Set up and deploy? **Yes**
   - Which scope? Select **SkyWing's projects**
   - Link to existing project? **No**
   - What's your project's name? **business-readiness-assessment** (or press enter)
   - In which directory is your code located? **./** (press enter)
   
4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

5. **Done!** Your URL will be displayed: `https://business-readiness-assessment-xxx.vercel.app`

---

### Option 2: Vercel Dashboard Deployment (Drag & Drop)

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Select "SkyWing's projects" team
3. Click "Browse" or drag the `business-readiness-assessment` folder
4. Click "Deploy"
5. Done! URL will be provided after deployment

---

### Option 3: GitHub Integration (Automatic Deployments)

1. **Create GitHub repository**:
   - Go to GitHub → New Repository
   - Name: `business-readiness-assessment`
   - Create repository

2. **Push code to GitHub**:
   ```bash
   cd business-readiness-assessment
   git remote add origin https://github.com/YOUR-USERNAME/business-readiness-assessment.git
   git branch -M main
   git push -u origin main
   ```

3. **Import to Vercel**:
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Select "Import Git Repository"
   - Select your repository
   - Click "Deploy"

4. **Future updates**: Just push to GitHub and Vercel auto-deploys!

---

## Verifying Analytics Setup

After deployment:

1. **Check Vercel Analytics**:
   - Go to Vercel Dashboard
   - Select your project
   - Click "Analytics" tab
   - You should see "Analytics Enabled"

2. **Test the assessment**:
   - Visit your deployed URL
   - Complete the assessment
   - Check Analytics dashboard for visitor data

---

## Adding Google Analytics Later

When you have your GA4 Measurement ID (format: G-XXXXXXXXXX):

1. Open `index.html`
2. Find line ~9 where `</head>` tag is located
3. Add this code BEFORE `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
<!-- End Google Analytics -->
```

4. Replace both instances of `G-XXXXXXXXXX` with your actual ID
5. Redeploy: `vercel --prod` (or push to GitHub if using git integration)

---

## Adding Microsoft Clarity Later

When you have your Clarity Project ID (format: XXXXXXXXXX):

1. Open `index.html`
2. Find line ~9 where `</head>` tag is located
3. Add this code BEFORE `</head>`:

```html
<!-- Microsoft Clarity -->
<script type="text/javascript">
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "XXXXXXXXXX");
</script>
<!-- End Microsoft Clarity -->
```

4. Replace `XXXXXXXXXX` with your actual Clarity Project ID
5. Redeploy: `vercel --prod`

---

## Custom Domain Setup (Optional)

If you want to use a custom domain like `assessment.inflection-advisory.com`:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Configure DNS records as instructed by Vercel:
   - Type: CNAME
   - Name: assessment (or @)
   - Value: cname.vercel-dns.com

---

## Environment Variables (For Future Database Integration)

When you're ready to add Postgres + Resend:

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add:
   - `POSTGRES_URL` - From Vercel Postgres
   - `RESEND_API_KEY` - From Resend.com

---

## Troubleshooting

**Issue**: "Command not found: vercel"
- **Solution**: Install Vercel CLI: `npm install -g vercel`

**Issue**: Deployment fails
- **Solution**: Check that `index.html` exists in root directory

**Issue**: Analytics not showing data
- **Solution**: Wait 24 hours for first data, Vercel Analytics has delay

**Issue**: Custom domain not working
- **Solution**: Wait 24-48 hours for DNS propagation

---

## Project Structure

```
business-readiness-assessment/
├── index.html        # Main assessment application (48KB)
├── vercel.json       # Vercel config with Analytics enabled
├── package.json      # Project metadata
├── README.md         # Documentation
└── .git/            # Git repository (if using git)
```

---

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Analytics**: https://vercel.com/docs/analytics
- **Project Contact**: contact@inflection-advisory.com

---

## Next Steps After Deployment

1. ✅ Deploy to Vercel (you are here)
2. ✅ Test the assessment flow
3. ✅ Verify Vercel Analytics tracking
4. ⏳ Add to WordPress via URL link
5. ⏳ Test lead capture (check responses come through)
6. ⏳ Add Postgres database for lead storage
7. ⏳ Add Resend for email automation
8. ⏳ Add Google Analytics (when you have ID)
9. ⏳ Add Microsoft Clarity (when you have ID)

---

## Quick Reference

**Deploy**: `vercel --prod`
**Update**: Make changes → `vercel --prod`
**View Logs**: Vercel Dashboard → Deployments → Select deployment → Logs
**Analytics**: Vercel Dashboard → Project → Analytics
