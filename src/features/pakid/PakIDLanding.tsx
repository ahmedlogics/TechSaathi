import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  ExternalLink,
  Hand,
  Info,
  Play,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { PageContainer } from "@/components/layout/AppHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { PakIDPictureTutorial } from "./PakIDPictureTutorial";
import { PakIDPractice } from "./PakIDPractice";
import { NadraLogo } from "@/components/icons/NadraLogo";

interface PakIDLandingProps {
  initialView?: "landing" | "tutorial" | "practice-guide" | "practice-independent";
}

export function PakIDLanding({ initialView = "landing" }: PakIDLandingProps) {
  const [view, setView] = useState<
    "landing" | "tutorial" | "practice-guide" | "practice-independent"
  >(initialView);
  const { lang, setLang, tr } = useLanguage();
  const ur = lang === "ur";
  const navigate = useNavigate();

  // If in tutorial view, render picture tutorial
  if (view === "tutorial") {
    return (
      <PageContainer>
        <PakIDPictureTutorial
          onBackToLanding={() => setView("landing")}
          onStartPractice={() => setView("practice-guide")}
        />
      </PageContainer>
    );
  }

  // If in practice view, render interactive practice
  if (view === "practice-guide" || view === "practice-independent") {
    return (
      <PageContainer>
        <PakIDPractice
          initialMode={view === "practice-guide" ? "guide" : "practice"}
          onBackToLanding={() => setView("landing")}
          onBackHome={() => navigate({ to: "/" })}
        />
      </PageContainer>
    );
  }

  const learnPoints = [
    {
      en: "How to open PakID and locate Proof of Life in Biometric Attestation",
      ur: "پاک آئی ڈی کھولنا اور بائیو میٹرک تصدیق میں سرٹیفیکیٹ برائے حیات تلاش کرنا",
    },
    {
      en: "Choosing the applicant and confirming the 100% free service (PKR 0)",
      ur: "درخواست گزار کا انتخاب اور یہ تسلی کرنا کہ یہ سروس بالکل مفت ہے (0 روپے)",
    },
    {
      en: "Facial recognition rules: good lighting and positioning within the guide",
      ur: "چہرے کی تصدیق کے اصول: اچھی روشنی اور فریم کے اندر سیدھا دیکھنا",
    },
    {
      en: "Contactless camera fingerprint scanning: distance meter and steady hold",
      ur: "کیمرے کے ذریعے فنگر پرنٹ کی پوزیشننگ اور فاصلے کا درست توازن",
    },
    {
      en: "Accessing and viewing your POLC certificate inside ID Vault / My Documents",
      ur: "آئی ڈی والٹ میں 'میرے دستاویزات' سے اپنے سرٹیفیکیٹ تک رسائی حاصل کرنا",
    },
  ];

  return (
    <PageContainer>
      {/* Top Navigation & Language Toggle */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/"
          className="btn btn-ghost -ms-3 flex items-center gap-2 text-base font-bold text-slate-700"
        >
          <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
          <span>{ur ? "مرکزی صفحہ پر واپس" : "Back to All Lessons"}</span>
        </Link>

        {/* Bilingual Language Switcher */}
        <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`min-h-[36px] rounded-xl px-3 py-1 text-xs font-bold transition ${
              !ur
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang("ur")}
            className={`min-h-[36px] rounded-xl px-3 py-1 text-xs font-bold transition font-urdu ${
              ur
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            اردو
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-4xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <NadraLogo className="h-16 w-16 shrink-0 drop-shadow-md" />
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 px-3.5 py-1 text-xs font-black text-emerald-900 shadow-sm">
              <span>NADRA PakID • Pension Verification (پنشنرز کے لیے)</span>
            </div>
            <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl lg:text-[2.6rem] leading-tight">
              {ur
                ? "زندگی کا ثبوت (سرٹیفیکیٹ برائے حیات) حاصل کرنا سیکھیں"
                : "Learn to Get Your Proof-of-Life Certificate"}
            </h1>
          </div>
        </div>

        <p className="mt-4 text-lg sm:text-xl font-medium leading-relaxed text-slate-700">
          {ur
            ? "تصاویر اور محفوظ مشق کے ذریعے پنشن کی تصدیق کے لیے پاک آئی ڈی ایپ استعمال کرنا سیکھیں۔"
            : "Learn how to use the PakID application for pension verification through pictures and safe practice."}
        </p>

        {/* Prominent Educational Notice */}
        <div className="mt-5 inline-flex items-center gap-2.5 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm sm:text-base font-bold text-amber-950 shadow-sm">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-700" />
          <span>
            {ur
              ? "یہ ایک تعلیمی مشق ہے۔ یہاں کوئی سرکاری تصدیق نہیں ہوتی۔"
              : "This is an educational simulation. No official verification takes place."}
          </span>
        </div>
      </div>

      {/* Two Large Cards: Mode A and Mode B */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {/* CARD 1 — Learn with Pictures */}
        <div className="flex flex-col justify-between rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-lg transition-all hover:border-emerald-500 hover:shadow-xl">
          <div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-sm">
              <BookOpen className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-2xl font-black text-slate-950 sm:text-3xl">
              {ur ? "تصاویر سے سمجھیں" : "Learn with Pictures"}
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              {ur
                ? "اصل پاک آئی ڈی ایپ کی تصاویر کے ساتھ مرحلہ وار رہنمائی دیکھیں۔"
                : "See the steps using pictures of the real application."}
            </p>
            <div className="mt-4 rounded-2xl bg-slate-50 p-3.5 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                {ur ? "اس میں شامل ہے:" : "Includes:"}
              </p>
              <p className="mt-0.5">
                {ur
                  ? "تمام 13 مراحل کے اصل اسکرین شاٹس اور اہم حصوں کی نشاندہی۔"
                  : "Authentic PakID screenshots, highlights, and clear visual annotations."}
              </p>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={() => setView("tutorial")}
              className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3 text-base font-bold text-white shadow-lg transition hover:bg-emerald-800 active:scale-95"
            >
              <span>{ur ? "تصویری ٹیوٹوریل شروع کریں" : "Start Picture Tutorial"}</span>
              <ArrowRight className="h-5 w-5 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* CARD 2 — Practise Yourself */}
        <div className="flex flex-col justify-between rounded-3xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50/50 to-white p-7 shadow-lg transition-all hover:shadow-xl ring-2 ring-emerald-500/20">
          <div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md">
              <Smartphone className="h-8 w-8" />
            </div>
            <div className="mt-2 inline-block rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-900">
              {ur ? "عملی مشق" : "Interactive Phone"}
            </div>
            <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
              {ur ? "خود مشق کریں" : "Practise Yourself"}
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              {ur
                ? "محفوظ ورچوئل فون پر تمام مراحل کی خود مشق کریں۔"
                : "Practise the steps on a safe virtual phone."}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 rounded-xl bg-white p-2.5 shadow-sm border border-emerald-100">
                <Compass className="h-4 w-4 text-emerald-700 shrink-0" />
                <span className="font-semibold text-slate-700">
                  {ur ? "رہنمائی کے ساتھ" : "Guided Help"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-white p-2.5 shadow-sm border border-emerald-100">
                <Hand className="h-4 w-4 text-slate-700 shrink-0" />
                <span className="font-semibold text-slate-700">
                  {ur ? "خود آزمائیں" : "Test Yourself"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-2">
            <button
              type="button"
              onClick={() => setView("practice-guide")}
              className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3 text-base font-bold text-white shadow-lg transition hover:bg-emerald-800 active:scale-95"
            >
              <span>{ur ? "مشق شروع کریں (رہنمائی والی)" : "Start Practice (Guided)"}</span>
              <ArrowRight className="h-5 w-5 rtl:rotate-180" />
            </button>

            <button
              type="button"
              onClick={() => setView("practice-independent")}
              className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-emerald-700 bg-white px-4 py-2 text-sm font-bold text-emerald-900 transition hover:bg-emerald-50 active:scale-95"
            >
              <span>{ur ? "بغیر مدد کے مشق کریں" : "Practise Without Help"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Option: Watch Official Video Tutorial */}
      <div className="mt-6">
        <a
          href="https://www.youtube.com/watch?v=078kiJV6w_M"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-red-500 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-sm transition group-hover:scale-105">
              <Play className="h-6 w-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-slate-900 group-hover:text-red-600 transition">
                  {ur ? "نادرا کی باضابطہ ویڈیو دیکھیں" : "Watch Official NADRA Video"}
                </span>
                <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-red-700">
                  YouTube
                </span>
              </div>
              <p className="mt-0.5 text-sm text-slate-600">
                {ur
                  ? "مزید رہنمائی کے لیے نادرا کی سرکاری ویڈیو دیکھیں۔"
                  : "Watch the official video for additional guidance."}
              </p>
            </div>
          </div>

          <span className="flex min-h-[48px] items-center gap-2 rounded-2xl border-2 border-slate-300 bg-slate-50 px-5 py-2.5 text-sm font-bold text-slate-800 transition group-hover:bg-red-50 group-hover:border-red-300 group-hover:text-red-700 shrink-0">
            <span>{ur ? "ویڈیو کھولیں" : "Open Video"}</span>
            <ExternalLink className="h-4 w-4" />
          </span>
        </a>
      </div>

      {/* You Will Learn Section */}
      <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 sm:text-2xl">
          {ur ? "آپ اس سبق میں کیا سیکھیں گے:" : "What You Will Learn in this Module:"}
        </h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {learnPoints.map((pt, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-base text-slate-800"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                <Check className="h-4 w-4" />
              </span>
              <span className="leading-snug">{ur ? pt.ur : pt.en}</span>
            </li>
          ))}
        </ul>
      </div>
    </PageContainer>
  );
}

