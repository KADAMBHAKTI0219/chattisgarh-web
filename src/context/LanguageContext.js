"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { HINDI_DICTIONARY, CG_DICTIONARY } from "@/utils/translations";

const LanguageContext = createContext();

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "cg", label: "छत्तीसगढ़ी" },
];

const MS_LANG_MAP = {
  en: "en",
  hi: "hi",
  cg: "hne", // Official Microsoft Azure / Bing Translator ISO code for Chhattisgarhi (hne)
};

const LANG_STORAGE_KEY = "site-lang";
const CACHE_STORAGE_KEY = "ms-translation-api-cache-v3";

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const [translationCache, setTranslationCache] = useState({});
  const pendingRequests = useRef(new Set());

  // Load saved language and persistent cache on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANG_STORAGE_KEY) || "en";
    if (SUPPORTED_LANGUAGES.some((l) => l.code === savedLanguage)) {
      setLanguage(savedLanguage);
    }

    try {
      const savedCache = localStorage.getItem(CACHE_STORAGE_KEY);
      if (savedCache) {
        setTranslationCache(JSON.parse(savedCache));
      }
    } catch (e) {
      console.warn("Failed to load Microsoft translation cache", e);
    }
  }, []);

  // Microsoft Translator API fetcher with Azure key support and free fallback
  const fetchMicrosoftTranslation = useCallback(async (text, targetLang) => {
    const cacheKey = `${targetLang}:${text}`;
    if (pendingRequests.current.has(cacheKey)) return;

    pendingRequests.current.add(cacheKey);

    try {
      const apiKey = process.env.NEXT_PUBLIC_MICROSOFT_TRANSLATOR_KEY;
      const apiRegion = process.env.NEXT_PUBLIC_MICROSOFT_TRANSLATOR_REGION || "global";
      let translatedText = "";

      if (apiKey) {
        // Official Microsoft Azure Translator REST API v3.0 (Supports 'hne' and 'cg')
        const res = await fetch(
          `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=${targetLang}`,
          {
            method: "POST",
            headers: {
              "Ocp-Apim-Subscription-Key": apiKey,
              "Ocp-Apim-Subscription-Region": apiRegion,
              "Content-Type": "application/json",
            },
            body: JSON.stringify([{ Text: text }]),
          }
        );
        const data = await res.json();
        translatedText = data?.[0]?.translations?.[0]?.text;
      } else {
        // Try Microsoft Chhattisgarhi ISO code 'hne' first, then 'cg', then 'hi'
        let res = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}&de=ms-translator@cg.gov.in`
        );
        let data = await res.json();
        translatedText = data?.responseData?.translatedText;

        if (!translatedText || translatedText.includes("WARNING") || translatedText === text) {
          const fallbackRes = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|cg&de=ms-translator@cg.gov.in`
          );
          const fallbackData = await fallbackRes.json();
          translatedText = fallbackData?.responseData?.translatedText;
        }

        if (!translatedText || translatedText.includes("WARNING") || translatedText === text) {
          const fallbackRes = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi&de=ms-translator@cg.gov.in`
          );
          const fallbackData = await fallbackRes.json();
          translatedText = fallbackData?.responseData?.translatedText;
        }
      }

      // Store in memory & localStorage cache
      if (translatedText && translatedText !== text && !translatedText.includes("WARNING")) {
        setTranslationCache((prev) => {
          const updated = { ...prev, [cacheKey]: translatedText };
          try {
            localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(updated));
          } catch (e) {
            // localStorage full fallback
          }
          return updated;
        });
      }
    } catch (err) {
      console.warn(`Microsoft Translator failed for "${text}":`, err.message);
    } finally {
      pendingRequests.current.delete(cacheKey);
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

  // Main translation function used everywhere via useLanguage().t("...")
  const translate = useCallback(
    (text) => {
      if (!text || typeof text !== "string") return text || "";

      // 1. English is source language
      if (language === "en") return text;

      // 2. Chhattisgarhi Lookup (Checks CG_DICTIONARY first, then HINDI_DICTIONARY)
      if (language === "cg") {
        if (CG_DICTIONARY[text]) return CG_DICTIONARY[text];
        if (HINDI_DICTIONARY[text]) return HINDI_DICTIONARY[text];
      }

      // 3. Hindi Lookup (Checks HINDI_DICTIONARY)
      if (language === "hi") {
        if (HINDI_DICTIONARY[text]) return HINDI_DICTIONARY[text];
      }

      // 4. Microsoft Translation Cache Lookup
      const targetLang = MS_LANG_MAP[language] || "hi";
      const cacheKey = `${targetLang}:${text}`;

      if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
      }

      // 5. Trigger non-blocking Microsoft online fetch for uncached strings
      fetchMicrosoftTranslation(text, targetLang);

      // Return original text as fallback while fetching
      return text;
    },
    [language, translationCache, fetchMicrosoftTranslation]
  );

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