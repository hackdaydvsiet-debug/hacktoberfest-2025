import Login from "./pages/Login.jsx";
import Signup from "./pages/signup_test.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/authContext.jsx";
import Contact from "./pages/Contact.jsx";
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";

// Main app component with routing
// Uses protected routes - you need to be logged in to see the dashboard
function App() {
  // Check if user is logged in (works for both Firebase and demo mode)
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Routes>
        {/* Home - protected route */}
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to={"/login"} />}
        />

        {/* Auth pages - redirect to dashboard if already logged in */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />

        {/* Public pages */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />

        {/* Catch-all - send to login if not authenticated */}
        <Route path="*" element={<Navigate to={"/login"} />} />
      </Routes>
    </div>
  );
}

export default App;
