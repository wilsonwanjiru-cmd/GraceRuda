// client/src/pages/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearError, clearSuccess } from '../redux/slices/authSlice';
import { Helmet } from 'react-helmet-async';
import './ResetPassword.css'; // import modern CSS

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, success } = useSelector((state) => state.auth);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordError('');
    dispatch(resetPassword({ token, password })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setTimeout(() => navigate('/login'), 3000);
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>Reset Password | Ruda Dating</title>
        <meta name="description" content="Set a new password for your Ruda Dating account." />
      </Helmet>

      <div className="reset-password-page">
        <div className="reset-password-card">
          <h1>Reset Password</h1>
          <p className="subtitle">Enter your new password below.</p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          {passwordError && <div className="error-message">{passwordError}</div>}

          {!success ? (
            <form onSubmit={handleSubmit} className="reset-form">
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min 6 characters"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                />
              </div>
              <button type="submit" className="btn-submit" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          ) : (
            <div className="success-state">
              <div className="icon">✅</div>
              <p>Password reset successful! Redirecting to login...</p>
              <Link to="/login" className="back-link">Sign In</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;