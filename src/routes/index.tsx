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
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-heading leading-tight">{t("heroTitle")}</h1>
        <p className="mt-1.5 text-sm sm:text-base text-foreground/80 leading-relaxed max-w-2xl">{t("heroBody")}</p>
        <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-teal-200/80 bg-mint px-3 py-1 text-xs font-semibold text-primary-strong shadow-2xs">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" /> {t("reassurance")}
        </p>
      </section>

      {last && store.lastVisited && (
        <section className="card-surface mt-3.5 sm:mt-4 flex flex-wrap items-center gap-3 p-3 sm:p-4 rounded-xl" aria-labelledby="continue-h">
          <PlayCircle className="h-7 w-7 text-primary shrink-0" />
          <div className="flex-1 min-w-[200px]">
            <h2 id="continue-h" className="text-base sm:text-lg font-bold text-heading">{t("continueLearning")}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{t("continueBody")} <strong className="text-heading font-semibold">{tr(last.title)}</strong></p>
          </div>
          <Link to="/practice/$moduleId" params={{ moduleId: last.id }} search={{ mode: store.lastVisited.mode }} className="btn btn-primary min-h-[36px] py-1.5 px-3.5 text-xs sm:text-sm font-bold rounded-lg">
            {t("continue")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </section>
      )}

      <section className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 md:grid-cols-2" aria-label="Lessons">
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
              className={`card-surface group relative flex flex-col gap-3 sm:gap-3.5 overflow-hidden p-4 sm:p-5 transition-all hover:border-primary ${
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
                  <div className="pointer-events-none absolute -bottom-8 -right-8 opacity-[0.08] select-none text-emerald-950 transition group-hover:opacity-[0.13]">
                    <NadraLogo className="h-44 w-44" />
                  </div>
                  <div className="pointer-events-none absolute top-3.5 right-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100/80 px-2 py-0.5 text-[10px] font-bold text-emerald-900 shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      NADRA • POLC
                    </span>
                  </div>
                </>
              )}

              {/* Send Money Watermark & Badge */}
              {isMoney && (
                <>
                  <div className="pointer-events-none absolute -bottom-8 -right-8 opacity-[0.08] select-none text-teal-950 transition group-hover:opacity-[0.13]">
                    <PaymentWatermark className="h-44 w-44" />
                  </div>
                  <div className="pointer-events-none absolute top-3.5 right-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-mint/80 px-2 py-0.5 text-[10px] font-bold text-primary-strong shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                      1LINK • WALLET
                    </span>
                  </div>
                </>
              )}

              {/* Book a Ride Watermark & Badge */}
              {isRide && (
                <>
                  <div className="pointer-events-none absolute -bottom-8 -right-8 opacity-[0.08] select-none text-sky-950 transition group-hover:opacity-[0.13]">
                    <RideWatermark className="h-44 w-44" />
                  </div>
                  <div className="pointer-events-none absolute top-3.5 right-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky/80 px-2 py-0.5 text-[10px] font-bold text-heading shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                      GPS • ROUTE
                    </span>
                  </div>
                </>
              )}

              {/* Audio & Video Calls Watermark & Badge */}
              {isCalls && (
                <>
                  <div className="pointer-events-none absolute -bottom-8 -right-8 opacity-[0.08] select-none text-emerald-950 transition group-hover:opacity-[0.13]">
                    <CallWatermark className="h-44 w-44" />
                  </div>
                  <div className="pointer-events-none absolute top-3.5 right-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-2 py-0.5 text-[10px] font-bold text-emerald-900 shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      WHATSAPP • CALL
                    </span>
                  </div>
                </>
              )}

              <span className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="h-6 w-6" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold">{tr(m.title)}</h2>
              <p className="flex-1 text-xs sm:text-sm text-foreground/80 leading-relaxed">{tr(m.description)}</p>
              <span className="btn btn-primary self-start min-h-[36px] py-1.5 px-3.5 text-xs sm:text-sm font-semibold rounded-lg">
                {tr(m.cardAction)} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </span>
            </Link>
          );
        })}
      </section>
    </PageContainer>
  );
}
