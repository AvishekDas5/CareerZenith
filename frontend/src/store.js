import { configureStore } from "@reduxjs/toolkit";
import { applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import jobReducer from "./reducers/jobReducer"; // Ensure this path is correct

const store = configureStore({
  reducer: {
    jobs: jobReducer, // Include your reducers
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
