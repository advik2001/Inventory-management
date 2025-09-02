import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { handleError, handleSuccess } from "../../utils";

const SignUp = () => {

  // State to hold signup information
	const [signupInfo, setSignupInfo] = useState({
		name: '',
		email: '',
		password: '',
    confirmPassword: ''
	})

	const [showPassword, setShowPassword] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)

  const navigate = useNavigate()

	const handleChange = (e) => {
		const { name, value } = e.target
		// console.log(name, value)

    const copySignupInfo = { ...signupInfo }
    copySignupInfo[name] = value 
    setSignupInfo(copySignupInfo)
	}
 
  const handleSignUp = async (e) => {
    e.preventDefault()

    const { name, email, password, confirmPassword } = signupInfo;

    if (!name || !email || !password || !confirmPassword) {
      return handleError('All fields are required')
    }

    if (password !== confirmPassword) {
      return handleError('Passwords do not match');
    }

    try {

      const url = `${import.meta.env.VITE_API_URL}/api/auth/signup`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, email, password}),
      });

      const result = await response.json();
      const { message, success, error} = result;

      if(success) {

        handleSuccess(message)
        setTimeout(() => {

          navigate('/login');

        }, 1000);
      } else if(error) {
        
        const details = error?.details[0].message;
        handleError(details)
      } 
      else if(!success) {
        handleError(message)
      }

    } catch(error) {

      handleError(error)
    }

  }

  return (
    
    <div className="auth-root">

      {/* Left Panel */}
      <div className="auth-left-panel">
        <div className="login-form-container">
          <div className="login-intro">
            <h2>Create an account</h2>
            <span className="login-welcome">Start Inventory Management</span>
          </div>
          
          {/* Form Fields */}
          <form onSubmit={handleSignUp} className="login-form">
            {/* Name */}
            <div className="login-field">
              <label htmlFor="name">Name</label>
              <input
                onChange={handleChange}
                value={signupInfo.name}
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>
            {/* Email */}
            <div className="login-field">
              <label htmlFor="email">Email</label>
              <input
                onChange={handleChange}
                value={signupInfo.email}
                id="email"
                name="email"
                type="email"
                placeholder="Example@email.com"
                autoComplete="username"
              />
            </div>
            {/* Password */}
            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-password-wrapper">
                <input
                  onChange={handleChange}
                  value={signupInfo.password}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="at least 8 characters"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Show password"
                >
                  👁
                </button>
              </div>
            </div>
            {/* Confirm Password */}
            <div className="login-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="login-password-wrapper">
                <input
                  onChange={handleChange}
                  value={signupInfo.confirmPassword}
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="at least 8 characters"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label="Show password"
                >
                  👁
                </button>
              </div>
            </div>
            {/* Sign In Button */}
            <button type="submit" className="login-submit">Sign up</button>
          </form>
          <span className="login-signup-text">
            Do you have an account? <a href="/login">Sign in</a>
          </span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right-panel">
        <div className="login-welcome-block">
          <h1>Welcome to<br />Company Name</h1>
          {/* Insert illustration SVG or image here */}
          <div className="login-illustration"></div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
