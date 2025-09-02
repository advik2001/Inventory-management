const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    productId: { type: Number, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    unit: { type: String },
    thresholdValue: { type: Number, default: 0 },
    expiryDate: { type: Date },
    expired:{type: Boolean, default: false},
    imageUrl: { type: String },
    category: { type: String },
    // category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)
