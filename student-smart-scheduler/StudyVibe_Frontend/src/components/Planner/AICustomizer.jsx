import { useState } from "react";
import useSmartTimetable from "../../hooks/useSmartTimetable";

export default function AICustomizer({
  subjects,
  availableHours,
  onSmartPlanGenerated,
}) {
  const [customPrompt, setCustomPrompt] = useState("");
  const [showPromptInput, setShowPromptInput] = useState(true);
  const [useProModel, setUseProModel] = useState(false);
  const { loading, error, generateSmartTimetable } = useSmartTimetable();

  const handleSmartGenerate = async () => {
    if (!subjects || subjects.length === 0 || !availableHours) {
      alert("Please add subjects and available hours first!");
      return;
    }

    const modelType = useProModel ? "pro" : "flash";
    const smartPlan = await generateSmartTimetable(
      subjects,
      availableHours,
      customPrompt,
      modelType
    );
    if (smartPlan && onSmartPlanGenerated) {
      onSmartPlanGenerated(smartPlan);
    }
  };

  if (!subjects || subjects.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 relative group animate-fade-in">
      {/* Animated gradient background */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>

      <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl p-6 shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-500">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 flex items-center gap-2">
            <span className="text-3xl animate-pulse">✨</span>
            AI-Powered Smart Timetable
          </h3>
          <button
            onClick={() => setShowPromptInput(!showPromptInput)}
            className="text-sm text-purple-600 hover:text-purple-800 font-medium px-3 py-1 rounded-lg hover:bg-purple-100 transition-all duration-300 hover:scale-105">
            {showPromptInput ? "Hide" : "Show"}
          </button>
        </div>

        {showPromptInput && (
          <div className="space-y-4 animate-slide-down">
            {/* Description */}
            <p className="text-sm text-gray-600">
              Describe your study preferences and let AI create an optimized
              schedule for you.
            </p>

            {/* Textarea for prompt */}
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="E.g., 'Focus more on Math as it's harder, give less time to English in the mornings, I prefer studying science in the evening, I'm a morning person...'"
              className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm shadow-sm hover:shadow-md transition-all duration-300 focus:scale-[1.02]"
              rows={4}
            />

            {/* Think More Toggle */}
            <div className="flex items-center gap-3 pb-2">
              <button
                onClick={() => setUseProModel(!useProModel)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                  useProModel
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                }`}>
                <span className={useProModel ? "animate-bounce" : ""}>🧠</span>
                <span>Think More</span>
              </button>
              {useProModel && (
                <span className="text-xs text-purple-600 font-medium animate-fade-in">
                  Using Pro model for detailed analysis
                </span>
              )}
            </div>

            {/* Main Generate Button */}
            <button
              onClick={handleSmartGenerate}
              disabled={loading}
              className={`relative w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-[1.02] ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-2xl shadow-blue-300 hover:shadow-purple-400"
              }`}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="animate-pulse">
                    {useProModel ? "Thinking deeply..." : "Generating..."}
                  </span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-pulse">✨</span>
                  Generate Smart Timetable
                </span>
              )}
            </button>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
