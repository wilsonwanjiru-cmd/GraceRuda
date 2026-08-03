// server/services/mpesaService.js
const axios = require('axios');
const { consumerKey, consumerSecret, passkey, shortCode, accountReference, environment, callbackUrl } = require('../config/daraja');

// Base URL for Safaricom API
const baseURL = environment === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

// Get OAuth access token
const getAccessToken = async () => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  try {
    const response = await axios.get(`${baseURL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('M-PESA access token error:', error.response?.data || error.message);
    throw new Error('Failed to get M-PESA access token');
  }
};

// Initiate STK Push
const stkPush = async (phoneNumber, amount, accountReferenceOverride = null) => {
  const accessToken = await getAccessToken();

  // Format phone number: remove leading +, ensure 254...
  let formattedPhone = phoneNumber.replace(/\s/g, '');
  if (formattedPhone.startsWith('+')) formattedPhone = formattedPhone.slice(1);
  if (!formattedPhone.startsWith('254')) {
    // Assume it's a local number, prepend 254
    formattedPhone = `254${formattedPhone}`;
  }
  // Ensure it's exactly 12 digits (254 + 9 digits)
  if (formattedPhone.length !== 12) {
    throw new Error('Invalid phone number. Must be 12 digits (e.g., 2547XXXXXXXX).');
  }

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

  const requestBody = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: formattedPhone,
    PartyB: shortCode,
    PhoneNumber: formattedPhone,
    CallBackURL: callbackUrl,
    AccountReference: accountReferenceOverride || accountReference,
    TransactionDesc: 'Chat Credits',
  };

  try {
    const response = await axios.post(
      `${baseURL}/mpesa/stkpush/v1/processrequest`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('STK Push error:', error.response?.data || error.message);
    throw new Error('STK Push request failed');
  }
};

// Query payment status (optional, for polling)
const queryStatus = async (checkoutRequestID) => {
  const accessToken = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

  const requestBody = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestID,
  };

  try {
    const response = await axios.post(
      `${baseURL}/mpesa/stkpushquery/v1/query`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Status query error:', error.response?.data || error.message);
    throw new Error('Failed to query payment status');
  }
};

module.exports = { stkPush, queryStatus };