// server/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { fullname, email, password, gender, lookingFor, age, country } = req.body;

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    // Create user
    const user = await User.create({
      fullname,
      email,
      password,
      gender,
      lookingFor,
      age,
      country: country || 'Kenya',
    });

    // Send verification email (non-blocking)
    try {
      await sendVerificationEmail(user.email, user._id);
    } catch (err) {
      console.error('Email send error:', err);
    }

    res.status(201).json({
      message: 'Registration successful. Please verify your email.',
      userId: user._id,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.isBlocked) return res.status(403).json({ message: 'Account blocked' });

    const token = generateToken(user._id);
    user.lastActive = new Date();
    await user.save();

    res.json({
      token,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        gender: user.gender,
        lookingFor: user.lookingFor,
        age: user.age,
        city: user.city,
        country: user.country,
        bio: user.bio,
        photos: user.photos,
        premium: user.premium,
        premiumExpiry: user.premiumExpiry,
        chatCredits: user.chatCredits,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.json({ message: 'Email already verified' });

    user.isVerified = true;
    await user.save();
    res.json({ message: 'Email verified successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user not found (security)
      return res.json({ message: 'If an account exists, a reset link has been sent.' });
    }
    await sendPasswordResetEmail(user.email, user._id);
    res.json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = password;
    await user.save();
    res.json({ message: 'Password reset successful!' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};