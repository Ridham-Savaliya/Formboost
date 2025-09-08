import sequelize from '#database/config.js';
import firebase from '#service/firebase.js';
import { handleError, throwAppError } from '#utils/exception.js';
import { getJwtToken, verifyToken } from '#utils/jwt.js';
import { Roles } from '#constants/roles.js';
import User from '#modules/user/model.js';
import Admin from '#modules/admin/model.js';
import Plan from '#modules/plan/model.js';
import UserPlan from '#modules/user-plan/model.js';
import { sendToDiscord } from '#service/discord.js';

export const verifyUser = async (fbToken) => {
  const data = await firebase.auth().verifyIdToken(fbToken);

  const availableUser = await User.findOne({
    where: { firebase_UID: data.uid },
  });

  const token = availableUser
    ? getJwtToken({ id: availableUser.id, role: Roles.USER })
    : getJwtToken({ id: data.uid });

  return { userRegistered: !!availableUser, token };
};

export const createUserWithPlan = async (token, userData) => {
  const decoded = await verifyToken(token);
  const firebase_UID = decoded?.id || null;

  if (!firebase_UID) {
    throwAppError({
      name: 'INVALID_FIREBASE_TOKEN',
      message: 'Invalid Firebase token.',
      status: 401,
    });
  }

  const transaction = await sequelize.transaction();

  try {
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throwAppError({
        name: 'USER_ALREADY_EXISTS',
        message: 'User already registered. Please log in instead.',
        status: 409,
      });
    }

    const newUser = await User.create({ firebase_UID, ...userData }, { transaction });

    if (!newUser) {
      throwAppError({
        name: 'USER_CREATION_BUT_NOT_FOUND',
        message: 'User created but not found in database.',
        status: 404,
      });
    }

    const freePlan = await Plan.findOne({
      where: { isFree: true },
    });

    if (!freePlan) {
      throwAppError({
        name: 'FREE_PLAN_NOT_FOUND',
        message: 'Free plan configuration not found.',
        status: 500,
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);

    await UserPlan.create(
      {
        userId: newUser.id,
        planId: freePlan.id,
        startDate,
        endDate,
        isActive: true,
      },
      { transaction }
    );

    await transaction.commit();

    sendToDiscord('newSignUpChannel', {
      embeds: [
        {
          title: 'New User Registered',
          description: `A new user has registered with email: ${newUser.email}`,
          fields: [
            { name: 'User ID', value: newUser.id },
            { name: 'Email', value: newUser.email },
            { name: 'Name', value: newUser.name },
          ],
          color: 3394611,
          timestamp: new Date().toISOString(),
        },
      ],
    });

    const appToken = getJwtToken({ id: newUser.id, role: Roles.USER });

    return { token: appToken };
  } catch (error) {
    await transaction.rollback();
    handleError('CREATE_USER_SERVICE', error);
  }
};

export const loginAdmin = async (data) => {
  const { email, password } = data;

  const adminRecord = await Admin.findOne({ where: { email } });
  if (!adminRecord) {
    throwAppError({
      name: 'ADMIN_NOT_FOUND',
      message: 'Invalid email address.',
      status: 401,
    });
  }

  const isPasswordValid = await adminRecord.validPassword(password);
  if (!isPasswordValid) {
    throwAppError({
      name: 'ADMIN_INVALID_PASSWORD',
      message: 'Invalid password.',
      status: 401,
    });
  }

  return getJwtToken({ id: adminRecord.id, role: Roles.ADMIN });
};

export const createAdmin = async (data) => {
  const { email } = data;

  const existingAdmin = await Admin.findOne({ where: { email } });
  if (existingAdmin) {
    throwAppError({
      name: 'ADMIN_ALREADY_EXISTS',
      message: 'Admin already registered. Please log in instead.',
      status: 409,
    });
  }

  const newAdmin = await Admin.create(data);
  return getJwtToken({ id: newAdmin.id, role: Roles.ADMIN });
};
