import { Op } from 'sequelize';
import moment from 'moment';
import User from '#modules/user/model.js';
import Form from '#modules/form/model.js';
import { FormSubmission } from '#modules/form-submission/model.js';
import admin from '#service/firebase.js';
import { throwAppError, handleError } from '#utils/exception.js';

const fetchUserById = async (id) => {
  const user = await User.findOne({ where: { id } });
  if (!user) {
    throwAppError({
      name: 'USER_NOT_FOUND',
      message: 'User not found',
      status: 404,
    });
  }
  return user;
};

export const getUserById = async (id) => {
  try {
    return await fetchUserById(id);
  } catch (error) {
    handleError('GET_USER_BY_ID_FAILED', error);
  }
};

export const updateUser = async (userId, payload) => {
  try {
    const user = await fetchUserById(userId);

    if (payload.password) {
      if (!user.firebase_UID) {
        throwAppError({
          name: 'FIREBASE_UID_MISSING',
          message: 'Firebase UID is missing for the user',
          status: 400,
        });
      }

      await admin.auth().updateUser(user.firebase_UID, {
        password: payload.password,
      });
    }

    Object.assign(user, payload);
    const updatedUser = await user.save();

    return {
      updatedUser,
    };
  } catch (error) {
    handleError('UPDATE_USER_FAILED', error);
  }
};

export const deleteUser = async (id) => {
  try {
    const affectedRows = await User.destroy({ where: { id } });
    return { isDeleted: Boolean(affectedRows) };
  } catch (error) {
    handleError('DELETE_USER_FAILED', error);
  }
};

export const getUserForms = async (userId) => {
  try {
    return await Form.findAll({ where: { userId } });
  } catch (error) {
    handleError('GET_USER_FORMS_FAILED', error);
  }
};

export const getUserDashboardData = async (userId) => {
  try {
    const totalForms = await Form.count({ where: { userId } });

    const totalSubmissionsAllTime = await FormSubmission.count({
      include: [{ model: Form, where: { userId } }],
    });

    const startOfThisMonth = moment().startOf('month');
    const endOfThisMonth = moment().endOf('month');

    const startOfLastMonth = moment().subtract(1, 'month').startOf('month');
    const endOfLastMonth = moment().subtract(1, 'month').endOf('month');

    const totalSubmissionsThisMonth = await FormSubmission.count({
      where: {
        submittedAt: {
          [Op.between]: [startOfThisMonth.toDate(), endOfThisMonth.toDate()],
        },
      },
      include: [{ model: Form, where: { userId } }],
    });

    const totalSubmissionsLastMonth = await FormSubmission.count({
      where: {
        submittedAt: {
          [Op.between]: [startOfLastMonth.toDate(), endOfLastMonth.toDate()],
        },
      },
      include: [{ model: Form, where: { userId } }],
    });

    return {
      totalForms,
      totalSubmissionsAllTime,
      totalSubmissionsThisMonth,
      totalSubmissionsLastMonth,
    };
  } catch (error) {
    handleError('FETCH_DASHBOARD_STATS_FAILED', error);
  }
};

export const updateUserPassword = async (userId, newPassword) => {
  try {
    if (!newPassword) {
      throwAppError({
        name: 'PASSWORD_REQUIRED',
        message: 'New password is required',
        status: 400,
      });
    }

    const user = await fetchUserById(userId);

    if (!user.firebase_UID) {
      throwAppError({
        name: 'FIREBASE_UID_MISSING',
        message: 'Firebase UID is missing',
        status: 400,
      });
    }

    await admin.auth().updateUser(user.firebase_UID, {
      password: newPassword,
    });

    return { success: true };
  } catch (error) {
    handleError('UPDATE_USER_PASSWORD_FAILED', error);
  }
};
