// client/src/pages/Browse.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchUsers } from '../redux/slices/userSlice';
import { likeUser, unlikeUser } from '../redux/slices/matchSlice';
import { Link } from 'react-router-dom';
import { isPremium } from '../utils/helpers';
import './Browse.css'; // import modern CSS

const Browse = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.user);
  const { user: currentUser } = useSelector((state) => state.auth);
  const { likes } = useSelector((state) => state.match);

  const [filters, setFilters] = useState({
    ageMin: '',
    ageMax: '',
    gender: '',
    city: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers(filters));
  }, [dispatch, filters]);

  const handleLike = (userId) => {
    dispatch(likeUser(userId));
  };

  const handleUnlike = (userId) => {
    dispatch(unlikeUser(userId));
  };

  const isLiked = (userId) => {
    return likes.some((like) => like.targetUserId === userId);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    dispatch(fetchUsers(filters));
  };

  const resetFilters = () => {
    setFilters({ ageMin: '', ageMax: '', gender: '', city: '' });
    dispatch(fetchUsers({}));
  };

  return (
    <>
      <Helmet>
        <title>Browse Singles | Ruda Dating</title>
        <meta name="description" content="Browse through genuine singles in Kenya. Find your perfect match on Ruda Dating." />
      </Helmet>

      <div className="browse-page">
        <div className="browse-header">
          <h1>Browse Singles</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="filter-toggle"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'} 🔍
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filter-panel">
            <div className="filter-row">
              <div>
                <label>Min Age</label>
                <input
                  name="ageMin"
                  type="number"
                  value={filters.ageMin}
                  onChange={handleFilterChange}
                  placeholder="18"
                />
              </div>
              <div>
                <label>Max Age</label>
                <input
                  name="ageMax"
                  type="number"
                  value={filters.ageMax}
                  onChange={handleFilterChange}
                  placeholder="99"
                />
              </div>
              <div>
                <label>Gender</label>
                <select
                  name="gender"
                  value={filters.gender}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label>City</label>
                <input
                  name="city"
                  type="text"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder="Nairobi"
                />
              </div>
            </div>
            <div className="filter-actions">
              <button onClick={applyFilters} className="btn-apply">
                Apply Filters
              </button>
              <button onClick={resetFilters} className="btn-reset">
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <div className="icon">😕</div>
            <p>No users found matching your criteria.</p>
            <button onClick={resetFilters} className="empty-action">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="users-grid">
            {users.map((user) => (
              <div key={user._id} className="user-card">
                <Link to={`/profile/${user._id}`} className="photo-link">
                  <div className="photo">
                    {user.photos && user.photos.length > 0 ? (
                      <img src={user.photos[0]} alt={user.fullname} />
                    ) : (
                      '👤'
                    )}
                  </div>
                </Link>
                <div className="info">
                  <div className="name-row">
                    <Link to={`/profile/${user._id}`} className="name-link">
                      <h3>{user.fullname}, {user.age}</h3>
                    </Link>
                    {user.premium && <span className="premium-badge">⭐</span>}
                  </div>
                  <p className="location">{user.city || 'Kenya'}</p>
                  <div className="actions">
                    <button
                      onClick={() =>
                        isLiked(user._id) ? handleUnlike(user._id) : handleLike(user._id)
                      }
                      className={`btn-like ${isLiked(user._id) ? 'liked' : ''}`}
                    >
                      {isLiked(user._id) ? '❤️ Liked' : 'Like'}
                    </button>
                    {isPremium(currentUser) && (
                      <Link to={`/chat/${user._id}`} className="btn-chat">
                        💬 Chat
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Browse;