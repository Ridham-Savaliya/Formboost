import Joi from 'joi';

const joiSchema = {
  create: Joi.object({
    planId: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  }),
  update: Joi.object({
    userId: Joi.string(),
    planId: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    isActive: Joi.boolean(),
  }),
};

export default joiSchema;
