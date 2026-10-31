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
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CompletionActions, SimButton, useLesson } from "@/components/learning/LessonContext";
import { PhoneFrame } from "@/components/learning/PhoneFrame";
import { callContacts } from "@/data/scenarios";
import { cn } from "@/lib/utils";
import { callSounds } from "@/lib/callSounds";

const round =
  "flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full transition-transform active:scale-95 shadow-sm";

type CallType = "video" | "audio";

export function CallSimulator() {
  const { engine } = useLesson();
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

  // Audio calls do not use camera: auto-advance past camera step to end call
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
    <PhoneFrame appName={ur ? "کال مشق — ٹیک ساتھی" : "Practice Call — TechSaathi"}>
      {/* Persistent Senior Safety Reassurance Banner */}
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-primary/20 bg-mint/70 px-3 py-2 text-xs font-semibold text-primary-strong sm:text-sm">
        <ShieldCheck className="h-5 w-5 shrink-0 text-success" />
        <span className="leading-tight">
          {ur
            ? "محفوظ مشق: یہ اصلی فون کال نہیں ہے۔ آپ کا کیمرہ اور پیسے بالکل محفوظ ہیں۔"
            : "Safe Practice: This is not a real call. Your camera and balance are completely safe."}
        </span>
      </div>

      {screen === "start" && (
        <div className="flex flex-col gap-4 pt-4">
          <div className="rounded-2xl border-2 border-border bg-card p-4 text-center shadow-sm">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Phone className="h-8 w-8" />
            </span>
            <h3 className="mt-3 text-xl font-bold text-heading">
              {ur ? "کال کی قسم منتخب کریں" : "Choose Call Type"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {ur ? "مشق شروع کرنے کے لیے نیچے دیے گئے بٹن پر کلک کریں" : "Tap a button below to begin practice"}
            </p>
          </div>

          <div className="space-y-2.5">
            <SimButton
              action="choose-video"
              onPress={() => {
                setCallType("video");
                callSounds.playTap();
                engine.act("choose-video");
              }}
              className="btn btn-primary flex w-full items-center justify-center gap-2.5 py-3 text-base font-bold shadow-md"
            >
              <Video className="h-5 w-5 shrink-0" />
              <span>{ur ? "ویڈیو کال کی مشق شروع کریں" : "Practise Video Call"}</span>
            </SimButton>

            <button
              type="button"
              onClick={() => {
                setCallType("audio");
                callSounds.playTap();
                // Advance to contact selection for Audio Call
                engine.act("choose-video");
              }}
              className="btn btn-outline flex w-full items-center justify-center gap-2.5 py-2.5 text-sm font-semibold"
            >
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <span>{ur ? "آڈیو کال کی مشق (وائس کال)" : "Practise Audio Call (Voice Call)"}</span>
            </button>
          </div>
        </div>
      )}

      {screen === "contacts" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-card p-3 shadow-xs">
            <p className="text-sm font-semibold text-muted-foreground">
              {ur ? "رابطہ منتخب کریں جس کو کال کرنی ہے:" : "Select a contact to call:"}
            </p>
            <span className="rounded-full bg-mint px-2.5 py-0.5 text-xs font-bold text-primary-strong">
              {callType === "video" ? (ur ? "ویڈیو کال" : "Video Call") : ur ? "آڈیو کال" : "Audio Call"}
            </span>
          </div>

          <ul className="space-y-3">
            {callContacts.map((c, i) => (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-3.5 shadow-sm transition-all hover:border-primary/40"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-mint text-xl font-extrabold text-primary-strong ring-2 ring-primary/20">
                  {c.initials}
                </span>

                <div className="flex-1 min-w-0">
                  <span className="block truncate text-lg font-bold text-heading">{c.name}</span>
                  <span className="block text-xs font-medium text-muted-foreground">
                    {i === 0
                      ? ur
                        ? "بیٹی — آن لائن"
                        : "Daughter — Online"
                      : ur
                        ? "بیٹا — آن لائن"
                        : "Son — Online"}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <SimButton
                    action={i === 0 ? "call-sara" : "call-other"}
                    onPress={() => {
                      callSounds.playTap();
                      engine.act(i === 0 ? "call-sara" : "call-other");
                    }}
                    aria-label={`${callType === "video" ? "Video" : "Audio"} call ${c.name}`}
                    className={cn(round, "bg-success text-success-foreground hover:bg-success/90")}
                  >
                    {callType === "video" ? (
                      <Video className="h-5 w-5 sm:h-6 sm:w-6" />
                    ) : (
                      <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                    )}
                  </SimButton>
                  <span className="text-[11px] font-bold text-heading">
                    {ur ? "کال ملائیں" : "Call"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(screen === "calling" || screen === "incall") && (
        <div className="relative flex min-h-[510px] flex-col items-center justify-between rounded-3xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 p-6 text-white shadow-xl overflow-hidden">
          {/* Top Status Header */}
          <div className="z-10 flex w-full items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 rounded-full bg-slate-800/80 px-3 py-1 border border-slate-700">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              {screen === "calling"
                ? ur
                  ? "گھنٹی بج رہی ہے…"
                  : "Ringing…"
                : ur
                  ? `منسلک (${formatDuration(callDuration)})`
                  : `Connected (${formatDuration(callDuration)})`}
            </span>
            <div className="flex items-center gap-2">
              {callType === "audio" && screen === "incall" && (
                <button
                  type="button"
                  onClick={() => {
                    callSounds.playTap();
                    setShowKeypad(true);
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-slate-800/90 px-2.5 py-1 text-xs font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 active:scale-95 transition-transform"
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                  <span>{ur ? "کی پیڈ" : "Keypad"}</span>
                </button>
              )}
              <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-slate-300 border border-slate-700">
                {callType === "video" ? "HD Video" : "HD Voice"}
              </span>
            </div>
          </div>

          {/* Picture-in-Picture Local Camera View for Video Call */}
          {callType === "video" && screen === "incall" && (
            <div className="absolute top-14 end-4 z-20 h-28 w-20 sm:h-32 sm:w-24 overflow-hidden rounded-2xl border-2 border-white/30 bg-slate-800 shadow-2xl">
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
                  <div className="flex h-full w-full flex-col items-center justify-center bg-slate-700 text-[10px] text-center p-1 text-slate-200">
                    <Video className="h-5 w-5 mb-1 text-primary" />
                    <span>{ur ? "آپ کی ویڈیو" : "You"}</span>
                  </div>
                )
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-slate-900 text-slate-400 text-[10px] text-center p-1">
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

          {/* Center Contact Section with Animated Calling Rings */}
          <div className="my-auto text-center z-10">
            <div className="relative mx-auto flex items-center justify-center">
              {screen === "calling" && (
                <>
                  <div className="absolute h-28 w-28 animate-ping rounded-full bg-primary/25" />
                  <div className="absolute h-36 w-36 animate-pulse rounded-full bg-primary/15" />
                </>
              )}
              <span className="relative flex h-20 w-20 sm:h-22 sm:w-22 items-center justify-center rounded-full bg-primary text-3xl sm:text-4xl font-black text-primary-foreground shadow-2xl ring-4 ring-white/20">
                {sara.initials}
              </span>
            </div>

            <p className="mt-4 text-2xl font-extrabold tracking-tight text-white">{sara.name}</p>
            <p className="text-sm font-medium text-slate-300" aria-live="polite">
              {screen === "calling"
                ? ur
                  ? "سارہ کے فون پر گھنٹی جا رہی ہے..."
                  : "Calling Sara... Please wait for her to answer"
                : ur
                  ? "سارہ بات کر رہی ہیں (فرضی کال)"
                  : "Talking with Sara (Simulated Call)"}
            </p>

            {/* Dynamic Sound Wave Effect when connected */}
            {screen === "incall" && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-success">
                <Volume2 className="h-4 w-4 animate-bounce" />
                <div className="flex items-end gap-1 h-5">
                  <span className="w-1 bg-success rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2" />
                  <span className="w-1 bg-success rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-4" />
                  <span className="w-1 bg-success rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-5" />
                  <span className="w-1 bg-success rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-3" />
                  <span className="w-1 bg-success rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2" />
                </div>
              </div>
            )}
          </div>

          {/* Interactive Dial Pad Modal */}
          {showKeypad && screen === "incall" && (
            <div className="absolute inset-0 z-30 flex flex-col justify-between bg-slate-950/95 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-lg font-bold">{ur ? "ڈائل پیڈ (کی پیڈ)" : "Keypad"}</span>
                <button
                  type="button"
                  onClick={() => setShowKeypad(false)}
                  className="rounded-full bg-slate-800 p-1.5 text-slate-300 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="text-center py-2 min-h-[44px]">
                <span className="text-2xl font-mono tracking-widest text-emerald-400">
                  {dialedDigits || (ur ? "نمبر دبائیں" : "Press numbers")}
                </span>
              </div>

              {/* Grid 3x4 */}
              <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto w-full">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleDialKey(k)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-xl font-bold text-white hover:bg-slate-700 active:scale-95"
                  >
                    {k}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowKeypad(false)}
                className="btn btn-outline mt-3 w-full border-slate-700 bg-slate-900 text-slate-200"
              >
                {ur ? "کال اسکرین پر واپس جائیں" : "Back to Call Screen"}
              </button>
            </div>
          )}

          {/* Status Badges for Mute & Camera */}
          {screen === "incall" && (
            <div className="mb-4 flex flex-col gap-2 w-full max-w-xs text-center z-10">
              {muted ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-warning/20 border border-warning/40 px-3 py-1.5 text-xs font-bold text-amber-300">
                  <MicOff className="h-4 w-4" />
                  <span>{ur ? "آپ کا مائیک بند ہے — کوئی نہیں سن سکتا" : "Your mic is muted — No one can hear you"}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-success/20 border border-success/40 px-3 py-1.5 text-xs font-bold text-emerald-300">
                  <Mic className="h-4 w-4" />
                  <span>{ur ? "مائیک آن ہے — آپ کی آواز جا رہی ہے" : "Microphone is live — Sara can hear you"}</span>
                </div>
              )}

              {!cameraOn && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-warning/20 border border-warning/40 px-3 py-1.5 text-xs font-bold text-amber-300">
                  <VideoOff className="h-4 w-4" />
                  <span>{ur ? "کیمرہ بند ہے — تصویر پوشیدہ ہے" : "Camera is off — Your video is hidden"}</span>
                </div>
              )}
            </div>
          )}

          {/* Bottom Floating Control Dock with Dual Icon + Text Labels */}
          <div className="z-10 flex w-full items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-slate-900/85 p-2.5 backdrop-blur-md border border-white/10">
            {screen === "incall" && (
              <>
                {/* 1. Mute Button */}
                <div className="flex flex-col items-center gap-1">
                  <SimButton
                    action={muted ? "unmute" : "mute"}
                    highlightFor="mute"
                    onPress={control(muted ? "unmute" : "mute", () => setMuted((m) => !m))}
                    aria-label={muted ? "Unmute" : "Mute"}
                    aria-pressed={muted}
                    className={cn(
                      round,
                      muted
                        ? "bg-amber-500 text-slate-950 ring-4 ring-amber-400/40"
                        : "bg-slate-700 text-white hover:bg-slate-600",
                    )}
                  >
                    {muted ? <MicOff className="h-5 w-5 sm:h-6 sm:w-6" /> : <Mic className="h-5 w-5 sm:h-6 sm:w-6" />}
                  </SimButton>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-200 text-center">
                    {muted ? (ur ? "مائیک کھولیں" : "Unmute") : ur ? "مائیک بند کریں" : "Mute"}
                  </span>
                </div>

                {/* Video Call Specific Controls: Camera On/Off & Flip Camera */}
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
                          round,
                          !cameraOn
                            ? "bg-amber-500 text-slate-950 ring-4 ring-amber-400/40"
                            : "bg-slate-700 text-white hover:bg-slate-600",
                        )}
                      >
                        {cameraOn ? (
                          <Video className="h-5 w-5 sm:h-6 sm:w-6" />
                        ) : (
                          <VideoOff className="h-5 w-5 sm:h-6 sm:w-6" />
                        )}
                      </SimButton>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-200 text-center">
                        {cameraOn ? (ur ? "کیمرہ بند کریں" : "Camera Off") : ur ? "کیمرہ کھولیں" : "Camera On"}
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
                        className={cn(round, "bg-slate-700 text-white hover:bg-slate-600")}
                      >
                        <SwitchCamera className="h-5 w-5 sm:h-6 sm:w-6" />
                      </button>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-200 text-center">
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
                          round,
                          speakerOn
                            ? "bg-primary text-primary-foreground"
                            : "bg-slate-700 text-white hover:bg-slate-600",
                        )}
                      >
                        {speakerOn ? (
                          <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
                        ) : (
                          <VolumeX className="h-5 w-5 sm:h-6 sm:w-6" />
                        )}
                      </button>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-200 text-center">
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
                        className={cn(round, "bg-slate-700 text-white hover:bg-slate-600")}
                      >
                        <Grid3X3 className="h-5 w-5 sm:h-6 sm:w-6" />
                      </button>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-200 text-center">
                        {ur ? "کی پیڈ" : "Keypad"}
                      </span>
                    </div>
                  </>
                )}
              </>
            )}

            {/* 4. End Call Button */}
            <div className="flex flex-col items-center gap-1">
              <SimButton
                action="end"
                onPress={handleEndCall}
                aria-label="End call"
                className={cn(
                  round,
                  "bg-destructive text-destructive-foreground hover:bg-destructive/90 ring-4 ring-destructive/30",
                )}
              >
                <PhoneOff className="h-5 w-5 sm:h-6 sm:w-6" />
              </SimButton>
              <span className="text-[10px] sm:text-[11px] font-bold text-destructive-foreground text-center">
                {ur ? "کال کاٹیں" : "End Call"}
              </span>
            </div>
          </div>
        </div>
      )}

      {screen === "done" && (
        <div className="space-y-5 rounded-2xl bg-card p-6 text-center shadow-md">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success ring-4 ring-success/20">
            <CheckCircle2 className="h-12 w-12" />
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-heading">
              {ur ? "شاباش! کال کامیابی سے ختم ہوئی" : "Well Done! Call Successfully Ended"}
            </h3>
            <p className="mt-2 text-base font-medium text-muted-foreground">
              {ur
                ? "آپ نے ویڈیو کال ملانا، مائیک بند کرنا اور کال کاٹنا سیکھ لیا ہے۔"
                : "You learned how to start a call, manage microphone, and hang up safely."}
            </p>
          </div>

          {/* Accidental Hangup Recovery / Practice Again */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                callSounds.playTap();
                engine.reset();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-primary bg-mint px-4 py-2.5 text-sm font-bold text-primary-strong hover:bg-mint/80 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{ur ? "دوبارہ کال ملائیں (ایک اور مشق)" : "Call Again (Practise Once More)"}</span>
            </button>
          </div>

          <div className="rounded-xl border border-border bg-mint/50 p-3 text-xs font-semibold text-primary-strong">
            {ur
              ? "یاد رکھیں: یہ صرف ایک مشق تھی۔ کسی بھی فون کال پر کوئی چارجز نہیں کٹے۔"
              : "Remember: This was only practice. No phone credit or charges were used."}
          </div>

          <div className="pt-2">
            <CompletionActions />
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
