// client/src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // import modern CSS

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand & social */}
        <div className="footer-brand">
          <h3>Ruda Dating</h3>
          <p>Find love, friendship & relationships with genuine singles in Kenya.</p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">📱</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📸</a>
            <a href="#" aria-label="YouTube">▶️</a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/browse">Browse</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4>Support</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        {/* App stores */}
        <div>
          <h4>Get the App</h4>
          <p className="app-note">Coming soon to iOS and Android.</p>
          <div className="app-badges">
            <span className="badge">App Store</span>
            <span className="badge">Google Play</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {year} Ruda Dating. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;