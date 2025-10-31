import React from "react";
import { AuthProvider } from "./contexts/authContext";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
