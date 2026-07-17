// client/src/pages/BlogPost.jsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './BlogPost.css'; // import modern CSS

const blogData = {
  'dating-tips-kenya': {
    title: 'Dating Tips in Kenya: Find Love the Right Way',
    content: `
      <p>Dating in Kenya can be exciting and challenging. Here are some tips to help you navigate the scene and find genuine connections.</p>
      <h2>1. Be Authentic</h2>
      <p>Kenyan singles appreciate authenticity. Be yourself, share your true interests, and don't pretend to be someone you're not.</p>
      <h2>2. Respect Cultural Values</h2>
      <p>Kenya has diverse cultures and traditions. Take time to learn about your partner's background and show respect for their values.</p>
      <h2>3. Use Technology Wisely</h2>
      <p>Online dating platforms like Ruda Dating make it easier to connect. Use them to meet new people while staying safe.</p>
      <h2>4. Plan Great Dates</h2>
      <p>From sunset views in Nairobi to beach walks in Mombasa, Kenya offers amazing date spots. Get creative!</p>
      <h2>5. Communicate Openly</h2>
      <p>Good communication is key to any relationship. Be honest about your intentions and feelings.</p>
    `,
    date: '2025-01-15',
    category: 'Dating Tips',
    author: 'Ruda Team',
  },
  'serious-relationships': {
    title: 'How to Find Serious Relationships in Kenya',
    content: `
      <p>Are you ready for a serious relationship? Here's how to find lasting love in Kenya.</p>
      <h2>1. Know What You Want</h2>
      <p>Be clear about your relationship goals. Are you looking for marriage, a long-term partnership, or something else?</p>
      <h2>2. Choose the Right Platform</h2>
      <p>Not all dating apps are for serious relationships. Ruda Dating is designed for genuine connections.</p>
      <h2>3. Take Time to Get to Know Someone</h2>
      <p>Don't rush. Spend time getting to know your partner before committing.</p>
      <h2>4. Look for Shared Values</h2>
      <p>Compatibility goes beyond looks. Shared values and life goals are essential for a lasting relationship.</p>
    `,
    date: '2025-01-10',
    category: 'Relationships',
    author: 'Ruda Team',
  },
  'first-date-ideas': {
    title: 'Best First Date Ideas in Nairobi & Beyond',
    content: `
      <p>Planning a first date? Here are some amazing ideas in Kenya.</p>
      <h2>Nairobi</h2>
      <ul>
        <li>Sunset dinner at a rooftop restaurant</li>
        <li>Walk through Karura Forest</li>
        <li>Coffee at a local café in Westlands</li>
        <li>Visit the Nairobi National Museum</li>
      </ul>
      <h2>Mombasa</h2>
      <ul>
        <li>Beach walk at Diani</li>
        <li>Fort Jesus tour</li>
        <li>Seafood dinner at a beachfront restaurant</li>
      </ul>
      <h2>Kisumu</h2>
      <ul>
        <li>Boat ride on Lake Victoria</li>
        <li>Visit the Impala Sanctuary</li>
        <li>Sunset at Dunga Hill</li>
      </ul>
      <p>Whatever you choose, remember to be yourself and enjoy the moment!</p>
    `,
    date: '2025-01-05',
    category: 'Date Ideas',
    author: 'Ruda Team',
  },
  'online-dating-safety': {
    title: 'Online Dating Safety Tips for Kenyans',
    content: `
      <p>Online dating is exciting, but safety should always come first. Here are essential safety tips.</p>
      <h2>1. Keep Personal Info Private</h2>
      <p>Don't share your home address, workplace, or financial details with strangers online.</p>
      <h2>2. Use Platform Messaging</h2>
      <p>Stick to the platform's messaging system until you feel comfortable. This keeps conversations secure.</p>
      <h2>3. Video Call Before Meeting</h2>
      <p>Video calls help verify identities and build trust before meeting in person.</p>
      <h2>4. Meet in Public Places</h2>
      <p>Always meet in public, busy places for the first few dates. Tell a friend where you'll be.</p>
      <h2>5. Trust Your Instincts</h2>
      <p>If something feels off, it probably is. Listen to your gut and take necessary precautions.</p>
    `,
    date: '2024-12-28',
    category: 'Safety',
    author: 'Ruda Team',
  },
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogData[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return (
      <div className="blog-post-not-found">
        <h1>Post not found</h1>
        <Link to="/blog" className="back-link">Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Ruda Dating Blog</title>
        <meta name="description" content={post.title} />
      </Helmet>

      <article className="blog-post">
        <div className="post-header">
          <span className="category">{post.category}</span>
          <h1>{post.title}</h1>
          <div className="meta">
            <span>By {post.author}</span>
            <span className="separator">•</span>
            <span>{new Date(post.date).toLocaleDateString('en-KE')}</span>
          </div>
        </div>
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <Link to="/blog" className="back-link">← Back to Blog</Link>
      </article>
    </>
  );
};

export default BlogPost;