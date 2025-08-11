const nodemailer = require('nodemailer');

// Email configuration - Optimized for Gmail
const EMAIL_CONFIG = {
  notification_email: process.env.NOTIFICATION_EMAIL || 'gursaaz@axiomstartups.com',
  email_subject: 'New Axiom Startup Application Received',
  send_notifications: process.env.SEND_NOTIFICATIONS !== 'false', // true by default
  from_email: process.env.FROM_EMAIL || process.env.SMTP_USER || 'gursaaz@gmail.com',
  from_name: 'Axiom Startup Website',
  smtp_host: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtp_port: parseInt(process.env.SMTP_PORT) || 587,
  smtp_user: process.env.SMTP_USER || 'gursaaz@gmail.com',
  smtp_pass: process.env.SMTP_PASS || 'ckcx hhxk zzdg tyra'  // your gmail app password
};

// Function to sanitize input data
function sanitizeInput(data) {
  if (typeof data !== 'string') return data;
  return data.trim().replace(/[<>]/g, '');
}

// Function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to validate URL
function isValidURL(url) {
  if (!url || url.trim() === '') return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Function to create email content
function createEmailBody(applicationData) {
  const [fullName, email, age, school, startup_name, participant_type, team_members, startup_idea, google_meet, mvp_ready, mvp_details, social_links, favorite_startup, response_speed] = applicationData;
  
  return `
    <html>
    <head>
      <title>New Application Submission</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #0a0a0a; color: #ffffff; }
        .container { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 15px; border: 2px solid #ffd700; }
        .header { background: #1a1a2e; color: #ffd700; padding: 20px; text-align: center; border-radius: 10px; margin-bottom: 25px; border: 1px solid #ffd700; }
        .field { margin-bottom: 20px; padding: 15px; background: rgba(255, 215, 0, 0.1); border-left: 4px solid #ffd700; border-radius: 8px; }
        .field-label { font-weight: bold; color: #ffd700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        .field-value { margin-top: 8px; line-height: 1.6; color: #ffffff; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; margin-top: 25px; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 New Axiom Startup Application</h1>
          <p>A new application has been submitted for the Axiom Startup Competition</p>
        </div>
        
        <div class="field">
          <div class="field-label">👤 Full Name</div>
          <div class="field-value">${fullName}</div>
        </div>
        
        <div class="field">
          <div class="field-label">📧 Email Address</div>
          <div class="field-value">${email}</div>
        </div>
        
        <div class="field">
          <div class="field-label">🎂 Age</div>
          <div class="field-value">${age}</div>
        </div>
        
        <div class="field">
          <div class="field-label">🏫 School</div>
          <div class="field-value">${school}</div>
        </div>
        
        <div class="field">
          <div class="field-label">🚀 Startup Name</div>
          <div class="field-value">${startup_name}</div>
        </div>
        
        <div class="field">
          <div class="field-label">👤 Participant Type</div>
          <div class="field-value">${participant_type}</div>
        </div>
        
        <div class="field">
          <div class="field-label">👥 Team Members</div>
          <div class="field-value">${team_members}</div>
        </div>
        
        <div class="field">
          <div class="field-label">💡 Startup Idea</div>
          <div class="field-value">${startup_idea}</div>
        </div>
        
        <div class="field">
          <div class="field-label">🎥 Google Meet Available</div>
          <div class="field-value">${google_meet}</div>
        </div>
        
        <div class="field">
          <div class="field-label">🔧 MVP Ready</div>
          <div class="field-value">${mvp_ready}</div>
        </div>
        
        <div class="field">
          <div class="field-label">📝 MVP Details</div>
          <div class="field-value">${mvp_details}</div>
        </div>
        
        ${social_links ? `
        <div class="field">
          <div class="field-label">📱 Social Links</div>
          <div class="field-value">${social_links}</div>
        </div>
        ` : ''}
        
        <div class="field">
          <div class="field-label">⭐ Favorite Startup</div>
          <div class="field-value">${favorite_startup}</div>
        </div>
        
        <div class="field">
          <div class="field-label">⚡ Response Speed</div>
          <div class="field-value">${response_speed}</div>
        </div>
        
        <div class="footer">
          <p>This application was submitted through the Axiom Startup Competition website.</p>
          <p>Submission time: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Function to create confirmation email for the applicant
function createConfirmationEmailBody(applicationData) {
  const [fullName, email, age, school, startup_name, participant_type, team_members, startup_idea, google_meet, mvp_ready, mvp_details, social_links, favorite_startup, response_speed] = applicationData;
  
  return `
    <html>
    <head>
      <title>Application Received - Axiom Startup Competition</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #0a0a0a; color: #ffffff; }
        .container { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 15px; border: 2px solid #ffd700; max-width: 600px; margin: 0 auto; }
        .header { background: #1a1a2e; color: #ffd700; padding: 20px; text-align: center; border-radius: 10px; margin-bottom: 25px; border: 1px solid #ffd700; }
        .field { margin-bottom: 15px; padding: 15px; background: rgba(255, 215, 0, 0.1); border-left: 4px solid #ffd700; border-radius: 5px; }
        .field-label { font-weight: bold; color: #ffd700; margin-bottom: 5px; }
        .field-value { color: #ffffff; word-wrap: break-word; }
        .footer { background: rgba(255, 215, 0, 0.1); padding: 20px; text-align: center; font-size: 14px; color: #cccccc; margin-top: 25px; border-radius: 10px; border: 1px solid #ffd700; }
        .thank-you { font-size: 18px; color: #ffd700; margin-bottom: 15px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Application Received!</h1>
          <p class="thank-you">Thank you for applying to the Axiom Startup Competition!</p>
          <p>We've received your application and will get back to you soon.</p>
        </div>
        
        <h2 style="color: #ffd700; margin-bottom: 20px;">📋 Your Submission:</h2>
        
        <div class="field">
          <div class="field-label">👤 Full Name</div>
          <div class="field-value">${fullName}</div>
        </div>
        
        <div class="field">
          <div class="field-label">📧 Email Address</div>
          <div class="field-value">${email}</div>
        </div>
        
        <div class="field">
          <div class="field-label">🎂 Age</div>
          <div class="field-value">${age}</div>
        </div>
        
        <div class="field">
          <div class="field-label">🏫 School</div>
          <div class="field-value">${school}</div>
        </div>
        
        <div class="field">
          <div class="field-label">🚀 Startup Name</div>
          <div class="field-value">${startup_name}</div>
        </div>
        
        <div class="field">
          <div class="field-label">👤 Participant Type</div>
          <div class="field-value">${participant_type}</div>
        </div>
        
        <div class="field">
          <div class="field-label">👥 Team Members</div>
          <div class="field-value">${team_members}</div>
        </div>
        
        <div class="field">
          <div class="field-label">💡 Startup Idea</div>
          <div class="field-value">${startup_idea}</div>
        </div>
        
        <div class="field">
          <div class="field-label">🎥 Google Meet Available</div>
          <div class="field-value">${google_meet}</div>
        </div>
        
        <div class="field">
          <div class="field-label">🔧 MVP Ready</div>
          <div class="field-value">${mvp_ready}</div>
        </div>
        
        <div class="field">
          <div class="field-label">📝 MVP Details</div>
          <div class="field-value">${mvp_details}</div>
        </div>
        
        ${social_links ? `
        <div class="field">
          <div class="field-label">📱 Social Links</div>
          <div class="field-value">${social_links}</div>
        </div>
        ` : ''}
        
        <div class="field">
          <div class="field-label">⭐ Favorite Startup</div>
          <div class="field-value">${favorite_startup}</div>
        </div>
        
        <div class="field">
          <div class="field-label">⚡ Response Speed</div>
          <div class="field-value">${response_speed}</div>
        </div>
        
        <div class="footer">
          <p><strong>What happens next?</strong></p>
          <p>• Our team will review your application carefully</p>
          <p>• We'll reach out within 1-2 weeks with an update</p>
          <p>• Keep an eye on your inbox (and spam folder!)</p>
          <p>• Feel free to reach out if you have any questions</p>
          <br>
          <p>Thank you for being part of the Axiom Startup Competition!</p>
          <p>Submitted on: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Function to send confirmation email to the applicant
async function sendConfirmationEmail(applicationData) {
  if (!EMAIL_CONFIG.send_notifications) {
    // console.log('Email notifications disabled');
    return true;
  }

  if (!EMAIL_CONFIG.smtp_host || !EMAIL_CONFIG.smtp_user || !EMAIL_CONFIG.smtp_pass) {
    // console.log('SMTP configuration missing, skipping confirmation email');
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.smtp_host || 'smtp.gmail.com',
      port: EMAIL_CONFIG.smtp_port || 587,
      secure: false, // false for 587, true for 465
      auth: {
        user: EMAIL_CONFIG.smtp_user,
        pass: EMAIL_CONFIG.smtp_pass
      }
    });

    const confirmationEmailBody = createConfirmationEmailBody(applicationData);
    const applicantEmail = applicationData[1]; // Email is the second element

    const mailOptions = {
      from: `"${EMAIL_CONFIG.from_name}" <${EMAIL_CONFIG.from_email}>`,
      to: applicantEmail,
      subject: 'Application Received - Axiom Startup Competition',
      html: confirmationEmailBody
    };

    await transporter.sendMail(mailOptions);
    // console.log('Confirmation email sent to applicant successfully');
    return true;
  } catch (error) {
    console.error('Failed to send confirmation email to applicant:', error);
    return false;
  }
}

// Function to send email notification
async function sendEmailNotification(applicationData) {
  if (!EMAIL_CONFIG.send_notifications) {
    // console.log('Email notifications disabled');
    return true;
  }



  if (!EMAIL_CONFIG.smtp_host || !EMAIL_CONFIG.smtp_user || !EMAIL_CONFIG.smtp_pass) {
    // console.log('SMTP configuration missing, skipping email');
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.smtp_host || 'smtp.gmail.com',
      port: EMAIL_CONFIG.smtp_port || 587,
      secure: false, // false for 587, true for 465
      auth: {
        user: EMAIL_CONFIG.smtp_user,
        pass: EMAIL_CONFIG.smtp_pass
      }
    });

    const emailBody = createEmailBody(applicationData);

    const mailOptions = {
      from: `"${EMAIL_CONFIG.from_name}" <${EMAIL_CONFIG.from_email}>`,
      to: EMAIL_CONFIG.notification_email,
      subject: EMAIL_CONFIG.email_subject,
      html: emailBody,
      replyTo: applicationData[1] // Applicant's email
    };

    await transporter.sendMail(mailOptions);
    // console.log('Email notification sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
}

// Function to create CSV data (since Vercel doesn't persist files, we'll include this in the email)
function createCSVData(applicationData) {
  const [fullName, email, age, school, startup_name, participant_type, team_members, startup_idea, google_meet, mvp_ready, mvp_details, social_links, favorite_startup, response_speed] = applicationData;
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sanitizedName = fullName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `application_${sanitizedName}_${timestamp}.csv`;
  
  const csvContent = [
    ['Field', 'Value'],
    ['Submission Time', new Date().toISOString()],
    ['Full Name', fullName],
    ['Email', email],
    ['Age', age],
    ['School', school],
    ['Startup Name', startup_name],
    ['Participant Type', participant_type],
    ['Team Members', team_members],
    ['Startup Idea', startup_idea],
    ['Google Meet Available', google_meet],
    ['MVP Ready', mvp_ready],
    ['MVP Details', mvp_details],
    ['Social Links', social_links || ''],
    ['Favorite Startup', favorite_startup],
    ['Response Speed', response_speed]
  ].map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')).join('\n');
  
  return { filename, csvContent };
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      full_name,
      email,
      age,
      school,
      startup_name,
      participant_type,
      team_members,
      startup_idea,
      google_meet,
      mvp_ready,
      mvp_details,
      social_links,
      favorite_startup,
      response_speed,
      agreement
    } = req.body;

    // Validation
    const errors = [];

    if (!full_name || full_name.trim() === '') {
      errors.push('Full name is required');
    }

    if (!email || !isValidEmail(email)) {
      errors.push('Please enter a valid email address');
    }

    if (!age || age < 13 || age > 100) {
      errors.push('Please enter a valid age between 13 and 100');
    }

    if (!school || school.trim() === '') {
      errors.push('School is required');
    }

    if (!startup_name || startup_name.trim() === '') {
      errors.push('Startup name is required');
    }

    if (!participant_type) {
      errors.push('Please specify if you are an individual or group participant');
    }

    if (!team_members || team_members.trim() === '') {
      errors.push('Team members field is required');
    }

    if (!startup_idea || startup_idea.trim() === '') {
      errors.push('Startup idea description is required');
    }

    if (!google_meet) {
      errors.push('Google Meet availability is required');
    }

    if (!mvp_ready) {
      errors.push('MVP readiness status is required');
    }

    if (!mvp_details || mvp_details.trim() === '') {
      errors.push('MVP details are required');
    }

    if (!favorite_startup || favorite_startup.trim() === '') {
      errors.push('Favorite startup is required');
    }

    if (!response_speed || response_speed.trim() === '') {
      errors.push('Response speed is required');
    }

    if (!agreement) {
      errors.push('You must agree to the terms and conditions');
    }

    if (social_links && !isValidURL(social_links)) {
      errors.push('Please enter a valid URL for social links or leave it empty');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Sanitize data
    const applicationData = [
      sanitizeInput(full_name),
      sanitizeInput(email),
      sanitizeInput(age.toString()),
      sanitizeInput(school),
      sanitizeInput(startup_name),
      sanitizeInput(participant_type),
      sanitizeInput(team_members),
      sanitizeInput(startup_idea),
      sanitizeInput(google_meet),
      sanitizeInput(mvp_ready),
      sanitizeInput(mvp_details),
      sanitizeInput(social_links || ''),
      sanitizeInput(favorite_startup),
      sanitizeInput(response_speed)
    ];

    // Create CSV data (for email attachment or logging)
    const { filename, csvContent } = createCSVData(applicationData);

    // Send email notification to admin
    try {
      const emailSent = await sendEmailNotification(applicationData);
      // console.log('Email notification result:', emailSent);
    } catch (error) {
      console.error('Error sending email:', error);
      // Don't fail the submission if email fails
    }

    // Send confirmation email to applicant
    try {
      const confirmationSent = await sendConfirmationEmail(applicationData);
      // console.log('Confirmation email result:', confirmationSent);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      // Don't fail the submission if email fails
    }

    // Log the submission (since we can't persist files on Vercel)
    // console.log('New application submission:', {
    //   name: full_name,
    //   email: email,
    //   timestamp: new Date().toISOString(),
    //   csvData: csvContent
    // });

    return res.status(200).json({ 
      success: true, 
      message: 'Application submitted successfully!',
      redirect: '/thank-you.html'
    });

  } catch (error) {
    console.error('Error processing application:', error);
    return res.status(500).json({ 
      error: 'Internal server error. Please try again later.' 
    });
  }
}