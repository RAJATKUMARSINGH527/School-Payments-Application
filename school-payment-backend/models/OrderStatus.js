const mongoose = require('mongoose');

const orderStatusSchema = new mongoose.Schema({
  collect_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Order', index: true },
  order_amount: { type: Number, required: true },
  transaction_amount: { type: Number, default: null },
  payment_mode: { type: String, default: null },
  payment_details: { type: String, default: null },
  bank_reference: { type: String, default: null },
  payment_message: { type: String, default: null },
  status: { type: String, default: null },
  error_message: { type: String, default: null },
  payment_time: { type: Date, default: Date.now },
  custom_order_id: { type: String, required: true, index: true }
});

module.exports = mongoose.model('OrderStatus', orderStatusSchema);
