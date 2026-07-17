// server/controllers/subscriptionController.js
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// @desc    Create premium subscription (M-PESA / PayPal)
// @route   POST /api/subscriptions/premium
exports.createPremiumSubscription = async (req, res) => {
    try {
        const { paymentMethod, paymentId } = req.body;
        const userId = req.user._id;

        // In production, verify payment with M-PESA/PayPal API
        // For now, we'll simulate success

        const amount = 1500;
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);

        const subscription = await Subscription.create({
            userId,
            plan: 'premium_monthly',
            amount,
            currency: 'KES',
            paymentMethod,
            paymentId: paymentId || 'sim_' + Date.now(),
            status: 'completed',
            expiryDate,
        });

        // Update user
        await User.findByIdAndUpdate(userId, {
            premium: true,
            premiumExpiry: expiryDate,
        });

        res.json({
            message: 'Premium subscription activated!',
            subscription,
            expiryDate,
        });
    } catch (error) {
        console.error('Premium subscription error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Buy chat credits
// @route   POST /api/subscriptions/credits
exports.buyChatCredits = async (req, res) => {
    try {
        const { amount, paymentMethod, paymentId } = req.body;
        const userId = req.user._id;

        // 50 credits = KES 50
        const creditAmount = amount || 50;
        const credits = creditAmount; // 1 KES = 1 credit

        const subscription = await Subscription.create({
            userId,
            plan: 'chat_credits',
            amount: creditAmount,
            currency: 'KES',
            paymentMethod: paymentMethod || 'mpesa',
            paymentId: paymentId || 'sim_' + Date.now(),
            status: 'completed',
            credits,
        });

        // Update user credits
        await User.findByIdAndUpdate(userId, {
            $inc: { chatCredits: credits },
        });

        const user = await User.findById(userId);

        res.json({
            message: `${credits} chat credits added!`,
            credits: user.chatCredits,
            subscription,
        });
    } catch (error) {
        console.error('Buy credits error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get subscription status
// @route   GET /api/subscriptions/status
exports.getSubscriptionStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        res.json({
            premium: user.premium,
            premiumExpiry: user.premiumExpiry,
            chatCredits: user.chatCredits,
            isPremiumActive: user.premium && new Date(user.premiumExpiry) > new Date(),
        });
    } catch (error) {
        console.error('Subscription status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Cancel premium subscription
// @route   POST /api/subscriptions/cancel
exports.cancelPremium = async (req, res) => {
    try {
        const userId = req.user._id;

        await User.findByIdAndUpdate(userId, {
            premium: false,
            premiumExpiry: null,
        });

        res.json({ message: 'Premium subscription cancelled' });
    } catch (error) {
        console.error('Cancel premium error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
