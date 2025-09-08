import Joi from 'joi';

const joiSchema = {
  create: Joi.object({
    userPlanId: Joi.string().required(),
    amount: Joi.number().required(),
    currency: Joi.string().required(),
    paymentMethod: Joi.string().required(),
    status: Joi.string().required(),
    transactionDate: Joi.date().required(),
  }),
  update: Joi.object({
    userPlanId: Joi.string(),
    amount: Joi.number(),
    currency: Joi.string(),
    paymentMethod: Joi.string(),
    status: Joi.string(),
    transactionDate: Joi.date(),
  }),
};

export default joiSchema;
