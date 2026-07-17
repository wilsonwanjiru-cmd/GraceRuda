// client/src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './NotFound.css'; // import modern CSS

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Ruda Dating</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to the Ruda Dating homepage." />
      </Helmet>

      <div className="not-found">
        <div className="not-found-content">
          <div className="icon">😅</div>
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <Link to="/" className="btn-home">Go Home</Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;