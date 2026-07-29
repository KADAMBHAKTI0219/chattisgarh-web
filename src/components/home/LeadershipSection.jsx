"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function LeadershipSection() {
  const { t } = useLanguage();

  return (
    <section 
      id="leadership" 
      className="relative w-full max-w-7xl xl:max-w-[1400px] mx-auto py-8 md:py-16 px-4 sm:px-6 md:px-8 select-none overflow-hidden"
    >
      {/* Heading */}
      <div className="flex flex-col items-center justify-center gap-3 text-center mb-12 md:mb-16">
        <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-widest text-[#BE2079]">
          {t("TRUST & VISION")}
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight leading-none text-zinc-950">
          {t("LEADERSHIP")}{" "}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BE2079] to-[#E64C8A]">{t("MESSAGES")}</span>
        </h2>
        <div className="h-[4px] w-24 bg-gradient-to-r from-[#BE2079] to-[#E64C8A] rounded-full mt-1"></div>
      </div>

      {/* Leadership Messages Dual Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        
        {/* PM Message */}
        <div className="reveal-child flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white border border-zinc-200 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Photo */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-3 border-[#BE2079] shrink-0 shadow-inner bg-zinc-50">
            <Image
              src="/assets/images/modi.png"
              alt={t("Shri Narendra Modi")}
              fill
              className="object-cover object-top"
              sizes="128px"
            />
          </div>
          {/* Content */}
          <div className="flex flex-col text-center sm:text-left gap-3">
            <div className="flex flex-col gap-0.5">
              <h3 className="font-display font-black text-lg sm:text-xl text-zinc-950 leading-tight">
                {t("Shri Narendra Modi")}
              </h3>
              <span className="font-sans font-extrabold text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500">
                {t("Hon'ble Prime Minister of India")}
              </span>
            </div>
            <div className="relative">
              <span className="absolute -top-4 -left-2 text-5xl font-serif text-[#BE2079]/20 select-none">“</span>
              <p className="text-zinc-700 font-bold text-xs sm:text-sm leading-relaxed relative z-10 italic pl-1">
                {t("Digital India is a journey to empower every citizen. Digital creators are highlighting the creativity, diversity, and talent of our nation to the entire world.")}
              </p>
            </div>
          </div>
        </div>

        {/* CM Message */}
        <div className="reveal-child flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white border border-zinc-200 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Photo */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-3 border-[#BE2079] shrink-0 shadow-inner bg-zinc-50">
            <Image
              src="/assets/images/cm.jpg"
              alt={t("Shri Vishnu Deo Sai")}
              fill
              className="object-cover object-top"
              sizes="128px"
            />
          </div>
          {/* Content */}
          <div className="flex flex-col text-center sm:text-left gap-3">
            <div className="flex flex-col gap-0.5">
              <h3 className="font-display font-black text-lg sm:text-xl text-zinc-950 leading-tight">
                {t("Shri Vishnu Deo Sai")}
              </h3>
              <span className="font-sans font-extrabold text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500">
                {t("Hon'ble Chief Minister of Chhattisgarh")}
              </span>
            </div>
            <div className="relative">
              <span className="absolute -top-4 -left-2 text-5xl font-serif text-[#BE2079]/20 select-none">“</span>
              <p className="text-zinc-700 font-bold text-xs sm:text-sm leading-relaxed relative z-10 italic pl-1">
                {t("Our creators are shaping the digital narrative of Chhattisgarh. Through their voices, we are showcasing the rich culture, progress, and hospitality of our state.")}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
