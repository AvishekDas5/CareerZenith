import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        color: '#333',
        marginBottom: '20px'
      }}>Resume Wizard</h1>
      
      <p style={{
        fontSize: '1.2rem',
        color: '#666',
        marginBottom: '40px'
      }}>Create professional resumes in minutes with our AI-powered resume builder</p>
      
      <div style={{
        backgroundColor: '#4a90e2',
        color: 'white',
        padding: '15px 30px',
        borderRadius: '5px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        display: 'inline-block',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}>
        <Link to="/builder" style={{ color: 'white', textDecoration: 'none' }}>
          Start Building Your Resume
        </Link>
      </div>
    </div>
  );
}

export default Home;