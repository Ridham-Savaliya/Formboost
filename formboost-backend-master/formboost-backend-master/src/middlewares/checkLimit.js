import { Op } from 'sequelize';
import User from '#modules/user/model.js';
import UserPlan from '#modules/user-plan/model.js';
import Plan from '#modules/plan/model.js';
import Form from '#modules/form/model.js';
import { FormSubmission } from '#modules/form-submission/model.js';
import { throwAppError, handleControllerError } from '#utils/exception.js';
import logger from '#utils/logger.js';

export const checkSubmissionLimit = async (req, res, next) => {
  const wantsJson =
    req.headers['accept']?.includes('application/json') ||
    req.headers['content-type']?.includes('application/json');
  try {
    const { alias } = req.params;

    const form = await Form.findOne({
      where: { alias },
      include: [{ model: User }],
    });

    if (!form) {
      throwAppError({
        name: 'FORM_NOT_FOUND_ERROR',
        message: 'Form not found',
        status: 404,
      });
    }

    const formOwner = form.User;

    const userPlan = await UserPlan.findOne({
      where: {
        userId: formOwner.id,
        isActive: true,
      },
      include: [{ model: Plan }],
    });

    // If no plan or no limit, treat as unlimited
    const submissionLimit = userPlan?.Plan?.submissionLimit;
    const isUnlimitedSubs = submissionLimit === -1 || submissionLimit == null;
    if (isUnlimitedSubs) {
      return next();
    }

    const planStartDate = new Date(userPlan.startDate);
    const currentDate = new Date();

    const submissionCount = await FormSubmission.count({
      include: [
        {
          model: Form,
          where: { userId: formOwner.id },
        },
      ],
      where: {
        createdAt: {
          [Op.between]: [planStartDate, currentDate],
        },
      },
    });

    if (!isUnlimitedSubs && submissionCount >= submissionLimit) {
      throwAppError({
        name: 'SUBMISSION_LIMIT_REACHED_ERROR',
        message: `You have reached your submission limit.`,
        status: 403,
      });
    }

    next();
  } catch (error) {
    if (wantsJson) {
      handleControllerError('CHECK_SUBMISSION_LIMIT_ERROR', error, next);
    } else {
      const level = error.status >= 500 ? 'error' : 'warn';
      logger.log(level, {
        name: 'CREATE_SUBMISSION',
        data: {
          error,
        },
      });
      return res.redirect('https://Formboom.site/');
    }
  }
};

export const checkFormLimit = async (req, res, next) => {
  try {
    const userId = req.requestor.id;

    const userPlan = await UserPlan.findOne({
      where: {
        userId,
        isActive: true,
      },
      include: [{ model: Plan }],
    });

    const formLimit = userPlan?.Plan?.formLimit;
    const isUnlimitedForms = formLimit === -1 || formLimit == null;
    if (isUnlimitedForms) {
      return next();
    }

    const startDate = userPlan.startDate;
    const endDate = new Date();

    const formCount = await Form.count({
      where: {
        userId,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    if (!isUnlimitedForms && formCount >= formLimit) {
      throwAppError({
        name: 'FORM_LIMIT_REACHED_ERROR',
        message: `You have reached your form submission limit of ${formLimit} for the ${userPlan.Plan.name} plan. Upgrade your plan to submit more forms.`,
        status: 403,
      });
    }

    next();
  } catch (error) {
    handleControllerError('CHECK_FORM_LIMIT_ERROR', error, next);
  }
};
