import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebaseConfig"; // Import Firebase auth
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext(null); // Create AuthContext

export const useAuth = () => useContext(AuthContext); // Hook to use AuthContext

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Logout function
  const logout = () => {
    // Firebase sign out
    signOut(auth)
      .then(() => {
        // Clear sessionStorage and localStorage
        sessionStorage.removeItem("user");
        localStorage.removeItem("user");
        sessionStorage.clear();
        localStorage.clear();
        console.log("User logged out successfully");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
