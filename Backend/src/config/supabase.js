import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in Backend/.env");
}

/**
 * Inspect the JWT role safely without external libraries
 */
export function getJwtRole(jwt) {
    try {
        if (!jwt || typeof jwt !== "string") return null;
        const parts = jwt.split(".");
        if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
            return payload.role || null;
        }
    } catch {
        return null;
    }
    return null;
}

const keyRole = getJwtRole(supabaseServiceRoleKey);

if (keyRole === "anon") {
    console.error(`
================================================================================
CRITICAL MISCONFIGURATION DETECTED:
SUPABASE_SERVICE_ROLE_KEY is set to the Supabase ANON key (role: "anon")!
This will trigger "new row violates row-level security policy for table draws"
whenever an admin attempts to insert a draw.
Please set SUPABASE_SERVICE_ROLE_KEY in your Render environment settings to the
actual service_role secret from Supabase Dashboard > Project Settings > API.
================================================================================
    `);
} else if (keyRole === "service_role") {
    console.log(`[Supabase Config] Initialized supabaseAdmin with verified service_role key (bypasses RLS)`);
} else {
    console.log(`[Supabase Config] Initialized supabaseAdmin. Key role: ${keyRole || "custom/opaque"}`);
}

export const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);
