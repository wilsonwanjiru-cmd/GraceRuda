// client/src/pages/Matches.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchMatches } from '../redux/slices/matchSlice';
import './Matches.css'; // import modern CSS

const Matches = () => {
  const dispatch = useDispatch();
  const { matches, isLoading } = useSelector((state) => state.match);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  // Helper to get the other user in a match
  const getMatchPartner = (match) => {
    if (!match.user1 || !match.user2) return null;
    if (match.user1._id === currentUser?._id) {
      return match.user2;
    }
    return match.user1;
  };

  return (
    <>
      <Helmet>
        <title>Your Matches | Ruda Dating</title>
        <meta name="description" content="See all your matches on Ruda Dating. Connect with people who liked you back." />
      </Helmet>

      <div className="matches-page">
        <h1>Your Matches 💕</h1>

        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : matches.length === 0 ? (
          <div className="empty-state">
            <div className="icon">😔</div>
            <h2>No matches yet</h2>
            <p>Keep liking profiles to find your perfect match!</p>
            <Link to="/browse" className="btn-empty">Browse Singles</Link>
          </div>
        ) : (
          <div className="matches-grid">
            {matches.map((match) => {
              const partner = getMatchPartner(match);
              if (!partner) return null;

              return (
                <div key={match._id} className="match-card">
                  <Link to={`/profile/${partner._id}`} className="photo-link">
                    <div className="photo">
                      {partner.photos && partner.photos.length > 0 ? (
                        <img src={partner.photos[0]} alt={partner.fullname} />
                      ) : (
                        '👤'
                      )}
                    </div>
                  </Link>
                  <div className="info">
                    <Link to={`/profile/${partner._id}`} className="name-link">
                      <h3>{partner.fullname}, {partner.age}</h3>
                    </Link>
                    <p>{partner.city || 'Kenya'}</p>
                  </div>
                  <div className="actions">
                    <Link to={`/chat/${partner._id}`} className="btn-chat">
                      💬 Chat
                    </Link>
                    <Link to={`/profile/${partner._id}`} className="btn-view">
                      View
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Matches;