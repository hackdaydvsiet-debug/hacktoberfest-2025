import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

// Custom hook for handling email/password login
// Returns a login function and loading state for the UI
const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    // Quick validation before we hit Firebase
    const success = handleInputErrors(email, password);
    if (!success) return;

    setLoading(true);
    try {
      // Firebase does the heavy lifting
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User signed in:", user);
      // Note: The auth context will pick this up automatically
    } catch (error) {
      // Usually wrong password or user doesn't exist
      console.error("Error signing in:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};

export default useLogin;

// Simple validation helper
function handleInputErrors(email, password) {
  if (!email || !password) {
    window.alert("Please fill in all fields");
    return false;
  }

  return true;
}
