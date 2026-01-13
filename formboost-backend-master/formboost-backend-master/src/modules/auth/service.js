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
import crypto from 'crypto';

export const verifyUser = async (fbToken) => {
  // Ensure Firebase Admin is configured before using it
  if (!firebase || typeof firebase.auth !== 'function') {
    // Dev fallback: allow insecure auth to simplify local setup
    if (process.env.ALLOW_INSECURE_DEV_AUTH === 'true') {
      // Derive a STABLE identifier from the Firebase ID token payload (unverified) so it
      // stays consistent across logins. Hash it to a short UID to avoid DB size limits.
      let stableIdSource = String(fbToken);
      let parsedEmail = null;
      try {
        // Firebase ID token is a JWT: header.payload.signature
        const parts = String(fbToken).split('.');
        if (parts.length >= 2) {
          const payloadJson = Buffer.from(parts[1], 'base64').toString('utf8');
          const payload = JSON.parse(payloadJson);
          // Prefer stable identifiers from the token payload
          stableIdSource = payload.user_id || payload.sub || payload.email || stableIdSource;
          parsedEmail = (payload.email || '').toLowerCase();
        }
      } catch {
        // Fallback to raw token hashing if parsing fails
      }

      const uid = crypto
        .createHash('sha256')
        .update(String(stableIdSource).toLowerCase())
        .digest('hex')
        .substring(0, 28);
      let availableUser = await User.findOne({
        where: { firebaseUid: uid },
        attributes: ['id'],
      });
      if (availableUser) {
        const token = getJwtToken({ id: availableUser.id, role: Roles.USER });
        return { userRegistered: true, token };
      } else {
        // Heal existing users created with old unstable UID: match by email and update UID
        if (parsedEmail) {
          const userByEmail = await User.findOne({
            where: { email: parsedEmail },
            attributes: ['id', 'firebaseUid'],
          });
          if (userByEmail) {
            // Update their firebaseUid to the new stable uid
            userByEmail.firebaseUid = uid;
            await userByEmail.save();
            const token = getJwtToken({ id: userByEmail.id, role: Roles.USER });
            return { userRegistered: true, token };
          }
        }
        // For brand-new users in dev mode, return a token that can be used for user creation
        const tempToken = getJwtToken({ id: uid });
        return { userRegistered: false, token: tempToken };
      }
    }
    throwAppError({
      name: 'FIREBASE_NOT_CONFIGURED',
      message:
        'Firebase Admin is not configured on the backend. Set FIREBASE_* env vars (service account) or enable ALLOW_INSECURE_DEV_AUTH=true for local dev.',
      status: 503,
    });
  }
  const data = await firebase.auth().verifyIdToken(fbToken);

  const availableUser = await User.findOne({
    where: { firebaseUid: data.uid },
    attributes: ['id'],
  });

  const token = availableUser
    ? getJwtToken({ id: availableUser.id, role: Roles.USER })
    : getJwtToken({ id: data.uid });

  return { userRegistered: !!availableUser, token };
};

export const createUserWithPlan = async (token, userData) => {
  const decoded = await verifyToken(token);
  const firebaseUid = decoded?.id || null;

  if (!firebaseUid) {
    throwAppError({
      name: 'INVALID_FIREBASE_TOKEN',
      message: 'Invalid Firebase token.',
      status: 401,
    });
  }

  // Normalize incoming name/email to avoid duplicates due to case/whitespace
  if (userData?.email) {
    userData.email = String(userData.email).trim().toLowerCase();
  }
  if (userData?.name) {
    userData.name = String(userData.name).trim();
  }

  const transaction = await sequelize.transaction();

  try {
    // Check if a free plan exists BEFORE creating the user to avoid partial creations
    let freePlan = await Plan.findOne({ where: { isFree: true } });

    if (!freePlan) {
      // Auto-create a default Free plan in dev/local if missing
      freePlan = await Plan.create(
        {
          name: 'Free Plan',
          description: 'Basic free plan',
          formLimit: -1,
          submissionLimit: -1,
          price: 0,
          isFree: true,
        },
        { transaction }
      );
    }

    const existingUser = await User.findOne({ where: { email: userData.email } });

    if (existingUser) {
      throwAppError({
        name: 'USER_ALREADY_EXISTS',
        message: 'User already registered. Please log in instead.',
        status: 409,
      });
    }

    let newUser;
    try {
      newUser = await User.create({ firebaseUid, ...userData }, { transaction });
    } catch (e) {
      // Handle race condition or DB-level unique constraint
      if (e?.name === 'SequelizeUniqueConstraintError') {
        throwAppError({
          name: 'USER_ALREADY_EXISTS',
          message: 'User already registered. Please log in instead.',
          status: 409,
        });
      }
      throw e;
    }

    if (!newUser) {
      throwAppError({
        name: 'USER_CREATION_BUT_NOT_FOUND',
        message: 'User created but not found in database.',
        status: 404,
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

    // Do not let Discord failures affect user signup flow
    try {
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
    } catch (discordError) {
      console.warn(
        'Discord notification failed for newSignUpChannel:',
        discordError?.message || discordError
      );
    }

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
