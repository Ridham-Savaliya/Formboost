import { sendMail } from '#service/mailservice.js';
import logger from '#utils/logger.js';
import submissionEmailHtml from './html/submissionEmailHtml.js';

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
