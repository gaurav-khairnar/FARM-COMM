const express = require('express');
const { createOrderFromCart, getMyOrders, updateOrderStatus } = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getMyOrders);
router.post('/', auth, createOrderFromCart);
router.patch('/:id/status', auth, updateOrderStatus);

module.exports = router;
