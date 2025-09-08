import express from 'express';
import { authMiddleware } from '#middlewares/auth.js';
import authRouter from '#modules/auth/index.js';
import userRouter from '#modules/user/index.js';
import adminRouter from '#modules/admin/index.js';
import formRouter from '#modules/form/index.js';
import formSubmissionRouter from '#modules/form-submission/index.js';
import planRouter from '#modules/plan/index.js';
import userPlanRouter from '#modules/user-plan/index.js';
import transactionRouter from '#modules/transaction/index.js';

const router = express.Router();

router.use('/', authRouter);
router.use(authMiddleware);
router.use('/user', userRouter);
router.use('/admin', adminRouter);
router.use('/form', formRouter);
router.use('/formsubmission', formSubmissionRouter);
router.use('/plan', planRouter);
router.use('/userplan', userPlanRouter);
router.use('/transaction', transactionRouter);

export default router;
