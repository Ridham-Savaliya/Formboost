import jwt from 'jsonwebtoken';
import config from '#config/index.js';
import { throwAppError } from '#utils/exception.js';

export async function verifyToken(token) {
  if (!token) {
    throwAppError({
      name: 'TOKEN_NOT_PROVIDED',
      message: 'JWT token is required',
      status: 401,
    });
  }

  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throwAppError({
        name: 'TOKEN_EXPIRED',
        message: 'JWT token has expired',
        status: 401,
      });
    }

    if (err.name === 'JsonWebTokenError') {
      throwAppError({
        name: 'INVALID_TOKEN',
        message: 'JWT token is invalid',
        status: 401,
      });
    }

    throwAppError({
      name: 'TOKEN_VERIFICATION_FAILED',
      message: 'JWT token verification failed',
      status: 401,
    });
  }
}

export function getJwtToken(data) {
  const payload = {
    id: data.id,
    role: data.role,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn || '1d',
  });
}
