import { parseScheduleFile } from "../services/scheduleParser.js";
import path from "path";
import fs from "fs";

/**
 * Upload and parse schedule file
 * POST /api/schedule/upload
 */
export const uploadSchedule = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    console.log("Parsing schedule file:", filePath, "Type:", fileType);

    // Parse the uploaded file
    const parsedSchedule = await parseScheduleFile(filePath, fileType);

    // Clean up uploaded file after parsing
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: "Schedule parsed successfully",
      schedule: parsedSchedule,
    });
  } catch (error) {
    console.error("Schedule upload error:", error);

    // Clean up file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error("Error cleaning up file:", cleanupError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to parse schedule",
      error: error.message,
    });
  }
};

/**
 * Parse schedule from text/data
 * POST /api/schedule/parse
 */
export const parseSchedule = async (req, res) => {
  try {
    const { scheduleText, format } = req.body;

    if (!scheduleText) {
      return res.status(400).json({
        success: false,
        message: "No schedule text provided",
      });
    }

    // TODO: Implement text-based parsing logic
    // This could use regex or AI to extract schedule information

    return res.status(200).json({
      success: true,
      message: "Schedule parsed successfully",
      schedule: [],
    });
  } catch (error) {
    console.error("Schedule parse error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to parse schedule",
      error: error.message,
    });
  }
};
