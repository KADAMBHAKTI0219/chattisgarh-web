"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { ParticipateButton } from "@/components/common/Button";

const DESKTOP_HERO_IMAGE = "/assets/images/webBannerr.png";
const MOBILE_HERO_IMAGE = "/assets/images/mobile.png";

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
        {/* Responsive Hero Banner Picture */}
        <picture className="w-full h-auto max-w-full flex items-center justify-center">
          <source media="(min-width: 1024px)" srcSet={DESKTOP_HERO_IMAGE} />
          <img
            src={MOBILE_HERO_IMAGE}
            alt="Chhattisgarh State Creator & Influencer Awards 2026 Banner"
            className="w-full h-auto max-w-full object-contain select-none shrink-0 z-0 border-0 outline-none transform-gpu"
            decoding="async"
            loading="eager"
            fetchPriority="high"
            draggable={false}
          />
        </picture>

        {/* Overlay Participate CTA Button at the bottom of hero image */}
        <div className="absolute bottom-[46%] lg:bottom-[16%] xl:bottom-[20%] z-10 flex items-center justify-center ">
          <ParticipateButton
            onClick={openModal}
            size="lg"
            className="px-2 sm:px-6 lg:px-8 py-2 sm:py-3.5 text-xs sm:text-base md:text-lg font-bold shadow-[0_8px_30px_rgba(193,91,61,0.5)] hover:shadow-[0_12px_40px_rgba(193,91,61,0.7)] hover:scale-105 transition-all duration-30"
          >
            {t("Participate Now")}
          </ParticipateButton>
        </div>
      </div>
    </section>
  );
}