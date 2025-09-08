import { throwAppError, handleControllerError } from '#utils/exception.js';

export const joiValidator = (schema) => (req, res, next) => {
  try {
    const options = {
      errors: {
        wrap: {
          label: '',
        },
      },
    };

    const { error } = schema.validate(req.body, options);

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      throwAppError({
        name: 'VALIDATION_ERROR',
        message: errorMessage,
        status: 422,
      });
    }

    next();
  } catch (err) {
    handleControllerError('JOI_VALIDATOR_ERROR', err, next);
  }
};
