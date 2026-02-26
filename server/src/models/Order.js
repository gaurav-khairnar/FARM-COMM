const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'litre', 'dozen'], required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'completed', 'cancelled', 'rejected'],
      default: 'requested'
    },
    paymentMethod: { type: String, enum: ['cod'], default: 'cod' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
