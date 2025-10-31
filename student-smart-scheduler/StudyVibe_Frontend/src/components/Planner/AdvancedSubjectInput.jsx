import React, { useState } from "react";

/**
 * Simple subject input for Advanced Scheduler
 * Only collects subjects and exam dates without generate button
 */
function AdvancedSubjectInput({
  subjects,
  onSubjectsChange,
  studyHoursAvailable,
  onStudyHoursChange,
}) {
  const [localSubjects, setLocalSubjects] = useState(
    subjects.length > 0 ? subjects : [{ subject: "", examDate: "" }]
  );

  function handleSubjectChange(idx, field, value) {
    const updated = localSubjects.map((row, i) =>
      i === idx ? { ...row, [field]: value } : row
    );
    setLocalSubjects(updated);
    onSubjectsChange(updated);
  }

  function addRow() {
    const updated = [...localSubjects, { subject: "", examDate: "" }];
    setLocalSubjects(updated);
    onSubjectsChange(updated);
  }

  function deleteRow(idx) {
    const updated = localSubjects.filter((_, i) => i !== idx);
    setLocalSubjects(updated);
    onSubjectsChange(updated);
  }

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-lg p-6 border border-blue-200">
      {/* Header with Step Number */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg">
          1
        </div>
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Add Your Subjects
          </h3>
          <p className="text-sm text-gray-600">
            Enter subjects and their exam dates
          </p>
        </div>
      </div>

      {/* Study Hours Available Input */}
      <div className="mb-4 bg-white p-4 rounded-lg border border-blue-200">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Study Hours Available (per day)
        </label>
        <input
          type="number"
          min="1"
          max="24"
          value={studyHoursAvailable || ""}
          onChange={(e) => onStudyHoursChange(parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="e.g., 6 hours per day"
        />
        <p className="text-xs text-gray-500 mt-1">
          How many hours per day can you dedicate to studying?
        </p>
      </div>

      <div className="space-y-3">
        {localSubjects.map((row, idx) => (
          <div
            key={idx}
            className="flex gap-3 items-center bg-white p-3 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Subject name (e.g., Mathematics)"
                value={row.subject}
                onChange={(e) =>
                  handleSubjectChange(idx, "subject", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex-1">
              <input
                type="date"
                value={row.examDate}
                onChange={(e) =>
                  handleSubjectChange(idx, "examDate", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => deleteRow(idx)}
              disabled={localSubjects.length === 1}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 font-medium rounded-lg hover:from-purple-200 hover:to-blue-200 transition-all duration-200 flex items-center justify-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Add Another Subject
      </button>
    </div>
  );
}

export default AdvancedSubjectInput;
