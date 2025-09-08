import express from 'express';
import { joiValidator } from '#middlewares/joiValidator.js';
import joiSchema from '#modules/transaction/joiSchema.js';
import {
  getAllTransactions,
  createTransaction,
  downloadTransactionsCsv,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '#modules/transaction/controller.js';

const router = express.Router();

router.get('/csv', downloadTransactionsCsv);
router.get('/', getAllTransactions);
router.post('/', joiValidator(joiSchema.create), createTransaction);
router.get('/:id', getTransactionById);
router.patch('/:id', joiValidator(joiSchema.update), updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
