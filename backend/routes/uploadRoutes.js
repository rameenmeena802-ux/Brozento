const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');

// Vercel pe 'uploads/' folder nahi banta, is liye memoryStorage use karenge
// File RAM me aayegi, phir seedha Cloudinary pe jayegi
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB tak
});

router.post('/', upload.single('image'), uploadImage);

module.exports = router;