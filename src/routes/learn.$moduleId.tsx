import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Compass, Hand, ShieldCheck } from "lucide-react";
import { PageContainer } from "@/components/layout/AppHeader";
import { moduleVisual } from "@/components/home/moduleIcons";
import { useLanguage } from "@/contexts/LanguageContext";
import { getModule } from "@/data/modules";
import { PakIDLanding } from "@/features/pakid/PakIDLanding";

export const Route = createFileRoute("/learn/$moduleId")({
  loader: ({ params }) => {
    const m = getModule(params.moduleId);
    if (!m) throw notFound();
    return { title: m.introTitle.en, intro: m.intro.en };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — TechSaathi` : "Lesson — TechSaathi" },
      { name: "description", content: loaderData?.intro ?? "TechSaathi lesson" },
      { property: "og:title", content: loaderData ? `${loaderData.title} — TechSaathi` : "Lesson — TechSaathi" },
      { property: "og:description", content: loaderData?.intro ?? "TechSaathi lesson" },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const { moduleId } = Route.useParams();
  if (moduleId === "proof-of-life") {
    return <PakIDLanding />;
  }
  const m = getModule(moduleId)!;
  const { t, tr } = useLanguage();
  const { icon: Icon, tone } = moduleVisual[m.id];

  return (
    <PageContainer>
      <Link to="/" className="btn btn-ghost -ms-3 mb-6 inline-flex items-center gap-2 font-semibold">
        <ArrowLeft className="h-5 w-5 rtl:rotate-180" /> {t("backHome")}
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12 items-start">
        <section className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className={`flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl ${tone} shadow-xs`}>
                <Icon className="h-8 w-8 sm:h-9 sm:w-9" />
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading tracking-tight leading-tight">
                {tr(m.introTitle)}
              </h1>
            </div>
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed">
              {tr(m.intro)}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-heading">{t("youWillLearn")}</h2>
            <ul className="mt-3.5 space-y-3">
              {m.learnPoints.map((p) => (
                <li key={p.en} className="flex items-start gap-3 text-base sm:text-lg text-foreground/90">
                  <span className="mt-1 flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-mint text-primary-strong">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="leading-snug">{tr(p)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2">
            <p className="inline-flex items-center gap-2 rounded-xl bg-warning-soft px-4 py-2.5 text-sm sm:text-base font-semibold text-warning border border-warning/20">
              <ShieldCheck className="h-5 w-5 shrink-0" /> {tr(m.safetyNote)}
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4 lg:pt-1" aria-label="Choose how to learn">
          <Link
            to="/practice/$moduleId"
            params={{ moduleId: m.id }}
            search={{ mode: "guide" }}
            className="card-surface flex items-center gap-4 rounded-3xl border-2 border-primary bg-card p-5 sm:p-6 shadow-sm hover:bg-mint hover:shadow-md transition-all active:scale-[0.99] group"
          >
            <Compass className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 text-primary transition-transform group-hover:scale-105" />
            <span className="flex-1 min-w-0">
              <span className="mb-1 inline-block rounded-full bg-primary px-3 py-0.5 text-xs sm:text-sm font-bold text-primary-foreground">
                {t("recommended")}
              </span>
              <span className="block text-xl sm:text-2xl font-bold text-heading">
                {t("guideMe")}
              </span>
              <span className="block text-sm sm:text-base text-muted-foreground mt-0.5">
                {t("guideMeSub")}
              </span>
            </span>
          </Link>

          <Link
            to="/practice/$moduleId"
            params={{ moduleId: m.id }}
            search={{ mode: "practice" }}
            className="card-surface flex items-center gap-4 rounded-3xl border-2 border-border bg-card p-5 sm:p-6 shadow-sm hover:border-primary hover:shadow-md transition-all active:scale-[0.99] group"
          >
            <Hand className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 text-heading transition-transform group-hover:scale-105" />
            <span className="flex-1 min-w-0">
              <span className="block text-xl sm:text-2xl font-bold text-heading">
                {t("letMeTry")}
              </span>
              <span className="block text-sm sm:text-base text-muted-foreground mt-0.5">
                {t("letMeTrySub")}
              </span>
            </span>
          </Link>
        </section>
      </div>
    </PageContainer>
  );
}
