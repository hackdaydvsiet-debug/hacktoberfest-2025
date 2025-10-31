import express from "express";
import plannerController, {
  advancedPlannerController,
} from "../controllers/planner.controller.js";

const router = express.Router();

router.post("/generate", plannerController);
router.post("/advanced", advancedPlannerController);

export default router;
