import { supabaseAdmin } from "../config/supabase.js";

/**
 * Middleware: requires the authenticated user to have role = "admin" (case-insensitive).
 * Must be used AFTER authMiddleware so req.user is already populated.
 */
const adminMiddleware = async (req, res, next) => {
    const requestPath = `${req.method} ${req.originalUrl || req.url}`;
    try {
        if (!req.user || !req.user.id) {
            console.warn(`[AdminMiddleware] ${requestPath} - 401 Unauthorized: req.user not set`);
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
                message: "Authentication required.",
            });
        }

        console.log(`[AdminMiddleware] ${requestPath} - Checking admin role for user_id: ${req.user.id}...`);

        const { data: userRecord, error } = await supabaseAdmin
            .from("users")
            .select("role")
            .eq("id", req.user.id)
            .maybeSingle();

        const role = (userRecord?.role || req.user.user_metadata?.role || req.user.role || "").toLowerCase();

        console.log(`[AdminMiddleware] ${requestPath} - DB role: "${userRecord?.role}", resolved role: "${role}"`);

        if (role !== "admin") {
            console.warn(`[AdminMiddleware] ${requestPath} - 403 Forbidden: User ${req.user.id} has role "${role}", expected "admin"`);
            return res.status(403).json({
                success: false,
                error: "Forbidden",
                message: "Admin access required. User does not have admin privileges.",
            });
        }

        console.log(`[AdminMiddleware] ${requestPath} - 200: Admin access authorized for user_id: ${req.user.id}`);
        next();
    } catch (err) {
        console.error(`[AdminMiddleware] ${requestPath} - 500 Internal error checking admin status:`, err.message);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            message: err.message || "Failed to verify admin status.",
        });
    }
};

export default adminMiddleware;
