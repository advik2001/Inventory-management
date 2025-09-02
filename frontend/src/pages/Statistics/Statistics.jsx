// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import './Statistics.css'
// import Chart from '../../components/Chart'
// import TopProducts from '../../components/TopProducts'

// const Statistics = () => {
// 	const [sales, setSales] = useState([])
// 	const [products, setProducts] = useState([])
// 	const [invoices, setInvoices] = useState([])

// 	const fetchData = async () => {

// 		const jwtToken = localStorage.getItem('token')
// 		try {
// 			const response = await axios.get(
// 				`${import.meta.env.VITE_API_URL}/api/sales`, { headers: {
//           Authorization: `${jwtToken}`
//         }}
// 			)
// 			const productResponse = await axios.get(
// 				`${import.meta.env.VITE_API_URL}/api/products`, { headers: {
//           Authorization: `${jwtToken}`
//         }}
// 			)
// 			const invoicesResponse = await axios.get(
// 				`${import.meta.env.VITE_API_URL}/api/invoices`, { headers: {
//           Authorization: `${jwtToken}`
//         }}
// 			)
// 			setSales(response.data)
// 			setProducts(productResponse.data)
// 			setInvoices(invoicesResponse.data)
// 		} catch (error) {
// 			console.log(error)
// 		}
// 	}

// 	useEffect(() => {
// 		fetchData()
// 	}, [])

// 	const getTotalSalesQuantity = () => {
// 		return sales.reduce((acc, item) => acc + item.quantity, 0)
// 	}

// 	const getTotalSalesRevenue = () => {
// 		return sales.reduce((acc, item) => acc + item.price * item.quantity, 0)
// 	}

// 	const getTotalStock = () => {
// 		return products.reduce((total, product) => total + (product.stock || 0), 0)
// 	}

// 	const totalSalesRevenue = getTotalSalesRevenue()
// 	const totalSalesQuantity = getTotalSalesQuantity()
// 	const totalStock = getTotalStock()

// 	return (
// 		<div className='statistics-page'>
// 			<div className='stats-box stats-revenue'>
// 				<div className='stats-heading'>
// 					<h5>Total Revenue</h5>
// 					<h5>$</h5>
// 				</div>
// 				<div className='stats-content'>
// 					<h4>${totalSalesRevenue}</h4>
// 					<p>+21% from last month</p>
// 				</div>
// 			</div>

// 			<div className='stats-box stats-products'>
// 				<div className='stats-heading'>
// 					<h5>Products sold</h5>
// 					<h5>$</h5>
// 				</div>

// 				<div className='stats-content'>
// 					<h3>{totalSalesQuantity}</h3>
// 					<p>+21% from last month</p>
// 				</div>
// 			</div>

// 			<div className='stats-box stats-stock'>
// 				<div className='stats-heading'>
// 					<h5>Products in stock</h5>
// 					<h5>$</h5>
// 				</div>

// 				<div className='stats-content'>
// 					<h3>{totalStock}</h3>
// 					<p>+21% from last month</p>
// 				</div>
// 			</div>

// 			<div className='stats-box sale-purchase'>
// 				<Chart sales={sales} invoices={invoices} style={{ width: '100%', height: '100%' }} />
// 			</div>

// 			<div className='stats-box top-products'>
// 				<TopProducts sales={sales} />
// 			</div>
// 		</div>
// 	)
// }

// export default Statistics

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Statistics.css'
import Chart from '../../components/Chart'
import TopProducts from '../../components/TopProducts'

const Statistics = () => {
	const [sales, setSales] = useState([])
	const [products, setProducts] = useState([])
	const [invoices, setInvoices] = useState([])
	const [mobile, setMobile] = useState(window.innerWidth <= 768)

	// 🔹 Groups
	const [group1, setGroup1] = useState([
		'stats-revenue',
		'stats-products',
		'stats-stock',
	])
	const [group2, setGroup2] = useState(['sale-purchase', 'top-products'])

	const [dragItem, setDragItem] = useState(null)

	const fetchData = async () => {
		const jwtToken = localStorage.getItem('token')
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/api/sales`,
				{ headers: { Authorization: `${jwtToken}` } }
			)
			const productResponse = await axios.get(
				`${import.meta.env.VITE_API_URL}/api/products`,
				{ headers: { Authorization: `${jwtToken}` } }
			)
			const invoicesResponse = await axios.get(
				`${import.meta.env.VITE_API_URL}/api/invoices`,
				{ headers: { Authorization: `${jwtToken}` } }
			)
			setSales(response.data)
			setProducts(productResponse.data)
			setInvoices(invoicesResponse.data)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	// 🔹 Helpers
	const getTotalSalesQuantity = () => {
		return sales.reduce((acc, item) => acc + item.quantity, 0)
	}
	const getTotalSalesRevenue = () => {
		return sales.reduce((acc, item) => acc + item.price * item.quantity, 0)
	}
	const getTotalStock = () => {
		return products.reduce((total, product) => total + (product.stock || 0), 0)
	}

	const totalSalesRevenue = getTotalSalesRevenue()
	const totalSalesQuantity = getTotalSalesQuantity()
	const totalStock = getTotalStock()

	// Drag logic
	const handleDragStart = (group, index) => {
		setDragItem({ group, index })
	}

	const handleDrop = (group, index) => {
		if (!dragItem || dragItem.group !== group) return

		if (group === 'group1') {
			const newOrder = [...group1]
			;[newOrder[dragItem.index], newOrder[index]] = [
				newOrder[index],
				newOrder[dragItem.index],
			]
			setGroup1(newOrder)
		} else if (group === 'group2') {
			const newOrder = [...group2]
			;[newOrder[dragItem.index], newOrder[index]] = [
				newOrder[index],
				newOrder[dragItem.index],
			]
			setGroup2(newOrder)
		}
		setDragItem(null)
	}

	// Renderer
	const renderBox = (type, index, group) => {
		const commonProps = {
			draggable: true,
			onDragStart: () => handleDragStart(group, index),
			onDragOver: (e) => e.preventDefault(),
			onDrop: () => handleDrop(group, index),
			className: `stats-box ${type}`,
		}

		switch (type) {
			case 'stats-revenue':
				return (
					<div {...commonProps} key={type}>
						<div className='stats-heading'>
							<h5>Total Revenue</h5>
							<h5>$</h5>
						</div>
						<div className='stats-content'>
							<h4>${totalSalesRevenue}</h4>
							<p>+21% from last month</p>
						</div>
					</div>
				)

			case 'stats-products':
				return (
					<div {...commonProps} key={type}>
						<div className='stats-heading'>
							<h5>Products sold</h5>
							<h5>$</h5>
						</div>
						<div className='stats-content'>
							<h3>{totalSalesQuantity}</h3>
							<p>+21% from last month</p>
						</div>
					</div>
				)

			case 'stats-stock':
				return (
					<div {...commonProps} key={type}>
						<div className='stats-heading'>
							<h5>Products in stock</h5>
							<h5>$</h5>
						</div>
						<div className='stats-content'>
							<h3>{totalStock}</h3>
							<p>+21% from last month</p>
						</div>
					</div>
				)

			case 'sale-purchase':
				return (
					<div {...commonProps} key={type}>
						<Chart
							sales={sales}
							invoices={invoices}
							style={{ width: '100%', height: '100%' }}
						/>
					</div>
				)

			case 'top-products':
				return (
					<div {...commonProps} key={type}>
						<TopProducts sales={sales} />
					</div>
				)

			default:
				return null
		}
	}

	if (mobile) {
		return (
			<div className='statistics-mobile'>
				{/* Chart Div */}
				<div className='mobile-chart'>
					<Chart sales={sales} invoices={invoices} />
				</div>
				{/* stats Divs */}
				<div className='mobile-statistics'>

					<div className='mobile-stat-card mobile-revenue'>
						<div className='mobile-stats-heading'>
							<h5>Total Revenue</h5>
							<h5>$</h5>
						</div>
						<h4>${totalSalesRevenue}</h4>
						<p style={{ fontSize: '10px' }}>+21% from last month</p>
					</div>

					<div className='mobile-stat-card mobile-products'>
						<div className='mobile-stats-heading'>
							<h5>Total Revenue</h5>
							<h5>$</h5>
						</div>
						<h4>${totalSalesRevenue}</h4>
						<p style={{ fontSize: '10px' }}>+21% from last month</p>
					</div>

					<div className='mobile-stat-card mobile-stock'>
						<div className='mobile-stats-heading'>
							<h5>Total Revenue</h5>
							<h5>$</h5>
						</div>
						<h4>${totalSalesRevenue}</h4>
						<p style={{ fontSize: '10px' }}>+21% from last month</p>
					</div>

				</div>
			</div>
		)
	}

	return (
		<div className='statistics-page'>
			{/* Group1 items → revenue, products, stock */}
			{group1.map((box, i) => renderBox(box, i, 'group1'))}

			{/* Group2 items → chart + top products */}
			{group2.map((box, i) => renderBox(box, i, 'group2'))}
		</div>
	)
}

export default Statistics
