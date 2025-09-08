import Joi from 'joi';

const joiSchema = {
  create: Joi.object().keys({
    name: Joi.string().required(),
    formLimit: Joi.number().integer().required(),
    submissionLimit: Joi.number().integer().required(),
    price: Joi.number().required(),
  }),
  update: Joi.object().keys({
    name: Joi.string(),
    formLimit: Joi.number().integer(),
    submissionLimit: Joi.number().integer(),
    price: Joi.number(),
  }),
};

export default joiSchema;
