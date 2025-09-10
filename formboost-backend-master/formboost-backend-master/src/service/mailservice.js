import nodemailer from 'nodemailer';
import config from '#config/index.js';

// Brevo SMTP configuration
const brevoTransporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL || '',
    pass: process.env.BREVO_SMTP_KEY || '',
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Fallback Gmail SMTP
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});

export async function sendMail(to, subject, text, html) {
  const from = config.email.from || process.env.BREVO_EMAIL || 'FormBoost <noreply@formboom.site>';
  
  const mailOptions = {
    from,
    to,
    subject,
    text,
    html,
  };

  console.log('Email configuration:', {
    brevoEmail: process.env.BREVO_EMAIL ? 'Set' : 'Not set',
    brevoKey: process.env.BREVO_SMTP_KEY ? 'Set' : 'Not set',
    gmailUser: process.env.EMAIL_USER ? 'Set' : 'Not set',
    gmailPass: process.env.EMAIL_PASS ? 'Set' : 'Not set',
    from,
    to
  });

    // Try Brevo first, then Gmail as fallback
    try {
      if (process.env.BREVO_EMAIL && process.env.BREVO_SMTP_KEY) {
        console.log('Attempting to send via Brevo...');
        return await brevoTransporter.sendMail(mailOptions);
      } else if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        console.log('Attempting to send via Gmail...');
        return await gmailTransporter.sendMail(mailOptions);
      } else {
        throw new Error('No email service configured');
      }
    } catch (error) {
      console.error('Primary email service failed, trying fallback...');
      
      // Try the alternate service regardless of which one failed first
      try {
        if (process.env.BREVO_EMAIL && process.env.BREVO_SMTP_KEY && (!error.message?.includes('Brevo') || (process.env.EMAIL_USER && process.env.EMAIL_PASS))) {
          console.log('Trying Brevo as fallback...');
          return await brevoTransporter.sendMail(mailOptions);
        }
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          console.log('Trying Gmail as fallback...');
          return await gmailTransporter.sendMail(mailOptions);
        }
        throw error;
      } catch (fallbackError) {
        console.error('Both email services failed:', {
          primary: error.message,
          fallback: fallbackError.message
        });
        throw error;
      }
    }
}
