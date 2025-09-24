const mongoose = require('mongoose');
require('dotenv').config();

const connectToDB = async () => {
  console.log('[DB] Starting connection to MongoDB Atlas...');
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('[DB] Successfully connected to MongoDB Atlas');
  } catch (error) {
    console.error('[DB] Error connecting to MongoDB Atlas:', error);
    process.exit(1); // Terminate process if DB connection fails
  }
};

module.exports = { connectToDB };
