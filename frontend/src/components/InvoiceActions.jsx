import React from 'react'
import axios from 'axios'
import { handleError, handleSuccess } from '../utils'

const InvoiceActions = ({
	pos,
	invoiceId,
	invoices,
	setInvoicePreview,
	setInvoiceOptions,
	setDeleteModal,
	onRefresh,
}) => {
	const handleViewInvoice = () => {
		setInvoicePreview(true)
		setInvoiceOptions(false)
	}
	const handleDeleteModal = () => {
		setDeleteModal(true)
		setInvoiceOptions(false)
	}
	const handlePaid = async () => {

		const jwtToken = localStorage.getItem('token')
		try {
			const response = await axios.patch(
				`${import.meta.env.VITE_API_URL}/api/invoices/${invoiceId}/paid`, {}, {headers: {
          Authorization: `${jwtToken}`
        }}
			)
			console.log('Invoice marked as paid:', response.data)
			handleSuccess('Invoice marked as paid')
			setInvoiceOptions(false)

			// refresh page
			if (onRefresh) {
				onRefresh()
			}
		} catch (error) {
			console.error('Error marking invoice as paid:', error)
			handleError('Error marking invoice as paid')
		}
	}

	const checkPaid = () => {
		const invoice = invoices.find((inv) => inv.invoice_id === invoiceId)
		if (invoice.status === 'unpaid') {
			return true
		} else return false
	}

	return (
		<div
			className='action-box'
			style={{
				left: `${pos.x - 150}px`,
				top: `${pos.y}px`,
			}}
		>
			{/* Paid option */}
			{checkPaid() && (
				<div className='paid-option' onClick={handlePaid}>
					<img
						src='/assets/Cost2.svg'
						alt='view'
						style={{ width: '21px', height: '21px' }}
					/>
					<span>Paid</span>
				</div>
			)}

			{/* View Invoice option */}
			<div className='view-invoice' onClick={handleViewInvoice}>
				<img src='/assets/view.svg' alt='view' />
				<span>View Invoice</span>
			</div>

			{/* Delete option */}
			<div className='delete-option' onClick={handleDeleteModal}>
				<img src='/assets/delete.svg' alt='delete' />
				<span>Delete</span>
			</div>
		</div>
	)
}

export default InvoiceActions
