"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { ParticipateButton } from "@/components/common/Button";

const DESKTOP_HERO_IMAGE = "/assets/images/herosection.png";
const MOBILE_HERO_IMAGE = "/assets/images/mob-hero.jpeg";

export default function HeroSection() {
  const { openModal } = useParticipateModal();
  const { t } = useLanguage();

  return (
    <section
      id="hero-section"
      className="relative w-full max-w-full overflow-hidden bg-[#FAF7F0] select-none leading-none"
    >
      {/* Hero Banner Container */}
      <div className="relative w-full max-w-full overflow-hidden flex items-center justify-center">
        {/* Hero Background Image — Desktop */}
        <img
          src={DESKTOP_HERO_IMAGE}
          alt="Chhattisgarh State Creator & Influencer Awards 2026 Banner"
          className="hidden lg:block w-full h-auto max-w-full object-contain select-none shrink-0 z-0 border-0 outline-none transform-gpu"
          decoding="async"
          loading="eager"
          fetchPriority="high"
          draggable={false}
        />

        {/* Hero Background Image — Mobile */}
        <img
          src={MOBILE_HERO_IMAGE}
          alt="Hero Background Banner"
          className="block lg:hidden w-full h-auto max-w-full object-contain select-none shrink-0 z-0 border-0 outline-none transform-gpu"
          decoding="async"
          loading="eager"
          fetchPriority="high"
          draggable={false}
        />

        {/* Overlay Participate CTA Button at the bottom of hero image */}
        <div className="absolute bottom-[40%] lg:bottom-[14%] xl:bottom-[18%] z-10 flex items-center justify-center lg:right-[44%]  xl:right-[47%]">
          <ParticipateButton
            onClick={openModal}
            size="lg"
            className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3.5 text-xs sm:text-base md:text-lg font-bold shadow-[0_8px_30px_rgba(193,91,61,0.5)] hover:shadow-[0_12px_40px_rgba(193,91,61,0.7)] hover:scale-105 transition-all duration-30"
          >
            {t("Participate Now")}
          </ParticipateButton>
        </div>
      </div>
    </section>
  );
}