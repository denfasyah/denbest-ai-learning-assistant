const mongoose = require('mongoose');

const aiConversationSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AiConversation', aiConversationSchema);
