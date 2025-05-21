import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5003/api";

// Action Types
export const FETCH_JOBS_REQUEST = "FETCH_JOBS_REQUEST";
export const FETCH_JOBS_SUCCESS = "FETCH_JOBS_SUCCESS";
export const FETCH_JOBS_FAILURE = "FETCH_JOBS_FAILURE";

// Thunk Action Creator
export const fetchRecommendedJobs = (userId) => async (dispatch) => {
    dispatch({ type: FETCH_JOBS_REQUEST }); // Indicate loading

    try {
        console.log(`Fetching jobs from: http://127.0.0.1:5003/api/recommend_jobs/${userId}`);
        const response = await axios.get(`${API_BASE_URL}/recommend_jobs/${userId}`);
        dispatch({
            type: FETCH_JOBS_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_JOBS_FAILURE,
            payload: error.message,
        });
    }
};
