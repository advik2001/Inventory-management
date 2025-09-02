import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ProductOverview = ({
	products,
	showAddProductModal,
	getAvailability,
}) => {
	const [sales, setSales] = useState([])
	const [invoices, setInvoices] = useState([])
	const [mobile, setMobile] = useState(window.innerWidth <= 768)

	const fetchData = async () => {
		const jwtToken = localStorage.getItem('token')
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/api/sales`,
				{
					headers: {
						Authorization: `${jwtToken}`,
					},
				}
			)
			const invoiceResponse = await axios.get(
				`${import.meta.env.VITE_API_URL}/api/invoices`,
				{
					headers: {
						Authorization: `${jwtToken}`,
					},
				}
			)
			setSales(response.data)
			setInvoices(invoiceResponse.data)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	// Get current date and 7 days ago date
	const now = new Date()
	const sevenDaysAgo = new Date(now)
	sevenDaysAgo.setDate(now.getDate() - 7)

	// get unique categories from products created in the last 7 days
	const getUniqueCategoriesLast7Days = () => {
		// Filter products created in the last 7 days
		const recentProducts = products.filter((product) => {
			const createdAt = new Date(product.createdAt)
			return createdAt >= sevenDaysAgo && createdAt <= now
		})

		// Extract unique categories using a Set
		const uniqueCategories = new Set(
			recentProducts.map((product) => product.category)
		)

		return uniqueCategories.size
	}

	// get total products created in the last 7 days
	const getTotalProductsLast7Days = () => {
		return products.filter((product) => {
			const createdAt = new Date(product.createdAt)
			return createdAt >= sevenDaysAgo && createdAt <= now
		}).length
	}

	// get total revenue
	const getTotalSalesRevenue = () => {
		return sales.reduce((acc, item) => acc + item.price * item.quantity, 0)
	}

	// get top selling products and their cost
	const getTopSellingCost = () => {
		const recentSales = sales.filter(
			(sale) =>
				new Date(sale.createdAt) >= sevenDaysAgo &&
				new Date(sale.createdAt) <= now
		)

		const productMap = {}

		recentSales.forEach((sale) => {
			if (!productMap[sale.productId]) {
				productMap[sale.productId] = {
					name: sale.name,
					quantity: 0,
					price: sale.price, // store price
				}
			}
			productMap[sale.productId].quantity += sale.quantity
		})

		// filter only top selling
		const topSelling = Object.values(productMap).filter((p) => p.quantity >= 50)

		// calculate total cost for those products
		const totalCost = topSelling.reduce(
			(sum, p) => sum + p.quantity * p.price,
			0
		)

		return {
			count: topSelling.length, // number of top-selling products
			revenue: totalCost, // total revenue of top-selling products
		}
	}

	// get ordered products
	const getOrderedProducts = () => {
		const unpaidProductsCount = invoices
			.filter((inv) => inv.status === 'unpaid') // only unpaid invoices
			.reduce((count, inv) => count + inv.products.length, 0) // sum products length

		return unpaidProductsCount
	}

	// get total products that are out of stock
	const getOutOfStockProducts = () => {
		const outOfStockProducts = products.filter((product) => product.stock === 0)
		return outOfStockProducts.length
	}

	const uniqueCategoriesLast7Days = getUniqueCategoriesLast7Days()
	const totalProductsLast7Days = getTotalProductsLast7Days()
	const totalSalesRevenue = getTotalSalesRevenue()
	const topSelling = getTopSellingCost().count
	const topSellingCost = getTopSellingCost().revenue
	const orderedProducts = getOrderedProducts()
	const numberOfOutOfStockProducts = getOutOfStockProducts()

	
	if(mobile) {
		return (
			<div className='mobile-product-overview'>
					<h3>Overall Inventory</h3>
					<div className='top-line'>
						<div className='mobile-products-stats'>
							<h4>Categories</h4>
							<p>{uniqueCategoriesLast7Days}</p>
							<p style={{ fontSize: '15px', color: '#858D9D' }}>Last 7 days</p>
						</div>
						<div className='mobile-products-stats'>
							<h4>Total Products</h4>
							<div style={{ display: 'flex', gap: '1rem' }}>
								<div>
									<p>{totalProductsLast7Days}</p>
									<p style={{ fontSize: '15px', color: '#858D9D' }}>Last 7 days</p>
								</div>
								<div>
									<p>₹{totalSalesRevenue}</p>
									<p style={{ fontSize: '15px', color: '#858D9D' }}>Revenue</p>
								</div>
							</div>
						</div>
					</div>
					<div className='bottom-line'>
						<div className='mobile-products-stats'>
							<h4>Top Selling</h4>
							<div style={{ display: 'flex', gap: '1rem' }}>
								<div>
									<p>{topSelling ? topSelling : 0}</p>
									<p style={{ fontSize: '15px', color: '#858D9D' }}>Last 7 days</p>
								</div>
								<div>
									<p>₹{topSellingCost}</p>
									<p style={{ fontSize: '15px', color: '#858D9D' }}>Cost</p>
								</div>
							</div>
						</div>
						<div className='mobile-products-stats'>
							<h4>Low Stock</h4>
							<div style={{ display: 'flex', gap: '1rem' }}>
								<div>
									<p>{orderedProducts}</p>
									<p style={{ fontSize: '15px', color: '#858D9D' }}>Ordered</p>
								</div>
								<div>
									<p>{numberOfOutOfStockProducts}</p>
									<p style={{ fontSize: '15px', color: '#858D9D' }}>Not in stock</p>
								</div>
							</div>
						</div>
					</div>
				</div>
		)
	}
	
	return (
		<div className={`product-overview ${showAddProductModal ? 'none' : ''}`}>
			<h3 className='title'>Overall Inventory</h3>
			<div className='overview-grid'>
				<div className='overview-item-first'>
					<h4>Categories</h4>
					<p className='big'>{uniqueCategoriesLast7Days}</p>
					<span className='sub'>Last 7 days</span>
				</div>

				<div className='divider' />

				<div className='overview-item'>
					<h4>Total Products</h4>
					<div className='overview-item-content'>
						<div className='overview-item-content-left'>
							<p className='big'>{totalProductsLast7Days}</p>
							<span className='sub'>Last 7 days</span>
						</div>
						<div className='overview-item-content-right'>
							<p className='big'>₹{totalSalesRevenue}</p>
							<span className='sub'>Revenue</span>
						</div>
					</div>
				</div>

				<div className='divider' />

				<div className='overview-item'>
					<h4>Top Selling</h4>
					<div className='overview-item-content'>
						<div className='overview-item-content-left'>
							{/* <p className='big'>{topSelling}</p> */}
							<p className='big'>{topSelling ? topSelling : 0}</p>
							<span className='sub'>Last 7 days</span>
						</div>
						<div className='overview-item-content-right'>
							<p className='big'>₹{topSellingCost}</p>
							<span className='sub'>Cost</span>
						</div>
					</div>
				</div>

				<div className='divider' />

				<div className='overview-item'>
					<h4>Low Stocks</h4>
					<div className='overview-item-content'>
						<div className='overview-item-content-left'>
							<p className='big'>{orderedProducts}</p>
							<span className='sub'>Ordered</span>
						</div>
						<div className='overview-item-content-right'>
							<p className='big'>{numberOfOutOfStockProducts}</p>
							<span className='sub'>Not in stock</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProductOverview
