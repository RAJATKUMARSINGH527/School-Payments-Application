const mongoose = require('mongoose');

const studentInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String }
});

const orderSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Types.ObjectId, required: true, index: true },
    trustee_id: { type: mongoose.Types.ObjectId, required: true },
    student_info: { type: studentInfoSchema, required: true },

    gateway_name: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
