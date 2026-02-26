const Review = require('../models/Review');
const Order = require('../models/Order');
const { Types } = require('mongoose');

const createReview = async (req, res) => {
  const { orderId, rating, comment } = req.body;

  if (!orderId || !rating) {
    return res.status(400).json({ message: 'orderId and rating are required' });
  }

  if (Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (String(order.buyer) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only order buyer can add a review' });
  }

  if (order.status !== 'completed') {
    return res.status(400).json({ message: 'Review allowed only after order is completed' });
  }

  const existing = await Review.findOne({ orderId });
  if (existing) {
    return res.status(409).json({ message: 'Review for this order already exists' });
  }

  const review = await Review.create({
    orderId,
    reviewerId: req.user._id,
    sellerId: order.seller,
    rating: Number(rating),
    comment: comment || ''
  });

  res.status(201).json(review);
};

const getSellerReviews = async (req, res) => {
  const sellerId = req.params.sellerId;
  if (!Types.ObjectId.isValid(sellerId)) {
    return res.status(400).json({ message: 'Invalid seller id' });
  }
  const sellerObjectId = new Types.ObjectId(sellerId);

  const [reviews, aggregate, completedOrdersCount] = await Promise.all([
    Review.find({ sellerId })
      .populate('reviewerId', 'name')
      .sort({ createdAt: -1 })
      .limit(20),
    Review.aggregate([
      { $match: { sellerId: sellerObjectId } },
      {
        $group: {
          _id: '$sellerId',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]),
    Order.countDocuments({ seller: sellerObjectId, status: 'completed' })
  ]);

  res.json({
    reviews,
    summary: {
      averageRating: aggregate[0]?.averageRating || 0,
      reviewCount: aggregate[0]?.reviewCount || 0,
      completedOrdersCount
    }
  });
};

const getReviewByOrder = async (req, res) => {
  const review = await Review.findOne({ orderId: req.params.orderId });
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }
  res.json(review);
};

module.exports = { createReview, getSellerReviews, getReviewByOrder };
