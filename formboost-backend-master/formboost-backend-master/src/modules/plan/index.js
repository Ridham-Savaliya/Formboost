import express from 'express';
import { joiValidator } from '#middlewares/joiValidator.js';
import joiSchema from '#modules/plan/joiSchema.js';
import {
  getAllPlans,
  createPlan,
  getPlanById,
  updatePlan,
  deletePlan,
} from '#modules/plan/controller.js';

const router = express.Router();

router.get('/', getAllPlans);
router.post('/', joiValidator(joiSchema.create), createPlan);
router.get('/:id', getPlanById);
router.patch('/:id', joiValidator(joiSchema.update), updatePlan);
router.delete('/:id', deletePlan);

export default router;
