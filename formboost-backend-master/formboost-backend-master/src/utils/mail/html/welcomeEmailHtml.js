export default (userName, userEmail) => {
  // Primary Blue Color: #0080FF
  const primaryColor = '#0080FF';
  const primaryColorDark = '#0066CC'; // Darker shade for gradient

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to Formboom!</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f7f9;
      line-height: 1.6;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      border: 1px solid #e5e7eb;
    }
    .header {
      background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryColorDark} 100%);
      padding: 50px 30px;
      text-align: center;
    }
    .header img {
      max-width: 200px;
      height: auto;
      margin-bottom: 20px;
    }
    .header h1 {
      color: #ffffff;
      font-size: 30px;
      margin: 0 0 10px 0;
      font-weight: 700;
    }
    .header p {
      color: #e3f2ff;
      font-size: 16px;
      margin: 0;
    }
    .content {
      padding: 40px 30px;
    }
    .welcome-message {
      text-align: center;
      margin-bottom: 40px;
    }
    .welcome-message h2 {
      color: #111827;
      font-size: 24px;
      margin: 0 0 15px 0;
      font-weight: 700;
    }
    .welcome-message p {
      color: #4b5563;
      font-size: 16px;
      line-height: 1.7;
      margin: 10px 0;
    }
    .feature-grid {
      display: table;
      width: 100%;
      margin: 30px 0;
    }
    .feature-item {
      background-color: #f0f7ff; /* Very light blue background */
      padding: 25px;
      margin-bottom: 15px;
      border-radius: 10px;
      border: 1px solid #d0e8ff;
    }
    .feature-item h3 {
      color: ${primaryColor};
      font-size: 18px;
      margin: 0 0 10px 0;
      font-weight: 600;
    }
    .feature-item p {
      color: #4b5563;
      font-size: 14px;
      margin: 0;
      line-height: 1.6;
    }
    .cta-section {
      background-color: #f9fafb;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      margin: 30px 0;
      border: 1px solid #e5e7eb;
    }
    .cta-section h3 {
      color: #111827;
      font-size: 20px;
      margin: 0 0 15px 0;
      font-weight: 700;
    }
    .cta-section p {
      color: #4b5563;
      font-size: 15px;
      margin: 0 0 20px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryColorDark} 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 16px 40px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.2s;
      box-shadow: 0 4px 10px rgba(0, 128, 255, 0.4);
    }
    .cta-button:hover {
      background: linear-gradient(135deg, ${primaryColorDark} 0%, ${primaryColor} 100%);
      transform: translateY(-2px);
    }
    .tips-section {
      background-color: #fffbeb; 
      padding: 25px;
      border-radius: 10px;
      margin: 30px 0;
      border: 1px solid #fde68a;
    }
    .tips-section h3 {
      color: #92400e;
      font-size: 18px;
      margin: 0 0 15px 0;
      font-weight: 700;
    }
    .tips-section ul {
      margin: 0;
      padding-left: 20px;
      color: #78350f;
    }
    .tips-section li {
      margin: 8px 0;
      font-size: 14px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      color: #6b7280;
      font-size: 13px;
      margin: 8px 0;
    }
    .footer a {
      color: ${primaryColor};
      text-decoration: none;
      font-weight: 500;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-links img {
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    .social-links a:hover img {
        opacity: 1;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 20px 10px;
        border-radius: 8px;
      }
      .header {
        padding: 40px 20px;
      }
      .header h1 {
        font-size: 26px;
      }
      .content {
        padding: 30px 20px;
      }
      .feature-item {
        padding: 20px;
      }
        .color {
        text-color: #111827;
        }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://res.cloudinary.com/dsqpc6sp6/image/upload/v1768281681/formboom_horizontally-removebg-_cypez2.png" alt="Formboom Logo" style="max-width:250px;height:auto;">
      <h1>Welcome to Formboom!</h1>
<p style="color:#111827;font-weight:600;">
  Your journey to effortless form management starts here
</p>


    </div>

    <div class="content">
      <div class="welcome-message">
        <h2>Hi ${userName}! 👋</h2>
        <p>
          We're thrilled to have you join the Formboom community! You've just unlocked 
          a powerful platform to manage your forms, collect submissions, and streamline 
          your workflow.
        </p>
        <p style="margin-top: 20px; font-weight: 600;">
          Your account (<strong>${userEmail}</strong>) is now active and ready to use.
        </p>
      </div>

      <div class="feature-grid">
        <div class="feature-item">
          <h3>🚀 Create Your First Form</h3>
          <p>
            Get started in minutes! Create beautiful, customizable forms that work 
            seamlessly across all devices.
          </p>
        </div>

        <div class="feature-item">
          <h3>📊 Real-time Submissions</h3>
          <p>
            Receive instant notifications via email, Telegram, Slack, or webhooks 
            whenever someone submits your form.
          </p>
        </div>

        <div class="feature-item">
          <h3>🛡️ Built-in Spam Protection</h3>
          <p>
            Our AI-powered spam filter keeps your submissions clean and relevant, 
            saving you time and hassle.
          </p>
        </div>

        <div class="feature-item">
          <h3>📈 Analytics & Insights</h3>
          <p>
            Track your form performance with detailed analytics and export your 
            data anytime in CSV format.
          </p>
        </div>
      </div>

      <div class="cta-section">
        <h3>Ready to Get Started?</h3>
        <p>Click below to head to your dashboard and create your first form!</p>
        <a href="https://app.formboom.site/dashboard" class="cta-button">
          Go to Dashboard →
        </a>
      </div>

      <div class="tips-section">
        <h3>💡 Quick Tips to Get Started</h3>
        <ul>
          <li>Set up email notifications to never miss a submission</li>
          <li>Enable spam filtering to keep your data clean</li>
          <li>Integrate with Slack, Telegram, or Google Sheets for seamless workflows</li>
          <li>Use webhooks to connect with your favorite tools</li>
          <li>Export your submissions anytime in CSV format</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 15px; margin-bottom: 15px;">
          Need help getting started?
        </p>
        <p style="color: #6b7280; font-size: 14px;">
          Check out our 
          <a href="https://formboom.site/docs" style="color: ${primaryColor}; text-decoration: none; font-weight: 600;">documentation</a> 
          or reach out to our support team at 
          <a href="mailto:contact@formboom.site" style="color: ${primaryColor}; text-decoration: none; font-weight: 600;">contact@formboom.site</a>
        </p>
      </div>
    </div>

    <div class="footer">
      <p style="font-weight: 600; color: #111827; margin-bottom: 15px;">The Formboom Team</p>
      <p>Making form management simple, powerful, and delightful</p>
      <p>
        <a href="mailto:contact@formboom.site">contact@formboom.site</a> • 
        <a href="https://formboom.site">www.formboom.site</a>
      </p>
      
      <div class="social-links">
        <a href="https://linkedin.com/company/formboom" target="_blank">
          <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="24" height="24">
        </a>
        <a href="https://x.com/FormBoom" target="_blank">
          <img src="https://cdn-icons-png.flaticon.com/512/5968/5968830.png" alt="X (Twitter)" width="24" height="24">
        </a>
      </div>

      <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
        © ${new Date().getFullYear()} Formboom. All rights reserved.
      </p>
      
      <p style="font-size: 11px; color: #9ca3af; margin-top: 15px;">
        You're receiving this email because you signed up for Formboom.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};
