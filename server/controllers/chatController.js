// server/controllers/chatController.js
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get all conversations for current user
// @route   GET /api/chat/conversations
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        const conversations = await Conversation.find({
            participants: userId,
        })
            .populate('participants', 'fullname photos premium')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        // Add unread count
        const convWithUnread = await Promise.all(
            conversations.map(async (conv) => {
                const unreadCount = await Message.countDocuments({
                    conversationId: conv._id,
                    sender: { $ne: userId },
                    readBy: { $ne: userId },
                });
                const convObj = conv.toObject();
                convObj.unreadCount = unreadCount;
                return convObj;
            })
        );

        res.json(convWithUnread);
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Start a new conversation
// @route   POST /api/chat/conversations
exports.startConversation = async (req, res) => {
    try {
        const { userId } = req.body;
        const senderId = req.user._id;

        if (senderId.toString() === userId) {
            return res.status(400).json({ message: 'Cannot start conversation with yourself' });
        }

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, userId] },
        });

        if (conversation) {
            return res.json(conversation);
        }

        // Create new conversation
        conversation = await Conversation.create({
            participants: [senderId, userId],
        });

        await conversation.populate('participants', 'fullname photos premium');

        res.status(201).json(conversation);
    } catch (error) {
        console.error('Start conversation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/messages/:conversationId
exports.getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (!conversation.participants.includes(userId)) {
            return res.status(403).json({ message: 'Not a participant' });
        }

        const messages = await Message.find({
            conversationId,
            isDeleted: false,
        })
            .sort({ createdAt: 1 })
            .limit(100);

        // Mark messages as read
        await Message.updateMany(
            {
                conversationId,
                sender: { $ne: userId },
                readBy: { $ne: userId },
            },
            { $addToSet: { readBy: userId } }
        );

        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Send a message
// @route   POST /api/chat/messages/:conversationId
exports.sendMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { text, image } = req.body;
        const userId = req.user._id;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (!conversation.participants.includes(userId)) {
            return res.status(403).json({ message: 'Not a participant' });
        }

        // Check message limit for free users
        const user = await User.findById(userId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayMessages = await Message.countDocuments({
            conversationId,
            sender: userId,
            createdAt: { $gte: today },
        });

        if (!user.premium && todayMessages >= 5) {
            return res.status(403).json({
                message: 'Free users can send 5 messages per day. Upgrade to premium for unlimited messaging.',
                limitReached: true,
            });
        }

        // Check chat credits for pay-per-chat users
        if (!user.premium && user.chatCredits <= 0 && todayMessages >= 5) {
            return res.status(403).json({
                message: 'You have no chat credits. Buy credits or upgrade to premium.',
                noCredits: true,
            });
        }

        // Deduct credit if not premium
        if (!user.premium && user.chatCredits > 0) {
            user.chatCredits -= 1;
            await user.save();
        }

        const message = await Message.create({
            conversationId,
            sender: userId,
            text: text || '',
            image: image || '',
            readBy: [userId],
        });

        // Update conversation last message
        conversation.lastMessage = message._id;
        await conversation.save();

        await message.populate('sender', 'fullname');

        res.status(201).json(message);
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Mark conversation as read
// @route   PUT /api/chat/conversations/:conversationId/read
exports.markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;

        await Message.updateMany(
            {
                conversationId,
                sender: { $ne: userId },
                readBy: { $ne: userId },
            },
            { $addToSet: { readBy: userId } }
        );

        res.json({ message: 'Marked as read' });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};