const express = require('express');
const router = express.Router();
const { 
  getConversations, 
  createConversation,
  getConversationMessages,
  sendConversationMessage
} = require('../controllers/assistantController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/conversations', verifyToken, getConversations);
router.post('/conversations', verifyToken, createConversation);
router.get('/conversations/:id/messages', verifyToken, getConversationMessages);
router.post('/conversations/:id/messages', verifyToken, sendConversationMessage);

module.exports = router;
