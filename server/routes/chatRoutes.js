// server/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const {
    getConversations,
    startConversation,
    getMessages,
    sendMessage,
    markAsRead,
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.get('/conversations', protect, getConversations);
router.post('/conversations', protect, startConversation);
router.get('/messages/:conversationId', protect, getMessages);
router.post('/messages/:conversationId', protect, sendMessage);
router.put('/conversations/:conversationId/read', protect, markAsRead);

module.exports = router;