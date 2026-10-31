import {
  AlertCircle,
  ArrowLeft,
  Compass,
  Hand,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";
import type { PakIDStepDefinition } from "./types";

interface PakIDStepGuideProps {
  step: PakIDStepDefinition;
  totalSteps: number;
  isGuided: boolean;
  onToggleMode: () => void;
  hintVisible: boolean;
  onToggleHint: () => void;
  feedback: { en: string; ur: string } | null;
  onClearFeedback: () => void;
  mistakesCount: number;
  hintsUsed: number;
  onBack: () => void;
  onRestart: () => void;
  onExit: () => void;
  ur: boolean;
}

export function PakIDStepGuide({
  step,
  totalSteps,
  isGuided,
  onToggleMode,
  hintVisible,
  onToggleHint,
  feedback,
  onClearFeedback,
  mistakesCount,
  hintsUsed,
  onBack,
  onRestart,
  onExit,
  ur,
}: PakIDStepGuideProps) {
  const percent = Math.round((step.stepNumber / totalSteps) * 100);

  return (
    <div className="flex flex-col gap-4 rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-md transition-all lg:p-7">
      {/* Top Bar: Progress and Mode Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            {ur ? `مرحلہ ${step.stepNumber} از ${totalSteps}` : `Step ${step.stepNumber} of ${totalSteps}`}
          </span>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-2.5 w-32 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-slate-500">{percent}%</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleMode}
          className={`flex min-h-[44px] items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all shadow-sm ${
            isGuided
              ? "bg-emerald-100 text-emerald-950 hover:bg-emerald-200"
              : "bg-slate-100 text-slate-800 hover:bg-slate-200"
          }`}
          title={ur ? "طریقہ کار تبدیل کریں" : "Toggle guidance mode"}
        >
          {isGuided ? (
            <>
              <Compass className="h-4 w-4 text-emerald-700" />
              <span>{ur ? "رہنمائی کا طریقہ (Guided)" : "Guided Mode"}</span>
            </>
          ) : (
            <>
              <Hand className="h-4 w-4 text-slate-700" />
              <span>{ur ? "خود مشق کریں (Independent)" : "Independent Mode"}</span>
            </>
          )}
        </button>
      </div>

      {/* Step Heading — Large 20-24px for Older Adults */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 sm:text-[1.7rem] leading-snug">
          {ur ? step.title.ur : step.title.en}
        </h2>
        {/* Instruction Paragraph — 18-20px Text */}
        <p className="mt-3 text-lg sm:text-xl font-medium leading-relaxed text-slate-700">
          {ur ? step.instruction.ur : step.instruction.en}
        </p>
      </div>

      {/* Tip Banner if available */}
      {step.tip && (
        <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 p-4 text-emerald-950">
          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
          <p className="text-base sm:text-lg leading-relaxed">
            {ur ? step.tip.ur : step.tip.en}
          </p>
        </div>
      )}

      {/* Wrong Action Feedback Alert */}
      {feedback && (
        <div className="flex items-start justify-between gap-3 rounded-2xl bg-rose-50 border border-rose-300 p-4 text-rose-950 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-rose-600" />
            <div>
              <p className="font-bold text-base">
                {ur ? "دوبارہ کوشش کریں:" : "Gentle Reminder:"}
              </p>
              <p className="mt-0.5 text-base sm:text-lg leading-relaxed">
                {ur ? feedback.ur : feedback.en}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClearFeedback}
            className="rounded-lg p-1 text-rose-600 hover:bg-rose-100"
            aria-label="Dismiss feedback"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Hint Accordion / Button */}
      <div className="pt-2">
        {!hintVisible ? (
          <button
            type="button"
            onClick={onToggleHint}
            className="flex min-h-[48px] items-center gap-2 rounded-2xl border-2 border-emerald-600 bg-white px-5 py-2.5 text-base font-bold text-emerald-800 transition hover:bg-emerald-50 active:scale-95"
          >
            <HelpCircle className="h-5 w-5 text-emerald-700" />
            <span>{ur ? "مدد چاہیے؟ (Need a Hint?)" : "Need a Hint?"}</span>
          </button>
        ) : (
          <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50 p-4 text-emerald-950 animate-in fade-in">
            <div className="flex items-center justify-between pb-1">
              <span className="flex items-center gap-1.5 font-bold text-base text-emerald-900">
                <HelpCircle className="h-5 w-5 text-emerald-700" />
                {ur ? "رہنمائی کی مدد:" : "Helpful Hint:"}
              </span>
              <button
                type="button"
                onClick={onToggleHint}
                className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
              >
                {ur ? "چھپائیں" : "Hide"}
              </button>
            </div>
            <p className="mt-1 text-lg font-medium leading-relaxed">
              {ur ? step.hint.ur : step.hint.en}
            </p>
          </div>
        )}
      </div>

      {/* Stats Counter Bar */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-semibold text-slate-500">
        <span>
          {ur ? "غلطیاں:" : "Mistakes:"} <strong className="text-slate-800">{mistakesCount}</strong>
        </span>
        <span>
          {ur ? "استعمال شدہ مدد:" : "Hints used:"}{" "}
          <strong className="text-slate-800">{hintsUsed}</strong>
        </span>
      </div>

      {/* Navigation Controls: Back, Restart, Exit */}
      <div className="grid grid-cols-3 gap-2 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={step.stepNumber <= 1}
          className="flex min-h-[48px] items-center justify-center gap-1 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          <span>{ur ? "پیچھے" : "Back"}</span>
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="flex min-h-[48px] items-center justify-center gap-1 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          <span>{ur ? "دوبارہ" : "Restart"}</span>
        </button>

        <button
          type="button"
          onClick={onExit}
          className="flex min-h-[48px] items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/70 px-3 py-2 text-sm font-bold text-rose-800 transition hover:bg-rose-100"
        >
          <span>{ur ? "باہر نکلیں" : "Exit"}</span>
        </button>
      </div>
    </div>
  );
}

