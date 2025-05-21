import React, { useState } from 'react';

const BulletEditor = ({ setSummary, initialSummary }) => {
  const [bullets, setBullets] = useState(['']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState(initialSummary || '');

  const handleBulletChange = (index, value) => {
    const newBullets = [...bullets];
    newBullets[index] = value;
    setBullets(newBullets);
  };

  const addBullet = () => {
    setBullets([...bullets, '']);
  };

  const removeBullet = (index) => {
    if (bullets.length > 1) {
      const newBullets = bullets.filter((_, i) => i !== index);
      setBullets(newBullets);
    }
  };

  const generateSummary = async () => {
    // Filter out empty bullets
    const filteredBullets = bullets.filter(bullet => bullet.trim());
    
    if (filteredBullets.length === 0) {
      alert('Please add at least one bullet point.');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('http://localhost:8009/summarize/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bullets: filteredBullets }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }
      
      const data = await response.json();
      setGeneratedSummary(data.summary);
      setSummary(data.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSummaryChange = (e) => {
    setGeneratedSummary(e.target.value);
    setSummary(e.target.value);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ 
        color: '#4a90e2', 
        marginBottom: '10px' 
      }}>
        AI-Powered Summary Generator
      </h3>
      
      <p style={{ marginBottom: '15px', color: '#666' }}>
        Add bullet points about your skills and experience, and our AI will generate a professional summary for you.
      </p>
      
      {bullets.map((bullet, index) => (
        <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
          <input
            type="text"
            value={bullet}
            onChange={(e) => handleBulletChange(index, e.target.value)}
            placeholder="Add a skill or experience bullet point"
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          {bullets.length > 1 && (
            <button
              type="button"
              onClick={() => removeBullet(index)}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0 10px',
                marginLeft: '10px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          )}
        </div>
      ))}
      
      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          onClick={addBullet}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 15px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          + Add Bullet
        </button>
        
        <button
          type="button"
          onClick={generateSummary}
          disabled={isGenerating}
          style={{
            backgroundColor: isGenerating ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 15px',
            cursor: isGenerating ? 'default' : 'pointer'
          }}
        >
          {isGenerating ? 'Generating...' : 'Generate Summary'}
        </button>
      </div>
      
      <div>
        <label style={{ 
          display: 'block',
          fontWeight: 'bold',
          marginBottom: '5px',
          color: '#555'
        }}>
          Professional Summary
        </label>
        <textarea
          value={generatedSummary}
          onChange={handleSummaryChange}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            minHeight: '120px',
            resize: 'vertical'
          }}
          placeholder="Your professional summary will appear here..."
        />
      </div>
    </div>
  );
};

export default BulletEditor;
