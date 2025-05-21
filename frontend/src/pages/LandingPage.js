import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const images = [
    'https://i.ibb.co/Vc2Lz9v5/dashboard.png',
    'https://i.ibb.co/zTK4fHB8/Screenshot-2025-04-17-235908.png',
    'https://i.ibb.co/TxSsVVBZ/Screenshot-2025-04-17-225443.png',
    'https://i.ibb.co/93wsqcgW/Screenshot-2025-04-17-233809.png',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true);
      }, 500); // small timeout to allow fade-out
    }, 3000); // change image every 1s

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      fontFamily: '"Poppins", sans-serif',
      color: '#333',
      margin: 0,
      padding: 0,
      overflowX: 'hidden',
    }}>
      {/* Navigation Bar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 8%',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 1000,
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ 
            fontSize: '1.8rem', 
            margin: 0, 
            background: 'linear-gradient(120deg, #2563eb, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}>
            CareerZenith
          </h1>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#features" style={{ textDecoration: 'none', color: '#333', fontWeight: 500 }}>Features</a>
          <a href="#how-it-works" style={{ textDecoration: 'none', color: '#333', fontWeight: 500 }}>How It Works</a>
          <a href="#testimonials" style={{ textDecoration: 'none', color: '#333', fontWeight: 500 }}>Testimonials</a>
        </div>
        
        <div>
          {/* <button 
            onClick={handleGetStarted}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: '50px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Get Started
          </button> */}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '10rem 8% 6rem 8%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc',
        minHeight: '90vh',
      }}>
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            marginBottom: '1.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
          }}>
            Elevate Your Career With AI-Powered Insights
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            CareerZenith combines AI-driven job recommendations, skill gap analysis, and personalized training paths to help you reach your career peak.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={handleGetStarted}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Get Started
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: '#2563eb',
              border: '2px solid #2563eb',
              padding: '1rem 2rem',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            >
              Learn More
            </button>
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            
          </div>
        </div>
        <div style={{ width: '45%', position: 'relative' }}>
          <div style={{
            width: '600px',
            height: '440px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(140deg, #c7d2fe, #ddd6fe)',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <img 
      src={images[currentIndex]} // replace with your actual image URL
      alt="Dashboard Preview"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '20px',
        transition: 'opacity 0.8s ease-in-out',
        opacity: fade ? 1 : 0,
      }}
    />
          </div>
          <div style={{ 
            position: 'absolute',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'linear-gradient(140deg, #7c3aed, #2563eb',
            top: '-60px',
            right: '-40px',
            zIndex: -1,
          }}></div>
          <div style={{ 
            position: 'absolute',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(140deg, #7c3aed, #2563eb)',
            bottom: '-30px',
            left: '-20px',
            zIndex: -1,
          }}></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: '6rem 8%',
        backgroundColor: '#ffffff',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1rem',
            fontWeight: 700,
          }}>
            Powerful AI Features
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '800px', margin: '0 auto' }}>
            CareerZenith provides cutting-edge tools to accelerate your career journey.
          </p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '2rem',
        }}>
          {/* Feature 1 */}
          <div style={{
            padding: '2.5rem',
            borderRadius: '16px',
            backgroundColor: '#f8fafc',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 20px 30px rgba(0, 0, 0, 0.08)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '12px', 
              background: 'linear-gradient(140deg, #3b82f6, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              color: 'white',
              fontSize: '1.8rem',
            }}>
              🎯
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>AI Job Matching</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
              Our AI analyzes your skills and experience to match you with the perfect job opportunities tailored to your unique profile.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div style={{
            padding: '2.5rem',
            borderRadius: '16px',
            backgroundColor: '#f8fafc',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 20px 30px rgba(0, 0, 0, 0.08)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '12px', 
              background: 'linear-gradient(140deg, #8b5cf6, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              color: 'white',
              fontSize: '1.8rem',
            }}>
              📊
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>Skill Gap Analysis</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
              Identify your skill gaps with our AI-driven assessment tools and receive personalized recommendations for improvement.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div style={{
            padding: '2.5rem',
            borderRadius: '16px',
            backgroundColor: '#f8fafc',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 20px 30px rgba(0, 0, 0, 0.08)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '12px', 
              background: 'linear-gradient(140deg, #ec4899, #db2777)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              color: 'white',
              fontSize: '1.8rem',
            }}>
              🎓
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>Training Recommendations</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
              Get personalized training suggestions from platforms like Coursera, Udemy, and LinkedIn Learning to advance your skills.
            </p>
          </div>
        </div>
        
        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <button 
            onClick={handleGetStarted}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '1rem 2.5rem',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Explore All Features
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{
        padding: '6rem 8%',
        backgroundColor: '#f8fafc',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1rem',
            fontWeight: 700,
          }}>
            How CareerZenith Works
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '800px', margin: '0 auto' }}>
            A simple four-step process to transform your career journey
          </p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '2rem',
          position: 'relative',
        }}>
          {/* Line connector */}
          <div style={{
            position: 'absolute',
            top: '60px',
            left: '120px',
            right: '120px',
            height: '2px',
            backgroundColor: '#e2e8f0',
            zIndex: 0,
          }}></div>
          
          {/* Step 1 */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: '#2563eb',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 700,
              margin: '0 auto 1.5rem auto',
            }}>
              1
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 600 }}>Create Profile</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
              Sign up and build your comprehensive career profile with skills, experience, and preferences.
            </p>
          </div>
          
          {/* Step 2 */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: '#7c3aed',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 700,
              margin: '0 auto 1.5rem auto',
            }}>
              2
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 600 }}>AI Assessment</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
              Complete our AI-driven assessment to analyze your skills and identify improvement areas.
            </p>
          </div>
          
          {/* Step 3 */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: '#db2777',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 700,
              margin: '0 auto 1.5rem auto',
            }}>
              3
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 600 }}>Get Recommendations</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
              Receive personalized job matches and training recommendations tailored to your profile.
            </p>
          </div>
          
          {/* Step 4 */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: '#0891b2',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 700,
              margin: '0 auto 1.5rem auto',
            }}>
              4
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 600 }}>Advance Your Career</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
              Apply to jobs, complete recommended training, and track your career growth in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={{
        padding: '6rem 8%',
        backgroundColor: '#ffffff',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1rem',
            fontWeight: 700,
          }}>
            Success Stories
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '800px', margin: '0 auto' }}>
            Hear from professionals who transformed their careers with CareerZenith
          </p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '2rem',
        }}>
          {/* Testimonial 1 */}
          <div style={{
            padding: '2.5rem',
            borderRadius: '16px',
            backgroundColor: '#f8fafc',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
          }}>
            <div style={{ fontSize: '1.5rem', color: '#2563eb', marginBottom: '1.5rem' }}>★★★★★</div>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '1.05rem', marginBottom: '1.5rem' }}>
              "CareerZenith's skill gap analysis helped me identify exactly what I needed to learn to transition into data science. Their course recommendations were spot-on!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                backgroundColor: '#cbd5e1',
                marginRight: '1rem',
              }}></div>
              <div>
                <h4 style={{ margin: 0, fontWeight: 600 }}>Sarah Johnson</h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Data Scientist at Google</p>
              </div>
            </div>
          </div>
          
          {/* Testimonial 2 */}
          <div style={{
            padding: '2.5rem',
            borderRadius: '16px',
            backgroundColor: '#f8fafc',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
          }}>
            <div style={{ fontSize: '1.5rem', color: '#2563eb', marginBottom: '1.5rem' }}>★★★★★</div>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '1.05rem', marginBottom: '1.5rem' }}>
              "The resume wizard tool created a professional resume that highlighted my strengths perfectly. Within two weeks, I landed multiple interviews!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                backgroundColor: '#cbd5e1',
                marginRight: '1rem',
              }}></div>
              <div>
                <h4 style={{ margin: 0, fontWeight: 600 }}>Michael Chen</h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Software Engineer at Microsoft</p>
              </div>
            </div>
          </div>
          
          {/* Testimonial 3 */}
          <div style={{
            padding: '2.5rem',
            borderRadius: '16px',
            backgroundColor: '#f8fafc',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
          }}>
            <div style={{ fontSize: '1.5rem', color: '#2563eb', marginBottom: '1.5rem' }}>★★★★★</div>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '1.05rem', marginBottom: '1.5rem' }}>
              "The real-time job market insights helped me pivot my career focus to an in-demand field. The personalized training path made the transition seamless."
            </p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                backgroundColor: '#cbd5e1',
                marginRight: '1rem',
              }}></div>
              <div>
                <h4 style={{ margin: 0, fontWeight: 600 }}>Emily Rodriguez</h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Product Manager at Meta</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '6rem 8%',
        backgroundColor: '#1e293b',
        color: 'white',
        textAlign: 'center',
        borderRadius: '20px',
        margin: '0 8% 6rem 8%',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ 
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'linear-gradient(140deg, rgba(124, 58, 237, 0.3), rgba(37, 99, 235, 0.1))',
          top: '-100px',
          right: '-100px',
          zIndex: 0,
        }}></div>
        <div style={{ 
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'linear-gradient(140deg, rgba(124, 58, 237, 0.2), rgba(37, 99, 235, 0.1))',
          bottom: '-50px',
          left: '-50px',
          zIndex: 0,
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1.5rem',
            fontWeight: 700,
          }}>
            Ready to Elevate Your Career?
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#cbd5e1', maxWidth: '700px', margin: '0 auto 2.5rem auto' }}>
            Join thousands of professionals who have transformed their careers with CareerZenith's AI-powered platform.
          </p>
          <button 
            onClick={handleGetStarted}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '1.2rem 3rem',
              borderRadius: '50px',
              fontSize: '1.2rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.6)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Get Started for Free
          </button>
          <p style={{ margin: '1.5rem 0 0 0', color: '#94a3b8', fontSize: '0.95rem' }}>
            No credit card required • Free 14-day trial
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '4rem 8%',
        backgroundColor: '#f1f5f9',
        color: '#64748b',
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '2rem',
          marginBottom: '3rem',
        }}>
          <div>
            <h1 style={{ 
              fontSize: '1.8rem', 
              margin: '0 0 1rem 0', 
              background: 'linear-gradient(120deg, #2563eb, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}>
              CareerZenith
            </h1>
            <p style={{ lineHeight: 1.7 }}>
              Empowering professionals with AI-driven career insights, personalized training recommendations, and market-aligned job opportunities.
            </p>
          </div>
          
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#334155', marginBottom: '1.2rem' }}>Features</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.7rem' }}><a href="http://localhost:3000/login" style={{ textDecoration: 'none', color: '#64748b' }}>Job Recommendations</a></li>
              <li style={{ marginBottom: '0.7rem' }}><a href="http://localhost:3000/login" style={{ textDecoration: 'none', color: '#64748b' }}>Skill Gap Analysis</a></li>
              <li style={{ marginBottom: '0.7rem' }}><a href="http://localhost:3000/login" style={{ textDecoration: 'none', color: '#64748b' }}>Training Paths</a></li>
              <li style={{ marginBottom: '0.7rem' }}><a href="http://localhost:3000/login" style={{ textDecoration: 'none', color: '#64748b' }}>Resume Wizard</a></li>
            </ul>
          </div>
          
  
          
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#334155', marginBottom: '1.2rem' }}>Company</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.7rem' }}><a href="#" style={{ textDecoration: 'none', color: '#64748b' }}>About Us</a></li>
              <li style={{ marginBottom: '0.7rem' }}><a href="#" style={{ textDecoration: 'none', color: '#64748b' }}>Careers</a></li>
              <li style={{ marginBottom: '0.7rem' }}><a href="mailto:thesauravkumar@hotmail.com" style={{ textDecoration: 'none', color: '#64748b' }}>Contact Us</a></li>
              <li style={{ marginBottom: '0.7rem' }}><a href="#" style={{ textDecoration: 'none', color: '#64748b' }}>Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '2rem',
        }}>
          <p style={{ margin: 0 }}>© 2025 CareerZenith. All rights reserved.</p>
          
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;