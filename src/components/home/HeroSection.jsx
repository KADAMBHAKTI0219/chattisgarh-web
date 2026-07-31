"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { ParticipateButton } from "@/components/common/Button";

export default function HeroSection() {
  const { openModal } = useParticipateModal();
  const { t } = useLanguage();

  return (
    <section
      id="hero-section"
      className="flex flex-col items-center justify-center text-center w-full overflow-visible"
    >

      {/* 1. Banner Container */}
      <div className="relative w-full flex items-center justify-center overflow-hidden bg-[#FAF7F0]">

        {/* Hero Background Image - Desktop (full image, no cropping) */}
        <img
          src="/assets/images/herosection.png"
          alt="Hero Background Banner"
          className="hidden lg:block relative w-full h-auto object-contain select-none z-0"
        />

        {/* Hero Background Image - Mobile (full image, no cropping) */}
        <img
          src="/assets/images/mob-hero.png"
          alt="Hero Background Banner"
          className="block lg:hidden relative w-full h-auto object-contain select-none z-0"
        />

        {/* Apply Now Button — overlaid at the bottom of the banner image */}
        <div className="absolute inset-x-0 bottom-[45%] sm:bottom-[45%] md:bottom-[45%] lg:bottom-[15%] xl:bottom-[15%] z-20 flex justify-center px-2">
          <ParticipateButton
            onClick={openModal}
            size="lg"
            className="text-xs sm:text-base md:text-lg px-6 py-2.5 sm:px-8 sm:py-3.5 shadow-[0_8px_22px_rgba(238,93,140,0.5)]"
          >
            {t("Participate Now")}
          </ParticipateButton>
        </div>

      </div>

    </section>
  );
}