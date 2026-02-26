const express = require('express');
const { createProduct, uploadImages, getProducts, getCategories } = require('../controllers/productController');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.post('/upload', auth, requireRole('farmer', 'admin'), uploadImages);
router.post('/', auth, requireRole('farmer', 'admin'), createProduct);

module.exports = router;
