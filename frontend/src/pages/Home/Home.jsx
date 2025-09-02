import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Home.css'
import Chart from '../../components/Chart'
import TopProducts from '../../components/TopProducts'

const Home = () => {
	const [sales, setSales] = useState([])
	const [invoices, setInvoices] = useState([])
	const [products, setProducts] = useState([])
	const [mobile, setMobile] = useState(window.innerWidth <= 768)

	// useEffect(() => {
	// 	const handleResize = () => {
	// 		setIsMobile(window.innerWidth <= 768)
	// 	}
	// 	window.addEventListener('resize', handleResize)
	// 	return () => window.removeEventListener('resize', handleResize)
	// }, [])

	// Box order state
	const [group1Order, setGroup1Order] = useState([
		'sales-overview',
		'purchase-overview',
		'sale-purchase',
	])
	const [group2Order, setGroup2Order] = useState([
		'inventory-summary',
		'product-summary',
		'top-products',
	])

	const [draggedItem, setDraggedItem] = useState(null)

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
			const productsResponse = await axios.get(
				`${import.meta.env.VITE_API_URL}/api/products`,
				{
					headers: {
						Authorization: `${jwtToken}`,
					},
				}
			)
			setSales(response.data)
			setInvoices(invoiceResponse.data)
			setProducts(productsResponse.data)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	// Helpers for stats
	const getTotalSalesQuantity = () => {
		return sales.reduce((acc, item) => acc + item.quantity, 0)
	}

	const getTotalSalesRevenue = () => {
		return sales.reduce((acc, item) => acc + item.price * item.quantity, 0)
	}

	const getCost = () => {
		return invoices.reduce((acc, invoice) => acc + invoice.totalAmount, 0)
	}

	const getPurchasedQuantity = () => {
		let totalQuantity = 0

		invoices.forEach((invoice) => {
			invoice.products.forEach((product) => {
				totalQuantity += product.quantity
			})
		})

		return totalQuantity
	}

	const getTotalStock = () => {
		return products.reduce((total, product) => {
			return total + (product.stock || 0)
		}, 0)
	}

	const getOrderedProducts = () => {
		const unpaidProductsCount = invoices
			.filter((inv) => inv.status === 'unpaid') // only unpaid invoices
			.reduce((count, inv) => count + inv.products.length, 0) // sum products length

		return unpaidProductsCount
	}

	const getCategoryCount = () => {
		const categories = new Set()

		products.forEach((product) => {
			if (product.category) {
				categories.add(product.category)
			}
		})

		return categories.size
	}

	const totalSalesQuantity = getTotalSalesQuantity()
	const totalSalesRevenue = getTotalSalesRevenue()
	const totalCost = getCost()

	const profit = totalSalesRevenue - totalCost
	const purchasedQuantity = getPurchasedQuantity()

	const stock = getTotalStock()
	const toBeRecieved = getOrderedProducts()
	const categories = getCategoryCount()

	// Drag Handlers
	const handleDragStart = (item, group) => {
		setDraggedItem({ item, group })
	}

	const handleDrop = (targetItem, group) => {
		if (!draggedItem || draggedItem.group !== group) return // only allow same group swaps

		if (group === 'group1') {
			const newOrder = [...group1Order]
			const fromIndex = newOrder.indexOf(draggedItem.item)
			const toIndex = newOrder.indexOf(targetItem)
			;[newOrder[fromIndex], newOrder[toIndex]] = [
				newOrder[toIndex],
				newOrder[fromIndex],
			]
			setGroup1Order(newOrder)
		} else if (group === 'group2') {
			const newOrder = [...group2Order]
			const fromIndex = newOrder.indexOf(draggedItem.item)
			const toIndex = newOrder.indexOf(targetItem)
			;[newOrder[fromIndex], newOrder[toIndex]] = [
				newOrder[toIndex],
				newOrder[fromIndex],
			]
			setGroup2Order(newOrder)
		}

		setDraggedItem(null)
	}

	const renderBox = (type) => {
		switch (type) {
			case 'sales-overview':
				return (
					<div
						className='box sales-overview'
						draggable
						onDragStart={() => handleDragStart('sales-overview', 'group1')}
						onDragOver={(e) => e.preventDefault()}
						onDrop={() => handleDrop('sales-overview', 'group1')}
						key={type}
					>
						<h3>Sales Overview</h3>
						<div className='stats-container'>
							<div className='stat-card'>
								<div
									className='stat-icon'
									// style={{ width: '25px', height: '25px', background: 'blue' }}
								>
									<img src='/assets/Sales.svg' alt='sales' />
								</div>
								<div className='stat-content'>
									<span className='stat-value'>{totalSalesQuantity}</span>
									<span className='stat-label'>Sales</span>
								</div>
							</div>
							<div className='stat-card'>
								<div
									className='sales-img'
									// style={{ width: '25px', height: '25px', background: 'blue' }}
								>
									<img src='/assets/Revenue.svg' alt='revenue' />
								</div>
								<div className='sales-content'>
									<span>₹{totalSalesRevenue}</span>
									<span>Revenue</span>
								</div>
							</div>
							<div className='stat-card'>
								<div
									className='sales-img'
									// style={{ width: '25px', height: '25px', background: 'blue' }}
								>
									<img src='/assets/Profit.svg' alt='profit' />
								</div>
								<div className='sales-content'>
									<span>₹{profit}</span>
									<span>Profit</span>
								</div>
							</div>
							<div className='stat-card'>
								<div
									className='sales-img'
									// style={{ width: '25px', height: '25px', background: 'blue' }}
								>
									<img src='/assets/Cost.svg' alt='cost' />
								</div>
								<div className='sales-content'>
									<span>₹{totalCost}</span>
									<span>Cost</span>
								</div>
							</div>
						</div>
					</div>
				)

			case 'purchase-overview':
				return (
					<div
						className='box purchase-overview'
						draggable
						onDragStart={() => handleDragStart('purchase-overview', 'group1')}
						onDragOver={(e) => e.preventDefault()}
						onDrop={() => handleDrop('purchase-overview', 'group1')}
						key={type}
					>
						<h3>Purchase Overview</h3>
						<div className='stats-container'>
							<div className='stat-card'>
								<div className='stat-icon'>
									<img src='/assets/Purchase.svg' alt='purchase' />
								</div>
								<div className='stat-content'>
									<span className='stat-value'>{purchasedQuantity}</span>
									<span className='stat-label'>Purchase</span>
								</div>
							</div>
							<div className='stat-card'>
								<div className='sales-img'>
									<img src='/assets/Cost2.svg' alt='cost' />
								</div>
								<div className='sales-content'>
									<span>₹{totalCost}</span>
									<span>Cost</span>
								</div>
							</div>
							<div className='stat-card'>
								<div className='sales-img'>
									<img src='/assets/Cancel.svg' alt='cancel' />
								</div>
								<div className='sales-content'>
									<span>5</span>
									<span>Cancel</span>
								</div>
							</div>
							<div className='stat-card'>
								<div className='sales-img'>
									<img src='/assets/Profit2.svg' alt='return' />
								</div>
								<div className='sales-content'>
									<span>6</span>
									<span>Return</span>
								</div>
							</div>
						</div>
					</div>
				)

			case 'sale-purchase':
				return (
					<div
						className='box sale-purchase'
						draggable
						onDragStart={() => handleDragStart('sale-purchase', 'group1')}
						onDragOver={(e) => e.preventDefault()}
						onDrop={() => handleDrop('sale-purchase', 'group1')}
						key={type}
					>
						<Chart
							sales={sales}
							invoices={invoices}
							style={{ width: '100%', height: '100%' }}
						/>
					</div>
				)

			case 'inventory-summary':
				return (
					<div
						className='box inventory-summary'
						draggable
						onDragStart={() => handleDragStart('inventory-summary', 'group2')}
						onDragOver={(e) => e.preventDefault()}
						onDrop={() => handleDrop('inventory-summary', 'group2')}
						key={type}
					>
						<h3>Inventory Summary</h3>
						<div className='stats-container'>
							<div className='stat-card'>
								<div className='stat-icon'>
									<img src='/assets/Quantity.svg' alt='inhand' />
								</div>
								<div className='stat-content'>
									<span className='stat-value'>{stock}</span>
									<span className='stat-label'>Quantity in hand</span>
								</div>
							</div>
							<div className='stat-card'>
								<div className='sales-img'>
									<img src='/assets/On_the_way.svg' alt='way' />
								</div>
								<div className='sales-content'>
									<span>{toBeRecieved}</span>
									<span>To be received</span>
								</div>
							</div>
						</div>
					</div>
				)

			case 'product-summary':
				return (
					<div
						className='box product-summary'
						draggable
						onDragStart={() => handleDragStart('product-summary', 'group2')}
						onDragOver={(e) => e.preventDefault()}
						onDrop={() => handleDrop('product-summary', 'group2')}
						key={type}
					>
						<h3>Product Summary</h3>
						<div className='stats-container'>
							<div className='stat-card'>
								<div className='stat-icon'>
									<img src='/assets/Suppliers.svg' alt='suppliers' />
								</div>
								<div className='stat-content'>
									<span className='stat-value'>8</span>
									<span className='stat-label'>Number of suppliers</span>
								</div>
							</div>
							<div className='stat-card'>
								<div className='sales-img'>
									<img src='/assets/Categories.svg' alt='categories' />
								</div>
								<div className='sales-content'>
									<span>{categories}</span>
									<span>Number of categories</span>
								</div>
							</div>
						</div>
					</div>
				)

			case 'top-products':
				return (
					<div
						className='box top-products'
						draggable
						onDragStart={() => handleDragStart('top-products', 'group2')}
						onDragOver={(e) => e.preventDefault()}
						onDrop={() => handleDrop('top-products', 'group2')}
						key={type}
					>
						<TopProducts sales={sales} />
					</div>
				)

			default:
				return null
		}
	}

	// ==== Mobile View Layout ====
	if (mobile) {
		return (
			<div className='home-mobile'>
				{/* Chart Div */}
				<div className='mobile-chart'>
					<Chart sales={sales} invoices={invoices} />
				</div>

				{/* Stats Div */}
				<div className='mobile-stats'>
					<div className='stat-card'>
						<img src='/assets/Sales.svg' alt='sales' />
						<div>
							<h4>{totalSalesQuantity}</h4>
							<p>Sales</p>
						</div>
					</div>
					<div className='stat-card'>
						<img src='/assets/Revenue.svg' alt='revenue' />
						<div>
							<h4>₹{totalSalesRevenue}</h4>
							<p>Revenue</p>
						</div>
					</div>
					<div className='stat-card'>
						<img src='/assets/Profit.svg' alt='profit' />
						<div>
							<h4>₹{profit}</h4>
							<p>Profit</p>
						</div>
					</div>
					<div className='stat-card'>
						<img src='/assets/Cost.svg' alt='cost' />
						<div>
							<h4>₹{totalCost}</h4>
							<p>Cost</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

	// ==== Desktop View Layout ====
	return (
		// <div className='home-page'>
		// 	<div
		// 		className='box sales-overview'
		// 		draggable
		// 		onDragStart={() => handleDragStart('sales-overview', 'group1')}
		// 		onDragOver={(e) => e.preventDefault()}
		// 		onDrop={() => handleDrop('sales-overview', 'group1')}
		// 	>
		// 		<h3>Sales Overview</h3>
		// 		<div className='stats-container'>
		// 			<div className='stat-card'>
		// 				<div
		// 					className='stat-icon'
		// 					// style={{ width: '25px', height: '25px', background: 'blue' }}
		// 				>
		// 					<img src='/assets/Sales.svg' alt='sales' />
		// 				</div>
		// 				<div className='stat-content'>
		// 					<span className='stat-value'>{totalSalesQuantity}</span>
		// 					<span className='stat-label'>Sales</span>
		// 				</div>
		// 			</div>
		// 			<div className='stat-card'>
		// 				<div
		// 					className='sales-img'
		// 					// style={{ width: '25px', height: '25px', background: 'blue' }}
		// 				>
		// 					<img src='/assets/Revenue.svg' alt='revenue' />
		// 				</div>
		// 				<div className='sales-content'>
		// 					<span>₹{totalSalesRevenue}</span>
		// 					<span>Revenue</span>
		// 				</div>
		// 			</div>
		// 			<div className='stat-card'>
		// 				<div
		// 					className='sales-img'
		// 					// style={{ width: '25px', height: '25px', background: 'blue' }}
		// 				>
		// 					<img src='/assets/Profit.svg' alt='profit' />
		// 				</div>
		// 				<div className='sales-content'>
		// 					<span>₹{profit}</span>
		// 					<span>Profit</span>
		// 				</div>
		// 			</div>
		// 			<div className='stat-card'>
		// 				<div
		// 					className='sales-img'
		// 					// style={{ width: '25px', height: '25px', background: 'blue' }}
		// 				>
		// 					<img src='/assets/Cost.svg' alt='cost' />
		// 				</div>
		// 				<div className='sales-content'>
		// 					<span>₹{totalCost}</span>
		// 					<span>Cost</span>
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</div>

		// 	<div
		// 		className='box inventory-summary'
		// 		draggable
		// 		onDragStart={() => handleDragStart('inventory-summary', 'group2')}
		// 		onDragOver={(e) => e.preventDefault()}
		// 		onDrop={() => handleDrop('inventory-summary', 'group2')}
		// 	>
		// 		<h3>Inventory Summary</h3>
		// 		<div className='stats-container'>
		// 			<div className='stat-card'>
		// 				<div className='stat-icon'>
		// 					<img src='/assets/Quantity.svg' alt='inhand' />
		// 				</div>
		// 				<div className='stat-content'>
		// 					<span className='stat-value'>{stock}</span>
		// 					<span className='stat-label'>Quantity in hand</span>
		// 				</div>
		// 			</div>
		// 			<div className='stat-card'>
		// 				<div className='sales-img'>
		// 					<img src='/assets/On_the_way.svg' alt='way' />
		// 				</div>
		// 				<div className='sales-content'>
		// 					<span>{toBeRecieved}</span>
		// 					<span>To be received</span>
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</div>
		// 	<div
		// 		className='box purchase-overview'
		// 		draggable
		// 		onDragStart={() => handleDragStart('purchase-overview', 'group2')}
		// 		onDragOver={(e) => e.preventDefault()}
		// 		onDrop={() => handleDrop('purchase-overview', 'group2')}
		// 	>
		// 		<h3>Purchase Overview</h3>
		// 		<div className='stats-container'>
		// 			<div className='stat-card'>
		// 				<div
		// 					className='stat-icon'
		// 					// style={{ width: '25px', height: '25px', background: 'blue' }}
		// 				>
		// 					<img src='/assets/Purchase.svg' alt='purchase' />
		// 				</div>
		// 				<div className='stat-content'>
		// 					<span className='stat-value'>{purchasedQuantity}</span>
		// 					<span className='stat-label'>Purchase</span>
		// 				</div>
		// 			</div>
		// 			<div className='stat-card'>
		// 				<div
		// 					className='sales-img'
		// 					// style={{ width: '25px', height: '25px', background: 'blue' }}
		// 				>
		// 					<img src='/assets/Cost2.svg' alt='cost' />
		// 				</div>
		// 				<div className='sales-content'>
		// 					<span>₹{totalCost}</span>
		// 					<span>Cost</span>
		// 				</div>
		// 			</div>
		// 			<div className='stat-card'>
		// 				<div
		// 					className='sales-img'
		// 					// style={{ width: '25px', height: '25px', background: 'blue' }}
		// 				>
		// 					<img src='/assets/Cancel.svg' alt='cancel' />
		// 				</div>
		// 				<div className='sales-content'>
		// 					<span>5</span>
		// 					<span>Cancel</span>
		// 				</div>
		// 			</div>
		// 			<div className='stat-card'>
		// 				<div
		// 					className='sales-img'
		// 					// style={{ width: '25px', height: '25px', background: 'blue' }}
		// 				>
		// 					<img src='/assets/Profit2.svg' alt='return' />
		// 				</div>
		// 				<div className='sales-content'>
		// 					<span>6</span>
		// 					<span>Return</span>
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</div>
		// 	<div
		// 		className='box product-summary'
		// 		draggable
		// 		onDragStart={() => handleDragStart('product-summary', 'group4')}
		// 		onDragOver={(e) => e.preventDefault()}
		// 		onDrop={() => handleDrop('product-summary', 'group4')}
		// 	>
		// 		<h3>Product Summary</h3>
		// 		<div className='stats-container'>
		// 			<div className='stat-card'>
		// 				<div className='stat-icon'>
		// 					<img src='/assets/Suppliers.svg' alt='suppliers' />
		// 				</div>
		// 				<div className='stat-content'>
		// 					<span className='stat-value'>8</span>
		// 					<span className='stat-label'>Number of suppliers</span>
		// 				</div>
		// 			</div>
		// 			<div className='stat-card'>
		// 				<div className='sales-img'>
		// 					<img src='/assets/Categories.svg' alt='categories' />
		// 				</div>
		// 				<div className='sales-content'>
		// 					<span>{categories}</span>
		// 					<span>Number of categories</span>
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</div>
		// 	<div
		// 		className='box sale-purchase'
		// 		draggable
		// 		onDragStart={() => handleDragStart('sale-purchase', 'group5')}
		// 		onDragOver={(e) => e.preventDefault()}
		// 		onDrop={() => handleDrop('sale-purchase', 'group5')}
		// 	>
		// 		<Chart
		// 			sales={sales}
		// 			invoices={invoices}
		// 			style={{ width: '100%', height: '100%' }}
		// 		/>
		// 	</div>
		// 	<div
		// 		className='box top-products'
		// 		draggable
		// 		onDragStart={() => handleDragStart('top-products', 'group6')}
		// 		onDragOver={(e) => e.preventDefault()}
		// 		onDrop={() => handleDrop('top-products', 'group6')}
		// 	>
		// 		<TopProducts sales={sales} />
		// 	</div>
		// </div>

		<div className='home-page'>
			<div className='group group1'>
				{group1Order.map((box) => renderBox(box))}
			</div>

			<div className='group group2'>
				{group2Order.map((box) => renderBox(box))}
			</div>
		</div>
	)
}

export default Home
