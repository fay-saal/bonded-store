const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  resolved: { type: Boolean, default: false },
  customerName: { type: String, default: '' },
  customerEmail: { type: String, default: '' },
  total: { type: Number, required: true },
  items: [{
    id: String,
    name: String,
    price: {
      amount: Number,
      currency: String,
      display: String
    },
    qty: Number
  }],
  payment: {
    method: String,
    sender: String,
    trx: String
  },
  deliveredCodes: [{
    productName: String,
    qty: Number,
    code: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
