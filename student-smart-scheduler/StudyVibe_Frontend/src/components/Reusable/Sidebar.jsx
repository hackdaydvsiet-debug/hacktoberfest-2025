import React, { useState, useRef, useEffect } from "react";
import useLogout from "../../hooks/useLogout";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaEnvelope,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside of it
  useEffect(() => {
    if (!isSidebarOpen) return;

    function handleOutsideClick(event) {
      const clickedSidebar = sidebarRef.current?.contains(event.target);
      const clickedToggleBtn = event.target.closest(".sidebar-toggle-btn");
      if (!clickedSidebar && !clickedToggleBtn) {
        setIsSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isSidebarOpen]);

  // Logout function
  const { logout } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navigate = useNavigate();

  const navToDashboard = () => {
    navigate("/");
  };

  const navToContact = () => {
    navigate("/contact");
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 btn btn-circle btn-ghost sidebar-toggle-btn"
        onClick={() => setIsSidebarOpen((open) => !open)}
        aria-label="Toggle Sidebar">
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen bg-base-200 shadow-lg flex flex-col transition-all duration-300 z-40 ${
          isSidebarOpen ? "w-48" : "w-0 overflow-hidden"
        }`}
        style={{ minWidth: isSidebarOpen ? "16rem" : "0" }}>
        <div className="p-6 flex items-center justify-center border-b border-base-300">
          <span className="text-xl font-bold text-primary">Smart Planner</span>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-4">
          <button
            className="btn  w-full btn-ghost  justify-start gap-3 text-lg"
            onClick={navToDashboard}>
            <FaTachometerAlt className="text-primary" />
            Dashboard
          </button>
          <button
            className="btn w-full btn-ghost justify-start gap-3 text-lg"
            onClick={navToContact}
          >
            <FaEnvelope className="text-primary" />
            Contact Us
          </button>
        </nav>
        <div className="p-4 w-full border-t border-base-300">
          <button
            onClick={handleLogout}
            className="btn btn-error btn-outline w-full flex justify-start gap-3 text-lg">
            <FaSignOutAlt />
            LogOut
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
