const express = require('express') 
const { signup, login, forgot_password, verify_otp, reset_password } = require('../controllers/authController');

const router = express.Router();

// Auth Routes
// router.post('/login', loginValidation, login);
// router.post('/signup', signupValidation, signup);

router.post('/login', login);
router.post('/signup', signup);

router.post('/forgot-password', forgot_password);

router.post('/verify-otp', verify_otp);

router.post('/reset-password', reset_password)


module.exports = router