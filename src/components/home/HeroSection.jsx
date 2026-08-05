"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { ParticipateButton } from "@/components/common/Button";

const DESKTOP_HERO_IMAGE = "/assets/images/herosection.jpeg";
const MOBILE_HERO_IMAGE = "/assets/images/mob-hero-2.png";

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

      </div>


    </section>
  );
}