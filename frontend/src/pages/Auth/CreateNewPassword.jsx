import React, { useState, useEffect } from "react";
import { handleError, handleSuccess } from "../../utils";
import { Link, useNavigate, useLocation } from 'react-router-dom'
import "./Auth.css"; // Assume styling as below

function CreateNewPassword() {

  const [newpassword, setNewpassword] = useState('')
  const [confirmpassword, setConfirmpassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  // Get email from navigation state (passed from OTP verification)
  const email = location.state?.email

  useEffect(() => {
    if (!email) {
      // If email not present, redirect back to forgot password page
      handleError('Email missing. Please restart the password reset process.')
      navigate('/forgot-password')
    }
  }, [email, navigate])


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!newpassword || !confirmpassword) {
      handleError('Please fill in both password fields.')
      return
    }

    if (newpassword.length < 8) {
      handleError('Password must be at least 8 characters long.')
      return
    }

    if (newpassword !== confirmpassword) {
      handleError('Passwords do not match.')
      return
    }

    if (!email) {
      handleError('Email missing. Please restart the password reset process.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword: newpassword }),
      })

      const data = await response.json()

      if (response.ok) {
        handleSuccess(data.message || 'Password reset successful.')
        navigate('/login') // redirect to login after successful reset
      } else {
        handleError(data.message || 'Failed to reset password.')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      handleError('Something went wrong. Please try again.')
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
            <h2>Create New Password</h2>
            <span className="login-welcome">Today is a new day. It's your day. You shape it.</span>
            <br />
            <span className="login-welcome">Sign in to start managing your projects.</span>
          </div>
          
          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* New Password */}
            <div className="login-field">
              <label htmlFor="newpassword">Enter New Password</label>
              <input
                onChange={(e) => setNewpassword(e.target.value)}
                value={newpassword}
                id="newpassword"
                name="newpassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="atleast 8 characters"
                autoComplete="new-password"
                required
              />
            </div>
            {/* Confirm Password */}
            <div className="login-field">
              <label htmlFor="confirmpassword">Confirm Password</label>
              <div className="login-password-wrapper">
                <input
                  onChange={(e) => setConfirmpassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  value={confirmpassword}
                  id="confirmpassword"
                  name="confirmpassword"
                  placeholder="at least 8 characters"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setPasswordVisible((v) => !v)}
                  aria-label="Show password"
                >
                  👁
                </button>
              </div>
              <a href="/forgot-password" className="login-forgot">Forgot Password?</a>
            </div>
            {/* Sign In Button */}
            <button type="submit" className="login-submit">Reset Password</button>
          </form>
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
  );
}

export default CreateNewPassword;
