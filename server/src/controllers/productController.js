const Product = require('../models/Product');
const categories = require('../utils/categories');
const { uploadProductImages } = require('../utils/upload');

const createProduct = async (req, res) => {
  const { name, description, category, images } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ message: 'Product name is required' });
  }

  if (!categories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }

  const incomingImages = Array.isArray(images) ? images.filter(Boolean) : [];
  if (incomingImages.length > 5) {
    return res.status(400).json({ message: 'Maximum 5 images allowed per product' });
  }
  const safeImages = incomingImages.slice(0, 5);

  const product = await Product.create({
    name: name.trim(),
    description: description || '',
    category,
    images: safeImages,
    createdBy: req.user._id
  });

  res.status(201).json(product);
};

const uploadImages = (req, res) => {
  uploadProductImages(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Image upload failed' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one image' });
    }

    const imageUrls = req.files.map((file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
    return res.json({ imageUrls });
  });
};

const getProducts = async (_req, res) => {
  const products = await Product.find()
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 });

  res.json(products);
};

const getCategories = async (_req, res) => {
  res.json(categories);
};

module.exports = { createProduct, uploadImages, getProducts, getCategories };
