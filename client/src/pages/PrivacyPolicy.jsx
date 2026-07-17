// client/src/pages/PrivacyPolicy.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import './PrivacyPolicy.css'; // import modern CSS

const PrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Helmet>
        <title>Privacy Policy | Ruda Dating</title>
        <meta name="description" content="Read Ruda Dating's privacy policy to understand how we collect, use, and protect your personal information." />
      </Helmet>

      <div className="privacy-page">
        <h1>Privacy Policy</h1>
        <p className="last-updated"><strong>Last updated:</strong> {currentDate}</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Ruda Dating ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <ul>
            <li><strong>Personal Information:</strong> Name, email, phone number, age, gender, location, and profile details.</li>
            <li><strong>Usage Data:</strong> How you interact with our platform, including likes, matches, and messages.</li>
            <li><strong>Device Information:</strong> IP address, browser type, and device identifiers.</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To provide and improve our services.</li>
            <li>To match you with compatible partners.</li>
            <li>To send you relevant notifications and updates.</li>
            <li>To process payments and subscriptions.</li>
            <li>To ensure platform safety and prevent fraud.</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>
            We implement industry-standard security measures including SSL encryption, secure password hashing, and regular security audits to protect your data.
          </p>
        </section>

        <section>
          <h2>5. Third-Party Services</h2>
          <p>
            We use trusted third-party services for payments (M-PESA, PayPal), cloud storage (Cloudinary), and analytics. These services have their own privacy policies.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <ul>
            <li>Access, update, or delete your personal information.</li>
            <li>Opt-out of marketing communications.</li>
            <li>Request a copy of your data.</li>
          </ul>
        </section>

        <section>
          <h2>7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@rudadating.com">privacy@rudadating.com</a>.</p>
        </section>
      </div>
    </>
  );
};

export default PrivacyPolicy;