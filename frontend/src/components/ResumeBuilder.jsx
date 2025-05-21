import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BulletEditor from './BulletEditor';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [skillsInput, setSkillsInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    skills: [],
    projects: [{ name: '', description: '' }],
    template: 'classic'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    // Improved skills parsing - handles commas, spaces, and multiple delimiters
    const skillsArray = e.target.value
      .split(/[,;\n]+/) // Split by comma, semicolon, or newline
      .map(skill => skill.trim())
      .filter(skill => skill);
    
    setFormData(prev => ({ ...prev, skills: skillsArray }));
  };

  const handleSkillsInputChange = (e) => {
    setSkillsInput(e.target.value);
  };
  
  const parseSkillsInput = () => {
    const skillsArray = skillsInput
      .split(/[,;\n]+/)
      .map(skill => skill.trim())
      .filter(skill => skill && !formData.skills.includes(skill));
  
    if (skillsArray.length > 0) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, ...skillsArray] }));
      setSkillsInput('');
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      parseSkillsInput();
    }
  };
  

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index][field] = value;
    setFormData(prev => ({ ...prev, projects: updatedProjects }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '' }]
    }));
  };

  const removeProject = (index) => {
    if (formData.projects.length > 1) {
      const updatedProjects = formData.projects.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, projects: updatedProjects }));
    }
  };

  const setSummary = (summary) => {
    setFormData(prev => ({ ...prev, summary }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8009/generate-pdf/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate resume');
      }
      
      const data = await response.json();
      navigate(`/view-resume/${encodeURIComponent(data.pdf_url)}`);
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Failed to generate resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const formStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '30px',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
  };

  const sectionStyle = {
    marginBottom: '35px',
    padding: '25px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    transition: 'all 0.3s ease'
  };

  const headerStyle = {
    color: '#2c3e50',
    borderBottom: '3px solid #4a90e2',
    paddingBottom: '12px',
    marginBottom: '25px',
    fontWeight: '600'
  };

  const labelStyle = {
    display: 'block',
    margin: '12px 0 8px',
    fontWeight: '600',
    color: '#3d4852',
    fontSize: '15px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    margin: '5px 0 18px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    boxSizing: 'border-box',
    fontSize: '16px',
    transition: 'border 0.3s ease',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
  };

  const buttonStyle = {
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginRight: '12px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)'
  };

  const templateOptionStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '25px 0',
    gap: '10px',
  };

  const templateCardStyle = (selected) => ({
    width: '30%',
    padding: '20px',
    border: selected ? '2px solid #4a90e2' : '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: selected ? '#f0f7ff' : 'white',
    transition: 'all 0.3s ease',
    boxShadow: selected ? '0 5px 15px rgba(74, 144, 226, 0.2)' : '0 2px 5px rgba(0,0,0,0.05)',
    transform: selected ? 'translateY(-5px)' : 'none'
  });

  const renderPersonalInfoForm = () => (
    <div style={sectionStyle}>
      <h2 style={headerStyle}>Personal Information</h2>
      <label style={labelStyle}>Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        style={inputStyle}
        required
      />
      
      <label style={labelStyle}>Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        style={inputStyle}
        required
      />
      
      <label style={labelStyle}>Phone</label>
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        style={inputStyle}
        required
      />
      
      <div style={{ marginTop: '20px' }}>
        <button 
          type="button" 
          onClick={nextStep}
          style={buttonStyle}
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderSkillsAndSummaryForm = () => (
    <div style={sectionStyle}>
      <h2 style={headerStyle}>Skills & Summary</h2>
      
      <BulletEditor setSummary={setSummary} initialSummary={formData.summary} />
      
      <label style={labelStyle}>Skills (comma-separated)</label>

        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '15px'
        }}>
        {formData.skills.map((skill, index) => (
        <div key={index} style={{
            background: '#4a90e2',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center'
            }}>
            {skill}
            <span 
                onClick={() => {
                const updatedSkills = formData.skills.filter((_, i) => i !== index);
                setFormData(prev => ({ ...prev, skills: updatedSkills }));
                }}
                style={{
                marginLeft: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
                }}
                >
                    &times;
                </span>
                </div>
            ))}
            </div>

        <input
        type="text"
        name="skillsInput"
        value={skillsInput}
        onChange={handleSkillsInputChange}
        onBlur={parseSkillsInput}
        onKeyDown={handleKeyDown}
        style={inputStyle}
        placeholder="Type a skill and press Enter or comma"
        />

      <p style={{ fontSize: '12px', color: '#666', marginTop: '-10px' }}>
        Separate skills with commas, spaces, or new lines
      </p>
      
      <div style={{ marginTop: '20px', display: 'flex' }}>
        <button 
          type="button" 
          onClick={prevStep}
          style={secondaryButtonStyle}
        >
          Back
        </button>
        <button 
          type="button" 
          onClick={nextStep}
          style={{...buttonStyle, marginLeft: '10px'}}
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderProjectsForm = () => (
    <div style={sectionStyle}>
      <h2 style={headerStyle}>Projects</h2>
      
      {formData.projects.map((project, index) => (
        <div key={index} style={{ 
          border: '1px solid #ddd', 
          padding: '15px', 
          borderRadius: '5px',
          marginBottom: '15px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Project {index + 1}</h3>
            {formData.projects.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeProject(index)}
                style={{ 
                  backgroundColor: '#dc3545', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            )}
          </div>
          
          <label style={labelStyle}>Project Name</label>
          <input
            type="text"
            value={project.name}
            onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
            style={inputStyle}
            required
          />
          
          <label style={labelStyle}>Description</label>
          <textarea
            value={project.description}
            onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
            style={{...inputStyle, minHeight: '100px'}}
            required
          />
        </div>
      ))}
      
      <button 
        type="button" 
        onClick={addProject}
        style={{
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px',
          width: '100%'
        }}
      >
        + Add Another Project
      </button>
      
      <div style={{ display: 'flex' }}>
        <button 
          type="button" 
          onClick={prevStep}
          style={secondaryButtonStyle}
        >
          Back
        </button>
        <button 
          type="button" 
          onClick={nextStep}
          style={{...buttonStyle, marginLeft: '10px'}}
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderTemplateSelection = () => (
    <div style={sectionStyle}>
      <h2 style={headerStyle}>Choose Template</h2>
      
      <div style={templateOptionStyle}>
        <div 
          style={templateCardStyle(formData.template === 'classic')}
          onClick={() => setFormData(prev => ({ ...prev, template: 'classic' }))}
        >
          <h3>Classic</h3>
          <p>Traditional resume format, perfect for conservative industries</p>
        </div>
        
        <div 
          style={templateCardStyle(formData.template === 'modern')}
          onClick={() => setFormData(prev => ({ ...prev, template: 'modern' }))}
        >
          <h3>Modern</h3>
          <p>Clean and sleek design with a touch of color</p>
        </div>
        
        <div 
          style={templateCardStyle(formData.template === 'creative')}
          onClick={() => setFormData(prev => ({ ...prev, template: 'creative' }))}
        >
          <h3>Creative</h3>
          <p>Bold design for creative fields and modern industries</p>
        </div>
      </div>
      
      <div style={{ marginTop: '30px', display: 'flex' }}>
        <button 
          type="button" 
          onClick={prevStep}
          style={secondaryButtonStyle}
        >
          Back
        </button>
        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            ...buttonStyle, 
            marginLeft: '10px',
            backgroundColor: isLoading ? '#6c757d' : '#28a745',
            width: '200px'
          }}
        >
          {isLoading ? 'Generating...' : 'Generate Resume'}
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{
      backgroundImage: 'url("builder_bg.png")',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minHeight: '100vh',
      paddingTop: '40px',
    }}
  >
    <div style={formStyle}>
      <h1 style={{ textAlign: 'center', color: '#4a90e2' }}>Resume Builder</h1>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        margin: '30px 0',
        position: 'relative'
      }}>
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: step >= stepNumber ? '#4a90e2' : '#e9ecef',
            color: step >= stepNumber ? 'white' : '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            zIndex: 2
          }}>
            {stepNumber}
          </div>
        ))}
        
        <div style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          right: '30px',
          height: '2px',
          backgroundColor: '#e9ecef',
          zIndex: 1
        }}>
          <div style={{
            width: `${(step - 1) * 33.33}%`,
            height: '100%',
            backgroundColor: '#4a90e2',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {step === 1 && renderPersonalInfoForm()}
        {step === 2 && renderSkillsAndSummaryForm()}
        {step === 3 && renderProjectsForm()}
        {step === 4 && renderTemplateSelection()}
      </form>
    </div>
    </div>
  );
};

export default ResumeBuilder;