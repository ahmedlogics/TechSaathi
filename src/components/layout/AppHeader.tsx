import { Link } from "@tanstack/react-router";
import { BookOpen, CircleHelp, Home, Languages } from "lucide-react";
import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const navLink =
  "inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-[0.85rem] sm:px-3 sm:text-sm font-semibold text-heading hover:bg-mint [&.active]:bg-mint [&.active]:text-primary-strong transition-colors";

export function AppHeader() {
  const { t, toggle, lang } = useLanguage();
  return (
    <header className="h-13 sm:h-14 shrink-0 z-30 border-b border-border bg-card flex items-center px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group" aria-label={t("brand")}>
          <img
            src="/logo.png"
            alt="TechSaathi Logo"
            className="h-8 sm:h-9 w-auto max-w-[180px] sm:max-w-[220px] object-contain transition-transform group-hover:scale-[1.02]"
          />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label="Main" className="hidden sm:flex items-center gap-1">
            <Link to="/" className={navLink} activeOptions={{ exact: true }}><Home className="h-4 w-4" />{t("navHome")}</Link>
            <Link to="/my-learning" className={navLink}><BookOpen className="h-4 w-4" />{t("navMyLearning")}</Link>
            <Link to="/help" className={navLink}><CircleHelp className="h-4 w-4" />{t("navHelp")}</Link>
          </nav>
          <button type="button" onClick={toggle} className="btn btn-outline h-8 sm:h-9 min-h-0 px-3 text-xs sm:text-sm" aria-label={t("langSwitchLabel")} lang={lang === "en" ? "ur" : "en"}>
            <Languages className="h-4 w-4" /> {t("langSwitch")}
          </button>
        </div>
      </div>
    </header>
  );
}

export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`flex-1 min-h-0 w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 ${className ?? ""}`}>{children}</div>;
}
