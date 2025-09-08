import { Parser } from 'json2csv';

export const sendSuccessResponse = ({ res, statusCode, message, data, ...payload }) => {
  let responsePayload = {
    success: true,
    message: message || 'Request was successful',
  };

  if (data) {
    responsePayload.data = data;
  }

  if (Object.keys(payload).length > 0) {
    responsePayload = {
      ...responsePayload,
      ...payload,
    };
  }

  res.locals.responseBody = responsePayload;

  res.status(statusCode ?? 200).json(responsePayload);
};

export const sendErrorResponse = ({ res, statusCode, message }) => {
  const responsePayload = {
    success: false,
    message: message || 'An error occurred while processing your request',
  };

  res.locals.responseBody = responsePayload;

  res.status(statusCode ?? 500).json(responsePayload);
};

export const sendCSVResponse = (res, fileName, fields, data) => {
  const parser = new Parser({ fields });
  const csv = parser.parse(data);
  res.header('Content-Type', 'text/csv');
  res.attachment(fileName);
  res.status(200).send(csv);
};
