import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    examDate: {
      type: Date,
      required: true,
    },
    hours: {
      type: Number,
      required: true,
      min: 1,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subject = mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);

export default Subject;
