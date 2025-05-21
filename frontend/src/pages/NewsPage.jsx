import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8001/news');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      
      // Filter out duplicate news articles based on title
      const uniqueNews = Array.from(new Map(data.map(item => [item.title, item])).values());
      setNews(uniqueNews);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Get current news items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = news.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers with limited display
  const pageNumbers = [];
  const totalPages = Math.ceil(news.length / itemsPerPage);
  
  let startPage = 1;
  let endPage = totalPages;
  
  if (totalPages > 5) {
    if (currentPage <= 3) {
      endPage = 5;
    } else if (currentPage + 2 >= totalPages) {
      startPage = totalPages - 4;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      lineHeight: '1.6',
      color: '#333',
      // backgroundColor: '#f9fafc',
      minHeight: '100vh',
    },
    navBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
      marginBottom: '30px',
      position: 'sticky',
      top: '0',
      zIndex: '100',
    },
    navMenu: {
      display: 'flex',
    },
    navList: {
      display: 'flex',
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    navItem: {
      margin: '0 15px',
      padding: '8px 0',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '500',
      color: '#4b5563',
      borderBottom: '2px solid transparent',
      transition: 'all 0.3s ease',
    },
    activeNavItem: {
      borderBottom: '2px solid #3b82f6',
      color: '#3b82f6',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
      position: 'relative',
    },
    headerTitle: {
      fontSize: '2.5rem',
      color: '#2c3e50',
      marginBottom: '10px',
      fontWeight: '700',
    },
    headerSubtitle: {
      fontSize: '1.1rem',
      color: '#7f8c8d',
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '1.2rem',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)',
    },
    error: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '1.2rem',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)',
      color: '#e74c3c',
    },
    noNews: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '1.2rem',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)',
    },
    newsList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '25px',
      marginBottom: '40px',
    },
    newsItem: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    imgContainer: {
      height: '200px',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#f0f2f5',
    },
    noImageText: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#95a5a6',
      fontWeight: '500',
      fontSize: '1rem',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    content: {
      padding: '25px',
    },
    title: {
      fontSize: '1.3rem',
      marginBottom: '12px',
      color: '#2c3e50',
      fontWeight: '600',
      lineHeight: '1.4',
    },
    description: {
      marginBottom: '15px',
      color: '#555',
      lineHeight: '1.6',
    },
    meta: {
      display: 'flex',
      flexWrap: 'wrap',
      fontSize: '0.9rem',
      color: '#7f8c8d',
      marginBottom: '20px',
    },
    metaItem: {
      marginRight: '15px',
      marginBottom: '5px',
      backgroundColor: '#f0f2f5',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.85rem',
    },
    readMore: {
      display: 'inline-block',
      padding: '10px 20px',
      backgroundColor: '#3498db',
      color: '#fff',
      borderRadius: '6px',
      textDecoration: 'none',
      fontSize: '0.95rem',
      transition: 'background-color 0.3s ease',
      fontWeight: '500',
      border: 'none',
    },
    paginationContainer: {
      marginTop: '30px',
      display: 'flex',
      justifyContent: 'center',
    },
    pagination: {
      display: 'flex',
      listStyle: 'none',
      gap: '8px',
      alignItems: 'center',
    },
    pageItem: {
      display: 'inline-block',
    },
    pageLink: {
      padding: '8px 14px',
      backgroundColor: '#fff',
      border: '1px solid #e0e0e0',
      color: '#333',
      cursor: 'pointer',
      borderRadius: '6px',
      transition: 'all 0.3s ease',
      fontWeight: '500',
    },
    activePageLink: {
      backgroundColor: '#3498db',
      color: '#fff',
      border: '1px solid #3498db',
    },
    disabledPageLink: {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
    arrowButton: {
      padding: '8px 12px',
      backgroundColor: '#fff',
      border: '1px solid #e0e0e0',
      color: '#333',
      cursor: 'pointer',
      borderRadius: '6px',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    ellipsis: {
      padding: '0 10px',
      color: '#7f8c8d',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.navBar}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ 
            fontSize: '1.8rem', 
            margin: 0, 
            background: 'linear-gradient(120deg, #2563eb, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            cursor: 'pointer'
          }}
          onClick={() => navigate("/dashboard")}>
            CareerZenith
          </h1>
        </div>

        <div style={styles.navMenu}>
          <ul style={styles.navList}>
            <li 
              style={{
                ...styles.navItem,
                ...(window.location.pathname === '/job-listings' ? styles.activeNavItem : {})
              }} 
              onClick={() => navigate("/job-listings")}
              onMouseOver={(e) => {
                if (window.location.pathname !== '/job-listings') {
                  e.target.style.color = '#3b82f6';
                }
              }}
              onMouseOut={(e) => {
                if (window.location.pathname !== '/job-listings') {
                  e.target.style.color = '#4b5563';
                }
              }}
            >
              Search Jobs
            </li>
            <li 
              style={{
                ...styles.navItem,
                ...(window.location.pathname === '/news' ? styles.activeNavItem : {})
              }} 
              onClick={() => navigate("/news")}
              onMouseOver={(e) => {
                if (window.location.pathname !== '/news') {
                  e.target.style.color = '#3b82f6';
                }
              }}
              onMouseOut={(e) => {
                if (window.location.pathname !== '/news') {
                  e.target.style.color = '#4b5563';
                }
              }}
            >
              Employment News
            </li>
            <li 
              style={{
                ...styles.navItem,
                ...(window.location.pathname === '/profile-setup' ? styles.activeNavItem : {})
              }} 
              onClick={() => navigate("/profile-setup")}
              onMouseOver={(e) => {
                if (window.location.pathname !== '/profile-setup') {
                  e.target.style.color = '#3b82f6';
                }
              }}
              onMouseOut={(e) => {
                if (window.location.pathname !== '/profile-setup') {
                  e.target.style.color = '#4b5563';
                }
              }}
            >
              Update Profile
            </li>
            <li 
              style={{
                ...styles.navItem,
                ...(window.location.pathname === '/builder' ? styles.activeNavItem : {})
              }} 
              onClick={() => navigate("/builder")}
              onMouseOver={(e) => {
                if (window.location.pathname !== '/builder') {
                  e.target.style.color = '#3b82f6';
                }
              }}
              onMouseOut={(e) => {
                if (window.location.pathname !== '/builder') {
                  e.target.style.color = '#4b5563';
                }
              }}
            >
              Create Resume
            </li>
          </ul>
        </div>
        {/* Logout button removed as requested */}
      </div>

      {/* <header style={styles.header}>
        <h1 style={styles.headerTitle}>Employment News</h1>
        <p style={styles.headerSubtitle}>Latest articles about employment from around the world</p>
      </header> */}

      {loading ? (
        <div style={styles.loading}>Loading news articles...</div>
      ) : error ? (
        <div style={styles.error}>Error: {error}</div>
      ) : news.length === 0 ? (
        <div style={styles.noNews}>No news articles found.</div>
      ) : (
        <>
          <div style={styles.newsList}>
            {currentItems.map((article, index) => (
              <div 
                key={index} 
                style={styles.newsItem}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.08)';
                }}
              >
                <div style={styles.imgContainer}>
                  {article.socialimage ? (
                    <img 
                      src={article.socialimage} 
                      alt={article.title}
                      style={styles.image}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML += '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #95a5a6; font-weight: 500; font-size: 1rem;">No Image Available</div>';
                      }}
                    />
                  ) : (
                    <div style={styles.noImageText}>No Image Available</div>
                  )}
                </div>
                <div style={styles.content}>
                  <h2 style={styles.title}>{article.title}</h2>
                  <p style={styles.description}>
                    {article.title.length > 100 ? `${article.title.substring(0, 100)}...` : article.title}
                  </p>
                  <div style={styles.meta}>
                    {article.domain && <span style={styles.metaItem}>{article.domain}</span>}
                    {article.sourcecountry && <span style={styles.metaItem}>{article.sourcecountry}</span>}
                  </div>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={styles.readMore}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#2980b9';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#3498db';
                    }}
                  >
                    Read Full Article
                  </a>
                </div>
              </div>
            ))}
          </div>

          <nav style={styles.paginationContainer}>
            <ul style={styles.pagination}>
              {/* First page button */}
              {totalPages > 5 && (
                <li style={styles.pageItem}>
                  <button 
                    onClick={() => paginate(1)}
                    style={{
                      ...styles.arrowButton,
                      ...(currentPage === 1 ? styles.disabledPageLink : {})
                    }}
                    disabled={currentPage === 1}
                  >
                    ≪
                  </button>
                </li>
              )}
              
              {/* Previous button */}
              <li style={styles.pageItem}>
                <button 
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  style={{
                    ...styles.arrowButton,
                    ...(currentPage === 1 ? styles.disabledPageLink : {})
                  }}
                  disabled={currentPage === 1}
                >
                  ←
                </button>
              </li>
              
              {/* Ellipsis if not showing from first page */}
              {startPage > 1 && (
                <li style={styles.ellipsis}>...</li>
              )}
              
              {/* Page numbers */}
              {pageNumbers.map(number => (
                <li key={number} style={styles.pageItem}>
                  <button 
                    onClick={() => paginate(number)} 
                    style={{
                      ...styles.pageLink,
                      ...(currentPage === number ? styles.activePageLink : {})
                    }}
                  >
                    {number}
                  </button>
                </li>
              ))}
              
              {/* Ellipsis if not showing to last page */}
              {endPage < totalPages && (
                <li style={styles.ellipsis}>...</li>
              )}
              
              {/* Next button */}
              <li style={styles.pageItem}>
                <button 
                  onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                  style={{
                    ...styles.arrowButton,
                    ...(currentPage === totalPages ? styles.disabledPageLink : {})
                  }}
                  disabled={currentPage === totalPages}
                >
                  →
                </button>
              </li>
              
              {/* Last page button */}
              {totalPages > 5 && (
                <li style={styles.pageItem}>
                  <button 
                    onClick={() => paginate(totalPages)}
                    style={{
                      ...styles.arrowButton,
                      ...(currentPage === totalPages ? styles.disabledPageLink : {})
                    }}
                    disabled={currentPage === totalPages}
                  >
                    ≫
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

export default NewsPage;