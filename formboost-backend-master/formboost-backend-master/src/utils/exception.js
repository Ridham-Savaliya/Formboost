import logger from '#utils/logger.js'; // adjust if your path differs

export const throwAppError = ({ name, message, status = 400 }) => {
  const level = status >= 500 ? 'error' : 'warn';
  logger.log(level, {
    name,
    data: { message, status },
  });

  throw new GenerateError({ name, message, status });
};

export const handleControllerError = (name, error, next) => {
  next(wrapError(name, error));
};

export const handleError = (name, error) => {
  throw wrapError(name, error);
};

export const validateOrGenerateError = (name, error) => {
  return wrapError(name, error);
};

export class GenerateError extends Error {
  constructor({ name = 'GenerateError', message, status = 500, error }) {
    super(message);
    this.name = name;
    this.status = status;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GenerateError);
    }

    if (error?.stack) {
      this.stack = `Caused by: ${error.stack}`;
    }
  }
}

const wrapError = (name, error) => {
  let wrappedError;

  if (error instanceof GenerateError) {
    return error;
  } else if (error instanceof Error) {
    wrappedError = new GenerateError({
      name,
      message: error.message,
      status: 500,
      error,
    });
  } else {
    wrappedError = new GenerateError({
      name,
      message: 'An unexpected error occurred',
      status: 500,
    });
  }

  const level = wrappedError.status >= 500 ? 'error' : 'warn';

  logger.log(level, {
    name,
    data: {
      message: wrappedError.message,
      status: wrappedError.status,
      stack: wrappedError.stack,
      originalError: error,
    },
  });

  return wrappedError;
};
