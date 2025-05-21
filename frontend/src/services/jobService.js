import axios from "axios";

const API_URL = "http://localhost:5001/api/jobs"; // Backend Job Scraper API

export const fetchJobs = async (keyword, location, salary, isRemote) => {
  try {
    const params = {
      keyword,
      location,
      salary: salary || "", // Default empty string if no salary is selected
      remote: isRemote ? "yes" : "", // Convert boolean to "yes" or empty string
    };

    console.log("Fetching jobs with params:", params);

    const response = await axios.get(API_URL, { params });

    if (response.data && response.data.jobs) {
      return response.data.jobs;
    } else {
      console.warn("No jobs found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};
