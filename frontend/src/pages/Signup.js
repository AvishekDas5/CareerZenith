import React, { useState } from "react";
import { signUpWithEmail } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }
    
    return errors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        await signUpWithEmail(formData.email, formData.password, formData.fullName);
        navigate("/login", { state: { message: "Account created successfully! Please log in." } });
      } catch (err) {
        setError(err.message);
        setIsSubmitting(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

  const styles = {
    root: {
      "--primary-color": "#4a90e2",
      "--background-color": "#f9f9f9",
      "--text-color": "#333",
      "--input-bg": "#fff",
      "--input-border": "#ccc",
      "--button-hover": "#357ab8",
    },
    authPage: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundImage: "url('abstract_background.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      padding: "20px", // Add some padding to ensure no overflow on mobile or small screens
      boxSizing: "border-box", // Ensure padding does not cause overflow
    },
    authContainer: {
      display: "flex",
      flexDirection: "column",
      minWidth: "380px",
      width: "100%",  // Make sure it takes up full width but doesn't overflow
      maxWidth: "480px", // Limit the max width for large screens
      padding: "30px",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
      textAlign: "center",
      boxSizing: "border-box", // Prevent padding from causing overflow
    },
    authTitle: {
      fontSize: "28px",
      marginBottom: "10px",
      color: "#333",
      fontWeight: "600",
    },
    authSubtitle: {
      fontSize: "16px",
      marginBottom: "25px",
      color: "#666",
    },
    authForm: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%", // Ensure the form takes up the full width of the container
    },
    formGroup: {
      width: "100%",
      marginBottom: "16px",
      textAlign: "left",
    },
    label: {
      display: "block",
      marginBottom: "6px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#555",
    },
    input: {
      padding: "12px 16px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      fontSize: "16px",
      background: "#fff",
      width: "100%", // Ensure input takes full width of the form
      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      boxSizing: "border-box", // Ensure padding doesn't cause overflow
    },
    inputError: {
      borderColor: "#e74c3c",
      backgroundColor: "#fff8f8",
    },
    errorText: {
      color: "#e74c3c",
      fontSize: "13px",
      marginTop: "5px",
      marginLeft: "4px",
    },
    button: {
      background: "#4a90e2",
      color: "#fff",
      padding: "14px",
      marginTop: "10px",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background 0.3s ease, transform 0.1s ease",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonHover: {
      background: "#357ab8",
      transform: "translateY(-1px)",
    },
    buttonDisabled: {
      background: "#92b6e0",
      cursor: "not-allowed",
    },
    loginRedirect: {
      marginTop: "20px",
      fontSize: "15px",
      color: "#555",
    },
    loginRedirectLink: {
      color: "#4a90e2",
      textDecoration: "none",
      fontWeight: "bold",
      transition: "color 0.3s ease",
    },
    errorMessage: {
      color: "#e74c3c",
      fontSize: "14px",
      marginBottom: "15px",
      padding: "10px",
      backgroundColor: "#fff8f8",
      borderRadius: "6px",
      borderLeft: "4px solid #e74c3c",
    },
    passwordStrength: {
      marginTop: "5px",
      fontSize: "13px",
      color: "#666",
    },
    divider: {
      margin: "20px 0",
      width: "100%",
      borderTop: "1px solid #eee",
    }
    
  };

  return (
    <div style={styles.authPage}>
      <div style={styles.authContainer}>
        <h2 style={styles.authTitle}>Create Account</h2>
        <p style={styles.authSubtitle}>Join our community today</p>
        
        {error && <div style={styles.errorMessage}>{error}</div>}
        
        <form style={styles.authForm} onSubmit={handleSignup}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              style={{
                ...styles.input,
                ...(formErrors.fullName ? styles.inputError : {})
              }}
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />
            {formErrors.fullName && <p style={styles.errorText}>{formErrors.fullName}</p>}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              style={{
                ...styles.input,
                ...(formErrors.email ? styles.inputError : {})
              }}
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && <p style={styles.errorText}>{formErrors.email}</p>}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              style={{
                ...styles.input,
                ...(formErrors.password ? styles.inputError : {})
              }}
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.password && <p style={styles.errorText}>{formErrors.password}</p>}
            {formData.password && (
              <p style={styles.passwordStrength}>
                {formData.password.length < 6 ? "Weak password" : 
                 formData.password.length < 10 ? "Good password" : "Strong password"}
              </p>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              style={{
                ...styles.input,
                ...(formErrors.confirmPassword ? styles.inputError : {})
              }}
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {formErrors.confirmPassword && <p style={styles.errorText}>{formErrors.confirmPassword}</p>}
          </div>
          
          <button 
            style={{
              ...styles.button,
              ...(isSubmitting ? styles.buttonDisabled : {})
            }}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        
        <div style={styles.divider}></div>
        
        <p style={styles.loginRedirect}>
          Already have an account?{" "}
          <a style={styles.loginRedirectLink} href="/login">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;