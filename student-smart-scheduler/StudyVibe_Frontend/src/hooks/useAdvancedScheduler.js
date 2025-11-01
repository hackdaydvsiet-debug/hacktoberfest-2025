import { useState } from "react";
import api from "../services/api";

/**
 * Custom hook for advanced scheduler functionality
 * Handles schedule uploads, parsing, and AI-powered plan generation
 */
const useAdvancedScheduler = () => {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Upload and parse schedule file
   */
  const uploadSchedule = async (file) => {
    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("schedule", file);

      const response = await api.post("/schedule/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setUploadProgress(100);
      return response.data;
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to upload schedule");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate advanced study plan with AI
   */
  const generateAdvancedPlan = async (advancedData) => {
    try {
      setLoading(true);
      setError(null);

      // Call AI service to generate optimized plan
      const response = await api.post("/planner/advanced", advancedData);

      return response.data;
    } catch (err) {
      console.error("Plan generation error:", err);
      setError(err.response?.data?.message || "Failed to generate study plan");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculate free time blocks from schedule
   */
  const calculateFreeTimeBlocks = (schedule, commitments, preferences) => {
    const freeBlocks = [];
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    days.forEach((day) => {
      // Get all busy time blocks for this day
      const busyBlocks = [];

      // Add schedule blocks
      if (schedule) {
        Object.keys(schedule).forEach((key) => {
          if (key.startsWith(day)) {
            const block = schedule[key];
            busyBlocks.push({
              start: block.hour,
              end: block.hour + 1,
              type: block.type,
            });
          }
        });
      }

      // Add commitments
      if (commitments) {
        commitments.forEach((commitment) => {
          if (commitment.days.includes(day.substring(0, 3))) {
            const startHour = parseInt(commitment.startTime.split(":")[0]);
            const endHour = parseInt(commitment.endTime.split(":")[0]);
            busyBlocks.push({
              start: startHour,
              end: endHour,
              type: "commitment",
            });
          }
        });
      }

      // Add sleep hours
      if (preferences?.sleepSchedule) {
        const { start, end } = preferences.sleepSchedule;
        if (start > end) {
          // Sleep crosses midnight
          busyBlocks.push({ start: 0, end: end, type: "sleep" });
          busyBlocks.push({ start: start, end: 24, type: "sleep" });
        } else {
          busyBlocks.push({ start: start, end: end, type: "sleep" });
        }
      }

      // Sort busy blocks
      busyBlocks.sort((a, b) => a.start - b.start);

      // Find free blocks
      let currentHour = 0;
      busyBlocks.forEach((block) => {
        if (currentHour < block.start) {
          freeBlocks.push({
            day,
            startHour: currentHour,
            endHour: block.start,
            duration: block.start - currentHour,
          });
        }
        currentHour = Math.max(currentHour, block.end);
      });

      // Add remaining time at end of day
      if (currentHour < 24) {
        freeBlocks.push({
          day,
          startHour: currentHour,
          endHour: 24,
          duration: 24 - currentHour,
        });
      }
    });

    return freeBlocks;
  };

  /**
   * Reset state
   */
  const reset = () => {
    setLoading(false);
    setUploadProgress(0);
    setError(null);
  };

  return {
    loading,
    uploadProgress,
    error,
    uploadSchedule,
    generateAdvancedPlan,
    calculateFreeTimeBlocks,
    reset,
  };
};

export default useAdvancedScheduler;
