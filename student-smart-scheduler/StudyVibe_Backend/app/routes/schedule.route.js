import express from "express";
import multer from "multer";
import {
  uploadSchedule,
  parseSchedule,
} from "../controllers/schedule.controller.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/schedules/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images, PDFs, and CSV files
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "application/pdf" ||
      file.mimetype === "text/csv"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only PDF, PNG, JPG, and CSV are allowed.")
      );
    }
  },
});

// POST /api/schedule/upload - Upload and parse schedule
router.post("/upload", upload.single("schedule"), uploadSchedule);

// POST /api/schedule/parse - Parse uploaded schedule (alternative endpoint)
router.post("/parse", parseSchedule);

export default router;
