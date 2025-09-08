import { sendMail } from '#service/mailservice.js';
import logger from '#utils/logger.js';
import submissionEmailHtml from './html/submissionEmailHtml.js';

export const sendSubmissionMail = async (form, formData, ip) => {
  try {
    const emailSubject = `New Submission for Your Form: ${form.formName}`;
    const emailText = `You have received a new submission on your form "${form.formName}".`;
    const emailHtml = submissionEmailHtml(formData, ip, form);
    await sendMail(form.targetEmail, emailSubject, emailText, emailHtml);
  } catch (error) {
    logger.error({
      name: 'SEND_SUBMISSION_MAIL_FAILED',
      data: {
        formId: form.id,
        formName: form.formName,
        formData,
        ip,
        error,
      },
    });
  }
};
