const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');

// Multer configure karein (Image receive karne ke liye)
// Yeh image ko temporarily backend/uploads folder mein save karega
const upload = multer({ dest: 'uploads/' }); 

router.post('/', upload.single('image'), uploadImage);

module.exports = router;