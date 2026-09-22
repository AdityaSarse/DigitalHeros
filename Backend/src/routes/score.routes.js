import { Router } from "express";
import { createScore, getScores, updateScore, deleteScore } from "../controllers/score.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

// All score routes are protected
router.use(authMiddleware);

router.post("/", createScore);
router.get("/", getScores);
router.put("/:id", updateScore);
router.delete("/:id", deleteScore);

export default router;
