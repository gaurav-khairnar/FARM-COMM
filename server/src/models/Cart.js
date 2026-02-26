const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceSnapshot: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'litre', 'dozen'], required: true }
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    items: [cartItemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
