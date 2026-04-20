const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Listing = require('../models/Listing');
const Review = require('../models/Review');

const isExpired = (date) => new Date(date).getTime() < Date.now();
const STATIC_LISTING_EXPIRY_DAYS = 30;
const RESTOCK_THRESHOLD = 5;
const RESTOCK_TARGET_QUANTITY = 50;

const getFutureExpiryDate = () => new Date(Date.now() + STATIC_LISTING_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

const createOrderFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.listing');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  for (const item of cart.items) {
    if (!item.quantity || Number(item.quantity) <= 0) {
      return res.status(400).json({ message: 'Invalid item quantity in cart' });
    }

    if (!item.listing?._id) {
      return res.status(400).json({ message: 'One or more listings are unavailable' });
    }

    const listing = await Listing.findById(item.listing._id);
    if (!listing || !listing.isActive) {
      return res.status(400).json({ message: 'One or more listings are unavailable' });
    }

    let listingUpdated = false;
    if (isExpired(listing.expiryDate)) {
      listing.expiryDate = getFutureExpiryDate();
      listingUpdated = true;
    }

    if (Number(listing.quantity) <= RESTOCK_THRESHOLD) {
      listing.quantity = RESTOCK_TARGET_QUANTITY;
      listingUpdated = true;
    }

    if (listingUpdated) {
      await listing.save();
    }

    if (item.quantity > listing.quantity) {
      return res.status(400).json({ message: 'Insufficient stock for one or more items' });
    }
  }

  const items = cart.items.map((item) => ({
    listing: item.listing._id,
    product: item.product,
    quantity: item.quantity,
    price: item.priceSnapshot,
    unit: item.unit
  }));

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    buyer: req.user._id,
    seller: cart.seller,
    items,
    totalAmount,
    status: 'requested',
    paymentMethod: 'cod'
  });

  for (const item of cart.items) {
    await Listing.findByIdAndUpdate(item.listing._id, {
      $inc: { quantity: -item.quantity }
    });
  }

  cart.items = [];
  cart.seller = null;
  await cart.save();

  res.status(201).json(order);
};

const getMyOrders = async (req, res) => {
  const query = req.user.role === 'farmer'
    ? { seller: req.user._id }
    : { buyer: req.user._id };

  const orders = await Order.find(query)
    .populate('buyer', 'name email')
    .populate('seller', 'name email')
    .populate('items.product', 'name category images')
    .sort({ createdAt: -1 })
    .lean();

  if (req.user.role === 'buyer') {
    const reviewRows = await Review.find({ orderId: { $in: orders.map((o) => o._id) } }).select('orderId').lean();
    const reviewedSet = new Set(reviewRows.map((r) => String(r.orderId)));
    orders.forEach((order) => {
      order.hasReview = reviewedSet.has(String(order._id));
    });
  }

  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  if (!['accepted', 'completed', 'cancelled', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status update' });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const isSeller = String(order.seller) === String(req.user._id);
  const isBuyer = String(order.buyer) === String(req.user._id);

  if (!isSeller && !isBuyer) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if ((status === 'accepted' || status === 'completed' || status === 'rejected') && !isSeller) {
    return res.status(403).json({ message: 'Only seller can set this status' });
  }

  if (status === 'cancelled' && !isBuyer && !isSeller) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  order.status = status;
  await order.save();

  res.json(order);
};

module.exports = { createOrderFromCart, getMyOrders, updateOrderStatus };
