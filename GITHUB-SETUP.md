# GitHub + Vercel Auto-Deploy Setup
## One-Time Setup (5 minutes)

## Quick Option: Automated Script

Run this from the project directory:
```bash
cd business-readiness-assessment
./setup-auto-deploy.sh
```

This will:
1. Create GitHub repository
2. Push code to GitHub
3. Give you Vercel import link

---

## Manual Option: Step-by-Step

### Step 1: Create GitHub Repository

**Option A: Via GitHub Website**
1. Go to https://github.com/new
2. Repository name: `business-readiness-assessment`
3. Public repository
4. Don't initialize with README (we already have files)
5. Click "Create repository"

**Option B: Via GitHub CLI**
```bash
gh repo create business-readiness-assessment --public
```

### Step 2: Push Code to GitHub

Copy the commands from GitHub's "push an existing repository" section, or use these:

```bash
cd business-readiness-assessment
git remote add origin https://github.com/YOUR-USERNAME/business-readiness-assessment.git
git branch -M main
git push -u origin main
```

**Replace YOUR-USERNAME with your actual GitHub username!**

### Step 3: Import to Vercel

1. Go to https://vercel.com/new
2. Select **"Import Git Repository"**
3. Find and select `business-readiness-assessment`
4. Click **"Import"**
5. Vercel will auto-detect settings from `vercel.json`
6. Click **"Deploy"**

### Step 4: Verify

✅ Check your deployment URL: `https://business-readiness-assessment-xxx.vercel.app`
✅ Vercel Analytics should be enabled automatically
✅ Test the assessment flow

---

## After This Setup

### Future Updates Are Automated:

**You say to Claude:**
> "Update business-readiness-assessment: change the intro text to say X"

**Claude will:**
1. Update the code
2. Push to GitHub (via MCP)
3. Vercel auto-deploys
4. Give you the live URL

**Or you can update manually:**
```bash
# Make changes to index.html
git add .
git commit -m "Update intro text"
git push
# Vercel auto-deploys in 2-3 minutes
```

---

## Troubleshooting

**Issue**: "Permission denied" when pushing to GitHub
- **Fix**: Make sure you've authenticated with GitHub
- Run: `gh auth login` or set up SSH keys

**Issue**: Can't find repository in Vercel import
- **Fix**: Refresh the page, or manually add GitHub connection in Vercel settings

**Issue**: Deployment fails
- **Fix**: Check build logs in Vercel dashboard for error details

---

## What's Configured

✅ **Vercel Analytics** - Enabled in `vercel.json`
✅ **Security Headers** - XSS protection, frame options
✅ **Auto-scaling** - Handles traffic spikes automatically
✅ **HTTPS** - Automatic SSL certificate
✅ **Global CDN** - Fast loading worldwide

---

## Next Steps After Deployment

1. ✅ Test assessment at your Vercel URL
2. ✅ Check Vercel Analytics dashboard
3. ⏳ Add Google Analytics ID (when ready)
4. ⏳ Add Microsoft Clarity ID (when ready)
5. ⏳ Share URL with Praveen for WordPress integration
6. ⏳ Request Postgres + Resend integration from Claude

---

## Repository Structure

```
business-readiness-assessment/
├── index.html              # Main assessment app
├── vercel.json             # Vercel configuration
├── package.json            # Project metadata
├── README.md               # Project documentation
├── DEPLOYMENT.md           # This file
├── setup-auto-deploy.sh    # Automated setup script
└── .git/                   # Git repository
```

Your GitHub: `https://github.com/YOUR-USERNAME/business-readiness-assessment`
Your Vercel: `https://business-readiness-assessment-xxx.vercel.app`
