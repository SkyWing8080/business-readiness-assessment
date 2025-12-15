# Business Transformation Readiness Assessment

Lead magnet assessment app for Inflection Advisory.

## Current Setup

✅ **Vercel Analytics** - Enable in Vercel Dashboard
- Go to: Vercel Dashboard → Your Project → Analytics tab
- Click "Enable Analytics"
- That's it! No code changes needed.

## Features

- 15-question assessment across 5 dimensions
- Instant scoring and personalized results
- Lead capture (name, company, email, phone)
- Email CTA for consultation scheduling
- Fully responsive design
- Scroll-to-top on page transitions

## Adding Google Analytics Later

When you have your GA4 Measurement ID (format: G-XXXXXXXXXX):

1. Open `index.html`
2. Find the `</head>` tag (around line 9)
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
5. Commit and push to GitHub (Vercel auto-deploys)

## Adding Microsoft Clarity Later

When you have your Clarity Project ID (format: XXXXXXXXXX):

1. Open `index.html`
2. Find the `</head>` tag (around line 9)
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
5. Commit and push to GitHub (Vercel auto-deploys)

## Deployment

This project is deployed via GitHub + Vercel auto-deploy:

- **GitHub Repo:** https://github.com/SkyWing8080/business-readiness-assessment
- **Live URL:** https://business-readiness-assessment-xxx.vercel.app

### To Update:
1. Make changes to files
2. Commit in GitHub Desktop
3. Push to GitHub
4. Vercel auto-deploys in 2-3 minutes

## Project Structure

```
business-readiness-assessment/
├── index.html        # Main assessment application
├── vercel.json       # Vercel configuration (security headers)
├── package.json      # Project metadata
└── README.md         # This file
```

## Next Steps

1. ✅ Enable Vercel Analytics in dashboard
2. ⏳ Test the assessment flow thoroughly
3. ⏳ Add Google Analytics ID (when ready)
4. ⏳ Add Microsoft Clarity ID (when ready)
5. ⏳ Share URL with Praveen for WordPress integration
6. ⏳ Add Postgres database for lead storage
7. ⏳ Add Resend for email automation

## Contact

Email: contact@inflection-advisory.com
