// frontend/src/components/ViewResume.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PDFPreview from './PDFPreview'; // ✅ Replaced ImagePreview

const ViewResume = () => {
  const { pdfUrl } = useParams();
  const decodedUrl = decodeURIComponent(pdfUrl);
  
  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  };
  
  const headerStyle = {
    textAlign: 'center',
    color: '#4a90e2',
    marginBottom: '30px',
    fontWeight: '600',
    borderBottom: '3px solid #4a90e2',
    paddingBottom: '15px'
  };
  
  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Your Resume</h1>
      <PDFPreview pdfUrl={decodedUrl} /> {/* ✅ Use PDFPreview */}
    </div>
  );
};

export default ViewResume;