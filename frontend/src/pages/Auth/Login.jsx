import React, { useState } from 'react'
import { handleError, handleSuccess } from '../../utils'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

function Login() {
	// State to hold login information
	const [loginInfo, setLoginInfo] = useState({
		email: '',
		password: '',
	})
	const [passwordVisible, setPasswordVisible] = useState(false)
	const navigate = useNavigate()

	const handleChange = (e) => {
		const { name, value } = e.target

		const copyLoginInfo = { ...loginInfo }
		copyLoginInfo[name] = value
		setLoginInfo(copyLoginInfo)
	}

	const handleLogin = async (e) => {
		e.preventDefault()

		const { email, password } = loginInfo

		if (!email || !password) {
			return handleError('All fields are required')
		}

		try {
			const url = `${import.meta.env.VITE_API_URL}/api/auth/login`
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(loginInfo),
			})

			const result = await response.json()
			console.log(result)
			const { message, success, jwtToken, name, error, email } = result

			if (success) {
				handleSuccess(message)
				console.log(message)

				localStorage.setItem('token', jwtToken)
				localStorage.setItem('loggedInUser', name)
				localStorage.setItem('userEmail', email)
				setTimeout(() => {
					navigate('/home')
				}, 1000)
			} else if (error) {
				const details = error?.details[0].message
				handleError(details || 'Login failed')
				console.log(details || 'Login failed')
			} else if (!success) {
				handleError(message)
				console.log(message)
			}
		} catch (error) {
			handleError(error.message || 'Something went wrong')
			console.log(error.message || 'Something went wrong')
		}
	}

	return (
		<div className='auth-root'>
			{/* Left Panel */}
			<div className='auth-left-panel'>
				<div className='login-form-container'>
					<div className='login-intro'>
						<h2>Log in to your account</h2>
						<span className='login-welcome'>
							Welcome back! Please enter your details.
						</span>
					</div>

					{/* Form Fields */}
					<form onSubmit={handleLogin} className='login-form'>
						{/* Email */}
						<div className='login-field'>
							<label htmlFor='email'>Email</label>
							<input
								onChange={handleChange}
								value={loginInfo.email}
								id='email'
								name='email'
								type='email'
								placeholder='Example@email.com'
								autoComplete='username'
							/>
						</div>
						{/* Password */}
						<div className='login-field'>
							<label htmlFor='password'>Password</label>
							<div className='login-password-wrapper'>
								<input
									onChange={handleChange}
									value={loginInfo.password}
									id='password'
									name='password'
									type={passwordVisible ? 'text' : 'password'}
									placeholder='at least 8 characters'
									autoComplete='current-password'
								/>
								<button
									type='button'
									className='login-password-toggle'
									onClick={() => setPasswordVisible((v) => !v)}
									aria-label='Show password'
								>
                  <img src="/assets/eye.svg" alt="" />
								</button>
							</div>
							<a href='/forgot-password' className='login-forgot'>
								Forgot Password?
							</a>
						</div>
						{/* Sign In Button */}
						<button type='submit' className='login-submit'>
							Sign in
						</button>
					</form>
					<span className='login-signup-text'>
						Don&apos;t you have an account? <a href='/signup'>Sign up</a>
					</span>
				</div>
			</div>

			{/* Right Panel */}
			<div className='auth-right-panel'>
				<div className='login-welcome-block'>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<h1>
							Welcome to
							<br />
							Company Name{' '}
						</h1>
						<img src='/assets/logo_big.svg' alt='' />
					</div>
					<div className='login-illustration'>
						<img src='/assets/login.svg' alt='' />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Login
