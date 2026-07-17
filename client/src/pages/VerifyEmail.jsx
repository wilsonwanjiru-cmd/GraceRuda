// client/src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail, clearError, clearSuccess } from '../redux/slices/authSlice';
import { Helmet } from 'react-helmet-async';
import './VerifyEmail.css'; // import modern CSS

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { isLoading, error, success, isAuthenticated } = useSelector((state) => state.auth);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token)).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setVerified(true);
          setTimeout(() => navigate('/login'), 3000);
        }
      });
    }
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch, token, navigate]);

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Verify Email | Ruda Dating</title>
        <meta name="description" content="Verify your email address to activate your Ruda Dating account." />
      </Helmet>

      <div className="verify-email-page">
        <div className="verify-card">
          {isLoading ? (
            <div className="status-loading">
              <div className="spinner"></div>
              <p>Verifying your email...</p>
            </div>
          ) : error ? (
            <div className="status-error">
              <div className="icon">❌</div>
              <h2>Verification Failed</h2>
              <p>{error}</p>
              <Link to="/login" className="btn-back">Back to Login</Link>
            </div>
          ) : verified || success ? (
            <div className="status-success">
              <div className="icon">✅</div>
              <h2>Email Verified!</h2>
              <p>Your email has been verified successfully. You can now log in.</p>
              <Link to="/login" className="btn-primary">Sign In</Link>
            </div>
          ) : (
            <div className="status-pending">
              <div className="icon">📧</div>
              <h2>Verify Your Email</h2>
              <p>Please check your email for the verification link.</p>
              <p className="hint">Didn't receive the email? Check your spam folder or try again.</p>
              <Link to="/login" className="btn-back">Back to Login</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;