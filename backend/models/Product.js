const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  metaDescription: { type: String, default: "" },
  tags: [{ type: String }],
  
  // Base price (agar variants na hon)
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: 0 },
  discount: { type: String, default: "" },

  image: { type: String, default: "" },
  video: { type: String, default: "" },
  category: { type: String, default: "Special" },

  // Variants (1kg, 2kg, etc.)
  variants: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      oldPrice: { type: Number, default: 0 },
      stock: { type: Number, default: 100 }
    }
  ],

  minOrderQuantity: { type: Number, default: 1 },
  maxOrderQuantity: { type: Number, default: 10 },
  stock: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);