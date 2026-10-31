import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, PlayCircle } from "lucide-react";
import { PageContainer } from "@/components/layout/AppHeader";
import { moduleVisual } from "@/components/home/moduleIcons";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { getModule, modules } from "@/data/modules";
import { NadraLogo } from "@/components/icons/NadraLogo";
import { PaymentWatermark, RideWatermark, CallWatermark } from "@/components/home/ModuleWatermarks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TechSaathi — Learn Digital Skills with Confidence" },
      { name: "description", content: "Practise sending money, booking rides, video calls and more in a safe simulator made for older adults in Pakistan." },
      { property: "og:title", content: "TechSaathi — Learn Digital Skills with Confidence" },
      { property: "og:description", content: "Safe, step-by-step practice of everyday smartphone tasks. No real money, bookings or verification." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t, tr } = useLanguage();
  const { store } = useLearningProgress();
  const last = store.lastVisited ? getModule(store.lastVisited.moduleId) : undefined;

  return (
    <PageContainer>
      <section className="max-w-3xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-heading leading-tight">{t("heroTitle")}</h1>
        <p className="mt-2 text-base sm:text-lg text-foreground/80 leading-relaxed max-w-2xl">{t("heroBody")}</p>
        <p className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-mint px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-primary-strong shadow-2xs">
          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" /> {t("reassurance")}
        </p>
      </section>

      {last && store.lastVisited && (
        <section className="card-surface mt-5 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl" aria-labelledby="continue-h">
          <PlayCircle className="h-9 w-9 text-primary shrink-0" />
          <div className="flex-1 min-w-[200px]">
            <h2 id="continue-h" className="text-lg sm:text-xl font-bold text-heading">{t("continueLearning")}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{t("continueBody")} <strong className="text-heading font-semibold">{tr(last.title)}</strong></p>
          </div>
          <Link to="/practice/$moduleId" params={{ moduleId: last.id }} search={{ mode: store.lastVisited.mode }} className="btn btn-primary h-10 min-h-0 py-2 px-4 text-sm font-bold rounded-xl">
            {t("continue")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </section>
      )}

      <section className="mt-6 sm:mt-8 grid gap-4 sm:gap-5 md:grid-cols-2" aria-label="Lessons">
        {modules.map((m) => {
          const { icon: Icon, tone } = moduleVisual[m.id];
          const isPakID = m.id === "proof-of-life";
          const isMoney = m.id === "send-money";
          const isRide = m.id === "book-ride";
          const isCalls = m.id === "video-call";

          return (
            <Link
              key={m.id}
              to="/learn/$moduleId"
              params={{ moduleId: m.id }}
              className={`card-surface group relative flex flex-col gap-4 overflow-hidden p-6 transition-all hover:border-primary sm:p-7 ${
                isPakID
                  ? "border-emerald-300/80 bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/40 shadow-sm"
                  : isMoney
                  ? "border-teal-300/80 bg-gradient-to-br from-teal-50/50 via-white to-mint/30 shadow-sm"
                  : isRide
                  ? "border-sky-300/80 bg-gradient-to-br from-sky-50/50 via-white to-blue-50/30 shadow-sm"
                  : isCalls
                  ? "border-emerald-300/80 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 shadow-sm"
                  : ""
              }`}
            >
              {/* PakID Watermark & Badge */}
              {isPakID && (
                <>
                  <div className="pointer-events-none absolute -bottom-10 -right-10 opacity-[0.08] select-none text-emerald-950 transition group-hover:opacity-[0.13]">
                    <NadraLogo className="h-60 w-60" />
                  </div>
                  <div className="pointer-events-none absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900 shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      NADRA • POLC
                    </span>
                  </div>
                </>
              )}

              {/* Send Money Watermark & Badge */}
              {isMoney && (
                <>
                  <div className="pointer-events-none absolute -bottom-10 -right-10 opacity-[0.08] select-none text-teal-950 transition group-hover:opacity-[0.13]">
                    <PaymentWatermark className="h-60 w-60" />
                  </div>
                  <div className="pointer-events-none absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-mint/80 px-2.5 py-0.5 text-[11px] font-bold text-primary-strong shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                      1LINK • WALLET
                    </span>
                  </div>
                </>
              )}

              {/* Book a Ride Watermark & Badge */}
              {isRide && (
                <>
                  <div className="pointer-events-none absolute -bottom-10 -right-10 opacity-[0.08] select-none text-sky-950 transition group-hover:opacity-[0.13]">
                    <RideWatermark className="h-60 w-60" />
                  </div>
                  <div className="pointer-events-none absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky/80 px-2.5 py-0.5 text-[11px] font-bold text-heading shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                      GPS • ROUTE
                    </span>
                  </div>
                </>
              )}

              {/* Audio & Video Calls Watermark & Badge */}
              {isCalls && (
                <>
                  <div className="pointer-events-none absolute -bottom-10 -right-10 opacity-[0.08] select-none text-emerald-950 transition group-hover:opacity-[0.13]">
                    <CallWatermark className="h-60 w-60" />
                  </div>
                  <div className="pointer-events-none absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900 shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      WHATSAPP • CALL
                    </span>
                  </div>
                </>
              )}

              <span className={`flex h-16 w-16 items-center justify-center rounded-2xl ${tone}`}>
                <Icon className="h-9 w-9" />
              </span>
              <h2 className="text-2xl font-bold">{tr(m.title)}</h2>
              <p className="flex-1 text-lg">{tr(m.description)}</p>
              <span className="btn btn-primary self-start">
                {tr(m.cardAction)} <ArrowRight className="h-5 w-5 rtl:rotate-180" />
              </span>
            </Link>
          );
        })}
      </section>
    </PageContainer>
  );
}
