const chatService = require('../services/chatService');

const sendMessage = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message required'
      });
    }

    const result = await chatService.sendMessage(workspaceId, userId, message.trim());

    res.status(200).json({
      success: true,
      data: {
        message: result.message,
        conversationId: result.conversationId,
        role: 'assistant',
        createdAt: result.createdAt
      }
    });
  } catch (error) {
    console.error('Chat Controller Error:', error);
    
    // Map specific service errors to HTTP status codes
    if (error.message === 'Document not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === 'No readable text') {
      return res.status(422).json({ success: false, message: error.message });
    }
    if (error.message === 'TIMEOUT') {
      return res.status(504).json({ success: false, message: 'AI response timeout. Please try again.' });
    }
    if (error.message === 'RATE_LIMIT_EXCEEDED' || error.message === 'RATE_LIMIT') {
      return res.status(429).json({ success: false, message: 'RATE_LIMIT' });
    }
    if (error.message === 'CONFIG_ERROR') {
      return res.status(500).json({ success: false, message: 'AI service error.' });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while communicating with the AI.'
    });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;

    const data = await chatService.getChatHistory(workspaceId, userId);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get Chat History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat history.'
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory
};