import * as service from '#modules/form/service.js';
import { sendSuccessResponse } from '#utils/responseHandler.js';
import { handleControllerError } from '#utils/exception.js';

export const getById = async (req, res, next) => {
  try {
    const data = await service.findOne(req.params.id);

    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'Form fetched successfully',
      data,
    });
  } catch (error) {
    handleControllerError('GET_FORM_BY_ID_ERROR', error, next);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const data = await service.findAndCountAll(req.query);

    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'Forms fetched successfully',
      data,
    });
  } catch (error) {
    handleControllerError('GET_ALL_FORMS_ERROR', error, next);
  }
};

export const createForm = async (req, res, next) => {
  try {
    const data = await service.createForm(req.body, req.requestor.id);

    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'Form created successfully',
      data,
    });
  } catch (error) {
    handleControllerError('CREATE_FORM_ERROR', error, next);
  }
};

export const updateForm = async (req, res, next) => {
  try {
    const data = await service.updateForm(req.body, req.params.id);

    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'Form updated successfully',
      data,
    });
  } catch (error) {
    handleControllerError('UPDATE_FORM_ERROR', error, next);
  }
};

export const removeForm = async (req, res, next) => {
  try {
    const data = await service.removeForm(req.params.id);

    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'Form removed successfully',
      data,
    });
  } catch (error) {
    handleControllerError('DELETE_FORM_ERROR', error, next);
  }
};

export const updateFormTargetEmail = async (req, res, next) => {
  try {
    const data = await service.updateFormTargetEmail(req.params.id, req.body.targetEmail);

    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'Target email updated successfully',
      data,
    });
  } catch (error) {
    handleControllerError('UPDATE_TARGET_EMAIL_ERROR', error, next);
  }
};

export const updateTelegramSettings = async (req, res, next) => {
  try {
    const { telegramNotification, telegramChatId, telegramBotToken } = req.body;
    const data = await service.updateTelegramSettings(
      req.params.id, 
      telegramNotification, 
      telegramChatId, 
      telegramBotToken
    );

    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'Telegram settings updated successfully',
      data,
    });
  } catch (error) {
    handleControllerError('UPDATE_TELEGRAM_SETTINGS_ERROR', error, next);
  }
};

export const sendTestNotifications = async (req, res, next) => {
  try {
    const data = await service.sendTestNotifications(req.params.id);

    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'Test notifications dispatched',
      data,
    });
  } catch (error) {
    handleControllerError('SEND_TEST_NOTIFICATIONS_ERROR', error, next);
  }
};

export const getTelegramChatId = async (req, res, next) => {
  try {
    const { botToken } = req.query;
    const data = await service.resolveTelegramChatId(botToken);
    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'Resolved latest Telegram chat ID (if any)',
      data,
    });
  } catch (error) {
    handleControllerError('GET_TELEGRAM_CHAT_ID_ERROR', error, next);
  }
};
