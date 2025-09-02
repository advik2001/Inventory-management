const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserModel = require('../models/User')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')

const signup = async (req, res) => {
	try {
		const { name, email, password } = req.body

		// Check if user already exists
		const user = await UserModel.findOne({ email })
		if (user) {
			return res.status(400).json({
				message: 'User already exists',
				success: false,
			})
		}

		const userModel = new UserModel({ name, email, password })
		userModel.password = await bcrypt.hash(password, 10) // Hash the password
		await userModel.save()

		res.status(201).json({
			message: 'User created successfully',
			success: true,
		})
	} catch (error) {
		res.status(500).json({
			message: 'Internal server error',
			success: false,
		})
	}
}

const login = async (req, res) => {
	try {
		const { email, password } = req.body

		// Check if user already exists
		const user = await UserModel.findOne({ email })
		if (!user) {
			return res.status(403).json({
				message: 'Email or password is incorrect',
				success: false,
			})
		}

		const isPassEqual = await bcrypt.compare(password, user.password)

		if (!isPassEqual) {
			return res.status(403).json({
				message: 'Email or password is incorrect',
				success: false,
			})
		}

		// Generate JWT token
		const jwtToken = jwt.sign(
			{ email: user.email, _id: user._id },
			process.env.JWT_SECRET,
			{ expiresIn: '24h' }
		)

		res.status(200).json({
			message: 'Login success',
			success: true,
			jwtToken,
			email,
			name: user.name,
		})
	} catch (error) {
		res.status(500).json({
			message: 'Internal server error',
			success: false,
		})
	}
}

const forgot_password = async (req, res) => {
	const { email } = req.body
	const user = await UserModel.findOne({ email })
	if (!user) {
		return res
			.status(404)
			.json({ success: false, message: 'Email not registered.' })
	}

	// Generate OTP
	const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
	const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // expires in 10 mins

	user.otp = otp
	user.otpExpires = otpExpires
	await user.save()

	// Prepare email
	let transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	})

	let mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: 'Your OTP for Password Reset',
		text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
	}

	transporter.sendMail(mailOptions, (error, info) => {
		if (error)
			return res
				.status(500)
				.json({ success: false, message: 'Could not send OTP.' })
		return res.json({ success: true, message: 'OTP sent to email.' })
	})
}

const verify_otp = async (req, res) => {
	const { email, otp } = req.body
	const user = await UserModel.findOne({ email })
	if (!user)
		return res.status(404).json({ success: false, message: 'User not found.' })

	if (user.otp !== otp || user.otpExpires < new Date()) {
		return res
			.status(400)
			.json({ success: false, message: 'Invalid or expired OTP.' })
	}

	// OTP verified, clear OTP
	user.otp = null
	user.otpExpires = null
	await user.save()
	res.json({ success: true, message: 'OTP verified.' })
}

const reset_password = async (req, res) => {
	try {
		const { email, newPassword } = req.body

		if (!email || !newPassword) {
			return res
				.status(400)
				.json({
					success: false,
					message: 'Email and new password are required.',
				})
		}

		// Find user by email
		const user = await UserModel.findOne({ email })
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: 'User not found.' })
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(newPassword, 10)

		// Update password and clear OTP fields
		user.password = hashedPassword
		user.otp = null
		user.otpExpires = null
		await user.save()

		return res.json({
			success: true,
			message: 'Password has been reset successfully.',
		})
	} catch (error) {
		console.error('Reset password error:', error)
		return res
			.status(500)
			.json({
				success: false,
				message: 'Server error. Please try again later.',
			})
	}
}

module.exports = {
	signup,
	login,
	forgot_password,
	verify_otp,
	reset_password,
}
