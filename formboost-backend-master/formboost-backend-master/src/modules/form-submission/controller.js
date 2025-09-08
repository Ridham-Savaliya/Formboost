import * as service from '#modules/form-submission/service.js';
import { sendSuccessResponse } from '#utils/responseHandler.js';
import { handleControllerError } from '#utils/exception.js';
import logger from '#utils/logger.js';

export const downloadCSV = async (req, res, next) => {
  try {
    const csvResult = await service.downloadCSV(req.params.id, req.query);
    res.header('Content-Type', 'text/csv');
    res.attachment(csvResult.filename);
    return res.status(200).send(csvResult.csv);
  } catch (error) {
    return handleControllerError('DOWNLOAD_CSV', error, next);
  }
};

export const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);
    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'Submission retrieved successfully',
      data,
    });
  } catch (error) {
    return handleControllerError('GET_BY_ID', error, next);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const data = await service.getAll(req.query);
    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'Submissions retrieved successfully',
      data,
    });
  } catch (error) {
    return handleControllerError('GET_ALL', error, next);
  }
};

export const submitFormData = async (req, res, next) => {
  const wantsJson =
    req.headers['accept']?.includes('application/json') ||
    req.headers['content-type']?.includes('application/json');
  try {
    const ipAddress =
      req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';

    service.submitFormData(req.params.alias, req.body, ipAddress);

    if (wantsJson) {
      return sendSuccessResponse({
        res,
        statusCode: 201,
        message: 'Form submitted successfully',
      });
    } else {
      return res.redirect('https://formboost.site/');
    }
  } catch (error) {
    if (wantsJson) {
      return handleControllerError('CREATE_SUBMISSION', error, next);
    } else {
      const level = error.status >= 500 ? 'error' : 'warn';
      logger.log(level, {
        name: 'CREATE_SUBMISSION',
        data: {
          error,
        },
      });
      return res.redirect('https://formboost.site/');
    }
  }
};

export const getAllWithPagination = async (req, res, next) => {
  try {
    const result = await service.getAllWithPagination(req.params.id, req.query);
    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'Submissions retrieved with pagination',
      data: result,
    });
  } catch (error) {
    return handleControllerError('GET_ALL_WITH_PAGINATION', error, next);
  }
};

export const getAllSubmissionByUserId = async (req, res, next) => {
  try {
    const data = await service.getAllSubmissionByUserId(req.requestor.id);
    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'User submissions retrieved successfully',
      data,
    });
  } catch (error) {
    return handleControllerError('GET_SUBMISSIONS_BY_USER', error, next);
  }
};

export const getAllSubmissionByFormId = async (req, res, next) => {
  try {
    const data = await service.getAllSubmissionByFormId(req.params.id, req.requestor.id);
    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'Submissions by form retrieved successfully',
      data,
    });
  } catch (error) {
    return handleControllerError('GET_SUBMISSIONS_BY_FORM', error, next);
  }
};

export const submissionQuota = async (req, res, next) => {
  try {
    const data = await service.submissionQuota(req.requestor.id);
    return sendSuccessResponse({
      res,
      statusCode: 200,
      message: 'Submission quota retrieved successfully',
      data,
    });
  } catch (error) {
    return handleControllerError('SUBMISSION_QUOTA', error, next);
  }
};
