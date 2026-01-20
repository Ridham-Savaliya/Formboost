import { google } from 'googleapis';
import logger from '#utils/logger.js';

/**
 * Google Sheets service for Formboom
 * Requires service account credentials in environment variables
 */

/**
 * Create Google Sheets client
 * @returns {object} - Google Sheets API client
 */
const createSheetsClient = () => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    logger.error({
      name: 'GOOGLE_SHEETS_AUTH_ERROR',
      data: { error: error.message },
    });
    throw new Error('Failed to authenticate with Google Sheets');
  }
};

/**
 * Add form submission to Google Sheet
 * @param {string} spreadsheetId - Google Sheets ID
 * @param {string} sheetName - Sheet name (default: 'Formboom Submissions')
 * @param {object} form - Form object
 * @param {object} formData - Form submission data
 * @param {string} ipAddress - Submitter IP
 * @returns {Promise<object>} - Result of the operation
 */
export const addToGoogleSheet = async (
  spreadsheetId,
  sheetName = 'Formboom Submissions',
  form,
  formData,
  ipAddress
) => {
  try {
    const sheets = createSheetsClient();

    // Prepare the row data
    const timestamp = new Date().toISOString();
    const rowData = [timestamp, form.formName, form.id, ipAddress, ...Object.values(formData)];

    // Check if sheet exists, create if not
    await ensureSheetExists(sheets, spreadsheetId, sheetName, Object.keys(formData));

    // Append the data
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [rowData],
      },
    });

    logger.info({
      name: 'GOOGLE_SHEETS_ROW_ADDED',
      data: {
        formId: form.id,
        spreadsheetId,
        sheetName,
        updatedRows: response.data.updates.updatedRows,
      },
    });

    return {
      success: true,
      updatedRows: response.data.updates.updatedRows,
      spreadsheetId,
      sheetName,
    };
  } catch (error) {
    logger.error({
      name: 'GOOGLE_SHEETS_ADD_ERROR',
      data: {
        formId: form.id,
        spreadsheetId,
        error: error.message,
      },
    });
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Ensure sheet exists with proper headers
 * @param {object} sheets - Google Sheets client
 * @param {string} spreadsheetId - Spreadsheet ID
 * @param {string} sheetName - Sheet name
 * @param {array} formFields - Form field names
 */
const ensureSheetExists = async (sheets, spreadsheetId, sheetName, formFields) => {
  try {
    // Check if sheet exists
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetExists = spreadsheet.data.sheets.some(
      (sheet) => sheet.properties.title === sheetName
    );

    if (!sheetExists) {
      // Create the sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      });

      // Add headers
      const headers = ['Timestamp', 'Form Name', 'Form ID', 'IP Address', ...formFields];
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1:Z1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers],
        },
      });

      logger.info({
        name: 'GOOGLE_SHEETS_CREATED',
        data: { spreadsheetId, sheetName },
      });
    }
  } catch (error) {
    logger.warn({
      name: 'GOOGLE_SHEETS_ENSURE_ERROR',
      data: { error: error.message },
    });
  }
};

/**
 * Test Google Sheets integration
 * @param {string} spreadsheetId - Google Sheets ID
 * @param {object} form - Form object
 * @returns {Promise<object>} - Test result
 */
export const testGoogleSheetsIntegration = async (spreadsheetId, form) => {
  const testData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    message: 'This is a test submission from Formboom.',
  };

  return await addToGoogleSheet(spreadsheetId, 'Formboom Test', form, testData, '127.0.0.1');
};

/**
 * Validate Google Sheets credentials
 * @returns {Promise<boolean>} - Whether credentials are valid
 */
export const validateGoogleSheetsCredentials = async () => {
  try {
    const sheets = createSheetsClient();
    // Try to make a simple API call to validate credentials
    await sheets.spreadsheets.get({ spreadsheetId: '1' }); // This will fail but validate auth
    return true;
  } catch (error) {
    if (error.message.includes('authentication') || error.message.includes('credentials')) {
      return false;
    }
    // If it's just a "not found" error, credentials are valid
    return true;
  }
};
