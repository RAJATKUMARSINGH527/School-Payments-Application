const express = require('express');
const webhookRoutes = express.Router();
const OrderStatus = require('../models/OrderStatus');
const WebhookLog = require('../models/WebhookLog');

webhookRoutes.post('/', async (req, res, next) => {
  const { order_info } = req.body;
  console.log('[Webhook] Payload received:', req.body);

  try {
    const updated = await OrderStatus.findOneAndUpdate(
      { collect_id: order_info.order_id },
      {
        order_amount: order_info.order_amount,
        transaction_amount: order_info.transaction_amount,
        payment_mode: order_info.payment_mode,
        payment_details: order_info.payment_details,
        bank_reference: order_info.bank_reference,
        payment_message: order_info.Payment_message,
        status: order_info.status,
        error_message: order_info.error_message,
        payment_time: order_info.payment_time
      },
      { new: true, useFindAndModify: false }
    );

    if (!updated) {
      console.warn(`[Webhook] No OrderStatus found with collect_id: ${order_info.order_id}`);
      await new WebhookLog({ payload: req.body, processed: false, result: 'OrderStatus not found' }).save();
      return res.status(404).json({ message: 'OrderStatus not found' });
    }

    console.log(`[Webhook] OrderStatus updated for collect_id: ${order_info.order_id}`);

    await new WebhookLog({ payload: req.body, processed: true, result: 'success' }).save();

    res.json({ message: 'Webhook processed successfully', status: 'ok' });

  } catch (err) {
    console.error('[Webhook] Error processing webhook:', err);
    await new WebhookLog({ payload: req.body, processed: false, result: err.message }).save();
    next(err);
  }
});

module.exports = webhookRoutes;
