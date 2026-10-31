import type { ModuleId } from "./learning";

export type DbLearningMode = "guided" | "independent";

export interface DbModuleProgress {
  user_id: string;
  module_id: ModuleId;
  last_step: number;
  last_mode: DbLearningMode;
  guided_completed: boolean;
  independent_completed: boolean;
  updated_at?: string;
}

export interface DbLessonAttempt {
  id?: string;
  user_id: string;
  module_id: ModuleId;
  mode: DbLearningMode;
  completed: boolean;
  mistakes_count: number;
  hints_used: number;
  created_at?: string;
}
