import React, { useState, useEffect } from 'react'
import actionWebInvoke from '../utils'
import config from '../config.json'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('login')

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [message, setMessage] = useState('')

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      navigate('/products')
    }
  }, [navigate])

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  }

  function validateSignup() {
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }

    let valid = true

    if (!username.trim()) {
      newErrors.username = 'Username is required'
      valid = false
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
      valid = false
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
      valid = false
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required'
      valid = false
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required'
      valid = false
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
      valid = false
    }

    setErrors(newErrors)

    return valid
  }
  async function handleSignup() {
    setMessage('')

    setErrors({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    if (!validateSignup()) {
      return
    }

    try {
      const result = await actionWebInvoke(
        config['New folder/signup'],
        {},
        {
          username,
          email,
          password
        }
      )

      const responseBody = result?.body || result

      if (responseBody.success) {
        localStorage.setItem('username', username)

        setMessage('Registration Successful')

        setUsername('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')

        setActiveTab('login')
      } else {
        setMessage(responseBody.message || 'Registration failed')
      }
    } catch (error) {
      setMessage(error.message)
    }
  }

  async function handleLogin() {
    setMessage('')

    const loginErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }

    if (!email.trim()) {
      loginErrors.email = 'Email is required'
    } else if (!isValidEmail(email)) {
      loginErrors.email = 'Please enter a valid email address'
    }

    if (!password.trim()) {
      loginErrors.password = 'Password is required'
    }

    if (loginErrors.email || loginErrors.password) {
      setErrors(loginErrors)
      return
    }

    setErrors({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    try {
      const result = await actionWebInvoke(
        config['New folder/login'],
        {},
        {
          email,
          password
        }
      )

      const responseBody = result?.body || result

      if (responseBody.success) {
        localStorage.setItem('token', responseBody.token)

        localStorage.setItem('username', responseBody.username || username || email.split('@')[0])

        navigate('/products')
      } else {
        setMessage(responseBody.message || 'Login failed')
      }
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Secure E-Commerce</h1>

        <div className="tab-container">
          <button className={`tab-button ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>
            Login
          </button>

          <button className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => setActiveTab('signup')}>
            Signup
          </button>
        </div>

        {message && <div className="message-box">{message}</div>}

        {activeTab === 'login' && (
          <div className="form-section">
            <h2>Welcome Back</h2>

            <input className={`auth-input ${errors.email ? 'error-input' : ''}`} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

            {errors.email && <div className="field-error">{errors.email}</div>}

            <input className={`auth-input ${errors.password ? 'error-input' : ''}`} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

            {errors.password && <div className="field-error">{errors.password}</div>}

            <button className="primary-btn" onClick={handleLogin}>
              Login
            </button>
          </div>
        )}

        {activeTab === 'signup' && (
          <div className="form-section">
            <h2>Create Account</h2>

            <input className={`auth-input ${errors.username ? 'error-input' : ''}`} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />

            {errors.username && <div className="field-error">{errors.username}</div>}

            <input className={`auth-input ${errors.email ? 'error-input' : ''}`} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

            {errors.email && <div className="field-error">{errors.email}</div>}

            <input className={`auth-input ${errors.password ? 'error-input' : ''}`} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

            {errors.password && <div className="field-error">{errors.password}</div>}

            <input
              className={`auth-input ${errors.confirmPassword ? 'error-input' : ''}`}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}

            <button className="primary-btn" onClick={handleSignup}>
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
