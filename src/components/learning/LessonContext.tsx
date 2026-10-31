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
  /** Direction of the animated arrow pointing at the button */
  arrowPosition?: "top" | "bottom" | "left" | "right";
};

/** A control inside the simulated phone. Highlights itself with an animated arrow when it is the current target. */
export function SimButton({
  action,
  onPress,
  highlightFor,
  className,
  children,
  arrowPosition = "top",
  ...rest
}: SimButtonProps) {
  const { engine, isTarget } = useLesson();
  const { t } = useLanguage();
  const target = isTarget(highlightFor ?? action);
  return (
    <span className="relative inline-flex items-center justify-center">
      <button
        type="button"
        {...rest}
        data-target={target || undefined}
        onClick={() => (onPress ? onPress() : engine.act(action))}
        className={cn(
          "transition-all duration-300",
          target && "sim-target ring-4 ring-amber-400 dark:ring-amber-300 ring-offset-2 ring-offset-background shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-pulse",
          className,
        )}
      >
        {children}
      </button>
      {target && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute z-50 flex select-none items-center drop-shadow-xl",
            arrowPosition === "top" && "-top-12 left-1/2 -translate-x-1/2 flex-col animate-bounce",
            arrowPosition === "bottom" && "-bottom-12 left-1/2 -translate-x-1/2 flex-col-reverse animate-bounce",
            arrowPosition === "left" && "-left-28 top-1/2 -translate-y-1/2 flex-row animate-bounce",
            arrowPosition === "right" && "-right-28 top-1/2 -translate-y-1/2 flex-row-reverse animate-bounce",
          )}
        >
          {/* Animated Tap Badge */}
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-400 dark:bg-amber-300 px-2.5 py-1 text-xs font-black text-slate-950 shadow-lg ring-2 ring-white dark:ring-slate-900">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-700" />
            </span>
            <span>{t("tapHere")}</span>
          </span>

          {/* Animated Arrow Icon pointing directly at the button */}
          {arrowPosition === "top" && (
            <svg
              viewBox="0 0 24 24"
              className="-mt-1 h-5 w-5 fill-amber-400 dark:fill-amber-300 drop-shadow"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 21l-7-8h4.5V3h5v10H19l-7 8z" />
            </svg>
          )}
          {arrowPosition === "bottom" && (
            <svg
              viewBox="0 0 24 24"
              className="-mb-1 h-5 w-5 fill-amber-400 dark:fill-amber-300 drop-shadow rotate-180"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 21l-7-8h4.5V3h5v10H19l-7 8z" />
            </svg>
          )}
          {arrowPosition === "left" && (
            <svg
              viewBox="0 0 24 24"
              className="-mr-1 h-5 w-5 fill-amber-400 dark:fill-amber-300 drop-shadow -rotate-90"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 21l-7-8h4.5V3h5v10H19l-7 8z" />
            </svg>
          )}
          {arrowPosition === "right" && (
            <svg
              viewBox="0 0 24 24"
              className="-ml-1 h-5 w-5 fill-amber-400 dark:fill-amber-300 drop-shadow rotate-90"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 21l-7-8h4.5V3h5v10H19l-7 8z" />
            </svg>
          )}
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
