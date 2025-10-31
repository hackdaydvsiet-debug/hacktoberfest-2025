// import Tesseract from "tesseract.js";
import fs from "fs";
import path from "path";

/**
 * Parse schedule file using OCR and pattern matching
 * @param {string} filePath - Path to the uploaded file
 * @param {string} fileType - MIME type of the file
 * @returns {Array} Parsed schedule entries
 */
export const parseScheduleFile = async (filePath, fileType) => {
  try {
    let schedule = [];

    if (fileType === "text/csv") {
      // Parse CSV file
      schedule = await parseCSVSchedule(filePath);
    } else if (fileType === "application/pdf") {
      // For PDF, we'd need pdf-parse or similar library
      // Placeholder for now
      schedule = await parsePDFSchedule(filePath);
    } else if (fileType.startsWith("image/")) {
      // Use OCR for image files
      schedule = await parseImageSchedule(filePath);
    }

    return schedule;
  } catch (error) {
    console.error("Error parsing schedule file:", error);
    throw new Error("Failed to parse schedule file: " + error.message);
  }
};

/**
 * Parse image file using Tesseract OCR
 */
const parseImageSchedule = async (filePath) => {
  try {
    console.log("Starting OCR on image:", filePath);

    // Perform OCR on the image
    const {
      data: { text },
    } = await Tesseract.recognize(filePath, "eng", {
      logger: (m) => console.log("OCR Progress:", m),
    });

    console.log("OCR extracted text:", text);

    // Parse the extracted text
    const schedule = parseScheduleText(text);

    return schedule;
  } catch (error) {
    console.error("OCR error:", error);
    throw new Error("OCR failed: " + error.message);
  }
};

/**
 * Parse CSV schedule file
 */
const parseCSVSchedule = async (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const lines = fileContent.split("\n").filter((line) => line.trim());

    const schedule = [];

    // Skip header row if exists
    const startIndex =
      lines[0].toLowerCase().includes("day") ||
      lines[0].toLowerCase().includes("time")
        ? 1
        : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(",").map((part) => part.trim());

      if (parts.length >= 4) {
        schedule.push({
          day: parts[0] || "",
          subject: parts[1] || "",
          startTime: parts[2] || "",
          endTime: parts[3] || "",
        });
      }
    }

    return schedule;
  } catch (error) {
    console.error("CSV parsing error:", error);
    throw new Error("CSV parsing failed: " + error.message);
  }
};

/**
 * Parse PDF schedule file
 * Note: Requires pdf-parse package (npm install pdf-parse)
 */
const parsePDFSchedule = async (filePath) => {
  try {
    // TODO: Implement PDF parsing with pdf-parse
    // For now, return empty array with a note to install pdf-parse
    console.log("PDF parsing not yet implemented. Install pdf-parse package.");

    // Placeholder implementation
    // const pdfParse = require('pdf-parse');
    // const dataBuffer = fs.readFileSync(filePath);
    // const data = await pdfParse(dataBuffer);
    // return parseScheduleText(data.text);

    return [];
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("PDF parsing failed: " + error.message);
  }
};

/**
 * Parse schedule from extracted text using pattern matching
 * Looks for patterns like:
 * - "Monday 9:00-10:00 Math"
 * - "Tue 09:00 AM - 10:00 AM Physics"
 */
const parseScheduleText = (text) => {
  const schedule = [];
  const lines = text.split("\n").filter((line) => line.trim());

  // Days of the week patterns
  const dayPatterns =
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)\b/gi;

  // Time patterns (supports various formats)
  const timePatterns = /(\d{1,2}):?(\d{2})?\s*(am|pm)?/gi;

  for (const line of lines) {
    const dayMatch = line.match(dayPatterns);
    const timeMatches = Array.from(line.matchAll(timePatterns));

    if (dayMatch && timeMatches.length >= 2) {
      // Extract day
      const day = capitalizeDay(dayMatch[0]);

      // Extract times
      const startTime = formatTime(timeMatches[0][0]);
      const endTime = formatTime(timeMatches[1][0]);

      // Extract subject (remaining text after removing day and times)
      let subject = line
        .replace(dayPatterns, "")
        .replace(timePatterns, "")
        .replace(/[-–—]/g, "")
        .trim();

      // Clean up subject name
      subject = subject.replace(/\s+/g, " ").trim();

      if (day && startTime && endTime && subject) {
        schedule.push({
          day,
          subject,
          startTime,
          endTime,
        });
      }
    }
  }

  return schedule;
};

/**
 * Capitalize and normalize day name
 */
const capitalizeDay = (day) => {
  const dayMap = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
  };

  const lowerDay = day.toLowerCase();
  if (dayMap[lowerDay]) {
    return dayMap[lowerDay];
  }

  return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
};

/**
 * Format time to HH:MM format
 */
const formatTime = (timeStr) => {
  // Remove spaces and convert to lowercase
  timeStr = timeStr.replace(/\s+/g, "").toLowerCase();

  // Extract components
  const match = timeStr.match(/(\d{1,2}):?(\d{2})?(am|pm)?/i);

  if (!match) return timeStr;

  let hours = parseInt(match[1]);
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const period = match[3];

  // Convert to 24-hour format
  if (period === "pm" && hours !== 12) {
    hours += 12;
  } else if (period === "am" && hours === 12) {
    hours = 0;
  }

  // Format as HH:MM
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

export default {
  parseScheduleFile,
  parseScheduleText,
};
