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

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from Origin: ${req.headers.origin}`);
  next();
});

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://school-payments-application.vercel.app"
    ];
    console.log("CORS Origin Check:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());




app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);
app.use('/transactions', transactionRoutes);
app.use('/webhook', webhookRoutes);

app.use(errorHandler);



// Test endpoint to verify server is alive
app.get('/test', (req, res) => {
  res.json({ message: 'Server is alive' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🟢 Starting server on port ${PORT}...`);
  try {
    await connectToDB();
    console.log(`🚀 Server is running and connected to MongoDB at http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
});
