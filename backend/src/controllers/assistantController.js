const mongoose = require('mongoose');
const AiConversation = require('../models/AiConversation');

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

module.exports = {
  getConversations
};
