import { supabase, getOrCreateGuestSession } from "@/lib/supabase";
import type { ModuleId, LearningMode } from "@/types/learning";
import type { DbModuleProgress, DbLessonAttempt, DbLearningMode } from "@/types/database";

export interface SaveProgressParams {
  moduleId: ModuleId;
  lastStep: number;
  mode: LearningMode;
  completed?: boolean;
}

export interface SaveAttemptParams {
  moduleId: ModuleId;
  mode: LearningMode;
  completed: boolean;
  mistakesCount: number;
  hintsUsed: number;
}

export interface ProgressServiceResult<T> {
  success: boolean;
  data: T | null;
  error?: string;
}

/**
 * Maps frontend LearningMode ("guide" | "practice") to DB check constraint ("guided" | "independent")
 */
export function modeToDb(mode: LearningMode): DbLearningMode {
  return mode === "guide" ? "guided" : "independent";
}

/**
 * Maps DB mode ("guided" | "independent") to frontend LearningMode ("guide" | "practice")
 */
export function dbToMode(dbMode: DbLearningMode): LearningMode {
  return dbMode === "guided" ? "guide" : "practice";
}

/**
 * Reads the latest progress for a given module under the current learner.
 */
export async function getModuleProgress(moduleId: ModuleId): Promise<DbModuleProgress | null> {
  try {
    const userId = await getOrCreateGuestSession();
    if (!userId) return null;

    const { data, error } = await supabase
      .from("module_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("module_id", moduleId)
      .maybeSingle();

    if (error) {
      console.warn("[TechSaathi] Failed to fetch module progress:", error.message);
      return null;
    }

    return (data as DbModuleProgress) ?? null;
  } catch (err) {
    console.error("[TechSaathi] Unexpected error reading module progress:", err);
    return null;
  }
}

/**
 * Saves or updates module progress in Supabase.
 * Preserves previously completed guided/independent flags so progress is never lost.
 */
export async function saveProgress(params: SaveProgressParams): Promise<ProgressServiceResult<DbModuleProgress>> {
  try {
    const userId = await getOrCreateGuestSession();
    if (!userId) {
      return { success: false, data: null, error: "No guest session available" };
    }

    // Preserve previously completed flags
    const existing = await getModuleProgress(params.moduleId);
    const guidedCompleted =
      (existing?.guided_completed ?? false) || (params.mode === "guide" && Boolean(params.completed));
    const independentCompleted =
      (existing?.independent_completed ?? false) || (params.mode === "practice" && Boolean(params.completed));

    const { data, error } = await supabase
      .from("module_progress")
      .upsert({
        user_id: userId,
        module_id: params.moduleId,
        last_step: params.lastStep,
        last_mode: modeToDb(params.mode),
        guided_completed: guidedCompleted,
        independent_completed: independentCompleted,
        updated_at: new Date().toISOString(),
      })
      .select()
      .maybeSingle();

    if (error) {
      console.warn("[TechSaathi] Failed to save module progress to Supabase:", error.message);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: (data as DbModuleProgress) ?? null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[TechSaathi] Unexpected error saving module progress:", err);
    return { success: false, data: null, error: message };
  }
}

/**
 * Saves a completed or attempted lesson run into lesson_attempts.
 * Does not store real banking, biometric, or private user details.
 */
export async function saveAttempt(params: SaveAttemptParams): Promise<ProgressServiceResult<DbLessonAttempt>> {
  try {
    const userId = await getOrCreateGuestSession();
    if (!userId) {
      return { success: false, data: null, error: "No guest session available" };
    }

    const { data, error } = await supabase
      .from("lesson_attempts")
      .insert({
        user_id: userId,
        module_id: params.moduleId,
        mode: modeToDb(params.mode),
        completed: params.completed,
        mistakes_count: params.mistakesCount,
        hints_used: params.hintsUsed,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.warn("[TechSaathi] Failed to record lesson attempt in Supabase:", error.message);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: (data as DbLessonAttempt) ?? null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[TechSaathi] Unexpected error saving lesson attempt:", err);
    return { success: false, data: null, error: message };
  }
}

/**
 * Retrieves past attempt history for the learner, optionally filtered by module.
 */
export async function getAttemptHistory(moduleId?: ModuleId): Promise<DbLessonAttempt[]> {
  try {
    const userId = await getOrCreateGuestSession();
    if (!userId) return [];

    let query = supabase
      .from("lesson_attempts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (moduleId) {
      query = query.eq("module_id", moduleId);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("[TechSaathi] Failed to fetch attempt history:", error.message);
      return [];
    }

    return (data as DbLessonAttempt[]) ?? [];
  } catch (err) {
    console.error("[TechSaathi] Unexpected error reading attempt history:", err);
    return [];
  }
}
