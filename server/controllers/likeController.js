// server/controllers/likeController.js
// server/controllers/likeController.js
const Like = require('../models/Like');
const Match = require('../models/Match');
const User = require('../models/User');

// @desc    Like a user
// @route   POST /api/likes
exports.likeUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const senderId = req.user._id;

    if (senderId.toString() === userId) {
      return res.status(400).json({ message: 'Cannot like yourself' });
    }

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already liked
    const existingLike = await Like.findOne({
      sender: senderId,
      targetUserId: userId,
    });

    if (existingLike) {
      return res.status(400).json({ message: 'Already liked this user' });
    }

    // Create like
    const like = await Like.create({
      sender: senderId,
      targetUserId: userId,
    });

    // Check if mutual (target user liked sender)
    const mutualLike = await Like.findOne({
      sender: userId,
      targetUserId: senderId,
    });

    let match = null;
    if (mutualLike) {
      // Create match
      match = await Match.create({
        user1: senderId,
        user2: userId,
      });
      // Populate match data
      match = await Match.findById(match._id)
        .populate('user1', 'fullname photos premium')
        .populate('user2', 'fullname photos premium');
    }

    // ✅ Real‑time notification to target user
    const io = req.app.get('socketio');
    if (io) {
      io.to(`user:${targetUser._id}`).emit('new-notification', {
        type: mutualLike ? 'match' : 'like',
        from: senderId,
        targetUserId: targetUser._id,
        match: match || null,
        createdAt: new Date(),
      });
    }

    res.status(201).json({
      message: mutualLike ? 'It\'s a match! 🎉' : 'Liked successfully',
      match,
      liked: like,
    });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Unlike a user
// @route   DELETE /api/likes/:userId
exports.unlikeUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.user._id;

    const result = await Like.findOneAndDelete({
      sender: senderId,
      targetUserId: userId,
    });

    if (!result) {
      return res.status(404).json({ message: 'Like not found' });
    }

    res.json({ message: 'Unliked successfully', userId });
  } catch (error) {
    console.error('Unlike error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's likes
// @route   GET /api/likes
exports.getLikes = async (req, res) => {
  try {
    const userId = req.user._id;

    const likes = await Like.find({ sender: userId })
      .populate('targetUserId', 'fullname photos age city premium');

    const likedBy = await Like.find({ targetUserId: userId })
      .populate('sender', 'fullname photos age city premium');

    res.json({ likes, likedBy });
  } catch (error) {
    console.error('Get likes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};