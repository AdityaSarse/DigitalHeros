import express from "express";
import cors from "cors";

// ── Route Imports ─────────────────────────────────────────────────────────────
import authRoutes from "./routes/auth.routes.js";
import scoreRoutes from "./routes/score.routes.js";
import charityRoutes from "./routes/charity.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import drawRoutes from "./routes/draw.routes.js";
import winnerRoutes from "./routes/winner.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// ── Route Mounts ──────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/charities", charityRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/draws", drawRoutes);
app.use("/api/winners", winnerRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Digital Heroes API is running",
    });
});

// Global error handler
app.use(errorMiddleware);

export default app;
