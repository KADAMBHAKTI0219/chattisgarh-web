"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { ParticipateButton } from "@/components/common/Button";

const DESKTOP_HERO_IMAGE = "/assets/images/herosection.png";
const MOBILE_HERO_IMAGE = "/assets/images/mob-hero.png";

export default function HeroSection() {
  const { openModal } = useParticipateModal();
  const { t } = useLanguage();

  return (
    <section
      id="hero-section"
      className="relative flex flex-col items-center justify-center text-center w-full max-w-full overflow-hidden select-none"
    >
      {/* Hero Banner Container */}
      <div className="relative w-full max-w-full flex items-center justify-center overflow-hidden bg-[#FAF7F0]">
        {/* Hero Background Image — Desktop */}
        <img
          src={DESKTOP_HERO_IMAGE}
          alt="Hero Background Banner"
          className="hidden lg:block w-full h-auto max-w-full object-cover select-none shrink-0 z-0 border-0 outline-none"
          draggable={false}
        />

        {/* Hero Background Image — Mobile */}
        <img
          src={MOBILE_HERO_IMAGE}
          alt="Hero Background Banner"
          className="block lg:hidden w-full h-auto max-w-full object-cover select-none shrink-0 z-0 border-0 outline-none"
          draggable={false}
        />

        {/* Participate Now Button */}
        <div className="absolute bottom-[42%] sm:bottom-[44%] md:bottom-[45%] lg:bottom-[14%] xl:bottom-[15%] left-5 lg:left-16 xl:left-20 inset-x-0 z-20 flex justify-center px-4">
          <ParticipateButton
            onClick={openModal}
            size="lg"
            className="text-xs sm:text-base md:text-lg px-5 py-2.5 sm:px-8 sm:py-3.5 shadow-[0_8px_22px_rgba(238,93,140,0.5)] cursor-pointer hover:scale-105 transition-all"
          >
            {t("Participate Now")}
          </ParticipateButton>
        </div>
      </div>
    </section>
  );
}