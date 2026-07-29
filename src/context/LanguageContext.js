"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const LanguageContext = createContext();

// The 3 supported languages. Any component that renders a language switcher
// should read this list from useLanguage() instead of hardcoding options,
// so adding/removing a language only ever needs to happen here.
export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "cg", label: "छत्तीसगढ़ी" }, // Chhattisgarhi
];

// Maps our internal language codes to the language codes Google Translate
// actually understands. IMPORTANT: Google Translate has NO Chhattisgarhi
// model at all (its ISO code "hne" is rejected with a 400 by the API — this
// isn't a bug, the language just isn't supported by Google). Since
// Chhattisgarhi is written in Devanagari and is treated as a dialect of
// Hindi, we route "cg" to Hindi as the closest available real translation
// instead of silently failing or fabricating one.
const GOOGLE_LANG_MAP = {
  en: "en",
  hi: "hi",
  cg: "hi", // fallback: Google Translate has no Chhattisgarhi model
};

const CACHE_STORAGE_KEY = "translation-api-cache";
const LANG_STORAGE_KEY = "site-lang";

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const [translationCache, setTranslationCache] = useState({});

  // Queue references for rate-limiting API connections
  const queue = useRef([]);
  const activeCount = useRef(0);

  // Load saved language + cache on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANG_STORAGE_KEY);
    if (savedLanguage && SUPPORTED_LANGUAGES.some((l) => l.code === savedLanguage)) {
      setLanguage(savedLanguage);
    }

    try {
      const savedCache = localStorage.getItem(CACHE_STORAGE_KEY);
      if (savedCache) {
        setTranslationCache(JSON.parse(savedCache));
      }
    } catch (e) {
      console.error("Failed to parse translation cache", e);
    }
  }, []);

  const changeLanguage = useCallback((lang) => {
    if (!SUPPORTED_LANGUAGES.some((l) => l.code === lang)) {
      console.warn(`Unsupported language code: ${lang}`);
      return;
    }
    setLanguage(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, []);

  // Sequentially process translation queue with a max concurrency of 3,
  // hitting Google Translate's public endpoint directly. There is no
  // manual/static dictionary anymore — every language (Hindi + Chhattisgarhi)
  // is produced live by Google Translate and cached locally after the first fetch.
  const processQueue = useCallback(async () => {
    if (queue.current.length === 0 || activeCount.current >= 3) return;

    activeCount.current += 1;
    const { text, targetLang } = queue.current.shift();
    const cacheKey = `${targetLang}:${text}`;

    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
      );

      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType || !contentType.includes("application/json")) {
        throw new Error(`Google Translate returned invalid format or code: ${response.status}`);
      }

      const data = await response.json();
      // Google returns the translation split into sentence chunks —
      // join them back into one string.
      const translated = Array.isArray(data?.[0])
        ? data[0].map((chunk) => chunk?.[0]).filter(Boolean).join("")
        : null;

      if (translated) {
        setTranslationCache((prev) => {
          const updated = { ...prev, [cacheKey]: translated };
          try {
            localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(updated));
          } catch (e) {
            // localStorage may be full — cache still works in-memory for this session
            console.warn("Could not persist translation cache", e);
          }
          return updated;
        });
      }
    } catch (error) {
      console.warn("Google Translate fetch failed:", error.message);
    } finally {
      activeCount.current -= 1;
      // Trigger processing of next queued requests
      processQueue();
    }
  }, []);

  const translateText = useCallback((text, targetLang) => {
    const cacheKey = `${targetLang}:${text}`;

    // Skip duplicate items already queued
    if (queue.current.some((item) => item.text === text && item.targetLang === targetLang)) {
      return;
    }

    queue.current.push({ text, targetLang });
    processQueue();
  }, [processQueue]);

  // Translator: English passes through untouched; Hindi and Chhattisgarhi are
  // both resolved purely via Google Translate (with a stale-while-revalidate
  // cache) — no hardcoded/manual text lives in the components or here.
  const translate = useCallback((text) => {
    if (!text) return "";

    // 1. English is the source language — return as-is
    if (language === "en") return text;

    const apiTargetLang = GOOGLE_LANG_MAP[language] || language;
    const cacheKey = `${apiTargetLang}:${text}`;

    // 2. Already translated & cached from a previous fetch
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    // 3. Not cached yet — queue it for translation (throttled, max 3 concurrent)
    translateText(text, apiTargetLang);

    // Return the original English text as a stale fallback while the
    // translation is fetched in the background; the component re-renders
    // automatically once translationCache updates.
    return text;
  }, [language, translationCache, translateText]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage: language,
        language,
        changeLanguage,
        setLanguage: changeLanguage,
        languages: SUPPORTED_LANGUAGES,
        t: translate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}