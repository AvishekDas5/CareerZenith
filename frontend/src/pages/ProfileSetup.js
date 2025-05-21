import React, { useState, useRef, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProfileSetup = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    location: "",
    preferred_role: "",
    skills: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [focused, setFocused] = useState(null);
  const skillInputRef = useRef(null);

  const navigate = useNavigate();

  const jobRoles = [
    "Frontend Developer",
    "Backend Developer",
    "React Developer",
    "UI/UX Designer",
    "Product Manager",
    "Data Scientist",
    "DevOps Engineer",
    "QA Engineer",
    "Mobile Developer",
    "Machine Learning Engineer",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  const addSkill = (skill) => {
    if (skill.trim() && !form.skills.includes(skill.trim())) {
      setForm({
        ...form,
        skills: [...form.skills, skill.trim()],
      });
    }
  };

  const handleSkillInputKeyDown = (e) => {
    if (["Enter", "Tab", ",", " "].includes(e.key)) {
      e.preventDefault();
      addSkill(skillInput);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setForm({
      ...form,
      skills: form.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error("No user found");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        location: form.location,
        preferred_role: form.preferred_role,
        skills: form.skills,
      });

      console.log("Profile saved successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: "url('profile_bg_5.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12), 0 1px 5px rgba(0, 0, 0, 0.03)",
          padding: "45px 35px",
          borderRadius: "16px",
          width: "90%",
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "2rem",
            color: "#1a1a1a",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Complete Your Profile
        </h2>
        
        <div style={inputContainerStyle}>
          <label htmlFor="location" style={labelStyle}>Location</label>
          <input
            id="location"
            name="location"
            placeholder="Where are you based?"
            value={form.location}
            onChange={handleChange}
            onFocus={() => setFocused("location")}
            onBlur={() => setFocused(null)}
            required
            style={{
              ...inputStyle,
              borderColor: focused === "location" ? "#007bff" : "#ddd",
              boxShadow: focused === "location" ? "0 0 0 3px rgba(0, 123, 255, 0.1)" : "none",
            }}
          />
        </div>
        
        <div style={inputContainerStyle}>
          <label htmlFor="preferred_role" style={labelStyle}>Preferred Role</label>
          <select
            id="preferred_role"
            name="preferred_role"
            value={form.preferred_role}
            onChange={handleChange}
            onFocus={() => setFocused("preferred_role")}
            onBlur={() => setFocused(null)}
            required
            style={{
              ...inputStyle,
              borderColor: focused === "preferred_role" ? "#007bff" : "#ddd",
              boxShadow: focused === "preferred_role" ? "0 0 0 3px rgba(0, 123, 255, 0.1)" : "none",
              appearance: "auto",
            }}
          >
            <option value="" disabled>Select your preferred role</option>
            {jobRoles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        
        <div style={inputContainerStyle}>
          <label htmlFor="skills" style={labelStyle}>Skills</label>
          <div 
            style={{
              ...inputStyle,
              borderColor: focused === "skills" ? "#007bff" : "#ddd",
              boxShadow: focused === "skills" ? "0 0 0 3px rgba(0, 123, 255, 0.1)" : "none",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "6px",
              cursor: "text",
              minHeight: "54px",
              padding: "8px 15px",
            }}
            onClick={() => skillInputRef.current?.focus()}
          >
            {form.skills.map((skill, index) => (
              <div
                key={index}
                style={skillTagStyle}
              >
                {skill}
                <span 
                  style={removeSkillStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSkill(skill);
                  }}
                >
                  ×
                </span>
              </div>
            ))}
            <input
              ref={skillInputRef}
              id="skills"
              value={skillInput}
              onChange={handleSkillInputChange}
              onKeyDown={handleSkillInputKeyDown}
              onFocus={() => setFocused("skills")}
              onBlur={() => {
                setFocused(null);
                if (skillInput.trim()) {
                  addSkill(skillInput);
                  setSkillInput("");
                }
              }}
              placeholder={form.skills.length === 0 ? "JavaScript, React, UI/UX, etc." : ""}
              style={{
                flex: "1 0 80px",
                border: "none",
                outline: "none",
                fontSize: "1rem",
                background: "transparent",
                color: "#333",
                padding: "6px 0",
                minWidth: "80px",
              }}
            />
          </div>
          <p style={helperTextStyle}>Press Enter, Space, or Comma to add a skill</p>
        </div>
        
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => {
            e.target.style.background = "#0056b3";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#007bff";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

const inputContainerStyle = {
  width: "100%",
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "0.9rem",
  fontWeight: "500",
  color: "#444",
};

const inputStyle = {
  width: "100%",
  padding: "15px",
  border: "1.5px solid #ddd",
  borderRadius: "12px",
  fontSize: "1rem",
  background: "#fafafa",
  color: "#333",
  outline: "none",
  transition: "all 0.2s ease-in-out",
  boxSizing: "border-box",
};

const skillTagStyle = {
  background: "#e6f0ff",
  color: "#0066cc",
  fontSize: "0.9rem",
  padding: "4px 10px",
  borderRadius: "100px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const removeSkillStyle = {
  color: "#0066cc",
  fontWeight: "bold",
  fontSize: "1.2rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "18px",
  height: "18px",
  borderRadius: "50%",
  transition: "all 0.2s ease",
  marginLeft: "2px",
};

const helperTextStyle = {
  fontSize: "0.8rem",
  color: "#777",
  marginTop: "6px",
  marginLeft: "4px",
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  marginTop: "10px",
  border: "none",
  borderRadius: "12px",
  background: "#007bff",
  color: "#fff",
  fontSize: "1.05rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 6px rgba(0, 123, 255, 0.12)",
};

export default ProfileSetup;