// Backend API service
// Currently just has a health check, but this is where we'd add
// functions for saving schedules, syncing data, etc.

const API_URL = import.meta.env.VITE_API_URL;

// Simple health check to see if backend is up
// Useful for showing connection status in UI
export const checkBackendStatus = async () => {
  try {
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking backend status:", error);
    throw error;
  }
};
