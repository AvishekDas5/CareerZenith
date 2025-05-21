import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  store  from "./store";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import AboutNewsPage from "./pages/AboutNewsPage";
import NewsPage from "./pages/NewsPage";
import NewsHomePage from "./pages/NewsHomePage";
import JobListings from "./pages/JobListings";
import Home from './components/Home';
import ResumeBuilder from './components/ResumeBuilder';
import ViewResume from './components/ViewResume';
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="/aboutnews" element={<AboutNewsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news-home" element={<NewsHomePage />} />
        <Route path="/job-listings" element={<JobListings />} />
        <Route path="/resume-home" element={<Home />} />
        <Route path="/builder" element={<ResumeBuilder />} />
        <Route path="/view-resume/:pdfUrl" element={<ViewResume />} />
      </Routes>
    </Router>
    </AuthProvider>
    </Provider>
  );
}

export default App;
