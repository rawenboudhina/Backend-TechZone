// src/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  shippingAddress: {
    fullName: { type: String, required: true },
    street: { type: String, required: true }
  },
  deliveryMethod: { type: String, required: true },
  paymentInfo: {
    cardNumber: { type: String, required: true },
    nameOnCard: { type: String, required: true }
  },
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, required: true },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);