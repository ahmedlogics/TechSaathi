import { useEffect, useState, useRef } from "react";
import {
  CheckCircle2,
  Mic,
  MicOff,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneOff,
  Video,
  VideoOff,
  ShieldCheck,
  Volume2,
  VolumeX,
  Grid3X3,
  SwitchCamera,
  RotateCcw,
  X,
  Lock,
  Search,
  MessageSquare,
  CircleDashed,
  Megaphone,
  Users,
  Archive,
  Settings,
  Link2,
  Calendar,
  ChevronLeft,
  Minus,
  Square,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CompletionActions, SimButton, useLesson } from "@/components/learning/LessonContext";
import { callContacts } from "@/data/scenarios";
import { cn } from "@/lib/utils";
import { callSounds } from "@/lib/callSounds";
import { saveProgress, saveAttempt } from "@/lib/progressService";

type CallType = "video" | "audio";

export function CallSimulator() {
  const { engine, mode } = useLesson();
  const { lang } = useLanguage();
  const ur = lang === "ur";

  const [callType, setCallType] = useState<CallType>("video");
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);
  const [dialedDigits, setDialedDigits] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [webcamActive, setWebcamActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  const screen = engine.step.screen;
  const expected = engine.step.expected;
  const canGoBack = engine.state.stepIndex > 0 && !engine.completed;

  // Handle webcam stream for video calls
  useEffect(() => {
    if (callType === "video" && (screen === "calling" || screen === "incall") && cameraOn) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({
            video: { facingMode },
            audio: false,
          })
          .then((stream) => {
            streamRef.current = stream;
            setWebcamActive(true);
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          })
          .catch(() => {
            // Permission denied or webcam not available: fallback gracefully
            setWebcamActive(false);
          });
      }
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setWebcamActive(false);
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [callType, screen, cameraOn, facingMode]);

  // Simulated outgoing call connects after a short ring + Pakistani ringback tone
  useEffect(() => {
    if (screen !== "calling") {
      callSounds.stopRingback();
      setCallDuration(0);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setMuted(false);
    setCameraOn(true);
    callSounds.startRingback();

    const id = window.setTimeout(() => {
      callSounds.playConnectChime();
      engine.act("connected");
    }, 2800);

    return () => {
      window.clearTimeout(id);
      callSounds.stopRingback();
    };
  }, [screen, engine.act]);

  // Audio calls do not use camera: auto-advance past camera step directly to end call
  useEffect(() => {
    if (callType === "audio" && engine.step.id === "camera") {
      engine.act("camera-off");
    }
  }, [callType, engine.step.id, engine.act]);

  // Duration timer once in call
  useEffect(() => {
    if (screen === "incall") {
      setCallDuration(0);
      timerRef.current = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen]);

  // Sync completion with shared Supabase progress service when call finishes
  useEffect(() => {
    if (screen === "done") {
      saveProgress({
        moduleId: "video-call",
        lastStep: "done",
        mode,
        completed: true,
      }).catch(() => {});

      saveAttempt({
        moduleId: "video-call",
        mode,
        completed: true,
        mistakesCount: engine.state.mistakes,
        hintsUsed: engine.state.hints,
      }).catch(() => {});
    }
  }, [screen, mode, engine.state.mistakes, engine.state.hints]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  /** Controls toggle state, play sound feedback, and advance lesson when expected */
  const control = (action: string, apply: () => void) => () => {
    callSounds.playTap();
    if (action === expected) apply();
    engine.act(action);
  };

  const handleEndCall = () => {
    callSounds.playHangupTone();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    engine.act("end");
  };

  const handleDialKey = (key: string) => {
    callSounds.playTap();
    setDialedDigits((prev) => (prev.length < 12 ? prev + key : prev));
  };

  const sara = callContacts[0]!;

  return (
    <div
      className="w-full max-w-4xl mx-auto overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-800 bg-[#ffffff] dark:bg-[#111b21] shadow-2xl transition-all"
      dir="ltr"
    >
      {/* 1. Windows & WhatsApp Desktop Title Bar */}
      <div className="flex h-9 select-none items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-[#f3f3f3] dark:bg-[#202c33] px-3 text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          {canGoBack && (
            <button
              type="button"
              onClick={engine.back}
              title={ur ? "پیچھے جائیں" : "Go Back"}
              className="mr-1 flex h-6 w-6 items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {/* WhatsApp Brand Icon & Title */}
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-100">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-[#25d366]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.07-1.34C8.5 21.52 10.2 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.2c-1.6 0-3.1-.45-4.4-1.25l-.32-.2-3.1.82.83-3.02-.2-.33A8.15 8.15 0 0 1 3.8 12c0-4.52 3.68-8.2 8.2-8.2 4.52 0 8.2 3.68 8.2 8.2 0 4.52-3.68 8.2-8.2 8.2zm4.5-6.15c-.25-.13-1.47-.72-1.7-.8-.23-.08-.4-.12-.57.12-.17.25-.65.8-.8.97-.15.17-.3.2-.55.07-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.73-.15-.25-.02-.38.11-.5.11-.11.25-.28.37-.42.12-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.12-.57-1.37-.78-1.88-.2-.5-.42-.43-.57-.44l-.48-.01c-.17 0-.45.06-.68.32-.23.25-.89.87-.89 2.12s.91 2.46 1.04 2.63c.12.17 1.8 2.75 4.36 3.85.61.26 1.09.42 1.46.54.61.2 1.17.17 1.61.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.3z" />
            </svg>
            <span className="text-[13px] tracking-tight">WhatsApp</span>
          </div>

          {/* Senior Safety Badge in title bar */}
          <span className="ml-2 hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="h-3 w-3" />
            <span>{ur ? "محفوظ مشق" : "Safe Practice"}</span>
          </span>
        </div>

        {/* Windows Control Buttons (Minimize, Maximize, Close) */}
        <div className="flex items-center -mr-3">
          <button
            type="button"
            className="flex h-9 w-11 items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
            title="Minimize"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="flex h-9 w-11 items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
            title="Maximize"
          >
            <Square className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => engine.reset()}
            className="flex h-9 w-11 items-center justify-center hover:bg-rose-600 hover:text-white text-slate-600 dark:text-slate-400 transition-colors"
            title={ur ? "دوبارہ شروع کریں" : "Reset / Close"}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Main Desktop Interface Body */}
      <div className="flex flex-col md:flex-row h-auto min-h-[580px] md:h-[620px] bg-[#ffffff] dark:bg-[#111b21] overflow-hidden">
        {/* Left Vertical App Navigation Rail */}
        <div className="hidden md:flex w-14 shrink-0 flex-col items-center justify-between border-r border-slate-200 dark:border-slate-800 bg-[#f0f2f5] dark:bg-[#202c33] py-3 text-slate-600 dark:text-slate-400">
          <div className="flex flex-col items-center gap-4 w-full">
            {/* Chats icon with badge 1 */}
            <div className="relative cursor-pointer p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#25d366] text-[10px] font-bold text-slate-950">
                1
              </span>
            </div>

            {/* Calls Icon (Active Tab with green indicator dot) */}
            <div
              className="relative p-2 rounded-lg bg-slate-200 dark:bg-[#2a3942] text-slate-900 dark:text-white"
              title="Calls"
            >
              <Phone className="h-5 w-5 text-[#00a884]" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#00a884]" />
            </div>

            {/* Status Icon */}
            <div className="relative cursor-pointer p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <CircleDashed className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#00a884]" />
            </div>

            {/* Channels / Megaphone */}
            <div className="cursor-pointer p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Megaphone className="h-5 w-5" />
            </div>

            {/* Communities with dot */}
            <div className="relative cursor-pointer p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Users className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#00a884]" />
            </div>

            {/* Archive */}
            <div className="cursor-pointer p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Archive className="h-5 w-5" />
            </div>

            {/* Meta AI colorful circle */}
            <div
              className="cursor-pointer p-2 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-xs flex items-center justify-center text-white"
              title="Meta AI"
            >
              <div className="h-2 w-2 rounded-full bg-white/80" />
            </div>
          </div>

          {/* Bottom Settings and User Profile */}
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="cursor-pointer p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Settings className="h-5 w-5" />
            </div>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00a884] text-xs font-bold text-white shadow-xs"
              title="Profile"
            >
              Me
            </div>
          </div>
        </div>

        {/* Middle Column: Calls List (Favourites & Recent) */}
        <div
          className={cn(
            "w-full md:w-80 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-[#ffffff] dark:bg-[#111b21] flex flex-col",
            // If in active call on small screen, hide calls list to focus on call
            (screen === "calling" || screen === "incall" || screen === "done") && "hidden md:flex",
          )}
        >
          {/* Calls Header */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {ur ? "کالز (Calls)" : "Calls"}
            </h2>
            <button
              type="button"
              onClick={() => {
                callSounds.playTap();
                setCallType("video");
                engine.act("choose-video");
              }}
              title={ur ? "نئی کال" : "New Call"}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white shadow-xs active:scale-95 transition-all"
            >
              <PhoneCall className="h-4 w-4" />
            </button>
          </div>

          {/* Search Bar Pill */}
          <div className="px-3 pb-2">
            <div className="flex items-center gap-2.5 rounded-full bg-[#f0f2f5] dark:bg-[#202c33] px-3.5 py-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">
                {ur ? "نام، نمبر یا یوزر تلاش کریں" : "Search name, number or @username"}
              </span>
            </div>
          </div>

          {/* Scrollable Calls List Area */}
          <div className="flex-1 overflow-y-auto px-2 space-y-4 pb-4">
            {/* 1. Favourites Section */}
            <div>
              <div className="flex items-center justify-between px-2 py-1 text-slate-900 dark:text-slate-100">
                <span className="text-sm font-bold">{ur ? "پسندیدہ (Favourites)" : "Favourites"}</span>
                <button
                  type="button"
                  className="rounded-full border border-slate-300 dark:border-slate-700 px-2.5 py-0.5 text-[11px] font-semibold text-[#00a884] hover:bg-slate-100 dark:hover:bg-[#202c33]"
                >
                  {ur ? "تمام دیکھیں" : "View all"}
                </button>
              </div>

              <div className="mt-1 space-y-1">
                {/* Item 1: Sara (Daughter) - Primary Learning Target */}
                <div
                  className={cn(
                    "flex items-center justify-between gap-2.5 rounded-xl px-2.5 py-2 transition-all",
                    screen === "contacts" && expected === "call-sara"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-[#00a884] shadow-xs"
                      : "hover:bg-slate-100 dark:hover:bg-[#202c33]",
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white shadow-xs">
                      <span className="text-sm font-bold">S</span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                        {ur ? "سارہ (بیٹی)" : "Sara (Daughter)"}
                      </p>
                      <p className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        +92 334 2562283
                      </p>
                    </div>
                  </div>

                  {/* Actions for Sara */}
                  <div className="flex items-center gap-1 shrink-0">
                    <SimButton
                      action="call-sara"
                      onPress={() => {
                        setCallType("video");
                        callSounds.playTap();
                        engine.act("call-sara");
                      }}
                      aria-label="Video call Sara"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 dark:text-slate-200 hover:bg-[#00a884]/20 hover:text-[#00a884] transition-colors"
                    >
                      <Video className="h-4.5 w-4.5" />
                    </SimButton>

                    <button
                      type="button"
                      onClick={() => {
                        setCallType("audio");
                        callSounds.playTap();
                        engine.act("call-sara");
                      }}
                      aria-label="Voice call Sara"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 dark:text-slate-200 hover:bg-[#00a884]/20 hover:text-[#00a884] transition-colors"
                    >
                      <Phone className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                {/* Item 2: SEC B BOYS (SE) */}
                <div className="flex items-center justify-between gap-2.5 rounded-xl px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-[#202c33] transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2a3942] text-white font-bold text-xs border border-slate-700">
                      SE
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                        SEC B BOYS (SE)
                      </p>
                      <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                        {ur ? "گروپ کال" : "Group Call"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 text-slate-400">
                    <button
                      type="button"
                      onClick={() => {
                        callSounds.playTap();
                        engine.act("call-other");
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <Video className="h-4.5 w-4.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        callSounds.playTap();
                        engine.act("call-other");
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <Phone className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                {/* Item 3: مجلس اطفال کراچی */}
                <div className="flex items-center justify-between gap-2.5 rounded-xl px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-[#202c33] transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-amber-300 font-serif text-xs border border-amber-400/40">
                      اطفال
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100 font-urdu">
                        مجلس اطفال کراچی
                      </p>
                      <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                        {ur ? "کمیونٹی" : "Community"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 text-slate-400">
                    <button
                      type="button"
                      onClick={() => {
                        callSounds.playTap();
                        engine.act("call-other");
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <Video className="h-4.5 w-4.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        callSounds.playTap();
                        engine.act("call-other");
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <Phone className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Recent Call Log Section */}
            <div>
              <div className="px-2 pt-2 pb-1 text-slate-900 dark:text-slate-100">
                <span className="text-sm font-bold">{ur ? "حالیہ کالز (Recent)" : "Recent"}</span>
              </div>

              <div className="mt-1 space-y-1">
                {/* Nadeem Janu */}
                <div className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#202c33] transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white font-bold text-xs">
                      NJ
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Nadeem Janu
                      </p>
                      <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <PhoneOutgoing className="h-3 w-3 text-[#00a884]" />
                        <span>{ur ? "آؤٹ گوئنگ" : "Outgoing"}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">13:46</span>
                </div>

                {/* Daniyal Ahmed (Incoming) */}
                <div className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#202c33] transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 text-white font-bold text-xs">
                      DA
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Daniyal Ahmed
                      </p>
                      <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <PhoneIncoming className="h-3 w-3 text-sky-500" />
                        <span>{ur ? "انکمنگ" : "Incoming"}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">12:54</span>
                </div>

                {/* Daniyal Ahmed (Outgoing 3) */}
                <div className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#202c33] transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 text-white font-bold text-xs">
                      DA
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Daniyal Ahmed
                      </p>
                      <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <PhoneOutgoing className="h-3 w-3 text-[#00a884]" />
                        <span>{ur ? "آؤٹ گوئنگ (3)" : "Outgoing (3)"}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">12:53</span>
                </div>

                {/* Ahmed */}
                <div className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#202c33] transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-700 text-white font-bold text-xs">
                      AH
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Ahmed
                      </p>
                      <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <PhoneOutgoing className="h-3 w-3 text-[#00a884]" />
                        <span>{ur ? "آؤٹ گوئنگ" : "Outgoing"}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">11:47</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Canvas */}
        <div className="flex-1 flex flex-col justify-between bg-[#f0f2f5] dark:bg-[#0c1317] overflow-hidden">
          {/* Senior Safety Notice Banner */}
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#00a884]" />
            <span className="leading-tight">
              {ur
                ? "محفوظ مشق: یہ اصلی واٹس ایپ کال نہیں ہے۔ کیمرہ اور موبائل بیلنس محفوظ ہے۔"
                : "Safe Practice: This is a safe simulator. No real WhatsApp call or phone balance is used."}
            </span>
          </div>

          {/* SCREEN STATE 1: Start Hub Screen ("Voice and video calling" card) */}
          {screen === "start" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              {/* WhatsApp Calling Hub Card */}
              <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#111b21] p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-all">
                {/* SVG Laptop Calling Illustration */}
                <svg
                  viewBox="0 0 160 110"
                  className="mx-auto h-28 w-auto drop-shadow-sm mb-4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="22"
                    y="10"
                    width="116"
                    height="74"
                    rx="8"
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth="2.5"
                  />
                  <rect
                    x="26"
                    y="14"
                    width="108"
                    height="66"
                    rx="5"
                    fill="#f0fdf4"
                    className="dark:fill-[#0d2818]"
                  />
                  <rect x="26" y="14" width="108" height="12" rx="3" fill="#00a884" />
                  <circle cx="33" cy="20" r="2" fill="#ffffff" opacity="0.8" />
                  <circle cx="39" cy="20" r="2" fill="#ffffff" opacity="0.6" />
                  <rect
                    x="42"
                    y="32"
                    width="76"
                    height="42"
                    rx="6"
                    fill="#25d366"
                    fillOpacity="0.15"
                    stroke="#25d366"
                    strokeWidth="1.5"
                  />
                  <circle cx="80" cy="53" r="14" fill="#25d366" />
                  <path
                    d="M75 49c0-.5.4-1 1-1h1.5c.4 0 .8.3.9.7l.6 2c.1.4 0 .8-.3 1l-1 1c.8 1.5 2 2.7 3.5 3.5l1-1c.2-.3.6-.4 1-.3l2 .6c.4.1.7.5.7.9V59c0 .6-.5 1-1 1-5 0-9-4-9-9v-1z"
                    fill="#ffffff"
                  />
                  <path
                    d="M8 86h144c3 0 5 2 4 4l-4 8H8l-4-8c-1-2 1-4 4-4z"
                    fill="#94a3b8"
                  />
                  <rect x="68" y="87" width="24" height="3" rx="1.5" fill="#64748b" />
                </svg>

                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {ur ? "وائس اور ویڈیو کالنگ" : "Voice and video calling"}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  {ur
                    ? "اسکرین شیئر کریں، ایموجی بھیجیں اور 32 افراد تک بات کریں۔"
                    : "Share your screen, react with emoji and more, with up to 32 people."}
                </p>
              </div>

              {/* 4 WhatsApp Desktop Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-5 sm:gap-7">
                {/* 1. Start Call (Primary Green SimButton) */}
                <div className="flex flex-col items-center gap-1.5">
                  <SimButton
                    action="choose-video"
                    onPress={() => {
                      setCallType("video");
                      callSounds.playTap();
                      engine.act("choose-video");
                    }}
                    aria-label={ur ? "کال شروع کریں" : "Start call"}
                    className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white shadow-md active:scale-95 transition-all"
                  >
                    <Video className="h-6 w-6" />
                  </SimButton>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {ur ? "کال شروع کریں" : "Start call"}
                  </span>
                </div>

                {/* 2. New Call Link */}
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => callSounds.playTap()}
                    className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-white dark:bg-[#202c33] hover:bg-slate-100 dark:hover:bg-[#2a3942] text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
                  >
                    <Link2 className="h-5 w-5" />
                  </button>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {ur ? "نیا کال لنک" : "New call link"}
                  </span>
                </div>

                {/* 3. Call a Number (Keypad) */}
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      callSounds.playTap();
                      setShowKeypad(true);
                    }}
                    className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-white dark:bg-[#202c33] hover:bg-slate-100 dark:hover:bg-[#2a3942] text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {ur ? "نمبر ملائیں" : "Call a number"}
                  </span>
                </div>

                {/* 4. Schedule Call */}
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => callSounds.playTap()}
                    className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-white dark:bg-[#202c33] hover:bg-slate-100 dark:hover:bg-[#2a3942] text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
                  >
                    <Calendar className="h-5 w-5" />
                  </button>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {ur ? "کال شیڈول" : "Schedule call"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN STATE 2: Contacts Selection Helper */}
          {screen === "contacts" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#111b21] p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#00a884] text-white text-2xl font-bold shadow-md">
                  S
                </div>
                <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">
                  {ur ? "سارہ کو کال ملائیں" : "Call Sara (Daughter)"}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {ur
                    ? "بائیں جانب پسندیدہ فہرست میں سارہ کے ویڈیو بٹن کو دبائیں، یا نیچے دیے گئے بٹن پر کلک کریں۔"
                    : "Tap the video camera icon next to Sara in Favourites, or tap below to start the call."}
                </p>

                <div className="mt-5">
                  <SimButton
                    action="call-sara"
                    onPress={() => {
                      setCallType("video");
                      callSounds.playTap();
                      engine.act("call-sara");
                    }}
                    className="btn flex w-full items-center justify-center gap-2 rounded-xl bg-[#00a884] hover:bg-[#008f6f] py-2.5 text-sm font-bold text-white shadow-md transition-all active:scale-98"
                  >
                    <Video className="h-5 w-5" />
                    <span>{ur ? "سارہ کو ویڈیو کال کریں" : "Video Call Sara"}</span>
                  </SimButton>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN STATE 3 & 4: In-Call / Calling Screen */}
          {(screen === "calling" || screen === "incall") && (
            <div className="relative flex-1 flex flex-col items-center justify-between bg-[#0b141a] p-5 text-white overflow-hidden">
              {/* WhatsApp End-to-End Encryption Banner */}
              <div className="z-10 flex w-full flex-col items-center gap-1 text-center">
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <Lock className="h-3 w-3 text-slate-400" />
                  <span>{ur ? "اینڈ ٹو اینڈ اینکرپٹڈ" : "End-to-end encrypted"}</span>
                </span>

                <span className="rounded-full bg-[#1f2c34]/80 px-3.5 py-0.5 text-xs font-semibold text-emerald-400 border border-[#2a3942]">
                  {screen === "calling"
                    ? ur
                      ? "گھنٹی بج رہی ہے…"
                      : "Ringing…"
                    : ur
                      ? `منسلک • ${formatDuration(callDuration)}`
                      : `WhatsApp Call • ${formatDuration(callDuration)}`}
                </span>
              </div>

              {/* Live Picture-in-Picture Self Video for Video Calls */}
              {callType === "video" && screen === "incall" && (
                <div className="absolute top-14 end-4 z-20 h-28 w-20 sm:h-32 sm:w-24 overflow-hidden rounded-2xl border-2 border-white/20 bg-[#1f2c34] shadow-2xl">
                  {cameraOn ? (
                    webcamActive ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="h-full w-full object-cover -scale-x-100"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-[#1f2c34] text-[10px] text-center p-1 text-slate-200">
                        <Video className="h-5 w-5 mb-1 text-[#25d366]" />
                        <span>{ur ? "آپ کی ویڈیو" : "You"}</span>
                      </div>
                    )
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-[#0b141a] text-slate-400 text-[10px] text-center p-1">
                      <VideoOff className="h-5 w-5 mb-1 text-amber-400" />
                      <span>{ur ? "بند ہے" : "Off"}</span>
                    </div>
                  )}

                  {cameraOn && (
                    <button
                      type="button"
                      onClick={() => {
                        callSounds.playTap();
                        setFacingMode((m) => (m === "user" ? "environment" : "user"));
                      }}
                      title={ur ? "کیمرہ بدلیں" : "Flip Camera"}
                      className="absolute bottom-1 end-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                    >
                      <SwitchCamera className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Center Contact Section */}
              <div className="my-auto text-center z-10">
                <div className="relative mx-auto flex items-center justify-center">
                  {screen === "calling" && (
                    <>
                      <div className="absolute h-28 w-28 animate-ping rounded-full bg-[#00a884]/20" />
                      <div className="absolute h-36 w-36 animate-pulse rounded-full bg-[#00a884]/10" />
                    </>
                  )}
                  <span className="relative flex h-20 w-20 sm:h-22 sm:w-22 items-center justify-center rounded-full bg-[#008069] text-3xl sm:text-4xl font-extrabold text-white shadow-2xl ring-4 ring-[#25d366]/30">
                    {sara.initials}
                  </span>
                </div>

                <p className="mt-3.5 text-2xl font-bold tracking-tight text-white">{sara.name}</p>
                <p className="text-xs font-medium text-slate-300" aria-live="polite">
                  {screen === "calling"
                    ? ur
                      ? "سارہ کو واٹس ایپ کال ملائی جا رہی ہے..."
                      : "Calling Sara on WhatsApp..."
                    : ur
                      ? "سارہ سے بات ہو رہی ہے (فرضی کال)"
                      : "Sara is on the line (Simulated Call)"}
                </p>

                {/* Dynamic Sound Wave Effect when connected */}
                {screen === "incall" && (
                  <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[#25d366]">
                    <Volume2 className="h-4 w-4 animate-bounce" />
                    <div className="flex items-end gap-1 h-4">
                      <span className="w-1 bg-[#25d366] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2" />
                      <span className="w-1 bg-[#25d366] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3.5" />
                      <span className="w-1 bg-[#25d366] rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-4" />
                      <span className="w-1 bg-[#25d366] rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-2.5" />
                      <span className="w-1 bg-[#25d366] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2" />
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badges for Mute & Camera */}
              {screen === "incall" && (
                <div className="mb-3 flex flex-col gap-1.5 w-full max-w-xs text-center z-10">
                  {muted ? (
                    <div className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-300">
                      <MicOff className="h-3.5 w-3.5" />
                      <span>{ur ? "مائیک بند ہے — کوئی نہیں سن سکتا" : "Mic is muted — No one can hear you"}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-300">
                      <Mic className="h-3.5 w-3.5" />
                      <span>{ur ? "مائیک آن ہے — سارہ سن سکتی ہیں" : "Mic is live — Sara can hear you"}</span>
                    </div>
                  )}

                  {callType === "video" && !cameraOn && (
                    <div className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-300">
                      <VideoOff className="h-3.5 w-3.5" />
                      <span>{ur ? "کیمرہ بند ہے — ویڈیو بند ہے" : "Camera is off — Your video is hidden"}</span>
                    </div>
                  )}
                </div>
              )}

              {/* WhatsApp Floating Calling Dock */}
              <div className="z-10 flex w-full max-w-md items-center justify-center gap-3 rounded-3xl bg-[#1f2c34]/95 p-2.5 backdrop-blur-md border border-[#2a3942] shadow-2xl">
                {screen === "incall" && (
                  <>
                    {/* 1. WhatsApp Mute Button */}
                    <div className="flex flex-col items-center gap-1">
                      <SimButton
                        action={muted ? "unmute" : "mute"}
                        highlightFor="mute"
                        onPress={control(muted ? "unmute" : "mute", () => setMuted((m) => !m))}
                        aria-label={muted ? "Unmute" : "Mute"}
                        aria-pressed={muted}
                        className={cn(
                          "flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-transform active:scale-95 shadow-md",
                          muted
                            ? "bg-white text-slate-950 ring-2 ring-white/50"
                            : "bg-[#2a3942] text-white hover:bg-[#374248]",
                        )}
                      >
                        {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                      </SimButton>
                      <span className="text-[10px] font-bold text-slate-300">
                        {muted ? (ur ? "کھولیں" : "Unmute") : ur ? "مائیک بند" : "Mute"}
                      </span>
                    </div>

                    {/* 2. Video Controls (Camera Off & Flip) OR Audio Controls (Speaker & Keypad) */}
                    {callType === "video" ? (
                      <>
                        <div className="flex flex-col items-center gap-1">
                          <SimButton
                            action={cameraOn ? "camera-off" : "camera-on"}
                            highlightFor="camera-off"
                            onPress={control(cameraOn ? "camera-off" : "camera-on", () => setCameraOn((c) => !c))}
                            aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}
                            aria-pressed={!cameraOn}
                            className={cn(
                              "flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-transform active:scale-95 shadow-md",
                              !cameraOn
                                ? "bg-white text-slate-950 ring-2 ring-white/50"
                                : "bg-[#2a3942] text-white hover:bg-[#374248]",
                            )}
                          >
                            {cameraOn ? (
                              <Video className="h-5 w-5" />
                            ) : (
                              <VideoOff className="h-5 w-5" />
                            )}
                          </SimButton>
                          <span className="text-[10px] font-bold text-slate-300">
                            {cameraOn ? (ur ? "کیمرہ بند" : "Video Off") : ur ? "کیمرہ آن" : "Video On"}
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              callSounds.playTap();
                              setFacingMode((m) => (m === "user" ? "environment" : "user"));
                            }}
                            className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#2a3942] text-white hover:bg-[#374248] transition-transform active:scale-95 shadow-md"
                          >
                            <SwitchCamera className="h-5 w-5" />
                          </button>
                          <span className="text-[10px] font-bold text-slate-300">
                            {ur ? "کیمرہ بدلیں" : "Flip"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              callSounds.playTap();
                              setSpeakerOn((s) => !s);
                            }}
                            className={cn(
                              "flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-transform active:scale-95 shadow-md",
                              speakerOn
                                ? "bg-[#25d366] text-slate-950"
                                : "bg-[#2a3942] text-white hover:bg-[#374248]",
                            )}
                          >
                            {speakerOn ? (
                              <Volume2 className="h-5 w-5" />
                            ) : (
                              <VolumeX className="h-5 w-5" />
                            )}
                          </button>
                          <span className="text-[10px] font-bold text-slate-300">
                            {speakerOn ? (ur ? "اسپیکر آن" : "Speaker On") : ur ? "اسپیکر بند" : "Speaker Off"}
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              callSounds.playTap();
                              setShowKeypad(true);
                            }}
                            className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#2a3942] text-white hover:bg-[#374248] transition-transform active:scale-95 shadow-md"
                          >
                            <Grid3X3 className="h-5 w-5" />
                          </button>
                          <span className="text-[10px] font-bold text-slate-300">
                            {ur ? "کی پیڈ" : "Keypad"}
                          </span>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* 3. Red End Call Button */}
                <div className="flex flex-col items-center gap-1">
                  <SimButton
                    action="end"
                    onPress={handleEndCall}
                    aria-label="End call"
                    className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#ea0038] hover:bg-[#d00032] text-white ring-4 ring-rose-900/30 transition-transform active:scale-95 shadow-md"
                  >
                    <PhoneOff className="h-5 w-5" />
                  </SimButton>
                  <span className="text-[10px] font-bold text-rose-300">
                    {ur ? "کال کاٹیں" : "End Call"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN STATE 5: Call Completed Screen */}
          {screen === "done" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#111b21] p-6 shadow-md border border-slate-200 dark:border-slate-800">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#25d366]/20 text-[#25d366] ring-4 ring-[#25d366]/30">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <h3 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {ur ? "شاباش! واٹس ایپ کال کی مشق مکمل ہوئی" : "Well Done! WhatsApp Practice Complete"}
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                  {ur
                    ? "آپ نے واٹس ایپ کال ملانا، مائیک بند کرنا اور کال کاٹنا سیکھ لیا ہے۔"
                    : "You learned how to start a WhatsApp call, manage your mic, and safely hang up."}
                </p>

                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      callSounds.playTap();
                      engine.reset();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>{ur ? "دوبارہ کال ملائیں (ایک اور مشق)" : "Call Again (Practice Once More)"}</span>
                  </button>
                </div>

                <div className="mt-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/50 p-2.5 text-xs font-semibold text-slate-500">
                  {ur
                    ? "یاد رکھیں: یہ صرف ایک محفوظ تعلیمی مشق تھی۔ اصلی فون بیلنس یا ڈیٹا استعمال نہیں ہوا۔"
                    : "Remember: This was a safe practice session. No actual phone balance or data was consumed."}
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <CompletionActions />
                </div>
              </div>
            </div>
          )}

          {/* Bottom End-to-End Encryption Text */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 py-2.5 border-t border-slate-200/60 dark:border-slate-800/60">
            <Lock className="h-3 w-3 text-slate-400" />
            <span>
              {ur
                ? "آپ کی ذاتی کالز اینڈ ٹو اینڈ اینکرپٹڈ ہیں"
                : "Your personal calls are end-to-end encrypted"}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Dial Pad Modal (When Opened) */}
      {showKeypad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xs rounded-3xl bg-[#111b21] p-5 text-white shadow-2xl border border-[#2a3942]">
            <div className="flex items-center justify-between border-b border-[#2a3942] pb-2">
              <span className="text-base font-bold">{ur ? "ڈائل پیڈ (کی پیڈ)" : "Keypad"}</span>
              <button
                type="button"
                onClick={() => setShowKeypad(false)}
                className="rounded-full bg-[#2a3942] p-1.5 text-slate-300 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-center py-3 min-h-[44px]">
              <span className="text-2xl font-mono tracking-widest text-[#25d366]">
                {dialedDigits || (ur ? "نمبر دبائیں" : "Press numbers")}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleDialKey(k)}
                  className="flex h-11 w-11 mx-auto items-center justify-center rounded-full bg-[#1f2c34] text-base font-bold text-white hover:bg-[#2a3942] active:scale-95 transition-all"
                >
                  {k}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowKeypad(false)}
              className="mt-4 w-full rounded-xl bg-[#00a884] py-2 text-xs font-bold text-white hover:bg-[#008f6f]"
            >
              {ur ? "بند کریں" : "Done"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
