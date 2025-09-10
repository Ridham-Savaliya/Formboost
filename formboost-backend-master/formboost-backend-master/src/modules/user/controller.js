import * as userService from '#modules/user/service.js';
import { sendSuccessResponse } from '#utils/responseHandler.js';
import { handleControllerError } from '#utils/exception.js';

export const getUserById = async (req, res, next) => {
  try {
    const data = await userService.getUserById(req.params.id);
    return sendSuccessResponse({
      res,
      message: 'User fetched successfully',
      data,
    });
  } catch (error) {
    handleControllerError('GET_USER_BY_ID', error, next);
  }
};

export const getUserByToken = async (req, res, next) => {
  try {
    const data = await userService.getUserById(req.requestor.id);
    return sendSuccessResponse({
      res,
      message: 'User fetched successfully',
      data,
    });
  } catch (error) {
    handleControllerError('GET_USER_BY_TOKEN', error, next);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const data = await userService.updateUser(req.requestor.id, req.body);
    return sendSuccessResponse({
      res,
      message: 'User updated successfully',
      data,
    });
  } catch (error) {
    handleControllerError('UPDATE_USER', error, next);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const data = await userService.deleteUser(req.params.id);
    return sendSuccessResponse({
      res,
      message: 'User deleted successfully',
      data,
    });
  } catch (error) {
    handleControllerError('DELETE_USER', error, next);
  }
};

export const getUserForms = async (req, res, next) => {
  try {
    const data = await userService.getUserForms(req.params.id);
    return sendSuccessResponse({
      res,
      message: 'Forms fetched successfully',
      data,
    });
  } catch (error) {
    handleControllerError('GET_USER_FORMS', error, next);
  }
};

export const getUserDashboardData = async (req, res, next) => {
  try {
    const data = await userService.getUserDashboardData(req.requestor.id);
    return sendSuccessResponse({
      res,
      message: 'Dashboard data fetched successfully',
      data,
    });
  } catch (error) {
    handleControllerError('GET_DASHBOARD_DATA', error, next);
  }
};

export const updateUserPassword = async (req, res, next) => {
  try {
    const data = await userService.updateUserPassword(req.requestor.id, req.body.newPassword);
    return sendSuccessResponse({
      res,
      message: 'Password updated successfully',
      data,
    });
  } catch (error) {
    handleControllerError('UPDATE_USER_PASSWORD', error, next);
  }
};

export const getNotificationLimits = async (req, res, next) => {
  try {
    const data = await userService.getNotificationLimits(req.params.id);
    return sendSuccessResponse({
      res,
      message: 'Notification limits retrieved successfully',
      data,
    });
  } catch (error) {
    handleControllerError('GET_NOTIFICATION_LIMITS', error, next);
  }
};
