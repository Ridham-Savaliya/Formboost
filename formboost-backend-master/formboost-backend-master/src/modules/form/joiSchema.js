import Joi from 'joi';

const joiSchema = {
  create: Joi.object().keys({
    formName: Joi.string().required(),
    formDescription: Joi.string().required(),
    filterSpam: Joi.boolean().default(true),
    emailNotification: Joi.boolean().default(true),
    targetEmail: Joi.string().required(),
    isPrebuilt: Joi.boolean().optional(),
    prebuiltTemplate: Joi.string().optional(),
  }),
  update: Joi.object().keys({
    formName: Joi.string(),
    formDescription: Joi.string(),
    filterSpam: Joi.boolean().default(true),
    emailNotification: Joi.boolean().default(true),
    targetEmail: Joi.string(),
    isPrebuilt: Joi.boolean().optional(),
    prebuiltTemplate: Joi.string().optional(),
  }),
};

export default joiSchema;
