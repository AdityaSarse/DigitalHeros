let Stripe = null;
try {
    const mod = await import("stripe");
    Stripe = mod.default || mod;
} catch {
    // Stripe package is not installed (Stripe integration is parked)
}

if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith("sk_test_...")) {
    console.warn("[Stripe] WARNING: STRIPE_SECRET_KEY is not configured. Stripe endpoints will not work until you set it in .env.");
}

const stripe = Stripe && process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith("sk_test_...")
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
    : null;

export default stripe;

