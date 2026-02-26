const Listing = require('../models/Listing');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');

const isExpired = (date) => new Date(date).getTime() < Date.now();

const createListing = async (req, res) => {
  const { productId, price, quantity, unit, expiryDate, isActive } = req.body;

  if (!productId || !price || !quantity || !unit || !expiryDate) {
    return res.status(400).json({ message: 'productId, price, quantity, unit and expiryDate are required' });
  }

  if (Number(price) <= 0 || Number(quantity) <= 0) {
    return res.status(400).json({ message: 'Price and quantity must be greater than 0' });
  }

  if (isExpired(expiryDate)) {
    return res.status(400).json({ message: 'Expiry date must be in the future' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const isOwner = String(product.createdBy) === String(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You can only list your own products' });
  }

  const listing = await Listing.create({
    productId,
    createdBy: req.user._id,
    price: Number(price),
    quantity: Number(quantity),
    unit,
    expiryDate,
    isActive: isActive !== undefined ? isActive : true
  });

  res.status(201).json(listing);
};

const updateListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({ message: 'Listing not found' });
  }

  const isOwner = String(listing.createdBy) === String(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const updates = {
    price: req.body.price,
    quantity: req.body.quantity,
    unit: req.body.unit,
    expiryDate: req.body.expiryDate,
    isActive: req.body.isActive
  };

  if (updates.price !== undefined && Number(updates.price) <= 0) {
    return res.status(400).json({ message: 'Price must be greater than 0' });
  }

  if (updates.quantity !== undefined && Number(updates.quantity) < 0) {
    return res.status(400).json({ message: 'Quantity cannot be negative' });
  }

  if (updates.expiryDate && isExpired(updates.expiryDate)) {
    return res.status(400).json({ message: 'Expiry date must be in the future' });
  }

  Object.keys(updates).forEach((key) => {
    if (updates[key] === undefined) delete updates[key];
  });

  const updated = await Listing.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });

  res.json(updated);
};

const deactivateListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({ message: 'Listing not found' });
  }

  const isOwner = String(listing.createdBy) === String(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  listing.isActive = false;
  await listing.save();

  res.json(listing);
};

const getMyListings = async (req, res) => {
  const listings = await Listing.find({ createdBy: req.user._id })
    .populate('productId')
    .sort({ createdAt: -1 });

  res.json(listings);
};

const getFeed = async (req, res) => {
  const query = { isActive: true, expiryDate: { $gte: new Date() } };
  if (req.query.category) {
    const products = await Product.find({ category: req.query.category }).select('_id');
    query.productId = { $in: products.map((p) => p._id) };
  }

  const listings = await Listing.find(query)
    .populate({ path: 'productId', populate: { path: 'createdBy', select: 'name email role' } })
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 });

  res.json(listings);
};

const getListingById = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({ path: 'productId', populate: { path: 'createdBy', select: 'name email role' } })
    .populate('createdBy', 'name email role');

  if (!listing) {
    return res.status(404).json({ message: 'Listing not found' });
  }

  const [completedOrdersCount, reviewSummary] = await Promise.all([
    Order.countDocuments({ seller: listing.createdBy._id, status: 'completed' }),
    Review.aggregate([
      { $match: { sellerId: listing.createdBy._id } },
      {
        $group: {
          _id: '$sellerId',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ])
  ]);

  res.json({
    ...listing.toObject(),
    sellerTrust: {
      completedOrdersCount,
      averageRating: reviewSummary[0]?.averageRating || 0,
      reviewCount: reviewSummary[0]?.reviewCount || 0
    }
  });
};

module.exports = {
  createListing,
  updateListing,
  deactivateListing,
  getMyListings,
  getFeed,
  getListingById
};
