const Cart = require('../models/Cart');
const Listing = require('../models/Listing');

const isExpired = (date) => new Date(date).getTime() < Date.now();

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], seller: null });
  }
  return cart;
};

const getCart = async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const populated = await cart.populate([
    { path: 'seller', select: 'name email' },
    {
      path: 'items.listing',
      populate: [
        { path: 'productId' },
        { path: 'createdBy', select: 'name email' }
      ]
    },
    { path: 'items.product' }
  ]);

  res.json(populated);
};

const addCartItem = async (req, res) => {
  const { listingId, quantity } = req.body;
  if (!listingId || !Number(quantity) || Number(quantity) < 1) {
    return res.status(400).json({ message: 'listingId and valid quantity are required' });
  }

  const listing = await Listing.findById(listingId).populate('productId');
  if (!listing || !listing.isActive) {
    return res.status(404).json({ message: 'Active listing not found' });
  }

  if (isExpired(listing.expiryDate)) {
    return res.status(400).json({ message: 'Listing has expired' });
  }

  if (Number(quantity) > listing.quantity) {
    return res.status(400).json({ message: 'Quantity exceeds available stock' });
  }

  const cart = await getOrCreateCart(req.user._id);

  if (cart.seller && String(cart.seller) !== String(listing.createdBy)) {
    return res.status(400).json({ message: 'Cart can only contain items from one seller' });
  }

  cart.seller = listing.createdBy;

  const existingItem = cart.items.find((item) => String(item.listing) === String(listing._id));

  if (existingItem) {
    existingItem.quantity = Number(quantity);
    existingItem.priceSnapshot = listing.price;
  } else {
    cart.items.push({
      listing: listing._id,
      product: listing.productId._id,
      quantity: Number(quantity),
      priceSnapshot: listing.price,
      unit: listing.unit
    });
  }

  await cart.save();
  res.json(cart);
};

const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  if (!Number(quantity) || Number(quantity) < 1) {
    return res.status(400).json({ message: 'Valid quantity is required' });
  }

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);
  if (!item) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  const listing = await Listing.findById(item.listing);
  if (!listing || !listing.isActive) {
    return res.status(400).json({ message: 'Listing is no longer available' });
  }

  if (isExpired(listing.expiryDate)) {
    return res.status(400).json({ message: 'Listing has expired' });
  }

  if (Number(quantity) > listing.quantity) {
    return res.status(400).json({ message: 'Quantity exceeds available stock' });
  }

  item.quantity = Number(quantity);
  item.priceSnapshot = listing.price;
  await cart.save();

  res.json(cart);
};

const removeCartItem = async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);

  if (!item) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  item.deleteOne();

  if (cart.items.length === 0) {
    cart.seller = null;
  }

  await cart.save();
  res.json(cart);
};

module.exports = { getCart, addCartItem, updateCartItem, removeCartItem };
