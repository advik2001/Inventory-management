const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, default: null },
		otp: String,        // store OTP
    otpExpires: Date,    // store expiration
	},
	{ timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
