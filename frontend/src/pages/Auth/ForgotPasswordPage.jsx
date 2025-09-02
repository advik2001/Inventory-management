import React, { useState } from 'react'
import { handleError, handleSuccess } from '../../utils'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css' // Assume styling as below

function ForgotPasswordPage() {
	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)

	const navigate = useNavigate()

	const handleChange = (e) => {
		setEmail(e.target.value)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!email) {
			handleError('Please enter your email.')
			return
		}

		setLoading(true)
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email }),
				}
			)

			const data = await response.json()

			if (response.ok) {
				handleSuccess(data.message || 'OTP sent to email.')

				// navigate to OTP verification page
				navigate('/verify-otp', { state: { email } })
			} else {
				handleError(data.message || 'Failed to send OTP.')
			}
		} catch (error) {
			handleError('Something went wrong. Please try again.')
			console.error('Forgot password error:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='auth-root'>
			{/* Left Panel */}
			<div className='auth-left-panel'>
				<div className='login-form-container'>
					<div className='login-intro'>
						<h2>Company Name</h2>
						<span className='login-welcome'>
							Please enter your registered email id to receive an OTP.
						</span>
					</div>

					{/* Form Fields */}
					<form onSubmit={handleSubmit} className='login-form'>
						{/* Email */}
						<div className='login-field'>
							<label htmlFor='email'>Email</label>
							<input
								onChange={handleChange}
								value={email}
								id='email'
								name='email'
								type='email'
								placeholder='Enter your registered email'
								autoComplete='username'
							/>
						</div>
						{/* Sign In Button */}
						<button type='submit' className='login-submit'>
							Send Mail
						</button>
					</form>
				</div>
			</div>

			{/* Right Panel */}
			<div className='auth-right-panel'>
				<div className='login-welcome-block'>
					<img src='/assets/woman.svg' alt='' />
				</div>
			</div>
		</div>
	)
}

export default ForgotPasswordPage
