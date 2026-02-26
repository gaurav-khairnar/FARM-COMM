const express = require('express');
const { createReview, getSellerReviews, getReviewByOrder } = require('../controllers/reviewController');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, requireRole('buyer', 'admin'), createReview);
router.get('/seller/:sellerId', getSellerReviews);
router.get('/order/:orderId', auth, getReviewByOrder);

module.exports = router;
