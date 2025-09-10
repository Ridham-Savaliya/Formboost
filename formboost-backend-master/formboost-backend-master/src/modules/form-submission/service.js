import Form from '#modules/form/model.js';
import { FormSubmission, FormSubmissionData } from '#modules/form-submission/model.js';
import UserPlan from '#modules/user-plan/model.js';
import User from '#modules/user/model.js';
import Plan from '#modules/plan/model.js';
import sequelize from '#database/config.js';
import { sqquery } from '#utils/query.js';
import { Parser } from 'json2csv';
import { Op } from 'sequelize';
import { throwAppError, handleError } from '#utils/exception.js';
import logger from '#utils/logger.js';
import { sendSubmissionMail } from '#utils/mail/index.js';
import { isSpamWithOpenAIasync } from '#service/gemini.js';
import { sendTelegramMessage, formatTelegramSubmissionMessage } from '#service/telegram.js';

// Email notification limit tracking
const emailNotificationCounts = new Map(); // userId -> { count, resetDate }

const checkEmailNotificationLimit = async (userId) => {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
  
  const userCount = emailNotificationCounts.get(userId);
  
  if (!userCount || userCount.resetDate !== currentMonth) {
    // Reset for new month
    emailNotificationCounts.set(userId, { count: 0, resetDate: currentMonth });
    return false;
  }
  
  return userCount.count >= 50; // 50 email limit per month
};

const incrementEmailNotificationCount = async (userId) => {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
  
  const userCount = emailNotificationCounts.get(userId);
  
  if (!userCount || userCount.resetDate !== currentMonth) {
    emailNotificationCounts.set(userId, { count: 1, resetDate: currentMonth });
  } else {
    userCount.count += 1;
    emailNotificationCounts.set(userId, userCount);
  }
};

export const downloadCSV = async (formId, query) => {
  try {
    if (!formId) {
      throwAppError({
        name: 'FORM_ID_REQUIRED',
        message: 'Form ID is required',
        status: 400,
      });
    }

    const queryConditions = sqquery(query, { formId }, ['name', 'description']);
    const submissions = await FormSubmission.findAndCountAll(queryConditions);
    const submissionIds = submissions.rows.map((submission) => submission.id);

    const submissionDataPromises = submissionIds.map((id) =>
      FormSubmissionData.findAll({ where: { responseId: id } })
    );
    const allSubmissionData = (await Promise.all(submissionDataPromises)).flat();

    const combinedResults = submissions.rows.map((submission) => {
      const submissionData = allSubmissionData.filter((data) => data.responseId === submission.id);

      return {
        ...submission.dataValues,
        formSubmissionData: submissionData,
      };
    });

    const csvData = combinedResults.map((submission) => {
      const csvRow = { ...submission };
      submission.formSubmissionData.forEach((data) => {
        csvRow[data.key] = data.value;
      });
      return csvRow;
    });

    if (csvData.length === 0) {
      throwAppError({
        name: 'NO_SUBMISSIONS_FOUND',
        message: 'No submissions found',
        status: 404,
      });
    }

    const fields = Object.keys(csvData[0] || {});
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(csvData);

    return {
      filename: `form_${formId}_submissions.csv`,
      csv,
    };
  } catch (error) {
    handleError('DOWNLOAD_CSV_FAILED', error);
  }
};

export const getById = async (id) => {
  try {
    const submission = await FormSubmission.findOne({ where: { id } });
    if (!submission) {
      throwAppError({
        name: 'SUBMISSION_NOT_FOUND',
        message: 'Submission not found',
        status: 404,
      });
    }
    return submission;
  } catch (error) {
    handleError('GET_BY_ID_FAILED', error);
  }
};

export const getAll = async (queryParams) => {
  try {
    const queryConditions = sqquery(queryParams);
    return await FormSubmission.findAndCountAll(queryConditions);
  } catch (error) {
    handleError('GET_ALL_FAILED', error);
  }
};

export const submitFormData = async (alias, formData, ip) => {
  try {
    const form = await Form.findOne({
      where: { alias },
      include: [{ model: User, attributes: ['email', 'id'] }],
    });

    if (!form) {
      throwAppError({
        name: 'FORM_NOT_FOUND',
        message: 'Form not found with the provided alias',
        status: 404,
      });
    }

    logger.info({
      name: 'FORM_SUBMISSION_DEBUG',
      data: {
        formId: form.id,
        formName: form.formName,
        emailNotification: form.emailNotification,
        telegramNotification: form.telegramNotification,
        targetEmail: form.targetEmail,
        telegramBotToken: form.telegramBotToken ? 'Set' : 'Not set',
        telegramChatId: form.telegramChatId ? 'Set' : 'Not set',
        formData,
      },
    });

    const formSubmissionObj = {
      formId: form.id,
      ip,
    };

    if (form.filterSpam) {
      try {
        const { isSpam, score, reason } = await isSpamWithOpenAIasync(formData, form.formDescription);

        logger.info({
          name: 'SPAM_CHECK',
          data: {
            alias,
            formData,
            ip,
            isSpam,
            spamScore: score,
            spamReason: reason,
          },
        });

        formSubmissionObj.isSpam = isSpam || false;
        formSubmissionObj.spamScore = score || 0;
        formSubmissionObj.spamReason = reason || 'No spam check performed';
      } catch (error) {
        logger.error({
          name: 'GEMINI_SPAM_CHECK_ERROR',
          data: {
            error,
            submissionData: formData,
            formContext: form.formDescription,
          },
        });

        // Default to not spam if check fails
        formSubmissionObj.isSpam = false;
        formSubmissionObj.spamScore = 0;
        formSubmissionObj.spamReason = 'Error during spam check';
      }
    } else {
      // If spam filtering is disabled, set default values
      formSubmissionObj.isSpam = false;
      formSubmissionObj.spamScore = 0;
      formSubmissionObj.spamReason = 'Spam filtering disabled';
    }

    const submission = await FormSubmission.create(formSubmissionObj);

    // bulk create submission data
    const formSubmissionDataEntries = Object.entries(formData).map(([key, value]) => ({
      responseId: submission.id,
      key,
      value,
    }));

    await FormSubmissionData.bulkCreate(formSubmissionDataEntries);

    // Check email notification limits and send email
    if (form.emailNotification && !formSubmissionObj.isSpam && form.targetEmail) {
      const emailLimitReached = await checkEmailNotificationLimit(form.userId);
      if (!emailLimitReached) {
        logger.info({
          name: 'SENDING_EMAIL_NOTIFICATION',
          data: {
            formId: form.id,
            targetEmail: form.targetEmail,
            formData,
          },
        });
        try {
          await sendSubmissionMail(form, formData, ip);
          await incrementEmailNotificationCount(form.userId);
          logger.info({
            name: 'EMAIL_NOTIFICATION_SENT',
            data: {
              formId: form.id,
              targetEmail: form.targetEmail,
            },
          });
        } catch (emailError) {
          logger.error({
            name: 'EMAIL_SEND_ERROR',
            data: {
              formId: form.id,
              targetEmail: form.targetEmail,
              error: emailError.message,
            },
          });
        }
      } else {
        logger.warn({
          name: 'EMAIL_LIMIT_REACHED',
          data: {
            userId: form.userId,
            formId: form.id,
            alias,
          },
        });
      }
    } else {
      logger.info({
        name: 'EMAIL_NOTIFICATION_SKIPPED',
        data: {
          formId: form.id,
          emailNotification: form.emailNotification,
          isSpam: formSubmissionObj.isSpam,
          hasTargetEmail: !!form.targetEmail,
        },
      });
    }
    
    // send telegram notification (unlimited)
    if (form.telegramNotification && !formSubmissionObj.isSpam && form.telegramBotToken && form.telegramChatId) {
      logger.info({
        name: 'SENDING_TELEGRAM_NOTIFICATION',
        data: {
          formId: form.id,
          telegramChatId: form.telegramChatId,
          formData,
        },
      });
      try {
        const telegramMessage = formatTelegramSubmissionMessage(form, formData, ip);
        await sendTelegramMessage(form.telegramBotToken, form.telegramChatId, telegramMessage);
        logger.info({
          name: 'TELEGRAM_NOTIFICATION_SENT',
          data: {
            formId: form.id,
            telegramChatId: form.telegramChatId,
          },
        });
      } catch (telegramError) {
        logger.error({
          name: 'TELEGRAM_SEND_ERROR',
          data: {
            formId: form.id,
            telegramChatId: form.telegramChatId,
            error: telegramError.message,
          },
        });
      }
    } else {
      logger.info({
        name: 'TELEGRAM_NOTIFICATION_SKIPPED',
        data: {
          formId: form.id,
          telegramNotification: form.telegramNotification,
          isSpam: formSubmissionObj.isSpam,
          hasBotToken: !!form.telegramBotToken,
          hasChatId: !!form.telegramChatId,
        },
      });
    }

    return { id: submission.id, submittedAt: submission.submittedAt };
  } catch (error) {
    logger.error({
      name: 'CREATE_SUBMISSION_FAILED',
      data: {
        alias,
        formData,
        ip,
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });
  }
};

export const getAllWithPagination = async (formId, query) => {
  try {
    if (!formId) {
      throwAppError({
        name: 'FORM_ID_REQUIRED',
        message: 'Form ID is required',
        status: 400,
      });
    }

    const queryConditions = sqquery(query, { formId }, ['name', 'description']);
    const submissions = await FormSubmission.findAndCountAll(queryConditions);
    const submissionIds = submissions.rows.map((submission) => submission.id);

    const submissionDataPromises = submissionIds.map((id) =>
      FormSubmissionData.findAll({ where: { responseId: id } })
    );
    const allSubmissionData = (await Promise.all(submissionDataPromises)).flat();

    const combinedResults = submissions.rows.map((submission) => {
      const submissionData = allSubmissionData.filter((data) => data.responseId === submission.id);
      return {
        ...submission.dataValues,
        formSubmissionData: submissionData,
      };
    });

    const keyCounts = allSubmissionData.reduce((acc, curr) => {
      acc[curr.key] = (acc[curr.key] || 0) + 1;
      return acc;
    }, {});

    const topKeys = Object.entries(keyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key]) => key);

    const topKeyData = combinedResults.map((submission) => {
      const filteredData = submission.formSubmissionData.filter((data) =>
        topKeys.includes(data.key)
      );
      return {
        ...submission,
        formSubmissionData: filteredData,
      };
    });

    return {
      combinedResults,
      keyCounts,
      topKeyData,
      pagination: {
        total: submissions.count,
        page: parseInt(query.page, 10) || 1,
        limit: parseInt(query.limit, 10) || 10,
      },
    };
  } catch (error) {
    handleError('GET_ALL_WITH_PAGINATION_FAILED', error);
  }
};

export const getAllSubmissionByUserId = async (userId) => {
  try {
    const forms = await Form.findAll({ where: { userId } });
    const formIds = forms.map((form) => form.id);

    const submissions = await FormSubmission.findAll({
      where: { formId: formIds },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('submittedAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'submissionCount'],
      ],
      group: [sequelize.fn('DATE', sequelize.col('submittedAt'))],
      raw: true,
    });

    const submissionCount = await FormSubmission.count({ where: { formId: formIds } });

    return {
      submissionCount,
      submissions,
    };
  } catch (error) {
    handleError('GET_SUBMISSIONS_BY_USER_FAILED', error);
  }
};

export const getAllSubmissionByFormId = async (formId, userId) => {
  try {
    const form = await Form.findOne({ where: { id: formId, userId } });
    if (!form) {
      throwAppError({
        name: 'FORM_NOT_FOUND_OR_UNAUTHORIZED',
        message: 'Form not found or not created by this user',
        status: 404,
      });
    }

    const submissions = await FormSubmission.findAll({
      where: { formId },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('submittedAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'submissionCount'],
      ],
      group: [sequelize.fn('DATE', sequelize.col('submittedAt'))],
      raw: true,
    });

    const totalCount = submissions.reduce(
      (sum, item) => sum + parseInt(item.submissionCount, 10),
      0
    );

    return {
      totalCount,
      submissions,
    };
  } catch (error) {
    handleError('GET_SUBMISSIONS_BY_FORM_FAILED', error);
  }
};

export const submissionQuota = async (userId) => {
  try {
    const userPlan = await UserPlan.findOne({
      where: { userId, isActive: true },
      include: [{ model: Plan }],
    });

    if (!userPlan || !userPlan.Plan) {
      throwAppError({
        name: 'NO_ACTIVE_PLAN',
        message: 'User has no active subscription plan.',
        status: 400,
      });
    }

    const { submissionLimit, formLimit } = userPlan.Plan;
    const planStartDate = userPlan.startDate;

    if (!submissionLimit || !formLimit) {
      throwAppError({
        name: 'PLAN_LIMITS_NOT_DEFINED',
        message: 'Submission or form limit not properly defined in the plan.',
        status: 400,
      });
    }

    const currentMonthStart = new Date(planStartDate);
    currentMonthStart.setMonth(new Date().getMonth());

    const currentDate = new Date();

    const formCount = await Form.count({ where: { userId } });

    const submissionCount = await FormSubmission.count({
      include: [{ model: Form, where: { userId } }],
      where: {
        createdAt: {
          [Op.between]: [currentMonthStart, currentDate],
        },
      },
    });

    const percentageUsed = (submissionCount / submissionLimit) * 100;

    return {
      totalForms: formLimit,
      createdForms: formCount,
      monthlySubmissionLimit: submissionLimit,
      usedSubmissions: submissionCount,
      quotaUsedPercentage: percentageUsed.toFixed(2),
    };
  } catch (error) {
    handleError('SUBMISSION_QUOTA_FAILED', error);
  }
};
