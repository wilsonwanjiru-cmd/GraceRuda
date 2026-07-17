// client/src/pages/About.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import './About.css'; // import modern CSS

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Ruda Dating</title>
        <meta name="description" content="Learn about Ruda Dating — our mission to help Kenyan singles find love and meaningful relationships." />
      </Helmet>

      <div className="about-page">
        <h1 className="gradient-text">About Ruda Dating</h1>
        <div className="about-content">
          <p className="lead">
            Ruda Dating is Kenya's premier online dating platform dedicated to helping singles find love, friendship, and meaningful relationships.
          </p>

          <section>
            <h2>Our Mission</h2>
            <p>
              We believe everyone deserves to find genuine connections. Our mission is to create a safe, inclusive, and effective platform where Kenyan singles can meet and build lasting relationships.
            </p>
          </section>

          <section className="highlight-box">
            <h2>Why Ruda?</h2>
            <ul className="feature-list">
              <li><strong>Made for Kenyans:</strong> We understand the local dating scene and culture.</li>
              <li><strong>Safe &amp; Secure:</strong> Your privacy and safety are our top priorities.</li>
              <li><strong>Smart Matching:</strong> Our algorithm helps you find compatible partners.</li>
              <li><strong>Real People:</strong> We verify profiles to ensure genuine connections.</li>
            </ul>
          </section>

          <section>
            <h2>Our Values</h2>
            <ul className="value-list">
              <li><strong>Integrity:</strong> We operate with honesty and transparency.</li>
              <li><strong>Inclusivity:</strong> Everyone is welcome on Ruda Dating.</li>
              <li><strong>Excellence:</strong> We constantly improve our platform.</li>
              <li><strong>Community:</strong> We foster a positive and supportive community.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};

export default About;