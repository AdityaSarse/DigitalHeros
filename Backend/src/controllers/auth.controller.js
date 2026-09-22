import { supabaseAdmin } from "../config/supabase.js";

// ─── POST /api/auth/register ────────────────────────────────────────────────

export const register = async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    // Validate required fields
    if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({
            success: false,
            message: "All fields are required: email, password, first_name, last_name.",
        });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        user_metadata: { first_name, last_name },
        email_confirm: true, // Auto-confirm so user can log in immediately
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }

    return res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: {
            id: data.user.id,
            email: data.user.email,
            first_name,
            last_name,
        },
    });
};

// ─── POST /api/auth/login ────────────────────────────────────────────────────

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required.",
        });
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password.",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Login successful.",
        data: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at,
            token_type: "Bearer",
            user: {
                id: data.user.id,
                email: data.user.email,
                first_name: data.user.user_metadata?.first_name ?? null,
                last_name: data.user.user_metadata?.last_name ?? null,
            },
        },
    });
};

// ─── GET /api/auth/me ────────────────────────────────────────────────────────

export const me = async (req, res) => {
    const userId = req.user.id;

    // Fetch the public.users profile created by the Supabase Auth trigger
    const { data: profile, error: profileError } = await supabaseAdmin
        .from("users")
        .select("id, email, first_name, last_name, created_at, updated_at")
        .eq("id", userId)
        .single();

    if (profileError) {
        // Profile may not exist yet (trigger hasn't fired); fall back to auth user data
        return res.status(200).json({
            success: true,
            message: "Authenticated user retrieved.",
            data: {
                id: req.user.id,
                email: req.user.email,
                first_name: req.user.user_metadata?.first_name ?? null,
                last_name: req.user.user_metadata?.last_name ?? null,
            },
        });
    }

    return res.status(200).json({
        success: true,
        message: "Authenticated user retrieved.",
        data: profile,
    });
};
