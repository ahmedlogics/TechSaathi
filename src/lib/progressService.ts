import { supabase, getOrCreateGuestUser, isSupabaseConfigured } from "./supabase";
import type { LearningMode, ModuleId } from "@/types/learning";

export interface ModuleProgressRecord {
  user_id: string;
  module_id: ModuleId;
  last_step: string | number;
  last_mode: LearningMode;
  guided_completed: boolean;
  independent_completed: boolean;
  updated_at: string;
}

export interface LessonAttemptRecord {
  id?: string | number;
  user_id: string;
  module_id: ModuleId;
  mode: LearningMode;
  completed: boolean;
  mistakes_count: number;
  hints_used: number;
  created_at: string;
}

export interface SaveProgressParams {
  moduleId: ModuleId;
  lastStep: string | number;
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

export interface ServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Saves current learner progress to the shared `module_progress` table.
 * Preserves previously completed guided/independent progress flags.
 * Never stores real financial, identity, or calling details.
 */
export async function saveProgress(params: SaveProgressParams): Promise<ServiceResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase credentials are not configured" };
  }

  try {
    const userId = await getOrCreateGuestUser();
    if (!userId) {
      return { success: false, error: "Unable to obtain guest user session" };
    }

    // 1. Fetch existing flags to preserve previous completion statuses
    const { data: existing, error: fetchError } = await supabase
      .from("module_progress")
      .select("guided_completed, independent_completed")
      .eq("user_id", userId)
      .eq("module_id", params.moduleId)
      .maybeSingle();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.warn("[ProgressService] Could not check existing progress:", fetchError.message);
    }

    const guided_completed =
      Boolean(existing?.guided_completed) || (params.mode === "guide" && Boolean(params.completed));
    const independent_completed =
      Boolean(existing?.independent_completed) ||
      (params.mode === "practice" && Boolean(params.completed));

    // 2. Upsert progress record for the current user and module
    const { error: upsertError } = await supabase.from("module_progress").upsert(
      {
        user_id: userId,
        module_id: params.moduleId,
        last_step: String(params.lastStep),
        last_mode: params.mode,
        guided_completed,
        independent_completed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,module_id" }
    );

    if (upsertError) {
      console.warn("[ProgressService] Error saving module progress:", upsertError.message);
      return { success: false, error: upsertError.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected database error";
    console.warn("[ProgressService] Exception in saveProgress:", message);
    return { success: false, error: message };
  }
}

/**
 * Retrieves the current learner's progress for a specific module.
 */
export async function getModuleProgress(
  moduleId: ModuleId
): Promise<ServiceResult<ModuleProgressRecord | null>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase credentials are not configured" };
  }

  try {
    const userId = await getOrCreateGuestUser();
    if (!userId) {
      return { success: false, error: "Unable to obtain guest user session" };
    }

    const { data, error } = await supabase
      .from("module_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("module_id", moduleId)
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: (data as ModuleProgressRecord) ?? null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected database error";
    return { success: false, error: message };
  }
}

/**
 * Records a single lesson attempt in the shared `lesson_attempts` table.
 */
export async function saveAttempt(
  attempt: SaveAttemptParams
): Promise<ServiceResult<{ id?: string | number }>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase credentials are not configured" };
  }

  try {
    const userId = await getOrCreateGuestUser();
    if (!userId) {
      return { success: false, error: "Unable to obtain guest user session" };
    }

    const { data, error } = await supabase
      .from("lesson_attempts")
      .insert({
        user_id: userId,
        module_id: attempt.moduleId,
        mode: attempt.mode,
        completed: attempt.completed,
        mistakes_count: attempt.mistakesCount,
        hints_used: attempt.hintsUsed,
        created_at: new Date().toISOString(),
      })
      .select("id")
      .maybeSingle();

    if (error) {
      console.warn("[ProgressService] Error saving lesson attempt:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data: { id: data?.id } };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected database error";
    console.warn("[ProgressService] Exception in saveAttempt:", message);
    return { success: false, error: message };
  }
}

/**
 * Retrieves the history of attempts for the current learner, optionally filtered by module.
 */
export async function getAttemptHistory(
  moduleId?: ModuleId
): Promise<ServiceResult<LessonAttemptRecord[]>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase credentials are not configured", data: [] };
  }

  try {
    const userId = await getOrCreateGuestUser();
    if (!userId) {
      return { success: false, error: "Unable to obtain guest user session", data: [] };
    }

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
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: (data as LessonAttemptRecord[]) ?? [] };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected database error";
    return { success: false, error: message, data: [] };
  }
}
