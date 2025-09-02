
// import React, { useState } from 'react'
// import {
// 	BarChart,
// 	Bar,
// 	XAxis,
// 	YAxis,
// 	CartesianGrid,
// 	Tooltip,
// 	Legend,
// 	ResponsiveContainer,
// } from 'recharts'
// import { Calendar } from 'lucide-react'

// const Chart = ({ sales, invoices }) => {
// 	const getMonthlysData = () => {
// 		const monthNames = [
// 			'Jan',
// 			'Feb',
// 			'Mar',
// 			'Apr',
// 			'May',
// 			'Jun',
// 			'Jul',
// 			'Aug',
// 			'Sep',
// 			'Oct',
// 			'Nov',
// 			'Dec',
// 		]

// 		// initialize with 0 sales for all months
// 		const monthlyMap = {}
// 		monthNames.forEach((m) => {
// 			monthlyMap[m] = { month: m, purchase: 0, sales: 0 }
// 		})

// 		sales.forEach((item) => {
// 			const date = new Date(item.createdAt)
// 			const month = monthNames[date.getMonth()]
// 			monthlyMap[month].sales += item.totalAmount || 0
// 		})

// 		invoices.forEach((item) => {
// 			const date = new Date(item.createdAt)
// 			const month = monthNames[date.getMonth()]
// 			monthlyMap[month].purchase += item.totalAmount || 0
// 		})

// 		const monthlyData = Object.values(monthlyMap)

// 		return monthlyData
// 	}

// 	const getWeeklyData = () => {
// 		const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// 		// Get start and end of current week
// 		const now = new Date()
// 		const currentDay = now.getDay() // 0=Sunday, 1=Monday, ...
// 		const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay // Adjust so Monday is start
// 		const startOfWeek = new Date(now)
// 		startOfWeek.setDate(now.getDate() + diffToMonday)
// 		startOfWeek.setHours(0, 0, 0, 0)

// 		const endOfWeek = new Date(startOfWeek)
// 		endOfWeek.setDate(startOfWeek.getDate() + 6)
// 		endOfWeek.setHours(23, 59, 59, 999)

// 		// Initialize with 0 sales & purchase for all days
// 		const weeklyMap = {}
// 		days.forEach((d) => {
// 			weeklyMap[d] = { day: d, purchase: 0, sales: 0 }
// 		})

// 		// Helper to get day name from a date
// 		const getDayName = (date) => {
// 			let dayIndex = date.getDay()
// 			if (dayIndex === 0) dayIndex = 7 // Sunday → last
// 			return days[dayIndex - 1]
// 		}

// 		// Sales aggregation
// 		sales.forEach((item) => {
// 			const date = new Date(item.createdAt)
// 			if (date >= startOfWeek && date <= endOfWeek) {
// 				const dayName = getDayName(date)
// 				weeklyMap[dayName].sales += item.totalAmount || 0
// 			}
// 		})

// 		// Purchases aggregation
// 		invoices.forEach((item) => {
// 			const date = new Date(item.createdAt)
// 			if (date >= startOfWeek && date <= endOfWeek) {
// 				const dayName = getDayName(date)
// 				weeklyMap[dayName].purchase += item.totalAmount || 0
// 			}
// 		})

// 		const weeklyData = Object.values(weeklyMap)

// 		return weeklyData
// 	}

// 	const getYearlyData = () => {
// 		const currentYear = new Date().getFullYear()

// 		// Initialize with 0 for last 5 years
// 		const yearlyMap = {}
// 		for (let i = 0; i < 5; i++) {
// 			const year = currentYear - i
// 			yearlyMap[year] = { year, purchase: 0, sales: 0 }
// 		}

// 		// Aggregate sales
// 		sales.forEach((item) => {
// 			const date = new Date(item.createdAt)
// 			const year = date.getFullYear()
// 			if (yearlyMap[year]) {
// 				yearlyMap[year].sales += item.totalAmount || 0
// 			}
// 		})

// 		// Aggregate purchases (invoices)
// 		invoices.forEach((item) => {
// 			const date = new Date(item.createdAt)
// 			const year = date.getFullYear()
// 			if (yearlyMap[year]) {
// 				yearlyMap[year].purchase += item.totalAmount || 0
// 			}
// 		})

// 		// Convert to array and sort by year ascending
// 		const yearlyData = Object.values(yearlyMap).sort((a, b) => a.year - b.year)

// 		return yearlyData
// 	}

// 	const weeklyData = getWeeklyData()
// 	const monthlyData = getMonthlysData()
// 	const yearlyData = getYearlyData()

// 	const [view, setView] = useState('Weekly')

// 	const data = view === 'Weekly' ? weeklyData : monthlyData

// 	return (
// 		<div
// 			style={{
// 				background: '#fff',
// 				borderRadius: '12px',
// 				padding: '20px',
// 				boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
// 				width: '100%',
// 				maxWidth: '900px',
// 				margin: 'auto',
// 			}}
// 		>
// 			{/* Header */}
// 			<div
// 				style={{
// 					display: 'flex',
// 					justifyContent: 'space-between',
// 					alignItems: 'center',
// 					marginBottom: '10px',
// 				}}
// 			>
// 				<h3 style={{ color: '#344054', fontSize: '16px' }}>Sales & Purchase</h3>
// 				<button
// 					onClick={() => setView(view === 'Weekly' ? 'Monthly' : 'Weekly')}
// 					style={{
// 						display: 'flex',
// 						alignItems: 'center',
// 						gap: '6px',
// 						border: '1px solid #E0E0E0',
// 						borderRadius: '8px',
// 						padding: '6px 12px',
// 						background: '#fff',
// 						cursor: 'pointer',
// 						fontSize: '14px',
// 						color: '#344054',
// 					}}
// 				>
// 					<Calendar size={16} /> {view}
// 				</button>
// 			</div>

// 			{/* Chart */}
// 			<ResponsiveContainer width='100%' height={500}>
// 				<BarChart data={data} barGap={20}>
// 					<defs>
// 						<linearGradient id='purchaseGradient' x1='0' y1='0' x2='0' y2='1'>
// 							<stop offset='0%' stopColor='#817AF3' />
// 							<stop offset='47%' stopColor='#74B0FA' />
// 							<stop offset='100%' stopColor='#79D0F1' />
// 						</linearGradient>
// 						<linearGradient id='salesGradient' x1='0' y1='0' x2='0' y2='1'>
// 							<stop offset='0%' stopColor='#46A46C' />
// 							<stop offset='47%' stopColor='#51CC5D' />
// 							<stop offset='100%' stopColor='#57DA65' />
// 						</linearGradient>
// 					</defs>

// 					<CartesianGrid stroke='#D0D3D9' vertical={false} />
// 					{/* <XAxis dataKey='month' tick={{ fill: '#858D9D', fontSize: 12 }} /> */}
// 					<XAxis
// 						dataKey={view === 'Weekly' ? 'day' : 'month'}
// 						tick={{ fill: '#858D9D', fontSize: 12 }}
// 					/>

// 					<YAxis
// 						tick={{ fill: '#667085', fontSize: 12 }}
// 						domain={[0, 60000]}
// 						tickFormatter={(val) => val.toLocaleString()}
// 					/>
// 					<Tooltip />
// 					<Legend
// 						wrapperStyle={{
// 							fontSize: '12px',
// 							color: '#667085',
// 							marginTop: '10px',
// 						}}
// 						iconType='circle'
// 					/>
// 					<Bar
// 						dataKey='purchase'
// 						fill='url(#purchaseGradient)'
// 						radius={[8, 8, 0, 0]}
// 						barSize={16}
// 						name='Purchase'
// 					/>
// 					<Bar
// 						dataKey='sales'
// 						fill='url(#salesGradient)'
// 						radius={[8, 8, 0, 0]}
// 						barSize={16}
// 						name='Sales'
// 					/>
// 				</BarChart>
// 			</ResponsiveContainer>
// 		</div>
// 	)
// }

// export default Chart


import React, { useState } from 'react'
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts'

const Chart = ({ sales, invoices }) => {

	const getMonthlysData = () => {
		const monthNames = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		]

		const monthlyMap = {}
		monthNames.forEach((m) => {
			monthlyMap[m] = { month: m, purchase: 0, sales: 0 }
		})

		sales.forEach((item) => {
			const date = new Date(item.createdAt)
			const month = monthNames[date.getMonth()]
			monthlyMap[month].sales += item.totalAmount || 0
		})

		invoices.forEach((item) => {
			const date = new Date(item.createdAt)
			const month = monthNames[date.getMonth()]
			monthlyMap[month].purchase += item.totalAmount || 0
		})

		return Object.values(monthlyMap)
	}

	const getWeeklyData = () => {
		const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
		const now = new Date()
		const currentDay = now.getDay()
		const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay
		const startOfWeek = new Date(now)
		startOfWeek.setDate(now.getDate() + diffToMonday)
		startOfWeek.setHours(0, 0, 0, 0)

		const endOfWeek = new Date(startOfWeek)
		endOfWeek.setDate(startOfWeek.getDate() + 6)
		endOfWeek.setHours(23, 59, 59, 999)

		const weeklyMap = {}
		days.forEach((d) => {
			weeklyMap[d] = { day: d, purchase: 0, sales: 0 }
		})

		const getDayName = (date) => {
			let dayIndex = date.getDay()
			if (dayIndex === 0) dayIndex = 7
			return days[dayIndex - 1]
		}

		sales.forEach((item) => {
			const date = new Date(item.createdAt)
			if (date >= startOfWeek && date <= endOfWeek) {
				const dayName = getDayName(date)
				weeklyMap[dayName].sales += item.totalAmount || 0
			}
		})

		invoices.forEach((item) => {
			const date = new Date(item.createdAt)
			if (date >= startOfWeek && date <= endOfWeek) {
				const dayName = getDayName(date)
				weeklyMap[dayName].purchase += item.totalAmount || 0
			}
		})

		return Object.values(weeklyMap)
	}

	const getYearlyData = () => {
		const currentYear = new Date().getFullYear()
		const yearlyMap = {}

		for (let i = 0; i < 5; i++) {
			const year = currentYear - i
			yearlyMap[year] = { year, purchase: 0, sales: 0 }
		}

		sales.forEach((item) => {
			const date = new Date(item.createdAt)
			const year = date.getFullYear()
			if (yearlyMap[year]) {
				yearlyMap[year].sales += item.totalAmount || 0
			}
		})

		invoices.forEach((item) => {
			const date = new Date(item.createdAt)
			const year = date.getFullYear()
			if (yearlyMap[year]) {
				yearlyMap[year].purchase += item.totalAmount || 0
			}
		})

		return Object.values(yearlyMap).sort((a, b) => a.year - b.year)
	}

	const weeklyData = getWeeklyData()
	const monthlyData = getMonthlysData()
	const yearlyData = getYearlyData()

	const [view, setView] = useState('Weekly')

	// cycle between views
	const toggleView = () => {
		if (view === 'Weekly') setView('Monthly')
		else if (view === 'Monthly') setView('Yearly')
		else setView('Weekly')
	}

	const data =
		view === 'Weekly' ? weeklyData : view === 'Monthly' ? monthlyData : yearlyData

	return (
		<div
			style={{
				background: '#fff',
				borderRadius: '12px',
				padding: '20px',
				boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
				width: '100%',
				maxWidth: '900px',
				margin: 'auto',
			}}
		>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '10px',
				}}
			>
				<h3 style={{ color: '#344054', fontSize: '16px' }}>Sales & Purchase</h3>
				<button
					onClick={toggleView}
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '6px',
						border: '1px solid #E0E0E0',
						borderRadius: '8px',
						padding: '6px 12px',
						background: '#fff',
						cursor: 'pointer',
						fontSize: '14px',
						color: '#344054',
					}}
				>
					<img src="/assets/callender.svg" alt="" /> {view}
				</button>
			</div>

			{/* Chart */}
			<ResponsiveContainer width='100%' height={500}>
				<BarChart data={data} barGap={20}>
					<defs>
						<linearGradient id='purchaseGradient' x1='0' y1='0' x2='0' y2='1'>
							<stop offset='0%' stopColor='#817AF3' />
							<stop offset='47%' stopColor='#74B0FA' />
							<stop offset='100%' stopColor='#79D0F1' />
						</linearGradient>
						<linearGradient id='salesGradient' x1='0' y1='0' x2='0' y2='1'>
							<stop offset='0%' stopColor='#46A46C' />
							<stop offset='47%' stopColor='#51CC5D' />
							<stop offset='100%' stopColor='#57DA65' />
						</linearGradient>
					</defs>

					<CartesianGrid stroke='#D0D3D9' vertical={false} />

					<XAxis
						dataKey={view === 'Weekly' ? 'day' : view === 'Monthly' ? 'month' : 'year'}
						tick={{ fill: '#858D9D', fontSize: 12 }}
					/>

					<YAxis
						tick={{ fill: '#667085', fontSize: 12 }}
						domain={[0, 'auto']}
						tickFormatter={(val) => val.toLocaleString()}
					/>
					<Tooltip />
					<Legend
						wrapperStyle={{
							fontSize: '12px',
							color: '#667085',
							marginTop: '10px',
						}}
						iconType='circle'
					/>
					<Bar
						dataKey='purchase'
						fill='url(#purchaseGradient)'
						radius={[8, 8, 0, 0]}
						barSize={16}
						name='Purchase'
					/>
					<Bar
						dataKey='sales'
						fill='url(#salesGradient)'
						radius={[8, 8, 0, 0]}
						barSize={16}
						name='Sales'
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}

export default Chart
