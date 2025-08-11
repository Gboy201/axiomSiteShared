const nodemailer = require('nodemailer');

// Email configuration - Optimized for Gmail
const EMAIL_CONFIG = {
  notification_email: process.env.NOTIFICATION_EMAIL || 'gursaaz@axiomstartups.com',
  email_subject: 'New Contact Form Submission - Axiom Startup',
  send_notifications: process.env.SEND_NOTIFICATIONS !== 'false', // true by default
  from_email: process.env.FROM_EMAIL || process.env.SMTP_USER || 'gursaaz@gmail.com',
  from_name: 'Axiom Startup Contact Form',
  smtp_host: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtp_port: parseInt(process.env.SMTP_PORT) || 587,
  smtp_user: process.env.SMTP_USER || 'gursaaz@gmail.com',
  smtp_pass: process.env.SMTP_PASS || 'ckcx hhxk zzdg tyra'  // your gmail app password
};

// Function to sanitize input
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
}

// Function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to create email content
function createEmailBody(contactData) {
  const { name, organization, email, message } = contactData;
  
  return `
    <html>
    <head>
      <title>New Contact Form Submission</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; }
        .container { background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background-color: #ffd700; color: #000; padding: 20px; text-align: center; border-radius: 5px; margin-bottom: 20px; }
        .field { margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #ffd700; }
        .field-label { font-weight: bold; color: #333; }
        .field-value { margin-top: 5px; word-wrap: break-word; }
        .footer { background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; margin-top: 20px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📬 New Contact Form Submission</h1>
          <p>Someone has reached out through the Axiom Startup website</p>
        </div>
        
        <div class="field">
          <div class="field-label">👤 Name:</div>
          <div class="field-value">${name}</div>
        </div>
        
        ${organization ? `
        <div class="field">
          <div class="field-label">🏢 Organization/Company:</div>
          <div class="field-value">${organization}</div>
        </div>
        ` : ''}
        
        <div class="field">
          <div class="field-label">📧 Email Address:</div>
          <div class="field-value">${email}</div>
        </div>
        
        <div class="field">
          <div class="field-label">💬 Message:</div>
          <div class="field-value">${message}</div>
        </div>
        
        <div class="footer">
          <p>This message was sent through the contact form on the Axiom Startup website.</p>
          <p>Submission time: ${new Date().toLocaleString()}</p>
          <p><strong>Reply directly to this email to respond to the sender.</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Function to create confirmation email for the contact submitter
function createContactConfirmationEmailBody(contactData) {
  const { name, organization, email, message } = contactData;
  
  return `
    <html>
    <head>
      <title>Message Received - Axiom Startup Competition</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; }
        .container { background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; }
        .header { background-color: #ffd700; color: #000; padding: 20px; text-align: center; border-radius: 5px; margin-bottom: 20px; }
        .field { margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #ffd700; }
        .field-label { font-weight: bold; color: #333; }
        .field-value { margin-top: 5px; word-wrap: break-word; }
        .footer { background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; margin-top: 20px; border-radius: 5px; }
        .thank-you { font-size: 18px; color: #000; margin-bottom: 15px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📬 Message Received!</h1>
          <p class="thank-you">Thank you for contacting us!</p>
          <p>We've received your message and will get back to you soon.</p>
        </div>
        
        <h2 style="color: #333; margin-bottom: 20px;">📋 Your Message:</h2>
        
        <div class="field">
          <div class="field-label">👤 Name</div>
          <div class="field-value">${name}</div>
        </div>
        
        <div class="field">
          <div class="field-label">🏢 Organization</div>
          <div class="field-value">${organization}</div>
        </div>
        
        <div class="field">
          <div class="field-label">📧 Email</div>
          <div class="field-value">${email}</div>
        </div>
        
        <div class="field">
          <div class="field-label">💬 Message</div>
          <div class="field-value">${message}</div>
        </div>
        
        <div class="footer">
          <p><strong>What happens next?</strong></p>
          <p>• Our team will review your message</p>
          <p>• We'll respond within 24-48 hours</p>
          <p>• Keep an eye on your inbox (and spam folder!)</p>
          <br>
          <p>Thank you for reaching out to Axiom Startup Competition!</p>
          <p>Sent on: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Function to send confirmation email to the contact submitter
async function sendContactConfirmationEmail(contactData) {
  if (!EMAIL_CONFIG.send_notifications) {
    console.log('Email notifications disabled');
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

    const confirmationEmailBody = createContactConfirmationEmailBody(contactData);

    const mailOptions = {
      from: `"${EMAIL_CONFIG.from_name}" <${EMAIL_CONFIG.from_email}>`,
      to: contactData.email,
      subject: 'Message Received - Axiom Startup Competition',
      html: confirmationEmailBody
    };

    await transporter.sendMail(mailOptions);
    // console.log('Contact confirmation email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send contact confirmation email:', error);
    return false;
  }
}

// Function to send email notification
async function sendEmailNotification(contactData) {
  if (!EMAIL_CONFIG.send_notifications) {
    console.log('Email notifications disabled');
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

    const emailBody = createEmailBody(contactData);

    const mailOptions = {
      from: `"${EMAIL_CONFIG.from_name}" <${EMAIL_CONFIG.from_email}>`,
      to: EMAIL_CONFIG.notification_email,
      subject: EMAIL_CONFIG.email_subject,
      html: emailBody,
      replyTo: contactData.email
    };

    await transporter.sendMail(mailOptions);
    // console.log('Contact form email notification sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send contact form email:', error);
    return false;
  }
}

// Function to create CSV data
function createCSVData(contactData) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sanitizedName = contactData.name.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `contact_${sanitizedName}_${timestamp}.csv`;
  
  const csvContent = [
    ['Field', 'Value'],
    ['Submission Time', new Date().toISOString()],
    ['Name', contactData.name],
    ['Organization', contactData.organization || ''],
    ['Email', contactData.email],
    ['Message', contactData.message]
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
    const { name, organization, email, message } = req.body;

    // Validation
    const errors = [];

    if (!name || name.trim() === '') {
      errors.push('Name is required');
    }

    if (!email || !isValidEmail(email)) {
      errors.push('Please enter a valid email address');
    }

    if (!message || message.trim() === '') {
      errors.push('Message is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Sanitize data
    const contactData = {
      name: sanitizeInput(name),
      organization: sanitizeInput(organization || ''),
      email: sanitizeInput(email),
      message: sanitizeInput(message)
    };

    // Create CSV data (for logging)
    const { filename, csvContent } = createCSVData(contactData);

    // Send email notification to admin
    try {
      const emailSent = await sendEmailNotification(contactData);
      // console.log('Contact email notification result:', emailSent);
    } catch (error) {
      console.error('Error sending contact email:', error);
      // Don't fail the submission if email fails
    }

    // Send confirmation email to contact submitter
    try {
      const confirmationSent = await sendContactConfirmationEmail(contactData);
      // console.log('Contact confirmation email result:', confirmationSent);
    } catch (error) {
      console.error('Error sending contact confirmation email:', error);
      // Don't fail the submission if email fails
    }

    // Log the submission (since we can't persist files on Vercel)
    // console.log('New contact submission:', {
    //   name: contactData.name,
    //   email: contactData.email,
    //   timestamp: new Date().toISOString(),
    //   csvData: csvContent
    // });

    return res.status(200).json({ 
      success: true, 
      message: 'Thank you for your message! We\'ll get back to you soon.'
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return res.status(500).json({ 
      error: 'Internal server error. Please try again later.' 
    });
  }
}