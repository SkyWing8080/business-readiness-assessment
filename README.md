# Business Transformation Readiness Assessment

Lead magnet assessment app for Inflection Advisory.

## Current Analytics Setup

✅ **Vercel Analytics** - Enabled and active
- Tracks page views, user interactions, performance metrics
- Access via Vercel Dashboard → Analytics tab

## Adding Google Analytics (Later)

When you have your Google Analytics 4 ID:

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

4. Replace `G-XXXXXXXXXX` with your actual GA4 Measurement ID
5. Redeploy to Vercel

## Adding Microsoft Clarity (Later)

When you have your Microsoft Clarity Project ID:

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
5. Redeploy to Vercel

## Deployment

This project is deployed to Vercel. To redeploy after changes:

```bash
vercel --prod
```

Or use the Vercel GitHub integration for automatic deployments.

## Project Structure

```
business-readiness-assessment/
├── index.html        # Main assessment application
├── vercel.json       # Vercel configuration
├── package.json      # Project metadata
└── README.md         # This file
```

## Features

- 15-question assessment across 5 dimensions
- Instant scoring and personalized results
- Lead capture (name, company, email, phone)
- Email CTA for consultation scheduling
- Fully responsive design
- Vercel Analytics tracking

## Contact

Email: contact@inflection-advisory.com
