// client/src/pages/Blog.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './Blog.css'; // import modern CSS

const blogPosts = [
  {
    slug: 'dating-tips-kenya',
    title: 'Dating Tips in Kenya: Find Love the Right Way',
    excerpt: 'Discover the best dating tips for Kenyan singles. From first dates to building lasting relationships.',
    date: '2025-01-15',
    category: 'Dating Tips',
    author: 'Ruda Team',
  },
  {
    slug: 'serious-relationships',
    title: 'How to Find Serious Relationships in Kenya',
    excerpt: 'Looking for a serious relationship? Here\'s how to navigate the Kenyan dating scene and find true love.',
    date: '2025-01-10',
    category: 'Relationships',
    author: 'Ruda Team',
  },
  {
    slug: 'first-date-ideas',
    title: 'Best First Date Ideas in Nairobi & Beyond',
    excerpt: 'Planning a first date? Check out these amazing date ideas in Nairobi, Mombasa, Kisumu, and more.',
    date: '2025-01-05',
    category: 'Date Ideas',
    author: 'Ruda Team',
  },
  {
    slug: 'online-dating-safety',
    title: 'Online Dating Safety Tips for Kenyans',
    excerpt: 'Stay safe while dating online. Learn how to protect yourself and spot red flags early.',
    date: '2024-12-28',
    category: 'Safety',
    author: 'Ruda Team',
  },
];

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Blog | Ruda Dating — Dating Tips & Advice</title>
        <meta name="description" content="Expert dating tips, relationship advice, and first date ideas for Kenyan singles. Read the Ruda Dating blog." />
      </Helmet>

      <div className="blog-page">
        <div className="blog-header">
          <h1>Ruda Dating Blog</h1>
          <p>Dating tips, relationship advice, and stories from the Kenyan dating scene.</p>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.slug} className="blog-card">
              <div className="content">
                <div className="meta">
                  <span className="category">{post.category}</span>
                  <span className="separator">•</span>
                  <span className="date">{new Date(post.date).toLocaleDateString('en-KE')}</span>
                </div>
                <h2>
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="excerpt">{post.excerpt}</p>
                <div className="footer">
                  <span className="author">By {post.author}</span>
                  <Link to={`/blog/${post.slug}`} className="read-more">
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
};

export default Blog;