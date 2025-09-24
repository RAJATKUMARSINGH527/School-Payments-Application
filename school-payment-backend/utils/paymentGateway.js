const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Creates a payment collect request and returns the API response
exports.createCollectRequest = async (school_id, amount, callback_url) => {
  try {
    // Prepare JWT payload as per API docs
    const payload = {
      school_id: school_id,
      amount: amount.toString(),
      callback_url: callback_url
    };

    console.log('[PaymentAPI] Generating JWT sign with payload:', payload);

    // Sign the payload using PG secret key from env
    const sign = jwt.sign(payload, process.env.PG_KEY);

    const requestBody = {
      school_id: school_id,
      amount: amount.toString(),
      callback_url,
      sign
    };

    console.log('[PaymentAPI] Sending POST request with body:', requestBody);

    const response = await axios.post(
      'https://dev-vanilla.edviron.com/erp/create-collect-request',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PAYMENT_API_KEY}`
        }
      }
    );

    console.log('[PaymentAPI] Response received:', response.data);

    return response.data;

  } catch (error) {
    console.error('[PaymentAPI] Error during createCollectRequest:', error.response?.data || error.message);
    throw error;
  }
};
