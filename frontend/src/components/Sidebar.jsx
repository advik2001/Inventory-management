import React, { useEffect, useState } from 'react'
import './Sidebar.css'
// import { Home, Package, Users, FileText, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
	const userName = localStorage.getItem('loggedInUser')

	return (
		<div className='sidebar'>
			<div className='logo'>
				<img
					src='/assets/logo.svg'
					alt='logo'
					style={{ width: '30px', height: '30px' }}
				/>
			</div>

			<div className='menu'>
				<nav>
					<ul>
						<li>
							<NavLink
								to='/home'
								className={({ isActive }) =>
									isActive ? 'nav-item active' : 'nav-item'
								}
							>
								<img
									src='/assets/home.svg'
									alt='stats'
									style={{ width: '20px', height: '20px' }}
								/>{' '}
								Home
							</NavLink>
						</li>
						<li>
							<NavLink
								to='/product'
								className={({ isActive }) =>
									isActive ? 'nav-item active' : 'nav-item'
								}
							>
								<img
									src='/assets/product.svg'
									alt='stats'
									style={{ width: '20px', height: '20px' }}
								/>{' '}
								Product
							</NavLink>
						</li>
						<li>
							<NavLink
								to='/invoice'
								className={({ isActive }) =>
									isActive ? 'nav-item active' : 'nav-item'
								}
							>
								<img
									src='/assets/invoice.svg'
									alt='stats'
									style={{ width: '20px', height: '20px' }}
								/>{' '}
								Invoice
							</NavLink>
						</li>
						<li>
							<NavLink
								to='/statistics'
								className={({ isActive }) =>
									isActive ? 'nav-item active' : 'nav-item'
								}
							>
								<img
									src='/assets/statistics.svg'
									alt='stats'
									style={{ width: '20px', height: '20px' }}
								/>{' '}
								Statistics
							</NavLink>
						</li>
						<li>
							<NavLink
								to='/setting'
								className={({ isActive }) =>
									isActive ? 'nav-item active' : 'nav-item'
								}
							>
								<img
									src='/assets/setting.svg'
									alt='stats'
									style={{ width: '20px', height: '20px' }}
								/>{' '}
								Setting
							</NavLink>
						</li>
					</ul>
				</nav>

				<div className='profile-card'>
					<div className='profile'></div>
					<div className='profile-name'>{userName}</div>
				</div>
			</div>
		</div>
	)
}

export default Sidebar
