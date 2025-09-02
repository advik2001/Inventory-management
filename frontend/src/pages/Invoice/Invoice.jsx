import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Invoice.css'
import InvoiceActions from '../../components/InvoiceActions'
import InvoicePreview from '../../components/InvoicePreview'
import ConfirmDeleteBox from '../../components/ConfirmDeleteBox'
import { handleError, handleSuccess } from '../../utils'
import { useSearch } from '../../context/SearchContext'
import InvoiceOverview from './InvoiceOverview'

const Invoice = () => {
	const [invoiceOptions, setInvoiceOptions] = useState(false)
	const [invoicePreview, setInvoicePreview] = useState(false)
	const [deleteModal, setDeleteModal] = useState(false)
	const [pos, setPos] = useState({ x: 0, y: 0 })
	const [mobile, setMobile] = useState(window.innerWidth <= 768)

	const [invoices, setInvoices] = useState([])
	const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)
	const { searchQuery } = useSearch()

	// Pagination states
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 9
	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage

	const fetchInvoices = async () => {
		const jwtToken = localStorage.getItem('token')
		try {
			const res = await axios.get(
				`${import.meta.env.VITE_API_URL}/api/invoices`,
				{
					headers: {
						Authorization: `${jwtToken}`,
					},
				}
			)
			setInvoices(res.data)
		} catch (err) {
			handleError(err.message)
		} finally {
			// setLoading(false)
		}
	}

	// search functionality
	const filteredInvoices = invoices.filter((i) => {
		const query = searchQuery.toLowerCase()
		return (
			i.invoice_id?.toLowerCase().includes(query) ||
			i.referenceNumber?.toLowerCase().includes(query) ||
			i.totalAmount?.toString().includes(query) ||
			i.status?.toLowerCase().includes(query)
		)
	})

	const handleDelete = async () => {
		const jwtToken = localStorage.getItem('token')

		try {
			const response = await axios.delete(
				`${
					import.meta.env.VITE_API_URL
				}/api/invoices/${selectedInvoiceId}/delete`,
				{
					headers: {
						Authorization: `${jwtToken}`,
					},
				}
			)

			handleSuccess(response.data.message)
			setDeleteModal(false)

			fetchInvoices()
		} catch (error) {
			console.log(error.message)
			handleError(error.message)
		}
	}

	useEffect(() => {
		fetchInvoices()
	}, [])

	const toggleOptions = (e, id) => {
		setInvoiceOptions(!invoiceOptions)
		setPos({ x: e.clientX, y: e.clientY })
		setSelectedInvoiceId(id)
	}

	const currentInvioces = filteredInvoices.slice(
		indexOfFirstItem,
		indexOfLastItem
	)
	const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)

	if (mobile) {
		return (
			<div className='product-mobile'>
				<InvoiceOverview invoices={invoices} />

				<div className='invoice-table'>
					<div className='invoice-container'>
						<div className='invoice-header'>
							<h2>Invoices List</h2>
						</div>

						{/* Header Row */}
						<div className='grid-table header'>
							<div className='header-item'>Invoice ID</div>
							<div className='header-item'></div>
						</div>

						{/* Data Rows */}
						{invoices.map((invoice, i) => (
							<div key={i} className='grid-table row'>
								<div className='table-item'>{invoice.invoice_id}</div>
								<div
									className='table-item-last'
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-evenly',
									}}
								>
									<img
										src='/assets/view.svg'
										alt='view'
										onClick={() => {
											setInvoicePreview(true)
											setSelectedInvoiceId(invoice.invoice_id)
										}}
									/>
									<img
										src='/assets/delete.svg'
										alt='delete'
										onClick={() => {
											setSelectedInvoiceId(invoice.invoice_id)
											setTimeout(() => {
												handleDelete()
											}, 0)
										}}
									/>
								</div>
							</div>
						))}

						{/* Confirm Delete Box */}
						{deleteModal && (
							<ConfirmDeleteBox
								pos={pos}
								setDeleteModal={setDeleteModal}
								selectedInvoiceId={selectedInvoiceId}
								onRefresh={fetchInvoices}
							/>
						)}
					</div>
				</div>

				{/* Invoice Preview  */}
				{invoicePreview && (
					<InvoicePreview
						setInvoicePreview={setInvoicePreview}
						invoiceId={selectedInvoiceId}
					/>
				)}
			</div>
		)
	}

	return (
		<div className='invoice-page'>
			{/* Invoice Overview  */}
			<InvoiceOverview invoices={invoices} />

			{/* Invoice Table  */}
			<div className='invoice-table'>
				<div className='invoice-container'>
					<div className='invoice-header'>
						<h2>Invoices List</h2>
					</div>

					{/* Header Row */}
					<div className='grid-table header'>
						<div className='header-item'>Invoice ID</div>
						<div className='header-item'>Reference Number</div>
						<div className='header-item'>Amount</div>
						<div className='header-item'>Status</div>
						<div className='header-item'>Due Date</div>
						{/* <div className='header-item'>Availability</div> */}
					</div>

					{/* Data Rows */}
					{currentInvioces.map((invoice, i) => (
						<div key={i} className='grid-table row'>
							<div className='table-item'>{invoice.invoice_id}</div>
							<div className='table-item'>
								{invoice.referenceNumber ? invoice.referenceNumber : '-'}
							</div>
							<div className='table-item'>₹{invoice.totalAmount}</div>
							<div className='table-item'>{invoice.status}</div>
							<div className='table-item-last'>
								{/* {invoice.dueDate} */}
								{new Date(invoice.dueDate).toLocaleDateString('en-GB')}
							</div>
							<button
								className='table-action-btn'
								onClick={(e) => toggleOptions(e, invoice.invoice_id)}
							>
								&#8942;
							</button>
						</div>
					))}

					{/* Inovoice Action Box */}
					{invoiceOptions && (
						<InvoiceActions
							pos={pos}
							invoiceId={selectedInvoiceId}
							setInvoicePreview={setInvoicePreview}
							setInvoiceOptions={setInvoiceOptions}
							setDeleteModal={setDeleteModal}
							invoices={invoices}
							onRefresh={fetchInvoices}
						/>
					)}

					{/* Confirm Delete Box */}
					{deleteModal && (
						<ConfirmDeleteBox
							pos={pos}
							setDeleteModal={setDeleteModal}
							selectedInvoiceId={selectedInvoiceId}
							onRefresh={fetchInvoices}
						/>
					)}

					{/* Footer */}
					<div className='table-footer'>
						<button
							className='page-btn'
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
							disabled={currentPage === 1}
						>
							Previous
						</button>
						<span>
							Page {currentPage} of {totalPages}
						</span>
						<button
							className='page-btn'
							onClick={() =>
								setCurrentPage((prev) => Math.min(prev + 1, totalPages))
							}
							disabled={currentPage === totalPages}
						>
							Next
						</button>
					</div>
				</div>
			</div>

			{/* Invoice Preview  */}
			{invoicePreview && (
				<InvoicePreview
					setInvoicePreview={setInvoicePreview}
					invoiceId={selectedInvoiceId}
				/>
			)}
		</div>
	)
}

export default Invoice
