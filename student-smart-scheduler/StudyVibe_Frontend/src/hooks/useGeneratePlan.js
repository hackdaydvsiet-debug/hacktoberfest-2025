import { useState } from "react";
import generateStudyPlan from "../utils/studyPlanGenerator";

const useGeneratePlan = () => {
  const [loading, setLoading] = useState(false);

  const generatePlan = async (subjects, availableHoursPerDay) => {
    try {
      setLoading(true);

      // Defensive: ensure subjects is always an array
      const safeSubjects = Array.isArray(subjects) ? subjects : [];

      // Generate plan client-side for instant results
      const data = generateStudyPlan(
        safeSubjects.map((s) => ({
          name: s.subject,
          examDate: s.examDate,
        })),
        Number(availableHoursPerDay)
      );

      console.log("Generated study plan:", data);

      return data;
    } catch (error) {
      console.error("Error generating study plan:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, generatePlan };
};

export default useGeneratePlan;
