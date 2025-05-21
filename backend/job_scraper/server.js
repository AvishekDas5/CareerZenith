const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Job Filtering Function
const filterJobs = (jobs, { jobType, salary, experience, remote, sortBy, location }) => {
  let filteredJobs = jobs;

  // ✅ Ensure jobs match the requested location
  if (location) {
    filteredJobs = filteredJobs.filter((job) =>
      job.location?.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (jobType) {
    filteredJobs = filteredJobs.filter((job) => job.job_type?.toLowerCase() === jobType);
  }

  if (salary) {
    filteredJobs = filteredJobs.filter((job) => job.salary && parseInt(job.salary) >= parseInt(salary));
  }

  if (experience) {
    filteredJobs = filteredJobs.filter((job) => job.experience_level?.toLowerCase() === experience);
  }

  if (remote) {
    filteredJobs = filteredJobs.filter((job) => job.is_remote === "yes");
  }

  // ✅ Sorting Logic
  if (sortBy === "salary_high") {
    filteredJobs.sort((a, b) => (b.salary || 0) - (a.salary || 0));
  } else if (sortBy === "newest") {
    filteredJobs.sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));
  }

  return filteredJobs;
};

// ✅ Job Fetching Route
app.get("/api/jobs", async (req, res) => {
  const { keyword, location, jobType, salary, experience, remote, sortBy } = req.query;

  try {
    console.log(`Fetching jobs for: ${keyword} in ${location}`);

    // Fetch jobs from the job scraping API
    const response = await axios.get(`http://127.0.0.1:8000/scrape_jobs`, {
      params: { search_term: keyword, location },
    });

    console.log("Raw API Response: ", response.data);

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ jobs: [], message: "No jobs found" });
    }

    // Apply filtering logic
    const jobs = filterJobs(response.data, { jobType, salary, experience, remote, sortBy, location });

    console.log("Filtered Jobs: ", jobs.length);
    res.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    res.status(500).json({ error: "Failed to fetch job data" });
  }
});

// ✅ Start Server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Job Scraper Server running on port ${PORT}`);
});
