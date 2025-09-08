import * as transactionService from '#modules/transaction/service.js';
import { sendSuccessResponse } from '#utils/responseHandler.js';
import { handleControllerError } from '#utils/exception.js';

export const getTransactionById = async (req, res, next) => {
  try {
    const data = await transactionService.fetchTransactionById(req.params.id);
    return sendSuccessResponse({
      res,
      message: 'Transaction fetched successfully',
      data,
    });
  } catch (error) {
    handleControllerError('GET_TRANSACTION_BY_ID', error, next);
  }
};

export const getAllTransactions = async (req, res, next) => {
  try {
    const data = await transactionService.fetchAllTransactions(req.query);
    return sendSuccessResponse({
      res,
      message: 'Transactions fetched successfully',
      data,
    });
  } catch (error) {
    handleControllerError('GET_ALL_TRANSACTIONS', error, next);
  }
};

export const downloadTransactionsCsv = async (req, res, next) => {
  try {
    const csv = await transactionService.generateTransactionCSV(req.query);
    res.header('Content-Type', 'text/csv');
    res.attachment('Transaction_List.csv');
    return res.send(csv);
  } catch (error) {
    handleControllerError('DOWNLOAD_TRANSACTIONS_CSV', error, next);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const data = await transactionService.createTransaction(req.body);
    return sendSuccessResponse({
      res,
      statusCode: 201,
      message: 'Transaction created successfully',
      data,
    });
  } catch (error) {
    handleControllerError('CREATE_TRANSACTION', error, next);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const data = await transactionService.updateTransaction(req.params.id, req.body);
    return sendSuccessResponse({
      res,
      message: 'Transaction updated successfully',
      data,
    });
  } catch (error) {
    handleControllerError('UPDATE_TRANSACTION', error, next);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const data = await transactionService.deleteTransaction(req.params.id);
    return sendSuccessResponse({
      res,
      message: 'Transaction deleted successfully',
      data,
    });
  } catch (error) {
    handleControllerError('DELETE_TRANSACTION', error, next);
  }
};
