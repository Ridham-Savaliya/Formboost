export default (formData, ipAddress, form) => {
  // Filter out internal FormBoom fields
  const cleanFormData = Object.entries(formData).filter(([key]) => !key.startsWith('_fb_'));

  const formDataRows = cleanFormData
    .map(
      ([key, value], index) => `
        <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'};">
          <td style="padding: 14px 20px; border-bottom: 1px solid #e5e7eb;">
            <strong style="color: #1f2937; font-size: 14px; text-transform: capitalize;">
              ${key.replace(/_/g, ' ')}
            </strong>
          </td>
          <td style="padding: 14px 20px; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 14px;">
            ${value || '<em style="color: #9ca3af;">No response</em>'}
          </td>
        </tr>
      `
    )
    .join('');

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
  <title>New Form Submission - ${form.formName}</title>
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
      padding: 40px 30px;
      text-align: center;
    }
    .header img {
      max-width: 80px; /* Smaller, focused logo */
      height: auto;
      margin-bottom: 15px;
      border-radius: 8px;
    }
    .header h1 {
      color: #ffffff;
      font-size: 26px;
      margin: 0;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .alert-box {
      background-color: #e0f7ff; /* Lighter blue alert */
      border-left: 5px solid ${primaryColor};
      padding: 18px 25px;
      margin-bottom: 30px;
      border-radius: 8px;
    }
    .alert-box p {
      margin: 0;
      color: #004a6b;
      font-size: 15px;
      font-weight: 500;
    }
    .form-info {
      padding: 0 0 30px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    .form-info h2 {
      color: #111827;
      font-size: 22px;
      margin: 0 0 5px 0;
      font-weight: 700;
    }
    .form-info p {
      color: #6b7280;
      font-size: 15px;
      margin: 0;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }
    .data-table th, .data-table td {
        text-align: left;
        padding: 14px 20px;
    }
    .metadata {
      background-color: #fffbeb; /* Light yellow for metadata */
      padding: 18px 25px;
      border-radius: 8px;
      margin: 30px 0;
      border: 1px solid #fde68a;
    }
    .metadata p {
      margin: 6px 0;
      color: #78350f;
      font-size: 13px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryColorDark} 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 16px 36px;
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
        padding: 30px 20px;
      }
      .header h1 {
        font-size: 22px;
      }
      .content {
        padding: 30px 20px;
      }
      /* Stack table rows on mobile */
      .data-table, .data-table tbody, .data-table tr, .data-table td {
        display: block;
        width: 100%;
      }
      .data-table tr {
        margin-bottom: 10px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
      }
      .data-table td {
        border: none !important;
        padding: 10px 15px !important;
      }
      .data-table tr td:first-child {
        background-color: #f0f7ff;
        border-radius: 6px 6px 0 0;
        font-weight: 700 !important;
        border-bottom: 1px dotted #a8d8ff !important;
      }
      .data-table tr td:last-child {
         border-radius: 0 0 6px 6px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://res.cloudinary.com/dsqpc6sp6/image/upload/v1768281681/formboom_horizontally-removebg-_cypez2.png" alt="FormBoom Logo" style="max-width:200px;height:auto;">
      <h1>New Form Submission!</h1>
    </div>

    <div class="content">
      <div class="alert-box">
        <p><strong>📬 Success!</strong> You've received a new submission for your form. Please review the details below.</p>
      </div>

      <div class="form-info">
        <h2>${form.formName}</h2>
        <p>${form.formDescription || 'No description provided'}</p>
      </div>

      <h3 style="color: #1f2937; font-size: 18px; margin: 30px 0 15px 0; font-weight: 600;">📝 Submission Details</h3>
      <table class="data-table" role="presentation" border="0" cellpadding="0" cellspacing="0">
        <tbody>
          ${formDataRows}
        </tbody>
      </table>

      <div class="metadata">
        <p><strong>📍 IP Address:</strong> ${ipAddress}</p>
        <p><strong>🕐 Submitted At:</strong> ${new Date().toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}</p>
      </div>

      <div style="text-align: center; margin: 40px 0 30px 0;">
        <a href="https://formboom.site/form/${form.id}" class="cta-button">
          View All Submissions →
        </a>
      </div>

    </div>

    <div class="footer">
      <p style="font-weight: 600; color: #111827; margin-bottom: 15px;">FormBoom Team</p>
      <p>Making form management simple and powerful</p>
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

<<<<<<< HEAD
      <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
        © ${new Date().getFullYear()} FormBoom. All rights reserved.
      </p>
    </div>
  </div>
=======
                                    <img align="center" border="0" src="https://cdn.formboom.site/public/formboom-high-resolution-logo-white-transparent.png" alt="Formboom" title="Formboom" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 35%;max-width: 203px;" width="203" />

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>





          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

                      <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:'Cabin',sans-serif;" align="left">

                              <div>
                                <style>
        h3, .logo {
          text-align: center;
        }
        li {
          max-width: 500px;
          list-style-type: square;
          border: 1px solid black;
          margin: 2px 0px;
          display: flex;
          flex-wrap: wrap;
          overflow-wrap: anywhere;
        }
        #logo {
          width: 50vw;
        }
      </style>
      <h3>New Form Submission</h3>
      <p>Here are the details:</p>
      <ul>
        ${Object.entries(formData)
          .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
          .join('')}
      </ul>
      <p>IP Address: ${ipAddress}</p>
      <h3>Check All Submissions Here: 
        <a href="https://app.formboom.site/form/${form.id}">CLICK</a>
      </h3>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>





          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->

                      <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px 1px;font-family:'Cabin',sans-serif;" align="left">

                              <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <tbody>
                                  <tr style="vertical-align: top">
                                    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                      <span>&#160;</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px;font-family:'Cabin',sans-serif;" align="left">

                              <div style="font-size: 14px; line-height: 160%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 160%;"><span style="color: #333333; line-height: 22.4px;">Thank you for choosing Formboom.</span></p>
                                <p style="line-height: 160%;">&nbsp;</p>
                                <p style="line-height: 160%;"><span style="color: #333333; line-height: 22.4px;"><strong>The Formboom Team</strong></span></p>
                                <p style="line-height: 160%;"><span style="color: #333333; line-height: 22.4px;"><a style="color: #333333;" href="mailto:contact@formboom.site">contact@formboom.site</a></span></p>
                                <p style="line-height: 160%;"><span style="color: #333333; line-height: 22.4px;"><a style="color: #333333;" href="#">www.formboom.site</a></span></p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>





          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

                      <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 6px;font-family:'Cabin',sans-serif;" align="left">

                              <div style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
                                <p style="line-height: 140%;" class="p1">© 2024 Formboom. All rights reserved.</p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>





          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

                      <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 0px 15px;font-family:'Cabin',sans-serif;" align="left">

                              <div align="center">
                                <div style="display: table; max-width:63px;">
                                  <!--[if (mso)|(IE)]><table width="63" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:63px;"><tr><![endif]-->


                                  <!--[if (mso)|(IE)]><td width="22" style="width:22px; padding-right: 10px;" valign="top"><![endif]-->
                                  <table align="center" border="0" cellspacing="0" cellpadding="0" width="22" height="22" style="width: 22px !important;height: 22px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 10px">
                                    <tbody>
                                      <tr style="vertical-align: top">
                                        <td align="center" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                          <a href="https://linkedin.com/company/formboom" title="LinkedIn" target="_blank">
                                            <img src="https://cdn.tools.unlayer.com/social/icons/rounded-black/linkedin.png" alt="LinkedIn" title="LinkedIn" width="22" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 22px !important">
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <!--[if (mso)|(IE)]></td><![endif]-->

                                  <!--[if (mso)|(IE)]><td width="22" style="width:22px; padding-right: 0px;" valign="top"><![endif]-->
                                  <table align="center" border="0" cellspacing="0" cellpadding="0" width="22" height="22" style="width: 22px !important;height: 22px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
                                    <tbody>
                                      <tr style="vertical-align: top">
                                        <td align="center" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                          <a href="https://x.com/FormBoom" title="X" target="_blank">
                                            <img src="https://cdn.tools.unlayer.com/social/icons/rounded-black/x.png" alt="X" title="X" width="22" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 22px !important">
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <!--[if (mso)|(IE)]></td><![endif]-->


                                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                </div>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>



          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </td>
      </tr>
    </tbody>
  </table>
  <!--[if mso]></div><![endif]-->
  <!--[if IE]></div><![endif]-->
>>>>>>> 40af3738882195070cb782017fb42cd1189d4275
</body>
</html>
  `;
};
