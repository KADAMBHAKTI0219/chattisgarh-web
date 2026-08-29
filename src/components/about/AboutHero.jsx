"use client";

import Image from "next/image";
import Link from "next/link";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutHero() {
  const { openModal } = useParticipateModal();
  const { t } = useLanguage();

  const stats = [
    { value: "500+", label: t("Digital Creators") },
    { value: "18+", label: t("Award Categories") },
    { value: "33", label: t("Districts Covered") },
    { value: "100%", label: t("Government Initiative") },
  ];

  return (
    <section className="relative w-full max-w-[1280px] mx-auto py-12 md:py-16 px-6 md:px-12 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        
        {/* Left Column: Content & Stats */}
        <div className="lg:col-span-7 flex flex-col items-start text-left gap-5">
          {/* Government Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5 text-[var(--primary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-poppins font-bold uppercase tracking-widest">
              {t("OFFICIAL GOVERNMENT INITIATIVE")}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-poppins font-extrabold text-[var(--heading)] tracking-tight leading-[1.15]">
            {t("Participate To Put")}{" "}
            <span className="text-[var(--primary)]">Chhattisgarh</span>{" "}
            {t("On The Global Map")}
          </h1>

          {/* Supporting Paragraph */}
          <p className="text-xs sm:text-sm md:text-base text-[var(--text-secondary)] font-inter leading-relaxed max-w-xl">
            {t(
              "The Chhattisgarh State Creator & Influencer Awards is a flagship initiative by the Government of Chhattisgarh to celebrate creators who transform the state’s culture, heritage, tourism, innovation, and everyday stories into inspiring digital experiences for India and the world. Every piece of content that celebrates Chhattisgarh contributes to preserving its heritage while introducing its unique culture, traditions, and values to a wider audience."
            )}
          </p>

          {/* Alternative Headlines Tags / Badges */}
          <div className="flex flex-wrap gap-2 pt-1 max-w-xl">
            <span className="text-[10px] sm:text-xs font-inter font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200">
              ✨ {t("Where Local Stories Earn Global Recognition")}
            </span>
            <span className="text-[10px] sm:text-xs font-inter font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200">
              🌟 {t("Every reel is a remarkable reality")}
            </span>
            <span className="text-[10px] sm:text-xs font-inter font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200">
              🔥 {t("When You Create, Chhattisgarh Shines")}
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={openModal}
              className="px-6 py-3 rounded-full bg-[var(--primary)] hover:bg-[#a84926] text-white font-poppins font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {t("Participate Now")} →
            </button>

            <Link
              href="/categories"
              className="px-6 py-3 rounded-full bg-white border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)] font-poppins font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow-md transition-all duration-300"
            >
              {t("Explore Categories")}
            </Link>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-6 mt-2 border-t border-[var(--border)] w-full">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col text-left">
                <span className="text-xl sm:text-2xl font-poppins font-extrabold text-[var(--heading)]">
                  {stat.value}
                </span>
                <span className="text-[11px] sm:text-xs font-inter font-medium text-[var(--text-secondary)] mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Clean Structured Grid Collage */}
        <div className="lg:col-span-5 flex flex-col gap-4 w-full">
          
          {/* Top 1st Image: Full Width, Half Height */}
          <div className="relative w-full h-[230px] sm:h-[250px] rounded-3xl overflow-hidden border-2 border-white shadow-lg group">
            <Image
              src="/assets/images/chattisgarh_fall.jpg"
              alt="Chitrakote Falls Chhattisgarh"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-poppins font-bold text-white uppercase tracking-wider">
              {t("WATERFALLS & NATURE")}
            </div>
          </div>

          {/* Bottom Row: 2 Divs with 50% Width Each */}
          <div className="grid grid-cols-2 gap-4 w-full">
            
            {/* Bottom Left Image (50% width) */}
            <div className="relative w-full h-[180px] sm:h-[200px] rounded-3xl overflow-hidden border-2 border-white shadow-lg group">
              <Image
                src="/assets/images/raipur_landmark.jpg"
                alt="Sirpur Heritage Temple"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 22vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-poppins font-bold text-white uppercase tracking-wider">
                {t("ANCIENT HERITAGE")}
              </div>
            </div>

            {/* Bottom Right Image (50% width) */}
            <div className="relative w-full h-[180px] sm:h-[200px] rounded-3xl overflow-hidden border-2 border-white shadow-lg group">
              <Image
                src="/assets/images/event-5.jpg"
                alt="Chhattisgarh Cultural Performers"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 22vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-poppins font-bold text-white uppercase tracking-wider">
                {t("CULTURAL CREATORS")}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}