const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Listing = require('../models/Listing');
const { demoProducts } = require('../utils/demoData');

const DEMO_USERS = [
  {
    name: 'Ravi Patil',
    email: 'farmer1@test.com',
    role: 'farmer',
    address: 'Nashik, Maharashtra'
  },
  {
    name: 'Priya Kumar',
    email: 'farmer2@test.com',
    role: 'farmer',
    address: 'Pune, Maharashtra'
  },
  {
    name: 'Rajesh Singh',
    email: 'farmer3@test.com',
    role: 'farmer',
    address: 'Satara, Maharashtra'
  },
  {
    name: 'Anita Sharma',
    email: 'buyer1@test.com',
    role: 'buyer',
    address: 'Mumbai, Maharashtra'
  }
];

const CATEGORY_PRICES = {
  Vegetables: { min: 30, max: 80 },
  Fruits: { min: 50, max: 150 },
  Grains: { min: 40, max: 120 },
  Dairy: { min: 40, max: 90 },
  Others: { min: 30, max: 100 }
};

function priceFromCategory(category, index) {
  const range = CATEGORY_PRICES[category] || CATEGORY_PRICES.Others;
  const spread = range.max - range.min;
  return range.min + (index % (spread + 1));
}

function unitFromCategory(category) {
  return category === 'Dairy' ? 'litre' : 'kg';
}

async function ensureDemoUsers() {
  const passwordHash = await bcrypt.hash('password123', 10);
  const users = [];

  for (const user of DEMO_USERS) {
    let existing = await User.findOne({ email: user.email });

    if (!existing) {
      existing = await User.create({
        ...user,
        passwordHash
      });
    }

    users.push(existing);
  }

  return users;
}

const seedDemo = async (req, res) => {
  const adminSeedKey = process.env.ADMIN_SEED_KEY;
  const providedKey = req.headers['x-admin-seed-key'];

  if (!adminSeedKey || providedKey !== adminSeedKey) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const users = await ensureDemoUsers();
    const farmers = users.filter((user) => user.role === 'farmer');
    const now = Date.now();

    let productsCreated = 0;
    let listingsCreated = 0;

    for (let index = 0; index < demoProducts.length; index += 1) {
      const productData = demoProducts[index];
      const farmer = farmers[index % farmers.length];

      let product = await Product.findOne({ name: productData.name });

      if (!product) {
        product = await Product.create({
          ...productData,
          createdBy: farmer._id
        });
        productsCreated += 1;
      }

      const existingListing = await Listing.findOne({
        productId: product._id,
        isActive: true,
        expiryDate: { $gte: new Date() }
      });

      if (!existingListing) {
        const daysUntilExpiry = [2, 3, 5, 7, 10, 14][index % 6];
        await Listing.create({
          productId: product._id,
          createdBy: farmer._id,
          price: priceFromCategory(product.category, index),
          quantity: 20 + (index % 80),
          unit: unitFromCategory(product.category),
          expiryDate: new Date(now + daysUntilExpiry * 24 * 60 * 60 * 1000),
          isActive: true
        });
        listingsCreated += 1;
      }
    }

    return res.json({
      success: true,
      message: 'Demo seed complete',
      productsCreated,
      listingsCreated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to seed demo data'
    });
  }
};

module.exports = {
  seedDemo
};
