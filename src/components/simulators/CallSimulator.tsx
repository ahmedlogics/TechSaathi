import { useEffect, useState } from "react";
import { CheckCircle2, Mic, MicOff, Phone, PhoneOff, Video, VideoOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CompletionActions, SimButton, useLesson } from "@/components/learning/LessonContext";
import { PhoneFrame } from "@/components/learning/PhoneFrame";
import { callContacts } from "@/data/scenarios";
import { cn } from "@/lib/utils";

const round = "flex h-16 w-16 items-center justify-center rounded-full";

export function CallSimulator() {
  const { engine } = useLesson();
  const { lang } = useLanguage();
  const ur = lang === "ur";
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const screen = engine.step.screen;
  const expected = engine.step.expected;

  // Simulated outgoing call connects after a short ring.
  useEffect(() => {
    if (screen !== "calling") return;
    setMuted(false);
    setCameraOn(true);
    const id = window.setTimeout(() => engine.act("connected"), 2500);
    return () => window.clearTimeout(id);
  }, [screen, engine.act]);

  /** Controls really toggle state, but only when it is the step being practised. */
  const control = (action: string, apply: () => void) => () => {
    if (action === expected) apply();
    engine.act(action);
  };

  const sara = callContacts[0];

  return (
    <PhoneFrame appName="Practice Call">
      {screen === "start" && (
        <div className="space-y-3 pt-6">
          <SimButton action="choose-audio" className="btn btn-outline w-full"><Phone className="h-6 w-6" /> {ur ? "آڈیو کال کی مشق (جلد)" : "Practise Audio Call (coming soon)"}</SimButton>
          <SimButton action="choose-video" className="btn btn-primary w-full"><Video className="h-6 w-6" /> {ur ? "ویڈیو کال کی مشق" : "Practise Video Call"}</SimButton>
        </div>
      )}

      {screen === "contacts" && (
        <ul className="space-y-2">
          {callContacts.map((c, i) => (
            <li key={c.id} className="flex items-center gap-3 rounded-xl border-2 border-border bg-card p-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mint text-xl font-bold text-primary-strong">{c.initials}</span>
              <span className="flex-1 text-lg font-semibold text-heading">{c.name}</span>
              <SimButton action={i === 0 ? "call-sara" : "call-other"} aria-label={`Video call ${c.name}`} className={cn(round, "h-14 w-14 bg-primary text-primary-foreground")}>
                <Video className="h-6 w-6" />
              </SimButton>
            </li>
          ))}
        </ul>
      )}

      {(screen === "calling" || screen === "incall") && (
        <div className="flex min-h-[520px] flex-col items-center justify-between rounded-2xl bg-phone p-6 text-primary-foreground">
          <div className="text-center">
            <span className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-primary text-5xl font-bold">{sara.initials}</span>
            <p className="mt-3 text-2xl font-bold">{sara.name}</p>
            <p className="text-base" aria-live="polite">
              {screen === "calling" ? (ur ? "کال ہو رہی ہے…" : "Calling…") : ur ? "منسلک — فرضی کال" : "Connected — pretend call"}
            </p>
          </div>
          {screen === "incall" && (
            <div className="rounded-lg bg-primary-strong px-3 py-1 text-sm">
              {ur ? "مائیک" : "Mic"}: {muted ? (ur ? "بند" : "Off") : ur ? "آن" : "On"} · {ur ? "کیمرہ" : "Camera"}: {cameraOn ? (ur ? "آن" : "On") : ur ? "بند" : "Off"}
            </div>
          )}
          <div className="flex gap-5">
            {screen === "incall" && (
              <>
                <SimButton
                  action={muted ? "unmute" : "mute"}
                  highlightFor="mute"
                  onPress={control(muted ? "unmute" : "mute", () => setMuted((m) => !m))}
                  aria-label={muted ? "Unmute" : "Mute"}
                  aria-pressed={muted}
                  className={cn(round, muted ? "bg-card text-heading" : "bg-primary-strong")}
                >{muted ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}</SimButton>
                <SimButton
                  action={cameraOn ? "camera-off" : "camera-on"}
                  highlightFor="camera-off"
                  onPress={control(cameraOn ? "camera-off" : "camera-on", () => setCameraOn((c) => !c))}
                  aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}
                  aria-pressed={!cameraOn}
                  className={cn(round, !cameraOn ? "bg-card text-heading" : "bg-primary-strong")}
                >{cameraOn ? <Video className="h-7 w-7" /> : <VideoOff className="h-7 w-7" />}</SimButton>
              </>
            )}
            <SimButton action="end" aria-label="End call" className={cn(round, "bg-destructive text-destructive-foreground")}>
              <PhoneOff className="h-7 w-7" />
            </SimButton>
          </div>
        </div>
      )}

      {screen === "done" && (
        <div className="space-y-4 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
          <p className="text-lg font-semibold text-heading">{ur ? "کال ختم ہو گئی۔ یہ اصل کال نہیں تھی۔" : "Call ended. This was not a real phone call."}</p>
          <CompletionActions />
        </div>
      )}
    </PhoneFrame>
  );
}
