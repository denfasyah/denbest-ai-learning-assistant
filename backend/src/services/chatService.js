const Document = require('../models/Document');
const AiConversation = require('../models/AiConversation');
const Message = require('../models/Message');
const aiService = require('./aiService');
const promptBuilder = require('../utils/promptBuilder');

/**
 * Send a message to AI and get a response
 * @param {string} workspaceId - Workspace ID
 * @param {string} userId - User ID
 * @param {string} userMessage - Message from the user
 */
const sendMessage = async (workspaceId, userId, userMessage) => {
  // 1. Find document context
  const document = await Document.findOne({ workspaceId });
  if (!document) {
    throw new Error('Document not found');
  }
  if (!document.extractedText || document.extractedText.trim() === '') {
    throw new Error('No readable text');
  }

  // 2. Find or create conversation
  let conversation = await AiConversation.findOne({ workspaceId, userId });
  if (!conversation) {
    conversation = await AiConversation.create({
      workspaceId,
      userId,
      title: document.originalName || 'New Conversation'
    });
  }

  // 3. Get last 10 messages for history
  const lastMessages = await Message.find({ conversationId: conversation._id })
    .sort({ createdAt: -1 })
    .limit(10);
  
  // Sort back to chronological order
  const sortedMessages = lastMessages.reverse();

  // 4. Format history for Gemini
  const history = sortedMessages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  // 5. Build system prompt
  const systemPrompt = promptBuilder.buildSystemPrompt(document.extractedText);

  // 6. Generate AI Response
  const aiResponse = await aiService.generateResponse(systemPrompt, history, userMessage);

  // 7. Save user message
  await Message.create({
    conversationId: conversation._id,
    role: 'user',
    content: userMessage
  });

  // 8. Save assistant message
  const assistantMsg = await Message.create({
    conversationId: conversation._id,
    role: 'assistant',
    content: aiResponse,
    tokensUsed: 0 // Optional: track token usage if needed
  });

  return {
    message: aiResponse,
    conversationId: conversation._id,
    createdAt: assistantMsg.createdAt
  };
};

/**
 * Get chat history for a workspace
 * @param {string} workspaceId - Workspace ID
 * @param {string} userId - User ID
 */
const getChatHistory = async (workspaceId, userId) => {
  const conversation = await AiConversation.findOne({ workspaceId, userId });
  if (!conversation) {
    return { conversationId: null, messages: [] };
  }

  // Get last 50 messages
  const messages = await Message.find({ conversationId: conversation._id })
    .sort({ createdAt: 1 })
    .limit(50);

  return {
    conversationId: conversation._id,
    messages
  };
};

module.exports = {
  sendMessage,
  getChatHistory
};
