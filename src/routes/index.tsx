import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, PlayCircle } from "lucide-react";
import { PageContainer } from "@/components/layout/AppHeader";
import { moduleVisual } from "@/components/home/moduleIcons";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { getModule, modules } from "@/data/modules";

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
        <h1 className="text-[2rem] font-extrabold sm:text-[2.6rem]">{t("heroTitle")}</h1>
        <p className="mt-3 text-xl">{t("heroBody")}</p>
        <p className="mt-5 inline-flex items-start gap-2 rounded-xl bg-mint px-4 py-3 text-base font-semibold text-primary-strong">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" /> {t("reassurance")}
        </p>
      </section>

      {last && store.lastVisited && (
        <section className="card-surface mt-8 flex flex-wrap items-center gap-4 p-5" aria-labelledby="continue-h">
          <PlayCircle className="h-10 w-10 text-primary" />
          <div className="flex-1">
            <h2 id="continue-h" className="text-xl font-bold">{t("continueLearning")}</h2>
            <p>{t("continueBody")} <strong className="text-heading">{tr(last.title)}</strong></p>
          </div>
          <Link to="/practice/$moduleId" params={{ moduleId: last.id }} search={{ mode: store.lastVisited.mode }} className="btn btn-primary">
            {t("continue")} <ArrowRight className="h-5 w-5 rtl:rotate-180" />
          </Link>
        </section>
      )}

      <section className="mt-10 grid gap-5 md:grid-cols-2" aria-label="Lessons">
        {modules.map((m) => {
          const { icon: Icon, tone } = moduleVisual[m.id];
          return (
            <Link
              key={m.id}
              to="/learn/$moduleId"
              params={{ moduleId: m.id }}
              className="card-surface group flex flex-col gap-4 p-6 transition-colors hover:border-primary sm:p-7"
            >
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
