const express = require('express');
const router = express.Router();

// Dono functions ek hi dafa import karein
const { login, register } = require('../controllers/authController');

// Routes
router.post('/login', login);
router.post('/register', register); // YEH NAYA ROUTE HAI

module.exports = router;