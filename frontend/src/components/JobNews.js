import React, { useEffect, useState } from "react";

function JobNews() {
  const [articles, setArticles] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8001/news")
      .then((response) => response.json())
      .then((data) => {
        const uniqueTitles = new Map();
  
        // Prefer entries with images first
        data.forEach((article) => {
          const titleKey = article.title?.toLowerCase().trim();
          if (!titleKey) return;
          if (!uniqueTitles.has(titleKey)) {
            uniqueTitles.set(titleKey, article);
          } else {
            // If duplicate title exists but current one has image and previous doesn't, replace
            const existing = uniqueTitles.get(titleKey);
            if (!existing.socialimage && article.socialimage) {
              uniqueTitles.set(titleKey, article);
            }
          }
        });
  
        const filteredArticles = Array.from(uniqueTitles.values());
        setArticles(filteredArticles);
      })
      .catch((error) => console.error("Error fetching news:", error));
  }, []);
  

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, 20));
  };

  const outerCardStyle = {
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#f0f2f5",
    borderRadius: "16px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    fontFamily: "Segoe UI, sans-serif"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "32px",
    color: "#222"
  };

  const articleCardStyle = {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "transform 0.2s ease-in-out"
  };

  const imageWrapperStyle = {
    width: "33.33%",
    minWidth: "200px",
    height: "200px",
    overflow: "hidden",
    position: "relative"
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease-in-out"
  };

  const imageHoverStyle = {
    transform: "scale(1.05)"
  };

  const noImageStyle = {
    width: "100%",
    height: "100%",
    backgroundColor: "#ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#666",
    fontSize: "16px",
    textTransform: "uppercase"
  };

  const articleContentStyle = {
    flex: 1,
    padding: "20px"
  };

  const titleStyle = {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#003366"
  };

  const metaStyle = {
    fontSize: "14px",
    color: "#666",
    marginBottom: "10px"
  };

  const linkStyle = {
    fontSize: "15px",
    color: "#007BFF",
    textDecoration: "none",
    fontWeight: "bold"
  };

  const loadMoreBtnStyle = {
    display: "block",
    margin: "20px auto 0",
    padding: "12px 24px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
  };

  return (
    <div style={outerCardStyle}>
      <h1 style={headerStyle}>Employment News</h1>
      {articles.length > 0 ? (
        <>
          {articles.slice(0, visibleCount).map((article, index) => (
            <div
              key={index}
              style={articleCardStyle}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div style={imageWrapperStyle}>
                {article.socialimage ? (
                  <img
                    src={article.socialimage}
                    alt=""
                    style={{
                      ...imageStyle,
                      ...(hoveredIndex === index ? imageHoverStyle : {})
                    }}
                  />
                ) : (
                  <div style={noImageStyle}>No Image</div>
                )}
              </div>
              <div style={articleContentStyle}>
                <h2 style={titleStyle}>{article.title}</h2>
                <p style={metaStyle}>
                  <strong>Source:</strong> {article.domain}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                >
                  Read Full Article →
                </a>
              </div>
            </div>
          ))}

          {visibleCount < Math.min(articles.length, 20) && (
            <button onClick={handleLoadMore} style={loadMoreBtnStyle}>
              Load More
            </button>
          )}
        </>
      ) : (
        <p style={{ textAlign: "center" }}>Loading news...</p>
      )}
    </div>
  );
}

export default JobNews;
