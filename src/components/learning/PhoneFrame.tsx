import { useEffect, useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ShieldCheck, Signal, Wifi, BatteryFull } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLesson } from "./LessonContext";
import { cn } from "@/lib/utils";

/**
 * Realistic smartphone simulator with natural touchscreen drag-to-scroll.
 * - Stationary hardware frame, status bar, and home indicator.
 * - Mouse drag-to-scroll with threshold distinguishing clicks from dragging.
 * - Smooth native touch scrolling on mobile devices.
 * - Main webpage remains completely static with no scroll propagation.
 * - Scrollbar hidden cross-browser while preserving full scrollability.
 */
export function PhoneFrame({
  appName,
  children,
  hideHeader = false,
  noPadding = false,
  darkTheme = false,
}: {
  appName: string;
  children: ReactNode;
  hideHeader?: boolean;
  noPadding?: boolean;
  darkTheme?: boolean;
}) {
  const { t } = useLanguage();
  const { engine } = useLesson();
  const canGoBack = engine.state.stepIndex > 0 && !engine.completed;

  const scrollRef = useRef<HTMLDivElement>(null);
  const isPointerDownRef = useRef(false);
  const startYRef = useRef(0);
  const startScrollTopRef = useRef(0);
  const isDraggingRef = useRef(false);
  const justDraggedRef = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Reset scroll to top when changing screens/steps
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [engine.state.stepIndex, hideHeader]);

  // Auto-scroll guided target into view when step changes (if needed)
  useEffect(() => {
    if (!scrollRef.current) return;
    const timer = setTimeout(() => {
      const target = scrollRef.current?.querySelector<HTMLElement>("[data-target]");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [engine.state.stepIndex, engine.state.hintVisible]);

  // Pointer down (mouse drag start)
  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only primary mouse button
    if (e.pointerType === "touch") return; // Touch devices handle scrolling natively

    // Do not initiate drag if interacting directly with editable inputs or interactive map
    const targetEl = e.target as HTMLElement;
    const tag = targetEl.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (targetEl.closest("[data-no-drag], .leaflet-container")) return;

    if (!scrollRef.current) return;
    isPointerDownRef.current = true;
    startYRef.current = e.clientY;
    startScrollTopRef.current = scrollRef.current.scrollTop;
    isDraggingRef.current = false;
    justDraggedRef.current = false;
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !scrollRef.current) return;
    if (e.pointerType === "touch") return;

    const deltaY = e.clientY - startYRef.current;

    // 5px movement threshold to distinguish intentional drag from a click
    if (!isDraggingRef.current && Math.abs(deltaY) > 5) {
      isDraggingRef.current = true;
      justDraggedRef.current = true;
      setIsDraggingState(true);
      try {
        scrollRef.current.setPointerCapture(e.pointerId);
      } catch {
        // Fallback if setPointerCapture is unsupported
      }
    }

    if (isDraggingRef.current) {
      scrollRef.current.scrollTop = startScrollTopRef.current - deltaY;
    }
  };

  const endDrag = (e?: ReactPointerEvent<HTMLDivElement>) => {
    if (isPointerDownRef.current) {
      isPointerDownRef.current = false;
      if (isDraggingRef.current) {
        setIsDraggingState(false);
        // Retain justDraggedRef briefly so onClickCapture catches and cancels accidental clicks
        setTimeout(() => {
          justDraggedRef.current = false;
          isDraggingRef.current = false;
        }, 80);
      }
      if (e && scrollRef.current) {
        try {
          if (scrollRef.current.hasPointerCapture(e.pointerId)) {
            scrollRef.current.releasePointerCapture(e.pointerId);
          }
        } catch {
          // Ignore
        }
      }
    }
  };

  // Intercept and prevent accidental button clicks right after dragging
  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (justDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      justDraggedRef.current = false;
    }
  };

  // Prevent wheel/trackpad scrolling from propagating out to the webpage
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className={cn(
        "h-full w-auto aspect-[9/19.5] flex flex-col rounded-[2.5rem] sm:rounded-[2.8rem] border-[7px] sm:border-[8px] border-zinc-950 shadow-2xl overflow-hidden shrink-0 select-none",
        darkTheme ? "bg-[#1C1C1C]" : "bg-card"
      )}
      dir="ltr"
    >
      {/* Phone status bar with dynamic island notch (stationary) */}
      <div
        className={cn(
          "shrink-0 px-5 py-2 text-xs font-semibold flex items-center justify-between",
          darkTheme ? "bg-black text-white" : "bg-phone text-primary-foreground"
        )}
      >
        <span className="text-[11px] font-bold">9:41</span>
        <span className="h-4 w-20 rounded-full bg-black shadow-xs" aria-hidden />
        <span className="flex items-center gap-1.5" aria-hidden>
          <Signal className="h-3 w-3" />
          <Wifi className="h-3 w-3" />
          <BatteryFull className="h-3.5 w-3.5" />
        </span>
      </div>

      {/* Simulator app top bar (stationary) - hidden if screen has custom top bar */}
      {!hideHeader && (
        <div className="shrink-0 flex items-center justify-between gap-1.5 border-b border-border bg-primary px-3 py-1.5 text-primary-foreground min-h-[36px]">
          <div className="flex items-center gap-1 min-w-0 flex-1">
            {canGoBack && (
              <button
                type="button"
                onClick={engine.back}
                aria-label={t("back")}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full hover:bg-primary-strong transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
            )}
            <span className="text-xs sm:text-[13px] font-bold truncate leading-none">{appName}</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-warning shrink-0 tracking-tight leading-none">
            <ShieldCheck className="h-3 w-3" /> {t("practiceOnly")}
          </span>
        </div>
      )}

      {/* Internal scrollable touchscreen viewport */}
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
        onWheel={handleWheel}
        className={cn(
          "flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          darkTheme ? "bg-[#1C1C1C]" : "bg-background",
          isDraggingState ? "cursor-grabbing select-none" : "cursor-grab"
        )}
        style={{
          touchAction: "pan-y",
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        aria-live="polite"
      >
        <div className={cn("flex flex-col min-h-full", noPadding ? "p-0 gap-0" : "p-3 sm:p-3.5 gap-2.5")}>
          {children}
        </div>
      </div>

      {/* Bottom Home Indicator Bar (stationary) */}
      <div
        className={cn(
          "shrink-0 pb-1.5 pt-0.5 flex justify-center",
          darkTheme ? "bg-[#1C1C1C]" : "bg-background"
        )}
        aria-hidden
      >
        <span
          className={cn(
            "h-1 w-24 rounded-full",
            darkTheme ? "bg-white/35" : "bg-foreground/25"
          )}
        />
      </div>
    </div>
  );
}
