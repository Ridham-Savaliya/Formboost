import * as planService from '#modules/plan/service.js';
import { sendSuccessResponse } from '#utils/responseHandler.js';
import { handleControllerError } from '#utils/exception.js';

export const getPlanById = async (req, res, next) => {
  try {
    const data = await planService.getPlanById(req.params.id);
    return sendSuccessResponse({
      res,
      message: 'Plan fetched successfully',
      data,
    });
  } catch (error) {
    handleControllerError('GET_PLAN_BY_ID', error, next);
  }
};

export const getAllPlans = async (req, res, next) => {
  try {
    const data = await planService.getAllPlans(req.query);
    return sendSuccessResponse({
      res,
      message: 'Plans fetched successfully',
      data,
    });
  } catch (error) {
    handleControllerError('GET_ALL_PLANS', error, next);
  }
};

export const createPlan = async (req, res, next) => {
  try {
    const data = await planService.createPlan(req.body);
    return sendSuccessResponse({
      res,
      statusCode: 201,
      message: 'Plan created successfully',
      data,
    });
  } catch (error) {
    handleControllerError('CREATE_PLAN', error, next);
  }
};

export const updatePlan = async (req, res, next) => {
  try {
    const data = await planService.updatePlan(req.params.id, req.body);
    return sendSuccessResponse({
      res,
      message: 'Plan updated successfully',
      data,
    });
  } catch (error) {
    handleControllerError('UPDATE_PLAN', error, next);
  }
};

export const deletePlan = async (req, res, next) => {
  try {
    const data = await planService.deletePlan(req.params.id);
    return sendSuccessResponse({
      res,
      message: 'Plan deleted successfully',
      data,
    });
  } catch (error) {
    handleControllerError('DELETE_PLAN', error, next);
  }
};
