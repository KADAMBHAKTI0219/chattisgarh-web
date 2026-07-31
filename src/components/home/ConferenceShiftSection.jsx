"use client";

import { useState, useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Heading from "@/components/common/Heading";

export default function ConferenceShiftSection() {
  const { t } = useLanguage();
  const [heroIndex, setHeroIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const autoTimerRef = useRef(null);

  // Array of local high-quality Chhattisgarh event/culture images for automatic & manual shuffling
  const heroImages = [
    "/assets/images/event-1.jpg",
    "/assets/images/event-2.jpg",
    "/assets/images/event-3.jpg",
    "/assets/images/event-4.jpg",
    "/assets/images/event-5.jpg",
    "/assets/images/event-6.jpg",
    "/assets/images/event-7.jpg",
    "/assets/images/event-8.jpg",
    "/assets/images/event-9.jpg",
    "/assets/images/event-10.jpg"
  ];

  const totalHero = heroImages.length;

  const goToNext = () => {
    setDirection(1);
    setHeroIndex((prev) => (prev + 1) % totalHero);
  };

  // Auto shuffle every 4.5 seconds
  useEffect(() => {
    autoTimerRef.current = setInterval(() => {
      goToNext();
    }, 4500);

    return () => clearInterval(autoTimerRef.current);
  }, [totalHero]);

  const restartAutoShuffle = () => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => {
      goToNext();
    }, 4500);
  };

  const handleShuffleClick = () => {
    goToNext();
    restartAutoShuffle();
  };

  return (
    <section
      id="about-event"
      className="w-full bg-background border-t border-b border-border text-foreground py-12 md:py-16 lg:py-20 flex flex-col items-center select-none relative overflow-hidden z-10 my-8 md:my-12 scroll-mt-24"
    >
      {/* Background Forest Green Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[var(--secondary)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* ================= LEFT IMAGE / RIGHT CONTENT ================= */}
      <div className="w-full max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center relative z-10">
        
        {/* Left: Auto-shuffling Photo Stack */}
        <div className="relative w-full order-1 flex justify-center py-4">
          <div className="relative w-full max-w-md">
            {/* Decorative Forest Green & Terracotta striped backdrop */}
            <div className="absolute -inset-3.5 rounded-[32px] overflow-hidden -rotate-3 -z-10 shadow-lg border border-[var(--secondary)]/30">
              <div className="w-full h-full flex">
                <div className="flex-1 bg-[var(--secondary)]"></div>
                <div className="flex-1 bg-[var(--accent)]"></div>
                <div className="flex-1 bg-[var(--primary)]"></div>
                <div className="flex-1 bg-[var(--secondary)]"></div>
                <div className="flex-1 bg-[var(--accent)]"></div>
              </div>
            </div>

            {/* Tilted photo card */}
            <div className="relative w-full aspect-[4/4.6] rounded-[28px] overflow-hidden border-2 border-[var(--secondary)]/40 shadow-2xl bg-surface rotate-2">
              {heroImages.map((src, idx) => {
                const isActive = idx === heroIndex;
                const isPrev = idx === (heroIndex - 1 + heroImages.length) % heroImages.length;
                const isNext = idx === (heroIndex + 1) % heroImages.length;

                let translate = "translate-x-full";
                if (isActive) translate = "translate-x-0";
                else if (direction === 1 && isPrev) translate = "-translate-x-full";
                else if (direction === -1 && isNext) translate = "translate-x-full";

                return (
                  <img
                    key={src + idx}
                    src={src}
                    alt={t("Chhattisgarh State Creator & Influencer Awards")}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-in-out ${translate}`}
                    style={{ zIndex: isActive ? 10 : 1 }}
                    loading="lazy"
                  />
                );
              })}

              {/* Gradient overlay for polish */}
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-20" />
            </div>

            {/* Desi Styled Shuffle Button overlapping the bottom edge */}
            <button
              onClick={handleShuffleClick}
              className="group absolute -bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-gradient-to-r from-[var(--secondary)] via-[var(--primary)] to-[var(--secondary)] text-white border-2 border-amber-300/60 font-poppins font-extrabold text-xs sm:text-sm uppercase tracking-wider px-6 py-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-amber-300 group-hover:rotate-180 transition-transform duration-500" />
              <span>{t("Shuffle Cards")}</span>
            </button>
          </div>
        </div>

        {/* Right: Heading + Text + Desi Cultural Highlights */}
        <div className="flex flex-col items-start text-left order-2">
          <Heading
            badge={t("Official State Platform")}
            title={t("The Next Big")}
            highlightText={t("Story Starts Here.")}
            align="left"
            className="px-0 mx-0"
          />

          <p className="font-inter text-text-secondary text-sm sm:text-base leading-relaxed mt-6">
            {t(
              "Behind every creator is a story. Behind every story is a place worth discovering. The Chhattisgarh State Creator & Influencer Awards celebrates the creators who are shaping the state's digital identity through authentic and impactful content. From breathtaking landscapes and tribal heritage to local cuisine, art, music, festivals, innovation, and everyday life—every piece of content that reflects the true spirit of Chhattisgarh deserves to be seen and celebrated."
            )}
          </p>

          <p className="font-inter text-text-secondary text-sm sm:text-base leading-relaxed mt-4">
            {t(
              "Whether you're a YouTuber, Instagram creator, filmmaker, photographer, blogger, educator, artist, gamer, podcaster, or storyteller, your creativity has the power to inspire people across India and around the world. This is your chance to receive official recognition, amplify your voice, and proudly represent Chhattisgarh on the global digital stage."
            )}
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-[var(--secondary)]/10 border border-[var(--secondary)]/30 text-[var(--secondary)] font-poppins font-extrabold text-sm sm:text-base flex items-center gap-3">
            <span className="text-xl">🌾</span>
            <span>{t("Because when your content inspires the nation, Chhattisgarh shines with you.")}</span>
          </div>
        </div>

      </div>
    </section>
  );
}