import { Building2, Camera, CheckCircle2, ExternalLink, Fingerprint, HeartPulse, ShieldCheck, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CompletionActions, SimButton, useLesson } from "@/components/learning/LessonContext";
import { PhoneFrame } from "@/components/learning/PhoneFrame";
import { pakIdQuestions } from "@/data/scenarios";

const icons = { shield: ShieldCheck, heart: HeartPulse, users: Users, camera: Camera, fingerprint: Fingerprint, building: Building2 };

export function ProofOfLifeSimulator() {
  const { engine } = useLesson();
  const { tr, lang } = useLanguage();
  const ur = lang === "ur";
  const step = engine.step;
  const q = pakIdQuestions[step.id];

  return (
    <PhoneFrame appName={ur ? "پاک آئی ڈی مشق" : "Practice PakID"}>
      <p className="mb-4 rounded-lg bg-warning-soft p-2 text-center text-sm font-bold text-warning">
        {ur ? "نادرا سے منسلک نہیں • کوئی شناخت کی تصدیق نہیں" : "Not affiliated with NADRA • No identity verification"}
      </p>
      {q && (
        <div className="space-y-4">
          {(() => { const Icon = icons[q.icon]; return <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-mint"><Icon className="h-10 w-10 text-primary-strong" /></span>; })()}
          <h3 className="text-center text-xl font-bold">{tr(step.title)}</h3>
          <p className="text-base">{tr(step.body)}</p>
          <p className="text-lg font-bold text-heading">{tr(q.question)}</p>
          {q.options.map((o) => (
            <SimButton key={o.id} action={o.id} className="w-full rounded-xl border-2 border-border bg-card p-4 text-start text-lg font-semibold text-heading hover:border-primary">
              {tr(o.label)}
            </SimButton>
          ))}
        </div>
      )}
      {step.screen === "done" && (
        <div className="space-y-4 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
          <p className="text-lg font-semibold text-heading">{tr(step.body)}</p>
          <a href="https://www.nadra.gov.pk" target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full">
            {ur ? "نادرا کی آفیشل ویب سائٹ" : "Official NADRA website"} <ExternalLink className="h-5 w-5" />
          </a>
          <p className="text-sm text-muted-foreground">{ur ? "سرکاری طریقہ کار اور اسکرینز بدل سکتی ہیں۔ تازہ معلومات نادرا سے لیں۔" : "Official procedures and screens may change. Always check NADRA for current information."}</p>
          <CompletionActions />
        </div>
      )}
    </PhoneFrame>
  );
}
