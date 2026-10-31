import { createContext, useContext, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Pointer } from "lucide-react";
import type { LessonEngine } from "@/hooks/useLessonEngine";
import type { ExpectedAction, LearningMode, LearningModule } from "@/types/learning";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export interface LessonContextValue {
  module: LearningModule;
  mode: LearningMode;
  engine: LessonEngine;
  /** Should this action's control be highlighted right now? */
  isTarget: (action: ExpectedAction) => boolean;
  goSummary: () => void;
  retry: () => void;
  goHome: () => void;
}

const Ctx = createContext<LessonContextValue | null>(null);
export const LessonProvider = ({ value, children }: { value: LessonContextValue; children: ReactNode }) => (
  <Ctx.Provider value={value}>{children}</Ctx.Provider>
);
export function useLesson() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLesson must be used inside LessonProvider");
  return c;
}

type SimButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  action: ExpectedAction;
  /** Custom handler; defaults to reporting the action to the lesson engine. */
  onPress?: () => void;
  /** Which expected action highlights this control (defaults to `action`). */
  highlightFor?: ExpectedAction;
};

/** A control inside the simulated phone. Highlights itself when it is the current target. */
export function SimButton({ action, onPress, highlightFor, className, children, ...rest }: SimButtonProps) {
  const { engine, isTarget } = useLesson();
  const { t } = useLanguage();
  const target = isTarget(highlightFor ?? action);
  return (
    <span className="relative block">
      <button
        type="button"
        {...rest}
        data-target={target || undefined}
        onClick={() => (onPress ? onPress() : engine.act(action))}
        className={cn("transition-shadow", target && "sim-target", className)}
      >
        {children}
      </button>
      {target && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-3 end-2 z-10 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground shadow"
        >
          <Pointer className="h-3.5 w-3.5" /> {t("tapHere")}
        </span>
      )}
    </span>
  );
}

export function CompletionActions() {
  const { goSummary, retry, goHome } = useLesson();
  const { t } = useLanguage();
  return (
    <div className="grid gap-2">
      <button type="button" className="btn btn-primary w-full" onClick={goSummary}>{t("viewSummary")}</button>
      <button type="button" className="btn btn-outline w-full" onClick={retry}>{t("tryAgain")}</button>
      <button type="button" className="btn btn-ghost w-full" onClick={goHome}>{t("backDashboard")}</button>
    </div>
  );
}
