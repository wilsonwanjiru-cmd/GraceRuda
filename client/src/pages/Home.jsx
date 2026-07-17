// client/src/pages/Home.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import './Home.css'; // import modern CSS

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Ruda Dating — Meet Singles in Kenya | Find Love & Relationships</title>
        <meta name="description" content="Join Ruda Dating and meet genuine singles in Kenya. Find love, friendship, and meaningful relationships. Free signup, real-time chat, and smart matching." />
        <meta property="og:title" content="Ruda Dating — Meet Singles in Kenya" />
        <meta property="og:description" content="Find love, friendship & relationships with genuine singles near you." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rudadating.com" />
      </Helmet>

      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h1>
            Meet Genuine Singles <br className="mobile-break" /> Near You
          </h1>
          <p>Find love, friendship & relationships with real people in Kenya.</p>
          <div className="btn-group">
            {isAuthenticated ? (
              <Link to="/browse" className="btn-primary-light">
                Browse Singles
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary-light">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn-outline-light">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-wave"></div>
      </section>

      {/* Search Bar */}
      <section className="home-search-section">
        <div className="home-search">
          <input type="text" placeholder="Search for singles near you..." />
          <button>Search</button>
        </div>
      </section>

      {/* Success Stories */}
      <section className="section-gray">
        <div className="container">
          <h2 className="section-title">Success Stories</h2>
          <div className="success-stories">
            {[
              { name: 'Sarah & James', story: 'Found each other on Ruda and now engaged!', location: 'Nairobi' },
              { name: 'Michael & Grace', story: 'Matched and have been together for 2 years.', location: 'Mombasa' },
              { name: 'David & Faith', story: 'Ruda brought us together. Getting married in June!', location: 'Kisumu' },
            ].map((story, i) => (
              <div key={i} className="story-card">
                <div className="avatar">💕</div>
                <h3>{story.name}</h3>
                <p className="location">{story.location}</p>
                <p className="quote">"{story.story}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Members */}
      <section className="section-white">
        <div className="container">
          <h2 className="section-title">Latest Members</h2>
          <div className="latest-members-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="member-card">
                <div className="photo">👤</div>
                <div className="info">
                  <p className="name">Member {i}</p>
                  <p className="city">Nairobi</p>
                </div>
              </div>
            ))}
          </div>
          <div className="view-all">
            <Link to="/browse">View all members →</Link>
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="section-gray">
        <div className="container">
          <h2 className="section-title">Premium Features</h2>
          <p className="section-subtitle">Upgrade to premium and unlock the full Ruda experience.</p>
          <div className="features-grid">
            {[
              { icon: '💬', title: 'Unlimited Messaging', desc: 'Chat with anyone, anytime. No daily limits.' },
              { icon: '👁️', title: 'See Who Liked You', desc: 'Know who\'s interested before you like back.' },
              { icon: '⭐', title: 'Priority Visibility', desc: 'Get featured and appear first in searches.' },
              { icon: '🔍', title: 'Advanced Filters', desc: 'Find exactly what you\'re looking for.' },
              { icon: '🚫', title: 'Ad-Free Experience', desc: 'Browse without interruptions.' },
              { icon: '📈', title: 'Profile Boost', desc: 'Get 10x more views with a 24h boost.' },
            ].map((feature, i) => (
              <div key={i} className="feature-item">
                <div className="icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
          <div className="cta-center">
            <Link to="/pricing" className="btn-primary">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-white">
        <div className="container">
          <h2 className="section-title">Simple Pricing</h2>
          <p className="section-subtitle">Choose the plan that works for you.</p>
          <div className="pricing-cards">
            {/* Free */}
            <div className="pricing-card">
              <h3>Free</h3>
              <p className="price">KES 0</p>
              <ul>
                <li>✓ Limited likes</li>
                <li>✓ Browse profiles</li>
                <li>✓ Basic filters</li>
                <li>✗ Unlimited messaging</li>
                <li>✗ See who liked you</li>
              </ul>
              <Link to="/register" className="btn-secondary">
                Get Started
              </Link>
            </div>

            {/* Premium (Popular) */}
            <div className="pricing-card popular">
              <h3>Premium</h3>
              <p className="price">KES 1,500 <span>/ month</span></p>
              <ul>
                <li>✓ Unlimited messaging</li>
                <li>✓ See who liked you</li>
                <li>✓ Priority visibility</li>
                <li>✓ Advanced filters</li>
                <li>✓ No ads</li>
              </ul>
              <Link to="/pricing" className="btn-primary">
                Upgrade Now
              </Link>
            </div>

            {/* Pay Per Chat */}
            <div className="pricing-card">
              <h3>Pay Per Chat</h3>
              <p className="price">KES 50</p>
              <p className="credits-note">50 credits</p>
              <ul>
                <li>✓ 50 chat credits</li>
                <li>✓ 1 credit = 1 message</li>
                <li>✓ No expiry</li>
                <li>✓ Best for casual users</li>
              </ul>
              <button className="btn-secondary">Buy Credits</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-gray">
        <div className="container faq-container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {[
              { q: 'Is Ruda Dating free?', a: 'Yes! You can register, create a profile, browse members, and send limited likes for free. Premium features are available with a subscription.' },
              { q: 'How does the matching work?', a: 'When you like someone and they like you back, it\'s a match! You can then start chatting with them.' },
              { q: 'How do I pay for premium?', a: 'We accept M-PESA for Kenyan users and PayPal for international payments.' },
              { q: 'Is my data safe?', a: 'Absolutely. We use SSL encryption, secure password hashing, and never share your data with third parties.' },
            ].map((faq, i) => (
              <div key={i} className="faq-item">
                <h4>{faq.q}</h4>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;