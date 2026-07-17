// client/src/pages/Terms.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import './Terms.css'; // import modern CSS

const Terms = () => {
  const currentDate = new Date().toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Helmet>
        <title>Terms of Service | Ruda Dating</title>
        <meta name="description" content="Read Ruda Dating's Terms of Service. Learn about our policies, user conduct, and subscription terms." />
      </Helmet>

      <div className="terms-page">
        <h1>Terms of Service</h1>
        <p className="last-updated"><strong>Last updated:</strong> {currentDate}</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By using Ruda Dating, you agree to these Terms of Service. If you do not agree, please do not use our platform.
          </p>
        </section>

        <section>
          <h2>2. Eligibility</h2>
          <p>
            You must be at least 18 years old to use Ruda Dating. By registering, you confirm that you are 18 or older.
          </p>
        </section>

        <section>
          <h2>3. User Accounts</h2>
          <ul>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You agree to provide accurate and truthful information.</li>
            <li>You may not create multiple accounts or impersonate others.</li>
          </ul>
        </section>

        <section>
          <h2>4. User Conduct</h2>
          <p>You agree to:</p>
          <ul>
            <li>Treat other users with respect and kindness.</li>
            <li>Not engage in harassment, abuse, or hate speech.</li>
            <li>Not share inappropriate or offensive content.</li>
            <li>Not use the platform for commercial purposes without permission.</li>
          </ul>
        </section>

        <section>
          <h2>5. Premium Subscriptions</h2>
          <ul>
            <li>Premium subscriptions are billed monthly.</li>
            <li>You may cancel anytime before the next billing cycle.</li>
            <li>Refunds are handled on a case-by-case basis.</li>
            <li>Payments are processed securely via M-PESA or PayPal.</li>
          </ul>
        </section>

        <section>
          <h2>6. Content Ownership</h2>
          <p>
            You retain ownership of the content you post. By posting, you grant Ruda Dating a license to use, display, and distribute your content on our platform.
          </p>
        </section>

        <section>
          <h2>7. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate these terms or engage in harmful behavior.
          </p>
        </section>

        <section>
          <h2>8. Disclaimer</h2>
          <p>
            Ruda Dating is provided "as is". We do not guarantee that you will find a match or that interactions will lead to successful relationships.
          </p>
        </section>

        <section>
          <h2>9. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the platform constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p>For questions about these Terms, contact us at <a href="mailto:legal@rudadating.com">legal@rudadating.com</a>.</p>
        </section>
      </div>
    </>
  );
};

export default Terms;