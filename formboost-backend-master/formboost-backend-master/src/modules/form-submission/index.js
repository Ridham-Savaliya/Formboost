import express from 'express';
import {
  getAll,
  getAllSubmissionByUserId,
  submissionQuota,
  downloadCSV,
  getAllSubmissionByFormId,
  getAllWithPagination,
  getById,
} from '#modules/form-submission/controller.js';

const router = express.Router();

router.get('/', getAll);
router.get('/user', getAllSubmissionByUserId);
router.get('/quota', submissionQuota);
router.get('/:id/csv', downloadCSV);
router.get('/:id/form', getAllSubmissionByFormId);
router.get('/:id/submissions', getAllWithPagination);
router.get('/:id', getById);

export default router;
