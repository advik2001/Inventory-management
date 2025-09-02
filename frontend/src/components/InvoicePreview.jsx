import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import './InvoicePreview.css'
import { handleError } from '../utils'

function InvoicePreview({ setInvoicePreview, invoiceId }) {
	const [invoiceData, setInvoiceData] = useState('')
	// const invoiceRef = useRef()
	const componentRef = useRef();

	const {
		invoice_id,
		date,
		referenceNumber,
		dueDate,
		products,
		subTotal,
		taxAmount,
		totalAmount,
	} = invoiceData

	useEffect(() => {
		const fetchInvoiceDetails = async () => {
			const jwtToken = localStorage.getItem('token')
			try {
				const res = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/invoices/${invoiceId}`,
					{
						headers: {
							Authorization: `${jwtToken}`,
						},
					}
				)
				setInvoiceData(res.data)
			} catch (err) {
				handleError(err.message)
				console.log(err.message)
			} finally {
				// setLoading(false)
			}
		}
		fetchInvoiceDetails()
	}, [])

	const handleDownload = async (e) => {
		e.stopPropagation()
		const element = componentRef.current
		const canvas = await html2canvas(element)
		const data = canvas.toDataURL('image/png')

		const pdf = new jsPDF('p', 'mm', 'a4')
		const imgProps = pdf.getImageProperties(data)
		const pdfWidth = pdf.internal.pageSize.getWidth()
		const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
		pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight)
		pdf.save(`invoice_${invoice_id}.pdf`)
	}

	const handlePrint = () => {
		window.print()
	}


	return (
		<div
			className='invoice-preview-overlay'
			onClick={() => setInvoicePreview(false)}
		>
			<div className='invoice-preview' id="invoice-preview"  ref={componentRef}>
				<div className='invoice-preview-header'>
					<span className='invoice-preview-title'>INVOICE</span>
					<div className='invoice-bill-business'>
						<div className='invoice-bill'>
							<div className='invoice-label'>Billed to</div>
							<div className='invoice-company'>
								{/* {billTo.name} */}
								Company Name
							</div>
							<div className='invoice-address'>
								{/* {billTo.address} */}
								Company Address
							</div>
							<div className='invoice-address'>
								{/* {billTo.location} */}
								City, Country - 0000
							</div>
						</div>
						<div className='invoice-business'>
							<div className='invoice-address' style={{ textAlign: 'right' }}>
								{/* {business.address} */}
								Business Address
							</div>
							<div className='invoice-address' style={{ textAlign: 'right' }}>
								{/* {business.location} */}
								City, State, IN - 0000000
							</div>
							<div className='invoice-address' style={{ textAlign: 'right' }}>
								{/* {business.taxId} */}
								TAX ID 0XXX0232424X
							</div>
						</div>
					</div>
				</div>

				<div className='invoice-details-section'>
					<div className='invoice-details-labels'>
						<div className='details-block'>
							<div className='details-label'>Invoice #</div>
							<div className='details-value'>{invoice_id}</div>
						</div>
						<div className='details-block'>
							<div className='details-label'>Invoice date</div>
							<div className='details-value'>
								{new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-')}
							</div>
						</div>
						<div className='details-block'>
							<div className='details-label'>Reference</div>
							<div className='details-value'>{referenceNumber}</div>
						</div>
						<div className='details-block'>
							<div className='details-label'>Due date</div>
							<div className='details-value'>
								{new Date(dueDate)
									.toLocaleDateString('en-GB')
									.replace(/\//g, '-')}
							</div>
						</div>
					</div>
					<div className='invoice-table-container'>
						<table className='invoice-preview-table'>
							<thead>
								<tr>
									<th>Products</th>
									<th>Qty</th>
									<th>Price</th>
								</tr>
							</thead>
							<tbody>
								{products?.map((p, i) => (
									<tr key={i}>
										<td>{p.productName}</td>
										<td align='center'>{p.quantity}</td>
										<td align='right'>₹{p.price}</td>
									</tr>
								))}
							</tbody>
							<tfoot>
								<tr className='sum-row'>
									<td>Subtotal</td>
									<td></td>
									<td align='right'>₹{subTotal}</td>
								</tr>
								<tr className='sum-row'>
									<td>Tax (10%)</td>
									<td></td>
									<td align='right'>₹{taxAmount}</td>
								</tr>
								<tr className='total-row'>
									<td colSpan={2} className='total-label'>
										Total due
									</td>
									<td align='right' className='total-value'>
										₹{totalAmount}
									</td>
								</tr>
							</tfoot>
						</table>
						{/* <div className="invoice-terms">
            <span className="terms-icon" />
            <span className="terms-txt">{terms}</span>
          </div> */}
					</div>
				</div>

				<div className='invoice-footer'>
					{/* <span>{footer.site}</span>
					<span>{footer.phone}</span>
					<span>{footer.email}</span> */}
					<span>www.rectol.inc</span>
					<span>+91 9999999999</span>
					<span>hello@email.com</span>
				</div>
			</div>
			<div className='invoice-preview-actions'>
				<div className='invoice-preview-close'>
					<img
						src='/public/assets/close.svg'
						alt=''
						style={{ width: '25px', height: '25px' }}
					/>
				</div>
				<div className='invoice-preview-download' onClick={handleDownload}>
					<img
						src='/public/assets/download.svg'
						alt=''
						style={{ width: '25px', height: '25px' }}
					/>
				</div>
				<div className='invoice-preview-print' onClick={handlePrint}>
					<img
						src='/public/assets/print.svg'
						alt=''
						style={{ width: '25px', height: '25px' }}
					/>
				</div>
			</div>
		</div>
	)
}

export default InvoicePreview
