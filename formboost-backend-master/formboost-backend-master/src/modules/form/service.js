import Form from '#modules/form/model.js';
import { nanoid } from 'nanoid';
import { throwAppError, handleError } from '#utils/exception.js';
import { sqquery } from '#utils/query.js';
import { sendToDiscord } from '#service/discord.js';
import { sendSubmissionMail } from '#utils/mail/index.js';
import {
  sendTelegramMessage,
  formatTelegramSubmissionMessage,
  getLatestChatId,
  getBotInfo,
} from '#service/telegram.js';
import { sendWebhook, formatWebhookPayload, testWebhook } from '#service/webhook.js';
import { sendSlackMessage, testSlackWebhook } from '#service/slack.js';
import { addToGoogleSheet, testGoogleSheetsIntegration } from '#service/googlesheets.js';

export const findOne = async (formId) => {
  try {
    const form = await Form.findOne({ where: { id: formId } });

    if (!form) {
      throwAppError({
        name: 'FORM_NOT_FOUND',
        message: 'Form not found.',
        status: 404,
      });
    }

    return form;
  } catch (error) {
    handleError('SERVICE_FIND_ONE_FORM_ERROR', error);
  }
};

export const findAndCountAll = async (queryParams) => {
  try {
    return await Form.findAndCountAll(sqquery(queryParams));
  } catch (error) {
    handleError('SERVICE_FIND_ALL_FORMS_ERROR', error);
  }
};

export const createForm = async (data, userId) => {
  try {
    const {
      formName,
      formDescription,
      targetEmail,
      filterSpam = true,
      emailNotification = true,
      isPrebuilt = false,
      prebuiltTemplate = null,
    } = data;

    let alias = nanoid(8);
    while (await Form.findOne({ where: { alias } })) {
      alias = nanoid(8);
    }

    // Clamp template size to avoid DB errors on unexpectedly huge payloads
    const safeTemplate =
      prebuiltTemplate && typeof prebuiltTemplate === 'string'
        ? prebuiltTemplate.length > 500000
          ? prebuiltTemplate.slice(0, 500000)
          : prebuiltTemplate
        : prebuiltTemplate;

    const form = await Form.create({
      alias,
      userId,
      formName,
      formDescription,
      targetEmail,
      filterSpam,
      emailNotification,
      isPrebuilt,
      prebuiltTemplate: safeTemplate,
    });

    sendToDiscord('formCreatedChannel', {
      embeds: [
        {
          title: 'New Form Created',
          description: `A new form has been created by <${userId}>.`,
          fields: [
            {
              name: 'Form Name',
              value: formName,
            },
            {
              name: 'Form Description',
              value: formDescription || 'No description provided.',
            },
            { name: 'Form ID', value: form.id },
          ],
          color: 33023,
          timestamp: new Date().toISOString(),
        },
      ],
    });

    return form;
  } catch (error) {
    handleError('SERVICE_CREATE_FORM_ERROR', error);
  }
};

export const updateForm = async (data, formId) => {
  try {
    const [affectedRows] = await Form.update(data, {
      where: { id: formId },
    });
    return { isUpdated: Boolean(affectedRows) };
  } catch (error) {
    handleError('SERVICE_UPDATE_FORM_ERROR', error);
  }
};

export const removeForm = async (formId) => {
  try {
    const affectedRows = await Form.destroy({
      where: { id: formId },
    });
    return { isDeleted: Boolean(affectedRows) };
  } catch (error) {
    handleError('SERVICE_DELETE_FORM_ERROR', error);
  }
};

export const updateFormTargetEmail = async (formId, targetEmail) => {
  try {
    if (!targetEmail) {
      throwAppError({
        name: 'TARGET_EMAIL_REQUIRED',
        message: 'Target email is required.',
        status: 400,
      });
    }

    const form = await Form.findOne({ where: { id: formId } });
    if (!form) {
      throwAppError({
        name: 'FORM_NOT_FOUND',
        message: 'Form not found.',
        status: 404,
      });
    }

    form.targetEmail = targetEmail;
    await form.save();

    return form;
  } catch (error) {
    handleError('SERVICE_UPDATE_TARGET_EMAIL_ERROR', error);
  }
};

export const updateTelegramSettings = async (
  formId,
  telegramNotification,
  telegramChatId,
  telegramBotToken
) => {
  try {
    const updateData = { telegramNotification };

    // Only update these fields if they are provided
    if (telegramChatId !== undefined) {
      updateData.telegramChatId = telegramChatId;
    }

    if (telegramBotToken !== undefined) {
      updateData.telegramBotToken = telegramBotToken;
    }

    const [affectedRows] = await Form.update(updateData, {
      where: { id: formId },
    });
    return { isUpdated: Boolean(affectedRows) };
  } catch (error) {
    handleError('SERVICE_UPDATE_TELEGRAM_SETTINGS_ERROR', error);
  }
};

export const sendTestNotifications = async (formId) => {
  try {
    const form = await Form.findOne({ where: { id: formId } });
    if (!form) {
      throwAppError({
        name: 'FORM_NOT_FOUND',
        message: 'Form not found.',
        status: 404,
      });
    }

    const sampleFormData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      message: 'This is a test notification from Formboost.',
    };
    const ip = '127.0.0.1';
    let emailSent = false;
    let telegramSent = false;

    // Email test
    if (form.emailNotification && form.targetEmail) {
      try {
        await sendSubmissionMail(form, sampleFormData, ip);
        emailSent = true;
      } catch {}
    }

    // Telegram test
    if (form.telegramNotification && form.telegramBotToken && form.telegramChatId) {
      try {
        const telegramMessage = formatTelegramSubmissionMessage(form, sampleFormData, ip);
        const ok = await sendTelegramMessage(
          form.telegramBotToken,
          form.telegramChatId,
          telegramMessage
        );
        telegramSent = Boolean(ok);
      } catch {}
    }

    return { success: true, emailSent, telegramSent };
  } catch (error) {
    handleError('SERVICE_SEND_TEST_NOTIFICATIONS_ERROR', error);
  }
};

export const resolveTelegramChatId = async (botToken) => {
  try {
    const chatId = await getLatestChatId(botToken);
    return { chatId };
  } catch (error) {
    handleError('SERVICE_RESOLVE_TELEGRAM_CHAT_ID_ERROR', error);
  }
};

export const validateTelegramBot = async (botToken) => {
  try {
    const info = await getBotInfo(botToken);
    if (!info) {
      throwAppError({
        name: 'INVALID_TELEGRAM_BOT',
        message: 'Invalid Telegram bot token.',
        status: 400,
      });
    }
    return info;
  } catch (error) {
    handleError('SERVICE_VALIDATE_TELEGRAM_BOT_ERROR', error);
  }
};

export const updateWebhookSettings = async (formId, webhookUrl, webhookEnabled) => {
  try {
    const updateData = { webhookEnabled };

    if (webhookUrl !== undefined) {
      updateData.webhookUrl = webhookUrl;
    }

    const [affectedRows] = await Form.update(updateData, {
      where: { id: formId },
    });
    return { isUpdated: Boolean(affectedRows) };
  } catch (error) {
    handleError('SERVICE_UPDATE_WEBHOOK_SETTINGS_ERROR', error);
  }
};

export const updateSlackSettings = async (formId, slackWebhookUrl, slackEnabled) => {
  try {
    const updateData = { slackEnabled };

    if (slackWebhookUrl !== undefined) {
      updateData.slackWebhookUrl = slackWebhookUrl;
    }

    const [affectedRows] = await Form.update(updateData, {
      where: { id: formId },
    });
    return { isUpdated: Boolean(affectedRows) };
  } catch (error) {
    handleError('SERVICE_UPDATE_SLACK_SETTINGS_ERROR', error);
  }
};

export const updateGoogleSheetsSettings = async (formId, googleSheetsId, googleSheetsEnabled) => {
  try {
    const updateData = { googleSheetsEnabled };

    if (googleSheetsId !== undefined) {
      updateData.googleSheetsId = googleSheetsId;
    }

    const [affectedRows] = await Form.update(updateData, {
      where: { id: formId },
    });
    return { isUpdated: Boolean(affectedRows) };
  } catch (error) {
    handleError('SERVICE_UPDATE_GOOGLE_SHEETS_SETTINGS_ERROR', error);
  }
};

export const testFormWebhook = async (formId) => {
  try {
    const form = await Form.findOne({ where: { id: formId } });
    if (!form) {
      throwAppError({
        name: 'FORM_NOT_FOUND',
        message: 'Form not found.',
        status: 404,
      });
    }

    if (!form.webhookUrl) {
      throwAppError({
        name: 'WEBHOOK_URL_REQUIRED',
        message: 'Webhook URL is required.',
        status: 400,
      });
    }

    const result = await testWebhook(form.webhookUrl, form);
    return result;
  } catch (error) {
    handleError('SERVICE_TEST_WEBHOOK_ERROR', error);
  }
};

export const testFormSlack = async (formId) => {
  try {
    const form = await Form.findOne({ where: { id: formId } });
    if (!form) {
      throwAppError({
        name: 'FORM_NOT_FOUND',
        message: 'Form not found.',
        status: 404,
      });
    }

    if (!form.slackWebhookUrl) {
      throwAppError({
        name: 'SLACK_WEBHOOK_URL_REQUIRED',
        message: 'Slack webhook URL is required.',
        status: 400,
      });
    }

    const result = await testSlackWebhook(form.slackWebhookUrl, form);
    return result;
  } catch (error) {
    handleError('SERVICE_TEST_SLACK_ERROR', error);
  }
};

export const testFormGoogleSheets = async (formId) => {
  try {
    const form = await Form.findOne({ where: { id: formId } });
    if (!form) {
      throwAppError({
        name: 'FORM_NOT_FOUND',
        message: 'Form not found.',
        status: 404,
      });
    }

    if (!form.googleSheetsId) {
      throwAppError({
        name: 'GOOGLE_SHEETS_ID_REQUIRED',
        message: 'Google Sheets ID is required.',
        status: 400,
      });
    }

    const result = await testGoogleSheetsIntegration(form.googleSheetsId, form);
    return result;
  } catch (error) {
    handleError('SERVICE_TEST_GOOGLE_SHEETS_ERROR', error);
  }
};
