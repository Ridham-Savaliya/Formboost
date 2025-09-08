import { sqquery } from '#utils/query.js';
import Plan from '#modules/plan/model.js';
import { throwAppError, handleError } from '#utils/exception.js';

export const getPlanById = async (id) => {
  try {
    const data = await Plan.findOne({ where: { id } });
    if (!data) {
      throwAppError({
        name: 'PLAN_NOT_FOUND',
        message: 'Plan not found',
        status: 404,
      });
    }
    return data;
  } catch (error) {
    handleError('GET_PLAN_BY_ID_FAILED', error);
  }
};

export const getAllPlans = async (query) => {
  try {
    return await Plan.findAndCountAll(sqquery(query));
  } catch (error) {
    handleError('GET_ALL_PLANS_FAILED', error);
  }
};

export const createPlan = async (payload) => {
  try {
    return await Plan.create(payload);
  } catch (error) {
    handleError('CREATE_PLAN_FAILED', error);
  }
};

export const updatePlan = async (id, payload) => {
  try {
    const [affectedRows] = await Plan.update(payload, { where: { id } });
    if (affectedRows === 0) {
      throwAppError({
        name: 'PLAN_UPDATE_FAILED',
        message: 'Plan update failed or no changes made',
        status: 400,
      });
    }
    return { isUpdated: true };
  } catch (error) {
    handleError('UPDATE_PLAN_FAILED', error);
  }
};

export const deletePlan = async (id) => {
  try {
    const affectedRows = await Plan.destroy({ where: { id } });
    if (affectedRows === 0) {
      throwAppError({
        name: 'PLAN_DELETE_FAILED',
        message: 'Plan deletion failed or not found',
        status: 404,
      });
    }
    return { isDeleted: true };
  } catch (error) {
    handleError('DELETE_PLAN_FAILED', error);
  }
};
