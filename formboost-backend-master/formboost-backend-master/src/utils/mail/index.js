import { sendMail } from '#service/mailservice.js';
import logger from '#utils/logger.js';
import submissionEmailHtml from './html/submissionEmailHtml.js';
import welcomeEmailHtml from './html/welcomeEmailHtml.js';

export const sendSubmissionMail = async (form, formData, ip) => {
  try {
    const emailSubject = `New Submission for Your Form: ${form.formName}`;
    const emailText = `You have received a new submission on your form "${form.formName}".`;
    const emailHtml = submissionEmailHtml(formData, ip, form);

    logger.info({
      name: 'ATTEMPTING_EMAIL_SEND',
      data: {
        to: form.targetEmail,
        subject: emailSubject,
        formData,
      },
    });

    const result = await sendMail(form.targetEmail, emailSubject, emailText, emailHtml);

    logger.info({
      name: 'EMAIL_SEND_SUCCESS',
      data: {
        to: form.targetEmail,
        messageId: result.messageId,
      },
    });
  } catch (error) {
    logger.error({
      name: 'SEND_SUBMISSION_MAIL_FAILED',
      data: {
        formId: form.id,
        formName: form.formName,
        targetEmail: form.targetEmail,
        formData,
        ip,
        error: error.message,
        stack: error.stack,
      },
    });
    throw error; // Re-throw to be caught by the calling function
  }
};

export const sendWelcomeEmail = async (userName, userEmail) => {
  try {
    const emailSubject = "🎉 Welcome to Fromboom - Let's Get Started!";
    const emailText = `Welcome to Fromboom, ${userName}! We're excited to have you on board.`;
    const emailHtml = welcomeEmailHtml(userName, userEmail);

    logger.info({
      name: 'ATTEMPTING_WELCOME_EMAIL_SEND',
      data: {
        to: userEmail,
        subject: emailSubject,
        userName,
      },
    });

    const result = await sendMail(userEmail, emailSubject, emailText, emailHtml);

    logger.info({
      name: 'WELCOME_EMAIL_SEND_SUCCESS',
      data: {
        to: userEmail,
        messageId: result.messageId,
      },
    });

    return result;
  } catch (error) {
    logger.error({
      name: 'SEND_WELCOME_EMAIL_FAILED',
      data: {
        userEmail,
        userName,
        error: error.message,
        stack: error.stack,
      },
    });
    // Don't throw - we don't want to block user signup if email fails
    return null;
  }
};
