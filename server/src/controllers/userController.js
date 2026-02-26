const User = require('../models/User');
const Order = require('../models/Order');
const Listing = require('../models/Listing');

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  languagePreference: user.languagePreference,
  address: user.address
});

const getMe = async (req, res) => {
  res.json(serializeUser(req.user));
};

const updateMe = async (req, res) => {
  const { name, languagePreference, address } = req.body;

  if (languagePreference && !['en'].includes(languagePreference)) {
    return res.status(400).json({ message: 'Invalid language preference' });
  }

  const updates = { name, languagePreference, address };
  Object.keys(updates).forEach((key) => {
    if (updates[key] === undefined) delete updates[key];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  });

  res.json(serializeUser(user));
};

const updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['buyer', 'farmer', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(serializeUser(user));
};

const getDashboard = async (req, res) => {
  const orderQuery = req.user.role === 'farmer' ? { seller: req.user._id } : { buyer: req.user._id };

  const [totalOrders, requestedOrders, completedOrders, activeListings] = await Promise.all([
    Order.countDocuments(orderQuery),
    Order.countDocuments({ ...orderQuery, status: 'requested' }),
    Order.countDocuments({ ...orderQuery, status: 'completed' }),
    req.user.role === 'farmer'
      ? Listing.countDocuments({ createdBy: req.user._id, isActive: true })
      : Promise.resolve(0)
  ]);

  res.json({
    user: serializeUser(req.user),
    stats: {
      totalOrders,
      requestedOrders,
      completedOrders,
      activeListings
    }
  });
};

module.exports = { getMe, updateMe, updateUserRole, getDashboard };
