// server/models/Like.js
const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    targetUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

// Ensure unique like pair
LikeSchema.index({ sender: 1, targetUserId: 1 }, { unique: true });

module.exports = mongoose.model('Like', LikeSchema);