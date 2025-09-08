import express from 'express';
import { verifyUser, createUser, createAdmin, loginAdmin } from '#modules/auth/controller.js';
import joiSchema from '#modules/auth/joiSchema.js';
import { joiValidator } from '#middlewares/joiValidator.js';

const router = express.Router();

router.get('/user/verify', verifyUser);
router.post('/user/create', createUser);
router.post('/admin/create', joiValidator(joiSchema.signup), createAdmin);
router.post('/admin/login', joiValidator(joiSchema.login), loginAdmin);

export default router;
