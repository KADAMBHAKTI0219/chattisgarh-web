"use client";

import { useLanguage } from "@/context/LanguageContext";
import { FaCompass, FaAward } from "react-icons/fa";

export default function VisionMissionSection() {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-[#1c3a29] text-white py-12 md:py-20 select-none">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col gap-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-2.5">
          <span className="text-[11px] font-poppins font-bold uppercase tracking-widest text-[#D39B2C] px-3.5 py-1 rounded-full bg-[#D39B2C]/10 border border-[#D39B2C]/30">
            {t("STRATEGIC DIRECTION")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-extrabold text-white tracking-tight">
            {t("Vision & Mission")}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 font-inter leading-relaxed">
            {t(
              "Empowering creators. Preserving culture. Building Chhattisgarh’s digital future—creating tomorrow’s digital Icons of Chhattisgarh."
            )}
          </p>
        </div>

        {/* 2 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">

          {/* Card 1: Vision */}
          <div className="bg-white/5 border border-white/10 hover:border-[#D39B2C]/50 rounded-[20px] p-6 sm:p-8 flex flex-col items-start text-left gap-4 shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-[#D39B2C]/20 border border-[#D39B2C]/40 flex items-center justify-center text-[#D39B2C]">
              <FaCompass className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-poppins font-bold text-white tracking-tight">
              {t("Vision")}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-50 font-inter leading-relaxed">
              {t(
                "We envision a future where creators become the true ambassadors of Chhattisgarh, transforming its heritage, tourism, tribal identity, art, and everyday life into stories that inspire millions across India and the world."
              )}
            </p>
          </div>

          {/* Card 2: Mission */}
          <div className="bg-white/5 border border-white/10 hover:border-[#D39B2C]/50 rounded-[20px] p-6 sm:p-8 flex flex-col items-start text-left gap-4 shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-[#C15B3D]/20 border border-[#C15B3D]/40 flex items-center justify-center text-[#C15B3D]">
              <FaAward className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-poppins font-bold text-white tracking-tight">
              {t("Mission")}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-50 font-inter leading-relaxed">
              {t(
                "Through a transparent selection process, expert jury evaluation, and government recognition, we aim to celebrate creativity, encourage cultural storytelling, and empower creators from every district to build a stronger digital identity for the state."
              )}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}