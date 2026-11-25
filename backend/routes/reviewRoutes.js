const express = require('express');
const router = express.Router();
const { addReview, getProductReviews, deleteReview, getAllReviews } = require('../controllers/reviewController');

router.get('/', getAllReviews);
router.post('/', addReview);
router.get('/:productId', getProductReviews);
router.delete('/:id', deleteReview);

module.exports = router;