// client/src/components/Navbar.jsx
// client/src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import NotificationBadge from './NotificationBadge'; // 👈 new import
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        Ruda<span>Dating</span>
      </Link>

      {/* Desktop links */}
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/browse">Browse</Link></li>
        {isAuthenticated && (
          <>
            <li><Link to="/matches">Matches</Link></li>
            <li>
              <Link to="/chat">
                Chat
                <NotificationBadge /> {/* 👈 badge next to Chat */}
              </Link>
            </li>
          </>
        )}
        <li><Link to="/pricing">Pricing</Link></li>
        <li><Link to="/blog">Blog</Link></li>
      </ul>

      {/* Desktop actions */}
      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="navbar-avatar">
              {user?.fullname?.charAt(0) || 'U'}
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/register" className="btn-primary-small">Join Free</Link>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Mobile menu dropdown */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link to="/browse" onClick={() => setIsMenuOpen(false)}>Browse</Link>
        {isAuthenticated && (
          <>
            <Link to="/matches" onClick={() => setIsMenuOpen(false)}>Matches</Link>
            <Link to="/chat" onClick={() => setIsMenuOpen(false)}>
              Chat
              <NotificationBadge /> {/* 👈 badge in mobile menu */}
            </Link>
          </>
        )}
        <Link to="/pricing" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
        <Link to="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            <button onClick={handleLogout} className="mobile-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
            <Link to="/register" className="mobile-join" onClick={() => setIsMenuOpen(false)}>Join Free</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;