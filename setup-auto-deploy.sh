#!/bin/bash

# GitHub + Vercel Auto-Deploy Setup
# Run this once, then everything is automated forever

echo "🚀 Setting up Business Readiness Assessment for auto-deploy..."
echo ""

# Step 1: Create GitHub repository
echo "📦 Step 1: Creating GitHub repository..."
gh repo create business-readiness-assessment --public --source=. --remote=origin --push

if [ $? -eq 0 ]; then
    echo "✅ Repository created and code pushed to GitHub!"
    echo ""
else
    echo "⚠️  GitHub repo creation failed. You might need to:"
    echo "   1. Install GitHub CLI: brew install gh (Mac) or apt install gh (Linux)"
    echo "   2. Authenticate: gh auth login"
    echo ""
    echo "Alternative: Create repo manually at https://github.com/new"
    echo "Then run: git remote add origin https://github.com/YOUR-USERNAME/business-readiness-assessment.git"
    echo "         git push -u origin master"
    exit 1
fi

# Step 2: Instructions for Vercel
echo "📡 Step 2: Import to Vercel..."
echo ""
echo "Now go to: https://vercel.com/new"
echo "   1. Select 'Import Git Repository'"
echo "   2. Select 'business-readiness-assessment'"
echo "   3. Click 'Deploy'"
echo ""
echo "That's it! From now on:"
echo "   • Any push to GitHub → Auto-deploys to Vercel"
echo "   • Claude can handle all future updates via MCP"
echo ""
echo "✨ Your deployment URL will be: https://business-readiness-assessment-xxx.vercel.app"
