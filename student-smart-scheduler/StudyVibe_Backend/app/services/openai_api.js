import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate a smart study timetable using OpenAI GPT-4o
 * @param {String} systemPrompt - The complete prompt with subjects, dates, and instructions
 * @returns {String} Raw JSON text response
 */
export async function generateSmartTimetableWithOpenAI(systemPrompt) {
  try {
    console.log("🔄 Using OpenAI GPT-4o...");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a study planner AI. Generate detailed study timetables in JSON format.",
        },
        {
          role: "user",
          content: systemPrompt,
        },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0].message.content;

    if (!text) {
      throw new Error("Empty response from OpenAI API");
    }

    console.log("✅ OpenAI GPT-4o succeeded");
    return text;
  } catch (error) {
    console.error("❌ OpenAI API Error:", error.message);
    throw error;
  }
}

export default generateSmartTimetableWithOpenAI;
