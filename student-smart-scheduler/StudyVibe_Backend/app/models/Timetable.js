/**
 * Timetable Model
 *
 * Manages study timetables with scheduled study slots.
 * Each timetable contains multiple study slots distributed across dates.
 *
 * @module models/Timetable
 */

import mongoose from "mongoose";

/**
 * Study Slot Schema
 *
 * Represents a single study session in the timetable.
 * Each slot specifies when to study, what subject, and for how long.
 *
 * @typedef {Object} StudySlot
 * @property {Date} date - When this study session is scheduled
 * @property {string} subject - Name of the subject to study
 * @property {number} hours - Duration of the study session in hours
 */
const StudySlotSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    hours: {
      type: Number,
      required: true,
      min: 0, // Can be 0 for rest days
    },
  },
  {
    _id: false, // Don't create separate IDs for sub-documents
  }
);

/**
 * Timetable Schema Definition
 *
 * @typedef {Object} Timetable
 * @property {ObjectId} userId - User who owns this timetable
 * @property {StudySlot[]} plan - Array of study slots
 * @property {Date} createdAt - When the timetable was created
 * @property {Date} updatedAt - Last time the timetable was modified
 */
const TimetableSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User collection
      required: true,
    },
    plan: {
      type: [StudySlotSchema], // Array of study slots
      required: true,
    },
  },
  {
    timestamps: true, // Track creation and update times
  }
);

// Avoid model recompilation during development
const Timetable =
  mongoose.models.Timetable || mongoose.model("Timetable", TimetableSchema);

export default Timetable;
