import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Safe startup check: confirms the service-role environment variable exists, but NEVER logs its value
if (!SUPABASE_URL) {
    console.error("[Supabase Config Error] Missing SUPABASE_URL environment variable.");
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[Supabase Config Error] Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Draws creation will fail RLS!");
} else {
    console.log("[Supabase Config] SUPABASE_SERVICE_ROLE_KEY is present and configured.");
    try {
        const parts = SUPABASE_SERVICE_ROLE_KEY.split(".");
        if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
            if (payload.role !== "service_role") {
                console.warn(`[Supabase Config Warning] SUPABASE_SERVICE_ROLE_KEY has role "${payload.role}", NOT "service_role"! This will cause RLS violations.`);
            } else {
                console.log(`[Supabase Config] Verified SUPABASE_SERVICE_ROLE_KEY has role "service_role".`);
            }
        }
    } catch {
        // Safe check without logging secret
    }
}

// Server-side admin client using service_role key to bypass RLS
export const supabaseAdmin = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);
