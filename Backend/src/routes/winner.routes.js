import { Router } from "express";
import {
    getMyWinnings,
    getWinnerById,
    submitProof,
} from "../controllers/winner.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

// All user winner routes are protected
router.use(authMiddleware);

// IMPORTANT: /:id/proof must be registered before a hypothetical plain /:id
// so the literal "proof" segment is never consumed as an :id value.
router.get("/", getMyWinnings);
router.post("/:id/proof", submitProof);
router.get("/:id", getWinnerById);

export default router;
