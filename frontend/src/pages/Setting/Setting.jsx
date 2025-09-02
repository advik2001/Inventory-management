import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Setting.css'
import { handleError, handleSuccess } from '../../utils'

const Setting = () => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
	})

	useEffect(() => {

		const fetchUserDetails = async () => {
			const userEmail = localStorage.getItem('userEmail')
			const jwtToken = localStorage.getItem('token')

			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/settings/${userEmail}`, {headers: {
          Authorization: `${jwtToken}`
        }}
				)
				const userDetails = response.data

				// Split full name
				const nameParts = userDetails.name
					? userDetails.name.trim().split(' ')
					: []

				const firstName = nameParts[0] || ''

				// Join remaining parts as lastName, or empty if none
				const lastName =
					nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

				setFormData((prevData) => ({
					...prevData,
					firstName,
					lastName,
					email: userDetails.email,
				}))
			} catch (error) {
				console.log(error)
			}
		}

		fetchUserDetails()
	}, [])

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		const { password, confirmPassword } = formData;

  	if (password !== confirmPassword) {
    	handleError('Password and Confirm Password do not match');
    	return; 
  	}

		const jwtToken = localStorage.getItem('token')

		try {
			const payload = {
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email, 
				password: formData.password,
				confirmPassword: formData.confirmPassword,
			}

			const response = await axios.patch(
				`${import.meta.env.VITE_API_URL}/api/settings`,
				payload, {headers: {
          Authorization: `${jwtToken}`
        }}
			)
			console.log('Update successful:', response.data)

			setFormData((prevData) => ({
				...prevData,
				password: '',
				confirmPassword: '',
			}))

			localStorage.setItem('loggedInUser', response.data.user.name )

			handleSuccess('User details updated successfully')
		} catch (error) {
			console.error('Update failed:', error)
			handleError(error)
		}
	}

	return (
		<div className='setting-page'>
			<div className='setting-container'>
				<div className='setting-header'>
					<p>Edit Profile</p>
				</div>

				<div className='setting-form'>
					<form className='register-form' onSubmit={handleSubmit}>
						<div className='form-group'>
							<label>First name</label>
							<input
								type='text'
								name='firstName'
								value={formData.firstName}
								onChange={handleChange}
								placeholder='Enter first name'
							/>
						</div>

						<div className='form-group'>
							<label>Last name</label>
							<input
								type='text'
								name='lastName'
								value={formData.lastName}
								onChange={handleChange}
								placeholder='Enter last name'
							/>
						</div>

						<div className='form-group'>
							<label>Email</label>
							<input
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								placeholder='Enter email'
								disabled={true}
							/>
						</div>

						<div className='form-group'>
							<label>Password</label>
							<input
								type='password'
								name='password'
								value={formData.password}
								onChange={handleChange}
								placeholder='Enter password'
							/>
						</div>

						<div className='form-group'>
							<label>Confirm Password</label>
							<input
								type='password'
								name='confirmPassword'
								value={formData.confirmPassword}
								onChange={handleChange}
								placeholder='Confirm password'
							/>
						</div>

						<button type='submit' className='submit-btn'>
							Save
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Setting
