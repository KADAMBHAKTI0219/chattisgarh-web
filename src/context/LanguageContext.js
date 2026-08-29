"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { HINDI_DICTIONARY, CG_DICTIONARY } from "@/utils/translations";

const LanguageContext = createContext();

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "cg", label: "छत्तीसगढ़ी" },
];

const GOOGLE_LANG_MAP = {
  en: "en",
  hi: "hi",
  cg: "hi", // Use Hindi ISO for Google Translate API fallback
};

const LANG_STORAGE_KEY = "site-lang";
const CACHE_STORAGE_KEY = "google-translation-api-cache-v12";

// Helper to validate translation results and reject API error messages
const isValidTranslation = (trans, origText) => {
  if (!trans || typeof trans !== "string") return false;
  if (trans.trim() === origText.trim()) return false;
  const upper = trans.toUpperCase();
  if (
    upper.includes("INVALID") ||
    upper.includes("WARNING") ||
    upper.includes("LANGPAIR") ||
    upper.includes("EXAMPLE:") ||
    upper.includes("IS AN INVALID")
  ) {
    return false;
  }
  return true;
};

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
        const parsed = JSON.parse(savedCache);
        const cleaned = {};
        for (const [k, v] of Object.entries(parsed)) {
          const origText = k.split(":").slice(1).join(":");
          if (isValidTranslation(v, origText)) {
            cleaned[k] = v;
          }
        }
        setTranslationCache(cleaned);
      }
    } catch (e) {
      console.warn("Failed to load Google translation cache", e);
    }
  }, []);

  // Google Translate API fetcher with API key support and free GTX client fallback
  const fetchGoogleTranslation = useCallback(async (text, targetLang) => {
    const cacheKey = `${targetLang}:${text}`;
    if (pendingRequests.current.has(cacheKey)) return;

    pendingRequests.current.add(cacheKey);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_KEY;
      let translatedText = "";

      if (apiKey) {
        // Official Google Cloud Translation API v2
        const res = await fetch(
          `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              q: text,
              target: targetLang,
              source: "en",
              format: "text",
            }),
          }
        );
        if (res.ok) {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("json")) {
            const data = await res.json();
            translatedText = data?.data?.translations?.[0]?.translatedText;
          }
        }
      } else {
        // Free Google Translate client fallback (gtx)
        const primaryLang = (targetLang === "cg" || targetLang === "hne") ? "hne" : targetLang;
        const res = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${primaryLang}&dt=t&q=${encodeURIComponent(text)}`
        );
        if (res.ok) {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("json") || contentType.includes("javascript")) {
            const data = await res.json();
            if (Array.isArray(data?.[0])) {
              translatedText = data[0].map((item) => item?.[0] || "").join("");
            }
          }
        }

        // Fallback to Hindi if Chhattisgarhi code returns unmodified text or fails
        if (!isValidTranslation(translatedText, text) && (targetLang === "cg" || targetLang === "hne")) {
          const fallbackRes = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`
          );
          if (fallbackRes.ok) {
            const contentType = fallbackRes.headers.get("content-type") || "";
            if (contentType.includes("json") || contentType.includes("javascript")) {
              const fallbackData = await fallbackRes.json();
              if (Array.isArray(fallbackData?.[0])) {
                translatedText = fallbackData[0].map((item) => item?.[0] || "").join("");
              }
            }
          }
        }
      }

      // Validate translation before caching
      if (isValidTranslation(translatedText, text)) {
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
      // Silently swallow fetch or network errors for non-essential translations
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

      // 4. Google Translation Cache Lookup
      const targetLang = GOOGLE_LANG_MAP[language] || "hi";
      const cacheKey = `${targetLang}:${text}`;

      if (translationCache[cacheKey] && isValidTranslation(translationCache[cacheKey], text)) {
        return translationCache[cacheKey];
      }

      // 5. Trigger non-blocking Google online fetch for uncached strings
      fetchGoogleTranslation(text, targetLang);

      // Return original text as fallback while fetching
      return text;
    },
    [language, translationCache, fetchGoogleTranslation]
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