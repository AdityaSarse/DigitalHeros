import { supabaseAdmin } from "../config/supabase.js";
import {
    generateWinningNumbers,
    categoriseWinners,
    buildPrizeAllocations,
    validateEntryNumbers,
} from "../services/draw.service.js";

// ─── ADMIN: POST /api/draws & POST /api/admin/draws ──────────────────────────

export const createDraw = async (req, res) => {
    try {
        const { draw_month, prize_pool_amount, jackpot_amount, algorithm } = req.body;

        // Validate draw_month (must be non-empty string in valid date format)
        if (!draw_month || typeof draw_month !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(draw_month.trim())) {
            return res.status(400).json({
                success: false,
                error: "Bad Request",
                message: "draw_month is required in YYYY-MM-DD format (e.g. 2026-09-01).",
            });
        }

        // Validate prize_pool_amount (must be valid positive number)
        const prizePoolNum = Number(prize_pool_amount);
        if (prize_pool_amount === undefined || prize_pool_amount === null || isNaN(prizePoolNum) || prizePoolNum <= 0) {
            return res.status(400).json({
                success: false,
                error: "Bad Request",
                message: "prize_pool_amount is required and must be a number greater than 0.",
            });
        }

        // Validate jackpot_amount if provided
        let jackpotNum = 0;
        if (jackpot_amount !== undefined && jackpot_amount !== null && jackpot_amount !== "") {
            jackpotNum = Number(jackpot_amount);
            if (isNaN(jackpotNum) || jackpotNum < 0) {
                return res.status(400).json({
                    success: false,
                    error: "Bad Request",
                    message: "jackpot_amount must be a valid non-negative number.",
                });
            }
        }

        const validAlgorithms = ["RANDOM", "ALGORITHMIC"];
        const resolvedAlgorithm = algorithm && validAlgorithms.includes(algorithm) ? algorithm : "RANDOM";

        // Prevent duplicate draw for the same month
        const { data: existing, error: existingErr } = await supabaseAdmin
            .from("draws")
            .select("id")
            .eq("draw_month", draw_month.trim())
            .maybeSingle();

        if (existingErr) {
            return res.status(500).json({
                success: false,
                error: "Database Error",
                message: existingErr.message,
            });
        }

        if (existing) {
            return res.status(409).json({
                success: false,
                error: "Conflict",
                message: `A draw already exists for ${draw_month}.`,
            });
        }

        // Server-side Supabase client configured with SUPABASE_SERVICE_ROLE_KEY bypasses RLS
        const { data, error } = await supabaseAdmin
            .from("draws")
            .insert({
                draw_month: draw_month.trim(),
                prize_pool_amount: prizePoolNum,
                jackpot_amount: jackpotNum,
                algorithm: resolvedAlgorithm,
                status: "DRAFT",
            })
            .select()
            .single();

        if (error) {
            return res.status(500).json({
                success: false,
                error: "Database Error",
                message: error.message,
            });
        }

        return res.status(201).json({
            success: true,
            message: "Draw created successfully.",
            data,
            ...data,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            message: err.message || "An unexpected error occurred while creating the draw.",
        });
    }
};

// ─── ADMIN: POST /api/draws/:id/simulate ─────────────────────────────────────

export const simulateDraw = async (req, res) => {
    const { id } = req.params;

    // Fetch the draw
    const { data: draw, error: drawErr } = await supabaseAdmin
        .from("draws")
        .select("*")
        .eq("id", id)
        .single();

    if (drawErr || !draw) {
        return res.status(404).json({ success: false, message: "Draw not found." });
    }

    if (draw.status !== "DRAFT") {
        return res.status(409).json({
            success: false,
            message: `Draw cannot be simulated. Current status: ${draw.status}.`,
        });
    }

    // Fetch all entries for this draw
    const { data: entries, error: entriesErr } = await supabaseAdmin
        .from("draw_entries")
        .select("id, user_id, entry_numbers")
        .eq("draw_id", id);

    if (entriesErr) {
        return res.status(500).json({ success: false, message: entriesErr.message });
    }

    // Generate winning numbers
    const winningNumbers = generateWinningNumbers();

    // Categorise winners
    const winnerBuckets = categoriseWinners(entries || [], winningNumbers);

    // Build prize allocation rows
    const prizeAllocationRows = buildPrizeAllocations(id, draw.prize_pool_amount, winnerBuckets);

    // ── Persist draw_results ──────────────────────────────────────────────────
    const { data: drawResult, error: drErr } = await supabaseAdmin
        .from("draw_results")
        .insert({
            draw_id: id,
            winning_numbers: winningNumbers,
        })
        .select()
        .single();

    if (drErr) {
        return res.status(500).json({ success: false, message: drErr.message });
    }

    // ── Persist prize_allocations ─────────────────────────────────────────────
    const { error: paErr } = await supabaseAdmin
        .from("prize_allocations")
        .insert(prizeAllocationRows);

    if (paErr) {
        return res.status(500).json({ success: false, message: paErr.message });
    }

    // Build prize lookup: matchType → amount_per_winner
    const prizeByMatchType = {};
    for (const row of prizeAllocationRows) {
        prizeByMatchType[row.match_type] = row.amount_per_winner;
    }

    // ── Persist winners ───────────────────────────────────────────────────────
    const winnerRows = [];
    for (const [matchType, bucket] of Object.entries(winnerBuckets)) {
        for (const w of bucket) {
            winnerRows.push({
                user_id: w.user_id,
                draw_id: id,
                draw_entry_id: w.entry_id,
                match_type: matchType,
                prize_amount: prizeByMatchType[matchType] ?? 0,
                verification_status: "PENDING",
                payout_status: "PENDING",
            });
        }
    }

    if (winnerRows.length > 0) {
        const { error: wErr } = await supabaseAdmin.from("winners").insert(winnerRows);
        if (wErr) {
            return res.status(500).json({ success: false, message: wErr.message });
        }
    }

    // ── Build simulation summary ──────────────────────────────────────────────
    const simulationResult = {
        winning_numbers: winningNumbers,
        total_entries: (entries || []).length,
        winner_counts: {
            FIVE_MATCH: winnerBuckets.FIVE_MATCH.length,
            FOUR_MATCH: winnerBuckets.FOUR_MATCH.length,
            THREE_MATCH: winnerBuckets.THREE_MATCH.length,
        },
        prize_allocations: prizeAllocationRows,
    };

    // ── Update draw status ────────────────────────────────────────────────────
    const { data: updatedDraw, error: updateErr } = await supabaseAdmin
        .from("draws")
        .update({ status: "SIMULATED", simulation_result: simulationResult })
        .eq("id", id)
        .select()
        .single();

    if (updateErr) {
        return res.status(500).json({ success: false, message: updateErr.message });
    }

    return res.status(200).json({
        success: true,
        message: "Draw simulated successfully.",
        data: {
            draw: updatedDraw,
            draw_result: drawResult,
            simulation_summary: simulationResult,
        },
    });
};

// ─── ADMIN: POST /api/draws/:id/publish ──────────────────────────────────────

export const publishDraw = async (req, res) => {
    const { id } = req.params;

    const { data: draw, error: drawErr } = await supabaseAdmin
        .from("draws")
        .select("id, status, simulation_result")
        .eq("id", id)
        .single();

    if (drawErr || !draw) {
        return res.status(404).json({ success: false, message: "Draw not found." });
    }

    if (draw.status !== "SIMULATED") {
        return res.status(409).json({
            success: false,
            message: `Only a SIMULATED draw can be published. Current status: ${draw.status}.`,
        });
    }

    // Sanity check: must have a draw_result record
    const { data: drawResult, error: drCheckErr } = await supabaseAdmin
        .from("draw_results")
        .select("id")
        .eq("draw_id", id)
        .maybeSingle();

    if (drCheckErr || !drawResult) {
        return res.status(422).json({
            success: false,
            message: "Draw has no simulation result. Please simulate before publishing.",
        });
    }

    const { data, error } = await supabaseAdmin
        .from("draws")
        .update({ status: "PUBLISHED", published_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
        success: true,
        message: "Draw published successfully.",
        data,
    });
};

// ─── USER: GET /api/draws ─────────────────────────────────────────────────────

export const getDraws = async (req, res) => {
    const { data, error } = await supabaseAdmin
        .from("draws")
        .select("*")
        .in("status", ["PUBLISHED", "COMPLETED"])
        .order("draw_month", { ascending: false });

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
        success: true,
        message: "Draws retrieved successfully.",
        data: { draws: data, total: data.length },
    });
};

// ─── USER: GET /api/draws/:id ─────────────────────────────────────────────────

export const getDrawById = async (req, res) => {
    const { id } = req.params;

    // Fetch the draw
    const { data: draw, error: drawErr } = await supabaseAdmin
        .from("draws")
        .select("*")
        .eq("id", id)
        .in("status", ["PUBLISHED", "COMPLETED"])
        .single();

    if (drawErr || !draw) {
        return res.status(404).json({
            success: false,
            message: "Draw not found or not yet published.",
        });
    }

    // Fetch draw result (winning numbers)
    const { data: drawResult } = await supabaseAdmin
        .from("draw_results")
        .select("*")
        .eq("draw_id", id)
        .maybeSingle();

    // Fetch prize allocations
    const { data: prizeAllocations } = await supabaseAdmin
        .from("prize_allocations")
        .select("*")
        .eq("draw_id", id)
        .order("match_type", { ascending: true });

    return res.status(200).json({
        success: true,
        message: "Draw retrieved successfully.",
        data: {
            draw,
            draw_result: drawResult ?? null,
            prize_allocations: prizeAllocations ?? [],
        },
    });
};

// ─── USER: GET /api/draws/:id/entries ────────────────────────────────────────

export const getMyEntries = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    // Verify the draw exists
    const { data: draw, error: drawErr } = await supabaseAdmin
        .from("draws")
        .select("id, status")
        .eq("id", id)
        .single();

    if (drawErr || !draw) {
        return res.status(404).json({ success: false, message: "Draw not found." });
    }

    const { data: entries, error } = await supabaseAdmin
        .from("draw_entries")
        .select("*")
        .eq("draw_id", id)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
        success: true,
        message: "Your entries retrieved successfully.",
        data: { entries, total: entries.length },
    });
};

// ─── USER: POST /api/draws/:id/enter ─────────────────────────────────────────

export const enterDraw = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { entry_numbers } = req.body;

    // Validate entry numbers
    const validErr = validateEntryNumbers(entry_numbers);
    if (validErr) {
        return res.status(400).json({ success: false, message: validErr });
    }

    // Verify draw exists and is in DRAFT status (entries allowed before simulation)
    const { data: draw, error: drawErr } = await supabaseAdmin
        .from("draws")
        .select("id, status")
        .eq("id", id)
        .single();

    if (drawErr || !draw) {
        return res.status(404).json({ success: false, message: "Draw not found." });
    }

    if (draw.status !== "DRAFT") {
        return res.status(409).json({
            success: false,
            message: "Entries are only accepted for draws in DRAFT status.",
        });
    }

    const { data, error } = await supabaseAdmin
        .from("draw_entries")
        .insert({
            draw_id: id,
            user_id: userId,
            entry_numbers: entry_numbers,
        })
        .select()
        .single();

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(201).json({
        success: true,
        message: "Entry submitted successfully.",
        data,
    });
};
