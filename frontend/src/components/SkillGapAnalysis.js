import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SkillGapAnalysis = ({ uid }) => {
  const [userSkills, setUserSkills] = useState([]);
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Normalize skill formatting for display only
  const normalizeSkillFormat = (skill) => {
    // Convert to title case
    return skill.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim();
  };

  useEffect(() => {
    console.log("SkillGapAnalysis received uid:", uid);
  }, [uid]);

  useEffect(() => {
    const fetchSkillGapData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://127.0.0.1:5002/api/skill_gap_analysis/${uid}`);
        let parsedData = response.data;

        if (typeof response.data === "string") {
          try {
            parsedData = JSON.parse(response.data);
          } catch (e) {
            console.error("Failed to parse response.data:", e);
          }
        }

        const {
          missing_skills = [],
          recommended_courses = [],
          trending_skills = [],
          user_skills = [],
        } = parsedData;

        console.log("Data from backend:", {
          missing_skills,
          trending_skills,
          user_skills
        });

        // No filtering, just normalize the format for display
        setUserSkills(user_skills.map(normalizeSkillFormat));
        setTrendingSkills(trending_skills.map(normalizeSkillFormat));
        setMissingSkills(missing_skills.map(normalizeSkillFormat));
        setRecommendedCourses(recommended_courses);
      } catch (error) {
        console.error('Error fetching skill gap data:', error);
        // Show error state instead of default values
        setError('Failed to load skill data. Please try again.');
        setUserSkills([]);
        setTrendingSkills([]);
        setMissingSkills([]);
        setRecommendedCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkillGapData();
  }, [uid]);

  // Function to get skill category
  const getSkillCategory = (skill) => {
    const lowerSkill = skill.toLowerCase();
    
    if (lowerSkill.match(/python|java|javascript|html|css|react|angular|node|sql|aws|azure|docker|kubernetes|git|api|database|cloud|programming/i)) {
      return 'Tech';
    }
    
    if (lowerSkill.match(/sales|crm|lead|prospect|account|client|negotiation|closing|pipeline|forecasting/i)) {
      return 'Sales';
    }
    
    if (lowerSkill.match(/marketing|seo|content|social media|campaign|brand|analytics|audience|engagement/i)) {
      return 'Marketing';
    }
    
    return 'Other';
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '2rem', 
      maxWidth: '950px', 
      margin: '0 auto' 
    }}>
      <div style={{ 
        flexDirection: 'column', 
        width: '100%', 
        maxWidth: '1200px', 
        backgroundColor: '#ffffff', 
        padding: '2.5rem', 
        borderRadius: '16px', 
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.16)', 
        textAlign: 'center' 
      }}>
        <h2 style={{ 
          fontSize: '2.2rem', 
          fontWeight: 'bold', 
          marginBottom: '2rem', 
          color: '#2d3748', 
          borderBottom: '2px solid #e2e8f0', 
          paddingBottom: '0.75rem' 
        }}>
          Skill Gap Analysis
        </h2>
        
        {error && (
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#fee2e2', 
            color: '#b91c1c',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', color: '#4a5568' }}>Loading skill analysis...</p>
          </div>
        ) : (
          <div style={{ 
            marginBottom: '2.5rem',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem'
          }}>
            {/* Your Skills Section */}
            <div style={{ 
              position: 'relative',
              backgroundColor: '#f0f7ff',
              borderRadius: '12px',
              padding: '2rem 1.5rem 1.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              marginTop: '1.5rem'
            }}>
              <div style={{ 
                position: 'absolute',
                top: '-1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)',
                zIndex: 1
              }}>
                Your Skills
              </div>
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.75rem',
                marginTop: '0.5rem'
              }}>
                {userSkills.length > 0 ? userSkills.map((skill, index) => {
                  const category = getSkillCategory(skill);
                  const categoryColors = {
                    Tech: { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
                    Sales: { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
                    Marketing: { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
                    Other: { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb' }
                  };
                  
                  return (
                    <span 
                      key={index} 
                      style={{ 
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '16px', 
                        fontSize: '0.9rem', 
                        fontWeight: '500', 
                        backgroundColor: categoryColors[category].bg,
                        color: categoryColors[category].color,
                        border: `1px solid ${categoryColors[category].border}`,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {skill}
                      <span style={{ 
                        fontSize: '0.7rem', 
                        backgroundColor: categoryColors[category].color,
                        color: 'white',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '8px',
                        marginLeft: '0.25rem'
                      }}>
                        {category}
                      </span>
                    </span>
                  );
                }) : 
                  <p style={{ fontSize: '1rem', color: '#4a5568', fontStyle: 'italic' }}>No skills to display</p>
                }
              </div>
            </div>
            
            {/* Trending Skills Section */}
            <div style={{ 
              position: 'relative',
              backgroundColor: '#f5f0ff',
              borderRadius: '12px',
              padding: '2rem 1.5rem 1.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              marginTop: '1.5rem'
            }}>
              <div style={{ 
                position: 'absolute',
                top: '-1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#8b5cf6',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '0 4px 8px rgba(139, 92, 246, 0.3)',
                zIndex: 1
              }}>
                Trending Skills
              </div>
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.75rem',
                marginTop: '0.5rem'
              }}>
                {trendingSkills.length > 0 ? trendingSkills.map((skill, index) => {
                  const category = getSkillCategory(skill);
                  const categoryColors = {
                    Tech: { bg: '#f5f3ff', color: '#6d28d9', border: '#ede9fe' },
                    Sales: { bg: '#fdf2f8', color: '#be185d', border: '#fce7f3' },
                    Marketing: { bg: '#fff1f2', color: '#be123c', border: '#ffe4e6' },
                    Other: { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb' }
                  };
                  
                  return (
                    <span 
                      key={index} 
                      style={{ 
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '16px', 
                        fontSize: '0.9rem', 
                        fontWeight: '500', 
                        backgroundColor: categoryColors[category].bg,
                        color: categoryColors[category].color,
                        border: `1px solid ${categoryColors[category].border}`,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {skill}
                      <span style={{ 
                        fontSize: '0.7rem', 
                        backgroundColor: categoryColors[category].color,
                        color: 'white',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '8px',
                        marginLeft: '0.25rem'
                      }}>
                        {category}
                      </span>
                    </span>
                  );
                }) : 
                  <p style={{ fontSize: '1rem', color: '#4a5568', fontStyle: 'italic' }}>No trending skills to display</p>
                }
              </div>
            </div>
            
            {/* Missing Skills Section */}
            <div style={{ 
              position: 'relative',
              backgroundColor: '#fff1f1',
              borderRadius: '12px',
              padding: '2rem 1.5rem 1.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              marginTop: '1.5rem'
            }}>
              <div style={{ 
                position: 'absolute',
                top: '-1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '0 4px 8px rgba(239, 68, 68, 0.3)',
                zIndex: 1
              }}>
                Missing Skills
              </div>
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.75rem',
                marginTop: '0.5rem'
              }}>
                {missingSkills.length > 0 ? missingSkills.map((skill, index) => {
                  const category = getSkillCategory(skill);
                  const categoryColors = {
                    Tech: { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' },
                    Sales: { bg: '#ffedd5', color: '#c2410c', border: '#fed7aa' },
                    Marketing: { bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
                    Other: { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb' }
                  };
                  
                  return (
                    <span 
                      key={index} 
                      style={{ 
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '16px', 
                        fontSize: '0.9rem', 
                        fontWeight: '500', 
                        backgroundColor: categoryColors[category].bg,
                        color: categoryColors[category].color,
                        border: `1px solid ${categoryColors[category].border}`,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {skill}
                      <span style={{ 
                        fontSize: '0.7rem', 
                        backgroundColor: categoryColors[category].color,
                        color: 'white',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '8px',
                        marginLeft: '0.25rem'
                      }}>
                        {category}
                      </span>
                    </span>
                  );
                }) : 
                  <p style={{ fontSize: '1rem', color: '#4a5568', fontStyle: 'italic' }}>No skill gaps found!</p>
                }
              </div>
            </div>
          </div>
        )}

        {recommendedCourses.length > 0 && (
          <div style={{ 
            position: 'relative',
            marginTop: '3.5rem',
            borderRadius: '16px',
            padding: '2.5rem 2rem 2rem',
          }}>
            <div style={{ 
              position: 'absolute',
              top: '-1.25rem',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#0f172a',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '25px',
              fontWeight: '600',
              fontSize: '1.2rem',
              letterSpacing: '0.5px',
              zIndex: 1,
              minWidth: '250px',
              textAlign: 'center'
            }}>
              Recommended Courses
            </div>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '1.5rem',
              marginTop: '1rem'
            }}>
              {recommendedCourses.map((course, index) => (
                <div 
                  key={index} 
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: hoveredCourse === index 
                      ? '0 12px 24px rgba(0, 0, 0, 0.12)' 
                      : '0 4px 12px rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    transform: hoveredCourse === index ? 'translateY(-6px)' : 'none',
                  }}
                  onMouseEnter={() => setHoveredCourse(index)}
                  onMouseLeave={() => setHoveredCourse(null)}
                >
                  <div>
                    <h4 style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 600, 
                      marginBottom: '0.75rem', 
                      color: '#1e293b',
                      lineHeight: '1.4'
                    }}>
                      {course.name}
                    </h4>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '1rem',
                      marginBottom: '1.25rem',
                    }}>
                      {course.rating && (
                        <span style={{
                          backgroundColor: '#fef9c3',
                          color: '#854d0e',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '500'
                        }}>
                          ⭐ {course.rating}
                        </span>
                      )}
                      {course.difficulty && (
                        <span style={{
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '500'
                        }}>
                          {course.difficulty}
                        </span>
                      )}
                    </div>
                    
                    {/* Display which skill this course is for */}
                    {course.for_skill && (
                      <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#b91c1c',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        marginBottom: '1.25rem',
                        display: 'inline-block'
                      }}>
                        For: {normalizeSkillFormat(course.for_skill)}
                      </div>
                    )}
                  </div>
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      padding: '0.7rem 1rem',
                      backgroundColor: hoveredCourse === index ? '#2563eb' : '#3b82f6',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      fontWeight: '500',
                      display: 'inline-block',
                      textAlign: 'center',
                      width: '100%',
                      boxSizing: 'border-box',
                      boxShadow: hoveredCourse === index 
                        ? '0 4px 12px rgba(37, 99, 235, 0.4)' 
                        : '0 2px 6px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    View Course
                  </a>
                </div>
              ))}
            </div>
            
            {recommendedCourses.length >= 12 && (
              <p style={{ 
                fontSize: '0.9rem',
                color: '#64748b', 
                marginTop: '1.5rem', 
                textAlign: 'center',
                fontStyle: 'italic',
              }}>
                ...and many more courses available!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
