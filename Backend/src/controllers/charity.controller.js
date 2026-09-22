import { supabaseAdmin } from "../config/supabase.js";

// ─── GET /api/charities ───────────────────────────────────────────────────────

export const getCharities = async (req, res) => {
    const { search } = req.query;

    let query = supabaseAdmin
        .from("charities")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

    if (search && search.trim() !== "") {
        const term = search.trim();
        // ilike search across name and description
        query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
    }

    const { data, error } = await query;

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
        success: true,
        message: "Charities retrieved successfully.",
        data: {
            charities: data,
            total: data.length,
        },
    });
};

// ─── GET /api/charities/my ────────────────────────────────────────────────────
// NOTE: This route MUST be registered before /:id in the router so that the
// literal path segment "my" isn't treated as an :id parameter.

export const getMyCharity = async (req, res) => {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
        .from("user_charities")
        .select("*, charities(*)")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    if (!data) {
        return res.status(404).json({
            success: false,
            message: "You have not selected a charity yet.",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Your charity selection retrieved successfully.",
        data,
    });
};

// ─── GET /api/charities/:id ───────────────────────────────────────────────────

export const getCharityById = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
        .from("charities")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle();

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    if (!data) {
        return res.status(404).json({
            success: false,
            message: "Charity not found or is not active.",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Charity retrieved successfully.",
        data,
    });
};

// ─── POST /api/charities/select ───────────────────────────────────────────────

export const selectCharity = async (req, res) => {
    const userId = req.user.id;
    const { charity_id, contribution_percentage } = req.body;

    // Validate inputs
    if (!charity_id) {
        return res.status(400).json({
            success: false,
            message: "charity_id is required.",
        });
    }

    if (
        contribution_percentage === undefined ||
        contribution_percentage === null ||
        contribution_percentage === ""
    ) {
        return res.status(400).json({
            success: false,
            message: "contribution_percentage is required.",
        });
    }

    const pct = Number(contribution_percentage);
    if (isNaN(pct) || pct < 10) {
        return res.status(400).json({
            success: false,
            message: "contribution_percentage must be a number and at least 10.",
        });
    }

    // Verify charity exists and is active
    const { data: charity, error: charityErr } = await supabaseAdmin
        .from("charities")
        .select("id, is_active")
        .eq("id", charity_id)
        .maybeSingle();

    if (charityErr) {
        return res.status(500).json({ success: false, message: charityErr.message });
    }

    if (!charity || !charity.is_active) {
        return res.status(404).json({
            success: false,
            message: "Charity not found or is not active.",
        });
    }

    // Upsert: update if the user already has a selection, insert otherwise
    const { data, error } = await supabaseAdmin
        .from("user_charities")
        .upsert(
            {
                user_id: userId,
                charity_id,
                contribution_percentage: pct,
            },
            {
                onConflict: "user_id",   // assumes a unique constraint on user_id
                ignoreDuplicates: false,
            }
        )
        .select("*, charities(*)")
        .single();

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
        success: true,
        message: "Charity selection saved successfully.",
        data,
    });
};
