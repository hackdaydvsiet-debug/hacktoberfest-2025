/**
 * StudyVibe Backend - Main Application Entry Point
 *
 * This is the main server file that sets up the Express application,
 * configures middleware, and defines routes for the StudyVibe platform.
 *
 * @author Shailav Malik
 * @version 1.0.0
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";

// Import route handlers
import plannerRoute from "./routes/planner.route.js";
import timetableRoute from "./routes/timeTable.route.js";
import scheduleRoute from "./routes/schedule.route.js";

// Import middleware
import LoggingMiddleware from "./middleware/logging.js";

// Uncomment when MongoDB integration is needed
// import connectToMongoDB from "./db/connectToMongoDB.js";

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

/**
 * CORS Configuration
 * Allows requests from any origin - useful during development
 * TODO: In production, restrict this to specific frontend domains
 */
app.use(
  cors({
    origin: "*", // Allow all origins for now
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["*"],
  })
);

// Add request logging to track API calls
app.use(LoggingMiddleware);

// Body parser middleware - parses incoming JSON requests
app.use(express.json());

/**
 * File Upload Directory Setup
 * Creates the uploads/schedules directory if it doesn't exist
 * This is where schedule files will be stored when users upload them
 */
const uploadsDir = "./uploads/schedules";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory: ${uploadsDir}`);
}

/**
 * API Routes
 * All routes are prefixed with /api to keep the API organized
 */
app.use("/api/planner", plannerRoute); // Study planner generation endpoints
app.use("/api/timetable", timetableRoute); // Timetable management endpoints
app.use("/api/schedule", scheduleRoute); // Schedule upload and parsing endpoints

/**
 * Root Endpoint
 * Returns basic API information - useful for checking if the server is up
 */
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to StudyVibe API!",
    app_name: process.env.APP_NAME || "StudyVibe Backend",
    version: process.env.API_VERSION || "v1",
    status: "running",
    endpoints: {
      health: "/health",
      planner: "/api/planner",
      timetable: "/api/timetable",
      schedule: "/api/schedule",
    },
  });
});

/**
 * Health Check Endpoint
 * Used by monitoring services (like Render) to verify the service is running
 * Returns server uptime and current status
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()), // Server uptime in seconds
    environment: process.env.NODE_ENV || "development",
  });
});

/**
 * Start the Express server
 * Listens on the port specified in .env or defaults to 3001
 */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server started successfully!`);
  console.log(`📡 Listening on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);

  // Connect to MongoDB when ready
  // connectToMongoDB();

  if (process.env.NODE_ENV === "development") {
    console.log(`🔗 Local URL: http://localhost:${PORT}`);
  }
});
