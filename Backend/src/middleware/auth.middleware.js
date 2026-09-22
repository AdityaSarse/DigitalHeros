import { supabaseAdmin } from "../config/supabase.js";

/**
 * Middleware to verify Supabase JWT and attach user to req.user
 */
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized",
            message: "Unauthorized: No token provided.",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
                message: "Unauthorized: Invalid or expired token.",
            });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            message: "Internal server error during authentication.",
        });
    }
};

export default authMiddleware;
