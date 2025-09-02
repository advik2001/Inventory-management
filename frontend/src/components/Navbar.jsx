import React, { useEffect, useState } from 'react'
import './Navbar.css'
// import { Home, Package, Users, FileText, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return ( 
    <div className='nav-bar'>
      <nav>
					<ul>
						<li>
							<NavLink
								to='/home'
								className={({ isActive }) =>
									isActive ? 'mob-nav-item active' : 'mob-nav-item'
								}
							>
								<img
									src='/assets/home.svg'
									alt='stats'
									style={{ width: '25px', height: '25px' }}
								/>{' '}
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
									style={{ width: '25px', height: '25px' }}
								/>
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
									style={{ width: '25px', height: '25px' }}
								/>
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
									style={{ width: '25px', height: '25px' }}
								/>
							</NavLink>
						</li>
					</ul>
				</nav>
    </div>
  )
}

export default Navbar
