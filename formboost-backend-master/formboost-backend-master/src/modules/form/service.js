import Form from '#modules/form/model.js';
import { nanoid } from 'nanoid';
import { throwAppError, handleError } from '#utils/exception.js';
import { sqquery } from '#utils/query.js';
import { sendToDiscord } from '#service/discord.js';

export const findOne = async (formId) => {
  try {
    const form = await Form.findOne({ where: { id: formId } });

    if (!form) {
      throwAppError({
        name: 'FORM_NOT_FOUND',
        message: 'Form not found.',
        status: 404,
      });
    }

    return form;
  } catch (error) {
    handleError('SERVICE_FIND_ONE_FORM_ERROR', error);
  }
};

export const findAndCountAll = async (queryParams) => {
  try {
    return await Form.findAndCountAll(sqquery(queryParams));
  } catch (error) {
    handleError('SERVICE_FIND_ALL_FORMS_ERROR', error);
  }
};

export const createForm = async (data, userId) => {
  try {
    const { formName, formDescription, targetEmail } = data;

    let alias = nanoid(8);
    while (await Form.findOne({ where: { alias } })) {
      alias = nanoid(8);
    }

    const form = await Form.create({
      alias,
      userId,
      formName,
      formDescription,
      targetEmail,
    });

    sendToDiscord('formCreatedChannel', {
      embeds: [
        {
          title: 'New Form Created',
          description: `A new form has been created by <${userId}>.`,
          fields: [
            {
              name: 'Form Name',
              value: formName,
            },
            {
              name: 'Form Description',
              value: formDescription || 'No description provided.',
            },
            { name: 'Form ID', value: form.id },
          ],
          color: 33023,
          timestamp: new Date().toISOString(),
        },
      ],
    });

    return form;
  } catch (error) {
    handleError('SERVICE_CREATE_FORM_ERROR', error);
  }
};

export const updateForm = async (data, formId) => {
  try {
    const [affectedRows] = await Form.update(data, {
      where: { id: formId },
    });
    return { isUpdated: Boolean(affectedRows) };
  } catch (error) {
    handleError('SERVICE_UPDATE_FORM_ERROR', error);
  }
};

export const removeForm = async (formId) => {
  try {
    const affectedRows = await Form.destroy({
      where: { id: formId },
    });
    return { isDeleted: Boolean(affectedRows) };
  } catch (error) {
    handleError('SERVICE_DELETE_FORM_ERROR', error);
  }
};

export const updateFormTargetEmail = async (formId, targetEmail) => {
  try {
    if (!targetEmail) {
      throwAppError({
        name: 'TARGET_EMAIL_REQUIRED',
        message: 'Target email is required.',
        status: 400,
      });
    }

    const form = await Form.findOne({ where: { id: formId } });
    if (!form) {
      throwAppError({
        name: 'FORM_NOT_FOUND',
        message: 'Form not found.',
        status: 404,
      });
    }

    form.targetEmail = targetEmail;
    await form.save();

    return form;
  } catch (error) {
    handleError('SERVICE_UPDATE_TARGET_EMAIL_ERROR', error);
  }
};
