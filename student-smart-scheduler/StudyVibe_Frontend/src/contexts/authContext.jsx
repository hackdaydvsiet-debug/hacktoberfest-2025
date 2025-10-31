import React, { createContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

// This context provides auth state to the whole app
// Components can use this to check if someone is logged in
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Helper to create a fake "demo" user for people who want to try the app
  // without creating an account
  const createDemoUser = () => ({
    uid: "demo-user",
    displayName: "Demo User",
    email: "demo@studyvibe.local",
    isAnonymous: true,
    demo: true,
  });

  useEffect(() => {
    // Listen for Firebase auth changes
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Real user logged in with Google/email
        localStorage.removeItem("studyvibe_demo");
        setUser(firebaseUser);
      } else {
        // No Firebase user - check if they're in demo mode
        const isDemo = localStorage.getItem("studyvibe_demo") === "true";
        if (isDemo) {
          // Restore demo session
          setUser(createDemoUser());
        } else {
          // Not logged in at all
          setUser(null);
        }
      }
    });
    // Clean up listener when component unmounts
    return () => unsub();
  }, []);

  // Function to put someone into demo mode
  // Called from the Login page when they click "Continue as Demo"
  const loginAsDemo = () => {
    localStorage.setItem("studyvibe_demo", "true");
    setUser(createDemoUser());
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
}
