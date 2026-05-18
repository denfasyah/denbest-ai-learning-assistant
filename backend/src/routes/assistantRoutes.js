const express = require('express');
const router = express.Router();
const { 
  getConversations, 
  createConversation,
  getConversationMessages,
  sendConversationMessage,
  renameConversation,
  deleteConversation
} = require('../controllers/assistantController');
const { verifyToken } = require('../middlewares/authMiddleware');
const assistantUpload = require('../middlewares/assistantUploadMiddleware');

router.get('/conversations', verifyToken, getConversations);
router.post('/conversations', verifyToken, createConversation);
router.get('/conversations/:id/messages', verifyToken, getConversationMessages);
router.post('/conversations/:id/messages', verifyToken, assistantUpload.single('file'), sendConversationMessage);
router.patch('/conversations/:id', verifyToken, renameConversation);
router.delete('/conversations/:id', verifyToken, deleteConversation);

module.exports = router;
