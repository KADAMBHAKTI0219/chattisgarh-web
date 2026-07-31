"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { ParticipateButton } from "@/components/common/Button";

// Desktop and mobile slides arrays
const DESKTOP_SLIDES = [
  "/assets/images/herosection.png",
  "/assets/images/herosection-2.png",
  "/assets/images/herosection-3.png",
];

const MOBILE_SLIDES = [
  "/assets/images/mob-hero.png",
  "/assets/images/mob-hero-2.png",
  "/assets/images/mob-hero-3.png",
];

const AUTOPLAY_MS = 3500;

export default function HeroSection() {
  const { openModal } = useParticipateModal();
  const { t } = useLanguage();

  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const total = DESKTOP_SLIDES.length;
  const timerRef = useRef(null);

  const goTo = (idx) => setCurrent(((idx % total) + total) % total);

  // Autoplay timer
  useEffect(() => {
    if (total <= 1 || isHovered) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [current, isHovered, total]);

  return (
    <section
      id="hero-section"
      className="relative flex flex-col items-center justify-center text-center w-full max-w-full overflow-hidden select-none"
    >
      {/* 1. Banner Carousel Container */}
      <div
        className="relative w-full max-w-full flex items-center justify-center overflow-hidden bg-[#FAF7F0]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hero Background Images — Desktop */}
        <div className="hidden lg:block relative w-full max-w-full overflow-hidden">
          <div
            className="flex w-full transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {DESKTOP_SLIDES.map((src, i) => (
              <img
                key={src + i}
                src={src}
                alt="Hero Background Banner"
                className="w-full h-auto max-w-full object-cover select-none shrink-0 z-0 block border-0 outline-none"
                draggable={false}
              />
            ))}
          </div>
        </div>

        {/* Hero Background Images — Mobile */}
        <div className="block lg:hidden relative w-full max-w-full overflow-hidden">
          <div
            className="flex w-full transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${(current % MOBILE_SLIDES.length) * 100}%)` }}
          >
            {MOBILE_SLIDES.map((src, i) => (
              <img
                key={src + i}
                src={src}
                alt="Hero Background Banner"
                className="w-full h-auto max-w-full object-cover select-none shrink-0 z-0 block border-0 outline-none"
                draggable={false}
              />
            ))}
          </div>
        </div>

        {/* Slide indicators — only shown when there's more than one slide */}
        {total > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-20 flex justify-center gap-2">
            {DESKTOP_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === current ? "w-6 bg-[#EE5D8C]" : "w-1.5 bg-black/20 hover:bg-black/35"
                  }`}
              />
            ))}
          </div>
        )}

        {/* Apply Now Button — ONLY rendered on the FIRST slide (current === 0) */}
        {current === 0 && (
          <div className="absolute inset-x-0 bottom-[45%] sm:bottom-[45%] md:bottom-[45%] lg:bottom-[15%] xl:bottom-[15%] z-20 flex justify-center px-2">
            <ParticipateButton
              onClick={openModal}
              size="lg"
              className="text-xs sm:text-base md:text-lg px-4 py-2.5 sm:px-8 sm:py-3.5 shadow-[0_8px_22px_rgba(238,93,140,0.5)]"
            >
              {t("Participate Now")}
            </ParticipateButton>
          </div>
        )}
      </div>
    </section>
  );
}