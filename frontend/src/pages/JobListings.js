import React, { useEffect, useState } from "react";
import { fetchJobs } from "../services/jobService";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("Software Engineer");
  const [location, setLocation] = useState("New York");
  const [salary, setSalary] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  const navigate = useNavigate();

  // Fetch jobs on component mount
  useEffect(() => {
    fetchFilteredJobs();
  }, []);

  const fetchFilteredJobs = () => {
    setLoading(true);
    fetchJobs(keyword, location, salary, isRemote)
      .then((data) => {
        if (data && data.length > 0) {
          // Improved search logic to prioritize relevant jobs
          const sortedJobs = sortJobsByRelevance(data, keyword);
          setJobs(sortedJobs);
          setError("");
        } else {
          setJobs([]);
          setError("No jobs found. Try adjusting your search criteria.");
        }
        setCurrentPage(1);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setError("Failed to fetch jobs. Please try again later.");
        setLoading(false);
      });
  };

  // Sort jobs by relevance to the search keyword
  const sortJobsByRelevance = (jobs, keyword) => {
    const keywordLower = keyword.toLowerCase();
    const keywordTerms = keywordLower.split(/\s+/).filter(term => term.length > 2);
    
    return jobs.sort((a, b) => {
      // Calculate relevance score for each job
      const scoreA = calculateRelevanceScore(a, keywordTerms, keywordLower);
      const scoreB = calculateRelevanceScore(b, keywordTerms, keywordLower);
      
      // Sort by relevance score (higher scores first)
      return scoreB - scoreA;
    });
  };

  // Calculate relevance score for a single job
  const calculateRelevanceScore = (job, keywordTerms, fullKeyword) => {
    let score = 0;
    const titleLower = job.title.toLowerCase();
    const descriptionLower = job.description ? job.description.toLowerCase() : "";
    
    // Exact title match gets highest priority
    if (titleLower === fullKeyword) {
      score += 100;
    }
    
    // Title contains the full keyword phrase
    if (titleLower.includes(fullKeyword)) {
      score += 50;
    }
    
    // Count individual term matches in title (weighted heavily)
    keywordTerms.forEach(term => {
      if (titleLower.includes(term)) {
        score += 25;
      }
    });
    
    // Count individual term matches in description (weighted less)
    keywordTerms.forEach(term => {
      if (descriptionLower.includes(term)) {
        score += 5;
      }
    });
    
    // Boost score for remote jobs if remote filter is on
    if (job.remote && isRemote) {
      score += 10;
    }
    
    return score;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFilteredJobs();
  };

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  // Improved pagination logic
  const renderPaginationButtons = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    // First page button
    if (startPage > 1) {
      pageNumbers.push(
        <button 
          key="first" 
          style={styles.paginationButton} 
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        pageNumbers.push(<span key="ellipsis1" style={styles.ellipsis}>...</span>);
      }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          style={i === currentPage ? styles.activePaginationButton : styles.paginationButton}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    // Last page button
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="ellipsis2" style={styles.ellipsis}>...</span>);
      }
      
      pageNumbers.push(
        <button
          key="last"
          style={styles.paginationButton}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  // Function to truncate markdown text while preserving markdown syntax
  const truncateMarkdown = (markdown, maxLength) => {
    if (!markdown) return "";
    if (markdown.length <= maxLength) return markdown;
    
    // Simple truncation that tries to preserve markdown structure
    return markdown.substring(0, maxLength) + '...';
  };

  return (
    <div style={styles.pageContainer}>
      {/* Navigation Bar */}
      <nav style={styles.navBar}>
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

        <div style={styles.navMenu}>
          <ul style={styles.navList}>
            <li style={styles.navItem} onClick={() => navigate("/dashboard")}>Dashboard</li>
            <li style={styles.navItem} onClick={() => navigate("/news")}>Employment News</li>
            <li style={styles.navItem} onClick={() => navigate("/profile-setup")}>Update Profile</li>
            <li style={styles.navItem} onClick={() => navigate("/builder")}>Create Resume</li>
          </ul>
        </div>
      </nav>

      <div style={styles.container}>
        <h2 style={styles.heading}>Find Your Dream Job</h2>

        <form style={styles.searchForm} onSubmit={handleSearch}>
          <div style={styles.controls}>
            <div style={styles.inputGroup}>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job Title"
                style={styles.input}
              />
            </div>
            
            <div style={styles.inputGroup}>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                style={styles.input}
              />
            </div>
            
            <div style={styles.inputGroup}>
              <select
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                style={styles.select}
              >
                <option value="">Any Salary</option>
                <option value="25000.00">$25,000+</option>
                <option value="50000.00">$50,000+</option>
                <option value="75000.00">$75,000+</option>
              </select>
            </div>

            {/* <div style={styles.remoteFilter}>
              <input
                type="checkbox"
                id="remote"
                checked={isRemote}
                onChange={(e) => setIsRemote(e.target.checked)}
                style={styles.checkbox}
              />
              <label htmlFor="remote" style={styles.checkboxLabel}>
                Remote Only
              </label>
            </div> */}

            <button type="submit" style={styles.searchButton}>
              Search
            </button>
          </div>
        </form>

        <div style={styles.contentContainer}>
          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p>Searching for jobs...</p>
            </div>
          ) : error && jobs.length === 0 ? (
            <div style={styles.emptyState}>
              <h3>No jobs found</h3>
              <p>Try adjusting your search filters or try a different keyword</p>
              <button style={styles.button} onClick={() => {
                setKeyword("Software Engineer");
                setLocation("New York");
                setSalary("");
                setIsRemote(false);
                setTimeout(fetchFilteredJobs, 0);
              }}>Reset Filters</button>
            </div>
          ) : (
            <>
              {jobs.length > 0 && (
                <div style={styles.searchStats}>
                  <p>Found {jobs.length} job{jobs.length !== 1 ? 's' : ''} matching your criteria</p>
                  {keyword && (
                    <div style={styles.keywordTag}>
                      <span>Keyword: {keyword}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div style={styles.jobGrid}>
                {currentJobs.map((job, index) => (
                  <div key={index} style={styles.jobCard}>
                    <div style={styles.jobHeader}>
                      {job.company_logo ? (
                        <img
                          src={job.company_logo}
                          alt={`${job.company} logo`}
                          style={styles.logo}
                        />
                      ) : (
                        <div style={styles.logoPlaceholder}>
                          {job.company ? job.company.charAt(0) : "J"}
                        </div>
                      )}
                      <div style={styles.jobTitleContainer}>
                        <h3 style={styles.jobTitle}>{job.title}</h3>
                        <p style={styles.companyInfo}>
                          {job.company} {job.location && `- ${job.location}`}
                          {job.remote && <span style={styles.remoteBadge}>Remote</span>}
                        </p>
                      </div>
                    </div>
                    
                    <div style={styles.jobDetails}>
                      {(job.min_amount || job.max_amount) && (
                        <div style={styles.salaryInfo}>
                          <strong>Salary:</strong>{" "}
                          {job.min_amount && job.max_amount
                            ? `$${job.min_amount.toLocaleString()} - $${job.max_amount.toLocaleString()}`
                            : job.min_amount
                            ? `$${job.min_amount.toLocaleString()}+`
                            : job.max_amount
                            ? `Up to $${job.max_amount.toLocaleString()}`
                            : "Not specified"}
                          {job.interval && ` / ${job.interval}`}
                        </div>
                      )}
                      
                      <div style={styles.description}>
      {job.description ? (
        <ReactMarkdown
          children={truncateMarkdown(job.description, 150)}
          components={{
            p: ({ children }) => <p className="markdown-content">{children}</p>,
            // You can define other elements here, like h1, h2, ul, etc.
          }}
        />
      ) : (
        "No description available"
      )}
    </div>
                    </div>
                    
                    <a
                      href={job.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.applyButton}
                    >
                      Apply Now
                    </a>
                  </div>
                ))}
              </div>

              {jobs.length > 0 && totalPages > 1 && (
                <div style={styles.paginationContainer}>
                  <button
                    style={currentPage === 1 ? styles.disabledPaginationButton : styles.paginationArrow}
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ←
                  </button>
                  
                  <div style={styles.pageNumbers}>
                    {renderPaginationButtons()}
                  </div>
                  
                  <button
                    style={currentPage === totalPages ? styles.disabledPaginationButton : styles.paginationArrow}
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    →
                  </button>
                </div>
              )}
              
              <div style={styles.resultsSummary}>
                {jobs.length > 0 && (
                  <p>Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, jobs.length)} of {jobs.length} jobs</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "#f9fafb",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  navBar: {
    background: "#fff",
    padding: "0 40px",
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #eaeaea",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },
  navMenu: {
    display: "flex",
  },
  navList: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
    gap: "32px",
  },
  navItem: {
    fontSize: "0.95rem",
    fontWeight: 500,
    color: "#4b5563",
    cursor: "pointer",
    padding: "6px 0",
    transition: "all 0.15s ease",
  },
  container: {
    maxWidth: "1200px",
    width: "100%",
    margin: "0 auto",
    padding: "40px 24px 60px",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "36px",
    textAlign: "center",
  },
  searchForm: {
    background: "#fff",
    padding: "28px",
    borderRadius: "12px",
    marginBottom: "40px",
    border: "1px solid #eaeaea",
    boxShadow: "0 4px 6px rgba(0,0,0,0.03)",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "45px",
    justifyContent: "center",
  },
  inputGroup: {
    flex: "1 1 180px",
    maxWidth: "280px",
  },
  input: {
    padding: "12px 16px",
    fontSize: "0.95rem",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    outline: "none",
    transition: "border-color 0.15s ease",
    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
  },
  select: {
    padding: "12px 16px",
    fontSize: "0.95rem",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    outline: "none",
    backgroundColor: "#fff",
    transition: "border-color 0.15s ease", 
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    backgroundSize: "16px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
  },
  remoteFilter: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    whiteSpace: "nowrap",
    padding: "0 10px",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    accentColor: "#4f46e5",
    marginRight: "2px",
  },
  checkboxLabel: {
    fontSize: "0.95rem",
    color: "#4b5563",
  },
  searchButton: {
    padding: "12px 28px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    fontWeight: 500,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.15s ease",
    boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
  },
  contentContainer: {
    minHeight: "400px",
  },
  searchStats: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },
  keywordTag: {
    display: "inline-block",
    padding: "6px 12px",
    background: "#e0e7ff",
    color: "#4f46e5",
    borderRadius: "6px",
    fontSize: "0.85rem",
    fontWeight: 500,
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 0",
    gap: "20px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(79, 70, 229, 0.1)",
    borderRadius: "50%",
    borderTop: "4px solid #4f46e5",
    animation: "spin 1s linear infinite",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 0",
    color: "#6b7280",
  },
  jobGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    gap: "28px",
    marginBottom: "48px",
  },
  jobCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.06)",
    border: "1px solid #eaeaea",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    display: "flex",
    flexDirection: "column",
    margin: "0",
  },
  jobHeader: {
    display: "flex",
    alignItems: "flex-start", 
    gap: "18px",
    marginBottom: "20px",
  },
  logo: {
    width: "52px",
    height: "52px",
    borderRadius: "8px",
    objectFit: "cover",
    border: "1px solid #f3f4f6",
  },
  logoPlaceholder: {
    width: "52px",
    height: "52px",
    background: "#f3f4f6",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#4f46e5",
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "8px",
    lineHeight: 1.4,
  },
  companyInfo: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  remoteBadge: {
    background: "#e0e7ff",
    color: "#4f46e5",
    padding: "3px 10px",
    borderRadius: "4px",
    fontSize: "0.8rem",
    fontWeight: 500,
  },
  jobDetails: {
    flex: 1,
    marginBottom: "24px",
  },
  salaryInfo: {
    fontSize: "0.95rem",
    color: "#4b5563",
    marginBottom: "12px",
    padding: "8px 12px",
    background: "#f9fafb",
    borderRadius: "6px",
    display: "inline-block",
  },
  description: {
    fontSize: "0.95rem",
    color: "#4b5563",
    lineHeight: 1.6,
    margin: "12px 0",
  },
  applyButton: {
    display: "inline-block",
    padding: "10px 20px",
    background: "#4f46e5",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 500,
    textAlign: "center",
    transition: "background-color 0.15s ease",
    marginTop: "auto",
    boxShadow: "0 1px 3px rgba(79, 70, 229, 0.3)",
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    marginBottom: "15px",
    padding: "12px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  pageNumbers: {
    display: "flex",
    gap: "8px",
  },
  paginationButton: {
    padding: "8px 14px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#4b5563",
    cursor: "pointer",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: 500,
    minWidth: "36px",
    textAlign: "center",
    transition: "all 0.15s ease",
  },
  activePaginationButton: {
    padding: "8px 14px",
    border: "1px solid #4f46e5",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: 500,
    minWidth: "36px",
    textAlign: "center",
  },
  paginationArrow: {
    padding: "8px 12px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#4b5563",
    cursor: "pointer",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: 500,
    minWidth: "36px",
    textAlign: "center",
    transition: "all 0.15s ease",
  },
  disabledPaginationButton: {
    padding: "8px 12px",
    border: "1px solid #f3f4f6",
    background: "#f9fafb",
    color: "#d1d5db",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: 500,
    minWidth: "36px",
    textAlign: "center",
    cursor: "not-allowed",
  },
  ellipsis: {
    padding: "8px 10px",
    fontSize: "0.9rem",
    color: "#6b7280",
  },
  resultsSummary: {
    textAlign: "center",
    fontSize: "0.95rem",
    color: "#6b7280",
    marginTop: "20px",
    padding: "10px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    fontWeight: 500,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
    boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
  },
};

export default JobListings;