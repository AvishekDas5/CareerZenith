// frontend/src/components/PDFPreview.jsx
import React, { useState, useEffect } from 'react';

const PDFPreview = ({ pdfUrl }) => {
  // Full URL to the PDF on the backend server
  const fullPdfUrl = `http://localhost:8009${pdfUrl}`;
  const [resumeId, setResumeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Extract resume_id from the pdfUrl
    // The format is typically "/static/resumes/{resumeId}/resume.pdf"
    try {
      const urlParts = pdfUrl.split('/');
      // The resumeId should be the 3rd part in the URL
      if (urlParts.length >= 4) {
        setResumeId(urlParts[3]);
        setLoading(false);
      } else {
        throw new Error('Invalid PDF URL format');
      }
    } catch (err) {
      console.error('Error extracting resume ID:', err);
      setError('Could not load preview');
      setLoading(false);
    }
  }, [pdfUrl]);
  
  const previewContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    margin: '20px 0'
  };
  
  const imageStyle = {
    width: '100%',
    maxWidth: '800px',
    height: 'auto',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    borderRadius: '4px'
  };
  
  const downloadButtonStyle = {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '20px',
    textDecoration: 'none',
    display: 'inline-block',
    boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.2s ease'
  };

  if (loading) {
    return (
      <div style={previewContainerStyle}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>Resume Preview</h2>
        <p>Loading preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={previewContainerStyle}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>Resume Preview</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <a 
          href={fullPdfUrl} 
          download="resume.pdf"
          style={{ textDecoration: 'none', marginTop: '20px' }}
        >
          <button style={downloadButtonStyle}>
            Download Resume
          </button>
        </a>
      </div>
    );
  }

  return (
    <div style={previewContainerStyle}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Resume Preview</h2>
      
      {resumeId && (
        <img 
          src={`http://localhost:8009/generate-pdf/`} 
          alt="Resume Preview" 
          style={imageStyle}
          onError={() => setError('Failed to load the preview')}
        />
      )}
      
      <a 
        href={fullPdfUrl} 
        download="resume.pdf"
        style={{ textDecoration: 'none', marginTop: '20px' }}
      >
        <button style={downloadButtonStyle}>
          Download Resume
        </button>
      </a>
    </div>
  );
};

export default PDFPreview;
