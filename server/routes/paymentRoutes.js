// server/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  initiateSTKPush,
  mpesaCallback,
  getPaymentStatus,
} = require('../controllers/paymentController');

// All routes that require authentication
router.post('/mpesa/stkpush', protect, initiateSTKPush);
router.get('/mpesa/status/:checkoutRequestId', protect, getPaymentStatus);

// Callback endpoint (no auth, called by M-PESA)
router.post('/mpesa/callback', mpesaCallback);

module.exports = router;