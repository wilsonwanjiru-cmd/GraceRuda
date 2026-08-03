// client/src/App.jsx
// client/src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/slices/authSlice';
import { addNotification } from './redux/slices/notificationSlice'; // 👈 new
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

// Global layout styles
import './App.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Browse from './pages/Browse';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { initSocket, disconnectSocket, getSocket } from './services/socket'; // 👈 added getSocket
import { trackPageView } from './utils/analytics';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Load user on mount
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // Socket connection
  useEffect(() => {
    if (isAuthenticated && user) {
      initSocket(user._id);
    } else {
      disconnectSocket();
    }
    return () => disconnectSocket();
  }, [isAuthenticated, user]);

  // 👇 Listen for real‑time notifications
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNotification = (data) => {
      dispatch(addNotification(data));
      // Optional: show a toast notification
      console.log('🔔 New notification:', data);
    };

    socket.on('new-notification', handleNotification);

    return () => {
      socket.off('new-notification', handleNotification);
    };
  }, [dispatch, isAuthenticated]); // re-run when auth changes (socket reconnects)

  // Track page views
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, [window.location.pathname]);

  return (
    <>
      <Helmet>
        <title>Ruda Dating — Meet Singles in Kenya</title>
        <meta name="description" content="Meet genuine singles in Kenya. Chat, match and connect with real people near you." />
        <link rel="canonical" href="https://rudadating.com" />
      </Helmet>

      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />

            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile/:id?" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/chat/:userId?" element={<Chat />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;