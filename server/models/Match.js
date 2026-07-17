// server/models/Match.js
const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

// Ensure unique match pair
MatchSchema.index({ user1: 1, user2: 1 }, { unique: true });

module.exports = mongoose.model('Match', MatchSchema);