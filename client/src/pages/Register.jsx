// client/src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError, clearSuccess } from '../redux/slices/authSlice';
import { Helmet } from 'react-helmet-async';
import { trackSignup } from '../utils/analytics';
import './Register.css'; // import modern CSS

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    lookingFor: '',
    age: '',
    country: 'Kenya',
  });

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
      setPasswordError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    const { confirmPassword, ...data } = formData;
    dispatch(register(data)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        trackSignup({ email: data.email, gender: data.gender });
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>Join Ruda Dating — Free Signup</title>
        <meta name="description" content="Create your free account on Ruda Dating and start meeting genuine singles in Kenya today." />
      </Helmet>

      <div className="register-page">
        <div className="register-card">
          <h1>Join Ruda Dating</h1>
          <p className="subtitle">Start your journey to find love</p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          {passwordError && <div className="error-message">{passwordError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                required
                value={formData.fullname}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="lookingFor">Looking For</label>
                <select
                  id="lookingFor"
                  name="lookingFor"
                  required
                  value={formData.lookingFor}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                required
                min="18"
                max="99"
                value={formData.age}
                onChange={handleChange}
                placeholder="25"
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                id="country"
                name="country"
                type="text"
                required
                value={formData.country}
                onChange={handleChange}
                placeholder="Kenya"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
            </div>

            <button type="submit" className="btn-register" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="terms">
            By signing up, you agree to our{' '}
            <Link to="/terms">Terms</Link> and{' '}
            <Link to="/privacy-policy">Privacy Policy</Link>
          </p>

          <p className="login-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;