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
      <Link to="/" className="btn btn-ghost -ms-3 mb-4"><ArrowLeft className="h-5 w-5 rtl:rotate-180" /> {t("backHome")}</Link>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <section>
          <span className={`flex h-16 w-16 items-center justify-center rounded-2xl ${tone}`}><Icon className="h-9 w-9" /></span>
          <h1 className="mt-4 text-[2rem] font-extrabold sm:text-[2.4rem]">{tr(m.introTitle)}</h1>
          <p className="mt-3 text-xl">{tr(m.intro)}</p>
          <h2 className="mt-8 text-xl font-bold">{t("youWillLearn")}</h2>
          <ul className="mt-3 space-y-3">
            {m.learnPoints.map((p) => (
              <li key={p.en} className="flex items-start gap-3 text-lg">
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mint"><Check className="h-4 w-4 text-primary-strong" /></span>
                {tr(p)}
              </li>
            ))}
          </ul>
          <p className="mt-6 inline-flex items-center gap-2 rounded-xl bg-warning-soft px-4 py-2 font-semibold text-warning">
            <ShieldCheck className="h-5 w-5" /> {tr(m.safetyNote)}
          </p>
        </section>
        <section className="flex flex-col gap-4" aria-label="Choose how to learn">
          <Link to="/practice/$moduleId" params={{ moduleId: m.id }} search={{ mode: "guide" }} className="card-surface flex items-center gap-4 border-2 border-primary p-6 hover:bg-mint">
            <Compass className="h-12 w-12 shrink-0 text-primary" />
            <span className="flex-1">
              <span className="mb-1 inline-block rounded-full bg-primary px-3 py-0.5 text-sm font-bold text-primary-foreground">{t("recommended")}</span>
              <span className="block text-2xl font-bold text-heading">{t("guideMe")}</span>
              <span className="block text-lg">{t("guideMeSub")}</span>
            </span>
          </Link>
          <Link to="/practice/$moduleId" params={{ moduleId: m.id }} search={{ mode: "practice" }} className="card-surface flex items-center gap-4 p-6 hover:border-primary">
            <Hand className="h-12 w-12 shrink-0 text-heading" />
            <span className="flex-1">
              <span className="block text-2xl font-bold text-heading">{t("letMeTry")}</span>
              <span className="block text-lg">{t("letMeTrySub")}</span>
            </span>
          </Link>
        </section>
      </div>
    </PageContainer>
  );
}
