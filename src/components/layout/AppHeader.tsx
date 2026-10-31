import { Link } from "@tanstack/react-router";
import { BookOpen, CircleHelp, Home, Languages } from "lucide-react";
import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const navLink =
  "inline-flex min-h-12 items-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-[0.9rem] sm:px-3 sm:text-base font-semibold text-heading hover:bg-mint [&.active]:bg-mint [&.active]:text-primary-strong";

export function AppHeader() {
  const { t, toggle, lang } = useLanguage();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link to="/" className="me-auto flex items-center gap-3" aria-label={t("brand")}>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-xl font-black text-primary-foreground">T</span>
          <span>
            <span className="block text-xl font-extrabold leading-tight text-heading">TechSaathi</span>
            <span className="hidden text-sm text-muted-foreground sm:block">{t("tagline")}</span>
          </span>
        </Link>
        <nav aria-label="Main" className="order-3 flex w-full gap-1 sm:order-none sm:w-auto">
          <Link to="/" className={navLink} activeOptions={{ exact: true }}><Home className="h-5 w-5" />{t("navHome")}</Link>
          <Link to="/my-learning" className={navLink}><BookOpen className="h-5 w-5" />{t("navMyLearning")}</Link>
          <Link to="/help" className={navLink}><CircleHelp className="h-5 w-5" />{t("navHelp")}</Link>
        </nav>
        <button type="button" onClick={toggle} className="btn btn-outline min-h-12 px-4" aria-label={t("langSwitchLabel")} lang={lang === "en" ? "ur" : "en"}>
          <Languages className="h-5 w-5" /> {t("langSwitch")}
        </button>
      </div>
    </header>
  );
}

export function PageContainer({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">{children}</main>;
}
