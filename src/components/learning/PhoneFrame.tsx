import type { ReactNode } from "react";
import { ChevronLeft, ShieldCheck, Signal, Wifi, BatteryFull } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLesson } from "./LessonContext";

/**
 * On large screens: a smartphone shell. On small screens (user is already on a phone):
 * the simulated app fills the available width with no miniature frame.
 */
export function PhoneFrame({ appName, children }: { appName: string; children: ReactNode }) {
  const { t } = useLanguage();
  const { engine } = useLesson();
  const canGoBack = engine.state.stepIndex > 0 && !engine.completed;
  return (
    <div className="w-full overflow-hidden rounded-2xl border-2 border-border bg-card lg:phone-shell lg:rounded-[3rem]" dir="ltr">
      <div className="hidden items-center justify-between bg-phone px-6 py-2 text-xs font-semibold text-primary-foreground lg:flex">
        <span>9:41</span>
        <span className="h-5 w-24 rounded-full bg-foreground" aria-hidden />
        <span className="flex items-center gap-1" aria-hidden>
          <Signal className="h-3.5 w-3.5" />
          <Wifi className="h-3.5 w-3.5" />
          <BatteryFull className="h-4 w-4" />
        </span>
      </div>
      <div className="flex items-center gap-2 border-b border-border bg-primary px-3 py-3 text-primary-foreground">
        {canGoBack ? (
          <button type="button" onClick={engine.back} aria-label={t("back")} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-primary-strong">
            <ChevronLeft className="h-6 w-6" />
          </button>
        ) : (
          <span className="w-2" />
        )}
        <span className="flex-1 text-lg font-bold">{appName}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-bold text-warning">
          <ShieldCheck className="h-3.5 w-3.5" /> {t("practiceOnly")}
        </span>
      </div>
      <div className="min-h-[560px] bg-background p-4 lg:h-[620px] lg:overflow-y-auto" aria-live="polite">
        {children}
      </div>
    </div>
  );
}
