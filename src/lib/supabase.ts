import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Read from Vite environment variables (supports .env and .env.local)
const supabaseUrl =
  (import.meta.env["VITE_SUPABASE_URL"] as string | undefined)?.trim() ||
  "https://buzfopmfnuluemxbsvxj.supabase.co";

const supabasePublishableKey =
  (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined)?.trim() ||
  (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined)?.trim() ||
  "";

/**
 * Returns true if both the Supabase URL and a valid Publishable/Anon key are present.
 */
export function isSupabaseConfigured(): boolean {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabasePublishableKey) &&
    !supabasePublishableKey.includes("placeholder")
  );
}

// Fallback placeholder key prevents module initialization crashes when the local key has not been populated
const safeKey =
  supabasePublishableKey ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1emZvcG1mbnVsdWVteGJzdnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAsImV4cCI6MjAwMH0.placeholder";

/**
 * Shared Supabase Client singleton.
 * Avoid creating multiple instances across components or modules.
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Mutex promise to prevent concurrent calls from issuing duplicate anonymous sign-ins
let guestAuthPromise: Promise<string | null> | null = null;

/**
 * Obtain an authenticated guest user identity via Supabase Anonymous Authentication.
 * 1. Checks for an existing active Supabase session.
 * 2. Reuses existing session when available.
 * 3. Creates an anonymous Supabase session otherwise.
 * 4. Returns the authenticated user ID string.
 * 5. Handles failures gracefully (returns null, logs warning, never crashes the app).
 * 6. Prevents multiple simultaneous calls from spawning redundant sessions.
 */
export async function getOrCreateGuestUser(): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (guestAuthPromise) {
    return guestAuthPromise;
  }

  guestAuthPromise = (async () => {
    try {
      // 1. Check existing session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.warn("[TechSaathi Supabase] Error fetching existing session:", sessionError.message);
      }
      if (sessionData?.session?.user?.id) {
        return sessionData.session.user.id;
      }

      // 2. Sign in anonymously for guest learners
      const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
      if (anonError) {
        console.warn("[TechSaathi Supabase] Anonymous sign-in failed:", anonError.message);
        return null;
      }

      return anonData.user?.id ?? null;
    } catch (err) {
      console.warn("[TechSaathi Supabase] Unexpected authentication error:", err);
      return null;
    } finally {
      guestAuthPromise = null;
    }
  })();

  return guestAuthPromise;
}
