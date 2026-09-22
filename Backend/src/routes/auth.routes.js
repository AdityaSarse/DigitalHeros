import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authMiddleware, me);

export default router;
