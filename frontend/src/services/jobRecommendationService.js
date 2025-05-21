import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5003/api";  // Adjust if deployed

// Fetch job recommendations for a user
export const fetchRecommendedJobs = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/recommend_jobs/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching job recommendations:", error);
        return [];
    }
};
