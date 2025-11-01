import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import generateSmartTimetableWithOpenAI from "./openai_api.js";

dotenv.config();

// Initialize Gemini client with API key from Google AI Studio
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate a smart study timetable using Gemini AI
 * @param {Array} subjects - Array of subjects with name and examDate
 * @param {Number} availableHoursPerDay - Hours available per day for studying
 * @param {String} customPrompt - User's custom requirements/preferences
 * @param {String} modelType - "flash" for fast, "pro" for detailed (default: "flash")
 * @returns {Object} Generated study plan
 */
export async function generateSmartTimetable(
  subjects,
  availableHoursPerDay,
  customPrompt,
  modelType = "flash"
) {
  try {
    // Validate inputs
    if (!subjects || subjects.length === 0) {
      throw new Error("No subjects provided");
    }

    // Select model based on type - Flash is significantly faster
    const modelName =
      modelType === "pro" ? "gemini-2.5-pro" : "gemini-2.5-flash";

    console.log(`🚀 Using ${modelName} model for generation...`);

    // Get today's date for reference
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // Format subjects with exam dates
    const subjectsInfo = subjects
      .map((s) => `- ${s.name} (Exam Date: ${s.examDate})`)
      .join("\n");

    // Build the prompt - optimized for speed and completeness
    const systemPrompt = `You are an efficient study planner AI. Generate a complete study timetable in JSON format.

TODAY: ${today}
SUBJECTS: ${subjectsInfo}
HOURS/DAY: ${availableHoursPerDay}
CUSTOM INSTRUCTIONS: ${customPrompt || "Balanced plan optimizing exam dates"}

RULES:
1. Schedule from today to 1 day before each exam
2. Prioritize subjects with earlier exams
3. Sessions: 1-2 hours each
4. Date format: DD-MMMM-YYYY (e.g., 29-October-2025)
5. Distribute ${availableHoursPerDay} hours/day intelligently
6. Use REAL dates only

OUTPUT FORMAT (JSON only):
{
  "schedule": [
    {"subject": "name", "date": "DD-MMMM-YYYY", "duration": hours, "topic": "study topic"}
  ]
}`;

    let text;
    let usedFallback = false;
    const startTime = Date.now();

    // Try Gemini with 1 retry (2 total attempts) - optimized for speed
    try {
      const maxRetries = 2; // 1 initial + 1 retry
      let lastError;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(
            `⏱️ Attempting Gemini API (attempt ${attempt}/${maxRetries})...`
          );

          // Set a timeout for the API call to prevent hanging
          const timeoutPromise = new Promise(
            (_, reject) =>
              setTimeout(() => reject(new Error("API request timeout")), 45000) // 45s timeout
          );

          const apiPromise = ai.models.generateContent({
            model: modelName,
            contents: systemPrompt,
            config: {
              temperature: 0.1, // Low temperature for consistent JSON output
              maxOutputTokens: 8192, // Full token limit for complete schedule
              responseMimeType: "application/json", // Force JSON output
              topK: 1, // Faster token selection - most likely token
              topP: 0.95, // Focused sampling for speed
            },
          });

          const response = await Promise.race([apiPromise, timeoutPromise]);

          // Extract text from response
          text = response.text;

          // If text is empty, try to extract from candidates
          if (!text && response.candidates && response.candidates.length > 0) {
            const candidate = response.candidates[0];
            if (
              candidate.content &&
              candidate.content.parts &&
              candidate.content.parts.length > 0
            ) {
              text = candidate.content.parts[0].text;
            }
          }

          if (text) {
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`✅ Gemini API succeeded in ${duration}s`);
            break; // Success - exit retry loop
          }
        } catch (apiError) {
          lastError = apiError;
          const duration = ((Date.now() - startTime) / 1000).toFixed(2);
          console.error(
            `❌ Gemini attempt ${attempt} failed after ${duration}s:`,
            apiError.message
          );

          // If it's the last attempt, we'll fallback to OpenAI
          if (attempt === maxRetries) {
            throw apiError;
          }

          // Shorter retry delay for faster fallback
          const delay = 1000; // 1s only
          console.log(`⏳ Retrying in ${delay / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      // If we got here without text, throw the last error
      if (!text) {
        throw lastError || new Error("Empty response from Gemini");
      }
    } catch (geminiError) {
      // Fallback to OpenAI GPT-4o using the separate module
      usedFallback = true;

      try {
        text = await generateSmartTimetableWithOpenAI(systemPrompt);
      } catch (openaiError) {
        console.error("❌ OpenAI fallback also failed:", openaiError.message);
        throw new Error(
          `Both Gemini and OpenAI failed. Gemini: ${geminiError.message}, OpenAI: ${openaiError.message}`
        );
      }
    }

    // Verify we have text
    if (!text) {
      throw new Error("No response text from AI model");
    }

    // Parse JSON response with better error handling
    let schedule;
    try {
      // Clean the text first - remove any markdown, extra whitespace, or BOM
      let cleanedText = text.trim();

      // Remove markdown code blocks if present
      const jsonMatch = cleanedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        cleanedText = jsonMatch[1].trim();
      }

      // Remove any BOM or invisible characters
      cleanedText = cleanedText
        .replace(/^\uFEFF/, "")
        .replace(/^[^\{\[]*/, "")
        .replace(/[^\}\]]*$/, "");

      // Log for debugging
      console.log(
        "Attempting to parse JSON response:",
        cleanedText.substring(0, 200)
      );

      // Try to parse
      schedule = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError.message);
      console.error("Raw text received:", text.substring(0, 500));
      throw new Error(
        `Could not parse JSON from AI response: ${parseError.message}`
      );
    }

    // Transform Gemini's response to match frontend expectations
    // Expected format: { "date": [{ subject: "...", hours: ... }] }
    // Gemini format: { schedule: [{ subject, date, duration, ... }] }

    if (schedule.schedule && Array.isArray(schedule.schedule)) {
      const groupedByDate = {};

      schedule.schedule.forEach((item) => {
        const date = item.date;
        const hours = item.duration || 0;

        if (!groupedByDate[date]) {
          groupedByDate[date] = {};
        }

        // Combine hours for the same subject on the same date
        if (!groupedByDate[date][item.subject]) {
          groupedByDate[date][item.subject] = 0;
        }
        groupedByDate[date][item.subject] += hours;
      });

      // Convert to array format expected by frontend
      const result = {};
      Object.keys(groupedByDate).forEach((date) => {
        result[date] = Object.entries(groupedByDate[date]).map(
          ([subject, hours]) => ({
            subject,
            hours,
          })
        );
      });

      if (usedFallback) {
        console.log("ℹ️ Schedule generated using OpenAI fallback");
      }

      return result;
    }

    return schedule;
  } catch (error) {
    console.error("AI API Error:", error);

    // Provide user-friendly error messages
    if (error.message.includes("Both Gemini and OpenAI failed")) {
      throw new Error(
        "Unable to generate schedule. Both AI services are currently unavailable. Please try again later."
      );
    } else if (error.status === 503) {
      throw new Error(
        "The AI service is currently overloaded. Please try again in a few moments."
      );
    } else if (error.status === 429) {
      throw new Error(
        "Rate limit reached. Please wait a moment before trying again."
      );
    } else {
      throw new Error(`Failed to generate smart timetable: ${error.message}`);
    }
  }
}

/**
 * Generate advanced time-blocked study plan with Pomodoro intervals
 * @param {Object} advancedData - Complete advanced scheduler data
 * @returns {Object} Time-blocked study plan with exact clock times
 */
export async function generateAdvancedSchedule(advancedData) {
  try {
    const { schedule, commitments, preferences, subjects } = advancedData;

    // Build free time blocks summary
    const freeTimeBlocks = calculateFreeTimeBlocksForAI(
      schedule,
      commitments,
      preferences
    );

    // Build subject difficulty info
    const subjectDifficulty = preferences.subjectDifficulty || {};
    const subjectsInfo = subjects
      .map(
        (s) =>
          `- ${s.subject || s.name} (Exam: ${s.examDate}, Difficulty: ${
            subjectDifficulty[s.subject || s.name] || 3
          }/5)`
      )
      .join("\n");

    // Build preferences summary
    const preferredTimes = preferences.preferredTimes?.join(", ") || "Flexible";
    const pomodoro = preferences.pomodoro || {};
    const pomodoroInfo = `${pomodoro.focusDuration || 25}min focus + ${
      pomodoro.breakDuration || 5
    }min break, long break ${pomodoro.longBreakDuration || 15}min after ${
      pomodoro.sessionsBeforeLongBreak || 4
    } sessions`;

    // Build the advanced prompt
    const systemPrompt = `You are an advanced AI study scheduler with expertise in time management and Pomodoro technique.

SUBJECTS & EXAMS:
${subjectsInfo}

AVAILABLE TIME SLOTS:
${freeTimeBlocks}

USER PREFERENCES:
- Preferred Study Times: ${preferredTimes}
- Pomodoro Settings: ${pomodoroInfo}
- Min Session: ${preferences.minSessionLength || 30} min
- Max Session: ${preferences.maxSessionLength || 120} min
- Sleep Schedule: ${preferences.sleepSchedule?.start || 23}:00 - ${
      preferences.sleepSchedule?.end || 7
    }:00

FIXED COMMITMENTS:
${formatCommitments(commitments)}

REQUIREMENTS:
1. Schedule study sessions ONLY in available free time slots
2. Respect sleep hours and fixed commitments
3. Prioritize subjects based on exam dates and difficulty
4. Apply Pomodoro intervals within each session
5. Provide EXACT clock times (e.g., "09:00-10:30")
6. Balance subjects across the week
7. Consider user's preferred study times
8. Include break times between Pomodoro sessions

OUTPUT FORMAT (JSON only):
{
  "schedule": [
    {
      "date": "DD-MMMM-YYYY",
      "day": "Monday",
      "sessions": [
        {
          "subject": "Math",
          "startTime": "09:00",
          "endTime": "10:30",
          "duration": 90,
          "pomodoros": [
            {"type": "focus", "duration": 25},
            {"type": "break", "duration": 5},
            {"type": "focus", "duration": 25},
            {"type": "break", "duration": 5},
            {"type": "focus", "duration": 25}
          ],
          "topic": "Calculus review"
        }
      ]
    }
  ]
}`;

    // Try Gemini first, with OpenAI fallback
    let text;
    let usedFallback = false;

    try {
      console.log("🚀 Generating advanced schedule with Gemini...");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt,
        config: {
          temperature: 0.2,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
          topK: 1,
          topP: 0.95,
        },
      });

      text = response.text;

      if (!text && response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        if (
          candidate.content &&
          candidate.content.parts &&
          candidate.content.parts.length > 0
        ) {
          text = candidate.content.parts[0].text;
        }
      }

      if (!text) {
        throw new Error("Empty response from Gemini");
      }
    } catch (geminiError) {
      console.error("❌ Gemini failed, trying OpenAI:", geminiError.message);
      usedFallback = true;

      try {
        text = await generateSmartTimetableWithOpenAI(systemPrompt);
      } catch (openaiError) {
        throw new Error(
          `Both AI services failed. Gemini: ${geminiError.message}, OpenAI: ${openaiError.message}`
        );
      }
    }

    // Parse response
    let cleanedText = text.trim();
    const jsonMatch = cleanedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      cleanedText = jsonMatch[1].trim();
    }

    const result = JSON.parse(cleanedText);

    if (usedFallback) {
      console.log("ℹ️ Advanced schedule generated using OpenAI fallback");
    }

    return result;
  } catch (error) {
    console.error("Advanced schedule generation error:", error);
    throw new Error(`Failed to generate advanced schedule: ${error.message}`);
  }
}

/**
 * Helper: Calculate and format free time blocks for AI prompt
 */
function calculateFreeTimeBlocksForAI(schedule, commitments, preferences) {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let freeTimeText = "";

  days.forEach((day) => {
    const busyBlocks = [];

    // Add schedule blocks
    if (schedule) {
      Object.keys(schedule).forEach((key) => {
        if (key.startsWith(day)) {
          const block = schedule[key];
          busyBlocks.push({ start: block.hour, end: block.hour + 1 });
        }
      });
    }

    // Add commitments
    if (commitments) {
      commitments.forEach((commitment) => {
        if (commitment.days.includes(day.substring(0, 3))) {
          const startHour = parseInt(commitment.startTime.split(":")[0]);
          const endHour = parseInt(commitment.endTime.split(":")[0]);
          busyBlocks.push({ start: startHour, end: endHour });
        }
      });
    }

    // Add sleep
    if (preferences?.sleepSchedule) {
      const { start, end } = preferences.sleepSchedule;
      if (start > end) {
        busyBlocks.push({ start: 0, end: end });
        busyBlocks.push({ start: start, end: 24 });
      } else {
        busyBlocks.push({ start: start, end: end });
      }
    }

    // Sort and merge overlapping blocks
    busyBlocks.sort((a, b) => a.start - b.start);
    const merged = [];
    busyBlocks.forEach((block) => {
      if (merged.length === 0 || merged[merged.length - 1].end < block.start) {
        merged.push(block);
      } else {
        merged[merged.length - 1].end = Math.max(
          merged[merged.length - 1].end,
          block.end
        );
      }
    });

    // Find free blocks
    const freeBlocks = [];
    let currentHour = 0;
    merged.forEach((block) => {
      if (currentHour < block.start) {
        freeBlocks.push(
          `${formatHour(currentHour)}-${formatHour(block.start)}`
        );
      }
      currentHour = Math.max(currentHour, block.end);
    });

    if (currentHour < 24) {
      freeBlocks.push(`${formatHour(currentHour)}-${formatHour(24)}`);
    }

    if (freeBlocks.length > 0) {
      freeTimeText += `${day}: ${freeBlocks.join(", ")}\n`;
    }
  });

  return freeTimeText || "Full schedule available";
}

/**
 * Helper: Format hour as HH:MM
 */
function formatHour(hour) {
  return `${hour.toString().padStart(2, "0")}:00`;
}

/**
 * Helper: Format commitments for prompt
 */
function formatCommitments(commitments) {
  if (!commitments || commitments.length === 0) {
    return "None";
  }

  return commitments
    .map(
      (c) => `- ${c.name} (${c.days.join(", ")}): ${c.startTime}-${c.endTime}`
    )
    .join("\n");
}

export default generateSmartTimetable;
