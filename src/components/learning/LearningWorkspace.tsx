import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLessonEngine } from "@/hooks/useLessonEngine";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { saveProgress, saveAttempt } from "@/services/progressService";
import type { LearningMode, LearningModule } from "@/types/learning";
import { LessonProvider, type LessonContextValue } from "./LessonContext";
import { GuidePanel } from "./GuidePanel";
import { PaymentSimulator } from "@/components/simulators/PaymentSimulator";
import { RideSimulator } from "@/components/simulators/RideSimulator";
import { ProofOfLifeSimulator } from "@/components/simulators/ProofOfLifeSimulator";
import { CallSimulator } from "@/components/simulators/CallSimulator";

const simulators = {
  "send-money": PaymentSimulator,
  "book-ride": RideSimulator,
  "proof-of-life": ProofOfLifeSimulator,
  "video-call": CallSimulator,
};

export function LearningWorkspace({ module, mode }: { module: LearningModule; mode: LearningMode }) {
  const engine = useLessonEngine(module);
  const navigate = useNavigate();
  const { t, tr } = useLanguage();
  const { markVisited, saveRecord } = useLearningProgress();
  const saved = useRef(false);
  const [runId, setRunId] = useState(0);
  const restart = () => {
    engine.reset();
    setRunId((n) => n + 1);
  };

  useEffect(() => markVisited(module.id, mode), [module.id, mode, markVisited]);

  const record = (completed: boolean) => {
    saveRecord({
      moduleId: module.id,
      mode,
      completedSteps: engine.state.stepIndex,
      totalSteps: engine.totalSteps,
      mistakes: engine.state.mistakes,
      hints: engine.state.hints,
      completed,
      finishedAt: new Date().toISOString(),
    });

    // Supabase cloud persistence (non-blocking, keeps simulation functional offline)
    saveProgress({
      moduleId: module.id,
      lastStep: engine.state.stepIndex,
      mode,
      completed,
    }).catch((err) => console.warn("[TechSaathi] Cloud progress sync deferred:", err));

    if (completed) {
      saveAttempt({
        moduleId: module.id,
        mode,
        completed: true,
        mistakesCount: engine.state.mistakes,
        hintsUsed: engine.state.hints,
      }).catch((err) => console.warn("[TechSaathi] Cloud attempt sync deferred:", err));
    }
  };

  useEffect(() => {
    if (engine.completed && !saved.current) {
      saved.current = true;
      record(true);
    }
    if (!engine.completed) saved.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine.completed]);

  const value: LessonContextValue = useMemo(
    () => ({
      module,
      mode,
      engine,
      isTarget: (a) => engine.step.expected === a && (mode === "guide" || engine.state.hintVisible),
      goSummary: () => navigate({ to: "/results/$moduleId", params: { moduleId: module.id } }),
      retry: restart,
      goHome: () => navigate({ to: "/" }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [module, mode, engine, navigate],
  );

  const Simulator = simulators[module.id];
  const onExit = () => {
    record(false);
    navigate({ to: "/results/$moduleId", params: { moduleId: module.id } });
  };

  return (
    <LessonProvider value={value}>
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col px-4 py-2 sm:py-3">
        {/* Top Navigation: Back to Home button */}
        <div className="mb-2 shrink-0 flex items-center justify-between">
          <Link
            to="/"
            className="btn btn-ghost -ms-2 inline-flex items-center gap-2 text-sm sm:text-base font-bold text-heading hover:text-primary-strong transition-colors"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 rtl:rotate-180" />
            <span>{t("backHome")}</span>
          </Link>
          <span className="text-xs font-semibold text-muted-foreground hidden sm:inline-block">
            {tr(module.title)} • {mode === "guide" ? t("modeGuide") : t("modePractice")}
          </span>
        </div>

        {/* Workspace: Phone Simulator & Guide Panel */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 xl:gap-14 my-auto pb-4">
          {/* Left: Phone Simulator */}
          <div className="flex items-center justify-center shrink-0">
            {/* key resets simulator-local state (inputs, selections) when the lesson restarts */}
            <Simulator key={`${module.id}-${runId}`} />
          </div>

          {/* Right: Instruction Panel (vertically centered alongside the phone) */}
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl shrink self-center">
            <GuidePanel onExit={onExit} onRestart={restart} />
          </div>
        </div>
      </div>
    </LessonProvider>
  );
}
