# Vercel Deployment Guide

This guide will help you deploy the Axiom Startup website to Vercel with Node.js backend support.

## 🚀 Quick Deployment

### 1. Prepare for Deployment

Make sure you have these files in your project:
- ✅ `package.json` - Node.js dependencies
- ✅ `vercel.json` - Vercel configuration
- ✅ `api/submit-application.js` - Application form endpoint
- ✅ `api/submit-contact.js` - Contact form endpoint
- ✅ `env.example` - Environment variables template

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up project: Yes
# - Which scope: Choose your account
# - Project name: axiom-startup-website
# - Directory: ./
# - Override settings: No
```

#### Option B: GitHub Integration
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure project settings (Vercel will auto-detect)
6. Click "Deploy"

### 3. Configure Environment Variables

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add these variables:

**Required for Email Notifications:**
```
NOTIFICATION_EMAIL = your-email@example.com
SEND_NOTIFICATIONS = true
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = your-gmail@gmail.com
SMTP_PASS = your-app-password
FROM_EMAIL = noreply@axiomstartup.com
FROM_NAME = Axiom Startup Website
```

**Gmail Setup:**
1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password":
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this app password for `SMTP_PASS`

### 4. Test Your Deployment

1. Visit your Vercel URL
2. Test the application form: `/apply.html`
3. Test the contact form: `/contact.html`
4. Check Vercel function logs for any errors

## 📧 Email Configuration Options

### Gmail (Recommended)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password
```

### SendGrid
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun
```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

## 🔧 Important Notes

### File Storage Limitations
- Vercel serverless functions cannot persist files
- CSV data is included in email notifications instead
- Form submissions are logged in Vercel function logs
- For permanent storage, consider using a database (Vercel KV, Supabase, etc.)

### Function Timeouts
- Maximum execution time: 30 seconds (configured in vercel.json)
- Email sending should complete within this limit

### Environment Variables
- Set `SEND_NOTIFICATIONS=false` to disable emails during testing
- All environment variables are required for production

## 🐛 Troubleshooting

### Common Issues

**Email not sending:**
- Check SMTP credentials in environment variables
- Verify Gmail app password is correct
- Check Vercel function logs for email errors

**Form submission errors:**
- Check browser network tab for API errors
- Verify API endpoints are accessible: `/api/submit-application` and `/api/submit-contact`
- Check Vercel function logs for detailed error messages

**CORS Issues:**
- API endpoints include CORS headers
- If issues persist, check Vercel logs

### Checking Logs
1. Go to Vercel dashboard
2. Select your project
3. Go to "Functions" tab
4. Click on function name to view logs
5. Check for error messages

## 📝 File Changes Made

### New Files Created:
- `package.json` - Node.js dependencies
- `vercel.json` - Vercel configuration
- `api/submit-application.js` - Application form API
- `api/submit-contact.js` - Contact form API
- `env.example` - Environment variables template

### Modified Files:
- `apply.html` - Updated form action and JavaScript
- `contact.html` - Updated form action and JavaScript

### Removed Files (Optional):
- `submit_application.php` - Replaced by Node.js API
- `submit_contact.php` - Replaced by Node.js API
- `email_config.php` - Replaced by environment variables
- `email_config_local.php` - No longer needed

## ✅ Deployment Checklist

- [ ] Project files ready
- [ ] Vercel account created
- [ ] GitHub repository (if using GitHub integration)
- [ ] Environment variables configured
- [ ] Gmail app password generated (if using Gmail)
- [ ] Deploy command executed
- [ ] Forms tested on live site
- [ ] Email notifications tested

## 🆘 Need Help?

- Check Vercel documentation: https://vercel.com/docs
- View function logs in Vercel dashboard
- Test APIs directly: `yoursite.vercel.app/api/submit-contact`

Your Axiom Startup website is now ready for production with Node.js backend! 🎉