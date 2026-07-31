"use client";

import { useLanguage } from "@/context/LanguageContext";
import { FaCompass, FaAward } from "react-icons/fa";

export default function VisionMissionSection() {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-[#1c3a29] text-white py-16 md:py-24 select-none">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col gap-12">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto gap-3">
          <span className="text-xs font-poppins font-bold uppercase tracking-widest text-[#D39B2C] px-3.5 py-1 rounded-full bg-[#D39B2C]/10 border border-[#D39B2C]/30">
            {t("Strategic Direction")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-extrabold text-white tracking-tight">
            {t("Vision & Mission")}
          </h2>
          <p className="text-base text-emerald-100/80 font-inter leading-relaxed">
            {t(
              "Building a transparent, inclusive, and culturally rooted framework to empower every digital voice in Chhattisgarh."
            )}
          </p>
        </div>

        {/* 2 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">

          {/* Card 1: Vision */}
          <div className="bg-white/5 border border-white/10 hover:border-[#D39B2C]/50 rounded-[24px] p-8 md:p-10 flex flex-col items-start text-left gap-5 shadow-lg transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#D39B2C]/20 border border-[#D39B2C]/40 flex items-center justify-center text-[#D39B2C]">
              <FaCompass className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-poppins font-bold text-white tracking-tight">
              {t("Our Vision")}
            </h3>
            <p className="text-base text-emerald-50 font-inter leading-relaxed">
              {t(
                "To establish Chhattisgarh as one of India's most celebrated creator destinations, where local folklore, indigenous art, and community stories inspire millions across the world."
              )}
            </p>
          </div>

          {/* Card 2: Mission */}
          <div className="bg-white/5 border border-white/10 hover:border-[#D39B2C]/50 rounded-[24px] p-8 md:p-10 flex flex-col items-start text-left gap-5 shadow-lg transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#C15B3D]/20 border border-[#C15B3D]/40 flex items-center justify-center text-[#C15B3D]">
              <FaAward className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-poppins font-bold text-white tracking-tight">
              {t("Our Mission")}
            </h3>
            <p className="text-base text-emerald-50 font-inter leading-relaxed">
              {t(
                "To empower, verify, and honour digital creators across all 36 districts with official state recognition, transparent jury evaluations, and global platform amplification."
              )}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}