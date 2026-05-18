const mongoose = require('mongoose');

const aiConversationSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  type: {
    type: String,
    enum: ['workspace', 'global'],
    default: 'workspace'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AiConversation', aiConversationSchema);
