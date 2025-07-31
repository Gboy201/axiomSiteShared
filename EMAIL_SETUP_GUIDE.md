# 📧 Email Notifications Setup Guide

Get notified instantly every time someone submits an application to your Axiom Startup Competition!

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Your Email Configuration
1. Copy `email_config.php` to `email_config_local.php`
2. Edit `email_config_local.php` with your email address:

```php
return [
    'notification_email' => 'your-actual-email@gmail.com', // ← Change this!
    'email_subject' => 'New Axiom Startup Application Received',
    'send_notifications' => true,
    'from_email' => 'noreply@axiomstartup.com',
    'from_name' => 'Axiom Startup Website',
];
```

### Step 2: Development vs Production

**🛠️ For Development (Current Setup):**
- Email notifications are **disabled by default** 
- Applications still save to CSV files perfectly
- No email server needed on localhost

**🚀 For Production (Real Hosting):**
- Change `'send_notifications' => true` in `email_config_local.php`
- Use your real domain email (e.g., `applications@yourdomain.com`)
- Test with real applications!

## 📨 What You'll Receive

Every time someone applies, you'll get a **beautifully formatted HTML email** with:

- **🎯 Applicant Info**: Name, email, age, school
- **🏢 Startup Details**: Company name, team members, participant type  
- **💡 Their Big Idea**: Full startup description (highlighted!)
- **🔧 MVP Status**: What they're building and when
- **📞 Contact Info**: Availability for Google Meet, response speed
- **⭐ Extra Details**: Favorite startup and social links
- **✨ Direct Reply**: Click reply to contact them instantly

## 🛠️ Advanced Configuration

### For Production/Hosting Providers

Some hosting providers require specific email settings. Update your `email_config_local.php`:

```php
return [
    'notification_email' => 'your-email@domain.com',
    'from_email' => 'applications@yourdomain.com', // Use your domain
    'from_name' => 'Axiom Startup Applications',
    'send_notifications' => true,
];
```

### Disable Email Notifications

To turn off email notifications temporarily:

```php
'send_notifications' => false,
```

## 🔧 Troubleshooting

### Email Not Arriving?

1. **Check Spam Folder** - New server emails often go to spam initially
2. **Verify Email Address** - Make sure `notification_email` is correct
3. **Test with Different Email** - Try Gmail, Outlook, etc.
4. **Check Server Logs** - Look for email send confirmations in your server logs

### Common Issues & Solutions

**Issue**: "Mail function not available"
**Solution**: Your server doesn't support PHP mail(). Contact your hosting provider.

**Issue**: Emails go to spam
**Solution**: 
- Use your domain's email address in `from_email`
- Ask your hosting provider about SPF/DKIM records

**Issue**: No emails on localhost/development
**Solution**: 
- **Normal behavior** - Python development server can't send emails
- Email notifications are disabled by default for development
- Applications still save to CSV files successfully
- Enable emails when you deploy to real PHP hosting

## 📊 Email Analytics

Want to track email opens/clicks? Consider upgrading to services like:
- SendGrid
- Mailgun  
- Amazon SES

## 🔒 Security & Privacy

- **Email config is protected** - `email_config_local.php` is in `.gitignore`
- **Reply-to works** - Emails include applicant's email for easy replies
- **Secure headers** - Proper MIME types and encoding
- **Error logging** - Failed sends are logged for debugging

## 🎯 Sample Email Preview

```
🚀 New Axiom Startup Application!
Received: 2025-07-30 15:23:45

👤 Applicant Information
Name: Sarah Johnson  
Email: sarah@example.com
Age: 19
School: Stanford University

🏢 Startup Information  
Startup Name: EcoTrack
Participant Type: Group
Team Members: Sarah Johnson (CEO), Mike Chen (CTO)

💡 Startup Idea
We're building an AI-powered carbon footprint tracker that helps individuals 
and small businesses reduce their environmental impact through gamified 
daily challenges and community competitions...

[Full beautiful HTML formatting with all details]
```

## 🚀 Ready to Launch!

Once configured, you'll never miss an application again. Each submission triggers an instant, detailed email notification straight to your inbox!

---

**Need help?** The email system is designed to be bulletproof - if it fails, the application still saves successfully. Check your server logs for any email delivery issues. 