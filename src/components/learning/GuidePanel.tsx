import { AlertCircle, CheckCircle2, Lightbulb, LogOut, RotateCcw, Compass, Hand } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLesson } from "./LessonContext";

export function GuidePanel({ onExit }: { onExit: () => void }) {
  const { t, tr } = useLanguage();
  const { module, mode, engine } = useLesson();
  const { step, state, totalSteps, completed } = engine;
  const current = Math.min(state.stepIndex + 1, totalSteps);
  const pct = Math.round((state.stepIndex / totalSteps) * 100);
  const guide = mode === "guide";

  return (
    <aside className="card-surface flex flex-col gap-5 p-5 sm:p-7" aria-label={tr(module.title)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-base font-semibold text-muted-foreground">{tr(module.title)}</p>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${guide ? "bg-mint text-primary-strong" : "bg-sky text-heading"}`}>
          {guide ? <Compass className="h-4 w-4" /> : <Hand className="h-4 w-4" />}
          {guide ? t("modeGuide") : t("modePractice")}
        </span>
      </div>

      <div>
        <div className="mb-2 flex justify-between text-sm font-semibold text-foreground">
          <span>
            {completed ? t("completed") : `${t("step")} ${current} ${t("of")} ${totalSteps}`}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {!guide && !completed && (
        <div className="rounded-xl bg-sky p-4">
          <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{t("yourTask")}</p>
          <p className="text-xl font-semibold text-heading">{tr(module.objective)}</p>
        </div>
      )}

      {(guide || completed) && (
        <div>
          <h2 className="flex items-start gap-2 text-2xl font-bold sm:text-[1.6rem]">
            {completed && <CheckCircle2 className="mt-1 h-7 w-7 shrink-0 text-success" />}
            {tr(step.title)}
          </h2>
          <p className="mt-2 text-lg">{tr(step.body)}</p>
          {step.tip && (
            <p className="mt-3 rounded-xl border-s-4 border-warning bg-warning-soft p-3 text-base">
              <strong>{t("tip")}:</strong> {tr(step.tip)}
            </p>
          )}
        </div>
      )}

      {state.feedback && !completed && (
        <div role="alert" className="flex gap-3 rounded-xl border-2 border-destructive bg-destructive-soft p-4">
          <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-destructive" />
          <div>
            <p className="font-bold text-destructive">{t("notQuite")}</p>
            <p className="text-base text-heading">{tr(state.feedback)}</p>
          </div>
        </div>
      )}

      {state.hintVisible && !completed && (
        <div className="flex gap-3 rounded-xl border-2 border-primary bg-mint p-4" role="status">
          <Lightbulb className="mt-0.5 h-6 w-6 shrink-0 text-primary-strong" />
          <div>
            {!guide && <p className="font-bold text-heading">{tr(step.title)}</p>}
            <p className="text-base text-heading">{tr(step.hint)}</p>
          </div>
        </div>
      )}

      {!completed && (
        <button type="button" className="btn btn-outline w-full" onClick={engine.showHint} disabled={state.hintVisible}>
          <Lightbulb className="h-5 w-5" /> {guide ? t("showHint") : t("needHelp")}
        </button>
      )}

      <div className="flex flex-wrap gap-2 border-t border-border pt-4">
        <button type="button" className="btn btn-ghost" onClick={engine.reset}>
          <RotateCcw className="h-5 w-5" /> {t("restart")}
        </button>
        {!completed && (
          <button type="button" className="btn btn-ghost" onClick={onExit}>
            <LogOut className="h-5 w-5" /> {t("exitLesson")}
          </button>
        )}
      </div>
    </aside>
  );
}
