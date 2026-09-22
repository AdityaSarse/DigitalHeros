import { supabaseAdmin } from "../config/supabase.js";

// ─── USER: GET /api/winners ───────────────────────────────────────────────────

export const getMyWinnings = async (req, res) => {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
        .from("winners")
        .select(
            `*,
            draws ( id, draw_month, prize_pool_amount, status ),
            draw_entries ( id, entry_numbers ),
            winner_proofs ( id, file_url, file_name, uploaded_at )`
        )
        .eq("user_id", userId)
        .order("won_at", { ascending: false });

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
        success: true,
        message: "Your winnings retrieved successfully.",
        data: { winners: data, total: data.length },
    });
};

// ─── USER: GET /api/winners/:id ───────────────────────────────────────────────

export const getWinnerById = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
        .from("winners")
        .select(
            `*,
            draws ( id, draw_month, prize_pool_amount, status ),
            draw_entries ( id, entry_numbers ),
            winner_proofs ( id, file_url, file_name, uploaded_at )`
        )
        .eq("id", id)
        .maybeSingle();

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    // Ownership check — return 404 rather than 403 to avoid enumeration
    if (!data || data.user_id !== userId) {
        return res.status(404).json({
            success: false,
            message: "Winner record not found.",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Winner record retrieved successfully.",
        data,
    });
};

// ─── USER: POST /api/winners/:id/proof ───────────────────────────────────────
//
// MVP approach: the client uploads the file directly to Supabase Storage
// using its anon key, then POSTs { file_url, file_name } to this endpoint.
// This keeps service-role secrets off the frontend entirely.

export const submitProof = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { file_url, file_name } = req.body;

    if (!file_url) {
        return res.status(400).json({
            success: false,
            message: "file_url is required.",
        });
    }

    // Verify the winner record belongs to this user
    const { data: winner, error: winnerErr } = await supabaseAdmin
        .from("winners")
        .select("id, user_id, verification_status")
        .eq("id", id)
        .maybeSingle();

    if (winnerErr || !winner) {
        return res.status(404).json({ success: false, message: "Winner record not found." });
    }

    if (winner.user_id !== userId) {
        return res.status(404).json({ success: false, message: "Winner record not found." });
    }

    if (winner.verification_status === "APPROVED") {
        return res.status(409).json({
            success: false,
            message: "Proof cannot be submitted for an already approved winner.",
        });
    }

    const { data, error } = await supabaseAdmin
        .from("winner_proofs")
        .insert({
            winner_id: id,
            file_url,
            file_name: file_name ?? null,
        })
        .select()
        .single();

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(201).json({
        success: true,
        message: "Proof submitted successfully.",
        data,
    });
};

// ─── ADMIN: GET /api/admin/winners ────────────────────────────────────────────

export const adminGetWinners = async (req, res) => {
    const { status, payout } = req.query;

    let query = supabaseAdmin
        .from("winners")
        .select(
            `*,
            users ( id, first_name, last_name ),
            draws ( id, draw_month, prize_pool_amount ),
            draw_entries ( id, entry_numbers ),
            winner_proofs ( id, file_url, file_name, uploaded_at, reviewed_at )`
        )
        .order("won_at", { ascending: false });

    // Optional filters
    const validVerificationStatuses = ["PENDING", "APPROVED", "REJECTED"];
    if (status && validVerificationStatuses.includes(status)) {
        query = query.eq("verification_status", status);
    }

    const validPayoutStatuses = ["PENDING", "PAID"];
    if (payout && validPayoutStatuses.includes(payout)) {
        query = query.eq("payout_status", payout);
    }

    const { data, error } = await query;

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
        success: true,
        message: "Winners retrieved successfully.",
        data: { winners: data, total: data.length },
    });
};

// ─── ADMIN: PATCH /api/admin/winners/:id/verify ───────────────────────────────

export const adminVerifyWinner = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["APPROVED", "REJECTED"];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `status is required and must be one of: ${validStatuses.join(", ")}.`,
        });
    }

    // Confirm winner exists
    const { data: existing, error: fetchErr } = await supabaseAdmin
        .from("winners")
        .select("id, verification_status, payout_status")
        .eq("id", id)
        .maybeSingle();

    if (fetchErr || !existing) {
        return res.status(404).json({ success: false, message: "Winner not found." });
    }

    if (existing.verification_status !== "PENDING") {
        return res.status(409).json({
            success: false,
            message: `Winner is already ${existing.verification_status}. Cannot change again.`,
        });
    }

    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
        .from("winners")
        .update({
            verification_status: status,
            verified_at: now,
            updated_at: now,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    // Stamp reviewed_at on all proofs for this winner
    await supabaseAdmin
        .from("winner_proofs")
        .update({ reviewed_at: now })
        .eq("winner_id", id);

    return res.status(200).json({
        success: true,
        message: `Winner ${status.toLowerCase()} successfully.`,
        data,
    });
};

// ─── ADMIN: PATCH /api/admin/winners/:id/payout ───────────────────────────────

export const adminPayoutWinner = async (req, res) => {
    const { id } = req.params;

    const { data: existing, error: fetchErr } = await supabaseAdmin
        .from("winners")
        .select("id, verification_status, payout_status")
        .eq("id", id)
        .maybeSingle();

    if (fetchErr || !existing) {
        return res.status(404).json({ success: false, message: "Winner not found." });
    }

    if (existing.verification_status !== "APPROVED") {
        return res.status(409).json({
            success: false,
            message: "Winner must be APPROVED before marking as paid.",
        });
    }

    if (existing.payout_status === "PAID") {
        return res.status(409).json({
            success: false,
            message: "Winner is already marked as paid.",
        });
    }

    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
        .from("winners")
        .update({
            payout_status: "PAID",
            paid_at: now,
            updated_at: now,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
        success: true,
        message: "Payout recorded successfully.",
        data,
    });
};
