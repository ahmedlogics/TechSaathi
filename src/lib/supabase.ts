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

let activeAuthPromise: Promise<string | null> | null = null;

/**
 * Reusable helper for anonymous learner authentication:
 * 1. Checks for an existing Supabase session.
 * 2. Reuses existing session when available.
 * 3. Creates an anonymous Supabase session otherwise.
 * 4. Returns the authenticated user ID (or null on failure).
 * 5. Handles errors gracefully without crashing the UI.
 * 6. Prevents concurrent calls from triggering duplicate sign-in requests.
 */
export async function getOrCreateGuestSession(): Promise<string | null> {
  // Only authenticate on the client side where browser storage persists
  if (typeof window === "undefined") {
    return null;
  }

  // Reuse in-flight sign-in promise to avoid race conditions and duplicate sessions
  if (activeAuthPromise) {
    return activeAuthPromise;
  }

  activeAuthPromise = (async () => {
    try {
      if (!isSupabaseConfigured()) {
        return null;
      }

      // 1. Check for existing session first
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.warn("[TechSaathi] Error reading existing Supabase session:", sessionError.message);
      }

      if (session?.user?.id) {
        return session.user.id;
      }

      // 2. Create anonymous session if none exists
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        console.warn("[TechSaathi] Anonymous sign-in failed:", error.message);
        return null;
      }

      return data.user?.id ?? null;
    } catch (err) {
      console.warn("[TechSaathi] Unexpected error in guest authentication:", err);
      return null;
    } finally {
      activeAuthPromise = null;
    }
  })();

  return activeAuthPromise;
}

/**
 * Backward-compatible alias for getOrCreateGuestSession used by other developers.
 */
export const getOrCreateGuestUser = getOrCreateGuestSession;
