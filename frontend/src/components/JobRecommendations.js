import React from "react";
import { useSelector } from "react-redux";

const styles = {
  container: {
    backgroundColor: "#ffffff",
    color: "#333",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
    maxWidth: "900px",
    margin: "24px auto",
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#3a86ff",
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "24px",
    letterSpacing: "0.5px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  listItem: {
    backgroundColor: "#f8fafc",
    margin: 0,
    padding: "20px",
    borderRadius: "10px",
    borderLeft: "6px solid #3a86ff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    transition: "all 0.3s ease",
  },
  jobTitle: {
    margin: "0 0 8px 0",
    color: "#2563eb",
    fontSize: "18px",
    fontWeight: "600",
  },
  jobCompany: {
    margin: "0 0 16px 0",
    fontSize: "15px",
    color: "#4b5563",
    fontWeight: "500",
  },
  jobLink: {
    display: "inline-block",
    marginTop: "6px",
    padding: "10px 16px",
    backgroundColor: "#3a86ff",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
    letterSpacing: "0.3px",
    transition: "background-color 0.2s ease, transform 0.2s ease",
    border: "none",
    cursor: "pointer",
  },
  loadingText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: "16px",
    padding: "20px 0",
  },
  errorText: {
    textAlign: "center",
    color: "#ef4444",
    backgroundColor: "#fee2e2",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "500",
  },
  emptyState: {
    textAlign: "center",
    color: "#6b7280",
    padding: "24px 0",
    fontSize: "16px",
  }
};

const JobRecommendations = () => {
  const { recommendedJobs, loading, error } = useSelector((state) => state.jobs);

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Recommended Jobs</h3>
      {loading && <p style={styles.loadingText}>Loading your recommendations...</p>}
      {error && <p style={styles.errorText}>Error: {error}</p>}
      <ul style={styles.list}>
        {recommendedJobs.length > 0 ? (
          recommendedJobs.map((job) => (
            <li
              key={job.id}
              style={styles.listItem}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
              }}
            >
              <h4 style={styles.jobTitle}>{job.title}</h4>
              <p style={styles.jobCompany}>{job.company}</p>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.jobLink}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#3a86ff";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Apply Now
              </a>
            </li>
          ))
        ) : (
          <p style={styles.emptyState}>No job recommendations available at the moment.</p>
        )}
      </ul>
    </div>
  );
};

export default JobRecommendations;