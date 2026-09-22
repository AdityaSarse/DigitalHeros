import { Router } from "express";

// ── Admin controller (users + charities + draw list) ─────────────────────────
import {
    getUsers,
    getUserById,
    adminGetCharities,
    adminCreateCharity,
    adminUpdateCharity,
    adminDeleteCharity,
    adminGetDraws,
} from "../controllers/admin.controller.js";

// ── Reuse existing draw controller for simulation/publish ─────────────────────
import {
    createDraw,
    simulateDraw,
    publishDraw,
} from "../controllers/draw.controller.js";

// ── Reuse existing winner controller ─────────────────────────────────────────
import {
    adminGetWinners,
    adminVerifyWinner,
    adminPayoutWinner,
} from "../controllers/winner.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = Router();

// All admin routes require auth + admin role check
router.use(authMiddleware, adminMiddleware);

// ── Users ─────────────────────────────────────────────────────────────────────
router.get("/users", getUsers);
router.get("/users/:id", getUserById);

// ── Charities ─────────────────────────────────────────────────────────────────
router.get("/charities", adminGetCharities);
router.post("/charities", adminCreateCharity);
router.patch("/charities/:id", adminUpdateCharity);
router.delete("/charities/:id", adminDeleteCharity);

// ── Draws ─────────────────────────────────────────────────────────────────────
// IMPORTANT: specific sub-paths (/simulate, /publish) before plain /:id.
router.get("/draws", adminGetDraws);
router.post("/draws", createDraw);
router.post("/draws/:id/simulate", simulateDraw);
router.post("/draws/:id/publish", publishDraw);

// ── Winners ───────────────────────────────────────────────────────────────────
router.get("/winners", adminGetWinners);
router.patch("/winners/:id/verify", adminVerifyWinner);
router.patch("/winners/:id/payout", adminPayoutWinner);

export default router;

