import { createFileRoute, Link } from "@tanstack/react-router";
import { PageContainer } from "@/components/layout/AppHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { modules } from "@/data/modules";

export const Route = createFileRoute("/my-learning")({
  head: () => ({
    meta: [
      { title: "My Learning — TechSaathi" },
      { name: "description", content: "See the lessons you have practised, saved on this device only." },
      { property: "og:title", content: "My Learning — TechSaathi" },
      { property: "og:description", content: "Your practice history, saved on this device." },
    ],
  }),
  component: MyLearningPage,
});

function MyLearningPage() {
  const { t, tr } = useLanguage();
  const { store, clear, loaded } = useLearningProgress();
  const practised = modules.filter((m) => store.records.some((r) => r.moduleId === m.id));

  return (
    <PageContainer>
      <h1 className="text-[2rem] font-extrabold">{t("myLearningTitle")}</h1>
      {loaded && practised.length === 0 && <p className="mt-4 max-w-2xl text-xl">{t("myLearningEmpty")}</p>}
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {practised.map((m) => {
          const recs = store.records.filter((r) => r.moduleId === m.id);
          const last = recs[recs.length - 1];
          return (
            <li key={m.id} className="card-surface p-5">
              <h2 className="text-xl font-bold">{tr(m.title)}</h2>
              <p className="mt-1 text-lg">
                {last.completed ? t("completed") : t("stopped")} · {last.mode === "guide" ? t("guideMe") : t("letMeTry")}
              </p>
              <p className="text-base text-muted-foreground">
                {t("incorrectAttempts")}: {last.mistakes} · {t("hintsUsed")}: {last.hints}
              </p>
              <Link to="/results/$moduleId" params={{ moduleId: m.id }} className="btn btn-outline mt-4">{t("viewSummary")}</Link>
            </li>
          );
        })}
      </ul>
      {practised.length > 0 && (
        <button type="button" className="btn btn-ghost mt-8" onClick={() => window.confirm("Clear all saved progress on this device?") && clear()}>
          {t("clearProgress")}
        </button>
      )}
    </PageContainer>
  );
}
