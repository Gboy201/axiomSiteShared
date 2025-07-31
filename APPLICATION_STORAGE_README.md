# Axiom Startup Competition - Application Storage System

## 📁 Storage Structure

When someone submits an application through your website, their response is automatically saved in the following way:

### Server-Side Storage (PHP Hosting)
- **Development**: `axiom_applications_temp/` folder (for testing/development)
- **Production**: `axiom_applications/` folder (for live applications)
- **File Format**: `[Applicant_Name]_[Date]_[Time].csv`
- **Example**: `John_Smith_2025-07-30_14-23-45.csv`

### Client-Side Fallback (Development Server)
- **Location**: Downloads folder (automatically downloaded)
- **File Format**: Same as above
- **Backup**: Also saved in browser localStorage

## 🗂️ File Organization

Each application creates its own CSV file containing:
- Timestamp
- Full Name
- Email 
- Age
- School
- Startup Name
- Participant Type (Individual/Group)
- Team Members
- Startup Idea (detailed description)
- Google Meet Availability
- MVP Readiness
- MVP Details
- Social Links
- Favorite Startup
- Response Speed
- Terms Agreement

## 🔒 Persistence

Both application folders persist through code updates:

### Development Folder (`axiom_applications_temp/`)
- ✅ **Used during development and testing**
- ✅ **Keeps test applications separate from real ones**
- ✅ **Safe from version control (.gitignore)**
- ✅ **Can be cleared/reset without affecting production data**

### Production Folder (`axiom_applications/`)
- ✅ **For live/real applications**
- ✅ **Persists through code updates**
- ✅ **Safe from version control (.gitignore)**
- ✅ **Easy to backup and transfer**

## 📁 File Structure Example

```
startup-quest-website/
├── axiom_applications_temp/          # Development applications
│   ├── Test_User_2025-07-30_14-23-45.csv
│   └── Another_Test_2025-07-30_15-10-22.csv
├── axiom_applications/               # Production applications (created when switched)
│   ├── John_Smith_2025-07-30_14-23-45.csv
│   ├── Sarah_Johnson_2025-07-30_15-10-22.csv
│   └── Alex_Chen_2025-07-30_16-45-33.csv
├── index.html
├── apply.html
└── ...
```

## 📊 Benefits of Individual Files

1. **Easy Organization**: Each applicant has their own file
2. **No Data Loss**: If one file corrupts, others are safe
3. **Simple Processing**: Easy to import individual applications
4. **Clear Timeline**: Filenames show exactly when submitted
5. **Privacy Friendly**: Can easily delete/manage specific applications

## 🚀 For Production Use

### Switching to Production Mode
To switch from development to production storage:
1. Edit `submit_application.php`
2. Change `$applications_dir = 'axiom_applications_temp';` to `$applications_dir = 'axiom_applications';`
3. Real applications will now be saved to the production folder

### On PHP Hosting Provider
When you deploy to a PHP-enabled hosting provider:
1. The chosen applications folder will be created automatically
2. All submissions will be saved server-side
3. Files will be accessible via your hosting control panel
4. You can download/backup the entire folder anytime

## 📧 Email Notifications

The system can automatically send you an email notification every time someone submits an application!

### Quick Setup:
1. Edit `email_config_local.php` 
2. Change `'notification_email' => 'your-actual-email@gmail.com'`
3. Test by submitting an application

### What You Get:
- **Instant notifications** with all application details
- **Beautiful HTML formatting** with applicant info, startup idea, and contact details
- **Direct reply capability** - just hit reply to contact the applicant
- **Secure & private** - email config is protected by .gitignore

See `EMAIL_SETUP_GUIDE.md` for detailed instructions and troubleshooting.

## 🛠️ Technical Details

- Files use UTF-8 encoding for international characters
- Special characters in names are cleaned for safe filenames
- CSV format is compatible with Excel, Google Sheets, etc.
- Headers are included in every file for easy reading
- After successful submission, users are redirected to a thank you page (`thank-you.html`)
- Email notifications are sent via PHP mail() function with HTML formatting

---

**Note**: Make sure to add `axiom_applications/` to your `.gitignore` file to keep applicant data private and out of version control. 