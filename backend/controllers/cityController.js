const ShippingCity = require('../models/ShippingCity');

// Saari cities get karein
exports.getCities = async (req, res) => {
  try {
    const cities = await ShippingCity.find().sort({ cityName: 1 });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Nayi city add karein
exports.addCity = async (req, res) => {
  try {
    const { cityName, deliveryCharge } = req.body;
    const existingCity = await ShippingCity.findOne({ cityName });
    if (existingCity) {
      return res.status(400).json({ message: 'City already exists' });
    }
    const city = new ShippingCity({ cityName, deliveryCharge });
    await city.save();
    res.status(201).json(city);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// City delete karein
exports.deleteCity = async (req, res) => {
  try {
    await ShippingCity.findByIdAndDelete(req.params.id);
    res.json({ message: 'City deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};