import * as service from '#modules/admin/service.js';
import { sendSuccessResponse, sendCSVResponse } from '#utils/responseHandler.js';
import { throwAppError, handleControllerError } from '#utils/exception.js';

export const getAll = async (req, res, next) => {
  try {
    const data = await service.findAll(req.query);
    return sendSuccessResponse({ res, message: 'Admins fetched', data });
  } catch (error) {
    handleControllerError('GET_ALL_ADMINS_ERROR', error, next);
  }
};

export const getById = async (req, res, next) => {
  try {
    const data = await service.findById(req.params.id);
    return sendSuccessResponse({ res, message: 'Admin fetched', data });
  } catch (error) {
    handleControllerError('GET_ADMIN_BY_ID_ERROR', error, next);
  }
};

export const updateAdmin = async (req, res, next) => {
  try {
    const data = await service.updateAdmin(req.params.id, req.body);
    return sendSuccessResponse({ res, message: 'Admin updated', data });
  } catch (error) {
    handleControllerError('UPDATE_ADMIN_ERROR', error, next);
  }
};

export const removeAdmin = async (req, res, next) => {
  try {
    const affectedRows = await service.deleteAdmin(req.params.id);
    return sendSuccessResponse({
      res,
      message: 'Admin deleted',
      data: { affectedRows },
    });
  } catch (error) {
    handleControllerError('DELETE_ADMIN_ERROR', error, next);
  }
};

export const getAdminByToken = async (req, res, next) => {
  try {
    const data = await service.findById(req.requestor.id);
    return sendSuccessResponse({ res, message: 'Admin fetched by token', data });
  } catch (error) {
    handleControllerError('GET_ADMIN_BY_TOKEN_ERROR', error, next);
  }
};

export const getAllWithPagination = async (req, res, next) => {
  try {
    const { data } = await service.paginateAdmins(req.query);
    return sendSuccessResponse({
      res,
      message: 'Admins paginated',
      data,
    });
  } catch (error) {
    handleControllerError('PAGINATE_ADMINS_ERROR', error, next);
  }
};

export const getAlluser = async (req, res, next) => {
  try {
    const data = await service.findAllUsers(req.query);
    return sendSuccessResponse({ res, message: 'Users fetched', data });
  } catch (error) {
    handleControllerError('GET_ALL_USERS_ERROR', error, next);
  }
};

export const getAlluserWithPagination = async (req, res, next) => {
  try {
    const { data } = await service.paginateUsers(req.query);
    return sendSuccessResponse({
      res,
      message: 'Users paginated',
      data,
    });
  } catch (error) {
    handleControllerError('PAGINATE_USERS_ERROR', error, next);
  }
};

export const getAllform = async (req, res, next) => {
  try {
    const data = await service.findAllForms(req.query);
    return sendSuccessResponse({ res, message: 'Forms fetched', data });
  } catch (error) {
    handleControllerError('GET_ALL_FORMS_ERROR', error, next);
  }
};

export const getAllformWithPagination = async (req, res, next) => {
  try {
    const { data } = await service.paginateForms(req.query);
    return sendSuccessResponse({
      res,
      message: 'Forms paginated',
      data,
    });
  } catch (error) {
    handleControllerError('PAGINATE_FORMS_ERROR', error, next);
  }
};

export const getAllcsv = async (req, res, next) => {
  try {
    const { rows } = await service.findAll(req.query);
    if (!rows.length) {
      throwAppError({ name: 'NO_ADMIN_DATA', message: 'No admin data found', status: 404 });
    }
    const data = rows.map((d) => d.dataValues);
    return sendCSVResponse(res, 'Admin_List.csv', Object.keys(data[0]), data);
  } catch (error) {
    handleControllerError('EXPORT_ADMIN_CSV_ERROR', error, next);
  }
};

export const getAllusercsv = async (req, res, next) => {
  try {
    const { rows } = await service.findAllUsers(req.query);
    if (!rows.length) {
      throwAppError({ name: 'NO_USER_DATA', message: 'No user data found', status: 404 });
    }
    const data = rows.map((d) => d.dataValues);
    return sendCSVResponse(res, 'User_List.csv', Object.keys(data[0]), data);
  } catch (error) {
    handleControllerError('EXPORT_USER_CSV_ERROR', error, next);
  }
};

export const getAllformcsv = async (req, res, next) => {
  try {
    const { rows } = await service.findAllForms(req.query);
    if (!rows.length) {
      throwAppError({ name: 'NO_FORM_DATA', message: 'No form data found', status: 404 });
    }
    const data = rows.map((d) => d.dataValues);
    return sendCSVResponse(res, 'Form_List.csv', Object.keys(data[0]), data);
  } catch (error) {
    handleControllerError('EXPORT_FORM_CSV_ERROR', error, next);
  }
};
