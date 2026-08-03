// server/controllers/paymentController.js
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { stkPush, queryStatus } = require('../services/mpesaService');

// Initiate STK Push
exports.initiateSTKPush = async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body;
    const userId = req.user._id;

    if (!phoneNumber || !amount) {
      return res.status(400).json({ message: 'Phone number and amount are required.' });
    }

    // Optionally, validate amount (KES 10 for chat credits)
    if (amount !== 10) {
      return res.status(400).json({ message: 'Invalid amount. Please use KES 10 for chat credits.' });
    }

    // Store a pending subscription record
    const subscription = await Subscription.create({
      userId,
      plan: 'chat_credits',
      amount,
      currency: 'KES',
      paymentMethod: 'mpesa',
      status: 'pending',
      credits: 50, // 50 messages for KES 10
    });

    // Initiate STK Push
    const response = await stkPush(phoneNumber, amount);

    // Update subscription with CheckoutRequestID
    subscription.paymentId = response.CheckoutRequestID;
    await subscription.save();

    // Respond with CheckoutRequestID for frontend polling
    res.status(200).json({
      message: 'STK Push initiated. Please check your phone.',
      CheckoutRequestID: response.CheckoutRequestID,
      subscriptionId: subscription._id,
    });
  } catch (error) {
    console.error('Initiate STK Push error:', error);
    res.status(500).json({ message: error.message || 'Failed to initiate payment.' });
  }
};

// Callback endpoint for M-PESA (webhook)
exports.mpesaCallback = async (req, res) => {
  try {
    const { Body } = req.body;
    // Body.stkCallback contains the result
    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = Body.stkCallback;

    // Find the subscription with this CheckoutRequestID
    const subscription = await Subscription.findOne({ paymentId: CheckoutRequestID });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    if (ResultCode === 0) {
      // Payment successful
      // Extract amount and phone number from metadata (optional)
      const metadata = CallbackMetadata.Item.reduce((acc, item) => {
        acc[item.Name] = item.Value;
        return acc;
      }, {});

      // Update subscription
      subscription.status = 'completed';
      await subscription.save();

      // Add credits to user
      const user = await User.findById(subscription.userId);
      if (user) {
        user.chatCredits += 50; // KES 10 = 50 credits
        await user.save();
      }

      // Optionally, emit a real-time notification to the user
      const io = req.app.get('socketio');
      if (io) {
        io.to(`user:${subscription.userId}`).emit('payment-success', {
          message: 'Payment successful! 50 chat credits added.',
          credits: user.chatCredits,
        });
      }

      res.status(200).json({ message: 'Payment processed successfully' });
    } else {
      // Payment failed
      subscription.status = 'failed';
      await subscription.save();
      res.status(200).json({ message: 'Payment failed', ResultCode, ResultDesc });
    }
  } catch (error) {
    console.error('M-PESA callback error:', error);
    res.status(500).json({ message: 'Callback processing error' });
  }
};

// Optional: Poll payment status (for frontend)
exports.getPaymentStatus = async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;
    const result = await queryStatus(checkoutRequestId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};