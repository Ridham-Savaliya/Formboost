import { verifyToken } from '#utils/jwt.js';
import { handleControllerError, throwAppError } from '#utils/exception.js';
import { Roles } from '#constants/roles.js';
import User from '#modules/user/model.js';
import Admin from '#modules/admin/model.js';

export const protectRoute = (roles) => async (req, res, next) => {
  try {
    // Check if requestor exists and has a role
    if (!req.requestor || !req.requestor.role) {
      throwAppError({
        name: 'UNAUTHORIZED_ERROR',
        message: 'Authentication required',
        status: 401,
      });
    }
    
    if (!roles.includes(req.requestor.role)) {
      throwAppError({
        name: 'UNAUTHORIZED_ERROR',
        message: 'You do not have permission to access this resource',
        status: 403,
      });
    }
    next();
  } catch (err) {
    handleControllerError('PROTECT_ROUTE_ERROR', err, next);
  }
};

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer') ? authHeader.split(' ')[1] : null;

    if (!token) {
      throwAppError({
        name: 'TOKEN_NOT_PROVIDED',
        message: 'Token not provided',
        status: 401,
      });
    }

    const jwtUser = await verifyToken(token);
    let payload = typeof jwtUser === 'string' ? {} : jwtUser;
    let requestor;
    let role;

    if (payload.role === Roles.USER) {
      requestor = await User.findOne({ where: { id: payload.id } });
      role = Roles.USER;
    } else if (payload.role === Roles.ADMIN) {
      requestor = await Admin.findOne({ where: { id: payload.id } });
      role = Roles.ADMIN;
    }

    if (!requestor) {
      throwAppError({
        name: 'USER_NOT_FOUND',
        message: 'User not found',
        status: 401,
      });
    }
    req.requestor = requestor;
    req.requestor.role = role;
    next();
  } catch (error) {
    handleControllerError('AUTH_MIDDLEWARE_ERROR', error, next);
  }
};
