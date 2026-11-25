const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, default: "" }, // Category ka icon/image (optional)
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);