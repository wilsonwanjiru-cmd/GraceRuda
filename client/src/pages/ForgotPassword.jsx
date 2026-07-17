// client/src/pages/ForgotPassword.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearError, clearSuccess } from '../redux/slices/authSlice';
import { Helmet } from 'react-helmet-async';
import './ForgotPassword.css'; // import modern CSS

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { isLoading, error, success } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Clear old messages on mount
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email)).then(() => {
      setSubmitted(true);
    });
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | Ruda Dating</title>
        <meta name="description" content="Reset your Ruda Dating password. Enter your email to receive a password reset link." />
      </Helmet>

      <div className="forgot-password-page">
        <div className="forgot-password-card">
          <h1>Forgot Password</h1>
          <p className="subtitle">
            Enter your email address and we'll send you a password reset link.
          </p>

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

          {!submitted ? (
            <form onSubmit={handleSubmit} className="forgot-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                className="btn-submit"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="success-state">
              <div className="icon">📨</div>
              <p>
                If an account exists with that email, we've sent a password reset link.
              </p>
              <Link to="/login" className="back-link">Back to Login</Link>
            </div>
          )}

          <p className="login-link">
            Remember your password?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;