// client/src/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchMatches } from '../redux/slices/matchSlice';
import './Dashboard.css'; // import modern CSS

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { matches, likes, likedBy } = useSelector((state) => state.match);

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  const matchCount = matches.length;
  const likeCount = likes.length;
  const likedByCount = likedBy.length;

  // Helper to get the other user in a match (if match has user1/user2)
  const getMatchPartner = (match) => {
    if (!match.user1 || !match.user2) return match.user; // fallback for old structure
    if (match.user1._id === user?._id) return match.user2;
    return match.user1;
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | Ruda Dating</title>
        <meta name="description" content="Your Ruda Dating dashboard – view matches, likes, and activity." />
      </Helmet>

      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.fullname?.split(' ')[0] || 'User'}! 👋</h1>
            <p className="subtitle">Here's what's happening on your profile.</p>
          </div>
          <Link to="/edit-profile" className="btn-edit">Edit Profile</Link>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="number">{matchCount}</div>
            <div className="label">Matches</div>
          </div>
          <div className="stat-card">
            <div className="number" style={{ color: '#3b82f6' }}>{likeCount}</div>
            <div className="label">People You Liked</div>
          </div>
          <div className="stat-card">
            <div className="number" style={{ color: '#22c55e' }}>{likedByCount}</div>
            <div className="label">Liked You</div>
          </div>
          <div className="stat-card">
            <div className="number" style={{ color: '#f59e0b' }}>
              {user?.premium ? '⭐' : 'Free'}
            </div>
            <div className="label">Plan</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/browse" className="quick-action action-browse">
            <div className="icon">👥</div>
            <h3>Browse Singles</h3>
            <p>Find your perfect match</p>
          </Link>
          <Link to="/matches" className="quick-action action-matches">
            <div className="icon">💕</div>
            <h3>Your Matches</h3>
            <p>{matchCount} matches waiting</p>
          </Link>
          <Link to="/pricing" className="quick-action action-premium">
            <div className="icon">⭐</div>
            <h3>Upgrade Premium</h3>
            <p>Unlock all features</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="activity-list">
          <h2>Recent Activity</h2>
          {matchCount === 0 && likeCount === 0 ? (
            <div className="empty-activity">
              <div className="icon">😊</div>
              <p>No activity yet. Start browsing and liking profiles!</p>
              <Link to="/browse" className="empty-link">Browse Singles →</Link>
            </div>
          ) : (
            <div className="activity-items">
              {matches.slice(0, 5).map((match) => {
                const partner = getMatchPartner(match);
                return (
                  <div key={match._id} className="activity-item">
                    <div className="left">
                      <div className="avatar">👤</div>
                      <div>
                        <p className="activity-title">New match!</p>
                        <p className="activity-desc">
                          You matched with {partner?.fullname || 'someone'}
                        </p>
                      </div>
                    </div>
                    <Link to={`/chat/${partner?._id}`} className="chat-link">
                      Chat
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;