"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";

export default function HeroSection() {
  const { openModal } = useParticipateModal();
  const { t } = useLanguage();

  return (
    <section 
      id="hero-section" 
      className="flex flex-col items-center justify-center text-center w-full overflow-visible"
    >

      {/* 1. Banner Container */}
      {/* Mobile: full-screen height, image cropped to fill (object-cover) */}
      {/* Tablet (md) & Desktop (lg+): height follows each image's own aspect ratio, so the FULL image is always visible, nothing cropped */}
      <div className="relative w-full min-h-screen md:min-h-0 md:h-auto flex items-center justify-center overflow-hidden bg-[#FAF7F0]">

        {/* Hero Background Image - Desktop (full image, no cropping) */}
        <img
          src="/assets/images/herosection.png"
          alt="Hero Background Banner"
          className="hidden lg:block relative w-full h-auto object-contain select-none z-0"
        />

        {/* Hero Background Image - Mobile */}
        <img
          src="/assets/images/mob-hero.png"
          alt="Hero Background Banner"
          className="relative w-full h-auto object-contain pointer-events-none select-none z-0 opacity-100 block md:hidden"
        />

        {/* Hero Background Image - Tablet (full image, no cropping) */}
        <img
          src="/assets/images/tablet-hero.png"
          alt="Hero Background Banner"
          className="relative w-full h-auto object-contain pointer-events-none select-none z-0 opacity-100 hidden md:block lg:hidden"
        />

        {/* Apply Now Button — overlaid at the bottom of the banner image, styled to match the banner's pink pill button */}
        <div className="absolute inset-x-0 bottom-1/2 sm:bottom-1/2 md:bottom-1/3 lg:bottom-1/4 xl:bottom-1/5 z-20 flex justify-center px-4">
          <button
            onClick={openModal}
            className="rounded-full bg-gradient-to-b from-[#F798B4] to-[#EE5D8C] hover:from-[#F9A5BE] hover:to-[#E64C8A] px-8 py-3.5 sm:px-6 sm:py-2 font-black text-white text-sm sm:text-base md:text-lg tracking-widest shadow-[0_8px_20px_rgba(230,76,138,0.45)] hover:shadow-[0_10px_24px_rgba(230,76,138,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer select-none"
          >
            {t("Apply Now")}
          </button>
        </div>

      </div>

    </section>
  );
}