const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true }, // YEH NAYA ADD HUA HAI (Email notifications ke liye)
  address: { type: String, required: true },
  city: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String }
    }
  ],
  totalAmount: { type: Number, required: true },
  deliveryCharges: { type: Number, default: 0 },
  paymentMethod: { type: String, required: true },
  paymentScreenshot: { type: String, default: '' },
  paymentStatus: { type: String, default: 'Pending' },
  orderStatus: { type: String, default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);