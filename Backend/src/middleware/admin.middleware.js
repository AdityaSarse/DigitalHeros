import { supabaseAdmin } from "../config/supabase.js";

/**
 * Middleware: requires the authenticated user to have role = "admin" (case-insensitive).
 * Must be used AFTER authMiddleware so req.user is already populated.
 */
const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
                message: "Authentication required.",
            });
        }

        const { data: userRecord, error } = await supabaseAdmin
            .from("users")
            .select("role")
            .eq("id", req.user.id)
            .maybeSingle();

        const role = (userRecord?.role || req.user.user_metadata?.role || req.user.role || "").toLowerCase();

        if (role !== "admin") {
            return res.status(403).json({
                success: false,
                error: "Forbidden",
                message: "Admin access required. User does not have admin privileges.",
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            message: err.message || "Failed to verify admin status.",
        });
    }
};

export default adminMiddleware;
