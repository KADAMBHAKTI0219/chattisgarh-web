"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function CulturalQuoteSection() {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-white py-16 md:py-24 border-b border-[var(--border)] select-none">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12 flex flex-col items-center text-center gap-6">
        
        {/* Subtle Bastar Tribal Diamond Emblem */}
        <div className="flex items-center gap-3 text-[var(--primary)]">
          <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--primary)]" />
          <span className="text-sm font-bold tracking-widest text-[var(--primary)] uppercase">
            ◆ BASTAR TRIBAL HERITAGE ◆
          </span>
          <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--primary)]" />
        </div>

        {/* Large Quotation Mark */}
        <span className="font-poppins font-black text-6xl md:text-8xl text-[var(--primary)]/20 leading-none -mb-8">
          “
        </span>

        {/* Quote Text */}
        <blockquote className="font-poppins font-bold text-2xl sm:text-3xl md:text-4xl text-[var(--heading)] leading-snug max-w-3xl">
          {t(
            "Behind every creator is a story. Behind every story is a place worth discovering. Chhattisgarh shines when your content inspires the nation."
          )}
        </blockquote>

        {/* Author Attribution */}
        <div className="flex flex-col items-center gap-1 pt-4">
          <span className="font-poppins font-bold text-sm sm:text-base text-[var(--primary)] uppercase tracking-wider">
            {t("Government of Chhattisgarh")}
          </span>
          <span className="font-inter font-medium text-xs text-[var(--text-secondary)]">
            {t("Department of Culture & Tourism")}
          </span>
        </div>

      </div>
    </section>
  );
}