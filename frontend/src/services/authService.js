import { auth, db } from "../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// 🔹 Signup with Email & Password
export const signUpWithEmail = async (email, password, fullName) => {
  console.log("Received Full Name in Service:", fullName);
  if (!fullName) {
    throw new Error("Full Name is required");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("User created:", user.uid);

    await updateProfile(user, {
      displayName: fullName
    });

    const userRef = doc(db, "users", user.uid);

    await setDoc(userRef, {
      fullName,
      email,
      uid: user.uid,
      createdAt: new Date(),
    });

    console.log("User data saved to Firestore!");
    return user;

  } catch (error) {
    throw error;
  }
};

// 🔹 Login with Email & Password
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// 🔹 Get User Profile from Firestore
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    throw error;
  }
};

// 🔹 Login with Google
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    throw error;
  }
};

// 🔹 Logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// 🔹 Set up reCAPTCHA for Phone Auth
export const setupRecaptcha = (containerId = "recaptcha-container") => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(containerId, {
      size: "invisible",
      callback: (response) => {
        console.log("reCAPTCHA verified");
      },
      "expired-callback": () => {
        console.warn("reCAPTCHA expired");
      },
    }, auth);
  }
};

// 🔹 Login with Phone Number (send OTP)
export const loginWithPhone = async (phoneNumber) => {
  setupRecaptcha("recaptcha-container");

  const appVerifier = window.recaptchaVerifier;
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult; // To be used for OTP verification
  } catch (error) {
    throw error;
  }
};

// 🔹 Verify OTP
export const verifyOtp = async (confirmationResult, otp) => {
  try {
    const result = await confirmationResult.confirm(otp);
    return result.user;
  } catch (error) {
    throw error;
  }
};
