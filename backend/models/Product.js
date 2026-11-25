const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  discount: { type: String },
  image: { type: String, required: true },
  video: { type: String, default: "" }, // YEH NAYA ADD HUA HAI
  category: { type: String },
  description: { type: String },
  stock: { type: Number, default: 100 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);