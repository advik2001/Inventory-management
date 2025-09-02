import React, { use, useEffect } from 'react'
import { replace, useLocation, useNavigate } from 'react-router-dom'

const RefreshHandler = ({ setIsAuthenticated }) => {
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		// Check if the user is authenticated based on the presence of a token
		if (localStorage.getItem('token')) {
			setIsAuthenticated(true)

			if (
				location.pathname === '/' ||
				location.pathname === '/login' ||
				location.pathname === '/signup'||
				location.pathname === '/forgot-password'||
				location.pathname === '/verify-otp'||
				location.pathname === '/reset-password'
			) {
				navigate('/home', { replace: false })
			}
		}
	}, [location, navigate, setIsAuthenticated])

	return null
}

export default RefreshHandler
