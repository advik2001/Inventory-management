import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import './AppLayout.css'
import { useSearch } from '../context/SearchContext'
import Navbar from '../components/Navbar'
import { NavLink } from 'react-router-dom'

const AppLayout = () => {
	const { searchQuery, setSearchQuery } = useSearch()
	const [mobile, setMobile] = useState(window.innerWidth <= 768)

	if (mobile) {
		return (
			<div className='mobile-layout'>
				{/* Top Bar */}
				<div className='mobile-topbar'>
					<img
						src='/assets/logo.svg'
						alt=''
						style={{ width: '47px', height: '47px' }}
					/>
					<NavLink
						to='/setting'
						className={({ isActive }) =>
							isActive ? 'nav-item active' : 'nav-item'
						}
					>
						<img
							src='/assets/setting.svg'
							alt=''
							style={{ width: '15px', height: '15px' }}
						/>
					</NavLink>
				</div>

				{/* Main Scrollable Content */}
				<div className='mobile-content'>
					<Outlet />
				</div>

				{/* Bottom Navigation */}
				<Navbar />
			</div>
		)
	}

	return (
		<div className='layout'>
			{/* Left Sidebar */}
			<Sidebar />

			{/* Right Content */}
			<div className='content'>
				{/* Top Bar */}
				<div className='topbar'>
					<h2>Home</h2>
					<div className='topbar-search'>
						{/* Search Box */}
						<img src='/public/assets/search.svg' alt='' />
						<input
							type='text'
							name='search'
							placeholder='Search here...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>

				<Outlet />
			</div>
		</div>
	)
}

export default AppLayout
