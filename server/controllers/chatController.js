// server/controllers/chatController.js
// server/controllers/chatController.js
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const { containsPhoneNumber } = require('../utils/filter');

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

    // 1. Validate conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ message: 'Not a participant' });
    }

    // 2. Phone number filtering
    if (text && containsPhoneNumber(text)) {
      return res.status(400).json({
        message: 'Phone numbers are not allowed in chat. Please use our platform to communicate.',
      });
    }

    // 3. Get user and check eligibility
    const user = await User.findById(userId);
    const isPremium = user.premium && user.premiumExpiry && user.premiumExpiry > new Date();

    let canSend = false;
    let needsPayment = false;

    if (isPremium) {
      canSend = true;
    } else if (user.freeMessagesUsed < 5) {
      canSend = true;
    } else if (user.chatCredits > 0) {
      canSend = true;
    } else {
      // No free messages left and no credits
      return res.status(403).json({
        message: 'You have used your free messages. Please purchase chat credits to continue.',
        needsPayment: true,
        credits: user.chatCredits,
        freeUsed: user.freeMessagesUsed,
      });
    }

    // 4. Create the message
    const message = await Message.create({
      conversationId,
      sender: userId,
      text: text || '',
      image: image || '',
      readBy: [userId],
    });

    // 5. Update conversation's lastMessage
    conversation.lastMessage = message._id;
    await conversation.save();

    // 6. Deduct usage (only if not premium)
    if (!isPremium) {
      if (user.freeMessagesUsed < 5) {
        user.freeMessagesUsed += 1;
      } else if (user.chatCredits > 0) {
        user.chatCredits -= 1;
      }
      await user.save();
    }

    // 7. Populate sender info for response
    await message.populate('sender', 'fullname');

    // 8. Emit real‑time notification to recipient
    const recipientId = conversation.participants.find(
      (p) => p.toString() !== userId
    );
    if (recipientId) {
      const io = req.app.get('socketio');
      if (io) {
        io.to(`user:${recipientId}`).emit('new-notification', {
          type: 'message',
          from: userId,
          conversationId,
          message: message,
          createdAt: new Date(),
        });
      }
    }

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