import generateStudyPlan from "../utils/studyPlanGenerator.js";
import { generateAdvancedSchedule } from "../services/gemini_api.js";
// import generateStudyPlanByOpenAI from "../services/openaiService.js";

const plannerController = async (req, res) => {
  const { subjects, availableHoursPerDay } = req.body;

  // validate input
  if (!subjects || !availableHoursPerDay) {
    return res
      .status(400)
      .json({ error: "Subjects and available hours per day are required" });
  }

  try {
    const studyPlan = generateStudyPlan(subjects, availableHoursPerDay);
    return res.status(200).json(studyPlan);
  } catch (error) {
    console.error("Error generating study plan:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while generating the study plan" });
  }
};

/**
 * Advanced planner controller with schedule awareness and Pomodoro
 * POST /api/planner/advanced
 */
export const advancedPlannerController = async (req, res) => {
  try {
    const { schedule, commitments, preferences, subjects } = req.body;

    // Validate input
    if (!subjects || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Subjects are required",
      });
    }

    console.log(
      "Generating advanced schedule for:",
      subjects.length,
      "subjects"
    );

    // Generate advanced schedule with AI
    const advancedSchedule = await generateAdvancedSchedule({
      schedule,
      commitments,
      preferences,
      subjects,
    });

    return res.status(200).json({
      success: true,
      schedule: advancedSchedule,
    });
  } catch (error) {
    console.error("Advanced planner error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate advanced schedule",
      message: error.message,
    });
  }
};

export default plannerController;
