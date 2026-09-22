import stripe from "../config/stripe.js";
import { supabaseAdmin } from "../config/supabase.js";

// ─── Plan → Stripe Price ID mapping ──────────────────────────────────────────
// Set STRIPE_MONTHLY_PRICE_ID and STRIPE_YEARLY_PRICE_ID in .env.
// These are the recurring Price IDs from your Stripe Dashboard.

const PLAN_PRICE_MAP = {
    MONTHLY: process.env.STRIPE_MONTHLY_PRICE_ID,
    YEARLY: process.env.STRIPE_YEARLY_PRICE_ID,
};

// ─── Stripe status → Supabase status ─────────────────────────────────────────
const STRIPE_TO_DB_STATUS = {
    active: "ACTIVE",
    past_due: "PAST_DUE",
    canceled: "CANCELLED",
    cancelled: "CANCELLED",
    unpaid: "PAST_DUE",
    incomplete: "INACTIVE",
    incomplete_expired: "EXPIRED",
    trialing: "ACTIVE",
};

// ─── POST /api/subscription/checkout ─────────────────────────────────────────

export const createCheckoutSession = async (req, res) => {
    if (!stripe) {
        return res.status(503).json({ success: false, message: "Stripe is not configured on this server." });
    }

    const userId = req.user.id;
    const { plan } = req.body;

    const validPlans = ["MONTHLY", "YEARLY"];
    if (!plan || !validPlans.includes(plan)) {
        return res.status(400).json({
            success: false,
            message: `plan is required and must be one of: ${validPlans.join(", ")}.`,
        });
    }

    const priceId = PLAN_PRICE_MAP[plan];
    if (!priceId) {
        return res.status(500).json({
            success: false,
            message: `Stripe price not configured for plan: ${plan}. Set STRIPE_${plan}_PRICE_ID in .env.`,
        });
    }

    // Block if user already has an active Stripe-backed subscription
    const { data: existingSub } = await supabaseAdmin
        .from("subscriptions")
        .select("id, status, stripe_subscription_id")
        .eq("user_id", userId)
        .eq("status", "ACTIVE")
        .maybeSingle();

    if (existingSub && existingSub.stripe_subscription_id) {
        return res.status(409).json({
            success: false,
            message: "You already have an active subscription. Cancel it before subscribing to a new plan.",
        });
    }

    // Fetch user email for Stripe customer creation
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);
    const email = authUser?.user?.email ?? undefined;

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: email,
        client_reference_id: userId,          // used in webhook to identify user
        metadata: { user_id: userId, plan },
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        subscription_data: {
            metadata: { user_id: userId, plan },
        },
        success_url: `${frontendUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/subscription/cancel`,
    });

    return res.status(200).json({
        success: true,
        message: "Checkout session created.",
        data: { checkout_url: session.url },
    });
};

// ─── POST /api/webhooks/stripe ────────────────────────────────────────────────

export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    if (!sig) {
        return res.status(400).json({ success: false, message: "Missing Stripe signature." });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,                              // raw Buffer (express.raw middleware)
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`[Webhook] Signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`[Webhook] Received event: ${event.type}`);

    try {
        switch (event.type) {

            case "checkout.session.completed": {
                await handleCheckoutCompleted(event.data.object);
                break;
            }

            case "invoice.paid": {
                await handleInvoicePaid(event.data.object);
                break;
            }

            case "invoice.payment_failed": {
                await handleInvoicePaymentFailed(event.data.object);
                break;
            }

            case "customer.subscription.updated": {
                await handleSubscriptionUpdated(event.data.object);
                break;
            }

            case "customer.subscription.deleted": {
                await handleSubscriptionDeleted(event.data.object);
                break;
            }

            default:
                console.log(`[Webhook] Unhandled event type: ${event.type}`);
        }
    } catch (err) {
        console.error(`[Webhook] Handler error for ${event.type}:`, err.message);
        return res.status(500).json({ success: false, message: "Webhook handler error." });
    }

    // Always acknowledge receipt to Stripe
    return res.status(200).json({ received: true });
};

// ─── Webhook Handlers ─────────────────────────────────────────────────────────

/**
 * checkout.session.completed
 * Creates / activates the Supabase subscription and links the stripe_subscription_id.
 */
async function handleCheckoutCompleted(session) {
    if (session.mode !== "subscription") return;

    const userId = session.client_reference_id;
    const stripeSubId = session.subscription;
    const plan = session.metadata?.plan ?? "MONTHLY";

    if (!userId || !stripeSubId) {
        console.warn("[Webhook] checkout.session.completed missing userId or stripeSubId");
        return;
    }

    // Fetch Stripe subscription for billing dates
    const stripeSub = await stripe.subscriptions.retrieve(stripeSubId);
    const now = new Date().toISOString();

    // Upsert Supabase subscription keyed on user_id
    const { data: existing } = await supabaseAdmin
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    const subPayload = {
        user_id: userId,
        stripe_subscription_id: stripeSubId,
        plan,
        status: "ACTIVE",
        start_date: new Date(stripeSub.current_period_start * 1000).toISOString(),
        renewal_date: new Date(stripeSub.current_period_end * 1000).toISOString(),
        updated_at: now,
    };

    if (existing) {
        await supabaseAdmin.from("subscriptions").update(subPayload).eq("id", existing.id);
    } else {
        await supabaseAdmin.from("subscriptions").insert({ ...subPayload, created_at: now });
    }

    console.log(`[Webhook] checkout.session.completed: user=${userId} plan=${plan}`);
}

/**
 * invoice.paid
 * Updates subscription to ACTIVE and records a SUCCESS payment.
 */
async function handleInvoicePaid(invoice) {
    const stripeSubId = invoice.subscription;
    if (!stripeSubId) return;

    const now = new Date().toISOString();

    // Find matching Supabase subscription
    const { data: sub } = await supabaseAdmin
        .from("subscriptions")
        .select("id, user_id")
        .eq("stripe_subscription_id", stripeSubId)
        .maybeSingle();

    if (!sub) {
        console.warn(`[Webhook] invoice.paid: no subscription found for stripeSubId=${stripeSubId}`);
        return;
    }

    // Activate subscription
    await supabaseAdmin
        .from("subscriptions")
        .update({ status: "ACTIVE", updated_at: now })
        .eq("id", sub.id);

    // Record payment
    await supabaseAdmin.from("payments").insert({
        user_id: sub.user_id,
        subscription_id: sub.id,
        stripe_payment_id: invoice.payment_intent ?? null,
        amount: invoice.amount_paid / 100,        // Stripe amounts are in smallest currency unit
        currency: (invoice.currency ?? "inr").toUpperCase(),
        status: "SUCCESS",
        paid_at: now,
    });

    console.log(`[Webhook] invoice.paid: sub=${sub.id}`);
}

/**
 * invoice.payment_failed
 * Marks subscription PAST_DUE and records a FAILED payment.
 */
async function handleInvoicePaymentFailed(invoice) {
    const stripeSubId = invoice.subscription;
    if (!stripeSubId) return;

    const now = new Date().toISOString();

    const { data: sub } = await supabaseAdmin
        .from("subscriptions")
        .select("id, user_id")
        .eq("stripe_subscription_id", stripeSubId)
        .maybeSingle();

    if (!sub) return;

    await supabaseAdmin
        .from("subscriptions")
        .update({ status: "PAST_DUE", updated_at: now })
        .eq("id", sub.id);

    await supabaseAdmin.from("payments").insert({
        user_id: sub.user_id,
        subscription_id: sub.id,
        stripe_payment_id: invoice.payment_intent ?? null,
        amount: invoice.amount_due / 100,
        currency: (invoice.currency ?? "inr").toUpperCase(),
        status: "FAILED",
    });

    console.log(`[Webhook] invoice.payment_failed: sub=${sub.id}`);
}

/**
 * customer.subscription.updated
 * Syncs subscription status and renewal date from Stripe.
 */
async function handleSubscriptionUpdated(stripeSub) {
    const stripeSubId = stripeSub.id;
    const now = new Date().toISOString();
    const dbStatus = STRIPE_TO_DB_STATUS[stripeSub.status] ?? "INACTIVE";

    const { data: sub } = await supabaseAdmin
        .from("subscriptions")
        .select("id")
        .eq("stripe_subscription_id", stripeSubId)
        .maybeSingle();

    if (!sub) return;

    await supabaseAdmin
        .from("subscriptions")
        .update({
            status: dbStatus,
            renewal_date: new Date(stripeSub.current_period_end * 1000).toISOString(),
            updated_at: now,
        })
        .eq("id", sub.id);

    console.log(`[Webhook] customer.subscription.updated: sub=${sub.id} status=${dbStatus}`);
}

/**
 * customer.subscription.deleted
 * Cancels the Supabase subscription record.
 */
async function handleSubscriptionDeleted(stripeSub) {
    const stripeSubId = stripeSub.id;
    const now = new Date().toISOString();

    const { data: sub } = await supabaseAdmin
        .from("subscriptions")
        .select("id")
        .eq("stripe_subscription_id", stripeSubId)
        .maybeSingle();

    if (!sub) return;

    await supabaseAdmin
        .from("subscriptions")
        .update({
            status: "CANCELLED",
            cancelled_at: now,
            end_date: now,
            updated_at: now,
        })
        .eq("id", sub.id);

    console.log(`[Webhook] customer.subscription.deleted: sub=${sub.id}`);
}
