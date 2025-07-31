const nodemailer = require('nodemailer');

// Email configuration - you can set these as Vercel environment variables
const EMAIL_CONFIG = {
  notification_email: process.env.NOTIFICATION_EMAIL || 'your-email@example.com',
  email_subject: 'New Axiom Startup Application Received',
  send_notifications: process.env.SEND_NOTIFICATIONS !== 'false', // true by default
  from_email: process.env.FROM_EMAIL || 'noreply@axiomstartup.com',
  from_name: 'Axiom Startup Website',
  smtp_host: process.env.SMTP_HOST,
  smtp_port: process.env.SMTP_PORT || 587,
  smtp_user: process.env.SMTP_USER,
  smtp_pass: process.env.SMTP_PASS
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
  const [fullName, email, age, teamOrSolo, teamMemberNames, startup_idea, problem_solving, unique_solution, market_research, competition_experience, social_media, motivation, interesting_fact, additional_info, google_meet_availability] = applicationData;
  
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
          <div class="field-label">👥 Team or Solo</div>
          <div class="field-value">${teamOrSolo}</div>
        </div>
        
        ${teamMemberNames ? `
        <div class="field">
          <div class="field-label">👥 Team Member Names</div>
          <div class="field-value">${teamMemberNames}</div>
        </div>
        ` : ''}
        
        <div class="field">
          <div class="field-label">💡 Startup Idea</div>
          <div class="field-value">${startup_idea}</div>
        </div>
        
        <div class="field">
          <div class="field-label">🎯 Problem Solving</div>
          <div class="field-value">${problem_solving}</div>
        </div>
        
        <div class="field">
          <div class="field-label">⭐ Unique Solution</div>
          <div class="field-value">${unique_solution}</div>
        </div>
        
        <div class="field">
          <div class="field-label">📊 Market Research</div>
          <div class="field-value">${market_research}</div>
        </div>
        
        <div class="field">
          <div class="field-label">🏆 Competition Experience</div>
          <div class="field-value">${competition_experience}</div>
        </div>
        
        ${social_media ? `
        <div class="field">
          <div class="field-label">📱 Social Media</div>
          <div class="field-value">${social_media}</div>
        </div>
        ` : ''}
        
        <div class="field">
          <div class="field-label">🔥 Motivation</div>
          <div class="field-value">${motivation}</div>
        </div>
        
        <div class="field">
          <div class="field-label">🎪 Interesting Fact</div>
          <div class="field-value">${interesting_fact}</div>
        </div>
        
        ${additional_info ? `
        <div class="field">
          <div class="field-label">📝 Additional Information</div>
          <div class="field-value">${additional_info}</div>
        </div>
        ` : ''}
        
        <div class="field">
          <div class="field-label">🎥 Google Meet Availability</div>
          <div class="field-value">${google_meet_availability}</div>
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

// Function to send email notification
async function sendEmailNotification(applicationData) {
  if (!EMAIL_CONFIG.send_notifications) {
    console.log('Email notifications disabled');
    return true;
  }

  if (!EMAIL_CONFIG.smtp_host || !EMAIL_CONFIG.smtp_user || !EMAIL_CONFIG.smtp_pass) {
    console.log('SMTP configuration missing, skipping email');
    return true;
  }

  try {
    const transporter = nodemailer.createTransporter({
      host: EMAIL_CONFIG.smtp_host,
      port: EMAIL_CONFIG.smtp_port,
      secure: EMAIL_CONFIG.smtp_port === 465,
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
    console.log('Email notification sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
}

// Function to create CSV data (since Vercel doesn't persist files, we'll include this in the email)
function createCSVData(applicationData) {
  const [fullName, email, age, teamOrSolo, teamMemberNames, startup_idea, problem_solving, unique_solution, market_research, competition_experience, social_media, motivation, interesting_fact, additional_info, google_meet_availability] = applicationData;
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sanitizedName = fullName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `application_${sanitizedName}_${timestamp}.csv`;
  
  const csvContent = [
    ['Field', 'Value'],
    ['Submission Time', new Date().toISOString()],
    ['Full Name', fullName],
    ['Email', email],
    ['Age', age],
    ['Team or Solo', teamOrSolo],
    ['Team Member Names', teamMemberNames || ''],
    ['Startup Idea', startup_idea],
    ['Problem Solving', problem_solving],
    ['Unique Solution', unique_solution],
    ['Market Research', market_research],
    ['Competition Experience', competition_experience],
    ['Social Media', social_media || ''],
    ['Motivation', motivation],
    ['Interesting Fact', interesting_fact],
    ['Additional Information', additional_info || ''],
    ['Google Meet Availability', google_meet_availability]
  ].map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')).join('\n');
  
  return { filename, csvContent };
}

export default async function handler(req, res) {
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
      team_or_solo,
      team_member_names,
      startup_idea,
      problem_solving,
      unique_solution,
      market_research,
      competition_experience,
      social_media,
      motivation,
      interesting_fact,
      additional_info,
      google_meet_availability,
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

    if (!team_or_solo) {
      errors.push('Please specify if you are competing solo or with a team');
    }

    if (!startup_idea || startup_idea.trim() === '') {
      errors.push('Startup idea description is required');
    }

    if (!problem_solving || problem_solving.trim() === '') {
      errors.push('Problem solving description is required');
    }

    if (!unique_solution || unique_solution.trim() === '') {
      errors.push('Unique solution description is required');
    }

    if (!market_research || market_research.trim() === '') {
      errors.push('Market research description is required');
    }

    if (!competition_experience || competition_experience.trim() === '') {
      errors.push('Competition experience description is required');
    }

    if (!motivation || motivation.trim() === '') {
      errors.push('Motivation description is required');
    }

    if (!interesting_fact || interesting_fact.trim() === '') {
      errors.push('Interesting fact is required');
    }

    if (!google_meet_availability) {
      errors.push('Google Meet availability is required');
    }

    if (!agreement) {
      errors.push('You must agree to the terms and conditions');
    }

    if (social_media && !isValidURL(social_media)) {
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
      sanitizeInput(team_or_solo),
      sanitizeInput(team_member_names || ''),
      sanitizeInput(startup_idea),
      sanitizeInput(problem_solving),
      sanitizeInput(unique_solution),
      sanitizeInput(market_research),
      sanitizeInput(competition_experience),
      sanitizeInput(social_media || ''),
      sanitizeInput(motivation),
      sanitizeInput(interesting_fact),
      sanitizeInput(additional_info || ''),
      sanitizeInput(google_meet_availability)
    ];

    // Create CSV data (for email attachment or logging)
    const { filename, csvContent } = createCSVData(applicationData);

    // Send email notification
    try {
      const emailSent = await sendEmailNotification(applicationData);
      console.log('Email notification result:', emailSent);
    } catch (error) {
      console.error('Error sending email:', error);
      // Don't fail the submission if email fails
    }

    // Log the submission (since we can't persist files on Vercel)
    console.log('New application submission:', {
      name: full_name,
      email: email,
      timestamp: new Date().toISOString(),
      csvData: csvContent
    });

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