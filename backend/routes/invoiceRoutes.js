const express = require('express')

const router = express.Router()

const Invoice = require('../models/Invoice')

const { ensureAuthenticated } = require('../middlewares/auth');

const generateRefId = () => {
	const randomPart = Math.floor(2000 + Math.random() * 9000) // 4 digit random
	return `REF-${randomPart}`
}

// @route   GET /api/invoices
// Get all invoices
router.get('/', ensureAuthenticated, async (req, res) => {
	try {
		const invoices = await Invoice.find()
		res.status(200).json(invoices)
	} catch (err) {
		console.error('Error fetching invoices:', err)
		res.status(500).json({ message: 'Error fetching invoices' })
	}
})

// @route   GET /api/invoices/:invoice_id
// Get single invoice details
router.get('/:invoice_id', ensureAuthenticated, async (req, res) => {
	try {
		const { invoice_id } = req.params

		// If DB has invoice_id field stored
		const invoice = await Invoice.findOne({ invoice_id })

		if (!invoice) {
			return res.status(404).json({ message: 'Invoice not found' })
		}

		res.status(200).json(invoice)
	} catch (error) {
		console.error('Error fetching invoice:', error)
		res.status(500).json({ message: 'Server Error' })
	}
})

// @route  PATCH /api/invoices/:invoice_id/paid
// Change status to paid and generate reference Number
router.patch('/:invoice_id/paid', ensureAuthenticated, async (req, res) => {
	try {
		const { invoice_id } = req.params

		// Find the invoice by invoice_id
		const invoice = await Invoice.findOne({ invoice_id })

		if (!invoice) {
			return res.status(404).json({ message: 'Invoice not found' })
		}

		// Check if already paid
		if (invoice.status === 'paid') {
			return res
				.status(400)
				.json({ message: 'Invoice is already marked as paid' })
		}

		// Generate a unique reference number
		const referenceNumber = generateRefId()
		// const referenceNumber = `REF-${uuidv4().slice(0, 8).toUpperCase()}`;

		// Update invoice
		invoice.status = 'paid'
		invoice.referenceNumber = referenceNumber

		const updatedInvoice = await invoice.save()

		res.json({
			message: 'Invoice marked as paid successfully',
			invoice: updatedInvoice,
		})
	} catch (error) {
		console.error('Error updating invoice:', error.message)
		res.status(500).json({ message: 'Server Error' })
	}
})

// @route  PATCH /api/invoices/:invoice_id/paid
// Change status to paid and generate reference Number
router.delete('/:invoice_id/delete', ensureAuthenticated, async (req, res) => {
  const { invoice_id } = req.params

  try {
    // Find the invoice by invoice_id
    const invoice = await Invoice.findOne({ invoice_id })

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' })
    }

    // Delete the invoice
    await Invoice.deleteOne({ invoice_id })

    res.status(200).json({ message: 'Invoice deleted successfully' })
  } catch (error) {
    console.error('Error deleting invoice:', error)
    res.status(500).json({ message: 'Server error', error })
  }
})

module.exports = router
 