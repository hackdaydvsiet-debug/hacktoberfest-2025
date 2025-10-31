import express from "express";
import {
  saveTimetable,
  generateSmartTimetableController,
} from "../controllers/timeTable.controler.js";
import Timetable from "../models/Timetable.js";

const router = express.Router();

router.post("/save", saveTimetable);
router.post("/generate-smart", generateSmartTimetableController);
router.get("/:userId", async (req, res) => {
  try {
    const timetable = await Timetable.findOne({ userId: req.params.userId });
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
