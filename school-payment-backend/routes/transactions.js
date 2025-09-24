const express = require('express');
const mongoose = require('mongoose');
const transactionRoutes = express.Router();
const auth = require('../middlewares/auth.middleware');
const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');

// GET /transactions - fetch all transactions with pagination & sorting
transactionRoutes.get('/', auth, async (req, res, next) => {
  try {
    let { limit = 10, page = 1, sort = 'payment_time', order = 'desc' } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    console.log(`[Transactions] Fetching transactions | Page: ${page}, Limit: ${limit}, Sort: ${sort} (${order})`);

    const pipeline = [
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'status',
        },
      },
      { $unwind: '$status' },
      { $sort: { [`status.${sort}`]: order === 'desc' ? -1 : 1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          collect_id: '$_id',
          school_id: 1,
          order_id: '$_id',
          edviron_order_id: '$status.custom_order_id',
          order_amount: '$status.order_amount',
          transaction_amount: '$status.transaction_amount',
          payment_method: '$status.payment_mode',
          status: '$status.status',
          date_time: { $ifNull: ['$status.payment_time', '$createdAt'] },
          student_name: '$student_info.name',
          student_id: '$student_info.id',
          phone_no: { $ifNull: ['$student_info.phone', ''] },
          gateway: '$gateway_name',
        },
      },
    ];

    const result = await Order.aggregate(pipeline);

    console.log(`[Transactions] Fetched ${result.length} transactions.`);

    res.json({ message: 'Transactions retrieved successfully.', data: result });
  } catch (err) {
    console.error('[Transactions] Failed to fetch transactions:', err);
    res.status(500).json({ message: 'Failed to fetch transactions.', error: err.message });
  }
});

// GET /transactions/school/:schoolId - fetch transactions for a specific school
transactionRoutes.get('/school/:schoolId', auth, async (req, res, next) => {
  try {
    const { schoolId } = req.params;

    console.log(`[Transactions] Fetching transactions for school ID: ${schoolId}`);

    const pipeline = [
      { $match: { school_id: new mongoose.Types.ObjectId(schoolId) } }, // FIX here with new operator
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'status',
        },
      },
      { $unwind: '$status' },
      {
        $project: {
          collect_id: '$_id',
          school_id: 1,
          order_id: '$_id',
          edviron_order_id: '$status.custom_order_id',
          order_amount: '$status.order_amount',
          transaction_amount: '$status.transaction_amount',
          payment_method: '$status.payment_mode',
          status: '$status.status',
          date_time: { $ifNull: ['$status.payment_time', '$createdAt'] },
          student_name: '$student_info.name',
          student_id: '$student_info.id',
          phone_no: { $ifNull: ['$student_info.phone', ''] },
          gateway: '$gateway_name',
        },
      },
    ];

    const result = await Order.aggregate(pipeline);

    console.log(`[Transactions] Retrieved ${result.length} transactions for school ID ${schoolId}.`);

    res.json({ message: `Transactions for school ID ${schoolId} retrieved successfully.`, data: result });
  } catch (err) {
    console.error(`[Transactions] Failed to fetch transactions for school ID ${req.params.schoolId}:`, err);
    res.status(500).json({ message: 'Failed to fetch school transactions.', error: err.message });
  }
});

// GET /transactions/status/:custom_order_id - get transaction status by custom order ID
transactionRoutes.get('/status/:custom_order_id', auth, async (req, res, next) => {
  try {
    const { custom_order_id } = req.params;

    console.log(`[Transactions] Fetching status for custom order ID: ${custom_order_id}`);

    const status = await OrderStatus.findOne({ custom_order_id });

    if (!status) {
      console.warn(`[Transactions] No transaction found with custom order ID: ${custom_order_id}`);
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    console.log(`[Transactions] Transaction status for ${custom_order_id}: ${status.status}`);

    res.json({
      message: 'Transaction status retrieved successfully.',
      status: status.status,
      collect_id: status.collect_id,
      order_amount: status.order_amount,
      transaction_amount: status.transaction_amount,
      payment_mode: status.payment_mode,
      payment_details: status.payment_details,
      bank_reference: status.bank_reference,
      payment_message: status.payment_message,
      error_message: status.error_message,
      payment_time: status.payment_time,
    });
  } catch (err) {
    console.error(`[Transactions] Error fetching transaction status for custom order ID ${req.params.custom_order_id}:`, err);
    res.status(500).json({ message: 'Failed to fetch transaction status.', error: err.message });
  }
});

module.exports = transactionRoutes;
