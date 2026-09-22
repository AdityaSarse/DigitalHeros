import { Router } from "express";
import { stripeWebhook } from "../controllers/payment.controller.js";

const router = Router();

// POST /api/webhooks/stripe
// express.raw() is applied in app.js BEFORE express.json() for this path.
router.post("/stripe", stripeWebhook);

export default router;
