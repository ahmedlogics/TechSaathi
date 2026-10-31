import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  FileText,
  Fingerprint,
  FolderOpen,
  Hand,
  Info,
  Lock,
  QrCode,
  Search,
  Shield,
  Smartphone,
  User,
  X,
} from "lucide-react";
import type { FingerOption, PakIDApplicant, PakIDScreenId } from "./types";
import { photoSamples } from "./pakidPracticeData";
import { NadraLogo } from "@/components/icons/NadraLogo";

interface PakIDPhoneSimulatorProps {
  screen: PakIDScreenId;
  isGuided: boolean;
  hintVisible: boolean;
  onAction: (action: string) => void;
  onWrongAction: (message: { en: string; ur: string }) => void;
  ur: boolean;
}

export function PakIDPhoneSimulator({
  screen,
  isGuided,
  hintVisible,
  onAction,
  onWrongAction,
  ur,
}: PakIDPhoneSimulatorProps) {
  // Screen-local state
  const [applicant, setApplicant] = useState<PakIDApplicant>("myself");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoFeedback, setPhotoFeedback] = useState<string | null>(null);
  const [cameraMode, setCameraMode] = useState<"front" | "back">("front");
  const [isFaceScanning, setIsFaceScanning] = useState(false);
  const [faceScanSuccess, setFaceScanSuccess] = useState(false);
  const [selectedFinger, setSelectedFinger] = useState<FingerOption>("left-hand");
  const [fingerDistance, setFingerDistance] = useState(50); // 50 is sweet spot
  const [fingerprintDone, setFingerprintDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Helper for wrong action feedback
  const handleWrong = (itemLabel: string, expectedItem: string) => {
    onWrongAction({
      en: `You tapped '${itemLabel}'. For this lesson, please select '${expectedItem}'.`,
      ur: `آپ نے '${itemLabel}' کو دبایا۔ اس مشق کے لیے برائے کرم '${expectedItem}' منتخب کریں۔`,
    });
  };

  return (
    <div className="relative mx-auto flex h-[780px] w-full max-w-[390px] flex-col overflow-hidden rounded-[38px] border-[8px] border-slate-800 bg-emerald-50/40 shadow-2xl transition-all">
      {/* Top Phone Notch / Speaker */}
      <div className="relative z-30 flex h-7 w-full shrink-0 items-center justify-between bg-slate-900 px-6 text-[11px] font-semibold text-white">
        <span>9:41</span>
        <div className="h-3.5 w-20 rounded-full bg-slate-950"></div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]">5G</span>
          <div className="h-2.5 w-4 rounded-sm border border-white p-0.5">
            <div className="h-full w-full bg-white"></div>
          </div>
        </div>
      </div>

      {/* Persistent Educational Header Banner */}
      <div className="z-20 bg-emerald-800 px-3 py-1 text-center text-[11px] font-medium text-emerald-100">
        {ur
          ? "تعلیمی مشق • کوئی اصل کیمرہ یا بائیو میٹرک استعمال نہیں ہوتا"
          : "Educational Simulation • No real camera or biometrics used"}
      </div>

      {/* Scrollable Virtual Screen Content */}
      <div className="relative flex-1 overflow-y-auto bg-slate-50 text-slate-800">
        {/* ========================================================================= */}
        {/* SCREEN 1: LOGIN                                                          */}
        {/* ========================================================================= */}
        {screen === "login" && (
          <div className="flex min-h-full flex-col justify-between p-5">
            <div className="pt-2 text-center">
              <NadraLogo className="mx-auto h-20 w-20 drop-shadow-md" />
              <h1 className="mt-2 text-2xl font-black tracking-tight text-emerald-950">
                Pak<span className="text-emerald-700">ID</span>
              </h1>
              <p className="text-xs font-bold text-emerald-800">
                {ur ? "حکومتِ پاکستان • نادرا کی سرکاری ایپ" : "Government of Pakistan • Official NADRA App"}
              </p>
              <div className="mt-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2 text-[12px] text-emerald-950 shadow-sm">
                <p className="font-bold">{ur ? "شناختی خدمات اور سرٹیفیکیٹ برائے حیات" : "NADRA Identity & Life Attestation"}</p>
                <p className="text-[11px] text-emerald-800">
                  {ur ? "CNIC, NICOP, POC, FRC اور پنشنرز تصدیق" : "CNIC, NICOP, POC, FRC & Pension Verification"}
                </p>
              </div>
            </div>

            <div className="my-auto space-y-3 pt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600">
                  {ur ? "ای میل یا شناختی کارڈ نمبر" : "Email or CNIC Number"}
                </label>
                <div className="mt-1 flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm">
                  <User className="mr-2 h-4 w-4 text-emerald-700" />
                  <span className="font-mono text-slate-800 font-semibold">35201-1234567-1 (Aamir Nazir)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">
                  {ur ? "پاس ورڈ" : "Password"}
                </label>
                <div className="mt-1 flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm">
                  <Lock className="mr-2 h-4 w-4 text-slate-400" />
                  <span className="font-mono text-slate-500">••••••••••••</span>
                </div>
              </div>

              <div className="flex justify-between text-xs text-emerald-700">
                <button
                  type="button"
                  onClick={() =>
                    handleWrong(ur ? "پاس ورڈ بھول گئے" : "Forgot Password", ur ? "لاگ اِن" : "Login")
                  }
                  className="hover:underline font-semibold"
                >
                  Forgot Password (پاس ورڈ یاد نہیں)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onAction("login")}
                  className={`flex flex-1 min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-emerald-700 text-base font-bold text-white shadow-lg transition-all hover:bg-emerald-800 active:scale-95 ${
                    isGuided || hintVisible
                      ? "ring-4 ring-emerald-400 ring-offset-2 animate-pulse"
                      : ""
                  }`}
                >
                  <span>Login (لاگ اِن)</span>
                  <ChevronRight className="h-5 w-5 rtl:rotate-180" />
                </button>

                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border-2 border-emerald-700 bg-emerald-50 text-emerald-800 shadow-sm" title="Biometric Login">
                  <Fingerprint className="h-6 w-6" />
                </div>
              </div>

              <div className="text-center text-xs text-slate-500">
                <span>New to Pak ID? </span>
                <button
                  type="button"
                  onClick={() =>
                    handleWrong(ur ? "رجسٹر کریں" : "Register here", ur ? "لاگ اِن" : "Login")
                  }
                  className="font-bold text-emerald-700 hover:underline"
                >
                  Register here.
                </button>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <div className="grid grid-cols-4 gap-1 text-center text-[10px] text-slate-600">
                <div className="rounded p-1 hover:bg-slate-100">
                  <Info className="mx-auto h-4 w-4 text-emerald-700" />
                  <span>Guidelines</span>
                </div>
                <div className="rounded p-1 hover:bg-slate-100">
                  <Shield className="mx-auto h-4 w-4 text-emerald-700" />
                  <span>Centers</span>
                </div>
                <div className="rounded p-1 hover:bg-slate-100">
                  <FileText className="mx-auto h-4 w-4 text-emerald-700" />
                  <span>FAQ&apos;s</span>
                </div>
                <div className="rounded p-1 hover:bg-slate-100">
                  <Smartphone className="mx-auto h-4 w-4 text-emerald-700" />
                  <span>Chat</span>
                </div>
              </div>
              <p className="mt-2 text-center text-[10px] text-slate-400">
                Educational Practice • TechSaathi
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: DASHBOARD                                                      */}
        {/* ========================================================================= */}
        {screen === "dashboard" && (
          <div className="flex flex-col pb-16">
            {/* Top Dashboard Green Header matching 2.jpeg */}
            <div className="bg-emerald-900 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 font-bold text-white">
                    Pak
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-300">Welcome (خوش آمدید)</p>
                    <p className="text-sm font-bold">Aamir Nazir (Pensioner)</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleWrong("Logout", "Proof of Life")}
                  className="rounded border border-emerald-700 px-2 py-1 text-[11px] text-emerald-200"
                >
                  Logout
                </button>
              </div>

              {/* Search Bar */}
              <div className="mt-3 flex items-center rounded-xl bg-white/95 px-3 py-2 text-xs text-slate-700 shadow-inner">
                <Search className="mr-2 h-4 w-4 text-slate-400" />
                <span>Search here.. (یہاں تلاش کریں)</span>
              </div>
            </div>

            {/* Quick Applications Grid */}
            <div className="p-3">
              <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Applications (درخواستیں)</span>
                <span className="text-[11px] font-normal text-emerald-700">View All</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <button
                  type="button"
                  onClick={() => handleWrong("Under Process", "Proof of Life")}
                  className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition hover:border-emerald-500"
                >
                  <FileText className="mx-auto h-5 w-5 text-emerald-700" />
                  <p className="mt-1 font-semibold leading-tight">Under Process</p>
                  <p className="text-[9px] text-slate-400">زیرِ عمل</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleWrong("Completed Applications", "Proof of Life")}
                  className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition hover:border-emerald-500"
                >
                  <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-700" />
                  <p className="mt-1 font-semibold leading-tight">Completed</p>
                  <p className="text-[9px] text-slate-400">مکمل</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleWrong("Tracking", "Proof of Life")}
                  className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition hover:border-emerald-500"
                >
                  <QrCode className="mx-auto h-5 w-5 text-emerald-700" />
                  <p className="mt-1 font-semibold leading-tight">Tracking</p>
                  <p className="text-[9px] text-slate-400">ٹریکنگ</p>
                </button>
              </div>
            </div>

            {/* BIOMETRIC ATTESTATION CATEGORY (Matching 3.jpeg) */}
            <div className="mt-1 border-t border-slate-200 bg-emerald-50/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black text-emerald-950">
                    Biometric Attestation (بائیو میٹرک تصدیق)
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Services for pensioner life verification &amp; attestation
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* TARGET: PROOF OF LIFE */}
                <button
                  type="button"
                  onClick={() => onAction("choose-polc")}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 bg-white p-4 text-center shadow-md transition-all active:scale-95 ${
                    isGuided || hintVisible
                      ? "border-emerald-600 bg-emerald-50 ring-4 ring-emerald-400/50"
                      : "border-emerald-300 hover:border-emerald-500 hover:shadow-lg"
                  }`}
                >
                  <div className="relative mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-inner">
                    <FileCheck2 className="h-8 w-8" />
                    <span className="absolute -top-1.5 -right-1.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[8px] font-black text-slate-900 shadow">
                      VERIFY POL
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-950">
                    Proof of Life
                  </span>
                  <span className="mt-0.5 text-[11px] font-medium text-emerald-700">
                    سرٹیفیکیٹ برائے حیات
                  </span>
                  <span className="mt-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    FREE (مفت)
                  </span>
                </button>

                {/* NON-FUNCTIONAL DECOY: Attestation */}
                <button
                  type="button"
                  onClick={() =>
                    handleWrong(ur ? "عام تصدیق" : "General Attestation", "Proof of Life")
                  }
                  className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:border-slate-300"
                >
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                    <Fingerprint className="h-7 w-7 text-emerald-700" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">Attestation</span>
                  <span className="text-[10px] text-slate-400">تصدیق</span>
                </button>

                {/* NON-FUNCTIONAL DECOY: Succession */}
                <button
                  type="button"
                  onClick={() => handleWrong(ur ? "جانشینی" : "Succession", "Proof of Life")}
                  className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm transition hover:border-slate-300"
                >
                  <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <FileText className="h-5 w-5 text-emerald-700" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">Succession</span>
                  <span className="text-[10px] text-slate-400">جانشینی</span>
                </button>

                {/* NON-FUNCTIONAL DECOY: Passport */}
                <button
                  type="button"
                  onClick={() => handleWrong(ur ? "پاسپورٹ" : "Passport", "Proof of Life")}
                  className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm transition hover:border-slate-300"
                >
                  <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <FolderOpen className="h-5 w-5 text-emerald-700" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">Passport</span>
                  <span className="text-[10px] text-slate-400">پاسپورٹ</span>
                </button>
              </div>
            </div>

            {/* Bottom Fixed Navigation Bar matching 2.jpeg/3.jpeg */}
            <div className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-slate-200 bg-white py-1.5 shadow-md">
              <button
                type="button"
                className="flex flex-1 flex-col items-center text-emerald-700"
              >
                <Smartphone className="h-5 w-5" />
                <span className="text-[10px] font-bold">Home</span>
              </button>
              <button
                type="button"
                onClick={() => handleWrong("ID Vault", "Proof of Life")}
                className="flex flex-1 flex-col items-center text-slate-500 hover:text-emerald-700"
              >
                <FolderOpen className="h-5 w-5" />
                <span className="text-[10px]">ID Vault</span>
              </button>
              <button
                type="button"
                onClick={() => handleWrong("Complaints", "Proof of Life")}
                className="flex flex-1 flex-col items-center text-slate-500 hover:text-emerald-700"
              >
                <Info className="h-5 w-5" />
                <span className="text-[10px]">Complaints</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: APPLICANT SELECTION                                            */}
        {/* ========================================================================= */}
        {screen === "applicant" && (
          <div className="flex min-h-full flex-col justify-between p-4">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <button
                  type="button"
                  onClick={() => onAction("back-to-dashboard")}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-800"
                >
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                  <span>Back (واپس)</span>
                </button>
                <h2 className="flex-1 text-center text-sm font-extrabold text-slate-800">
                  New Application (نئی درخواست)
                </h2>
              </div>

              <div className="mt-4">
                <h3 className="text-base font-extrabold text-slate-900">
                  Start New Application For
                </h3>
                <p className="text-xs font-semibold text-emerald-800">
                  (نئی درخواست شروع کریں)
                </p>
              </div>

              {/* Radio Choices matching 4.jpeg */}
              <div className="mt-4 space-y-3">
                {/* Option 1: Myself */}
                <button
                  type="button"
                  onClick={() => setApplicant("myself")}
                  className={`w-full min-h-[56px] rounded-2xl border-2 p-4 text-start transition-all ${
                    applicant === "myself"
                      ? "border-emerald-600 bg-emerald-50/70 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                        applicant === "myself"
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {applicant === "myself" && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Myself (میں خود)</p>
                      <p className="text-xs text-slate-500">Apply for your own pension</p>
                    </div>
                  </div>
                </button>

                {/* Option 2: Blood Relatives */}
                <button
                  type="button"
                  onClick={() => setApplicant("relatives")}
                  className={`w-full min-h-[56px] rounded-2xl border-2 p-4 text-start transition-all ${
                    applicant === "relatives"
                      ? "border-emerald-600 bg-emerald-50/70 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                        applicant === "relatives"
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {applicant === "relatives" && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        My Blood Relatives (میرے خون کے رشتہ دار)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        (Parents or Siblings or Spouse or Minors)
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Explanatory text from official screen */}
              {applicant === "relatives" ? (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                  <p className="font-bold">
                    Important: Pensioner Participation Required
                  </p>
                  <p className="mt-1">
                    An eligible family member may assist through their own account, but
                    the pensioner must be physically present for facial and fingerprint
                    verification.
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-slate-100 p-3 text-[11px] text-slate-600">
                  <p>
                    An applicant can be either yourself (the account holder) or your
                    blood relatives.
                  </p>
                  <p className="mt-1 text-slate-500" dir="rtl">
                    درخواست گزار آپ خود یا آپ کے خون کے رشتہ دار ہو سکتے ہیں۔
                  </p>
                </div>
              )}
            </div>

            {/* Next Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => onAction("applicant-continue")}
                className={`flex w-full min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-emerald-700 text-base font-bold text-white shadow-lg transition-all hover:bg-emerald-800 active:scale-95 ${
                  isGuided || hintVisible ? "ring-4 ring-emerald-400" : ""
                }`}
              >
                <span>Next (آگے بڑھیں)</span>
                <ChevronRight className="h-5 w-5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: FEE & PRIORITY REVIEW                                          */}
        {/* ========================================================================= */}
        {screen === "fee" && (
          <div className="flex min-h-full flex-col justify-between p-4">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <button
                  type="button"
                  onClick={() => onAction("back-to-applicant")}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-800"
                >
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                  <span>Back (واپس)</span>
                </button>
                <h2 className="flex-1 text-center text-sm font-extrabold text-slate-800">
                  Processing &amp; Fee Details
                </h2>
              </div>

              <div className="mt-4">
                <p className="text-xs font-bold text-slate-600">
                  Application Processing Priority (درخواست کی پروسیسنگ کی ترجیح)
                </p>
                <div className="mt-2 flex items-center justify-between rounded-2xl border-2 border-emerald-500 bg-emerald-50/60 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-base font-extrabold text-emerald-950">
                        Executive (ایگزیکٹو)
                      </p>
                      <p className="text-xs text-emerald-700">Standard Fast-Track</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Fee Summary Table (matching 5.jpeg) */}
              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex justify-between border-b border-slate-100 p-3.5 text-xs font-bold">
                  <div>
                    <span>Application Fee</span>
                    <span className="block text-[10px] font-normal text-slate-400">
                      (درخواست فیس)
                    </span>
                  </div>
                  <span className="font-mono text-sm text-emerald-800">PKR 0</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 p-3.5 text-xs font-bold">
                  <div>
                    <span>Card Delivery Fee</span>
                    <span className="block text-[10px] font-normal text-slate-400">
                      (کارڈ کی ترسیل کی فیس)
                    </span>
                  </div>
                  <span className="font-mono text-sm text-emerald-800">PKR 0</span>
                </div>
                <div className="flex justify-between bg-emerald-50/60 p-3.5 text-sm font-black text-emerald-950">
                  <div>
                    <span>Payable Fee</span>
                    <span className="block text-[10px] font-normal text-emerald-700">
                      (قابلِ ادائیگی فیس)
                    </span>
                  </div>
                  <span className="font-mono text-base text-emerald-700">PKR 0</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-emerald-100 p-3 text-center text-xs font-bold text-emerald-900">
                <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-emerald-700" />
                Proof-of-Life is 100% Free for all pensioners in Pakistan.
              </div>
            </div>

            {/* Bottom Button matching 5.jpeg */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => onAction("fee-continue")}
                className={`w-full min-h-[54px] rounded-2xl bg-emerald-700 px-3 py-2 text-center text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-800 active:scale-95 ${
                  isGuided || hintVisible ? "ring-4 ring-emerald-400 animate-pulse" : ""
                }`}
              >
                <span>Please verify applicant&apos;s face liveliness.</span>
                <span className="block text-[11px] font-normal opacity-90">
                  (برائے کرم درخواست گزار کے چہرے کی تصدیق کریں)
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 5: BIOMETRIC ALERT MODAL                                          */}
        {/* ========================================================================= */}
        {screen === "biometric-alert" && (
          <div className="relative flex min-h-full items-center justify-center p-4">
            {/* Modal Box matching 6.jpeg */}
            <div className="w-full rounded-3xl border-2 border-emerald-600 bg-white p-6 text-center shadow-2xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-8 ring-blue-50/50">
                <Info className="h-9 w-9 text-blue-600" />
              </div>

              <h2 className="mt-4 text-xl font-black text-slate-900">Alert (اطلاع)</h2>

              <p className="mt-3 text-xs leading-relaxed text-slate-700">
                You will need to verify your identity using facial recognition. After the
                successful verification, you will be asked to verify fingerprint
                verification as well.
              </p>

              <p
                className="mt-3 text-xs leading-relaxed text-slate-700"
                dir="rtl"
              >
                آپ کو اپنی شناخت کی تصدیق کے لیے چہرے کی تصدیق کرنا ہوگی۔ چہرے کی تصدیق
                کامیابی سے مکمل ہونے کے بعد، آپ سے انگلیوں کے نشانات کے ذریعے مزید تصدیق
                کرنے کو کہا جائے گا۔
              </p>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => onAction("alert-proceed")}
                  className={`w-full min-h-[50px] rounded-2xl bg-emerald-700 text-base font-bold text-white shadow-lg transition-all hover:bg-emerald-800 active:scale-95 ${
                    isGuided || hintVisible ? "ring-4 ring-emerald-400 animate-pulse" : ""
                  }`}
                >
                  Proceed (آگے بڑھیں)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 6: PREPARE FOR FACIAL VERIFICATION                                 */}
        {/* ========================================================================= */}
        {screen === "face-prepare" && (
          <div className="flex min-h-full flex-col justify-between p-4">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  type="button"
                  onClick={() => onAction("back-to-fee")}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-800"
                >
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                  <span>Back (واپس)</span>
                </button>
                <h2 className="flex-1 text-center text-xs font-extrabold text-slate-700">
                  (چہرے کی لائیو نس)
                </h2>
              </div>

              <div className="mt-3 text-center">
                <p className="text-xs font-bold text-slate-900">
                  Which camera would you like to use to take a photo?
                </p>
                <p className="text-[11px] text-emerald-800">
                  (آپ کون سے کیمرے کا استعمال کرنا چاہتے ہیں؟)
                </p>
              </div>

              {/* Guidelines matching 8.jpeg */}
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
                  <span>Find a well lit place (روشن جگہ تلاش کریں)</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
                  <span>Ensure your face is within the frame (چہرہ فریم میں رکھیں)</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-rose-900">
                  <X className="h-4 w-4 shrink-0 text-rose-700" />
                  <span>Don&apos;t wear hats, glasses &amp; masks (ٹوپی یا عینک نہ پہنیں)</span>
                </div>
              </div>

              {/* Sample Photo Selection Test */}
              <div className="mt-4">
                <p className="text-xs font-bold text-slate-800">
                  Photo capture sample images — Tap the correct example:
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {photoSamples.map((s) => {
                    const isSelected = selectedPhoto === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSelectedPhoto(s.id);
                          setPhotoFeedback(ur ? s.statusText.ur : s.statusText.en);
                          if (!s.isCorrect) {
                            onWrongAction(s.statusText);
                          }
                        }}
                        className={`flex flex-col items-center rounded-2xl border-2 p-2.5 text-center transition-all ${
                          isSelected
                            ? s.isCorrect
                              ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-400"
                              : "border-rose-500 bg-rose-50"
                            : s.isCorrect && (isGuided || hintVisible)
                            ? "border-emerald-400 bg-emerald-50/50 animate-pulse"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                            s.isCorrect
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          <User className="h-7 w-7" />
                        </div>
                        <span
                          className={`mt-1 text-[11px] font-black ${
                            s.isCorrect ? "text-emerald-800" : "text-rose-700"
                          }`}
                        >
                          {ur ? s.label.ur : s.label.en}
                        </span>
                        <span className="text-[9px] text-slate-500 leading-tight">
                          {ur ? s.explanation.ur : s.explanation.en}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {photoFeedback && (
                  <div
                    className={`mt-2 rounded-xl p-2.5 text-center text-xs font-bold ${
                      selectedPhoto === "correct"
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-rose-100 text-rose-900"
                    }`}
                  >
                    {photoFeedback}
                  </div>
                )}
              </div>
            </div>

            {/* Camera Options Buttons matching 8.jpeg */}
            <div className="pt-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCameraMode("front");
                    onAction("face-photo-chosen");
                  }}
                  className={`flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl bg-emerald-700 p-2 text-xs font-bold text-white shadow transition hover:bg-emerald-800 ${
                    selectedPhoto === "correct" && (isGuided || hintVisible)
                      ? "ring-4 ring-emerald-400 animate-pulse"
                      : ""
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  <span>Front Camera</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCameraMode("back");
                    onAction("face-photo-chosen");
                  }}
                  className="flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl bg-emerald-800 p-2 text-xs font-bold text-white shadow transition hover:bg-emerald-900"
                >
                  <Camera className="h-4 w-4" />
                  <span>Back Camera</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 7: SIMULATED FACIAL VERIFICATION                                   */}
        {/* ========================================================================= */}
        {screen === "face-capture" && (
          <div className="relative flex min-h-full flex-col justify-between bg-slate-900 p-4 text-white">
            <div className="text-center">
              <p className="text-xs font-bold text-emerald-400">
                Facial Liveliness Practice ({cameraMode === "front" ? "Front" : "Back"})
              </p>
              <p className="text-[10px] text-slate-400">
                Safe practice — device camera is not enabled
              </p>
            </div>

            {/* Viewfinder oval matching 7.jpeg */}
            <div className="my-auto flex flex-col items-center justify-center">
              <div
                className={`relative flex h-60 w-44 items-center justify-center rounded-[90px] border-4 transition-all duration-700 ${
                  faceScanSuccess
                    ? "border-emerald-400 bg-emerald-950/40 ring-8 ring-emerald-500/30"
                    : isFaceScanning
                    ? "border-amber-400 bg-amber-950/30 animate-pulse"
                    : "border-slate-600 bg-slate-800/60"
                }`}
              >
                <User
                  className={`h-36 w-36 transition-colors duration-500 ${
                    faceScanSuccess
                      ? "text-emerald-400"
                      : isFaceScanning
                      ? "text-amber-300"
                      : "text-slate-400"
                  }`}
                />

                {isFaceScanning && (
                  <div className="absolute inset-x-0 top-1/2 h-1 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,1)] animate-bounce"></div>
                )}
              </div>

              <p className="mt-3 text-xs font-semibold text-slate-300">
                {faceScanSuccess
                  ? "✓ Face positioning verified"
                  : isFaceScanning
                  ? "Aligning face and checking liveliness..."
                  : "Keep face inside the oval guide"}
              </p>
            </div>

            {/* Action or Success Popup matching 7.jpeg */}
            <div>
              {!faceScanSuccess ? (
                <button
                  type="button"
                  disabled={isFaceScanning}
                  onClick={() => {
                    setIsFaceScanning(true);
                    setTimeout(() => {
                      setIsFaceScanning(false);
                      setFaceScanSuccess(true);
                    }, 1500);
                  }}
                  className={`w-full min-h-[50px] rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700 ${
                    isGuided || hintVisible ? "ring-4 ring-emerald-400 animate-pulse" : ""
                  }`}
                >
                  {isFaceScanning
                    ? "Checking positioning..."
                    : "Start Face Positioning Exercise"}
                </button>
              ) : (
                /* Success Modal matching 7.jpeg */
                <div className="rounded-2xl border border-emerald-500 bg-white p-4 text-center text-slate-900 shadow-xl animate-in zoom-in-95">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                  <h3 className="mt-2 text-base font-black text-slate-900">Success!</h3>
                  <p className="text-xs font-bold text-slate-700">
                    Applicant Facial is Verified
                  </p>
                  <p className="text-[10px] text-slate-500">
                    (چہرے کی تصدیقی مشق مکمل ہو گئی)
                  </p>
                  <button
                    type="button"
                    onClick={() => onAction("face-success-continue")}
                    className="mt-3 w-full min-h-[44px] rounded-xl bg-emerald-700 text-sm font-bold text-white transition hover:bg-emerald-800"
                  >
                    Continue (جاری رکھیں)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 8: FINGERPRINT POSITIONING                                         */}
        {/* ========================================================================= */}
        {screen === "fingerprints" && (
          <div className="flex min-h-full flex-col justify-between bg-slate-950 p-4 text-white">
            <div className="text-center">
              <h2 className="text-sm font-black text-emerald-400">
                Verify Fingerprints (انگلیوں کے نشانات کی تصدیق کریں)
              </h2>
              <p className="text-[10px] text-slate-400">
                (تقریباً ۳۰ سے ۹۰ سیکنڈز لگیں گے)
              </p>
            </div>

            {/* Hand Guide matching 9.jpeg */}
            <div className="relative my-auto flex h-64 w-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 p-3">
              {/* Distance meter bar on left */}
              <div className="absolute left-2 top-4 bottom-4 flex w-10 flex-col items-center justify-between rounded-lg bg-black/60 p-1 text-[8px] text-slate-400">
                <span>TOO FAR</span>
                <div className="relative flex h-32 w-2 flex-col justify-between rounded-full bg-slate-700">
                  <div
                    className="absolute h-3 w-3 -left-0.5 rounded-full bg-emerald-400 shadow transition-all duration-300"
                    style={{ top: `${fingerDistance}%` }}
                  ></div>
                </div>
                <span>TOO CLOSE</span>
              </div>

              {/* Hand Outline */}
              <div className="flex flex-col items-center text-center">
                <Hand
                  className={`h-36 w-36 transition-all duration-300 ${
                    fingerprintDone
                      ? "text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                      : "text-slate-400"
                  }`}
                />
                <span className="mt-2 text-xs font-semibold text-emerald-300">
                  {fingerprintDone
                    ? "✓ Fingerprints aligned properly"
                    : "Place 4 fingers flat within frame"}
                </span>
              </div>
            </div>

            {/* Hand selector buttons matching 9.jpeg */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(
                  [
                    { id: "left-hand", en: "Left Hand", ur: "بایاں ہاتھ" },
                    { id: "right-hand", en: "Right Hand", ur: "دایاں ہاتھ" },
                    { id: "left-thumb", en: "Left Thumb", ur: "بایاں انگوٹھا" },
                    { id: "right-thumb", en: "Right Thumb", ur: "دایاں انگوٹھا" },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setSelectedFinger(f.id);
                      setFingerDistance(45); // move into optimal range
                    }}
                    className={`flex items-center gap-2 rounded-xl border p-2 text-start transition ${
                      selectedFinger === f.id
                        ? "border-emerald-500 bg-emerald-900/60 text-white"
                        : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <Hand className="h-4 w-4 shrink-0 text-emerald-400" />
                    <div>
                      <p className="font-bold">{f.en}</p>
                      <p className="text-[10px] text-slate-400">{f.ur}</p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setFingerprintDone(true);
                  setTimeout(() => {
                    onAction("fingerprint-continue");
                  }, 800);
                }}
                className={`w-full min-h-[50px] rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700 ${
                  isGuided || hintVisible ? "ring-4 ring-emerald-400 animate-pulse" : ""
                }`}
              >
                {fingerprintDone
                  ? "✓ Practice Completed — Proceeding..."
                  : "Complete Fingerprint Practice (مشق مکمل کریں)"}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 9: APPLICATION REVIEW & SUBMISSION                                */}
        {/* ========================================================================= */}
        {screen === "review-submission" && (
          <div className="flex min-h-full flex-col justify-between p-4">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  Educational Training Screen
                </span>
                <h2 className="flex-1 text-center text-xs font-bold text-slate-800">
                  Review &amp; Submit
                </h2>
              </div>

              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-2.5 text-xs">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Service (خدمت):</span>
                  <span className="font-bold text-emerald-900">
                    Proof of Life (سرٹیفیکیٹ برائے حیات)
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-bold text-slate-800">
                    Aamir Nazir (Myself)
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Priority:</span>
                  <span className="font-bold text-slate-800">Executive</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Fee:</span>
                  <span className="font-bold text-emerald-700">PKR 0 (Free)</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Facial Liveliness:</span>
                  <span className="font-bold text-emerald-700">✓ Completed (مکمل)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fingerprints:</span>
                  <span className="font-bold text-emerald-700">✓ Completed (مکمل)</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-center text-xs font-semibold text-emerald-950">
                <Shield className="mx-auto mb-1 h-5 w-5 text-emerald-700" />
                This is a practice submission. No real data is sent to NADRA.
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  setSubmitting(true);
                  setTimeout(() => {
                    setSubmitting(false);
                    onAction("submit-practice-app");
                  }, 800);
                }}
                className={`w-full min-h-[52px] rounded-2xl bg-emerald-700 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-800 active:scale-95 ${
                  isGuided || hintVisible ? "ring-4 ring-emerald-400 animate-pulse" : ""
                }`}
              >
                {submitting
                  ? "Submitting practice application..."
                  : "Submit Practice Application (مشق جمع کروائیں)"}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 10: APPLICATION SUBMITTED                                         */}
        {/* ========================================================================= */}
        {screen === "submitted" && (
          <div className="flex min-h-full flex-col justify-between p-5 text-center">
            <div className="my-auto">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-md">
                <FileCheck2 className="h-12 w-12" />
              </div>

              <h2 className="mt-4 text-xl font-black text-slate-900">
                Application Submitted Successfully
              </h2>
              <p className="text-xs font-semibold text-emerald-800">
                (درخواست کامیابی کے ساتھ جمع ہو گئی)
              </p>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                <p className="text-[11px] text-slate-500">
                  Tracking ID (ٹریکنگ آئی ڈی)
                </p>
                <p className="mt-0.5 font-mono text-base font-extrabold text-emerald-900">
                  DEMO-POLC-001
                </p>
                <p className="mt-1 text-[10px] text-slate-400">
                  Educational Practice Reference (غیر سرکاری مشق)
                </p>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-600">
                Your practice submission is complete. In the real app, your receipt and
                processed certificate appear in <strong>ID Vault</strong>.
              </p>
            </div>

            {/* Go to ID Vault Button matching 10.jpeg */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => onAction("goto-id-vault")}
                className={`w-full min-h-[52px] rounded-2xl bg-emerald-700 text-base font-bold text-white shadow-lg transition hover:bg-emerald-800 active:scale-95 ${
                  isGuided || hintVisible ? "ring-4 ring-emerald-400 animate-pulse" : ""
                }`}
              >
                Go to ID Vault (آئی ڈی والٹ پر جائیں)
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 11: ID VAULT                                                      */}
        {/* ========================================================================= */}
        {screen === "id-vault" && (
          <div className="flex min-h-full flex-col justify-between p-4">
            <div>
              {/* Top Banner matching 11.jpeg */}
              <div className="rounded-2xl bg-emerald-100 p-4 text-center text-emerald-950">
                <h2 className="text-base font-black">Apply for your Digital ID</h2>
                <p className="text-xs font-semibold text-emerald-800">
                  (اپنے ڈیجیٹل شناختی کارڈ کے لیے درخواست دیں)
                </p>
                <p className="mt-1 text-[11px] text-emerald-700">
                  Access services faster with your Digital ID, securely stored on your
                  device.
                </p>
              </div>

              {/* Two Tiles matching 11.jpeg */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {/* Tile 1: Digital Card */}
                <button
                  type="button"
                  onClick={() => handleWrong("Digital Card", "My Documents")}
                  className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm hover:border-slate-300"
                >
                  <Shield className="h-10 w-10 text-emerald-700" />
                  <span className="mt-2 text-xs font-bold text-slate-800">
                    Digital Card
                  </span>
                  <span className="text-[10px] text-slate-400">ڈیجیٹل کارڈ</span>
                </button>

                {/* Tile 2: My Documents (TARGET) */}
                <button
                  type="button"
                  onClick={() => onAction("open-my-documents")}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 bg-white p-5 text-center shadow-md transition-all active:scale-95 ${
                    isGuided || hintVisible
                      ? "border-emerald-600 bg-emerald-50 ring-4 ring-emerald-400/50"
                      : "border-emerald-300 hover:border-emerald-500"
                  }`}
                >
                  <FolderOpen className="h-10 w-10 text-emerald-700" />
                  <span className="mt-2 text-xs font-black text-emerald-950">
                    My Documents
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700">
                    میرے دستاویزات
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom navbar */}
            <div className="border-t border-slate-200 bg-white py-2">
              <div className="flex justify-around text-xs text-slate-600">
                <span>Home</span>
                <span className="font-bold text-emerald-700">ID Vault (آئی ڈی والٹ)</span>
                <span>Complaints</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 12: MY DOCUMENTS (POLC Card Selection)                             */}
        {/* ========================================================================= */}
        {screen === "my-documents" && (
          <div className="flex min-h-full flex-col justify-between p-4">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  type="button"
                  onClick={() => onAction("back-to-vault")}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-800"
                >
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                  <span>Back (واپس)</span>
                </button>
                <h2 className="flex-1 text-center text-xs font-black text-slate-800">
                  My Documents (میرے دستاویزات)
                </h2>
              </div>

              <p className="mt-3 text-center text-xs text-slate-600">
                Select your certificate category:
              </p>

              {/* Grid matching 12.jpeg */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                {/* Non-target: FRC */}
                <button
                  type="button"
                  onClick={() => handleWrong("FRC", "POLC")}
                  className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-3 text-center opacity-70 shadow-sm"
                >
                  <FileText className="h-8 w-8 text-slate-400" />
                  <span className="mt-1 text-xs font-bold text-slate-700">FRC</span>
                  <span className="text-[10px] text-slate-400">
                    خاندانی رجسٹریشن
                  </span>
                </button>

                {/* Non-target: ID Cancellation */}
                <button
                  type="button"
                  onClick={() => handleWrong("ID Cancellation", "POLC")}
                  className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-3 text-center opacity-70 shadow-sm"
                >
                  <FileText className="h-8 w-8 text-slate-400" />
                  <span className="mt-1 text-xs font-bold text-slate-700">
                    ID Cancellation
                  </span>
                  <span className="text-[10px] text-slate-400">کارڈ منسوخی</span>
                </button>

                {/* TARGET: POLC CARD matching 12.jpeg */}
                <button
                  type="button"
                  onClick={() => onAction("open-polc")}
                  className={`group relative flex flex-col items-center rounded-2xl border-2 bg-white p-4 text-center shadow-lg transition-all active:scale-95 ${
                    isGuided || hintVisible
                      ? "border-emerald-600 bg-emerald-50 ring-4 ring-emerald-400/50"
                      : "border-emerald-400 hover:border-emerald-600"
                  }`}
                >
                  <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md">
                    <FileCheck2 className="h-7 w-7" />
                  </div>
                  <span className="text-sm font-black text-emerald-950">POLC</span>
                  <span className="text-[11px] font-bold text-emerald-700">
                    سرٹیفیکیٹ برائے حیات
                  </span>
                  <span className="mt-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                    View Certificate
                  </span>
                </button>

                {/* Non-target: Vehicle Cards */}
                <button
                  type="button"
                  onClick={() => handleWrong("Vehicle Cards", "POLC")}
                  className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-3 text-center opacity-70 shadow-sm"
                >
                  <Shield className="h-8 w-8 text-slate-400" />
                  <span className="mt-1 text-xs font-bold text-slate-700">
                    Vehicle Cards
                  </span>
                  <span className="text-[10px] text-slate-400">گاڑی کے کارڈ</span>
                </button>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 text-center text-xs text-slate-400">
              POLC: Proof of Life Certificate
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 13: SIMULATED DOCUMENT VIEW                                       */}
        {/* ========================================================================= */}
        {screen === "document-view" && (
          <div className="flex min-h-full flex-col justify-between p-4">
            <div>
              <div className="rounded-2xl border-2 border-emerald-600 bg-white p-4 shadow-lg">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-5 w-5 text-emerald-700" />
                    <span className="text-xs font-black text-emerald-950">
                      NADRA PakID
                    </span>
                  </div>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Educational Preview
                  </span>
                </div>

                <div className="py-3 text-center">
                  <h3 className="text-sm font-black text-slate-900">
                    Proof-of-Life Certificate (POLC)
                  </h3>
                  <p className="text-xs font-semibold text-emerald-800">
                    (سرٹیفیکیٹ برائے حیات)
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 space-y-1.5 text-xs text-slate-700">
                  <p>
                    <strong className="text-slate-900">Applicant:</strong> Aamir Nazir
                  </p>
                  <p>
                    <strong className="text-slate-900">CNIC:</strong> 35201-XXXXXXX-X
                  </p>
                  <p>
                    <strong className="text-slate-900">Status:</strong> Active Pensioner
                  </p>
                  <p>
                    <strong className="text-slate-900">Valid For:</strong> Bank &amp; Pension
                    Verification
                  </p>
                </div>

                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[11px] text-amber-900">
                  <p className="font-bold">Educational Notice:</p>
                  <p>
                    In the real application, your official certificate with official QR
                    code will appear here once approved by NADRA.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => onAction("finish-lesson")}
                className={`w-full min-h-[52px] rounded-2xl bg-emerald-700 text-base font-bold text-white shadow-lg transition hover:bg-emerald-800 active:scale-95 ${
                  isGuided || hintVisible ? "ring-4 ring-emerald-400 animate-pulse" : ""
                }`}
              >
                Complete Lesson &amp; See Results (نتائج دیکھیں)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

