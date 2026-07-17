// client/src/pages/Pricing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import './Pricing.css'; // import modern CSS

const Pricing = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      <Helmet>
        <title>Pricing | Ruda Dating</title>
        <meta name="description" content="Choose the perfect plan for your dating journey. Premium plans start at KES 1,500/month." />
      </Helmet>

      <div className="pricing-page">
        <div className="pricing-header">
          <h1>Choose Your Plan</h1>
          <p>
            Upgrade to premium and unlock the full Ruda experience. Find love faster with unlimited messaging and priority visibility.
          </p>
        </div>

        <div className="pricing-grid">
          {/* Free Plan */}
          <div className="pricing-plan">
            <h3 className="plan-name">Free</h3>
            <p className="price">KES 0</p>
            <p className="plan-subtitle">Forever free</p>
            <ul className="feature-list">
              <li className="included">✓ Register &amp; create profile</li>
              <li className="included">✓ Upload photos</li>
              <li className="included">✓ Browse profiles</li>
              <li className="included">✓ Send limited likes (5/day)</li>
              <li className="excluded">✗ Unlimited messaging</li>
              <li className="excluded">✗ See who liked you</li>
              <li className="excluded">✗ Priority visibility</li>
              <li className="excluded">✗ No ads</li>
            </ul>
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="btn-plan free"
            >
              {isAuthenticated ? 'Current Plan' : 'Get Started'}
            </Link>
          </div>

          {/* Premium Plan (Popular) */}
          <div className="pricing-plan popular">
            <span className="popular-badge">BEST VALUE</span>
            <h3 className="plan-name">Premium</h3>
            <p className="price">KES 1,500 <span>/ month</span></p>
            <ul className="feature-list">
              <li className="included">✓ All Free features</li>
              <li className="included">✓ Unlimited messaging</li>
              <li className="included">✓ See who liked you</li>
              <li className="included">✓ Priority profile visibility</li>
              <li className="included">✓ Advanced filters</li>
              <li className="included">✓ No ads</li>
              <li className="included">✓ Profile boost available</li>
              <li className="included">✓ Cancel anytime</li>
            </ul>
            <button className="btn-plan premium">
              Upgrade Now
            </button>
            <p className="payment-note">M-PESA &amp; PayPal accepted</p>
          </div>

          {/* Pay Per Chat */}
          <div className="pricing-plan">
            <h3 className="plan-name">Pay Per Chat</h3>
            <p className="price">KES 50</p>
            <p className="plan-subtitle">50 chat credits</p>
            <ul className="feature-list">
              <li className="included">✓ 50 chat credits</li>
              <li className="included">✓ 1 credit = 1 message</li>
              <li className="included">✓ No expiry date</li>
              <li className="included">✓ Best for casual users</li>
              <li className="excluded">✗ No premium features</li>
              <li className="excluded">✗ No priority visibility</li>
            </ul>
            <button className="btn-plan credits">
              Buy Credits
            </button>
          </div>
        </div>

        <div className="pricing-footer">
          <p>
            All prices are in Kenyan Shillings (KES). M-PESA and PayPal accepted.
          </p>
          <p>
            By purchasing, you agree to our{' '}
            <Link to="/terms">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy-policy">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Pricing;