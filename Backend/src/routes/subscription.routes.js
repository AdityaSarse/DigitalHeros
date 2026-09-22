import { Router } from "express";
import {
    getSubscription,
    createSubscription,
    cancelSubscription,
} from "../controllers/subscription.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

// All subscription routes are protected
router.use(authMiddleware);

// IMPORTANT: /cancel must be registered before /:id (if any parameterised routes
// are added later) to avoid "cancel" being consumed as a param value.
router.get("/", getSubscription);
router.post("/", createSubscription);
router.patch("/cancel", cancelSubscription);

export default router;
