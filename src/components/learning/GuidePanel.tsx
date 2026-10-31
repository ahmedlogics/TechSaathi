import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Check,
  Compass,
  Hand,
  Lightbulb,
  LogOut,
  RotateCcw,
  ShieldCheck,
  Info,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLesson } from "./LessonContext";

export function GuidePanel({ onExit, onRestart }: { onExit: () => void; onRestart: () => void }) {
  const { t, tr } = useLanguage();
  const { module, mode, engine } = useLesson();
  const { step, state, totalSteps, completed } = engine;

  // Accurate progress calculation: based on actions completed, not current step index.
  // Review step has 1 action remaining (confirm) -> ~83%, only reaching 100% upon confirmation.
  const actionsCompleted = completed ? totalSteps : state.stepIndex;
  const pct = Math.min(100, Math.round((actionsCompleted / totalSteps) * 100));
  const current = Math.min(state.stepIndex + 1, totalSteps);
  const guide = mode === "guide";

  return (
    <aside
      className="card-surface flex flex-col gap-4 p-5 sm:p-7 transition-all duration-200"
      aria-label={tr(module.title)}
    >
      {/* Header: Module title and Mode badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm sm:text-base font-semibold text-muted-foreground">{tr(module.title)}</p>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs sm:text-sm font-bold shadow-sm ${
            guide ? "bg-mint text-primary-strong border border-primary/20" : "bg-sky text-heading border border-sky/30"
          }`}
        >
          {guide ? <Compass className="h-4 w-4" /> : <Hand className="h-4 w-4" />}
          {guide ? t("modeGuide") : t("modePractice")}
        </span>
      </div>

      {/* Progress Bar: Real action-based progress */}
      <div>
        <div className="mb-2 flex justify-between text-sm font-semibold text-foreground">
          <span>
            {completed ? t("completed") : `${t("step")} ${current} ${t("of")} ${totalSteps}`}
          </span>
          <span className="font-extrabold text-primary">{pct}%</span>
        </div>
        <div
          className="h-3 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Let Me Try objective banner */}
      {!guide && !completed && (
        <div className="rounded-xl border border-sky/50 bg-sky/70 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("yourTask")}</p>
          <p className="mt-1 text-lg sm:text-xl font-bold text-heading">{tr(module.objective)}</p>
        </div>
      )}

      {/* SECTION A: Current Task Card */}
      {(guide || completed) && (
        <div className="rounded-xl border-s-4 border-s-primary border border-border bg-card p-4 sm:p-5 shadow-sm transition-all duration-200">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-strong">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" />
            <span>
              {completed ? t("completed") : `${t("step")} ${current} — ${t("yourTask")}`}
            </span>
          </div>
          <h2 className="mt-2 flex items-start gap-2 text-xl font-extrabold text-heading sm:text-2xl">
            {completed && <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-success" />}
            {tr(step.title)}
          </h2>
          <p className="mt-2 text-base sm:text-lg text-foreground/90 leading-relaxed">{tr(step.body)}</p>
        </div>
      )}

      {/* SECTION B: Why This Step Matters (Educational real-world context) */}
      {!completed && step.whyItMatters && (
        <div className="rounded-xl border border-border bg-card/80 p-4 space-y-1.5 transition-all">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-strong flex items-center gap-1.5">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <span>{t("whyItMatters")}</span>
          </p>
          <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">{tr(step.whyItMatters)}</p>
        </div>
      )}

      {/* SECTION C: What to Check / Verification Checklist */}
      {!completed && step.checklist && step.checklist.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>{t("checklistTitle")}</span>
          </p>
          <ul className="space-y-1.5 text-sm sm:text-base">
            {step.checklist.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-heading">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-mint text-primary-strong">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span className="leading-snug">{tr(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SECTION D: Common Mistake to Avoid */}
      {!completed && step.commonMistake && (
        <div className="rounded-xl border border-warning/40 bg-warning-soft/70 p-4 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-warning flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
            <span>{t("commonMistakeTitle")}</span>
          </p>
          <p className="text-sm sm:text-base text-heading leading-relaxed">{tr(step.commonMistake)}</p>
        </div>
      )}

      {/* Optional Step Tip fallback if no specific educational sections */}
      {!completed && step.tip && !step.whyItMatters && (
        <p className="rounded-xl border-s-4 border-warning bg-warning-soft p-3 text-sm sm:text-base">
          <strong>{t("tip")}:</strong> {tr(step.tip)}
        </p>
      )}

      {/* Mistake feedback alert */}
      {state.feedback && !completed && (
        <div
          role="alert"
          className="flex gap-3 rounded-xl border-2 border-destructive bg-destructive-soft p-4 animate-in fade-in duration-200"
        >
          <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-destructive" />
          <div>
            <p className="font-bold text-destructive">{t("notQuite")}</p>
            <p className="text-sm sm:text-base text-heading leading-relaxed mt-0.5">{tr(state.feedback)}</p>
          </div>
        </div>
      )}

      {/* Contextual Hint Card */}
      {state.hintVisible && !completed && (
        <div
          className="flex gap-3 rounded-xl border-2 border-primary bg-mint p-4 animate-in fade-in duration-200"
          role="status"
        >
          <Lightbulb className="mt-0.5 h-6 w-6 shrink-0 text-primary-strong" />
          <div>
            {!guide && <p className="font-bold text-heading">{tr(step.title)}</p>}
            <p className="text-sm sm:text-base text-heading leading-relaxed">{tr(step.hint)}</p>
          </div>
        </div>
      )}

      {/* Need Help / Show Hint button */}
      {!completed && (
        <button
          type="button"
          className="btn btn-outline w-full shadow-sm text-base"
          onClick={engine.showHint}
          disabled={state.hintVisible}
        >
          <Lightbulb className="h-5 w-5" /> {guide ? t("showHint") : t("needHelp")}
        </button>
      )}

      {/* Bottom controls: Restart and Exit */}
      <div className="flex flex-wrap gap-2 border-t border-border pt-4 mt-auto">
        <button type="button" className="btn btn-ghost" onClick={onRestart}>
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
