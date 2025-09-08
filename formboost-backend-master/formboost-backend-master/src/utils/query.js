import { Op } from 'sequelize';
import moment from 'moment';

/**
 * Map attribute to Sequelize operators.
 * @param {String} attributes
 * @param {String | Number} value
 * @returns {Object}
 */
export function getOpAttributeValue(attributes, value) {
  const parsedValue = typeof value === 'string' ? JSON.parse(value) : value;

  const opMap = {
    gt: { [Op.gt]: value },
    gte: { [Op.gte]: value },
    lt: { [Op.lt]: value },
    lte: { [Op.lte]: value },
    eq: { [Op.eq]: value },
    ne: { [Op.ne]: value },
    notBetween: { [Op.notBetween]: parsedValue },
    between: { [Op.between]: parsedValue },
  };

  return opMap[attributes] || null;
}

/**
 * Build Sequelize query object based on query parameters.
 * @param {Object} q
 * @param {Object} condition
 * @param {Array} searchQueryColumns
 * @returns {Object}
 */
export function sqquery(q, condition = {}, searchQueryColumns = []) {
  const limit = parseInt(q.limit, 10) || 1000;
  const page = parseInt(q.page, 10) || 1;
  const skip = (page - 1) * limit;
  const sortBy = q.sortBy || 'createdAt';
  const sortOrder = q.sortOrder || 'DESC';
  const searchQuery = q.searchQuery || '';

  let where = { ...dateFilter(q) };

  const excludeFields = [
    'page',
    'sortBy',
    'limit',
    'fields',
    'sortOrder',
    'searchQuery',
    'startDate',
    'endDate',
  ];
  excludeFields.forEach((field) => delete q[field]);

  Object.keys(q).forEach((key) => {
    if (isJSON(q[key])) {
      Object.keys(q[key]).forEach((opKey) => {
        const opValue = getOpAttributeValue(opKey, q[key][opKey]);
        if (opValue) where[key] = opValue;
      });
    } else {
      where[key] = q[key];
    }
  });

  if (searchQuery && searchQueryColumns.length) {
    where = {
      ...where,
      [Op.or]: searchQueryColumns.map((column) => ({
        [column]: { [Op.like]: `%${searchQuery}%` },
      })),
    };
  }

  where = { ...where, ...condition };

  return {
    where,
    order: [[sortBy, sortOrder]],
    limit,
    offset: skip,
  };
}

/**
 * Simplified query builder for users with pagination and sorting.
 * @param {Object} q
 * @returns {Object}
 */
export function usersqquery(q) {
  const limit = parseInt(q.limit, 10) || 200;
  const page = parseInt(q.page, 10) || 1;
  const skip = (page - 1) * limit;
  const sort = q.sort || 'createdAt';
  const sortBy = q.sortBy || 'DESC';

  return {
    order: [[sort, sortBy]],
    ...(q.limit && { limit, offset: skip }),
  };
}

/**
 * Apply date filtering to a query.
 * @param {Object} query
 * @returns {Object}
 */
export function dateFilter(query) {
  const { startDate, endDate } = query;
  const dateFilter = {};

  if (startDate) {
    dateFilter.createdAt = {
      [Op.gte]: new Date(startDate),
      [Op.lt]: endDate ? moment(endDate).add(1, 'days').toDate() : moment().add(1, 'days').toDate(),
    };
  }

  return dateFilter;
}

/**
 * Utility function to check if a string is a JSON object.
 * @param {String} str
 * @returns {Boolean}
 */
function isJSON(str) {
  try {
    return typeof JSON.parse(str) === 'object';
  } catch {
    return false;
  }
}
