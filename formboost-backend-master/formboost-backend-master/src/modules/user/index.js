import express from 'express';
import {
  getUserDashboardData,
  updateUserPassword,
  getUserForms,
  getUserById,
  updateUser,
  deleteUser,
  getUserByToken,
} from '#modules/user/controller.js';
import joiSchema from '#modules/user/joiSchema.js';
import { joiValidator } from '#middlewares/joiValidator.js';

const router = express.Router();

router.get('/dashboard', getUserDashboardData);
router.patch('/changePassword', updateUserPassword);
router.get('/:id/forms', getUserForms);
router.get('/:id', getUserById);
router.patch('/:id', joiValidator(joiSchema.update), updateUser);
router.delete('/:id', deleteUser);
router.get('/', getUserByToken);

export default router;
