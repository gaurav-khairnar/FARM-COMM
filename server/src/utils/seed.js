require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Product = require('../models/Product');
const Listing = require('../models/Listing');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Cart = require('../models/Cart');
const { demoProducts } = require('./demoData');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Promise.all([
    Review.deleteMany({}),
    Order.deleteMany({}),
    Cart.deleteMany({}),
    Listing.deleteMany({}),
    Product.deleteMany({}),
    User.deleteMany({ email: { $in: ['farmer1@test.com', 'farmer2@test.com', 'farmer3@test.com', 'buyer1@test.com'] } })
  ]);

  const passwordHash = await bcrypt.hash('password123', 10);

  // Create multiple farmers for diversity
  const farmer1 = await User.create({
    name: 'Ravi Patil',
    email: 'farmer1@test.com',
    passwordHash,
    role: 'farmer',
    address: 'Nashik, Maharashtra'
  });

  const farmer2 = await User.create({
    name: 'Priya Kumar',
    email: 'farmer2@test.com',
    passwordHash,
    role: 'farmer',
    address: 'Pune, Maharashtra'
  });

  const farmer3 = await User.create({
    name: 'Rajesh Singh',
    email: 'farmer3@test.com',
    passwordHash,
    role: 'farmer',
    address: 'Satara, Maharashtra'
  });

  const buyer = await User.create({
    name: 'Anita Sharma',
    email: 'buyer1@test.com',
    passwordHash,
    role: 'buyer',
    address: 'Mumbai, Maharashtra'
  });

  const farmers = [farmer1, farmer2, farmer3];
  const now = Date.now();

  // Create products using demo data
  const products = await Product.insertMany(
    demoProducts.map((product, index) => ({
      ...product,
      createdBy: farmers[index % farmers.length]._id
    }))
  );

  // Create listings for products with varied expiry dates and prices
  const listings = await Listing.insertMany(
    products.map((product, index) => {
      const daysUntilExpiry = [2, 3, 5, 7, 10, 14][index % 6];
      const priceMultiplier = [0.8, 1, 1.2, 1.5][index % 4];
      const basePrice = 50;
      
      return {
        productId: product._id,
        createdBy: product.createdBy,
        price: Math.floor(basePrice * priceMultiplier),
        quantity: Math.floor(Math.random() * 80) + 20,
        unit: product.category === 'Dairy' ? 'litre' : 'kg',
        expiryDate: new Date(now + daysUntilExpiry * 24 * 60 * 60 * 1000),
        isActive: true
      };
    })
  );

  // Create sample orders
  const completedOrder = await Order.create({
    buyer: buyer._id,
    seller: farmer1._id,
    items: [
      { 
        listing: listings[0]._id, 
        product: products[0]._id, 
        quantity: 5, 
        price: listings[0].price, 
        unit: listings[0].unit 
      }
    ],
    totalAmount: listings[0].price * 5,
    status: 'completed',
    paymentMethod: 'cod'
  });

  const completedOrder2 = await Order.create({
    buyer: buyer._id,
    seller: farmer2._id,
    items: [
      { 
        listing: listings[1]._id, 
        product: products[1]._id, 
        quantity: 3, 
        price: listings[1].price, 
        unit: listings[1].unit 
      }
    ],
    totalAmount: listings[1].price * 3,
    status: 'completed',
    paymentMethod: 'cod'
  });

  await Order.create({
    buyer: buyer._id,
    seller: farmer3._id,
    items: [
      { 
        listing: listings[2]._id, 
        product: products[2]._id, 
        quantity: 2, 
        price: listings[2].price, 
        unit: listings[2].unit 
      }
    ],
    totalAmount: listings[2].price * 2,
    status: 'requested',
    paymentMethod: 'cod'
  });

  // Create reviews (one review per order)
  await Review.create({
    orderId: completedOrder._id,
    reviewerId: buyer._id,
    sellerId: farmer1._id,
    rating: 5,
    comment: 'Excellent quality! Fresh produce delivered on time. Highly recommend this farmer.'
  });

  await Review.create({
    orderId: completedOrder2._id,
    reviewerId: buyer._id,
    sellerId: farmer2._id,
    rating: 4,
    comment: 'Good quality products. Packaging could be better but overall satisfied.'
  });

  console.log('🌱 Seed complete! Database populated with demo data.');
  console.log('👨‍🌾 Farmers:');
  console.log('   - farmer1@test.com / password123 (Ravi Patil)');
  console.log('   - farmer2@test.com / password123 (Priya Kumar)');
  console.log('   - farmer3@test.com / password123 (Rajesh Singh)');
  console.log('🛒 Buyer:');
  console.log('   - buyer1@test.com / password123 (Anita Sharma)');
  console.log(`\n📦 Created ${products.length} products and ${listings.length} active listings`);

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('❌ Seed failed:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
