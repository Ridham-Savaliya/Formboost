import express from 'express';
import {
  getAll,
  getAlluser,
  getAllform,
  getAllcsv,
  getAllusercsv,
  getAllformcsv,
  getAllWithPagination,
  getAlluserWithPagination,
  getAllformWithPagination,
  getAdminByToken,
  getById,
  updateAdmin,
  removeAdmin,
} from '#modules/admin/controller.js';
import joiSchema from '#modules/admin/joiSchema.js';
import { joiValidator } from '#middlewares/joiValidator.js';
import { protectRoute } from '#middlewares/auth.js';

const router = express.Router();

router.get('/all', protectRoute(['Admin']), getAll);
router.get('/alluser', protectRoute(['Admin']), getAlluser);
router.get('/allform', protectRoute(['Admin']), getAllform);
router.get('/all/csv', protectRoute(['Admin']), getAllcsv);
router.get('/alluser/csv', protectRoute(['Admin']), getAllusercsv);
router.get('/allform/csv', protectRoute(['Admin']), getAllformcsv);
router.get('/alls', protectRoute(['Admin']), getAllWithPagination);
router.get('/allusers', protectRoute(['Admin']), getAlluserWithPagination);
router.get('/allforms', protectRoute(['Admin']), getAllformWithPagination);
router.get('/', protectRoute(['Admin']), getAdminByToken);
router.get('/:id', protectRoute(['Admin']), getById);
router.patch('/:id', protectRoute(['Admin']), joiValidator(joiSchema.update), updateAdmin);
router.delete('/:id', protectRoute(['Admin']), removeAdmin);

export default router;
