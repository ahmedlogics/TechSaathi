import { useNavigate } from "@tanstack/react-router";
import { PakIDPractice } from "@/features/pakid/PakIDPractice";
import { useLesson } from "@/components/learning/LessonContext";

export function ProofOfLifeSimulator() {
  const navigate = useNavigate();
  const lesson = useLesson();

  return (
    <PakIDPractice
      initialMode={lesson?.mode === "practice" ? "practice" : "guide"}
      onBackToLanding={() => navigate({ to: "/learn/$moduleId", params: { moduleId: "proof-of-life" } })}
      onBackHome={() => navigate({ to: "/" })}
    />
  );
}
