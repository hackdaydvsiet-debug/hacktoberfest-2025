import { useState } from "react";

const useSmartTimetable = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateSmartTimetable = async (
    subjects,
    availableHoursPerDay,
    customPrompt = "",
    modelType = "flash"
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Defensive: ensure subjects is always an array
      const safeSubjects = Array.isArray(subjects) ? subjects : [];

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}api/timetable/generate-smart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subjects: safeSubjects.map((s) => ({
              name: s.subject,
              examDate: s.examDate,
            })),
            availableHoursPerDay: Number(availableHoursPerDay),
            customPrompt: customPrompt.trim(),
            modelType: modelType,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to generate smart timetable"
        );
      }

      const data = await response.json();
      console.log("Generated smart timetable:", data);

      return data;
    } catch (err) {
      console.error("Error generating smart timetable:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, generateSmartTimetable };
};

export default useSmartTimetable;
