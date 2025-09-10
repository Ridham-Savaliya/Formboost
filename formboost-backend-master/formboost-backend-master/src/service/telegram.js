import axios from 'axios';
import logger from '#utils/logger.js';

/**
 * Send a message to a Telegram chat using a bot token
 * @param {string} botToken - The Telegram bot token
 * @param {string} chatId - The Telegram chat ID
 * @param {string} message - The message to send
 * @returns {Promise<boolean>} - True if the message was sent successfully
 */
export const sendTelegramMessage = async (botToken, chatId, message) => {
  try {
    if (!botToken || !chatId) {
      logger.warn({
        name: 'TELEGRAM_MISSING_CREDENTIALS',
        data: { botToken: !!botToken, chatId: !!chatId },
      });
      return false;
    }

    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }
    );

    if (response.data && response.data.ok) {
      logger.info({
        name: 'TELEGRAM_MESSAGE_SENT',
        data: { chatId },
      });
      return true;
    } else {
      logger.warn({
        name: 'TELEGRAM_SEND_FAILED',
        data: { response: response.data },
      });
      return false;
    }
  } catch (error) {
    logger.error({
      name: 'TELEGRAM_ERROR',
      data: {
        error: error.message,
        response: error.response?.data,
      },
    });
    return false;
  }
};

/**
 * Format form submission data for Telegram
 * @param {object} form - The form object
 * @param {object} formData - The form submission data
 * @param {string} ipAddress - The IP address of the submitter
 * @returns {string} - Formatted HTML message
 */
export const formatTelegramSubmissionMessage = (form, formData, ipAddress) => {
  let message = `<b>New Form Submission</b>\n\n`;
  message += `<b>Form:</b> ${form.formName}\n`;
  message += `<b>Description:</b> ${form.formDescription}\n\n`;
  
  message += `<b>Submission Details:</b>\n`;
  
  // Add all form fields
  Object.entries(formData).forEach(([key, value]) => {
    // Escape HTML special characters
    const safeValue = String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
      
    message += `<b>${key}:</b> ${safeValue}\n`;
  });
  
  message += `\n<b>IP Address:</b> ${ipAddress}`;
  
  return message;
};

/**
 * Try to read the latest chat id for this bot from getUpdates.
 * User must have sent at least one message to the bot (/start) beforehand.
 * @param {string} botToken
 * @returns {Promise<string|null>} chatId or null if not found
 */
export const getLatestChatId = async (botToken) => {
  try {
    if (!botToken) return null;
    const url = `https://api.telegram.org/bot${botToken}/getUpdates`;
    const response = await axios.get(url, { timeout: 10000 });
    const updates = response.data?.result || [];
    for (let i = updates.length - 1; i >= 0; i -= 1) {
      const upd = updates[i];
      const chatId = upd?.message?.chat?.id || upd?.channel_post?.chat?.id || upd?.edited_message?.chat?.id;
      if (chatId) return String(chatId);
    }
    return null;
  } catch (error) {
    logger.warn({ name: 'TELEGRAM_GET_UPDATES_FAILED', data: { error: error.message } });
    return null;
  }
};