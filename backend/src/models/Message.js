const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AiConversation',
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  tokensUsed: {
    type: Number,
    default: 0
  },
  attachment: {
    fileUrl: { type: String, required: false },
    fileName: { type: String, required: false },
    fileType: { type: String, required: false },
    mimeType: { type: String, required: false }
  },
  extractedText: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
