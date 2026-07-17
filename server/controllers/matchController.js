// server/controllers/matchController.js
const Match = require('../models/Match');
const Like = require('../models/Like');

// @desc    Get all matches for current user
// @route   GET /api/matches
exports.getMatches = async (req, res) => {
    try {
        const userId = req.user._id;

        const matches = await Match.find({
            $or: [{ user1: userId }, { user2: userId }],
            isActive: true,
        })
            .populate('user1', 'fullname photos age city premium')
            .populate('user2', 'fullname photos age city premium');

        // Get likes and likedBy
        const likes = await Like.find({ sender: userId })
            .populate('targetUserId', 'fullname photos age city premium');

        const likedBy = await Like.find({ targetUserId: userId })
            .populate('sender', 'fullname photos age city premium');

        res.json({ matches, likes, likedBy });
    } catch (error) {
        console.error('Get matches error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};