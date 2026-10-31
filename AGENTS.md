<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Lessons are data (`src/data/modules.ts`); a shared reducer (`src/hooks/useLessonEngine.ts`) advances steps only when a simulator reports the step's expected action — keeps guidance and simulators in sync.
- Simulator controls use `SimButton` from `LessonContext` so highlighting/hints work uniformly.
- All UI text goes through `useLanguage()` (`t` for dictionary keys, `tr` for `{en, ur}` objects, English fallback).
- Frontend-only: progress and language live in localStorage; no backend by product requirement.
