const mongoose = require('mongoose')

const SalesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    productId: { type: Number, required: true, },
    productImage: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    totalAmount: {type: Number, required: true},
    category: { type: String },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Sale', SalesSchema)
