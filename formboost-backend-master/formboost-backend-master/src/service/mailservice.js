import nodemailer from 'nodemailer';
import config from '#config/index.js';

const transporter = nodemailer.createTransport({
  service: config.email.service || 'gmail',
  host: config.email.host || undefined,
  port: config.email.port || 587,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export async function sendMail(to, subject, text, html) {
  const mailOptions = {
    from: config.email.from,
    to,
    subject,
    text,
    html,
  };
  return transporter.sendMail(mailOptions);
}
