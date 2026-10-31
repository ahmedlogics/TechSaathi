import { useEffect, useRef } from "react";
import {
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  ShieldAlert,
  Smartphone,
  Trophy,
} from "lucide-react";
import { saveAttempt, saveProgress } from "@/services/progressService";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { useLanguage } from "@/contexts/LanguageContext";

interface PakIDCompletionProps {
  isGuided: boolean;
  mistakesCount: number;
  hintsUsed: number;
  onRestart: () => void;
  onTryIndependent: () => void;
  onBackHome: () => void;
}

export function PakIDCompletion({
  isGuided,
  mistakesCount,
  hintsUsed,
  onRestart,
  onTryIndependent,
  onBackHome,
}: PakIDCompletionProps) {
  const { lang } = useLanguage();
  const ur = lang === "ur";
  const { saveRecord } = useLearningProgress();
  const savedRef = useRef(false);

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;

    // 1. Local storage record
    saveRecord({
      moduleId: "proof-of-life",
      mode: isGuided ? "guide" : "practice",
      completedSteps: 13,
      totalSteps: 13,
      mistakes: mistakesCount,
      hints: hintsUsed,
      completed: true,
      finishedAt: new Date().toISOString(),
    });

    // 2. Cloud Supabase record (non-blocking, fails gracefully if offline)
    saveProgress({
      moduleId: "proof-of-life",
      lastStep: 13,
      lastMode: isGuided ? "guided" : "independent",
      ...(isGuided ? { guidedCompleted: true } : { independentCompleted: true }),
    }).catch((err) => console.warn("Supabase saveProgress error:", err));

    saveAttempt({
      moduleId: "proof-of-life",
      mode: isGuided ? "guided" : "independent",
      completed: true,
      mistakesCount,
      hintsUsed,
    }).catch((err) => console.warn("Supabase saveAttempt error:", err));
  }, [isGuided, mistakesCount, hintsUsed, saveRecord]);

  const objectives = [
    {
      en: "Finding the Proof-of-Life service under Biometric Attestation",
      ur: "بائیو میٹرک تصدیق میں سرٹیفیکیٹ برائے حیات تلاش کرنا",
    },
    {
      en: "Selecting the applicant (Myself vs Family Member assistance)",
      ur: "درخواست گزار کا انتخاب (اپنے لیے یا اہل خانہ کی معاونت)",
    },
    {
      en: "Understanding that Proof-of-Life is completely FREE (PKR 0)",
      ur: "یہ سمجھنا کہ نادرا پر یہ خدمت 100 فیصد مفت ہے (0 روپے)",
    },
    {
      en: "Understanding facial verification rules, lighting, and camera choice",
      ur: "چہرے کی تصویر کے اصول، سیدھ اور روشنی کی پابندی سمجھنا",
    },
    {
      en: "Understanding contactless fingerprint positioning using camera",
      ur: "کیمرے کے ذریعے فنگر پرنٹ کا فاصلہ اور پوزیشننگ سمجھنا",
    },
    {
      en: "Reviewing details and completing practice application submission",
      ur: "تفصیلات کی جانچ اور مشق درخواست کامیابی سے جمع کروانا",
    },
    {
      en: "Finding your POLC certificate inside ID Vault / My Documents",
      ur: "آئی ڈی والٹ میں 'میرے دستاویزات' سے سرٹیفیکیٹ تک رسائی",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border-2 border-emerald-300 bg-white p-6 shadow-xl sm:p-10">
      {/* Celebration Header */}
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-md">
          <Trophy className="h-10 w-10 text-emerald-700" />
        </div>

        <h1 className="mt-4 text-2xl font-black text-slate-900 sm:text-3xl">
          {ur
            ? "بہت خوب! آپ نے زندگی کے ثبوت کا پورا عمل سیکھ لیا ہے۔"
            : "Well Done! You've Practised the Proof-of-Life Process."}
        </h1>
        <p className="mt-2 text-base text-slate-600">
          {ur
            ? "آپ نے پاک آئی ڈی پر سرٹیفیکیٹ برائے حیات حاصل کرنے کے تمام بنیادی مراحل کامیابی سے مکمل کر لیے ہیں۔"
            : "You have successfully navigated each step of the official PakID pension verification journey."}
        </p>
      </div>

      {/* Summary Scoreboard */}
      <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 text-center">
        <div>
          <span className="text-xs font-semibold text-slate-500">
            {ur ? "طریقہ کار" : "Mode"}
          </span>
          <p className="mt-0.5 text-sm font-extrabold text-emerald-950">
            {isGuided
              ? ur
                ? "رہنمائی کے ساتھ"
                : "Guided"
              : ur
              ? "خود مشق"
              : "Independent"}
          </p>
        </div>
        <div className="border-x border-emerald-200">
          <span className="text-xs font-semibold text-slate-500">
            {ur ? "غلطیاں" : "Mistakes"}
          </span>
          <p className="mt-0.5 text-base font-extrabold text-slate-800">
            {mistakesCount}
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-500">
            {ur ? "مدد استعمال کی" : "Hints Used"}
          </span>
          <p className="mt-0.5 text-base font-extrabold text-slate-800">
            {hintsUsed}
          </p>
        </div>
      </div>

      {/* Completed Learning Objectives */}
      <div className="mt-6">
        <h2 className="text-base font-bold text-slate-900">
          {ur ? "سیکھے گئے اہم مقاصد:" : "Learning Objectives Mastered:"}
        </h2>
        <ul className="mt-3 space-y-2.5">
          {objectives.map((obj, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm sm:text-base text-slate-700"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <span>{ur ? obj.ur : obj.en}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Official Disclaimer Box */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs sm:text-sm text-amber-950">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <p className="leading-relaxed">
          {ur
            ? "اہم یاد دہانی: ٹیک ساتھی سرکاری سرٹیفیکیٹ جاری نہیں کرتا۔ یہ صرف بزرگ شہریوں کے لیے ایک تعلیمی مشق ہے۔ اصل کارروائی صرف نادرا پاک آئی ڈی ایپ یا نادرا مراکز سے مکمل ہوتی ہے۔"
            : "Official Notice: TechSaathi does not issue Proof-of-Life Certificates. This application is an educational simulation for practice. Complete the actual process through official NADRA services."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onRestart}
          className="flex min-h-[50px] items-center justify-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-4 py-2.5 text-base font-bold text-slate-700 transition hover:bg-slate-50 active:scale-95"
        >
          <RotateCcw className="h-5 w-5" />
          <span>{ur ? "دوبارہ مشق کریں" : "Try Again"}</span>
        </button>

        {isGuided && (
          <button
            type="button"
            onClick={onTryIndependent}
            className="flex min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2.5 text-base font-bold text-white shadow-md transition hover:bg-emerald-800 active:scale-95"
          >
            <Smartphone className="h-5 w-5" />
            <span>{ur ? "بغیر مدد کے آزمائیں" : "Practise Without Help"}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onBackHome}
          className="flex min-h-[50px] items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-base font-bold text-slate-700 transition hover:bg-slate-50 active:scale-95"
        >
          <span>{ur ? "مرکزی صفحہ پر جائیں" : "Back to Dashboard"}</span>
        </button>

        <a
          href="https://www.nadra.gov.pk/media-release/nadra-makes-proof-of-life-certificate-free-and-widely-accessible-for-pensioners-0932f9ba"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[50px] items-center justify-center gap-2 rounded-2xl border border-emerald-600 bg-emerald-50 px-4 py-2.5 text-base font-bold text-emerald-900 transition hover:bg-emerald-100"
        >
          <span>{ur ? "نادرا کی آفیشل ویب سائٹ" : "Official NADRA Website"}</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
