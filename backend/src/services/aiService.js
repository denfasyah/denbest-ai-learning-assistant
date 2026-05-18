const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate a response from Gemini AI with context and history
 * @param {string} systemPrompt - Instructions and document context
 * @param {Array} history - Previous messages in Gemini format
 * @param {string} userMessage - Latest message from the user
 * @param {Object} imageAttachment - Optional image attachment details { path, mimeType }
 * @returns {Promise<string>} AI response text
 */
const generateResponse = async (systemPrompt, history, userMessage, imageAttachment = null) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 30000)
    );

    let result;
    if (imageAttachment && imageAttachment.path) {
      const imageBuffer = fs.readFileSync(imageAttachment.path);
      const base64Image = imageBuffer.toString('base64');
      
      const contents = [
        ...history,
        {
          role: 'user',
          parts: [
            { text: userMessage },
            {
              inlineData: {
                data: base64Image,
                mimeType: imageAttachment.mimeType
              }
            }
          ]
        }
      ];

      result = await Promise.race([
        model.generateContent({ contents }),
        timeoutPromise
      ]);
    } else {
      const chat = model.startChat({
        history: history
      });

      result = await Promise.race([
        chat.sendMessage(userMessage),
        timeoutPromise
      ]);
    }

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
