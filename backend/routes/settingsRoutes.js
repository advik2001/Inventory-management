const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

const User = require('../Models/User')

const { ensureAuthenticated } = require('../middlewares/auth');

// Middleware to validate password and confirmPassword match
function validatePasswords(req, res, next) {
	const { password, confirmPassword } = req.body
	if (password !== confirmPassword) {
		return res.status(400).json({ message: "Passwords don't match" })
	}
	next()
}


// @route   GET /api/settings:userEmail
// Get user details
router.get('/:userEmail', ensureAuthenticated, async (req, res) => {
	// const { confirmPassword, email, firstName, lastName, password} = req.body;
	const { userEmail } = req.params

	try {
		const user = await User.findOne({ email: userEmail })
		res.status(201).json(user)
	} catch (err) {
		console.error('Error fetching user details', err)
		res.status(500).json({ message: 'Error fetching user' })
	}
})


// @route   PATCH /api/settings
// Edit user data
router.patch('/', ensureAuthenticated, validatePasswords, async (req, res) => {
	const { firstName, lastName, password, confirmPassword, email } = req.body

	if (!email) {
		return res
			.status(400)
			.json({ message: 'Email is required to identify the user' })
	}

	try {

    const name = `${firstName} ${lastName}`.trim();
		const updateData = { name }

		if (password) {
			const saltRounds = 10
			updateData.password = await bcrypt.hash(password, saltRounds)
		}

    console.log('updateData:', updateData);


		const updatedUser = await User.findOneAndUpdate(
			{ email },
			{ $set: updateData },
			{ new: true }
		)

		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' })
		}

		res.status(200).json({
			message: 'User updated successfully',
			user: updatedUser,
		})
	} catch (err) {
		console.error('Error updating user:', err)
		res.status(500).json({ message: 'Server error updating user' })
	}
})

module.exports = router
