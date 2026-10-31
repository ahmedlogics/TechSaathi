import { useCallback, useReducer } from "react";
import { ui } from "@/data/translations";
import type { ExpectedAction, LearningModule, LessonStep, LocalText } from "@/types/learning";

export interface EngineState {
  stepIndex: number;
  mistakes: number;
  hints: number;
  hintVisible: boolean;
  feedback: LocalText | null;
}

export type EngineEvent =
  | { type: "ACT"; action: ExpectedAction }
  | { type: "MISTAKE"; message: LocalText }
  | { type: "HINT" }
  | { type: "GOTO"; stepId: string }
  | { type: "BACK" }
  | { type: "RESET" };

export const initialEngineState: EngineState = { stepIndex: 0, mistakes: 0, hints: 0, hintVisible: false, feedback: null };

export function lessonReducer(steps: LessonStep[]) {
  return (state: EngineState, ev: EngineEvent): EngineState => {
    const step = steps[state.stepIndex];
    const isLast = state.stepIndex >= steps.length - 1;
    switch (ev.type) {
      case "ACT": {
        if (isLast) return state;
        if (step.expected === ev.action) {
          return { ...state, stepIndex: state.stepIndex + 1, hintVisible: false, feedback: null };
        }
        return { ...state, mistakes: state.mistakes + 1, feedback: step.wrong?.[ev.action] ?? ui.wrongGeneric };
      }
      case "MISTAKE":
        if (isLast) return state;
        return { ...state, mistakes: state.mistakes + 1, feedback: ev.message };
      case "HINT":
        if (isLast || state.hintVisible) return state;
        return { ...state, hints: state.hints + 1, hintVisible: true };
      case "GOTO": {
        const idx = steps.findIndex((s) => s.id === ev.stepId);
        if (idx < 0 || isLast) return state;
        return { ...state, stepIndex: idx, hintVisible: false, feedback: null };
      }
      case "BACK":
        if (state.stepIndex === 0 || isLast) return state;
        return { ...state, stepIndex: state.stepIndex - 1, hintVisible: false, feedback: null };
      case "RESET":
        return initialEngineState;
    }
  };
}

export function useLessonEngine(module: LearningModule) {
  const [state, dispatch] = useReducer(lessonReducer(module.steps), initialEngineState);
  const step = module.steps[state.stepIndex]!;
  const totalSteps = module.steps.length - 1;
  const completed = state.stepIndex >= totalSteps;

  return {
    state,
    step,
    totalSteps,
    completed,
    act: useCallback((action: ExpectedAction) => dispatch({ type: "ACT", action }), []),
    mistake: useCallback((message: LocalText) => dispatch({ type: "MISTAKE", message }), []),
    showHint: useCallback(() => dispatch({ type: "HINT" }), []),
    goTo: useCallback((stepId: string) => dispatch({ type: "GOTO", stepId }), []),
    back: useCallback(() => dispatch({ type: "BACK" }), []),
    reset: useCallback(() => dispatch({ type: "RESET" }), []),
  };
}

export type LessonEngine = ReturnType<typeof useLessonEngine>;
