 import React, { useState } from "react";

function SubjectForm({ onGenerate }) {
  const [availableHours, setAvailableHours] = useState("");
  const [subjects, setSubjects] = useState([
    { subject: "", examDate: "" },
    { subject: "", examDate: "" },
    { subject: "", examDate: "" },
  ]);
  const [errors, setErrors] = useState({});

  function handleSubjectChange(idx, field, value) {
    setSubjects((subjects) =>
      subjects.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  }

  function addRow() {
    setSubjects((subjects) => [...subjects, { subject: "", examDate: "" }]);
  }

  function deleteRow(idx) {
    setSubjects((subjects) => subjects.filter((_, i) => i !== idx));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formErrors = {};
    if (!availableHours || Number(availableHours) < 1) {
      formErrors.availableHours = "Available hours is required";
    }
    subjects.forEach((row, idx) => {
      if (!row.subject.trim() || !row.examDate) {
        formErrors[`row${idx}`] = "Subject and exam date are required";
      }
    });
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      if (onGenerate) {
        onGenerate(subjects, availableHours);
      }
    }
  }

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-white rounded-2xl shadow-xl hover:shadow-2xl p-3 sm:p-6 w-full max-w-xs sm:max-w-md border border-blue-100 flex h-full items-center justify-center transition-all duration-500 animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-xs sm:max-w-md shadow-lg bg-base-100 p-2 sm:p-4 text-sm sm:text-base">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Study Planner
        </h2>
        <div className="form-control mb-3 sm:mb-4">
          <label className="label">
            <span className="label-text text-sm sm:text-md font-semibold">
              Available Hours
            </span>
          </label>
          <input
            type="number"
            min={1}
            max={24}
            value={availableHours}
            onChange={(e) => setAvailableHours(e.target.value)}
            className={`input input-bordered input-sm sm:input-md ${
              errors.availableHours ? "input-error" : ""
            }`}
            placeholder="Hours per day"
            required
          />
          {errors.availableHours && (
            <label className="label">
              <span className="label-text-alt text-error text-xs">
                {errors.availableHours}
              </span>
            </label>
          )}
        </div>
        <div>
          {/* Header row using flex */}
          <div className="flex mb-1 font-semibold text-base sm:text-lg">
            <div className="flex-1 px-1">Subject</div>
            <div className="flex-1 px-1">Exam Date</div>
            <div style={{ width: "2.5rem" }}></div>
          </div>
          {subjects.map((row, idx) => (
            <div className="flex items-center mb-1" key={idx}>
              <input
                type="text"
                value={row.subject}
                onChange={(e) =>
                  handleSubjectChange(idx, "subject", e.target.value)
                }
                className={`input input-bordered input-sm sm:input-md flex-1 mr-2 ${
                  errors[`row${idx}`] && !row.subject ? "input-error" : ""
                }`}
                placeholder="Subject"
                required
              />
              <input
                type="date"
                value={row.examDate}
                onChange={(e) =>
                  handleSubjectChange(idx, "examDate", e.target.value)
                }
                className={`input input-bordered input-sm sm:input-md flex-1 mr-2 ${
                  errors[`row${idx}`] && !row.examDate ? "input-error" : ""
                }`}
                required
              />
              <button
                type="button"
                className="min-w-0 w-7 h-7 flex items-center justify-center bg-transparent border-0"
                onClick={() => deleteRow(idx)}
                aria-label="Delete row"
                disabled={subjects.length === 1}
                tabIndex={-1}
                style={{ marginRight: 0, paddingRight: 0 }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z"
                  />
                </svg>
              </button>
              {errors[`row${idx}`] && (
                <div className="flex-1 text-error text-xs ml-2">
                  {errors[`row${idx}`]}
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-outline btn-xs sm:btn-sm mt-2 mb-2"
          onClick={addRow}>
          Add Subject
        </button>
        <button
          type="submit"
          className="btn btn-primary btn-sm sm:btn-md w-full mt-1">
          Generate Plan
        </button>
      </form>
    </div>
  );
}

export default SubjectForm;
