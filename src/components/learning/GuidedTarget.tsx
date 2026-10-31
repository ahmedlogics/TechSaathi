import { useEffect, useRef, type ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import { useLesson } from "./LessonContext";
import type { ExpectedAction } from "@/types/learning";
import { cn } from "@/lib/utils";

interface GuidedTargetProps {
  action: ExpectedAction;
  className?: string;
  children: ReactNode;
  /** Position of the ripple indicator relative to target */
  position?: "top-right" | "top-left" | "top-center" | "right";
}

/**
 * Accessible Pulsing Ripple Guidance Component:
 * - Emits a soft teal circular ripple every ~1.9s
 * - Highlights the single active target with a 2.5px teal outline and soft glow
 * - Includes a small directional arrow pointing at the active control
 * - Contains NO overlapping text labels
 * - Non-blocking (pointer-events-none) so clicks and input focus are never captured
 * - Honors prefers-reduced-motion with static styling
 */
export function GuidedTarget({
  action,
  className,
  children,
  position = "top-right",
}: GuidedTargetProps) {
  const { isTarget } = useLesson();
  const active = isTarget(action);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (active && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [active]);

  const posClasses = {
    "top-right": "-top-2 -end-2",
    "top-left": "-top-2 -start-2",
    "top-center": "-top-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2",
    right: "top-1/2 -end-3 -translate-y-1/2",
  }[position];

  return (
    <div ref={targetRef} className={cn("relative block", className)}>
      {active && (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute z-30 flex h-7 w-7 items-center justify-center",
            posClasses,
          )}
        >
          {/* Outer soft teal expanding ripple */}
          <span className="guided-ripple-ring absolute h-7 w-7 rounded-full bg-[#087F72]/25" />
          {/* Inner crisp indicator dot with directional arrow */}
          <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#087F72] text-white shadow-md">
            <ArrowDown className="h-3 w-3 stroke-[3]" />
          </span>
        </span>
      )}
      <div className={cn("transition-all duration-200 rounded-xl", active && "guided-target-active")}>
        {children}
      </div>
    </div>
  );
}
