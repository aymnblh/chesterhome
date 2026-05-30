const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  customer: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String }
  },
  wilaya: {
    code: Number,
    name: String
  },
  deliveryType: { type: String, enum: ['home', 'agency'], required: true },
  deliveryPrice: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
