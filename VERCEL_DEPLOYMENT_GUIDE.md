# Vercel Deployment Guide - Steps by Steps

## Step 1: Prepare Your Repository ✅ (Already Done)

Your project structure now looks like this:
```
mycompany/
├── api/
│   └── send-email.js          ✅ Vercel Function
├── index.html
├── css/
├── js/
│   ├── app.js
│   └── services/
│       └── FormService.js
├── json/
├── image/
├── package.json               ✅ Dependencies
├── vercel.json                ✅ Config
└── .git/
```

---

## Step 2: Create Vercel Account

### 2.1 Sign Up
1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. **Sign up with GitHub** (easiest option)
4. Authorize Vercel to access your GitHub account
5. Verify your email if prompted

### 2.2 Dashboard
After signing up, you'll see the Vercel dashboard with "Create New Project" button.

---

## Step 3: Connect GitHub Repository

### 3.1 Import Project
1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Search for **"fttgsolutions"** repository
4. Click the repository to import it
5. Click **"Import"**

### 3.2 Configure Project
The import screen will show:
- **Project Name:** `fttg-solutions` (or keep as is)
- **Framework Preset:** Select **"Other"** (it's a static site)
- **Root Directory:** Leave as `./`
- **Environment Variables:** (Don't set yet, we'll do it next)

Click **"Deploy"** to create the initial deployment.

---

## Step 4: Set Environment Variables

These are your email credentials that Vercel will use securely.

### 4.1 Gmail App Password Setup

**Important:** You need a Gmail "App Password", not your regular password.

1. Go to **https://myaccount.google.com**
2. Click **"Security"** (left sidebar)
3. Enable **"2-Step Verification"** if not already enabled
4. Scroll down to **"App passwords"**
5. Select **Mail** and **Windows Computer** (or your device)
6. Google generates a 16-character password
7. **Copy this password** (you'll need it next)

### 4.2 Add to Vercel

1. Go to your **Vercel project dashboard**
2. Click **"Settings"** tab
3. Click **"Environment Variables"** (left sidebar)
4. Add two variables:

**Variable 1:**
- Name: `EMAIL_USER`
- Value: `your-email@gmail.com` (your Gmail address)
- Environment: Select all (Production, Preview, Development)
- Click **"Add"**

**Variable 2:**
- Name: `EMAIL_PASSWORD`
- Value: `xxxx xxxx xxxx xxxx` (the 16-char App Password from Gmail)
- Environment: Select all
- Click **"Add"**

---

## Step 5: Update FormService API Endpoint

Your FormService is already set to `/api/send-email` which is perfect!

No changes needed - it will automatically work with Vercel.

---

## Step 6: Commit & Deploy

### 6.1 Commit Changes
```bash
cd /Users/fttg/fttg_workspace/mycompany

# Add all files
git add -A

# Commit
git commit -m "feat: Add Vercel serverless function for email handling

- Add api/send-email.js Vercel function
- Add package.json with nodemailer dependency
- Add vercel.json configuration
- FormService configured to use /api/send-email endpoint
- Email validation and HTML formatting included
- Confirmation emails sent to users"

# Push to GitHub
git push origin develop
```

### 6.2 Vercel Auto-Deploy
Vercel watches your GitHub repository:
1. You push code → GitHub
2. Vercel detects the push
3. Vercel automatically deploys
4. Within 1-2 minutes, your site is live ✅

---

## Step 7: Test Your Setup

### 7.1 Get Your Vercel URL
1. Go to **Vercel Dashboard**
2. Click your project
3. Find the domain at the top (e.g., `fttg-solutions.vercel.app`)
4. Click the link to visit your live site

### 7.2 Test the Contact Form
1. Go to your site's Contact page
2. Fill out the form
3. Click Submit
4. You should see success message
5. Check your email (dev@fttgsolutions.com) for the submission

### 7.3 Check Vercel Logs
If something goes wrong:
1. Go to Vercel Dashboard
2. Click **"Deployments"** tab
3. Click the latest deployment
4. Click **"Logs"** to see what happened
5. Errors will show there

---

## Step 8: Custom Domain (Optional)

If you have a custom domain (e.g., fttgsolutions.com):

### 8.1 Add Domain
1. Go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain name
4. Vercel shows DNS instructions
5. Update your domain's DNS settings
6. Wait 10-60 minutes for propagation

### 8.2 Verify
Visit your domain - your site should load!

---

## Troubleshooting

### Form submission fails with "Network error"
**Problem:** API endpoint not working
**Solution:** 
1. Check Vercel Logs
2. Verify environment variables are set
3. Check email/password are correct

### "Email service error"
**Problem:** Gmail authentication failed
**Solution:**
1. Regenerate Gmail App Password
2. Update in Vercel Environment Variables
3. Re-deploy (or just wait a few minutes)

### Blank page
**Problem:** Static files not loading
**Solution:**
1. Clear browser cache (Cmd+Shift+Delete)
2. Check Vercel Logs
3. Verify all files committed to git

### "Cannot find module 'nodemailer'"
**Problem:** Dependencies not installed
**Solution:**
1. Check `package.json` exists
2. Check Vercel build logs
3. Manually trigger redeploy from Vercel dashboard

---

## Commands You'll Use

```bash
# Deploy (just push to GitHub)
git push origin develop

# View logs locally (requires Vercel CLI)
npm install -g vercel
vercel logs

# Redeploy from dashboard
# Go to Deployments → Click "..." → Redeploy
```

---

## What Happens Now

### Frontend
- Your HTML, CSS, JS files → Vercel CDN (fast, global)
- Served at: `https://fttg-solutions.vercel.app`

### Backend
- Your `/api/send-email.js` → Vercel Serverless Function
- Accessible at: `https://fttg-solutions.vercel.app/api/send-email`

### Flow
1. User fills contact form
2. FormService sends POST to `/api/send-email`
3. Vercel function receives request
4. Nodemailer sends email via Gmail
5. User sees success message
6. You receive email at dev@fttgsolutions.com

---

## Summary

### Done ✅
- [x] Created `/api/send-email.js` function
- [x] Created `package.json` with dependencies
- [x] Created `vercel.json` config
- [x] FormService ready to use

### To Do Next
- [ ] Create Vercel account (https://vercel.com)
- [ ] Sign up with GitHub
- [ ] Import your fttgsolutions repository
- [ ] Add EMAIL_USER environment variable
- [ ] Add EMAIL_PASSWORD environment variable
- [ ] Push code to GitHub (triggers deploy)
- [ ] Test contact form on your live site
- [ ] (Optional) Set up custom domain

---

## Need Help?

**Common Issues:**

1. **"Deployment failed"** → Check build logs in Vercel
2. **"Function error"** → Check environment variables are set
3. **"Email not received"** → Check Gmail App Password is correct
4. **"CORS error"** → This won't happen with Vercel (same domain)

---

## Next: Let Me Know When You're Ready

Once you've:
1. Created Vercel account
2. Imported your repo
3. Set environment variables
4. Pushed code

I can help you:
- Test the deployment
- Debug any issues
- Set up custom domain
- Monitor email submissions

**Ready to get started? Let me know!** 🚀
