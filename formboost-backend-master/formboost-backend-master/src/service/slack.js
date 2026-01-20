import axios from 'axios';
import logger from '#utils/logger.js';

/**
 * Send message to Slack webhook
 * @param {string} webhookUrl - Slack webhook URL
 * @param {object} form - Form object
 * @param {object} formData - Form submission data
 * @param {string} ipAddress - Submitter IP
 * @returns {Promise<object>} - Delivery result
 */
export const sendSlackMessage = async (webhookUrl, form, formData, ipAddress) => {
  try {
    const message = formatSlackMessage(form, formData, ipAddress);

    const response = await axios.post(webhookUrl, message, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Formboom-Slack/1.0',
      },
    });

    if (response.status === 200) {
      logger.info({
        name: 'SLACK_MESSAGE_SENT',
        data: { formId: form.id, statusCode: response.status },
      });
      return { success: true, statusCode: response.status };
    }

    return { success: false, statusCode: response.status, error: 'Slack API error' };
  } catch (error) {
    logger.error({
      name: 'SLACK_SEND_ERROR',
      data: { formId: form.id, error: error.message },
    });
    return { success: false, error: error.message };
  }
};

/**
 * Format form submission for Slack
 * @param {object} form - Form object
 * @param {object} formData - Form submission data
 * @param {string} ipAddress - Submitter IP
 * @returns {object} - Slack message payload
 */
export const formatSlackMessage = (form, formData, ipAddress) => {
  const fields = Object.entries(formData).map(([key, value]) => ({
    title: key.charAt(0).toUpperCase() + key.slice(1),
    value: String(value),
    short: String(value).length < 50,
  }));

  return {
    text: `New form submission received!`,
    attachments: [
      {
        color: '#36a64f',
        title: `📝 ${form.formName}`,
        text: form.formDescription,
        fields: [
          ...fields,
          {
            title: 'IP Address',
            value: ipAddress,
            short: true,
          },
          {
            title: 'Submitted At',
            value: new Date().toLocaleString(),
            short: true,
          },
        ],
        footer: 'Formboom',
        footer_icon: 'https://Formboom.com/favicon.ico',
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };
};

/**
 * Test Slack webhook
 * @param {string} webhookUrl - Slack webhook URL
 * @param {object} form - Form object
 * @returns {Promise<object>} - Test result
 */
export const testSlackWebhook = async (webhookUrl, form) => {
  const testData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    message: 'This is a test message from Formboom.',
  };

  return await sendSlackMessage(webhookUrl, form, testData, '127.0.0.1');
};
