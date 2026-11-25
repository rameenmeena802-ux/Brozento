const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Page ka naam (e.g. About Us)
  slug: { type: String, required: true, unique: true }, // URL (e.g. about-us)
  content: { type: String, required: true }, // Page ka content (HTML ya Text)
}, { timestamps: true });

module.exports = mongoose.model('Page', pageSchema);