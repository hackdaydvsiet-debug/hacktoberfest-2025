import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

const useSignup = () => {
  const [loading, setLoading] = useState(false);

  const signup = async ({email, password, confirmPassword}) => {
    const success = handleInputErrors(email, password, confirmPassword);
    if (!success) return;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User signed up:", user);
    } catch (error) {
      window.alert("Error signing up:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
};

export default useSignup;

function handleInputErrors(email, password, confirmPassword) {
  console.log("password", password);
  if (password !== confirmPassword) {
    window.alert("Passwords do not match");
    return false;
  }
  if (!email || !password) {
    window.alert("Please fill in all fields");
    return false;
  }

  return true;
}
