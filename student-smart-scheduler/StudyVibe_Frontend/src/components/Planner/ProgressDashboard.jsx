import React, { useState, useEffect } from "react";

/**
 * ProgressDashboard - Track study progress and statistics
 * Basic version with manual check-offs and simple charts
 */
function ProgressDashboard({ studyPlan }) {
  const [completedSessions, setCompletedSessions] = useState({});
  const [stats, setStats] = useState({
    totalHours: 0,
    completedHours: 0,
    subjectBreakdown: {},
    studyStreak: 0,
  });

  /**
   * Load completed sessions from localStorage
   */
  useEffect(() => {
    const saved = localStorage.getItem("studyProgress");
    if (saved) {
      try {
        setCompletedSessions(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    }
  }, []);

  /**
   * Calculate statistics whenever plan or completions change
   */
  useEffect(() => {
    if (!studyPlan) return;

    calculateStats();
  }, [studyPlan, completedSessions]);

  /**
   * Calculate study statistics
   */
  const calculateStats = () => {
    let totalHours = 0;
    let completedHours = 0;
    const subjectBreakdown = {};

    // Iterate through study plan
    Object.entries(studyPlan).forEach(([date, sessions]) => {
      sessions.forEach((session) => {
        const sessionKey = `${date}-${session.subject}`;
        const hours = session.time?.hours || 0;
        const minutes = (session.time?.minutes || 0) / 60;
        const totalSessionHours = hours + minutes;

        totalHours += totalSessionHours;

        // Track by subject
        if (!subjectBreakdown[session.subject]) {
          subjectBreakdown[session.subject] = {
            total: 0,
            completed: 0,
          };
        }
        subjectBreakdown[session.subject].total += totalSessionHours;

        // Check if completed
        if (completedSessions[sessionKey]) {
          completedHours += totalSessionHours;
          subjectBreakdown[session.subject].completed += totalSessionHours;
        }
      });
    });

    // Calculate streak (consecutive days with completed sessions)
    const streak = calculateStreak();

    setStats({
      totalHours: totalHours.toFixed(1),
      completedHours: completedHours.toFixed(1),
      subjectBreakdown,
      studyStreak: streak,
    });
  };

  /**
   * Calculate study streak
   */
  const calculateStreak = () => {
    if (!studyPlan) return 0;

    // Get all dates from study plan and check if all sessions are completed for each date
    const planDates = Object.keys(studyPlan).sort();

    // Create a map of dates with completion status
    const dateCompletionMap = {};

    Object.entries(studyPlan).forEach(([date, sessions]) => {
      let totalSessions = sessions.length;
      let completedCount = 0;

      sessions.forEach((session) => {
        const sessionKey = `${date}-${session.subject}`;
        if (completedSessions[sessionKey]) {
          completedCount++;
        }
      });

      // Mark date as complete only if ALL sessions for that day are done
      dateCompletionMap[date] =
        completedCount === totalSessions && totalSessions > 0;
    });

    // Count consecutive days backwards from today
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);

      // Format date to match study plan format (DD-Month-YYYY)
      const dateStr = checkDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      // Check if this date exists in the plan and is completed
      if (dateCompletionMap[dateStr] === true) {
        streak++;
      } else if (i > 0 && planDates.includes(dateStr)) {
        // If it's a planned date but not completed (and not today), break the streak
        break;
      }
      // Skip dates that are not in the plan (don't break streak for non-planned days)
    }

    return streak;
  };

  /**
   * Toggle session completion
   */
  const toggleSession = (date, subject) => {
    const sessionKey = `${date}-${subject}`;
    const newCompleted = {
      ...completedSessions,
      [sessionKey]: !completedSessions[sessionKey],
    };

    setCompletedSessions(newCompleted);
    localStorage.setItem("studyProgress", JSON.stringify(newCompleted));
  };

  /**
   * Get completion percentage
   */
  const getCompletionPercentage = () => {
    if (stats.totalHours === 0) return 0;
    return Math.round((stats.completedHours / stats.totalHours) * 100);
  };

  if (!studyPlan || Object.keys(studyPlan).length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 bg-gradient-to-br from-purple-100 via-white to-blue-100 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          📊 Progress Dashboard
        </h2>
        <p className="text-gray-600 text-center py-8">
          Generate a study plan to start tracking your progress!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-gradient-to-br from-purple-100 via-white to-blue-100 rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        📊 Progress Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Progress Card */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-purple-200">
          <div className="text-sm text-gray-600 mb-2">Overall Progress</div>
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {getCompletionPercentage()}%
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {stats.completedHours} / {stats.totalHours} hours
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getCompletionPercentage()}%` }}></div>
          </div>
        </div>

        {/* Study Streak Card */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-orange-200">
          <div className="text-sm text-gray-600 mb-2">Study Streak</div>
          <div className="text-3xl font-bold text-orange-600">
            {stats.studyStreak} 🔥
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {stats.studyStreak === 0
              ? "Start today!"
              : stats.studyStreak === 1
              ? "Keep it up!"
              : "Amazing consistency!"}
          </div>
        </div>

        {/* Subjects Covered Card */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-green-200">
          <div className="text-sm text-gray-600 mb-2">Subjects Tracked</div>
          <div className="text-3xl font-bold text-green-600">
            {Object.keys(stats.subjectBreakdown).length}
          </div>
          <div className="text-xs text-gray-500 mt-2">Active subjects</div>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-md mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📚 Subject Breakdown
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.subjectBreakdown).map(([subject, data]) => {
            const percentage =
              data.total > 0
                ? Math.round((data.completed / data.total) * 100)
                : 0;

            return (
              <div key={subject} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {subject}
                  </span>
                  <span className="text-sm text-gray-600">
                    {data.completed.toFixed(1)} / {data.total.toFixed(1)} hrs (
                    {percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Session Checklist */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          ✅ Study Sessions
        </h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {Object.entries(studyPlan).map(([date, sessions]) => (
            <div
              key={date}
              className="border-b border-gray-200 pb-3 last:border-b-0">
              <div className="font-medium text-gray-700 mb-2">{date}</div>
              <div className="space-y-2 ml-4">
                {sessions.map((session, idx) => {
                  const sessionKey = `${date}-${session.subject}`;
                  const isCompleted = completedSessions[sessionKey];

                  return (
                    <label
                      key={idx}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={isCompleted || false}
                        onChange={() => toggleSession(date, session.subject)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                      />
                      <span
                        className={`flex-1 text-sm ${
                          isCompleted
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}>
                        {session.subject} -{" "}
                        {session.timeFormatted || session.hours + " hrs"}
                      </span>
                      {isCompleted && (
                        <span className="text-green-600 text-xl">✓</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 italic">
          {getCompletionPercentage() === 100
            ? "🎉 Amazing! You've completed all sessions! Keep up the great work!"
            : getCompletionPercentage() >= 50
            ? "💪 You're making great progress! Keep going!"
            : "🚀 Every step counts! Let's start studying!"}
        </p>
      </div>
    </div>
  );
}

export default ProgressDashboard;
