import axios from 'axios';
import logger from '#utils/logger.js';

/**
 * Send webhook payload to a URL with retry mechanism
 * @param {string} webhookUrl - The webhook URL to send to
 * @param {object} payload - The payload to send
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @returns {Promise<object>} - Delivery result with success status and details
 */
export const sendWebhook = async (webhookUrl, payload, maxRetries = 3) => {
  const deliveryResult = {
    success: false,
    statusCode: null,
    response: null,
    error: null,
    attempts: 0,
    deliveredAt: null,
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    deliveryResult.attempts = attempt;

    try {
      const response = await axios.post(webhookUrl, payload, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Formboom-Webhook/1.0',
          'X-Formboom-Event': 'form.submission',
          'X-Formboom-Delivery-ID': generateDeliveryId(),
        },
        validateStatus: (status) => status < 500, // Don't retry on 4xx errors
      });

      deliveryResult.success = response.status >= 200 && response.status < 300;
      deliveryResult.statusCode = response.status;
      deliveryResult.response = response.data;
      deliveryResult.deliveredAt = new Date().toISOString();

      if (deliveryResult.success) {
        logger.info({
          name: 'WEBHOOK_DELIVERY_SUCCESS',
          data: {
            webhookUrl: maskUrl(webhookUrl),
            statusCode: response.status,
            attempt,
            deliveryId: response.config.headers['X-Formboom-Delivery-ID'],
          },
        });
        break;
      } else {
        // 4xx errors - don't retry
        logger.warn({
          name: 'WEBHOOK_DELIVERY_CLIENT_ERROR',
          data: {
            webhookUrl: maskUrl(webhookUrl),
            statusCode: response.status,
            attempt,
            response: response.data,
          },
        });
        break;
      }
    } catch (error) {
      deliveryResult.error = error.message;
      deliveryResult.statusCode = error.response?.status || null;

      const isLastAttempt = attempt === maxRetries;
      const shouldRetry = !isLastAttempt && isRetryableError(error);

      logger.warn({
        name: 'WEBHOOK_DELIVERY_ERROR',
        data: {
          webhookUrl: maskUrl(webhookUrl),
          error: error.message,
          statusCode: error.response?.status,
          attempt,
          willRetry: shouldRetry,
        },
      });

      if (shouldRetry) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        break;
      }
    }
  }

  return deliveryResult;
};

/**
 * Format form submission data for webhook payload
 * @param {object} form - The form object
 * @param {object} formData - The form submission data
 * @param {string} ipAddress - The IP address of the submitter
 * @param {object} submission - The submission record
 * @returns {object} - Formatted webhook payload
 */
export const formatWebhookPayload = (form, formData, ipAddress, submission) => {
  return {
    event: 'form.submission',
    timestamp: new Date().toISOString(),
    form: {
      id: form.id,
      name: form.formName,
      description: form.formDescription,
      alias: form.alias,
    },
    submission: {
      id: submission.id,
      submittedAt: submission.submittedAt,
      isSpam: submission.isSpam,
      spamScore: submission.spamScore,
      ipAddress,
    },
    data: formData,
    metadata: {
      userAgent: 'Formboom/1.0',
      source: 'Formboom',
    },
  };
};

/**
 * Test webhook URL by sending a sample payload
 * @param {string} webhookUrl - The webhook URL to test
 * @param {object} form - The form object for context
 * @returns {Promise<object>} - Test result
 */
export const testWebhook = async (webhookUrl, form) => {
  const testPayload = {
    event: 'form.test',
    timestamp: new Date().toISOString(),
    form: {
      id: form.id,
      name: form.formName,
      description: form.formDescription,
      alias: form.alias,
    },
    submission: {
      id: 'test-submission-id',
      submittedAt: new Date().toISOString(),
      isSpam: false,
      spamScore: 0,
      ipAddress: '127.0.0.1',
    },
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      message: 'This is a test webhook from Formboom.',
    },
    metadata: {
      userAgent: 'Formboom/1.0',
      source: 'Formboom',
      test: true,
    },
  };

  return await sendWebhook(webhookUrl, testPayload, 1); // Only 1 attempt for tests
};

/**
 * Check if an error is retryable
 * @param {Error} error - The error to check
 * @returns {boolean} - Whether the error is retryable
 */
const isRetryableError = (error) => {
  // Retry on network errors, timeouts, and 5xx server errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
    return true;
  }

  const status = error.response?.status;
  return status >= 500 || status === 429; // Server errors or rate limiting
};

/**
 * Mask sensitive parts of URL for logging
 * @param {string} url - The URL to mask
 * @returns {string} - Masked URL
 */
const maskUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
  } catch {
    return 'invalid-url';
  }
};

/**
 * Generate unique delivery ID for tracking
 * @returns {string} - Unique delivery ID
 */
const generateDeliveryId = () => {
  return `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
