import express from 'express';
import { joiValidator } from '#middlewares/joiValidator.js';
import joiSchema from '#modules/form/joiSchema.js';
import {
  createForm,
  updateFormTargetEmail,
  getById,
  updateForm,
  removeForm,
} from '#modules/form/controller.js';
import { checkFormLimit } from '#middlewares/checkLimit.js';

const router = express.Router();

router.post('/', joiValidator(joiSchema.create), checkFormLimit, createForm);
router.patch('/:id/update_mail', updateFormTargetEmail);
router.get('/:id', getById);
router.patch('/:id', joiValidator(joiSchema.update), updateForm);
router.delete('/:id', removeForm);

export default router;
