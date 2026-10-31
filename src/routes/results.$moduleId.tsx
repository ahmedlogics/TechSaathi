import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, Flag } from "lucide-react";
import { PageContainer } from "@/components/layout/AppHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { getModule } from "@/data/modules";

export const Route = createFileRoute("/results/$moduleId")({
  loader: ({ params }) => {
    const m = getModule(params.moduleId);
    if (!m) throw notFound();
    return { title: m.title.en };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Your results: ${loaderData?.title ?? "Lesson"} — TechSaathi` },
      { name: "description", content: "A summary of your practice: steps, mistakes and hints used." },
      { property: "og:title", content: `Your results: ${loaderData?.title ?? "Lesson"} — TechSaathi` },
      { property: "og:description", content: "A summary of your practice on TechSaathi." },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const { moduleId } = Route.useParams();
  const m = getModule(moduleId)!;
  const { t, tr } = useLanguage();
  const { latestFor, loaded } = useLearningProgress();
  const r = latestFor(m.id);
  if (!loaded) return <PageContainer><p className="text-lg">…</p></PageContainer>;

  const rows: [string, string][] = r
    ? [
        [t("lesson"), tr(m.title)],
        [t("completedSteps"), `${r.completedSteps} / ${r.totalSteps}`],
        [t("incorrectAttempts"), String(r.mistakes)],
        [t("hintsUsed"), String(r.hints)],
        [t("learningMode"), r.mode === "guide" ? t("guideMe") : t("letMeTry")],
        [t("independentDone"), r.mode === "practice" && r.completed ? t("yes") : t("notPracticedAlone")],
      ]
    : [];

  return (
    <PageContainer>
      <div className="card-surface mx-auto max-w-2xl p-6 sm:p-10">
        {r ? (
          <>
            {r.completed ? <CheckCircle2 className="h-14 w-14 text-success" /> : <Flag className="h-14 w-14 text-warning" />}
            <h1 className="mt-3 text-[2rem] font-extrabold">{r.completed ? t("resultsTitle") : t("resultsIncomplete")}</h1>
            <dl className="mt-6 divide-y divide-border rounded-xl border border-border text-lg">
              {rows.map(([k, v]) => (
                <div key={k} className="flex flex-wrap justify-between gap-2 p-4">
                  <dt>{k}</dt>
                  <dd className="font-bold text-heading">{v}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <h1 className="text-2xl font-bold">{t("resultsNone")}</h1>
        )}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Link to="/practice/$moduleId" params={{ moduleId: m.id }} search={{ mode: r?.mode ?? "guide" }} className="btn btn-outline">{t("tryAgain")}</Link>
          <Link to="/practice/$moduleId" params={{ moduleId: m.id }} search={{ mode: "practice" }} className="btn btn-primary">{t("tryWithoutHelp")}</Link>
          <Link to="/" className="btn btn-ghost">{t("backHome")}</Link>
        </div>
      </div>
    </PageContainer>
  );
}
