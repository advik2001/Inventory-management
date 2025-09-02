const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema(
	{
    invoice_id: { type: String, required: true, unique: true },
    referenceNumber: { type: String },
    subTotal: { type: Number},
    taxAmount: { type: Number},
    totalAmount: { type: Number, required: true },
    status: {
			type: String,
			enum: ['paid', 'unpaid'],
			default: 'unpaid',
		},
    dueDate: { type: Date, required: true },
    date: { type: Date, default: Date.now },
		products: [
			{
				product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        productName: { type: String, required: true },
        productId: { type: Number, required: true },
				quantity: { type: Number, required: true },
				price: { type: Number, required: true },
			},
		],
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Invoice', invoiceSchema)
