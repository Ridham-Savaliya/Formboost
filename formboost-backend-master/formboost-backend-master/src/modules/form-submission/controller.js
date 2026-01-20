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

    const result = await service.submitFormData(req.params.alias, req.body, ipAddress);

    if (wantsJson) {
      return sendSuccessResponse({
        res,
        statusCode: 201,
        message: 'Form submitted successfully',
        data: result,
      });
    } else {
      // Serve our custom success page with details via query params
      const url = new URL(`${req.protocol}://${req.get('host')}/success.html`);
      if (result?.id) url.searchParams.set('ref', result.id);
      if (result?.submittedAt)
        url.searchParams.set('ts', new Date(result.submittedAt).toISOString());
      const referrer = req.body?._fb_back || req.get('referer') || '';
      console.log('Formboom Debug - _fb_back:', req.body?._fb_back);
      console.log('Formboom Debug - referer header:', req.get('referer'));
      console.log('Formboom Debug - final referrer:', referrer);
      // Do NOT double-encode. URLSearchParams will encode automatically.
      if (referrer) url.searchParams.set('back', referrer);
      return res.redirect(url.toString());
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
      // Serve error page or redirect to success page anyway
      return res.sendFile('success.html', { root: './src/public' });
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
