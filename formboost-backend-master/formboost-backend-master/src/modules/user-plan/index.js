import express from 'express';
import { joiValidator } from '#middlewares/joiValidator.js';
import joiSchema from '#modules/user-plan/joiSchema.js';
import {
  getActiveUserPlan,
  downloadUserPlansCSV,
  getUserPlanById,
  updateUserPlan,
  deleteUserPlan,
  getAllUserPlans,
  createUserPlan,
} from '#modules/user-plan/controller.js';

const router = express.Router();

router.get('/plan', getActiveUserPlan);
router.get('/csv', downloadUserPlansCSV);
router.get('/:id', getUserPlanById);
router.patch('/:id', joiValidator(joiSchema.update), updateUserPlan);
router.delete('/:id', deleteUserPlan);
router.get('/', getAllUserPlans);
router.post('/', joiValidator(joiSchema.create), createUserPlan);

export default router;
