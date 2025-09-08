import Admin from '#modules/admin/model.js';
import User from '#modules/user/model.js';
import Form from '#modules/form/model.js';
import { FormSubmission } from '#modules/form-submission/model.js';
import sequelize from '#database/config.js';
import { throwAppError, handleError } from '#utils/exception.js';
import { sqquery } from '#utils/query.js';

export const findAll = async (query) => {
  try {
    return await Admin.findAndCountAll(sqquery(query));
  } catch (error) {
    handleError('FIND_ALL_ADMINS_ERROR', error);
  }
};

export const findById = async (id) => {
  try {
    const admin = await Admin.findOne({ where: { id } });
    if (!admin) {
      throwAppError({ name: 'ADMIN_NOT_FOUND', message: 'Admin not found', status: 404 });
    }
    return admin;
  } catch (error) {
    handleError('FIND_ADMIN_BY_ID_ERROR', error);
  }
};

export const updateAdmin = async (id, updateData) => {
  try {
    const admin = await findById(id);
    Object.assign(admin, updateData);
    const updatedAdmin = await admin.save();
    return { affectedRows: 1, updatedAdmin };
  } catch (error) {
    handleError('UPDATE_ADMIN_ERROR', error);
  }
};

export const deleteAdmin = async (id) => {
  try {
    return await Admin.destroy({ where: { id } });
  } catch (error) {
    handleError('DELETE_ADMIN_ERROR', error);
  }
};

export const findAllUsers = async (query) => {
  try {
    return await User.findAndCountAll(sqquery(query));
  } catch (error) {
    handleError('FIND_ALL_USERS_ERROR', error);
  }
};

export const paginateUsers = async (query) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await User.findAndCountAll({
      where: query,
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: result.rows,
      pagination: { total: result.count, page, limit },
    };
  } catch (error) {
    handleError('PAGINATE_USERS_ERROR', error);
  }
};

export const findAllForms = async (query) => {
  try {
    const { where } = sqquery(query);
    return await Form.findAndCountAll({
      where,
      include: [
        {
          model: FormSubmission,
          attributes: [],
        },
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM FormSubmissions AS fs WHERE fs.formId = Form.id)`
            ),
            'totalSubmissions',
          ],
        ],
      },
    });
  } catch (error) {
    handleError('FIND_ALL_FORMS_ERROR', error);
  }
};

export const paginateForms = async (query) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;
    const { where } = sqquery(query);
    const result = await Form.findAndCountAll({
      where,
      include: [
        {
          model: FormSubmission,
          attributes: [],
        },
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM FormSubmissions AS fs WHERE fs.formId = Form.id)`
            ),
            'totalSubmissions',
          ],
        ],
      },
    });

    return {
      data: result.rows,
      pagination: { total: result.count, page, limit },
    };
  } catch (error) {
    handleError('PAGINATE_FORMS_ERROR', error);
  }
};

export const paginateAdmins = async (query) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await Admin.findAndCountAll({
      where: query,
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: result.rows,
      pagination: { total: result.count, page, limit },
    };
  } catch (error) {
    handleError('PAGINATE_ADMINS_ERROR', error);
  }
};
