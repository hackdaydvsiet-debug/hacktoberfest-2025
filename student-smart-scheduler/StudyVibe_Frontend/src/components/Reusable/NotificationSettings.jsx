import { useState } from "react";
import { FaBell, FaTimes, FaExclamationCircle } from "react-icons/fa";

// Notification settings component
// Currently under development - basic email subscription form
const NotificationSettings = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState({
    studyReminders: true,
    examAlerts: true,
    weeklyDigest: false,
    motivationalQuotes: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setMessage(""); // Clear any previous messages
  };

  // Handle checkbox changes
  const handlePreferenceChange = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle form submission (placeholder for future backend integration)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !email.includes("@")) {
      setMessage("Please enter a valid email address");
      return;
    }

    setLoading(true);

    // Simulate API call (replace with actual backend call later)
    setTimeout(() => {
      console.log("Notification preferences saved:", {
        email,
        preferences,
      });

      setMessage("Settings saved! (Feature under development)");
      setLoading(false);

      // Auto-close message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }, 1000);
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
            aria-label="Close">
            <FaTimes size={20} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <FaBell size={24} />
            <h2 className="text-2xl font-bold">Notification Settings</h2>
          </div>

          {/* Under Development Badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
            <FaExclamationCircle />
            Under Development
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="your.email@example.com"
              className="input input-bordered w-full"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll send notifications to this email
            </p>
          </div>

          {/* Notification Preferences */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Notification Preferences
            </label>

            <div className="space-y-3">
              {/* Study Reminders */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.studyReminders}
                  onChange={() => handlePreferenceChange("studyReminders")}
                  className="checkbox checkbox-primary mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    Study Reminders
                  </div>
                  <div className="text-xs text-gray-500">
                    Get reminded before scheduled study sessions
                  </div>
                </div>
              </label>

              {/* Exam Alerts */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.examAlerts}
                  onChange={() => handlePreferenceChange("examAlerts")}
                  className="checkbox checkbox-primary mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">Exam Alerts</div>
                  <div className="text-xs text-gray-500">
                    Notifications about upcoming exams
                  </div>
                </div>
              </label>

              {/* Weekly Digest */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.weeklyDigest}
                  onChange={() => handlePreferenceChange("weeklyDigest")}
                  className="checkbox checkbox-primary mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">Weekly Digest</div>
                  <div className="text-xs text-gray-500">
                    Summary of your study progress each week
                  </div>
                </div>
              </label>

              {/* Motivational Quotes */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.motivationalQuotes}
                  onChange={() => handlePreferenceChange("motivationalQuotes")}
                  className="checkbox checkbox-primary mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    Motivational Quotes
                  </div>
                  <div className="text-xs text-gray-500">
                    Daily inspiration to keep you motivated
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <FaExclamationCircle className="text-blue-600 mt-1 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Feature Coming Soon!</p>
                <p className="text-xs">
                  Email notifications are currently under development. Your
                  preferences will be saved for when this feature launches.
                </p>
              </div>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`alert ${
                message.includes("valid") ? "alert-error" : "alert-success"
              }`}>
              <span className="text-sm">{message}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1">
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Save Preferences"
              )}
            </button>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationSettings;
