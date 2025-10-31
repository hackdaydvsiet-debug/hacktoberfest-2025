import Timetable from "../models/Timetable.js";
import generateSmartTimetable from "../services/gemini_api.js";

export const saveTimetable = async (req, res) => {
  try {
    const { userId, plan } = req.body;

    await Timetable.findOneAndDelete({ userId }); // Remove old timetable

    const newPlan = new Timetable({ userId, plan });
    await newPlan.save();

    res.status(200).json(newPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateSmartTimetableController = async (req, res) => {
  try {
    const { subjects, availableHoursPerDay, customPrompt, modelType } =
      req.body;

    // Validate input
    if (!subjects || !availableHoursPerDay) {
      return res.status(400).json({
        error: "Subjects and available hours per day are required",
      });
    }

    // Generate smart timetable using Gemini (default to flash model)
    const smartPlan = await generateSmartTimetable(
      subjects,
      availableHoursPerDay,
      customPrompt,
      modelType || "flash"
    );

    res.status(200).json(smartPlan);
  } catch (error) {
    console.error("Error generating smart timetable:", error);
    res.status(500).json({
      error: "Failed to generate smart timetable",
      details: error.message,
    });
  }
};
