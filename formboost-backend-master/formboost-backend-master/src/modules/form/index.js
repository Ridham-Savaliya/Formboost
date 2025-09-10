import express from 'express';
import { joiValidator } from '#middlewares/joiValidator.js';
import joiSchema from '#modules/form/joiSchema.js';
import {
  createForm,
  updateFormTargetEmail,
  getById,
  updateForm,
  removeForm,
  updateTelegramSettings,
  sendTestNotifications,
  getTelegramChatId,
} from '#modules/form/controller.js';
import { checkFormLimit } from '#middlewares/checkLimit.js';

const router = express.Router();

router.post('/', joiValidator(joiSchema.create), checkFormLimit, createForm);
router.patch('/:id/update_mail', updateFormTargetEmail);
router.patch('/:id/update_telegram', updateTelegramSettings);
router.get('/:id', getById);
router.patch('/:id', joiValidator(joiSchema.update), updateForm);
router.delete('/:id', removeForm);
router.post('/:id/test-notifications', sendTestNotifications);
router.get('/telegram/resolve-chat', getTelegramChatId);

export default router;
