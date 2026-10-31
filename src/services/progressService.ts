import { supabase, getOrCreateGuestSession } from "@/lib/supabase";
import type { ModuleId, LearningMode } from "@/types/learning";

/**
 * Database check constraint modes for Supabase:
 * - "guided"
 * - "independent"
 */
export type DbLearningMode = "guided" | "independent";

export interface DbModuleProgress {
  user_id: string;
  module_id: ModuleId;
  last_step: number | null;
  last_mode: DbLearningMode | null;
  guided_completed: boolean;
  independent_completed: boolean;
  updated_at: string;
}

export interface DbLessonAttempt {
  id?: string;
  user_id: string;
  module_id: ModuleId;
  mode: DbLearningMode;
  completed: boolean;
  mistakes_count: number;
  hints_used: number;
  created_at: string;
}

export interface SaveProgressParams {
  moduleId: ModuleId;
  lastStep?: number | string | null | undefined;
  mode?: LearningMode | DbLearningMode | null | undefined;
  lastMode?: LearningMode | DbLearningMode | null | undefined;
  completed?: boolean | undefined;
  guidedCompleted?: boolean | undefined;
  independentCompleted?: boolean | undefined;
}

export type SaveProgressInput = SaveProgressParams;

export interface SaveAttemptParams {
  moduleId: ModuleId;
  mode: LearningMode | DbLearningMode;
  completed: boolean;
  mistakesCount?: number | undefined;
  hintsUsed?: number | undefined;
  mistakes_count?: number | undefined;
  hints_used?: number | undefined;
}

export type SaveAttemptInput = SaveAttemptParams;

export interface ProgressServiceResult<T = DbModuleProgress> {
  success: boolean;
  data: T | null;
  error?: string;
}

/**
 * Maps frontend LearningMode ("guide" | "practice") to DB check constraint ("guided" | "independent")
 */
export function modeToDb(mode: LearningMode | DbLearningMode | null | undefined): DbLearningMode {
  if (mode === "guide" || mode === "guided") return "guided";
  return "independent";
}

export const toDbMode = modeToDb;

/**
 * Maps DB mode ("guided" | "independent") to frontend LearningMode ("guide" | "practice")
 */
export function dbToMode(dbMode: DbLearningMode | string | null | undefined): LearningMode {
  if (dbMode === "guided" || dbMode === "guide") return "guide";
  return "practice";
}

export const toAppMode = dbToMode;

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
    const effectiveMode = params.lastMode ?? params.mode;
    const isGuideMode = effectiveMode === "guide" || effectiveMode === "guided";
    const isPracticeMode = effectiveMode === "practice" || effectiveMode === "independent";

    const guidedCompleted =
      Boolean(params.guidedCompleted) ||
      (existing?.guided_completed ?? false) ||
      (isGuideMode && Boolean(params.completed));

    const independentCompleted =
      Boolean(params.independentCompleted) ||
      (existing?.independent_completed ?? false) ||
      (isPracticeMode && Boolean(params.completed));

    const rawLastStep = params.lastStep ?? existing?.last_step ?? 0;
    const parsedLastStep = typeof rawLastStep === "number" ? rawLastStep : parseInt(String(rawLastStep), 10) || 0;

    const { data, error } = await supabase
      .from("module_progress")
      .upsert({
        user_id: userId,
        module_id: params.moduleId,
        last_step: parsedLastStep,
        last_mode: modeToDb(effectiveMode),
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

    const mistakes = params.mistakesCount ?? params.mistakes_count ?? 0;
    const hints = params.hintsUsed ?? params.hints_used ?? 0;

    const { data, error } = await supabase
      .from("lesson_attempts")
      .insert({
        user_id: userId,
        module_id: params.moduleId,
        mode: modeToDb(params.mode),
        completed: params.completed,
        mistakes_count: mistakes,
        hints_used: hints,
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

export const getModuleAttempts = getAttemptHistory;
