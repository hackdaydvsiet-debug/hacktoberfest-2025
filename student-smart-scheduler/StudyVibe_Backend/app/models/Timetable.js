import mongoose from "mongoose";

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
      min: 0,
    },
  },
  { _id: false }
);

const TimetableSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: [StudySlotSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Timetable =
  mongoose.models.Timetable || mongoose.model("Timetable", TimetableSchema);

export default Timetable;
