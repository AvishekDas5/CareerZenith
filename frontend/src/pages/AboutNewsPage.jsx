// src/pages/AboutPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutNewsPage = () => {
  const navigate = useNavigate();
  
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
    },
    navigationButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    button: {
      padding: '10px 15px',
      backgroundColor: '#3498db',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'background-color 0.3s ease',
    },
    heading: {
      fontSize: '2.5rem',
      marginBottom: '20px',
      color: '#2c3e50',
      textAlign: 'center',
    },
    content: {
      fontSize: '1.1rem',
      lineHeight: '1.8',
      color: '#333',
    },
    section: {
      marginBottom: '30px',
      backgroundColor: '#fff',
      padding: '25px',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    subheading: {
      fontSize: '1.8rem',
      marginBottom: '15px',
      color: '#2c3e50',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.navigationButtons}>
        <button 
          style={styles.button}
          onClick={() => navigate('/news')}
          onMouseOver={(e) => {e.target.style.backgroundColor = '#2980b9'}}
          onMouseOut={(e) => {e.target.style.backgroundColor = '#3498db'}}
        >
          Back to News
        </button>
      </div>
      
      <h1 style={styles.heading}>About Our News Platform</h1>
      
      <div style={styles.section}>
        <h2 style={styles.subheading}>Our Mission</h2>
        <p style={styles.content}>
          We aim to provide the most accurate and up-to-date employment news from around the world.
          Our platform aggregates news from various sources to give you a comprehensive view of
          the employment landscape.
        </p>
      </div>
      
      <div style={styles.section}>
        <h2 style={styles.subheading}>Our Data Source</h2>
        <p style={styles.content}>
          We use the GDELT Project to collect and analyze news articles related to employment.
          This allows us to provide you with the most relevant information about job markets,
          employment trends, and workforce developments globally.
        </p>
      </div>
      
      <div style={styles.section}>
        <h2 style={styles.subheading}>How We Curate Content</h2>
        <p style={styles.content}>
          Our platform automatically filters articles based on relevance to employment topics.
          We prioritize reliable sources and make sure the content is recent and informative.
          The articles are displayed with their original titles and links to the source websites
          for full reading.
        </p>
      </div>
      
      <div style={styles.section}>
        <h2 style={styles.subheading}>Contact Us</h2>
        <p style={styles.content}>
          If you have any questions or feedback about our news platform, please contact us at
          info@example.com.
        </p>
      </div>
    </div>
  );
};

export default AboutNewsPage;