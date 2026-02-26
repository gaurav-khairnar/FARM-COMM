const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const register = async (req, res) => {
  const { name, email, password, role, languagePreference, address } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password, and role are required' });
  }

  if (!['buyer', 'farmer'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role for self-registration' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const normalizedEmail = normalizeEmail(email);
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: normalizedEmail,
    passwordHash,
    role,
    languagePreference: languagePreference || 'en',
    address: address || ''
  });

  const token = signToken({ userId: user._id, role: user.role });

  return res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      languagePreference: user.languagePreference,
      address: user.address
    }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken({ userId: user._id, role: user.role });

  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      languagePreference: user.languagePreference,
      address: user.address
    }
  });
};

const logout = async (_req, res) => {
  // JWT is stateless; frontend should clear local token.
  return res.json({ message: 'Logged out' });
};

module.exports = { register, login, logout };
