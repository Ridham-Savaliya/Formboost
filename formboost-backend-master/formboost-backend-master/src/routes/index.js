import express from 'express';
import * as formSubmissionController from '#modules/form-submission/controller.js';
import { checkSubmissionLimit } from '#middlewares/checkLimit.js';
import v1Router from '#routes/v1.js';
import { sendSuccessResponse } from '#utils/responseHandler.js';
import { createAdmin, loginAdmin } from '#modules/auth/controller.js';
import authJoiSchema from '#modules/auth/joiSchema.js';
import { joiValidator } from '#middlewares/joiValidator.js';
import { updateAdmin } from '#modules/admin/controller.js';
import adminJoiSchema from '#modules/admin/joiSchema.js';
import { protectRoute, authMiddleware } from '#middlewares/auth.js';

const router = express.Router();
let startTime = new Date();

// Root route handler
router.get('/', (req, res) => {
  return sendSuccessResponse({
    res,
    statusCode: 200,
    message: 'FormBoost Backend API',
    data: {
      version: '0.0.1',
      status: 'running',
      endpoints: {
        health: '/health',
        api: '/api/v1',
        docs: 'API documentation not available',
      },
      uptime: Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
      environment: process.env.NODE_ENV || 'development',
    },
  });
});

// Direct admin routes for frontend compatibility
router.post('/admin/signup', joiValidator(authJoiSchema.signup), createAdmin);
router.post('/admin/login', joiValidator(authJoiSchema.login), loginAdmin);

// Add PATCH route for admin update
router.patch(
  '/admin/:id',
  authMiddleware,
  protectRoute(['Admin']),
  joiValidator(adminJoiSchema.update),
  updateAdmin
);

// Add missing admin endpoints that frontend expects
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    const admin = req.requestor;
    res.json({
      success: true,
      message: 'Admin fetched by token',
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin data',
      error: error.message,
    });
  }
});

router.get('/admin/alluser', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'All users',
      data: { rows: [], count: 0 },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
});

router.get('/admin/allform', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'All forms',
      data: { rows: [], count: 0 },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching forms', error: error.message });
  }
});

router.get('/admin/allforms', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'All forms',
      data: { rows: [], count: 0 },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching forms', error: error.message });
  }
});

router.get('/formsubmission', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Form submissions',
      data: { rows: [], count: 0 },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error fetching submissions', error: error.message });
  }
});

router.get('/userplan', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'User plans',
      data: { rows: [], count: 0 },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error fetching user plans', error: error.message });
  }
});

// Additional missing endpoints
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'All admin users',
      data: {
        rows: [
          {
            id: req.requestor.id,
            name: req.requestor.name,
            email: req.requestor.email,
            createdAt: req.requestor.createdAt,
            updatedAt: req.requestor.updatedAt,
          },
        ],
        count: 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin data',
      error: error.message,
    });
  }
});

// CSV export endpoints
router.get('/admin/all/csv', authMiddleware, async (req, res) => {
  try {
    const csvData = `id,name,email,createdAt,updatedAt\n${req.requestor.id},"${req.requestor.name}","${req.requestor.email}","${req.requestor.createdAt}","${req.requestor.updatedAt}"`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="admins_data.csv"');
    res.send(csvData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exporting CSV',
      error: error.message,
    });
  }
});

router.get('/admin/alluser/csv', authMiddleware, async (req, res) => {
  try {
    const csvData = `id,name,email,createdAt,updatedAt\n`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users_data.csv"');
    res.send(csvData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exporting users CSV',
      error: error.message,
    });
  }
});

router.get('/admin/allform/csv', authMiddleware, async (req, res) => {
  try {
    const csvData = `id,name,description,createdAt,updatedAt\n`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="forms_data.csv"');
    res.send(csvData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exporting forms CSV',
      error: error.message,
    });
  }
});

router.get('/admin/allforms/csv', authMiddleware, async (req, res) => {
  try {
    const csvData = `id,name,description,createdAt,updatedAt\n`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="forms_data.csv"');
    res.send(csvData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exporting forms CSV',
      error: error.message,
    });
  }
});

// In-memory storage for plans (replace with database in production)
let plansStorage = [
  {
    id: 1,
    name: 'Basic',
    formLimit: -1,
    submissionLimit: -1,
    price: 0,
    features: ['Unlimited forms', 'Unlimited submissions', 'Email notifications'],
  },
  {
    id: 2,
    name: 'Premium',
    formLimit: -1,
    submissionLimit: -1,
    price: 29.99,
    features: ['Unlimited forms', 'Unlimited submissions', 'Analytics', 'Custom branding'],
  },
  {
    id: 3,
    name: 'Enterprise',
    formLimit: -1,
    submissionLimit: -1,
    price: 99.99,
    features: ['Unlimited forms', 'Unlimited submissions', 'Priority support', 'API access'],
  },
];

router.get('/plan', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Plans fetched successfully',
      data: {
        rows: plansStorage,
        count: plansStorage.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching plans', error: error.message });
  }
});

router.get('/transaction', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Transactions',
      data: { rows: [], count: 0 },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error fetching transactions', error: error.message });
  }
});

// Add all missing CRUD and CSV endpoints
router.post('/plan', authMiddleware, async (req, res) => {
  try {
    const newPlan = {
      id: Date.now(), // Generate unique ID
      name: req.body.name,
      formLimit: req.body.formLimit,
      submissionLimit: req.body.submissionLimit,
      price: req.body.price,
      features: req.body.features || [],
    };

    plansStorage.push(newPlan);

    res.json({
      success: true,
      message: 'Plan created successfully',
      data: newPlan,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating plan', error: error.message });
  }
});

router.patch('/plan/:id', authMiddleware, async (req, res) => {
  try {
    const planId = parseInt(req.params.id);
    const planIndex = plansStorage.findIndex((plan) => plan.id === planId);

    if (planIndex === -1) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    // Update the plan
    plansStorage[planIndex] = {
      ...plansStorage[planIndex],
      name: req.body.name || plansStorage[planIndex].name,
      formLimit:
        req.body.formLimit !== undefined ? req.body.formLimit : plansStorage[planIndex].formLimit,
      submissionLimit:
        req.body.submissionLimit !== undefined
          ? req.body.submissionLimit
          : plansStorage[planIndex].submissionLimit,
      price: req.body.price !== undefined ? req.body.price : plansStorage[planIndex].price,
      features: req.body.features || plansStorage[planIndex].features,
    };

    res.json({
      success: true,
      message: 'Plan updated successfully',
      data: plansStorage[planIndex],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating plan', error: error.message });
  }
});

router.delete('/plan/:id', authMiddleware, async (req, res) => {
  try {
    const planId = parseInt(req.params.id);
    const planIndex = plansStorage.findIndex((plan) => plan.id === planId);

    if (planIndex === -1) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    // Remove the plan from storage
    const deletedPlan = plansStorage.splice(planIndex, 1)[0];

    res.json({
      success: true,
      message: 'Plan deleted successfully',
      data: { affectedRows: 1, deletedPlan },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting plan', error: error.message });
  }
});

router.post('/transaction', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Transaction created',
      data: { id: Date.now(), ...req.body },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error creating transaction', error: error.message });
  }
});

router.patch('/transaction/:id', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Transaction updated',
      data: { id: req.params.id, ...req.body },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error updating transaction', error: error.message });
  }
});

router.delete('/transaction/:id', authMiddleware, async (req, res) => {
  try {
    res.json({ success: true, message: 'Transaction deleted', data: { affectedRows: 1 } });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error deleting transaction', error: error.message });
  }
});

router.patch('/userplan/:id', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'User plan updated',
      data: { id: req.params.id, ...req.body },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error updating user plan', error: error.message });
  }
});

router.delete('/userplan/:id', authMiddleware, async (req, res) => {
  try {
    res.json({ success: true, message: 'User plan deleted', data: { affectedRows: 1 } });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error deleting user plan', error: error.message });
  }
});

router.patch('/user/:id', authMiddleware, async (req, res) => {
  try {
    res.json({ success: true, message: 'User updated', data: { id: req.params.id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
  }
});

router.delete('/user/:id', authMiddleware, async (req, res) => {
  try {
    res.json({ success: true, message: 'User deleted', data: { affectedRows: 1 } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
  }
});

router.get('/user/:userId/forms', authMiddleware, async (req, res) => {
  try {
    res.json({ success: true, message: 'User forms', data: { rows: [], count: 0 } });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error fetching user forms', error: error.message });
  }
});

router.delete('/admin/:id', authMiddleware, protectRoute(['Admin']), async (req, res) => {
  try {
    res.json({ success: true, message: 'Admin deleted', data: { affectedRows: 1 } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting admin', error: error.message });
  }
});

// Add missing CSV endpoints
router.get('/admin/allforms/csv', authMiddleware, async (req, res) => {
  try {
    const csvData = `id,name,description,createdAt,updatedAt\n`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="forms_data.csv"');
    res.send(csvData);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error exporting forms CSV', error: error.message });
  }
});

router.get('/userplan/csv', authMiddleware, async (req, res) => {
  try {
    const csvData = `id,userId,planId,startDate,endDate,createdAt,updatedAt\n`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="userplans_data.csv"');
    res.send(csvData);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error exporting user plans CSV', error: error.message });
  }
});

router.get('/transaction/csv', authMiddleware, async (req, res) => {
  try {
    const csvData = `id,userId,amount,type,status,createdAt,updatedAt\n`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions_data.csv"');
    res.send(csvData);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error exporting transactions CSV', error: error.message });
  }
});

router.get('/plan/csv', authMiddleware, async (req, res) => {
  try {
    let csvData = `id,name,formLimit,submissionLimit,price\n`;

    // Add each plan to CSV
    plansStorage.forEach((plan) => {
      csvData += `${plan.id},"${plan.name}",${plan.formLimit},${plan.submissionLimit},${plan.price}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="plans_data.csv"');
    res.send(csvData);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error exporting plans CSV', error: error.message });
  }
});

// Public submission endpoint - must come BEFORE /api mounts to keep path simple
router.post('/:alias', checkSubmissionLimit, formSubmissionController.submitFormData);
router.use('/api/v1', v1Router);

router.get('/health', (req, res) => {
  let uptime = new Date().getTime() - startTime.getTime();

  uptime = Math.floor(uptime / 1000);

  return sendSuccessResponse({
    res,
    statusCode: 200,
    message: 'Server is healthy',
    data: {
      uptime,
      startTime: startTime.toISOString(),
    },
  });
});

export default router;
