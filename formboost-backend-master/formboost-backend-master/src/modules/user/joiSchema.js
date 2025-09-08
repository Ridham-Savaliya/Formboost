import Joi from 'joi';

const joiSchema = {
  update: Joi.object().keys({
    name: Joi.string().alphanum(),
    email: Joi.string().email(),
    password: Joi.string(),
  }),
};

export default joiSchema;
