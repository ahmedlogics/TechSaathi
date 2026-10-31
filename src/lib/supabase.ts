import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const supabasePublishableKey = (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
  import.meta.env["VITE_SUPABASE_ANON_KEY"]) as string | undefined;

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    "TechSaathi: Supabase environment variables missing (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY). Local practice will continue."
  );
}

/**
 * Shared singleton Supabase client instance.
 * Reuses existing environment variables without hardcoded secrets.
 */
export const supabase: SupabaseClient | null =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

// Lock to prevent simultaneous calls from creating duplicate anonymous sessions
let authInFlight: Promise<string | null> | null = null;

/**
 * Shared guest authentication helper.
 * 1. Checks for an existing Supabase session.
 * 2. Reuses the existing session when available.
 * 3. Creates an anonymous Supabase session otherwise.
 * 4. Returns the authenticated user ID (or null on failure).
 * 5. Handles failures gracefully without throwing.
 * 6. Deduplicates simultaneous calls.
 */
export async function getOrCreateGuestUser(): Promise<string | null> {
  if (!supabase) {
    return null;
  }

  if (authInFlight) {
    return authInFlight;
  }

  authInFlight = (async () => {
    try {
      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      if (!sessionErr && sessionData.session?.user?.id) {
        return sessionData.session.user.id;
      }

      const { data: anonData, error: anonErr } = await supabase.auth.signInAnonymously();
      if (anonErr) {
        console.error("TechSaathi: Anonymous sign-in failed:", anonErr.message);
        return null;
      }

      return anonData.user?.id ?? null;
    } catch (err) {
      console.error("TechSaathi: Unexpected error during guest authentication:", err);
      return null;
    } finally {
      authInFlight = null;
    }
  })();

  return authInFlight;
}
