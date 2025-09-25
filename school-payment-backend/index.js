const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectToDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const webhookRoutes = require('./routes/webhook');
const transactionRoutes = require('./routes/transactions');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

Frontend_URL = process.env.Frontend_URL
Frontend_Deployed_URL = process.env.Frontend_Deployed_URL


app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? Frontend_URL : Frontend_Deployed_URL,
  credentials: true,
}));



app.use(express.json());

app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);
app.use('/transactions', transactionRoutes);
app.use('/webhook', webhookRoutes);

/// Error handling middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🟢 Starting server on port ${PORT}...`);
  try {
    await connectToDB();
    console.log(`🚀 Server is running and connected to MongoDB at http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1); // Exit process if DB connection fails
  }
});
