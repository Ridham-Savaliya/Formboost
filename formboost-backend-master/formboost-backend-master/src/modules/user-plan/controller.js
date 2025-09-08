import * as userPlanService from '#modules/user-plan/service.js';
import { sendSuccessResponse } from '#utils/responseHandler.js';
import { handleControllerError } from '#utils/exception.js';

export const getUserPlanById = async (req, res, next) => {
  try {
    const data = await userPlanService.fetchUserPlanById(req.params.id);
    return sendSuccessResponse({
      res,
      message: 'User plan fetched successfully',
      data,
    });
  } catch (error) {
    handleControllerError('GET_USER_PLAN_BY_ID', error, next);
  }
};

export const getAllUserPlans = async (req, res, next) => {
  try {
    const data = await userPlanService.fetchAllUserPlans(req.query);
    return sendSuccessResponse({
      res,
      message: 'User plans fetched successfully',
      data,
    });
  } catch (error) {
    handleControllerError('GET_ALL_USER_PLANS', error, next);
  }
};

export const downloadUserPlansCSV = async (req, res, next) => {
  try {
    const csv = await userPlanService.generateUserPlanCSV(req.query);
    res.header('Content-Type', 'text/csv');
    res.attachment('user-plans.csv');
    return res.send(csv);
  } catch (error) {
    handleControllerError('DOWNLOAD_USER_PLANS_CSV', error, next);
  }
};

export const createUserPlan = async (req, res, next) => {
  try {
    const data = await userPlanService.createUserPlan(req.requestor.id, req.body);
    return sendSuccessResponse({
      res,
      statusCode: 201,
      message: 'User plan created successfully',
      data,
    });
  } catch (error) {
    handleControllerError('CREATE_USER_PLAN', error, next);
  }
};

export const updateUserPlan = async (req, res, next) => {
  try {
    const data = await userPlanService.updateUserPlan(req.params.id, req.body);
    return sendSuccessResponse({
      res,
      message: 'User plan updated successfully',
      data,
    });
  } catch (error) {
    handleControllerError('UPDATE_USER_PLAN', error, next);
  }
};

export const deleteUserPlan = async (req, res, next) => {
  try {
    const data = await userPlanService.deleteUserPlan(req.params.id);
    return sendSuccessResponse({
      res,
      message: 'User plan deleted successfully',
      data,
    });
  } catch (error) {
    handleControllerError('DELETE_USER_PLAN', error, next);
  }
};

export const getActiveUserPlan = async (req, res, next) => {
  try {
    const data = await userPlanService.fetchActiveUserPlan(req.requestor.id);
    return sendSuccessResponse({
      res,
      message: 'Active user plan fetched successfully',
      data,
    });
  } catch (error) {
    handleControllerError('GET_ACTIVE_USER_PLAN', error, next);
  }
};
