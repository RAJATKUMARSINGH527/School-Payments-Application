const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
  payload: mongoose.Schema.Types.Mixed,
  received_at: { type: Date, default: Date.now },
  processed: { type: Boolean, default: false },
  result: String
});

module.exports = mongoose.model('WebhookLog', webhookLogSchema);
