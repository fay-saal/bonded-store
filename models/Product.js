const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  price: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'BDT' },
    display: { type: String }
  },
  icon: { type: String },
  badge: { type: String },
  available: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 },
  reviews: [{
    id: String,
    author: String,
    rating: Number,
    comment: String,
    date: String
  }],
  base64Image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
