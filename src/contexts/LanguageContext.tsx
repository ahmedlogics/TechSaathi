import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { ui, type UiKey } from "@/data/translations";
import type { Lang, LocalText } from "@/types/learning";

const STORAGE_KEY = "techsaathi.lang";

interface LanguageValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** Translate a UI dictionary key. */
  t: (key: UiKey) => string;
  /** Translate a local text object (falls back to English). */
  tr: (text: LocalText | undefined) => string;
}

const LanguageContext = createContext<LanguageValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "ur" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const tr = useCallback(
    (text: LocalText | undefined) => (text ? (lang === "ur" && text.ur ? text.ur : text.en) : ""),
    [lang],
  );
  const t = useCallback((key: UiKey) => tr(ui[key]), [tr]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle: () => setLang(lang === "en" ? "ur" : "en"), t, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
