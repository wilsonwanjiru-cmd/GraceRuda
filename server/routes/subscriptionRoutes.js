// server/routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const {
    createPremiumSubscription,
    buyChatCredits,
    getSubscriptionStatus,
    cancelPremium,
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

router.get('/status', protect, getSubscriptionStatus);
router.post('/premium', protect, createPremiumSubscription);
router.post('/credits', protect, buyChatCredits);
router.post('/cancel', protect, cancelPremium);

module.exports = router;