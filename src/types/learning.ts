export type Lang = "en" | "ur";
/** A piece of text with English required and Urdu optional (falls back to English). */
export type LocalText = { en: string; ur?: string };
export type TranslationDictionary = Record<string, LocalText>;

export type LearningMode = "guide" | "practice";
export type ModuleId = "send-money" | "book-ride" | "proof-of-life" | "video-call";
/** Identifier of a learner action inside a simulator, e.g. "send-money". */
export type ExpectedAction = string;

export interface LessonStep {
  id: string;
  /** Which simulator screen this step shows. */
  screen: string;
  /** Action that completes this step. null = final completion step. */
  expected: ExpectedAction | null;
  title: LocalText;
  body: LocalText;
  tip?: LocalText;
  hint: LocalText;
  /** Feedback for specific wrong actions on this step. */
  wrong?: Record<ExpectedAction, LocalText>;
  /** Real-world financial literacy context */
  whyItMatters?: LocalText;
  /** Checklist items to verify */
  checklist?: LocalText[];
  /** Concrete real-world mistake to avoid */
  commonMistake?: LocalText;
}

export interface LearningModule {
  id: ModuleId;
  title: LocalText;
  description: LocalText;
  cardAction: LocalText;
  introTitle: LocalText;
  intro: LocalText;
  learnPoints: LocalText[];
  objective: LocalText;
  safetyNote: LocalText;
  steps: LessonStep[];
}

export interface AttemptResult {
  moduleId: ModuleId;
  mode: LearningMode;
  completedSteps: number;
  totalSteps: number;
  mistakes: number;
  hints: number;
  completed: boolean;
  finishedAt: string;
}

export type ProgressRecord = AttemptResult;
