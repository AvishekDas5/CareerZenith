import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendedJobs } from "../actions/jobActions";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import JobRecommendations from "../components/JobRecommendations";
import JobTrends from "../components/JobTrends";
import SkillGapAnalysis from "../components/SkillGapAnalysis";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const { recommendedJobs, loading, error } = useSelector((state) => state.jobs);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navbarShadow, setNavbarShadow] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchRecommendedJobs(user.uid));
    }
    
    // Add scroll event listener to enhance navbar with shadow on scroll
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setNavbarShadow(true);
      } else {
        setNavbarShadow(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch, user]);

  const handleLogout = () => {
    logout(); // Call logout function from AuthContext
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className="dashboard-container">
      {/* Fixed Navigation Bar */}
      <div style={{
        ...styles.navBar,
        boxShadow: navbarShadow ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'box-shadow 0.3s ease'
      }}>
        <div style={styles.navBarContent}>
          <div style={styles.brandContainer}>
            <h1 style={styles.brandText}>
              CareerZenith
            </h1>
          </div>

          <div style={styles.navMenu}>
            <ul style={styles.navList}>
              <li 
                style={styles.navItem} 
                onMouseOver={(e) => e.target.style.color = '#3b82f6'} 
                onMouseOut={(e) => e.target.style.color = '#333'}
                onClick={() => navigate("/job-listings")}
              >
                Search Jobs
              </li>
              <li 
                style={styles.navItem} 
                onMouseOver={(e) => e.target.style.color = '#3b82f6'} 
                onMouseOut={(e) => e.target.style.color = '#333'}
                onClick={() => navigate("/builder")}
              >
                Create Resume
              </li>
              <li 
                style={styles.navItem} 
                onMouseOver={(e) => e.target.style.color = '#3b82f6'} 
                onMouseOut={(e) => e.target.style.color = '#333'}
                onClick={() => navigate("/news")}
              >
                Employment News
              </li>
              <li 
                style={styles.navItem} 
                onMouseOver={(e) => e.target.style.color = '#3b82f6'} 
                onMouseOut={(e) => e.target.style.color = '#333'}
                onClick={() => navigate("/profile-setup")}
              >
                Update Profile
              </li>
        
            </ul>
          </div>

          <div style={styles.logoutContainer}>
            <button
              style={styles.logoutItem}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#d32f2f';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#f44336';
                e.target.style.transform = 'scale(1)';
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content with Background */}
      <div
        style={{
          backgroundImage: 'url("dashboard_bg.png")',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          minHeight: '100vh',
          paddingTop: '100px', // Added extra padding to account for fixed navbar
          paddingBottom: '40px',
        }}
      >
        <div className="p-6">
          {/* Greeting */}
          <h2 style={styles.greeting}>
            Welcome, {user?.displayName || "User"}!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Job Recommendations */}
            <div className="bg-white shadow-lg rounded-2xl p-5 border border-gray-100">
              <JobRecommendations
                recommendedJobs={recommendedJobs}
                loading={loading}
                error={error}
              />
            </div>

            {/* Job Trends */}
            <div className="bg-white shadow-lg rounded-2xl p-5 border border-gray-100">
              <JobTrends />
            </div>

            {/* Skill Gap Analysis */}
            <div className="bg-white shadow-lg rounded-2xl p-5 border border-gray-100 col-span-1 md:col-span-2">
              <SkillGapAnalysis uid={user?.uid} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  navBar: {
    display: "flex",
    justifyContent: "center", // Center the content horizontally
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "0.75rem 1rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    width: "100%",
  },
  navBarContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "1400px", // Limit width for larger screens
    padding: "0 1rem",
  },
  brandContainer: {
    display: "flex",
    alignItems: "center",
    minWidth: "150px", // Ensure minimum width for brand
  },
  brandText: {
    fontSize: '1.8rem', 
    margin: 0, 
    background: 'linear-gradient(120deg, #2563eb, #7c3aed)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
  },
  navMenu: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  navList: {
    listStyleType: "none",
    display: "flex",
    margin: 0,
    padding: 0,
    justifyContent: "center",
    flexWrap: "wrap", // Allow wrapping on smaller screens
  },
  navItem: {
    margin: "0 0.75rem",
    fontSize: "0.95rem",
    color: "#333",
    cursor: "pointer",
    transition: "color 0.3s ease, transform 0.2s ease",
    padding: "0.5rem",
    borderBottom: "2px solid transparent",
    fontWeight: 500,
    whiteSpace: "nowrap", // Prevent text wrapping within items
  },
  logoutContainer: {
    display: "flex",
    justifyContent: "flex-end",
    minWidth: "100px", // Ensure minimum width for logout button
  },
  logoutItem: {
    fontSize: "0.95rem",
    color: "#ffffff",
    backgroundColor: "#f44336",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.3s ease",
    fontWeight: 500,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    border: "none",
    outline: "none",
  },
  greeting: {
    fontSize: "1.75rem",
    fontWeight: 500,
    color: "#4B5563",
    marginBottom: "2rem",
    textAlign: "center",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
};

export default Dashboard;
