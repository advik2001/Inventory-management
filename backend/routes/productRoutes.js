const express = require('express')
const path = require("path");
const multer = require('multer')
const csv = require('csv-parser')
const fs = require('fs')
const cron = require('node-cron');

const router = express.Router()

const Product = require('../models/Product')
const Invoice = require('../models/Invoice')
const { ensureAuthenticated } = require('../middlewares/auth');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), // save in uploads folder
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)), // unique filename
})

// Multer config 
const upload = multer({ storage })
// const upload = multer({ dest: 'uploads/' })


const generateInvoiceId = () => {
	const randomPart = Math.floor(1000 + Math.random() * 9000) // 4 digit random
	return `INV-${randomPart}`
}

const fieldMap = {
  "Product Name": "name",
  "Product ID": "productId",
  "Category": "category",
  "Price": "price",
  "Quantity": "stock",
  "Unit": "unit",
  "Expiry Date": "expiryDate",
  "Threshold Value": "thresholdValue"
};


function parseCustomCSV(filePath) {
  const data = fs.readFileSync(filePath, "utf-8");
  const lines = data.trim().split("\n");
  const products = [];

  for (let line of lines) {
    const product = {};
    const parts = line.split(",");

    for (let part of parts) {
      part = part.trim();

      // match "FieldName Value"
      const match = part.match(/^(.*?)(\s+\S+)$/); 
      if (match) {
        const fieldName = match[1].trim();
        const value = match[2].trim();

        const mappedKey = fieldMap[fieldName];
        if (mappedKey) {
          product[mappedKey] = value;
        }
      }
    }

    products.push(product);
  }

  return products;
}


// @route   POST /api/products
// @desc    Add a new product and generate invoice
// router.post('/', ensureAuthenticated, async (req, res) => {
// 	try {
// 		const {
// 			imageUrl,
// 			name,
// 			productId,
// 			category,
// 			price,
// 			stock,
//       unit,
// 			expiryDate,
// 			thresholdValue,
// 		} = req.body

// 		// check required fields
// 		if (!name || !productId || !price) {
// 			return res
// 				.status(400)
// 				.json({ message: 'Name, ProductId and Price are required' })
// 		}

// 		// check duplicate productId
// 		const existing = await Product.findOne({ productId })
// 		if (existing) {
// 			return res
// 				.status(400)
// 				.json({ message: 'Product with this ID already exists' })
// 		}

// 		// create new product
// 		const product = new Product({
// 			name,
// 			productId,
// 			price,
// 			stock,
//       unit,
// 			thresholdValue,
// 			expiryDate,
// 			imageUrl,
// 			category,
// 		})

// 		const savedProduct = await product.save()

// 		// Step 2 - Auto-Generate Invoice

// 		// generate unique invoice_id
// 		const invoiceIdStr = generateInvoiceId()

// 		// calculate total amount with 10% tax
// 		const tax = 0.1; // 10%
//     const subTotal = savedProduct.price * savedProduct.stock;

//     const taxAmount = Math.floor(tax * subTotal)
//     const totalAmount = Math.floor(subTotal + taxAmount)
//     // const totalAmount = Math.floor(subtotal * (1 + tax));

// 		// set due date = today + 15 days
// 		const dueDate = new Date()
// 		dueDate.setDate(dueDate.getDate() + 15)

// 		// create invoice
// 		const invoice = new Invoice({
// 			invoice_id: invoiceIdStr,
// 			referenceNumber: '-',
//       subTotal,
//       taxAmount,
// 			totalAmount,
// 			status: 'unpaid',
// 			dueDate,
// 			date: new Date(),
// 			products: [
// 				{
// 					product: savedProduct._id,
//           productName: savedProduct.name,
// 					productId: savedProduct.productId,
// 					quantity: savedProduct.stock || 1,
// 					price: savedProduct.price,
// 				},
// 			],
// 		})

// 		const savedInvoice = await invoice.save()

// 		// return both product + invoice in response
// 		res.status(201).json({ product: savedProduct, invoice: savedInvoice })
// 	} catch (error) {
// 		console.error('Error adding product:', error.message)
// 		res.status(500).json({ message: 'Server Error' })
// 	}
// })
router.post('/', ensureAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      productId,
      category,
      price,
      stock,
      unit,
      expiryDate,
      thresholdValue,
    } = req.body

    // check required fields
    if (!name || !productId || !price) {
      return res
        .status(400)
        .json({ message: 'Name, ProductId and Price are required' })
    }

    // check duplicate productId
    const existing = await Product.findOne({ productId })
    if (existing) {
      return res
        .status(400)
        .json({ message: 'Product with this ID already exists' })
    }

    // if image uploaded, build imageUrl
    let imageUrl = null
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`
    }

    // create new product
    const product = new Product({
      name,
      productId,
      price,
      stock,
      unit,
      thresholdValue,
      expiryDate,
      imageUrl,
      category,
    })

    const savedProduct = await product.save()

    // Step 2 - Auto-Generate Invoice
    const invoiceIdStr = generateInvoiceId()

    const tax = 0.1
    const subTotal = savedProduct.price * savedProduct.stock
    const taxAmount = Math.floor(tax * subTotal)
    const totalAmount = Math.floor(subTotal + taxAmount)

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 15)

    const invoice = new Invoice({
      invoice_id: invoiceIdStr,
      referenceNumber: '-',
      subTotal,
      taxAmount,
      totalAmount,
      status: 'unpaid',
      dueDate,
      date: new Date(),
      products: [
        {
          product: savedProduct._id,
          productName: savedProduct.name,
          productId: savedProduct.productId,
          quantity: savedProduct.stock || 1,
          price: savedProduct.price,
        },
      ],
    })

    const savedInvoice = await invoice.save()

    res.status(201).json({ product: savedProduct, invoice: savedInvoice })
  } catch (error) {
    console.error('Error adding product:', error.message)
    res.status(500).json({ message: 'Server Error' })
  }
})


// @route   POST /api/products
// @desc    Add multiple products and generate single invoice for them
// Upload CSV -> Add products -> Create invoice
// router.post('/upload', ensureAuthenticated, upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'CSV file is required' })
//     }

//     const filePath = req.file.path
//     const productsArray = []

//     // Step 1: Parse CSV
//     // await new Promise((resolve, reject) => {`
//     //   fs.createReadStream(filePath)
//     //     .pipe(csv())
//     //     .on('data', (row) => {
//     //       productsArray.push(row)
//     //     })
//     //     .on('end', () => {
//     //       resolve()
//     //     })
//     //     .on('error', reject)
//     // })

//     // productsArray = parseCustomCSV("./products.csv");
//     productsArray = parseCustomCSV(filePath);


//     // Step 2: Insert Products in DB
//     const savedProducts = []
//     for (const p of productsArray) {
//       // required field check
//       if (!p.name || !p.productId || !p.price) continue

//       // avoid duplicates
//       const existing = await Product.findOne({ productId: p.productId })
//       if (existing) continue

//       const product = new Product({
//         name: p.name,
//         productId: p.productId,
//         category: p.category || '',
//         price: Number(p.price),
//         stock: Number(p.stock) || 1,
//         unit: p.unit,
//         expiryDate: p.expiryDate ? new Date(p.expiryDate) : null,
//         thresholdValue: Number(p.thresholdValue) || 0,
//         imageUrl: p.imageUrl || '',
//       })

//       const saved = await product.save()
//       savedProducts.push(saved)
//     }

//     if (savedProducts.length === 0) {
//       return res.status(400).json({ message: 'No valid products found in CSV' })
//     }

//     // Step 3: Create Invoice
//     const invoiceIdStr = generateInvoiceId()

//     const tax = 0.1
//     let subTotal = 0
//     const invoiceProducts = savedProducts.map((prod) => {
//       subTotal += prod.price * prod.stock
//       return {
//         product: prod._id,
//         productName: prod.name,
//         productId: prod.productId,
//         quantity: prod.stock || 1,
//         unit: prod.unit,
//         price: prod.price * prod.stock,
//       }
//     })

//     const taxAmount = Math.floor(tax * subTotal)
//     const totalAmount = Math.floor(subTotal + taxAmount)

//     const dueDate = new Date()
//     dueDate.setDate(dueDate.getDate() + 15)

//     const invoice = new Invoice({
//       invoice_id: invoiceIdStr,
//       referenceNumber: '-',
//       subTotal,
//       taxAmount,
//       totalAmount,
//       status: 'unpaid',
//       dueDate,
//       date: new Date(),
//       products: invoiceProducts,
//     })

//     const savedInvoice = await invoice.save()

//     // cleanup CSV file
//     // fs.unlinkSync(filePath)

//     res.status(201).json({
//       message: 'Products uploaded and invoice generated',
//       products: savedProducts,
//       invoice: savedInvoice,
//     })
//   } catch (error) {
//     console.error('Error uploading products:', error.message)
//     res.status(500).json({ message: 'Server Error' })
//   }
// })

// @route   GET /api/products
// Get all products
router.get('/', ensureAuthenticated, async (req, res) => {
	try {
		const products = await Product.find() // saare products fetch
		res.status(200).json(products)
	} catch (err) {
		console.error('Error fetching products:', err)
		res.status(500).json({ message: 'Error fetching products' })
	}
})


// Run every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('⏳ Checking for expired products...');

    const now = new Date();

    // Find products where expiryDate <= today
    const expiredProducts = await Product.find({
      expiryDate: { $lte: now },
      stock: { $gt: 0 }, // only update if stock is not already 0
    });

    if (expiredProducts.length > 0) {
      // Update stock to 0
      await Product.updateMany(
        { expiryDate: { $lte: now } },
        { $set: { stock: 0, expired: true } }
      );

      console.log(`✅ Updated ${expiredProducts.length} expired products to stock: 0`);
    } else {
      console.log('No expired products found today ✅');
    }
  } catch (error) {
    console.error('❌ Error in expiry cron job:', error);
  }
});


module.exports = router
