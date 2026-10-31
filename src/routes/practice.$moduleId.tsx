import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageContainer } from "@/components/layout/AppHeader";
import { LearningWorkspace } from "@/components/learning/LearningWorkspace";
import { getModule } from "@/data/modules";
import type { LearningMode } from "@/types/learning";

export const Route = createFileRoute("/practice/$moduleId")({
  validateSearch: (s: Record<string, unknown>): { mode: LearningMode } => ({ mode: s["mode"] === "practice" ? "practice" : "guide" }),
  loader: ({ params }) => {
    const m = getModule(params.moduleId);
    if (!m) throw notFound();
    return { title: m.title.en };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Practise: ${loaderData?.title ?? "Lesson"} — TechSaathi` },
      { name: "description", content: "Interactive practice phone with step-by-step guidance." },
      { property: "og:title", content: `Practise: ${loaderData?.title ?? "Lesson"} — TechSaathi` },
      { property: "og:description", content: "Interactive practice phone with step-by-step guidance." },
    ],
  }),
  component: PracticePage,
});

function PracticePage() {
  const { moduleId } = Route.useParams();
  const { mode } = Route.useSearch();
  const m = getModule(moduleId)!;
  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <LearningWorkspace key={`${moduleId}-${mode}`} module={m} mode={mode} />
    </div>
  );
}
