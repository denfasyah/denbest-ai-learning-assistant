const mongoose = require('mongoose');
const AiConversation = require('../models/AiConversation');
const Message = require('../models/Message');
const Document = require('../models/Document');
const aiService = require('../services/aiService');
const promptBuilder = require('../utils/promptBuilder');
const { extractTextFromFile } = require('../utils/textExtractor');

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
    const hasFile = !!req.file;

    if ((!message || message.trim() === '') && !hasFile) {
      return res.status(400).json({
        success: false,
        message: 'Message or file required'
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

    // Extract attachment metadata if exists
    let attachment = null;
    let extractedText = null;
    if (req.file) {
      const isImage = req.file.mimetype.startsWith('image/') || ['.png', '.jpg', '.jpeg', '.webp'].some(ext => req.file.originalname.toLowerCase().endsWith(ext));
      attachment = {
        fileUrl: `/api/v1/uploads/${req.file.filename}`,
        fileName: req.file.originalname,
        fileType: isImage ? 'image' : 'document',
        mimeType: req.file.mimetype
      };

      // Extract text content if text-based document
      const isTextBased = ['.pdf', '.txt', '.doc', '.docx'].some(ext => req.file.originalname.toLowerCase().endsWith(ext));
      if (isTextBased) {
        extractedText = await extractTextFromFile(req.file.path, req.file.mimetype);
      }
    }

    // Build history for Gemini (injecting previous extractedText context)
    const lastMessages = await Message.find({ conversationId: id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    const sortedMessages = lastMessages.reverse();
    const history = sortedMessages.map(m => {
      let text = m.content;
      if (m.extractedText) {
        text = `[USER ATTACHED FILE: ${m.attachment?.fileName || 'Document'}]\n--- ISI FILE ---\n${m.extractedText}\n--- AKHIR ISI FILE ---\n\nPesan User: ${m.content}`;
      }
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text }]
      };
    });

    // Build system prompt based on type
    let systemPrompt = promptBuilder.buildGlobalSystemPrompt();
    if (conversation.workspaceId) {
      const document = await Document.findOne({ workspaceId: conversation.workspaceId });
      if (document && document.extractedText) {
        systemPrompt = promptBuilder.buildSystemPrompt(document.extractedText);
      }
    }

    // Inject vision system instruction if conversation has an image in history or current message
    const hasImageInHistory = sortedMessages.some(m => m.attachment && m.attachment.fileType === 'image') || (attachment && attachment.fileType === 'image');
    if (hasImageInHistory) {
      systemPrompt += `\n\n[Vision System Instruction]: Percakapan ini memiliki lampiran gambar. Jika user meminta untuk menganalisis atau mendeskripsikan gambar tersebut, jelaskan secara jujur, hangat, dan manis dengan nada Aiden: "Aku sudah menerima gambar kamu dan preview-nya tersimpan. Untuk analisis visual otomatis belum aktif saat ini." Jangan pernah berkata "Sebagai AI teks saya tidak bisa melihat gambar" atau "Saya adalah model bahasa besar yang tidak dapat memproses gambar". Tetap gunakan nada santai Aiden.`;
    }

    // Generate AI Response - works for documents & fallbacks dynamically
    const userPrompt = message ? message.trim() : (attachment ? `Mengirim file: ${attachment.fileName}` : '');
    let finalUserPrompt = userPrompt;
    if (extractedText) {
      finalUserPrompt = `[USER ATTACHED FILE: ${attachment.fileName}]\n--- ISI FILE ---\n${extractedText}\n--- AKHIR ISI FILE ---\n\nPesan User: ${userPrompt}`;
    }

    const aiResponse = await aiService.generateResponse(systemPrompt, history, finalUserPrompt);

    // Auto title generation if title is default
    if (conversation.title === 'New Conversation' || conversation.title === 'New Chat') {
      const msgCount = await Message.countDocuments({ conversationId: id });
      if (msgCount === 0) {
        let newTitle = message ? message.trim() : `Upload: ${attachment ? attachment.fileName : 'File'}`;
        const words = newTitle.split(/\s+/);
        if (words.length > 7) {
          newTitle = words.slice(0, 7).join(' ') + '...';
        } else if (newTitle.length > 47) {
          newTitle = newTitle.substring(0, 47) + '...';
        }
        conversation.title = newTitle;
        await conversation.save();
      }
    }

    // Save user message with attachment schema
    const userContent = message ? message.trim() : `Mengirim file: ${attachment ? attachment.fileName : 'File'}`;
    await Message.create({
      conversationId: id,
      role: 'user',
      content: userContent,
      attachment,
      extractedText
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
        createdAt: assistantMsg.createdAt,
        conversation
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
