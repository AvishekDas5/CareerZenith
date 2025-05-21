import {
    FETCH_JOBS_REQUEST,
    FETCH_JOBS_SUCCESS,
    FETCH_JOBS_FAILURE,
} from "../actions/jobActions";

const initialState = {
    recommendedJobs: [],
    loading: false,
    error: null,
};

const jobReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_JOBS_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_JOBS_SUCCESS:
            return { ...state, loading: false, recommendedJobs: action.payload };
        case FETCH_JOBS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default jobReducer;
