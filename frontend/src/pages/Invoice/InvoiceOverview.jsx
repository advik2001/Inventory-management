import React, {useState} from 'react'

const InvoiceOverview = ({ invoices }) => {


	const [mobile, setMobile] = useState(window.innerWidth <= 768)

	// Get current date and 7 days ago date
	const now = new Date()
	const sevenDaysAgo = new Date(now)
	sevenDaysAgo.setDate(now.getDate() - 7)


  // Overview box 1
	// Filter invoices with status 'paid' and date within last 7 days
	const paidLast7Days = invoices.filter((invoice) => {
		const invoiceDate = new Date(invoice.date)
		return (
			invoice.status.toLowerCase() === 'paid' &&
			invoiceDate >= sevenDaysAgo &&
			invoiceDate <= now
		)
	})

	// Number of such invoices
	const numberOfPaidInvoicesLast7Days = paidLast7Days.length


  // Overview box 2
	// Total invoices generated in last 7 days
	const invoicesLast7Days = invoices.filter((invoice) => {
		const invoiceDate = new Date(invoice.date)
		return invoiceDate >= sevenDaysAgo && invoiceDate <= now
	})
	const totalInvoicesLast7Days = invoicesLast7Days.length

	// Total invoices overall
	const totalInvoices = invoices.length




  // Overview box 3 
  const paidInvoices = invoices.filter(invoice => invoice.status.toLowerCase() === 'paid');
  const totalPaidAmount = paidInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);


  // Overview box 4 
	// Filter unpaid invoices
	const unpaidInvoices = invoices.filter(
		(invoice) => invoice.status.toLowerCase() === 'unpaid'
	)

	// Number of unpaid invoices
	const numberOfUnpaidInvoices = unpaidInvoices.length

	// Total amount of unpaid invoices
	const totalUnpaidAmount = unpaidInvoices.reduce(
		(sum, invoice) => sum + invoice.totalAmount,
		0
	)

	
	if(mobile) {
		return (
			<div className='mobile-product-overview'>
					<h3>Overall Invoice</h3>
					<div className='top-line'>
						<div className='mobile-products-stats'>
							<h4>Recent Transactions</h4>
							<p>{numberOfPaidInvoicesLast7Days}</p>
							<p style={{ fontSize: '15px', color: '#858D9D' }}>Last 7 days</p>
						</div>
						<div className='mobile-products-stats'>
							<h4>Total Invoices</h4>
							<div style={{ display: 'flex', gap: '1rem' }}>
								<div>
									<p>{totalInvoicesLast7Days}</p>
									<p style={{ fontSize: '15px', color: '#858D9D' }}>Last 7 days</p>
								</div>
								<div>
									<p>{totalInvoices}</p>
									<p style={{ fontSize: '15px', color: '#858D9D' }}>Processed</p>
								</div>
							</div>
						</div>
					</div>
					<div className='bottom-line'>
						<div className='mobile-products-stats'>
							<h4>Paid Amount</h4>
							<div style={{ display: 'flex', gap: '1rem' }}>
								<div>
									<p>₹{totalPaidAmount}</p>
									<p style={{ fontSize: '15px', color: '#858D9D' }}>Last 7 days</p>
								</div>
								<div>
									<p>{totalInvoices}</p>
									<p style={{ fontSize: '15px', color: '#858D9D' }}>Customers</p>
								</div>
							</div>
						</div>
						<div className='mobile-products-stats'>
							<h4>Unpaid Amount</h4>
							<div style={{ display: 'flex', gap: '1rem' }}>
								<div>
									<p>₹{totalUnpaidAmount}</p>
									<p style={{ fontSize: '15px', color: '#858D9D' }}>Ordered</p>
								</div>
								<div>
									<p>{numberOfUnpaidInvoices}</p>
									<p style={{ fontSize: '15px', color: '#858D9D' }}>Pending Payment</p>
								</div>
							</div>
						</div>
					</div>
				</div>
		)
	}
	
	
	return (
		<div className='invoice-overview'>
			<h3 className='title'>Overall Invoice</h3>
			<div className='overview-grid'>
				<div className='overview-item-first'>
					<h4>Recent Transactions</h4>
					<p className='big'>{numberOfPaidInvoicesLast7Days}</p>
					<span className='sub'>Last 7 days</span>
				</div>

				<div className='divider' />

				<div className='overview-item'>
					<h4>Total Invoices</h4>
					<div className='overview-item-content'>
						<div className='overview-item-content-left'>
							<p className='big'>{totalInvoicesLast7Days}</p>
							<span className='sub'>Last 7 days</span>
						</div>
						<div className='overview-item-content-right'>
							<p className='big'>{totalInvoices}</p>
							<span className='sub'>Processed</span>
						</div>
					</div>
				</div>

				<div className='divider' />

				<div className='overview-item'>
					<h4>Paid Amount</h4>
					<div className='overview-item-content'>
						<div className='overview-item-content-left'>
							<p className='big'>₹{totalPaidAmount}</p>
							<span className='sub'>Last 7 days</span>
						</div>
						<div className='overview-item-content-right'>
							<p className='big'>{totalInvoices}</p>
							<span className='sub'>Customers</span>
						</div>
					</div>
				</div>

				<div className='divider' />

				<div className='overview-item'>
					<h4>Unpaid Amount</h4>
					<div className='overview-item-content'>
						<div className='overview-item-content-left'>
							<p className='big'>₹{totalUnpaidAmount}</p>
							<span className='sub'>Ordered</span>
						</div>
						<div className='overview-item-content-right'>
							<p className='big'>{numberOfUnpaidInvoices}</p>
							<span className='sub'>Pending Payment</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default InvoiceOverview
