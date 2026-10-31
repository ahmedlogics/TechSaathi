import { useCallback, useState } from "react";
import { practiceSteps } from "./pakidPracticeData";
import { PakIDPhoneSimulator } from "./PakIDPhoneSimulator";
import { PakIDStepGuide } from "./PakIDStepGuide";
import { PakIDCompletion } from "./PakIDCompletion";
import { useLanguage } from "@/contexts/LanguageContext";

interface PakIDPracticeProps {
  initialMode?: "guide" | "practice";
  onBackToLanding: () => void;
  onBackHome: () => void;
}

export function PakIDPractice({
  initialMode = "guide",
  onBackToLanding,
  onBackHome,
}: PakIDPracticeProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [isGuided, setIsGuided] = useState(initialMode === "guide");
  const [hintVisible, setHintVisible] = useState(false);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<{ en: string; ur: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const { lang } = useLanguage();
  const ur = lang === "ur";

  const currentStep = practiceSteps[stepIdx]!;
  const totalSteps = practiceSteps.length;

  const handleAction = useCallback(
    (action: string) => {
      // Check for back navigation actions from within simulator screens
      if (action.startsWith("back-to-")) {
        if (stepIdx > 0) {
          setStepIdx((prev) => prev - 1);
          setFeedback(null);
          setHintVisible(false);
        }
        return;
      }

      if (action === currentStep.expectedAction) {
        setFeedback(null);
        setHintVisible(false);

        if (stepIdx >= totalSteps - 1) {
          setIsCompleted(true);
        } else {
          setStepIdx((prev) => prev + 1);
        }
      } else {
        // Unexpected action
        setMistakesCount((c) => c + 1);
        setFeedback({
          en: "That was not the expected step. Check the guide on the right for what to do next.",
          ur: "یہ مطلوبہ عمل نہیں تھا۔ رہنمائی میں دیکھیں کہ آگے کیا کرنا ہے۔",
        });
      }
    },
    [currentStep, stepIdx, totalSteps]
  );

  const handleWrongAction = useCallback(
    (msg: { en: string; ur: string }) => {
      setMistakesCount((c) => c + 1);
      setFeedback(msg);
    },
    []
  );

  const handleToggleHint = useCallback(() => {
    setHintVisible((prev) => {
      if (!prev) setHintsUsed((c) => c + 1);
      return !prev;
    });
  }, []);

  const handleBack = useCallback(() => {
    if (stepIdx > 0) {
      setStepIdx((prev) => prev - 1);
      setFeedback(null);
      setHintVisible(false);
    }
  }, [stepIdx]);

  const handleRestart = useCallback(() => {
    setStepIdx(0);
    setMistakesCount(0);
    setHintsUsed(0);
    setFeedback(null);
    setHintVisible(false);
    setIsCompleted(false);
  }, []);

  if (isCompleted) {
    return (
      <PakIDCompletion
        isGuided={isGuided}
        mistakesCount={mistakesCount}
        hintsUsed={hintsUsed}
        onRestart={handleRestart}
        onTryIndependent={() => {
          setIsGuided(false);
          handleRestart();
        }}
        onBackHome={onBackHome}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Back to overview navigation link */}
      <div className="mb-4">
        <button
          type="button"
          onClick={onBackToLanding}
          className="text-xs font-bold text-emerald-800 hover:underline"
        >
          {ur ? "← پاک آئی ڈی تعارف پر واپس جائیں" : "← Back to PakID Overview"}
        </button>
      </div>

      {/* Responsive layout: Simulator left, Guide right */}
      <div className="grid items-start gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-10">
        {/* Right in DOM / Second column on desktop: Guide Panel (sticky on desktop) */}
        <div className="lg:sticky lg:top-20 lg:order-2">
          <PakIDStepGuide
            step={currentStep}
            totalSteps={totalSteps}
            isGuided={isGuided}
            onToggleMode={() => setIsGuided((g) => !g)}
            hintVisible={hintVisible}
            onToggleHint={handleToggleHint}
            feedback={feedback}
            onClearFeedback={() => setFeedback(null)}
            mistakesCount={mistakesCount}
            hintsUsed={hintsUsed}
            onBack={handleBack}
            onRestart={handleRestart}
            onExit={onBackToLanding}
            ur={ur}
          />
        </div>

        {/* Left in DOM / First column on desktop: Virtual Phone Simulator */}
        <div className="lg:order-1 flex justify-center">
          <PakIDPhoneSimulator
            screen={currentStep.screen}
            isGuided={isGuided}
            hintVisible={hintVisible}
            onAction={handleAction}
            onWrongAction={handleWrongAction}
            ur={ur}
          />
        </div>
      </div>
    </div>
  );
}

