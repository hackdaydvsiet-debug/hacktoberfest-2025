/**
 * Request Logging Middleware
 *
 * Logs incoming requests and outgoing responses with timing information.
 * Helps with debugging and monitoring API performance.
 *
 * @module middleware/logging
 */

import express from "express";

/**
 * Middleware function to log HTTP requests and responses
 *
 * Logs:
 * - HTTP method and URL for each request
 * - Response status code and processing time
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next middleware function
 */
function loggingMiddleware(req, res, next) {
  const startTime = Date.now();

  // Log incoming request with timestamp
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);

  // Listen for response finish event to log processing time
  res.on("finish", () => {
    const processTime = (Date.now() - startTime) / 1000;
    const statusEmoji = res.statusCode < 400 ? "✅" : "❌";

    console.log(
      `${statusEmoji} ${res.statusCode} ${req.method} ${
        req.originalUrl
      } - ${processTime.toFixed(2)}s`
    );
  });

  // Pass control to next middleware
  next();
}

export default loggingMiddleware;
