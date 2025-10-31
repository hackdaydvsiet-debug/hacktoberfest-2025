import { getAuth, signOut } from "firebase/auth";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";


const auth = getAuth();

const useLogout = () => {
const { setUser } = useContext(AuthContext);

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      localStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return { logout };
};

export default useLogout;
