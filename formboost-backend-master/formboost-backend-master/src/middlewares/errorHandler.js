import { sendToDiscord } from '#service/discord.js';
import { validateOrGenerateError } from '#utils/exception.js';
import { sendErrorResponse } from '#utils/responseHandler.js';
import logger from '#utils/logger.js';

const notFoundRequest = (req, res) => {
  logger.warn({
    name: 'NOT_FOUND_REQUEST',
    data: {
      method: req.method,
      url: req.originalUrl,
      userId: req?.requestor?.id || 'unknown',
    },
  });
  return res.status(404).end();
};

// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
  const error = validateOrGenerateError('GLOBAL_EXCEPTION', err);

  if (error.status >= 500) {
    sendToDiscord('errorChannel', {
      embeds: [
        {
          title: `Error Occurred: ${error.name}`,
          description: `${error.message}`,
          fields: [
            {
              name: 'API Endpoint',
              value: `${req.method} ${req.originalUrl}`,
            },
            {
              name: 'Stack Trace',
              value: error.stack || 'No stack trace available',
            },
          ],
          color: 16711680,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }

  res.locals.error = error;

  return sendErrorResponse({
    res,
    statusCode: error.status,
    message: error.message,
  });
};

export default [notFoundRequest, globalErrorHandler];
