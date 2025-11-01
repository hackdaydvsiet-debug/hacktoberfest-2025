import React from "react";
import { AuthProvider } from "./contexts/authContext";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Entry point for the app
// Sets up routing and wraps everything in AuthProvider for global auth state

// Configure router with future flags for React Router v7 compatibility
const router = createBrowserRouter(
  [
    {
      path: "/*",
      element: <App />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

// Render the app
// StrictMode helps catch potential problems during development
// AuthProvider makes user auth state available everywhere
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
