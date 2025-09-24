const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();
const orderRoutes = express.Router();
const { body } = require("express-validator");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth.middleware");
const Order = require("../models/Order");
const OrderStatus = require("../models/OrderStatus");

// Payment Gateway Config from env
const PAYMENT_GATEWAY_API_KEY = process.env.PAYMENT_API_KEY;
const PAYMENT_GATEWAY_PG_SECRET = process.env.PPG_KEY;
const PAYMENT_GATEWAY_URL = process.env.GATEWAY_URL;
const SCHOOL_ID_FOR_GATEWAY = process.env.SCHOOL_ID;

if (!PAYMENT_GATEWAY_API_KEY || !PAYMENT_GATEWAY_PG_SECRET || !PAYMENT_GATEWAY_URL || !SCHOOL_ID_FOR_GATEWAY) {
  throw new Error("One or more required payment gateway environment variables are missing!");
}

// Route: POST /create-payment
orderRoutes.post(
  "/create-payment",
  auth,
  validate([
    body("school_id").notEmpty().withMessage("school_id is required"),
    body("trustee_id").notEmpty().withMessage("trustee_id is required"),
    body("student_info").isObject().withMessage("student_info required"),
    body("student_info.name").notEmpty().withMessage("student_info.name required"),
    body("student_info.id").notEmpty().withMessage("student_info.id required"),
    body("student_info.email").isEmail().withMessage("student_info.email must be valid"),
    body("student_info.phone").optional().isMobilePhone().withMessage("student_info.phone must be a valid phone number"),
    body("gateway_name").notEmpty().withMessage("gateway_name required"),
    body("amount").isNumeric().withMessage("amount should be a number"),
    body("custom_order_id").notEmpty().withMessage("custom_order_id is required"),
    body("callback_url")
      .notEmpty()
      .withMessage("callback_url is required")
      .custom((value) => {
        if (/^http:\/\/localhost(:\d+)?\/.+/.test(value)) return true;
        try {
          new URL(value);
          return true;
        } catch (err) {
          throw new Error("callback_url must be a valid URL");
        }
      }),
  ]),
  async (req, res, next) => {
    try {
      const {
        school_id,
        trustee_id,
        student_info,
        gateway_name,
        amount,
        custom_order_id,
        callback_url,
      } = req.body;

      // Check for duplicate custom_order_id
      const existingOrderStatus = await OrderStatus.findOne({ custom_order_id });
      if (existingOrderStatus) {
        return res.status(409).json({ error: "Duplicate custom_order_id. Order already exists." });
      }

      // Validate ObjectId formats
      if (!mongoose.Types.ObjectId.isValid(school_id)) {
        return res.status(400).json({ error: "Invalid school_id format" });
      }
      if (!mongoose.Types.ObjectId.isValid(trustee_id)) {
        return res.status(400).json({ error: "Invalid trustee_id format" });
      }

      // Create Order document
      const order = new Order({
        school_id: new mongoose.Types.ObjectId(school_id),
        trustee_id: new mongoose.Types.ObjectId(trustee_id),
        student_info: { ...student_info },
        gateway_name,
      });
      await order.save();

      // Use SCHOOL_ID_FOR_GATEWAY env variable for payment gateway call
      const signPayload = {
        school_id: SCHOOL_ID_FOR_GATEWAY,
        amount: String(amount),
        callback_url,
      };

      // Generate JWT signed with PG secret
      const sign = jwt.sign(signPayload, PAYMENT_GATEWAY_PG_SECRET);

      // Call Payment Gateway create-collect-request API
      const paymentApiResponse = await axios.post(
        PAYMENT_GATEWAY_URL,
        {
          school_id: SCHOOL_ID_FOR_GATEWAY,
          amount: String(amount),
          callback_url,
          sign,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PAYMENT_GATEWAY_API_KEY}`,
          },
        }
      );

      const collectResponse = paymentApiResponse.data;

      // Log full payment API response for debugging
      console.log("Payment API full response data:", collectResponse);

      // Validate payment link presence
      if (!collectResponse.collect_request_url) {
        return res.status(500).json({
          error: "Payment API did not return payment link. Transaction creation failed.",
          paymentApiResponse: collectResponse,
        });
      }

      // Save OrderStatus document
      const status = new OrderStatus({
        collect_id: order._id,
        order_amount: amount,
        transaction_amount: null,
        status: "pending",
        custom_order_id,
      });
      await status.save();

      // Respond with payment link and collect ID
      res.json({
        message: "Payment transaction created successfully! Please proceed to payment using the provided link.",
        payment_link: collectResponse.collect_request_url,
        collect_id: order._id,
      });
    } catch (err) {
      console.error("[Create Payment] Error:", err);
      next(err);
    }
  }
);

// Route: GET /status/:collect_id
orderRoutes.get("/status/:collect_id", auth, async (req, res, next) => {
  try {
    const { collect_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(collect_id)) {
      return res.status(400).json({ error: "Invalid collect_id format" });
    }
    const orderStatus = await OrderStatus.findOne({ collect_id });
    if (!orderStatus) {
      return res.status(404).json({ error: "Order status not found for the provided collect_id" });
    }
    res.json({ orderStatus });
  } catch (err) {
    console.error("[Get Order Status] Error:", err);
    next(err);
  }
});

module.exports = orderRoutes;
