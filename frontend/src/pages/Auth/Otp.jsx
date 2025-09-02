import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import { handleError, handleSuccess } from "../../utils";
import { useNavigate } from 'react-router-dom'
import "./Auth.css"; // Assume styling as below

function Otp() {

  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setOtp(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!otp) {
      handleError('Please enter the OTP.')
      return
    }

    if (!email) {
      handleError('Email is missing. Please retry the password reset process.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        handleSuccess(data.message || 'OTP verified successfully!')

        // Navigate to reset password page 
        navigate('/reset-password', { state: { email } })
      } else {
        handleError(data.message || 'OTP verification failed.')
      }
    } catch (error) {
      handleError('Something went wrong. Please try again.')
      console.error('OTP verification error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-root">

      {/* Left Panel */}
      <div className="auth-left-panel">
        <div className="login-form-container">
          <div className="login-intro">
            <h2>Enter your OTP</h2>
            <span className="login-welcome">We have sent a 6-digit OTP to your registered mail. </span>
            <br />
            <span className="login-welcome">Please enter it below to sign in. </span>
          </div>
          
          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* OTP */}
            <div className="login-field">
              <label htmlFor="otp">OTP</label>
              <input
                onChange={handleChange}
                value={otp}
                id="otp"
                name="otp"
                type="number"
                placeholder="xxxx05"
              />
            </div>
            {/* Sign In Button */}
            <button type="submit" className="login-submit">Confirm</button>
          </form>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right-panel">
        <div className="login-welcome-block">
          <img src='/assets/rocket.svg' alt='' />
          {/* <h1>Welcome to<br />Company Name</h1>
          <div className="login-illustration"></div> */}
        </div>
      </div>
    </div>
  );
}

export default Otp;
