import { getAuth, signOut } from "firebase/auth";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

const auth = getAuth();

// Hook for logging out
// Cleans up both Firebase auth and demo mode
const useLogout = () => {
  const { setUser } = useContext(AuthContext);

  const logout = async () => {
    try {
      // Sign out from Firebase (if they were logged in)
      await signOut(auth);
      console.log("User signed out successfully");

      // Clean up any stored tokens or demo flags
      localStorage.removeItem("token");
      localStorage.removeItem("studyvibe_demo");

      // Clear user state
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return { logout };
};

export default useLogout;
