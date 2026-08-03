// server/config/daraja.js
module.exports = {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  passkey: process.env.MPESA_PASSKEY,
  shortCode: process.env.MPESA_SHORTCODE || '529914', // your PayBill number
  accountReference: '393104', // your account number
  environment: process.env.MPESA_ENVIRONMENT || 'sandbox', // 'sandbox' or 'production'
  callbackUrl: process.env.MPESA_CALLBACK_URL || 'https://your-domain.com/api/payments/mpesa/callback',
};