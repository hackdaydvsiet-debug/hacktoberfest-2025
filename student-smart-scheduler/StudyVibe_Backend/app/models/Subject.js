/**
 * Subject Model
 *
 * Defines the schema for subjects in the study planner system.
 * Each subject has an exam date and required study hours.
 *
 * @module models/Subject
 */

import mongoose from "mongoose";

/**
 * Subject Schema Definition
 *
 * @typedef {Object} Subject
 * @property {string} name - Name of the subject (e.g., "Mathematics", "Physics")
 * @property {Date} examDate - When the exam is scheduled
 * @property {number} hours - Total hours needed to prepare for this subject
 * @property {ObjectId} userId - Reference to the user who owns this subject
 * @property {Date} createdAt - Automatically added by timestamps
 * @property {Date} updatedAt - Automatically updated by timestamps
 */
const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Remove whitespace from both ends
    },
    examDate: {
      type: Date,
      required: true,
    },
    hours: {
      type: Number,
      required: true,
      min: 1, // At least 1 hour of study required
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to User model
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Use existing model if available, otherwise create new one
// This prevents model recompilation errors during development
const Subject =
  mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);

export default Subject;
