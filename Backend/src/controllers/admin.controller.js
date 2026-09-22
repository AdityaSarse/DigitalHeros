import { supabaseAdmin } from "../config/supabase.js";

// ─── USERS ────────────────────────────────────────────────────────────────────

/**
 * GET /api/admin/users
 * List all users with their latest subscription.
 * Optional: ?search=<term>  searches first_name or last_name.
 */
export const getUsers = async (req, res) => {
    const { search } = req.query;

    let query = supabaseAdmin
        .from("users")
        .select(
            `id, first_name, last_name, role, created_at, updated_at,
            subscriptions ( id, plan, status, amount, currency, start_date, renewal_date, cancelled_at )`
        )
        .order("created_at", { ascending: false });

    if (search && search.trim() !== "") {
        const term = search.trim();
        query = query.or(`first_name.ilike.%${term}%,last_name.ilike.%${term}%`);
    }

    const { data, error } = await query;

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
        success: true,
        message: "Users retrieved successfully.",
        data: { users: data, total: data.length },
    });
};

/**
 * GET /api/admin/users/:id
 * Single user with subscription and score summary.
 */
export const getUserById = async (req, res) => {
    const { id } = req.params;

    const { data: user, error: userErr } = await supabaseAdmin
        .from("users")
        .select(
            `id, first_name, last_name, role, created_at, updated_at,
            subscriptions ( id, plan, status, amount, currency, start_date, renewal_date, cancelled_at ),
            user_charities ( id, contribution_percentage, is_active, selected_at, charities ( id, name ) )`
        )
        .eq("id", id)
        .maybeSingle();

    if (userErr || !user) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    // Fetch score count separately (simple aggregation)
    const { count: scoreCount } = await supabaseAdmin
        .from("scores")
        .select("id", { count: "exact", head: true })
        .eq("user_id", id);

    return res.status(200).json({
        success: true,
        message: "User retrieved successfully.",
        data: { ...user, score_count: scoreCount ?? 0 },
    });
};

// ─── CHARITIES ────────────────────────────────────────────────────────────────

/**
 * GET /api/admin/charities
 * Return ALL charities including inactive ones.
 */
export const adminGetCharities = async (req, res) => {
    const { data, error } = await supabaseAdmin
        .from("charities")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
        success: true,
        message: "Charities retrieved successfully.",
        data: { charities: data, total: data.length },
    });
};

/**
 * POST /api/admin/charities
 * Create a charity.
 */
export const adminCreateCharity = async (req, res) => {
    const { name, description, image_url, website_url, is_featured } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "name is required.",
        });
    }

    const { data, error } = await supabaseAdmin
        .from("charities")
        .insert({
            name: name.trim(),
            description: description ?? null,
            image_url: image_url ?? null,
            website_url: website_url ?? null,
            is_featured: is_featured === true || is_featured === "true",
            is_active: true,
        })
        .select()
        .single();

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(201).json({
        success: true,
        message: "Charity created successfully.",
        data,
    });
};

/**
 * PATCH /api/admin/charities/:id
 * Update charity fields.
 */
export const adminUpdateCharity = async (req, res) => {
    const { id } = req.params;
    const { name, description, image_url, website_url, is_featured, is_active } = req.body;

    // Verify the charity exists
    const { data: existing, error: fetchErr } = await supabaseAdmin
        .from("charities")
        .select("id")
        .eq("id", id)
        .maybeSingle();

    if (fetchErr || !existing) {
        return res.status(404).json({ success: false, message: "Charity not found." });
    }

    // Build update payload with only provided fields
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (image_url !== undefined) updates.image_url = image_url;
    if (website_url !== undefined) updates.website_url = website_url;
    if (is_featured !== undefined) updates.is_featured = is_featured === true || is_featured === "true";
    if (is_active !== undefined) updates.is_active = is_active === true || is_active === "true";

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({
            success: false,
            message: "No update fields provided.",
        });
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
        .from("charities")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
        success: true,
        message: "Charity updated successfully.",
        data,
    });
};

/**
 * DELETE /api/admin/charities/:id
 * Soft-delete: sets is_active = false rather than hard-deleting.
 * This preserves referential integrity with user_charities.
 */
export const adminDeleteCharity = async (req, res) => {
    const { id } = req.params;

    const { data: existing, error: fetchErr } = await supabaseAdmin
        .from("charities")
        .select("id, is_active")
        .eq("id", id)
        .maybeSingle();

    if (fetchErr || !existing) {
        return res.status(404).json({ success: false, message: "Charity not found." });
    }

    if (!existing.is_active) {
        return res.status(409).json({
            success: false,
            message: "Charity is already inactive.",
        });
    }

    const { data, error } = await supabaseAdmin
        .from("charities")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
        success: true,
        message: "Charity deactivated successfully.",
        data,
    });
};

// ─── DRAWS (admin list) ───────────────────────────────────────────────────────

/**
 * GET /api/admin/draws
 * Return ALL draws regardless of status.
 * Optional: ?status=DRAFT|SIMULATED|PUBLISHED|COMPLETED
 */
export const adminGetDraws = async (req, res) => {
    const { status } = req.query;
    const validStatuses = ["DRAFT", "SIMULATED", "PUBLISHED", "COMPLETED"];

    let query = supabaseAdmin
        .from("draws")
        .select("*")
        .order("draw_month", { ascending: false });

    if (status && validStatuses.includes(status)) {
        query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
        success: true,
        message: "Draws retrieved successfully.",
        data: { draws: data, total: data.length },
    });
};
