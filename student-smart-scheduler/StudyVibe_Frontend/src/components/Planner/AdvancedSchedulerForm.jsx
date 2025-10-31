import React, { useState } from "react";
import WeeklyScheduleGrid from "./WeeklyScheduleGrid";

/**
 * AdvancedSchedulerForm - Comprehensive scheduling interface
 * Includes: Schedule upload, manual time blocking, commitments, and study preferences
 */
function AdvancedSchedulerForm({ onGenerate, subjects }) {
  const [activeTab, setActiveTab] = useState("manual"); // manual, upload, commitments, preferences
  const [schedule, setSchedule] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedSchedule, setParsedSchedule] = useState(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [commitments, setCommitments] = useState([]);
  const [preferences, setPreferences] = useState({
    preferredTimes: [],
    pomodoro: {
      focusDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      sessionsBeforeLongBreak: 4,
    },
    subjectDifficulty: {},
    minSessionLength: 30,
    maxSessionLength: 120,
    sleepSchedule: { start: 23, end: 7 },
  });

  /**
   * Handle file upload for schedule
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setIsParsingFile(true);

    try {
      const formData = new FormData();
      formData.append("schedule", file);

      const response = await fetch("/api/schedule/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setParsedSchedule(data.schedule);
        alert("✅ Schedule parsed successfully! Review and edit if needed.");
      } else {
        alert("❌ Failed to parse schedule. Please try manual input.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        "❌ Upload failed. Please try manual input or check your connection."
      );
    } finally {
      setIsParsingFile(false);
    }
  };

  /**
   * Update parsed schedule entry
   */
  const updateParsedEntry = (index, field, value) => {
    const updated = [...parsedSchedule];
    updated[index][field] = value;
    setParsedSchedule(updated);
  };

  /**
   * Delete parsed schedule entry
   */
  const deleteParsedEntry = (index) => {
    const updated = parsedSchedule.filter((_, i) => i !== index);
    setParsedSchedule(updated);
  };

  /**
   * Add new commitment
   */
  const addCommitment = () => {
    setCommitments([
      ...commitments,
      {
        name: "",
        days: [],
        startTime: "09:00",
        endTime: "10:00",
        type: "work", // work, sports, meal, commute, other
      },
    ]);
  };

  /**
   * Update commitment
   */
  const updateCommitment = (index, field, value) => {
    const updated = [...commitments];
    updated[index][field] = value;
    setCommitments(updated);
  };

  /**
   * Delete commitment
   */
  const deleteCommitment = (index) => {
    setCommitments(commitments.filter((_, i) => i !== index));
  };

  /**
   * Update preference
   */
  const updatePreference = (field, value) => {
    setPreferences({ ...preferences, [field]: value });
  };

  /**
   * Update pomodoro setting
   */
  const updatePomodoro = (field, value) => {
    setPreferences({
      ...preferences,
      pomodoro: { ...preferences.pomodoro, [field]: parseInt(value) },
    });
  };

  /**
   * Update subject difficulty
   */
  const updateSubjectDifficulty = (subject, difficulty) => {
    setPreferences({
      ...preferences,
      subjectDifficulty: {
        ...preferences.subjectDifficulty,
        [subject]: parseInt(difficulty),
      },
    });
  };

  /**
   * Generate advanced study plan (static algorithm)
   */
  const handleGenerateAdvanced = (useAI = false) => {
    const advancedData = {
      schedule: parsedSchedule || schedule,
      commitments,
      preferences,
      subjects,
    };

    onGenerate(advancedData, useAI);
  };

  return (
    <div className="w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl shadow-lg p-6 mb-8 border border-purple-200">
      {/* Header with Step Number */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg">
            2
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Configure Your Schedule
            </h2>
            <p className="text-sm text-gray-600">
              Mark busy hours, add commitments, and set preferences
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-md">
          PREVIEW
        </span>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
        {[
          { id: "manual", label: "📝 Manual Input", icon: "📝" },
          { id: "commitments", label: "⏰ Commitments", icon: "⏰" },
          { id: "preferences", label: "⚙️ Preferences", icon: "⚙️" },
          { id: "upload", label: "📤 Upload Schedule", icon: "📤" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* SECTION A: Upload Schedule */}
        {activeTab === "upload" && (
          <div className="space-y-4">
            {/* Under Development Banner */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🚧</span>
                <h3 className="text-xl font-bold text-yellow-800">
                  Under Development
                </h3>
              </div>
              <p className="text-yellow-700 text-sm">
                This feature is currently under development. AI-powered schedule
                parsing from images and PDFs will be available soon. Please use
                the <strong>Manual Input</strong> tab to mark your schedule for
                now.
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Upload Your College/School Timetable
            </h3>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors opacity-50 pointer-events-none">
              <input
                type="file"
                id="scheduleUpload"
                accept=".pdf,.png,.jpg,.jpeg,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="scheduleUpload"
                className="cursor-pointer flex flex-col items-center gap-3">
                <div className="text-5xl">📤</div>
                <div className="text-gray-700 font-medium">
                  Click to upload or drag and drop
                </div>
                <div className="text-sm text-gray-500">
                  PDF, PNG, JPG, or CSV (Max 10MB)
                </div>
                {uploadedFile && (
                  <div className="mt-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                    ✓ {uploadedFile.name}
                  </div>
                )}
              </label>
            </div>

            {isParsingFile && (
              <div className="flex items-center justify-center gap-3 p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="text-gray-600">
                  Parsing your schedule with AI...
                </span>
              </div>
            )}

            {/* Parsed Schedule Table */}
            {parsedSchedule && parsedSchedule.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  📋 Parsed Schedule (Editable)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-100 to-blue-100">
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                          Day
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                          Subject
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                          Start
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                          End
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedSchedule.map((entry, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-3 py-2">
                            <input
                              type="text"
                              value={entry.day}
                              onChange={(e) =>
                                updateParsedEntry(idx, "day", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <input
                              type="text"
                              value={entry.subject}
                              onChange={(e) =>
                                updateParsedEntry(
                                  idx,
                                  "subject",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <input
                              type="time"
                              value={entry.startTime}
                              onChange={(e) =>
                                updateParsedEntry(
                                  idx,
                                  "startTime",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <input
                              type="time"
                              value={entry.endTime}
                              onChange={(e) =>
                                updateParsedEntry(
                                  idx,
                                  "endTime",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            <button
                              onClick={() => deleteParsedEntry(idx)}
                              className="text-red-600 hover:text-red-800 font-semibold">
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION B: Manual Weekly Schedule */}
        {activeTab === "manual" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Mark Your Busy/Free Time Blocks
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Click and drag on the grid below to mark your busy hours during
              the week. Select the block type first, then mark time slots on the
              calendar.
            </p>

            <WeeklyScheduleGrid
              schedule={schedule}
              onScheduleChange={setSchedule}
            />
          </div>
        )}

        {/* SECTION C: Additional Commitments */}
        {activeTab === "commitments" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Additional Commitments & Activities
              </h3>
              <button
                onClick={addCommitment}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium">
                + Add Commitment
              </button>
            </div>

            {commitments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-3">📝</div>
                <p>
                  No commitments added yet. Click "Add Commitment" to start.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {commitments.map((commitment, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Activity Name
                        </label>
                        <input
                          type="text"
                          value={commitment.name}
                          onChange={(e) =>
                            updateCommitment(idx, "name", e.target.value)
                          }
                          placeholder="e.g., Part-time job, Gym, etc."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={commitment.type}
                          onChange={(e) =>
                            updateCommitment(idx, "type", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                          <option value="work">Work/Part-time</option>
                          <option value="sports">Sports/Exercise</option>
                          <option value="meal">Meals</option>
                          <option value="commute">Commute</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={commitment.startTime}
                          onChange={(e) =>
                            updateCommitment(idx, "startTime", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={commitment.endTime}
                          onChange={(e) =>
                            updateCommitment(idx, "endTime", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Days of Week
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun",
                          ].map((day) => (
                            <button
                              key={day}
                              onClick={() => {
                                const days = commitment.days.includes(day)
                                  ? commitment.days.filter((d) => d !== day)
                                  : [...commitment.days, day];
                                updateCommitment(idx, "days", days);
                              }}
                              className={`px-3 py-1 rounded-lg font-medium text-sm transition-all ${
                                commitment.days.includes(day)
                                  ? "bg-purple-600 text-white"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}>
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteCommitment(idx)}
                      className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium">
                      🗑️ Delete Commitment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION D: Study Preferences */}
        {activeTab === "preferences" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Study Preferences & Pomodoro Settings
            </h3>

            {/* Preferred Study Times */}
            <div className="p-4 border border-gray-300 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Study Times
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Early Morning (5-8 AM)",
                  "Morning (8-12 PM)",
                  "Afternoon (12-5 PM)",
                  "Evening (5-9 PM)",
                  "Night (9 PM+)",
                ].map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      const times = preferences.preferredTimes.includes(time)
                        ? preferences.preferredTimes.filter((t) => t !== time)
                        : [...preferences.preferredTimes, time];
                      updatePreference("preferredTimes", times);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      preferences.preferredTimes.includes(time)
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}>
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Pomodoro Settings */}
            <div className="p-4 border border-gray-300 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                🍅 Pomodoro Timer Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Focus Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="60"
                    value={preferences.pomodoro.focusDuration}
                    onChange={(e) =>
                      updatePomodoro("focusDuration", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="15"
                    value={preferences.pomodoro.breakDuration}
                    onChange={(e) =>
                      updatePomodoro("breakDuration", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Long Break (minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="30"
                    value={preferences.pomodoro.longBreakDuration}
                    onChange={(e) =>
                      updatePomodoro("longBreakDuration", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Sessions Before Long Break
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="6"
                    value={preferences.pomodoro.sessionsBeforeLongBreak}
                    onChange={(e) =>
                      updatePomodoro("sessionsBeforeLongBreak", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Subject Difficulty */}
            {subjects && subjects.length > 0 && (
              <div className="p-4 border border-gray-300 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  📚 Subject Difficulty Ratings
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  Rate each subject's difficulty (1 = Easy, 5 = Very Hard)
                </p>
                <div className="space-y-3">
                  {subjects.map((subject) => (
                    <div
                      key={subject.subject || subject.name}
                      className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {subject.subject || subject.name}
                      </span>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            onClick={() =>
                              updateSubjectDifficulty(
                                subject.subject || subject.name,
                                level
                              )
                            }
                            className={`w-8 h-8 rounded-full font-semibold text-sm transition-all ${
                              (preferences.subjectDifficulty[
                                subject.subject || subject.name
                              ] || 3) >= level
                                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            }`}>
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Session Length Preferences */}
            <div className="p-4 border border-gray-300 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                ⏱️ Session Length Preferences
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Minimum Session Length (minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="60"
                    value={preferences.minSessionLength}
                    onChange={(e) =>
                      updatePreference(
                        "minSessionLength",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Maximum Session Length (minutes)
                  </label>
                  <input
                    type="number"
                    min="60"
                    max="240"
                    value={preferences.maxSessionLength}
                    onChange={(e) =>
                      updatePreference(
                        "maxSessionLength",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Sleep Schedule */}
            <div className="p-4 border border-gray-300 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                😴 Sleep Schedule
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Sleep Time (Hour, 24h format)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={preferences.sleepSchedule.start}
                    onChange={(e) =>
                      updatePreference("sleepSchedule", {
                        ...preferences.sleepSchedule,
                        start: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Wake Time (Hour, 24h format)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={preferences.sleepSchedule.end}
                    onChange={(e) =>
                      updatePreference("sleepSchedule", {
                        ...preferences.sleepSchedule,
                        end: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generate Buttons - Step 3 */}
      <div className="mt-8 pt-6 border-t-2 border-purple-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg">
            3
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Generate Your Study Plan
            </h3>
            <p className="text-sm text-gray-600">
              Choose how you want to create your schedule
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => handleGenerateAdvanced(false)}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 justify-center">
            📊 Generate Study Plan
           
          </button>
          <button
            onClick={() => handleGenerateAdvanced(true)}
            className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 justify-center">
            🤖 Optimize with AI
            <span className="text-xs px-2 py-0.5 bg-yellow-400 text-purple-900 rounded-full font-bold">
              BETA
            </span>
          </button>
        </div>

        
      </div>
    </div>
  );
}

export default AdvancedSchedulerForm;
