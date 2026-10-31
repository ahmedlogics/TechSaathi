import { createContext, useContext, useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ArrowDown, Pointer } from "lucide-react";
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
};

/** A control inside the simulated phone. Highlights itself when it is the current target using a non-blocking pulsing ripple. */
export function SimButton({ action, onPress, highlightFor, className, children, ...rest }: SimButtonProps) {
  const { engine, isTarget } = useLesson();
  const target = isTarget(highlightFor ?? action);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (target && btnRef.current) {
      btnRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [target]);

  return (
    <span className="relative block">
      <button
        ref={btnRef}
        type="button"
        {...rest}
        data-target={target || undefined}
        onClick={() => (onPress ? onPress() : engine.act(action))}
        className={cn(
          "transition-all duration-200",
          target && "guided-target-active",
          className,
        )}
      >
        {children}
      </button>
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
