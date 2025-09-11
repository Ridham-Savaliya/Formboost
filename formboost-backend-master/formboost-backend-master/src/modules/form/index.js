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
  validateTelegramBot,
  updateWebhookSettings,
  testWebhook,
  updateSlackSettings,
  testSlack,
  updateGoogleSheetsSettings,
  testGoogleSheets,
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
router.get('/telegram/validate-bot', validateTelegramBot);
router.patch('/:id/update_webhook', updateWebhookSettings);
router.post('/:id/test-webhook', testWebhook);
router.patch('/:id/update_slack', updateSlackSettings);
router.post('/:id/test-slack', testSlack);
router.patch('/:id/update_googlesheets', updateGoogleSheetsSettings);
router.post('/:id/test-googlesheets', testGoogleSheets);

export default router;
