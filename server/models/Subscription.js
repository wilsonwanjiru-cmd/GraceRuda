// server/models/Subscription.js
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    plan: {
        type: String,
        enum: ['premium_monthly', 'chat_credits'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'KES',
    },
    paymentMethod: {
        type: String,
        enum: ['mpesa', 'paypal', ''],
        default: '',
    },
    paymentId: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
    },
    expiryDate: {
        type: Date,
        default: null,
    },
    credits: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);