import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

// Function to handle login
const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const success = handleInputErrors(email, password)
    if (!success) return;
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User signed in:", user);
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
    finally {
      setLoading(false);
    }
  };

  return { login,loading };
};

export default useLogin;


function handleInputErrors(email, password) {
	if (!email || !password) {
		window.alert("Please fill in all fields");
		return false;
	}

	return true;
}