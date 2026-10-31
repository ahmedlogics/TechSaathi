import { AlertCircle, CheckCircle2, Lightbulb, LogOut, RotateCcw, Compass, Hand } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLesson } from "./LessonContext";

export function GuidePanel({ onExit, onRestart }: { onExit: () => void; onRestart: () => void }) {
  const { t, tr } = useLanguage();
  const { module, mode, engine } = useLesson();
  const { step, state, totalSteps, completed } = engine;
  const current = Math.min(state.stepIndex + 1, totalSteps);
  const pct = Math.round((state.stepIndex / totalSteps) * 100);
  const guide = mode === "guide";

  return (
    <aside className="card-surface rounded-3xl border border-border bg-card p-5 sm:p-6 lg:p-7 shadow-xs flex flex-col gap-4 sm:gap-5" aria-label={tr(module.title)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-base sm:text-lg font-bold text-heading">{tr(module.title)}</p>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs sm:text-sm font-bold ${
            guide ? "bg-mint text-primary-strong" : "bg-sky text-heading"
          }`}
        >
          {guide ? <Compass className="h-4 w-4" /> : <Hand className="h-4 w-4" />}
          {guide ? t("modeGuide") : t("modePractice")}
        </span>
      </div>

      <div>
        <div className="mb-2 flex justify-between text-xs sm:text-sm font-semibold text-foreground">
          <span>
            {completed ? t("completed") : `${t("step")} ${current} ${t("of")} ${totalSteps}`}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {!guide && !completed && (
        <div className="rounded-2xl bg-sky p-3.5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("yourTask")}</p>
          <p className="text-base sm:text-lg font-semibold text-heading">{tr(module.objective)}</p>
        </div>
      )}

      {(guide || completed) && (
        <div className="space-y-2">
          <h2 className="flex items-start gap-2 text-xl sm:text-2xl font-black text-heading">
            {completed && <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-success" />}
            {tr(step.title)}
          </h2>
          <p className="text-sm sm:text-base text-foreground leading-relaxed">{tr(step.body)}</p>
          {step.tip && (
            <p className="mt-2.5 rounded-xl border-s-4 border-warning bg-warning-soft p-3 text-xs sm:text-sm">
              <strong>{t("tip")}:</strong> {tr(step.tip)}
            </p>
          )}
        </div>
      )}

      {state.feedback && !completed && (
        <div role="alert" className="flex gap-2.5 rounded-xl border-2 border-destructive bg-destructive-soft p-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="font-bold text-xs sm:text-sm text-destructive">{t("notQuite")}</p>
            <p className="text-xs sm:text-sm text-heading">{tr(state.feedback)}</p>
          </div>
        </div>
      )}

      {state.hintVisible && !completed && (
        <div className="flex gap-2.5 rounded-xl border-2 border-primary bg-mint p-3" role="status">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary-strong" />
          <div>
            {!guide && <p className="font-bold text-xs sm:text-sm text-heading">{tr(step.title)}</p>}
            <p className="text-xs sm:text-sm text-heading">{tr(step.hint)}</p>
          </div>
        </div>
      )}

      {!completed && (
        <button type="button" className="btn btn-outline w-full min-h-[46px] py-2 text-sm sm:text-base font-semibold" onClick={engine.showHint} disabled={state.hintVisible}>
          <Lightbulb className="h-4.5 w-4.5" /> {guide ? t("showHint") : t("needHelp")}
        </button>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-3">
        <button type="button" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" /> {t("restart")}
        </button>
        {!completed && (
          <button type="button" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors ms-auto" onClick={onExit}>
            <LogOut className="h-4 w-4" /> {t("exitLesson")}
          </button>
        )}
      </div>
    </aside>
  );
}
