import { Router } from "express";
import { createCheckoutSession } from "../controllers/payment.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

// POST /api/subscription/checkout  (protected)
router.post("/checkout", authMiddleware, createCheckoutSession);

export default router;
