import { useEffect, useState, useRef } from "react";
import {
  CheckCircle2,
  Mic,
  MicOff,
  Phone,
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
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CompletionActions, SimButton, useLesson } from "@/components/learning/LessonContext";
import { PhoneFrame } from "@/components/learning/PhoneFrame";
import { callContacts } from "@/data/scenarios";
import { cn } from "@/lib/utils";
import { callSounds } from "@/lib/callSounds";
import { saveProgress, saveAttempt } from "@/lib/progressService";

// WhatsApp round calling button styling
const waRoundBtn =
  "flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full transition-transform active:scale-95 shadow-md";

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
            // Permission denied or webcam not available: fallback gracefully to simulated camera
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
    <PhoneFrame appName={ur ? "واٹس ایپ (WhatsApp)" : "WhatsApp"}>
      {/* Persistent Senior Safety Reassurance Banner */}
      <div className="mb-2.5 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span className="leading-tight">
          {ur
            ? "محفوظ مشق: یہ اصلی واٹس ایپ کال نہیں ہے۔ کیمرہ اور موبائل بیلنس محفوظ ہے۔"
            : "Safe Practice: This is a safe simulator. No real WhatsApp call or phone balance is used."}
        </span>
      </div>

      {/* WhatsApp Contacts Screen (Opens directly without 2-button screen) */}
      {(screen === "start" || screen === "contacts") && (
        <div className="space-y-3">
          {/* WhatsApp Style Top Bar */}
          <div className="flex items-center justify-between rounded-2xl bg-[#008069] px-4 py-3 text-white shadow-sm">
            <div>
              <p className="text-base font-bold">
                {ur ? "رابطہ منتخب کریں" : "Select contact"}
              </p>
              <p className="text-xs text-emerald-100">
                {ur
                  ? "سارہ کو کال کرنے کے لیے دائیں طرف کیمرہ یا فون کا بٹن دبائیں"
                  : "Tap the video or phone icon on the right to call Sara"}
              </p>
            </div>
            <Search className="h-5 w-5 text-emerald-100" />
          </div>

          {/* Contacts List Header */}
          <div className="flex items-center justify-between px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>{ur ? "تمام رابطے" : "All Contacts"}</span>
            <span className="text-[11px] text-emerald-600 font-semibold">{callContacts.length} {ur ? "رابطے" : "contacts"}</span>
          </div>

          {/* Generic Contacts List */}
          <ul className="space-y-2.5">
            {callContacts.map((c, i) => (
              <li
                key={c.id}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-2xl border bg-card p-3 shadow-xs transition-all",
                  i === 0
                    ? "border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20"
                    : "border-border hover:bg-muted/40",
                )}
              >
                {/* Contact Avatar & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <span
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-xs",
                        (c as { color?: string }).color || "bg-emerald-600",
                      )}
                    >
                      {c.initials}
                    </span>
                    <span className="absolute bottom-0 end-0 h-3.5 w-3.5 rounded-full bg-[#25d366] ring-2 ring-card" />
                  </div>

                  <div className="min-w-0">
                    <span className="block truncate text-base font-bold text-heading">
                      {ur && (c as { urName?: string }).urName ? (c as { urName?: string }).urName : c.name}
                    </span>
                    <span className="block text-xs font-medium text-muted-foreground truncate">
                      {(c as { phone?: string }).phone || "0300 1234567"} •{" "}
                      {ur && (c as { urRole?: string }).urRole
                        ? (c as { urRole?: string }).urRole
                        : (c as { role?: string }).role || (i === 0 ? "Daughter — Online" : "Available")}
                    </span>
                  </div>
                </div>

                {/* Direct Call Action Icons on the Right */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* 1. Video Call Icon Button (Primary Target for Sara with animated arrow) */}
                  <SimButton
                    action={i === 0 ? "call-sara" : "call-other"}
                    highlightFor="call-sara"
                    onPress={() => {
                      setCallType("video");
                      callSounds.playTap();
                      engine.act(i === 0 ? "call-sara" : "call-other");
                    }}
                    aria-label={`${ur ? "ویڈیو کال" : "Video call"} ${c.name}`}
                    title={ur ? "ویڈیو کال کریں" : "Video Call"}
                    className={cn(
                      waRoundBtn,
                      "h-11 w-11 bg-[#25d366] text-slate-950 hover:bg-[#20ba59] shadow-xs active:scale-95",
                    )}
                  >
                    <Video className="h-5 w-5" />
                  </SimButton>

                  {/* 2. Voice Call Icon Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setCallType("audio");
                      callSounds.playTap();
                      engine.act(i === 0 ? "call-sara" : "call-other");
                    }}
                    aria-label={`${ur ? "آڈیو کال" : "Voice call"} ${c.name}`}
                    title={ur ? "وائس کال کریں" : "Voice Call"}
                    className={cn(
                      waRoundBtn,
                      "h-11 w-11 border-2 border-emerald-600/40 bg-card text-[#25d366] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 shadow-xs active:scale-95",
                    )}
                  >
                    <Phone className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Screen 3 & 4: In-Call / Calling Screen (WhatsApp Calling Theme) */}
      {(screen === "calling" || screen === "incall") && (
        <div className="relative flex min-h-[510px] flex-col items-center justify-between rounded-3xl bg-[#0b141a] p-5 text-white shadow-2xl overflow-hidden border border-[#1f2c34]">
          {/* WhatsApp Top Header: End-to-End Encryption Banner */}
          <div className="z-10 flex w-full flex-col items-center gap-1 text-center">
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium tracking-tight">
              <Lock className="h-3 w-3 text-slate-400" />
              <span>{ur ? "اینڈ ٹو اینڈ اینکرپٹڈ" : "End-to-end encrypted"}</span>
            </span>

            <span className="rounded-full bg-[#1f2c34]/80 px-3 py-0.5 text-xs font-semibold text-emerald-400 border border-[#2a3942]">
              {screen === "calling"
                ? ur
                  ? "گھنٹی بج رہی ہے…"
                  : "Ringing…"
                : ur
                  ? `منسلک • ${formatDuration(callDuration)}`
                  : `WhatsApp Call • ${formatDuration(callDuration)}`}
            </span>
          </div>

          {/* WhatsApp Picture-in-Picture Self Video (Video Calls) */}
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

              {/* Flip camera shortcut */}
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

          {/* Center Contact Section with WhatsApp Pulsing Rings */}
          <div className="my-auto text-center z-10">
            <div className="relative mx-auto flex items-center justify-center">
              {screen === "calling" && (
                <>
                  <div className="absolute h-28 w-28 animate-ping rounded-full bg-[#25d366]/20" />
                  <div className="absolute h-36 w-36 animate-pulse rounded-full bg-[#25d366]/10" />
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

          {/* Interactive Dial Pad Modal */}
          {showKeypad && screen === "incall" && (
            <div className="absolute inset-0 z-30 flex flex-col justify-between bg-[#0b141a]/95 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-[#1f2c34] pb-2">
                <span className="text-base font-bold text-white">{ur ? "ڈائل پیڈ (کی پیڈ)" : "Keypad"}</span>
                <button
                  type="button"
                  onClick={() => setShowKeypad(false)}
                  className="rounded-full bg-[#1f2c34] p-1.5 text-slate-300 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="text-center py-2 min-h-[40px]">
                <span className="text-2xl font-mono tracking-widest text-[#25d366]">
                  {dialedDigits || (ur ? "نمبر دبائیں" : "Press numbers")}
                </span>
              </div>

              {/* Grid 3x4 */}
              <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto w-full">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleDialKey(k)}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f2c34] text-lg font-bold text-white hover:bg-[#2a3942] active:scale-95"
                  >
                    {k}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowKeypad(false)}
                className="btn btn-outline mt-3 w-full border-[#2a3942] bg-[#1f2c34] text-slate-200"
              >
                {ur ? "واٹس ایپ کال پر واپس جائیں" : "Back to Call Screen"}
              </button>
            </div>
          )}

          {/* Status Alert Badges for Mute & Camera */}
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

          {/* WhatsApp Signature Floating Calling Dock */}
          <div className="z-10 flex w-full items-center justify-center gap-2 sm:gap-3 rounded-3xl bg-[#1f2c34]/95 p-2.5 backdrop-blur-md border border-[#2a3942] shadow-2xl">
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
                      waRoundBtn,
                      muted
                        ? "bg-white text-slate-950 ring-2 ring-white/50"
                        : "bg-[#2a3942] text-white hover:bg-[#374248]",
                    )}
                  >
                    {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </SimButton>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 text-center">
                    {muted ? (ur ? "کھولیں" : "Unmute") : ur ? "مائیک بند" : "Mute"}
                  </span>
                </div>

                {/* 2. Video Call Controls: Camera On/Off & Flip Camera */}
                {callType === "video" ? (
                  <>
                    {/* Camera Button */}
                    <div className="flex flex-col items-center gap-1">
                      <SimButton
                        action={cameraOn ? "camera-off" : "camera-on"}
                        highlightFor="camera-off"
                        onPress={control(cameraOn ? "camera-off" : "camera-on", () => setCameraOn((c) => !c))}
                        aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}
                        aria-pressed={!cameraOn}
                        className={cn(
                          waRoundBtn,
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
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 text-center">
                        {cameraOn ? (ur ? "کیمرہ بند" : "Video Off") : ur ? "کیمرہ آن" : "Video On"}
                      </span>
                    </div>

                    {/* Flip Camera */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          callSounds.playTap();
                          setFacingMode((m) => (m === "user" ? "environment" : "user"));
                        }}
                        className={cn(waRoundBtn, "bg-[#2a3942] text-white hover:bg-[#374248]")}
                      >
                        <SwitchCamera className="h-5 w-5" />
                      </button>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 text-center">
                        {ur ? "کیمرہ بدلیں" : "Flip"}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Audio Call Specific: Speakerphone */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          callSounds.playTap();
                          setSpeakerOn((s) => !s);
                        }}
                        className={cn(
                          waRoundBtn,
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
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 text-center">
                        {speakerOn ? (ur ? "اسپیکر آن" : "Speaker On") : ur ? "اسپیکر بند" : "Speaker Off"}
                      </span>
                    </div>

                    {/* Audio Call Specific: Keypad */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          callSounds.playTap();
                          setShowKeypad(true);
                        }}
                        className={cn(waRoundBtn, "bg-[#2a3942] text-white hover:bg-[#374248]")}
                      >
                        <Grid3X3 className="h-5 w-5" />
                      </button>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 text-center">
                        {ur ? "کی پیڈ" : "Keypad"}
                      </span>
                    </div>
                  </>
                )}
              </>
            )}

            {/* 3. Signature WhatsApp Red End Call Button */}
            <div className="flex flex-col items-center gap-1">
              <SimButton
                action="end"
                onPress={handleEndCall}
                aria-label="End call"
                className={cn(
                  waRoundBtn,
                  "bg-[#ea0038] hover:bg-[#d00032] text-white ring-4 ring-rose-900/30",
                )}
              >
                <PhoneOff className="h-5 w-5" />
              </SimButton>
              <span className="text-[10px] sm:text-[11px] font-bold text-rose-300 text-center">
                {ur ? "کال کاٹیں" : "End Call"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Screen 5: Call Completed Screen */}
      {screen === "done" && (
        <div className="space-y-4 rounded-2xl bg-card p-5 text-center shadow-md border border-border">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#25d366]/20 text-[#25d366] ring-4 ring-[#25d366]/30">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-heading">
              {ur ? "شاباش! واٹس ایپ کال کی مشق مکمل ہوئی" : "Well Done! WhatsApp Practice Complete"}
            </h3>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {ur
                ? "آپ نے واٹس ایپ کال ملانا، مائیک بند کرنا اور کال کاٹنا سیکھ لیا ہے۔"
                : "You learned how to start a WhatsApp call, manage your mic, and safely hang up."}
            </p>
          </div>

          {/* Quick Repeat Call Action */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                callSounds.playTap();
                engine.reset();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{ur ? "دوبارہ کال ملائیں (ایک اور مشق)" : "Call Again (Practice Once More)"}</span>
            </button>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-2.5 text-xs font-semibold text-muted-foreground">
            {ur
              ? "یاد رکھیں: یہ صرف ایک محفوظ تعلیمی مشق تھی۔ اصلی فون بیلنس یا ڈیٹا استعمال نہیں ہوا۔"
              : "Remember: This was a safe practice session. No actual phone balance or data was consumed."}
          </div>

          <div className="pt-1">
            <CompletionActions />
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
