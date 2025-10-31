import React, { createContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Create a lightweight demo user object
  const createDemoUser = () => ({
    uid: "demo-user",
    displayName: "Demo User",
    email: "demo@studyvibe.local",
    isAnonymous: true,
    demo: true,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Real authenticated user
        localStorage.removeItem("studyvibe_demo");
        setUser(firebaseUser);
      } else {
        // If no Firebase user, check for demo flag
        const isDemo = localStorage.getItem("studyvibe_demo") === "true";
        if (isDemo) {
          setUser(createDemoUser());
        } else {
          setUser(null);
        }
      }
    });
    return () => unsub();
  }, []);

  // Expose a helper to enter demo mode
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
