"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function CulturalQuoteSection() {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-white py-12 md:py-20 border-b border-[var(--border)] select-none">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12 flex flex-col items-center text-center gap-5">
        
        {/* Subtle Bastar Tribal Diamond Emblem */}
        <div className="flex items-center gap-3 text-[var(--primary)]">
          <span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[var(--primary)]" />
          <span className="text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
            ◆ {t("BASTAR TRIBAL HERITAGE")} ◆
          </span>
          <span className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[var(--primary)]" />
        </div>

        {/* Govt of Chhattisgarh Message Badge */}
        <span className="text-[10px] font-poppins font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#C45A32]/10 text-[#C45A32] border border-[#C45A32]/20">
          {t("Govt of Chhattisgarh message")}
        </span>

        {/* Quote Text */}
        <blockquote className="font-poppins font-bold text-lg sm:text-xl md:text-2xl text-[var(--heading)] leading-snug max-w-3xl">
          {t(
            "“When creators preserve culture, they preserve the soul of a state. Every story shared today becomes a legacy remembered tomorrow. Through creativity, heritage becomes legacy, and legacy becomes inspiration for generations.”"
          )}
        </blockquote>

        {/* Author Attribution */}
        <div className="flex flex-col items-center gap-0.5 pt-2">
          <span className="font-poppins font-bold text-xs sm:text-sm text-[var(--primary)] uppercase tracking-wider">
            {t("Government of Chhattisgarh")}
          </span>
        </div>

      </div>
    </section>
  );
}