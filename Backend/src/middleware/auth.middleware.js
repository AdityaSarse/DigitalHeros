import { supabaseAdmin } from "../config/supabase.js";

/**
 * Middleware to verify Supabase JWT and attach user to req.user
 */
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const requestPath = `${req.method} ${req.originalUrl || req.url}`;

    console.log(`[AuthMiddleware] ${requestPath} - Incoming request. Checking Authorization header...`);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.warn(`[AuthMiddleware] ${requestPath} - 401 Unauthorized: Missing or malformed Authorization Bearer header`);
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
            console.warn(`[AuthMiddleware] ${requestPath} - 401 Unauthorized: Invalid or expired token. Error: ${error?.message}`);
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
                message: "Unauthorized: Invalid or expired token.",
            });
        }

        console.log(`[AuthMiddleware] ${requestPath} - 200: Authenticated user id: ${user.id} (${user.email})`);
        req.user = user;
        next();
    } catch (err) {
        console.error(`[AuthMiddleware] ${requestPath} - 500 Internal error verifying token:`, err.message);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            message: "Internal server error during authentication.",
        });
    }
};

export default authMiddleware;
