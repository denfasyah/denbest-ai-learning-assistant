const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate a response from Gemini AI with context and history
 * @param {string} systemPrompt - Instructions and document context
 * @param {Array} history - Previous messages in Gemini format
 * @param {string} userMessage - Latest message from the user
 * @returns {Promise<string>} AI response text
 */
const generateResponse = async (systemPrompt, history, userMessage) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt
    });

    const chat = model.startChat({
      history: history
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 30000)
    );

    const result = await Promise.race([
      chat.sendMessage(userMessage),
      timeoutPromise
    ]);

    if (!result || !result.response) {
      throw new Error('EMPTY_RESPONSE');
    }

    const text = result.response.text();
    if (!text) throw new Error('EMPTY_RESPONSE');

    return text;
  } catch (error) {
    console.error('Gemini AI Service Error:', error);

    // Map specific errors to custom codes for the controller
    if (error.message === 'TIMEOUT') throw error;

    const status = error.status || (error.response && error.response.status);
    const statusText = error.statusText || (error.response && error.response.statusText) || '';
    const message = error.message || '';

    if (
      status === 429 ||
      message.includes('429') ||
      statusText.toLowerCase().includes('too many requests') ||
      message.toLowerCase().includes('quota')
    ) {
      throw new Error('RATE_LIMIT_EXCEEDED');
    }

    if (status === 401 || status === 403) throw new Error('CONFIG_ERROR');

    throw error;
  }
};

module.exports = {
  generateResponse
};
