import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
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
      <div className="h-full w-full max-w-7xl mx-auto flex items-center justify-center gap-6 lg:gap-10 xl:gap-16 px-4 py-2 sm:py-3 overflow-hidden">
        {/* Left: Phone Simulator (occupies 96% of remaining viewport height) */}
        <div className="h-[96%] max-h-full flex items-center justify-center shrink-0">
          {/* key resets simulator-local state (inputs, selections) when the lesson restarts */}
          <Simulator key={`${module.id}-${runId}`} />
        </div>

        {/* Right: Instruction Panel (vertically centered alongside the phone) */}
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl shrink self-center">
          <GuidePanel onExit={onExit} onRestart={restart} />
        </div>
      </div>
    </LessonProvider>
  );
}
