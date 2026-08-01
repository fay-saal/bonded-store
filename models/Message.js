const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  orderId: { type: String, required: true, index: true },
  sender: { type: String, enum: ['customer', 'admin'], required: true },
  text: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
