const express = require('express');
const router = express.Router();
const { getConversations } = require('../controllers/assistantController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/conversations', verifyToken, getConversations);

module.exports = router;
