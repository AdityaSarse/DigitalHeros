import { Router } from "express";
import {
    createDraw,
    simulateDraw,
    publishDraw,
    getDraws,
    getDrawById,
    getMyEntries,
    enterDraw,
} from "../controllers/draw.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = Router();

// ── Public / User routes ──────────────────────────────────────────────────────
router.get("/", getDraws);
router.get("/:id", getDrawById);

// ── Protected user routes ─────────────────────────────────────────────────────
// IMPORTANT: specific sub-paths (/entries, /enter) must come BEFORE /:id handler.
// They are registered on /:id/entries and /:id/enter which Express resolves correctly
// because they are more specific than a plain /:id GET.
router.post("/:id/enter", authMiddleware, enterDraw);
router.get("/:id/entries", authMiddleware, getMyEntries);

// ── Admin-only routes (auth + admin check) ────────────────────────────────────
router.post("/", authMiddleware, adminMiddleware, createDraw);
router.post("/:id/simulate", authMiddleware, adminMiddleware, simulateDraw);
router.post("/:id/publish", authMiddleware, adminMiddleware, publishDraw);

export default router;
