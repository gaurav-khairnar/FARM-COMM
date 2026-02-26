const express = require('express');
const { getCart, addCartItem, updateCartItem, removeCartItem } = require('../controllers/cartController');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, requireRole('buyer', 'admin'), getCart);
router.post('/items', auth, requireRole('buyer', 'admin'), addCartItem);
router.put('/items/:itemId', auth, requireRole('buyer', 'admin'), updateCartItem);
router.delete('/items/:itemId', auth, requireRole('buyer', 'admin'), removeCartItem);

module.exports = router;
