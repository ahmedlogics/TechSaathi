export type PakIDScreenId =
  | "login"
  | "dashboard"
  | "applicant"
  | "fee"
  | "biometric-alert"
  | "face-prepare"
  | "face-capture"
  | "fingerprints"
  | "review-submission"
  | "submitted"
  | "id-vault"
  | "my-documents"
  | "document-view"
  | "completion";

export type PakIDApplicant = "myself" | "relatives";

export type FingerOption = "left-hand" | "right-hand" | "left-thumb" | "right-thumb";

export interface PakIDStepDefinition {
  id: string;
  stepNumber: number;
  screen: PakIDScreenId;
  title: { en: string; ur: string };
  instruction: { en: string; ur: string };
  hint: { en: string; ur: string };
  tip?: { en: string; ur: string };
  expectedAction: string;
}

export interface TutorialStep {
  id: string;
  stepNumber: number;
  totalSteps: number;
  title: { en: string; ur: string };
  instruction: { en: string; ur: string };
  imagePath: string;
  sourceType: "official screenshot" | "educational reconstruction";
  highlightLabel?: { en: string; ur: string };
  // Highlight box in percentage: { top, left, width, height }
  highlightArea?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  details: { en: string; ur: string };
  keyPoints: { en: string[]; ur: string[] };
}

export interface PhotoCaptureSample {
  id: string;
  isCorrect: boolean;
  label: { en: string; ur: string };
  explanation: { en: string; ur: string };
  statusText: { en: string; ur: string };
  iconType: "check" | "hat" | "mask" | "side";
}

