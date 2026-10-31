import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) || "";
const supabaseAnonKey = (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined) || "";

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== "undefined") {
    console.warn(
      "[TechSaathi] Missing Supabase environment variables (VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY)."
    );
  }
}

/**
 * Shared singleton Supabase client.
 * Uses publishable/anon key only. No service role or secret keys.
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
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
      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("[TechSaathi] Cannot authenticate guest: Supabase environment variables are missing.");
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
        console.error("[TechSaathi] Anonymous sign-in failed:", error.message);
        return null;
      }

      return data.user?.id ?? null;
    } catch (err) {
      console.error("[TechSaathi] Unexpected error in guest authentication:", err);
      return null;
    } finally {
      activeAuthPromise = null;
    }
  })();

  return activeAuthPromise;
}
