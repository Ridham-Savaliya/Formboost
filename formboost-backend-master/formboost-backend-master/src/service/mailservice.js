import nodemailer from 'nodemailer';

// Gmail SMTP configuration
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});

export async function sendMail(to, subject, text, html) {
  // Use EMAIL_FROM if set, otherwise use EMAIL_USER
  const from = process.env.EMAIL_FROM || 'Formboom <no-reply@formboom.site>';

  const mailOptions = {
    from,
    to,
    subject,
    text,
    html,
  };

  console.log('Email configuration:', {
    gmailUser: process.env.EMAIL_USER ? 'Set' : 'Not set',
    gmailPass: process.env.EMAIL_PASS ? 'Set' : 'Not set',
    from,
    to,
    subject,
  });

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error(
        'Gmail credentials not configured. Please set EMAIL_USER and EMAIL_PASS in .env file'
      );
    }

    console.log('Sending email via Gmail...');
    const result = await gmailTransporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}
