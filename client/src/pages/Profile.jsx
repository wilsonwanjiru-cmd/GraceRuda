// client/src/pages/Profile.jsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchUserById, clearProfileUser } from '../redux/slices/userSlice';
import { likeUser, unlikeUser } from '../redux/slices/matchSlice';
import { isPremium } from '../utils/helpers';
import './Profile.css'; // import modern CSS

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { profileUser, isLoading } = useSelector((state) => state.user);
  const { user: currentUser } = useSelector((state) => state.auth);
  const { likes } = useSelector((state) => state.match);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
    return () => {
      dispatch(clearProfileUser());
    };
  }, [dispatch, id]);

  const isLiked = profileUser ? likes.some((like) => like.targetUserId === profileUser._id) : false;

  const handleLike = () => {
    if (profileUser) {
      dispatch(likeUser(profileUser._id));
    }
  };

  const handleUnlike = () => {
    if (profileUser) {
      dispatch(unlikeUser(profileUser._id));
    }
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="profile-not-found">
        <h2>User not found</h2>
        <Link to="/browse" className="browse-link">Browse singles</Link>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === profileUser._id;

  return (
    <>
      <Helmet>
        <title>{profileUser.fullname} | Ruda Dating</title>
        <meta name="description" content={`View ${profileUser.fullname}'s profile on Ruda Dating.`} />
      </Helmet>

      <div className="profile-page">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-cover"></div>
          <div className="profile-info">
            <div className="profile-avatar">
              {profileUser.photos && profileUser.photos.length > 0 ? (
                <img src={profileUser.photos[0]} alt={profileUser.fullname} />
              ) : (
                '👤'
              )}
            </div>
            <div className="profile-name">
              <h1>{profileUser.fullname}, {profileUser.age}</h1>
              <p>{profileUser.city || 'Kenya'} • {profileUser.gender}</p>
              {profileUser.premium && (
                <span className="premium-badge">⭐ Premium</span>
              )}
            </div>
            <div className="profile-actions">
              {!isOwnProfile ? (
                <>
                  <button
                    onClick={isLiked ? handleUnlike : handleLike}
                    className={`btn-like ${isLiked ? 'liked' : ''}`}
                  >
                    {isLiked ? '❤️ Liked' : 'Like'}
                  </button>
                  {isPremium(currentUser) && (
                    <Link to={`/chat/${profileUser._id}`} className="btn-chat">
                      💬 Chat
                    </Link>
                  )}
                </>
              ) : (
                <Link to="/edit-profile" className="btn-edit">Edit Profile</Link>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          <div className="detail-card">
            <h2>About</h2>
            <p className="bio">{profileUser.bio || 'No bio yet.'}</p>
            <div className="detail-items">
              <div className="detail-item">
                <span className="label">Occupation</span>
                <span className="value">{profileUser.occupation || 'Not specified'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Education</span>
                <span className="value">{profileUser.education || 'Not specified'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Religion</span>
                <span className="value">{profileUser.religion || 'Not specified'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Smoking</span>
                <span className="value">{profileUser.smoking || 'Prefer not to say'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Drinking</span>
                <span className="value">{profileUser.drinking || 'Prefer not to say'}</span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h2>Photos</h2>
            {profileUser.photos && profileUser.photos.length > 0 ? (
              <div className="photo-grid">
                {profileUser.photos.map((photo, i) => (
                  <div key={i} className="photo-item">
                    <img src={photo} alt={`Photo ${i + 1}`} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-photos">No photos uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;