import { supabaseAdmin } from "../config/supabase.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Validate score value: integer between 1 and 45.
 * Returns an error string, or null if valid.
 */
function validateScore(score) {
    if (score === undefined || score === null || score === "") {
        return "score is required.";
    }
    const num = Number(score);
    if (!Number.isInteger(num)) {
        return "score must be an integer.";
    }
    if (num < 1 || num > 45) {
        return "score must be between 1 and 45.";
    }
    return null;
}

/**
 * Validate score_date: must be a valid ISO date string (YYYY-MM-DD).
 * Returns an error string, or null if valid.
 */
function validateScoreDate(score_date) {
    if (!score_date) {
        return "score_date is required.";
    }
    // Accept YYYY-MM-DD only
    const iso = /^\d{4}-\d{2}-\d{2}$/.test(score_date);
    if (!iso || isNaN(Date.parse(score_date))) {
        return "score_date must be a valid date in YYYY-MM-DD format.";
    }
    return null;
}

/**
 * Given a sorted (newest-first) array of score rows, return the latest 5
 * score values as a plain array of numbers.
 */
function calcLatestFive(scores) {
    return scores.slice(0, 5).map((s) => s.score);
}

// ─── POST /api/scores ─────────────────────────────────────────────────────────

export const createScore = async (req, res) => {
    const userId = req.user.id;
    const { score, score_date } = req.body;

    const scoreErr = validateScore(score);
    if (scoreErr) {
        return res.status(400).json({ success: false, message: scoreErr });
    }
    const dateErr = validateScoreDate(score_date);
    if (dateErr) {
        return res.status(400).json({ success: false, message: dateErr });
    }

    const { data, error } = await supabaseAdmin
        .from("scores")
        .insert({
            user_id: userId,
            score: Number(score),
            score_date,
        })
        .select()
        .single();

    if (error) {
        // Supabase unique-constraint violations surface as code "23505"
        if (
            error.code === "23505" ||
            (error.message && error.message.toLowerCase().includes("unique"))
        ) {
            return res.status(409).json({
                success: false,
                message: `You already have a score recorded for ${score_date}.`,
            });
        }
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(201).json({
        success: true,
        message: "Score created successfully.",
        data,
    });
};

// ─── GET /api/scores ──────────────────────────────────────────────────────────

export const getScores = async (req, res) => {
    const userId = req.user.id;

    const { data: scores, error } = await supabaseAdmin
        .from("scores")
        .select("*")
        .eq("user_id", userId)
        .order("score_date", { ascending: false });

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
        success: true,
        message: "Scores retrieved successfully.",
        data: {
            scores,
            latest_five: calcLatestFive(scores),
            total: scores.length,
        },
    });
};

// ─── PUT /api/scores/:id ──────────────────────────────────────────────────────

export const updateScore = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { score, score_date } = req.body;

    const scoreErr = validateScore(score);
    if (scoreErr) {
        return res.status(400).json({ success: false, message: scoreErr });
    }
    const dateErr = validateScoreDate(score_date);
    if (dateErr) {
        return res.status(400).json({ success: false, message: dateErr });
    }

    // Verify the record exists and belongs to this user
    const { data: existing, error: fetchErr } = await supabaseAdmin
        .from("scores")
        .select("id, user_id")
        .eq("id", id)
        .single();

    if (fetchErr || !existing) {
        return res.status(404).json({ success: false, message: "Score not found." });
    }

    if (existing.user_id !== userId) {
        return res.status(403).json({
            success: false,
            message: "You are not allowed to update this score.",
        });
    }

    const { data, error } = await supabaseAdmin
        .from("scores")
        .update({ score: Number(score), score_date })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        if (
            error.code === "23505" ||
            (error.message && error.message.toLowerCase().includes("unique"))
        ) {
            return res.status(409).json({
                success: false,
                message: `You already have a score recorded for ${score_date}.`,
            });
        }
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
        success: true,
        message: "Score updated successfully.",
        data,
    });
};

// ─── DELETE /api/scores/:id ───────────────────────────────────────────────────

export const deleteScore = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    // Verify the record exists and belongs to this user
    const { data: existing, error: fetchErr } = await supabaseAdmin
        .from("scores")
        .select("id, user_id")
        .eq("id", id)
        .single();

    if (fetchErr || !existing) {
        return res.status(404).json({ success: false, message: "Score not found." });
    }

    if (existing.user_id !== userId) {
        return res.status(403).json({
            success: false,
            message: "You are not allowed to delete this score.",
        });
    }

    const { error } = await supabaseAdmin.from("scores").delete().eq("id", id);

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
        success: true,
        message: "Score deleted successfully.",
        data: null,
    });
};
