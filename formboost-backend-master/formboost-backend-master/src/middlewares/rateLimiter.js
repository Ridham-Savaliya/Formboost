import rateLimit from 'express-rate-limit';
import logger from '#utils/logger.js';
import { sendErrorResponse } from '#utils/responseHandler.js';

export const rateLimitMiddleware = rateLimit({
  windowMs: 10 * 1000,
  max: 30,
  handler: (req, res) => {
    logger.warn({
      name: 'RATE_LIMIT_EXCEEDED',
      data: {
        ip: req.ip,
        method: req.method,
        originalUrl: req.originalUrl,
        headers: req.headers,
      },
    });
    return sendErrorResponse({
      res,
      statusCode: 429,
      message: 'Too many requests from this IP, please try again after some time',
    });
  },
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (Array.isArray(forwarded)) {
      return forwarded.join(',');
    }
    return forwarded || req.connection.remoteAddress || '';
  },
});
