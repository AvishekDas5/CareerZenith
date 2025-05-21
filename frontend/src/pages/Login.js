import React, { useState, useEffect } from "react";
import { loginWithEmail, loginWithGoogle } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

const styles = {
  authPage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundImage: "url('login_bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  authContainer: {
    display: "flex",
    flexDirection: "column",
    padding: "40px 30px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
    textAlign: "center",
    width: "90%",
    maxWidth: "350px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  authTitle: {
    fontSize: "26px",
    marginBottom: "26px",
    color: "#333",
    fontWeight: "600",
  },
  authForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  input: {
    padding: "14px 16px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "10px",
    fontSize: "16px",
    background: "#fff",
    width: "85%",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  },
  inputFocus: {
    outline: "none",
    borderColor: "#4a90e2",
    boxShadow: "0 0 0 2px rgba(74, 144, 226, 0.15)",
  },
  button: {
    background: "#4a90e2",
    color: "#fff",
    padding: "14px",
    marginTop: "22px",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.3s ease, transform 0.1s ease",
    width: "70%",
    boxShadow: "0 2px 6px rgba(74, 144, 226, 0.2)",
  },
  buttonHover: {
    background: "#357ab8",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 8px rgba(74, 144, 226, 0.25)",
  },
  buttonActive: {
    transform: "translateY(1px)",
    boxShadow: "0 1px 3px rgba(74, 144, 226, 0.25)",
  },
  googleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
    color: "#333",
    border: "1px solid #ddd",
    padding: "12px",
    marginTop: "16px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: "70%",
    alignSelf: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  googleButtonHover: {
    background: "#f5f5f5",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  errorMessage: {
    color: "#e53935",
    fontSize: "14px",
    marginBottom: "12px",
    padding: "8px 12px",
    background: "rgba(229, 57, 53, 0.08)",
    borderRadius: "6px",
    width: "85%",
    textAlign: "center",
  },
  loadingSpinner: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    borderTopColor: "#fff",
    animation: "spin 0.8s linear infinite",
    marginRight: "8px",
  },
  googleIcon: {
    marginRight: "10px",
  },
};

// Add keyframe animation for spinner
const addSpinnerAnimation = () => {
  const styleSheet = document.styleSheets[0];
  try {
    const keyframes = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  } catch (e) {
    // Animation might already exist
  }
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Add spinner animation once on component mount
    addSpinnerAnimation();
    
    // Check if user is already logged in
    if (user) {
      checkUserProfile();
    }
  }, [user]);

  const checkUserProfile = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const profile = userDoc.data();
        if (profile.location && profile.preferred_role && profile.skills?.length > 0) {
          navigate("/dashboard");
        } else {
          navigate("/profile-setup");
        }
      } else {
        navigate("/profile-setup");
      }
    } catch (err) {
      console.error("Error checking user profile:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await loginWithEmail(email, password);
      
      if (user) {
        await checkUserProfile();
      }
    } catch (err) {
      let errorMessage = "Failed to login. Please check your credentials.";
      
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      await loginWithGoogle();
      
      if (user) {
        await checkUserProfile();
      }
    } catch (err) {
      setError("Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.authPage}>
      <div style={styles.authContainer}>
        <h2 style={styles.authTitle}>Login</h2>
        {error && <div style={styles.errorMessage}>{error}</div>}
        <form style={styles.authForm} onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            style={{
              ...styles.input,
              ...(emailFocused ? styles.inputFocus : {}),
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            style={{
              ...styles.input,
              ...(passwordFocused ? styles.inputFocus : {}),
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => Object.assign(e.target.style, styles.buttonHover)}
            onMouseOut={(e) => {
              e.target.style.background = styles.button.background;
              e.target.style.transform = "";
              e.target.style.boxShadow = styles.button.boxShadow;
            }}
            onMouseDown={(e) => Object.assign(e.target.style, styles.buttonActive)}
            onMouseUp={(e) => Object.assign(e.target.style, styles.buttonHover)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span style={styles.loadingSpinner}></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <button
          style={styles.googleButton}
          onClick={handleGoogleLogin}
          onMouseOver={(e) => Object.assign(e.target.style, styles.googleButtonHover)}
          onMouseOut={(e) => {
            e.target.style.background = styles.googleButton.background;
            e.target.style.boxShadow = styles.googleButton.boxShadow;
          }}
          disabled={isLoading}
        >
          <FcGoogle size={20} style={styles.googleIcon} />
          {isLoading ? "Processing..." : "Login with Google"}
        </button>
      </div>
    </div>
  );
};

export default Login;