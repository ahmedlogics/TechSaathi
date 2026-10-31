import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useLessonEngine } from "@/hooks/useLessonEngine";
import { useLearningProgress } from "@/hooks/useLearningProgress";
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
  const [resetKey, setResetKey] = [engine.state.stepIndex === 0 && engine.state.mistakes === 0 ? 0 : 1, null];
  void setResetKey;

  useEffect(() => markVisited(module.id, mode), [module.id, mode, markVisited]);

  const record = (completed: boolean) =>
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
      retry: engine.reset,
      goHome: () => navigate({ to: "/" }),
    }),
    [module, mode, engine, navigate],
  );

  const Simulator = simulators[module.id];
  const onExit = () => {
    record(false);
    navigate({ to: "/results/$moduleId", params: { moduleId: module.id } });
  };

  return (
    <LessonProvider value={value}>
      <div className="grid items-start gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-10">
        <div className="lg:sticky lg:top-24 lg:order-2">
          <GuidePanel onExit={onExit} />
        </div>
        <div className="lg:order-1">
          {/* key resets simulator-local state (inputs, selections) when the lesson restarts */}
          <Simulator key={`${module.id}-${resetKey === 0 ? "fresh" : "run"}`} />
        </div>
      </div>
    </LessonProvider>
  );
}
