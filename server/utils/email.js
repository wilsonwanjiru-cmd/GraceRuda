// server/utils/email.js
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateEmailToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const sendVerificationEmail = async (email, userId) => {
  const token = generateEmailToken(userId);
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Ruda Dating" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify Your Email - Ruda Dating',
    html: `<div style="font-family: Arial, sans-serif; max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9;border-radius:10px;">
      <h1 style="color:#e9405f;text-align:center;">Ruda Dating</h1>
      <h2 style="color:#333;text-align:center;">Welcome to Ruda Dating!</h2>
      <p style="color:#555;text-align:center;">Please verify your email address to get started.</p>
      <div style="text-align:center;margin:30px 0;">
        <a href="${verificationUrl}" style="background:#e9405f;color:white;padding:12px 30px;text-decoration:none;border-radius:25px;font-weight:bold;">Verify Email</a>
      </div>
      <p style="color:#777;font-size:12px;text-align:center;">If you didn't create an account, please ignore this email.</p>
      <p style="color:#777;font-size:12px;text-align:center;">This link expires in 24 hours.</p>
    </div>`,
  });
};

const sendPasswordResetEmail = async (email, userId) => {
  const token = generateEmailToken(userId);
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: `"Ruda Dating" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Reset Your Password - Ruda Dating',
    html: `<div style="font-family: Arial, sans-serif; max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9;border-radius:10px;">
      <h1 style="color:#e9405f;text-align:center;">Ruda Dating</h1>
      <h2 style="color:#333;text-align:center;">Reset Your Password</h2>
      <p style="color:#555;text-align:center;">We received a request to reset your password.</p>
      <div style="text-align:center;margin:30px 0;">
        <a href="${resetUrl}" style="background:#e9405f;color:white;padding:12px 30px;text-decoration:none;border-radius:25px;font-weight:bold;">Reset Password</a>
      </div>
      <p style="color:#777;font-size:12px;text-align:center;">If you didn't request this, please ignore this email.</p>
      <p style="color:#777;font-size:12px;text-align:center;">This link expires in 24 hours.</p>
    </div>`,
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };