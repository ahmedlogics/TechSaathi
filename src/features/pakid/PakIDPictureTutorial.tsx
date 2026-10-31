import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";
import { tutorialSteps } from "./pakidTutorialData";
import { useLanguage } from "@/contexts/LanguageContext";

interface PakIDPictureTutorialProps {
  onBackToLanding: () => void;
  onStartPractice: () => void;
}

export function PakIDPictureTutorial({
  onBackToLanding,
  onStartPractice,
}: PakIDPictureTutorialProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const { lang } = useLanguage();
  const ur = lang === "ur";

  const step = tutorialSteps[currentIdx]!;
  const isLast = currentIdx === tutorialSteps.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onStartPractice();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToLanding}
          className="flex min-h-[44px] items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          <span>{ur ? "مرکزی صفحہ پر واپس" : "Back to PakID Overview"}</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            {ur
              ? `تصویر ${currentIdx + 1} از ${tutorialSteps.length}`
              : `Step ${currentIdx + 1} of ${tutorialSteps.length}`}
          </span>
          <div className="h-3 w-32 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-300"
              style={{
                width: `${Math.round(((currentIdx + 1) / tutorialSteps.length) * 100)}%`,
              }}
            ></div>
          </div>
          <button
            type="button"
            onClick={onStartPractice}
            className="flex min-h-[44px] items-center gap-1.5 rounded-2xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800"
          >
            <Smartphone className="h-4 w-4" />
            <span>{ur ? "خود مشق کریں" : "Try Practice Mode"}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
        {/* Left Column: Phone Frame with Screenshot & Highlights */}
        <div className="flex flex-col items-center">
          <div className="relative mx-auto flex h-[680px] w-full max-w-[340px] flex-col overflow-hidden rounded-[40px] border-[8px] border-slate-900 bg-black shadow-2xl">
            {/* Phone Speaker Notch */}
            <div className="relative z-20 flex h-6 w-full shrink-0 items-center justify-center bg-slate-900">
              <div className="h-3 w-20 rounded-full bg-slate-950"></div>
            </div>

            {/* Screenshot Container — tightly wrapping img so highlights map to image pixels */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-slate-950 p-2">
              <div className="relative inline-block max-h-full max-w-full">
                <img
                  src={step.imagePath}
                  alt={ur ? step.title.ur : step.title.en}
                  className="block max-h-[630px] w-auto max-w-full rounded-xl object-contain shadow"
                />

                {/* Dynamic Highlight Box placed directly over image coordinates */}
                {step.highlightArea && (
                  <div
                    className="pointer-events-none absolute rounded-xl border-4 border-amber-400 bg-amber-400/25 shadow-[0_0_16px_rgba(251,191,36,0.9)] animate-pulse"
                    style={{
                      top: `${step.highlightArea.top}%`,
                      left: `${step.highlightArea.left}%`,
                      width: `${step.highlightArea.width}%`,
                      height: `${step.highlightArea.height}%`,
                    }}
                  >
                    {step.highlightLabel && (
                      <span className="absolute -top-7 left-0 whitespace-nowrap rounded-lg bg-amber-400 px-2.5 py-0.5 text-[11px] font-black text-slate-950 shadow-md">
                        {ur ? step.highlightLabel.ur : step.highlightLabel.en}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Enlarge Button in Phone Frame */}
            <button
              type="button"
              onClick={() => setIsEnlarged(true)}
              className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/90 text-white shadow-lg backdrop-blur transition hover:bg-slate-800"
              title={ur ? "تصویر بڑی کریں" : "Enlarge screenshot"}
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Right Column: Clear Explanations & Step Navigation */}
        <div className="space-y-6 rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-md lg:p-8">
          <div>
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
              {ur ? `مرحلہ ${currentIdx + 1} از ${tutorialSteps.length}` : `Stage ${currentIdx + 1}`}
            </span>
            <h1 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl leading-tight">
              {ur ? step.title.ur : step.title.en}
            </h1>
            <p className="mt-4 text-lg sm:text-xl font-medium leading-relaxed text-slate-700">
              {ur ? step.instruction.ur : step.instruction.en}
            </p>
          </div>

          {/* Details / Explanation Box */}
          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-5 text-emerald-950">
            <p className="text-base sm:text-lg leading-relaxed">
              {ur ? step.details.ur : step.details.en}
            </p>
          </div>

          {/* Key Learnings List */}
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {ur ? "خاص باتیں جو یاد رکھیں:" : "Key things to look for:"}
            </h3>
            <ul className="mt-3 space-y-2.5">
              {(ur ? step.keyPoints.ur : step.keyPoints.en).map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-base text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Back / Next Navigation Buttons (Accessible min 48px height) */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={handlePrev}
              className="flex min-h-[48px] items-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-5 py-2.5 text-base font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
              <span>{ur ? "پچھلا مرحلہ" : "Previous"}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex min-h-[50px] items-center gap-2 rounded-2xl bg-emerald-700 px-6 py-2.5 text-base font-bold text-white shadow-lg transition hover:bg-emerald-800 active:scale-95"
            >
              <span>
                {isLast
                  ? ur
                    ? "اب خود مشق کریں"
                    : "Now Practise on Virtual Phone"
                  : ur
                  ? "اگلا مرحلہ"
                  : "Next Step"}
              </span>
              <ChevronRight className="h-5 w-5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox / Enlarged View Modal */}
      {isEnlarged && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur">
          <div className="relative flex max-h-[95vh] max-w-4xl flex-col items-center">
            <button
              type="button"
              onClick={() => setIsEnlarged(false)}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={step.imagePath}
              alt={ur ? step.title.ur : step.title.en}
              className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
            <p className="mt-3 text-center text-sm font-semibold text-white">
              {ur ? step.title.ur : step.title.en}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

