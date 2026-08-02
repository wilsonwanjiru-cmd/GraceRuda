// client/src/pages/Login.jsx
// client/src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError, clearSuccess } from '../redux/slices/authSlice';
import { Helmet } from 'react-helmet-async';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/browse'); // 🔥 changed from '/dashboard' to '/browse'
    }
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <>
      <Helmet>
        <title>Login | Ruda Dating</title>
        <meta name="description" content="Sign in to your Ruda Dating account and continue your journey to find love in Kenya." />
      </Helmet>

      <div className="login-page">
        <div className="login-card">
          <h1>Welcome Back</h1>
          <p className="subtitle">Sign in to continue your journey</p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="forgot-link">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button
              type="submit"
              className="btn-login"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="signup-link">
            Don't have an account?{' '}
            <Link to="/register">Sign up free</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;