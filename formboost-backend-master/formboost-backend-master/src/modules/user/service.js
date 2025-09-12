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
      if (!user.firebaseUid) {
        throwAppError({
          name: 'FIREBASE_UID_MISSING',
          message: 'Firebase UID is missing for the user',
          status: 400,
        });
      }

      if (!admin || typeof admin.auth !== 'function') {
        throwAppError({
          name: 'FIREBASE_NOT_CONFIGURED',
          message: 'Cannot update password because Firebase Admin is not configured',
          status: 503,
        });
      }

      await admin.auth().updateUser(user.firebaseUid, {
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

    if (!user.firebaseUid) {
      throwAppError({
        name: 'FIREBASE_UID_MISSING',
        message: 'Firebase UID is missing',
        status: 400,
      });
    }

    if (!admin || typeof admin.auth !== 'function') {
      throwAppError({
        name: 'FIREBASE_NOT_CONFIGURED',
        message: 'Cannot update password because Firebase Admin is not configured',
        status: 503,
      });
    }

    await admin.auth().updateUser(user.firebaseUid, {
      password: newPassword,
    });

    return { success: true };
  } catch (error) {
    handleError('UPDATE_USER_PASSWORD_FAILED', error);
  }
};

export const getNotificationLimits = async (userId) => {
  try {
    // Get current month's email notification count
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Count email notifications sent this month (using a simple count for now)
    // Since we don't have emailSent column, we'll count all submissions and estimate
    const totalSubmissions = await FormSubmission.count({
      include: [
        {
          model: Form,
          where: { userId },
          attributes: [],
        },
      ],
      where: {
        createdAt: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
    });

    // For now, assume 80% of submissions trigger email notifications
    const emailCount = Math.floor(totalSubmissions * 0.8);

    return {
      emailUsed: emailCount,
      emailLimit: 50,
      telegramUsed: 'unlimited',
      telegramLimit: 'unlimited',
    };
  } catch (error) {
    handleError('GET_NOTIFICATION_LIMITS_FAILED', error);
  }
};
