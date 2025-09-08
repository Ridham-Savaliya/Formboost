import config from '#config/index.js';
import { GoogleGenAI } from '@google/genai';
import logger from '#utils/logger.js';

const ai = new GoogleGenAI({
  apiKey: config.gemini.apiKey,
});

export const isSpamWithOpenAIasync = async (
  data,
  formContext = 'No Context Review the Submission Data'
) => {
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-preview-06-17',
      contents: `
          You are an intelligent spam classifier for form submissions.
          Your task is to analyze the given formContext and submissionData and decide whether the submission is spam.

          Form Context:
          ${formContext}

          Submission Data:
          ${JSON.stringify(data, null, 2)}

          Instructions:

          Carefully evaluate the formContext to understand the form's genuine purpose and the type of responses that are appropriate.

          Evaluate each key in the submissionData and verify that its value is appropriate, valid, and genuine.

          Pay special attention to fields like IP address, email, phone number, and name:

          Check if the IP address is valid and not from a known blocked or suspicious source.

          Check if the email domain appears trustworthy and is not associated with known spammers or disposable email services.

          Check if the phone number format is realistic and does not appear fabricated.

          Thoroughly inspect the submissionData for other characteristics commonly associated with spam, such as:

          Irrelevant or off-topic content

          Suspicious or unsolicited links

          Generic filler text

          Fabricated or inconsistent details

          Respond only with a well-structured JSON object in the exact format below:

          {
          "isSpam": boolean, // true if the submission is spam; false if legitimate
          "score": number, // integer from 0 (definitely not spam) to 100 (definitely spam)
          "reason": string // Clear, concise reason for your decision
          }

          Do not include any additional text or commentary outside the JSON.`,
    });

    const raw = result.text.trim();

    const clean = raw
      .replace(/^```json\s*/, '')
      .replace(/^```\s*/, '')
      .replace(/```$/, '')
      .trim();

    let output;
    try {
      output = JSON.parse(clean);
    } catch (err) {
      logger.error({
        name: 'ERROR_PARSING_GEMINI_RESPONSE',
        data: {
          error: err,
          rawResponse: raw,
          cleanResponse: clean,
        },
      });
      output = { isSpam: null, reason: 'Could not parse response' };
    }

    return output;
  } catch (error) {
    logger.error({
      name: 'GEMINI_SPAM_CHECK_ERROR',
      data: {
        error,
        submissionData: data,
        formContext,
      },
    });
    return { isSpam: null, reason: 'Error during spam check' };
  }
};
