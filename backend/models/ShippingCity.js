const mongoose = require('mongoose');

const shippingCitySchema = new mongoose.Schema({
  cityName: { type: String, required: true, unique: true },
  deliveryCharge: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('ShippingCity', shippingCitySchema);