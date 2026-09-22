import { supabaseAdmin } from "../config/supabase.js";

// ─── Constants ────────────────────────────────────────────────────────────────

const VALID_PLANS = ["MONTHLY", "YEARLY"];

// Plan pricing (INR) - ready to be replaced / enriched for Stripe later
const PLAN_CONFIG = {
    MONTHLY: { amount: 499, currency: "INR" },
    YEARLY: { amount: 4999, currency: "INR" },
};

// ─── GET /api/subscription ────────────────────────────────────────────────────

export const getSubscription = async (req, res) => {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    if (!data) {
        return res.status(404).json({
            success: false,
            message: "No subscription found for this user.",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Subscription retrieved successfully.",
        data,
    });
};

// ─── POST /api/subscription ───────────────────────────────────────────────────

export const createSubscription = async (req, res) => {
    const userId = req.user.id;
    const { plan } = req.body;

    // Validate plan
    if (!plan || !VALID_PLANS.includes(plan)) {
        return res.status(400).json({
            success: false,
            message: `plan is required and must be one of: ${VALID_PLANS.join(", ")}.`,
        });
    }

    // Check if an active subscription already exists
    const { data: existing, error: fetchErr } = await supabaseAdmin
        .from("subscriptions")
        .select("id, status, plan")
        .eq("user_id", userId)
        .eq("status", "ACTIVE")
        .maybeSingle();

    if (fetchErr) {
        return res.status(500).json({ success: false, message: fetchErr.message });
    }

    if (existing) {
        return res.status(409).json({
            success: false,
            message: `You already have an active ${existing.plan} subscription. Cancel it before subscribing to a new plan.`,
        });
    }

    const { amount, currency } = PLAN_CONFIG[plan];
    const now = new Date().toISOString();

    // Calculate end / renewal dates (MVP: no real billing cycle yet)
    const renewalDate = new Date();
    if (plan === "MONTHLY") {
        renewalDate.setMonth(renewalDate.getMonth() + 1);
    } else {
        renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    }

    const { data, error } = await supabaseAdmin
        .from("subscriptions")
        .insert({
            user_id: userId,
            plan,
            status: "ACTIVE",
            amount,
            currency,
            start_date: now,
            renewal_date: renewalDate.toISOString(),
            // stripe_subscription_id: null  — populated later when Stripe is wired
        })
        .select()
        .single();

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(201).json({
        success: true,
        message: "Subscription created successfully.",
        data,
    });
};

// ─── PATCH /api/subscription/cancel ──────────────────────────────────────────

export const cancelSubscription = async (req, res) => {
    const userId = req.user.id;

    // Fetch the user's current active subscription
    const { data: existing, error: fetchErr } = await supabaseAdmin
        .from("subscriptions")
        .select("id, user_id, status")
        .eq("user_id", userId)
        .eq("status", "ACTIVE")
        .maybeSingle();

    if (fetchErr) {
        return res.status(500).json({ success: false, message: fetchErr.message });
    }

    if (!existing) {
        return res.status(404).json({
            success: false,
            message: "No active subscription found to cancel.",
        });
    }

    // Extra ownership guard (belt-and-suspenders on top of RLS)
    if (existing.user_id !== userId) {
        return res.status(403).json({
            success: false,
            message: "You are not allowed to cancel this subscription.",
        });
    }

    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
        .from("subscriptions")
        .update({
            status: "CANCELLED",
            cancelled_at: now,
            end_date: now,
            updated_at: now,
        })
        .eq("id", existing.id)
        .select()
        .single();

    if (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
        success: true,
        message: "Subscription cancelled successfully.",
        data,
    });
};
