import { sqquery } from '#utils/query.js';
import { Parser } from 'json2csv';
import Transaction from '#modules/transaction/model.js';
import { throwAppError, handleError } from '#utils/exception.js';

export const fetchTransactionById = async (id) => {
  try {
    const data = await Transaction.findOne({ where: { id } });
    if (!data) {
      throwAppError({
        name: 'TRANSACTION_NOT_FOUND',
        message: 'Transaction not found',
        status: 404,
      });
    }
    return data;
  } catch (error) {
    handleError('FETCH_TRANSACTION_BY_ID_FAILED', error);
  }
};

export const fetchAllTransactions = async (query) => {
  try {
    return await Transaction.findAndCountAll(sqquery(query));
  } catch (error) {
    handleError('FETCH_ALL_TRANSACTIONS_FAILED', error);
  }
};

export const generateTransactionCSV = async (query) => {
  try {
    const data = await Transaction.findAndCountAll(sqquery(query));
    const csvData = data.rows.map((row) => row.dataValues);

    if (csvData.length === 0) {
      throwAppError({
        name: 'TRANSACTION_CSV_NO_DATA',
        message: 'No transactions found for CSV export',
        status: 404,
      });
    }

    const fields = Object.keys(csvData[0]);
    const parser = new Parser({ fields });
    return parser.parse(csvData);
  } catch (error) {
    handleError('GENERATE_TRANSACTION_CSV_FAILED', error);
  }
};

export const createTransaction = async (payload) => {
  try {
    return await Transaction.create(payload);
  } catch (error) {
    handleError('CREATE_TRANSACTION_FAILED', error);
  }
};

export const updateTransaction = async (id, payload) => {
  try {
    const [affectedRows] = await Transaction.update(payload, {
      where: { id },
    });

    if (affectedRows === 0) {
      throwAppError({
        name: 'TRANSACTION_UPDATE_FAILED',
        message: 'Transaction update failed or no changes made',
        status: 400,
      });
    }

    return { isUpdated: true };
  } catch (error) {
    handleError('UPDATE_TRANSACTION_FAILED', error);
  }
};

export const deleteTransaction = async (id) => {
  try {
    const affectedRows = await Transaction.destroy({ where: { id } });

    if (affectedRows === 0) {
      throwAppError({
        name: 'TRANSACTION_DELETE_FAILED',
        message: 'Transaction deletion failed or not found',
        status: 404,
      });
    }

    return { isDeleted: true };
  } catch (error) {
    handleError('DELETE_TRANSACTION_FAILED', error);
  }
};
