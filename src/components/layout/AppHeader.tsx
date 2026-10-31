import { Link } from "@tanstack/react-router";
import { BookOpen, CircleHelp, Home, Languages } from "lucide-react";
import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const navLink =
  "inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-[0.85rem] sm:px-3 sm:text-sm font-semibold text-heading hover:bg-mint [&.active]:bg-mint [&.active]:text-primary-strong transition-colors";

export function AppHeader() {
  const { t, toggle, lang } = useLanguage();
  return (
    <header className="h-14 sm:h-16 shrink-0 z-30 border-b border-border bg-card flex items-center px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group" aria-label={t("brand")}>
          <img
            src="/logo.png"
            alt="TechSaathi Logo"
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl object-cover shadow-xs border border-border/50 group-hover:scale-105 transition-transform"
          />
          <span>
            <span className="block text-lg sm:text-xl font-extrabold leading-tight text-heading">TechSaathi</span>
            <span className="hidden text-xs text-muted-foreground sm:block">{t("tagline")}</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label="Main" className="hidden sm:flex items-center gap-1">
            <Link to="/" className={navLink} activeOptions={{ exact: true }}><Home className="h-4 w-4" />{t("navHome")}</Link>
            <Link to="/my-learning" className={navLink}><BookOpen className="h-4 w-4" />{t("navMyLearning")}</Link>
            <Link to="/help" className={navLink}><CircleHelp className="h-4 w-4" />{t("navHelp")}</Link>
          </nav>
          <button type="button" onClick={toggle} className="btn btn-outline h-9 sm:h-10 min-h-0 px-3 text-xs sm:text-sm" aria-label={t("langSwitchLabel")} lang={lang === "en" ? "ur" : "en"}>
            <Languages className="h-4 w-4" /> {t("langSwitch")}
          </button>
        </div>
      </div>
    </header>
  );
}

export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={`flex-1 min-h-0 overflow-y-auto w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 ${className ?? ""}`}>{children}</main>;
}
