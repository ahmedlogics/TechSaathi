import { supabase, getOrCreateGuestUser } from "@/lib/supabase";
import type { LearningMode, ModuleId } from "@/types/learning";

/**
 * Database schema representation for module_progress table:
 * - user_id: UUID
 * - module_id: "send-money" | "book-ride" | "proof-of-life" | "video-call"
 * - last_step: integer (step index)
 * - last_mode: "guided" | "independent" (enforced by DB check constraint)
 * - guided_completed: boolean
 * - independent_completed: boolean
 * - updated_at: timestamp with time zone
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

export interface SaveProgressInput {
  moduleId: ModuleId;
  lastStep?: number | null | undefined;
  lastMode?: LearningMode | DbLearningMode | null | undefined;
  guidedCompleted?: boolean | undefined;
  independentCompleted?: boolean | undefined;
}

/**
 * Database schema representation for lesson_attempts table:
 * - id: UUID / primary key
 * - user_id: UUID
 * - module_id: string
 * - mode: "guided" | "independent" (enforced by DB check constraint)
 * - completed: boolean
 * - mistakes_count: integer
 * - hints_used: integer
 * - created_at: timestamp with time zone
 */
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

export interface SaveAttemptInput {
  moduleId: ModuleId;
  mode: LearningMode | DbLearningMode;
  completed: boolean;
  mistakesCount: number;
  hintsUsed: number;
}

/**
 * Maps frontend LearningMode ("guide" | "practice") to DB constraint values ("guided" | "independent").
 */
export function toDbMode(mode: LearningMode | DbLearningMode | null | undefined): DbLearningMode {
  if (mode === "guide" || mode === "guided") return "guided";
  return "independent";
}

/**
 * Maps DB mode ("guided" | "independent") back to frontend LearningMode ("guide" | "practice").
 */
export function toAppMode(mode: DbLearningMode | string | null | undefined): LearningMode {
  if (mode === "guided" || mode === "guide") return "guide";
  return "practice";
}

/**
 * Retrieve progress for a specific module for the current authenticated guest user.
 * Returns null if Supabase is unreachable, user is not authenticated, or no record exists.
 */
export async function getModuleProgress(moduleId: ModuleId): Promise<DbModuleProgress | null> {
  if (!supabase) return null;
  try {
    const userId = await getOrCreateGuestUser();
    if (!userId) return null;

    const { data, error } = await supabase
      .from("module_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("module_id", moduleId)
      .maybeSingle();

    if (error) {
      console.error(`TechSaathi: Failed to fetch module progress for ${moduleId}:`, error.message);
      return null;
    }
    return (data as DbModuleProgress) ?? null;
  } catch (err) {
    console.error(`TechSaathi: Unexpected error in getModuleProgress for ${moduleId}:`, err);
    return null;
  }
}

/**
 * Save progress for a module while strictly preserving previous completions.
 * Preserves guided_completed and independent_completed flags.
 * Never fabricates successful writes when database calls fail.
 */
export async function saveProgress(input: SaveProgressInput): Promise<DbModuleProgress | null> {
  if (!supabase) return null;
  try {
    const userId = await getOrCreateGuestUser();
    if (!userId) {
      console.warn("TechSaathi: No authenticated learner session. Cloud progress not saved.");
      return null;
    }

    // Preserve previously completed flags
    const existing = await getModuleProgress(input.moduleId);
    const guidedCompleted =
      Boolean(input.guidedCompleted) || Boolean(existing?.guided_completed);
    const independentCompleted =
      Boolean(input.independentCompleted) || Boolean(existing?.independent_completed);

    const payload = {
      user_id: userId,
      module_id: input.moduleId,
      last_step: input.lastStep ?? existing?.last_step ?? null,
      last_mode: input.lastMode ? toDbMode(input.lastMode) : existing?.last_mode ?? null,
      guided_completed: guidedCompleted,
      independent_completed: independentCompleted,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("module_progress")
      .upsert(payload, { onConflict: "user_id,module_id" })
      .select()
      .maybeSingle();

    if (error) {
      console.error(`TechSaathi: Error saving module progress for ${input.moduleId}:`, error.message);
      return null;
    }

    return (data as DbModuleProgress) ?? payload;
  } catch (err) {
    console.error("TechSaathi: Unexpected error in saveProgress:", err);
    return null;
  }
}

/**
 * Record a lesson attempt into lesson_attempts table.
 * Avoids storing any sensitive personal or banking info.
 */
export async function saveAttempt(input: SaveAttemptInput): Promise<DbLessonAttempt | null> {
  if (!supabase) return null;
  try {
    const userId = await getOrCreateGuestUser();
    if (!userId) {
      console.warn("TechSaathi: No authenticated learner session. Cloud attempt not saved.");
      return null;
    }

    const payload = {
      user_id: userId,
      module_id: input.moduleId,
      mode: toDbMode(input.mode),
      completed: input.completed,
      mistakes_count: input.mistakesCount,
      hints_used: input.hintsUsed,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("lesson_attempts")
      .insert(payload)
      .select()
      .maybeSingle();

    if (error) {
      console.error(`TechSaathi: Error saving attempt for ${input.moduleId}:`, error.message);
      return null;
    }

    return (data as DbLessonAttempt) ?? payload;
  } catch (err) {
    console.error("TechSaathi: Unexpected error in saveAttempt:", err);
    return null;
  }
}

/**
 * Retrieve attempt history for the current authenticated learner.
 */
export async function getAttemptHistory(moduleId?: ModuleId): Promise<DbLessonAttempt[]> {
  if (!supabase) return [];
  try {
    const userId = await getOrCreateGuestUser();
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
      console.error("TechSaathi: Error retrieving attempt history:", error.message);
      return [];
    }

    return (data as DbLessonAttempt[]) || [];
  } catch (err) {
    console.error("TechSaathi: Unexpected error in getAttemptHistory:", err);
    return [];
  }
}
