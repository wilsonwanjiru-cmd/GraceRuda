// client/src/pages/Contact.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './Contact.css'; // import modern CSS

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, send to backend
    console.log('Contact form:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Ruda Dating</title>
        <meta name="description" content="Get in touch with the Ruda Dating team. We're here to help with any questions or feedback." />
      </Helmet>

      <div className="contact-page">
        <h1>Contact Us</h1>
        <p className="subtitle">Have a question or feedback? We'd love to hear from you.</p>

        {submitted ? (
          <div className="success-message">
            <p className="success-title">Thank you! 🎉</p>
            <p>Your message has been sent. We'll get back to you within 24 hours.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="send-another"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
              />
            </div>
            <button type="submit" className="btn-submit">
              Send Message
            </button>
          </form>
        )}

        <div className="contact-info-grid">
          <div className="contact-info-item">
            <h4>📍 Location</h4>
            <p>Nairobi, Kenya</p>
          </div>
          <div className="contact-info-item">
            <h4>📧 Email</h4>
            <p>support@rudadating.com</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;