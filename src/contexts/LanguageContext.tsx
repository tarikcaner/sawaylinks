"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { t as translate, type Language, type TranslationKey } from "@/lib/i18n";

type TFunction = (key: TranslationKey, params?: Record<string, string | number>) => string;

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TFunction;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "admin_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("tr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "tr") {
      setLangState(stored);
    }
    setMounted(true);
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  }, []);

  const t: TFunction = useCallback(
    (key, params) => translate(key, lang, params),
    [lang]
  );

  // Avoid hydration mismatch - render with default lang until mounted
  const contextT: TFunction = useCallback(
    (key, params) => translate(key, mounted ? lang : "tr", params),
    [lang, mounted]
  );

  return (
    <LanguageContext.Provider value={{ lang: mounted ? lang : "tr", setLang, t: contextT }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT(): TFunction {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback for components outside provider (shouldn't happen in admin)
    return (key, params) => translate(key, "tr", params);
  }
  return ctx.t;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return { lang: "tr" as Language, setLang: () => {} };
  }
  return { lang: ctx.lang, setLang: ctx.setLang };
}
