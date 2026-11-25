const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getMyOrders, updateOrderStatus } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/my-orders/:phone', getMyOrders); // YEH NAYA ROUTE HAI
router.put('/:id/status', updateOrderStatus);

module.exports = router;