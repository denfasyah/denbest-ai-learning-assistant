const mongoose = require('mongoose');
const AiConversation = require('../models/AiConversation');
const Message = require('../models/Message');
const Document = require('../models/Document');
const aiService = require('../services/aiService');
const promptBuilder = require('../utils/promptBuilder');

/**
 * Get all conversations for the logged-in user across workspaces
 * GET /api/v1/assistant/conversations
 */
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await AiConversation.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }
      },
      // Lookup to count messages in the conversation
      {
        $lookup: {
          from: 'messages',
          localField: '_id',
          foreignField: 'conversationId',
          as: 'allMessages'
        }
      },
      // Lookup to get the single latest message
      {
        $lookup: {
          from: 'messages',
          let: { convId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$conversationId', '$$convId'] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 }
          ],
          as: 'lastMessageArr'
        }
      },
      {
        $project: {
          id: '$_id',
          _id: 0,
          workspaceId: 1,
          title: 1,
          createdAt: 1,
          updatedAt: 1,
          messageCount: { $size: '$allMessages' },
          lastMessageObj: { $arrayElemAt: ['$lastMessageArr', 0] }
        }
      },
      {
        $project: {
          id: 1,
          workspaceId: 1,
          title: 1,
          createdAt: 1,
          updatedAt: 1,
          messageCount: 1,
          lastMessage: { $ifNull: ['$lastMessageObj.content', ''] },
          time: { $ifNull: ['$lastMessageObj.createdAt', '$updatedAt'] }
        }
      },
      {
        $sort: { updatedAt: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('[AssistantController] getConversations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve conversations'
    });
  }
};

/**
 * Create a new global empty conversation
 * POST /api/v1/assistant/conversations
 */
const createConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const newConv = await AiConversation.create({
      userId,
      workspaceId: null,
      title: 'New Conversation',
      type: 'global'
    });

    res.status(201).json({
      success: true,
      data: {
        id: newConv._id,
        workspaceId: null,
        title: newConv.title,
        messageCount: 0,
        lastMessage: '',
        time: newConv.updatedAt,
        createdAt: newConv.createdAt,
        updatedAt: newConv.updatedAt
      }
    });
  } catch (error) {
    console.error('[AssistantController] createConversation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create conversation'
    });
  }
};

/**
 * Get all messages for a specific conversation
 * GET /api/v1/assistant/conversations/:id/messages
 */
const getConversationMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const conversation = await AiConversation.findOne({ _id: id, userId });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const messages = await Message.find({ conversationId: id })
      .sort({ createdAt: 1 })
      .limit(100);

    res.status(200).json({
      success: true,
      data: {
        conversationId: id,
        messages
      }
    });
  } catch (error) {
    console.error('[AssistantController] getConversationMessages Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve messages'
    });
  }
};

/**
 * Send a message within a specific conversation
 * POST /api/v1/assistant/conversations/:id/messages
 */
const sendConversationMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message required'
      });
    }

    // Verify ownership
    const conversation = await AiConversation.findOne({ _id: id, userId });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Build history for Gemini
    const lastMessages = await Message.find({ conversationId: id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    const sortedMessages = lastMessages.reverse();
    const history = sortedMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Build system prompt based on type
    let systemPrompt = 'You are AiDen, a highly advanced global AI learning assistant developed by the Denbest team. Help the user learn anything, solve coding challenges, summarize texts, or clear up concepts with crystal-clear formatting.';
    if (conversation.workspaceId) {
      const document = await Document.findOne({ workspaceId: conversation.workspaceId });
      if (document && document.extractedText) {
        systemPrompt = promptBuilder.buildSystemPrompt(document.extractedText);
      }
    }

    // Generate AI Response
    const aiResponse = await aiService.generateResponse(systemPrompt, history, message.trim());

    // Save user message
    await Message.create({
      conversationId: id,
      role: 'user',
      content: message.trim()
    });

    // Save assistant message
    const assistantMsg = await Message.create({
      conversationId: id,
      role: 'assistant',
      content: aiResponse
    });

    res.status(200).json({
      success: true,
      data: {
        message: aiResponse,
        conversationId: id,
        role: 'assistant',
        createdAt: assistantMsg.createdAt
      }
    });
  } catch (error) {
    console.error('[AssistantController] sendConversationMessage Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to communicate with AI'
    });
  }
};

/**
 * Rename a specific conversation
 * PATCH /api/v1/assistant/conversations/:id
 */
const renameConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const conversation = await AiConversation.findOneAndUpdate(
      { _id: id, userId },
      { title: title.trim() },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('[AssistantController] renameConversation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rename conversation'
    });
  }
};

/**
 * Delete a specific conversation (cascade delete messages)
 * DELETE /api/v1/assistant/conversations/:id
 */
const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await AiConversation.findOneAndDelete({ _id: id, userId });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Cascade delete all messages in this conversation
    await Message.deleteMany({ conversationId: id });

    res.status(200).json({
      success: true,
      message: 'Conversation and all messages successfully deleted'
    });
  } catch (error) {
    console.error('[AssistantController] deleteConversation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete conversation'
    });
  }
};

module.exports = {
  getConversations,
  createConversation,
  getConversationMessages,
  sendConversationMessage,
  renameConversation,
  deleteConversation
};
