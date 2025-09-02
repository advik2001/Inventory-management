const express = require('express')

const router = express.Router()

const Sales = require('../models/Sales')
const Product = require('../models/Product')

const { ensureAuthenticated } = require('../middlewares/auth');


// @route   post /api/sale
// Make a sale and decrease the stock of product
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Find product
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock
    if (quantity > product.stock) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Decrease stock
    product.stock -= quantity;
    await product.save();

    // Step 4: Sale entry create karo
    const sale = new Sales({
      name: product.name,
      productId: product.productId,
      productImage: product.imageUrl,
      price: product.price,
      quantity,
      totalAmount: product.price * quantity,
      category: product.category,
    });

    await sale.save();

    res.status(200).json({ message: 'Sale recorded successfully', sale });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// @route   GET /api/sale
// Get sales data 
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const salesData = await Sales.find(); 
    res.json(salesData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sales data', error: err });
  }
});


module.exports = router
