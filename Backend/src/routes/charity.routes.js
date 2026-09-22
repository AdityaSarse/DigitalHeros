import { Router } from "express";
import {
    getCharities,
    getCharityById,
    selectCharity,
    getMyCharity,
} from "../controllers/charity.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

// ── Public / optionally authenticated ────────────────────────────────────────
router.get("/", getCharities);

// ── Protected ─────────────────────────────────────────────────────────────────
// IMPORTANT: /my must be registered BEFORE /:id so Express doesn't consume
// the literal string "my" as an :id parameter value.
router.get("/my", authMiddleware, getMyCharity);
router.post("/select", authMiddleware, selectCharity);

// ── Public (parameterised — must come last) ───────────────────────────────────
router.get("/:id", getCharityById);

export default router;
