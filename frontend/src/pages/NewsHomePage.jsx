import React from 'react';
import { Link } from 'react-router-dom';

const NewsHomePage = () => {
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      textAlign: 'center',
    },
    heading: {
      fontSize: '3rem',
      marginBottom: '20px',
      color: '#2c3e50',
    },
    subheading: {
      fontSize: '1.5rem',
      marginBottom: '30px',
      color: '#7f8c8d',
    },
    button: {
      display: 'inline-block',
      padding: '12px 24px',
      backgroundColor: '#3498db',
      color: '#fff',
      borderRadius: '4px',
      textDecoration: 'none',
      fontSize: '1.1rem',
      transition: 'background-color 0.3s ease',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Our News Platform</h1>
      <p style={styles.subheading}>Stay updated with the latest employment news from around the world</p>
      <Link 
        to="/news" 
        style={styles.button}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#2980b9';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#3498db';
        }}
      >
        Browse News
      </Link>
    </div>
  );
};

export default NewsHomePage;