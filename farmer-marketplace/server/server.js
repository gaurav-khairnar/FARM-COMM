const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const listingRoutes = require('./src/routes/listingRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');

dotenv.config();

const app = express();
connectDB();

// Render runs Node behind a reverse proxy; trust first hop for correct client IP/rate limiting.
app.set('trust proxy', 1);

// Rate limiting - 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*'
}));
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/', limiter);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Server error',
    code: status,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
