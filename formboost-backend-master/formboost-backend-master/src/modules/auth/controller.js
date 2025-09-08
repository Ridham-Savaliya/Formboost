import * as service from '#modules/auth/service.js';
import { sendSuccessResponse } from '#utils/responseHandler.js';
import { handleControllerError, throwAppError } from '#utils/exception.js';

export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const fbToken = authHeader?.startsWith('Bearer') ? authHeader.split(' ')[1] : null;

    if (!fbToken) {
      throwAppError({
        name: 'VERIFY_USER_TOKEN_MISSING',
        message: 'Token not provided.',
        status: 401,
      });
    }

    const data = await service.verifyUser(fbToken);
    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'User verified successfully',
      data,
    });
  } catch (error) {
    handleControllerError('VERIFY_USER_CONTROLLER_ERROR', error, next);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer') ? authHeader.split(' ')[1] : null;

    if (!token) {
      throwAppError({
        name: 'CREATE_USER_TOKEN_MISSING',
        message: 'Token not provided.',
        status: 401,
      });
    }

    const data = await service.createUserWithPlan(token, req.body);
    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'User created successfully',
      data,
    });
  } catch (error) {
    handleControllerError('CREATE_USER_CONTROLLER_ERROR', error, next);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const token = await service.loginAdmin(req.body);
    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'Admin logged in successfully',
      data: { token },
    });
  } catch (error) {
    handleControllerError('ADMIN_LOGIN_CONTROLLER_ERROR', error, next);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const token = await service.createAdmin(req.body);
    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'Admin account created successfully',
      data: { token },
    });
  } catch (error) {
    handleControllerError('CREATE_ADMIN_CONTROLLER_ERROR', error, next);
  }
};
