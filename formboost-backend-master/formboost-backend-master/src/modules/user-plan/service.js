import { Parser } from 'json2csv';
import { sqquery } from '#utils/query.js';
import Plan from '#modules/plan/model.js';
import UserPlan from '#modules/user-plan/model.js';
import { throwAppError, handleError } from '#utils/exception.js';

export const fetchUserPlanById = async (id) => {
  try {
    const data = await UserPlan.findOne({ where: { id } });
    if (!data) {
      throwAppError({
        name: 'USER_PLAN_NOT_FOUND',
        message: 'User plan not found',
        status: 404,
      });
    }
    return data;
  } catch (error) {
    handleError('FETCH_USER_PLAN_BY_ID_FAILED', error);
  }
};

export const fetchAllUserPlans = async (query) => {
  try {
    return await UserPlan.findAndCountAll(sqquery(query));
  } catch (error) {
    handleError('FETCH_ALL_USER_PLANS_FAILED', error);
  }
};

export const generateUserPlanCSV = async (query) => {
  try {
    const data = await UserPlan.findAndCountAll(sqquery(query));
    const csvData = data.rows.map((item) => item.dataValues);

    if (csvData.length === 0) {
      throwAppError({
        name: 'USER_PLAN_CSV_NO_DATA',
        message: 'No user plans found for CSV export',
        status: 404,
      });
    }

    const fields = Object.keys(csvData[0]);
    const parser = new Parser({ fields });
    return parser.parse(csvData);
  } catch (error) {
    handleError('GENERATE_USER_PLAN_CSV_FAILED', error);
  }
};

export const createUserPlan = async (userId, payload) => {
  try {
    await UserPlan.update({ isActive: false }, { where: { userId, isActive: true } });

    return await UserPlan.create({
      userId,
      planId: payload.planId,
      startDate: payload.startDate,
      endDate: payload.endDate,
      isActive: true,
    });
  } catch (error) {
    handleError('CREATE_USER_PLAN_FAILED', error);
  }
};

export const updateUserPlan = async (id, payload) => {
  try {
    const [affectedRows] = await UserPlan.update(payload, {
      where: { id },
    });

    if (affectedRows === 0) {
      throwAppError({
        name: 'USER_PLAN_UPDATE_FAILED',
        message: 'User plan update failed or no changes detected',
        status: 400,
      });
    }

    return { isUpdated: true };
  } catch (error) {
    handleError('UPDATE_USER_PLAN_FAILED', error);
  }
};

export const deleteUserPlan = async (id) => {
  try {
    const affectedRows = await UserPlan.destroy({ where: { id } });
    if (affectedRows === 0) {
      throwAppError({
        name: 'USER_PLAN_DELETE_FAILED',
        message: 'User plan deletion failed or not found',
        status: 404,
      });
    }
    return { isDeleted: true };
  } catch (error) {
    handleError('DELETE_USER_PLAN_FAILED', error);
  }
};

export const fetchActiveUserPlan = async (userId) => {
  try {
    const activePlan = await UserPlan.findOne({
      where: { userId, isActive: true },
      include: { model: Plan },
    });

    if (!activePlan) {
      throwAppError({
        name: 'ACTIVE_PLAN_NOT_FOUND',
        message: 'Active plan not found',
        status: 404,
      });
    }

    return activePlan;
  } catch (error) {
    handleError('FETCH_ACTIVE_USER_PLAN_FAILED', error);
  }
};
