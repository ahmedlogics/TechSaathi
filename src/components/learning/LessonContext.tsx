import { createContext, useContext, useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import type { LessonEngine } from "@/hooks/useLessonEngine";
import type { ExpectedAction, LearningMode, LearningModule, LocalText } from "@/types/learning";
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
  /** Custom guidance label to display in the indicator badge */
  hintLabel?: LocalText | string;
  /** Direction of the animated arrow pointing at the button (optional) */
  arrowPosition?: "top" | "bottom" | "left" | "right";
};

/** A control inside the simulated phone. Highlights itself when it is the current target using a non-blocking pulsing ripple or directional arrow. */
export function SimButton({
  action,
  onPress,
  highlightFor,
  className,
  children,
  hintLabel,
  arrowPosition,
  ...rest
}: SimButtonProps) {
  const { engine, isTarget } = useLesson();
  const { t } = useLanguage();
  const target = isTarget(highlightFor ?? action);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (target && btnRef.current) {
      btnRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [target]);

  return (
    <span className="relative inline-flex items-center justify-center">
      <button
        ref={btnRef}
        type="button"
        {...rest}
        data-target={target || undefined}
        onClick={() => (onPress ? onPress() : engine.act(action))}
        className={cn(
          "transition-all duration-200",
          target && (arrowPosition ? "sim-target ring-4 ring-amber-400 dark:ring-amber-300 ring-offset-2 ring-offset-background" : "guided-target-active"),
          className,
        )}
      >
        {children}
      </button>
      {target && (
        arrowPosition ? (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute z-50 flex select-none items-center drop-shadow-xl",
              arrowPosition === "top" && "-top-12 left-1/2 -translate-x-1/2 flex-col animate-bounce",
              arrowPosition === "bottom" && "-bottom-12 left-1/2 -translate-x-1/2 flex-col-reverse animate-bounce",
              arrowPosition === "left" && "-left-28 top-1/2 -translate-y-1/2 flex-row animate-bounce",
              arrowPosition === "right" && "-right-28 top-1/2 -translate-y-1/2 flex-row-reverse animate-bounce",
            )}
          >
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-400 dark:bg-amber-300 px-2.5 py-1 text-xs font-black text-slate-950 shadow-lg ring-2 ring-white dark:ring-slate-900">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-700" />
              </span>
              <span>{t("tapHere")}</span>
            </span>

            {arrowPosition === "top" && (
              <svg viewBox="0 0 24 24" className="-mt-1 h-5 w-5 fill-amber-400 dark:fill-amber-300 drop-shadow" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21l-7-8h4.5V3h5v10H19l-7 8z" />
              </svg>
            )}
            {arrowPosition === "bottom" && (
              <svg viewBox="0 0 24 24" className="-mb-1 h-5 w-5 fill-amber-400 dark:fill-amber-300 drop-shadow rotate-180" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21l-7-8h4.5V3h5v10H19l-7 8z" />
              </svg>
            )}
            {arrowPosition === "left" && (
              <svg viewBox="0 0 24 24" className="-mr-1 h-5 w-5 fill-amber-400 dark:fill-amber-300 drop-shadow -rotate-90" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21l-7-8h4.5V3h5v10H19l-7 8z" />
              </svg>
            )}
            {arrowPosition === "right" && (
              <svg viewBox="0 0 24 24" className="-ml-1 h-5 w-5 fill-amber-400 dark:fill-amber-300 drop-shadow rotate-90" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21l-7-8h4.5V3h5v10H19l-7 8z" />
              </svg>
            )}
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-2 -end-2 z-30 flex h-7 w-7 items-center justify-center"
          >
            <span className="guided-ripple-ring absolute h-7 w-7 rounded-full bg-[#087F72]/25" />
            <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#087F72] text-white shadow-md">
              <ArrowDown className="h-3 w-3 stroke-[3]" />
            </span>
          </span>
        )
      )}
    </span>
  );
}

/** Wrapper for text or number inputs to display a guidance ripple and teal highlight without blocking fields */
export function SimInputWrapper({
  action,
  label,
  className,
  children,
}: {
  action: ExpectedAction;
  label?: LocalText | string;
  className?: string;
  children: ReactNode;
}) {
  const { isTarget } = useLesson();
  const target = isTarget(action);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (target && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [target]);

  return (
    <div ref={containerRef} className={cn("relative block", className)}>
      {target && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 -end-2 z-30 flex h-7 w-7 items-center justify-center"
        >
          <span className="guided-ripple-ring absolute h-7 w-7 rounded-full bg-[#087F72]/25" />
          <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#087F72] text-white shadow-md">
            <ArrowDown className="h-3 w-3 stroke-[3]" />
          </span>
        </span>
      )}
      <div className={cn("transition-all duration-200 rounded-xl", target && "guided-target-active")}>
        {children}
      </div>
    </div>
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
