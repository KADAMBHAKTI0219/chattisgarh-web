"use client";

import { useState, useEffect, useRef } from "react";
import { Users, RefreshCw } from "lucide-react";
import { FaYoutube, FaInstagram, FaFacebookF } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export default function ConferenceShiftSection() {
  const { t } = useLanguage();
  const [viewportWidth, setViewportWidth] = useState(1200);
  const containerRef = useRef(null);
  const requestRef = useRef(null);
  const offsetRef = useRef(0);

  // Array of 10 local high-quality Chhattisgarh-related images
  const carouselImages = [
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

  // Duplicate cards to form a 20-card row for infinite seamless horizontal looping
  const cards = Array.from({ length: 20 }, (_, idx) => ({
    id: idx,
    src: carouselImages[idx % carouselImages.length]
  }));

  // Watch viewport width
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setViewportWidth(containerRef.current.getBoundingClientRect().width);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Infinite Animation Loop
  useEffect(() => {
    const cardElements = containerRef.current?.querySelectorAll(".shift-card");
    if (!cardElements || cardElements.length === 0) return;

    const animate = () => {
      offsetRef.current += 0.8;

      let w = 175;
      let gap = 8;

      if (viewportWidth < 640) {
        w = 150;
        gap = 4;
      } else if (viewportWidth >= 640 && viewportWidth < 768) {
        w = 180;
        gap = 6;
      } else if (viewportWidth >= 768 && viewportWidth < 1024) {
        w = 210;
        gap = 8;
      } else if (viewportWidth >= 1024 && viewportWidth < 1280) {
        w = 240;
        gap = 10;
      } else if (viewportWidth >= 1280 && viewportWidth < 1536) {
        w = 280;
        gap = 14;
      } else {
        w = 320;
        gap = 18;
      }

      const cardStep = w + gap;
      const loopWidth = cardElements.length * cardStep;

      cardElements.forEach((el, i) => {
        let left = (i * cardStep + offsetRef.current) % loopWidth;
        const rightBound = viewportWidth + w;
        if (left > rightBound) {
          left -= loopWidth;
        }

        el.style.transform = `translateX(${left}px)`;
        el.style.zIndex = 10;
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [viewportWidth]);

  // ================= Left Hero Image Auto-Shuffle (slide left/right) =================
  const heroImages = [
    "/assets/images/about-1.jpg",
    "/assets/images/about-2.webp",
    "/assets/images/about-3.jpg",
    "/assets/images/about-4.webp",
    "/assets/images/about-5.jpg",
    "/assets/images/about-6.webp"
  ];

  const [heroIndex, setHeroIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next slides in from right, -1 = from left
  const autoTimerRef = useRef(null);

  const goToNext = () => {
    setDirection(1);
    setHeroIndex((prev) => (prev + 1) % heroImages.length);
  };

  const restartAutoShuffle = () => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(goToNext, 3200);
  };

  useEffect(() => {
    restartAutoShuffle();
    return () => clearInterval(autoTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShuffleClick = () => {
    goToNext();
    restartAutoShuffle();
  };

  return (
    <section
      id="about-event"
      className="w-full bg-background border-t border-b border-border text-foreground py-12 md:py-16 lg:py-20 flex flex-col items-center select-none relative overflow-hidden z-10 my-8 md:my-12 scroll-mt-24"
    >
      {/* ================= LEFT IMAGE / RIGHT CONTENT ================= */}
      <div className="w-full max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
        {/* Left: Auto-shuffling Image */}
        <div className="relative w-full order-1 flex justify-center py-4">
          <div className="relative w-full max-w-md">
            {/* Decorative striped backdrop peeking from behind the tilted card */}
            <div className="absolute -inset-3 rounded-[28px] overflow-hidden -rotate-3 -z-10">
              <div className="w-full h-full flex">
                <div className="flex-1 bg-primary"></div>
                <div className="flex-1 bg-accent"></div>
                <div className="flex-1 bg-secondary"></div>
                <div className="flex-1 bg-primary"></div>
                <div className="flex-1 bg-accent"></div>
              </div>
            </div>

            {/* Tilted photo card */}
            <div className="relative w-full aspect-[4/4.6] rounded-[28px] overflow-hidden border border-border shadow-md bg-surface rotate-2">
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

              {/* soft gradient overlay for polish */}
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-20" />
            </div>

            {/* Shuffle button overlapping the bottom edge */}
            <button
              onClick={handleShuffleClick}
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-surface border border-border text-foreground font-sans font-bold text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              {t("Shuffle")}
            </button>
          </div>
        </div>

        {/* Right: Heading + Text + Platforms */}
        <div className="flex flex-col items-start text-left order-2">
          <span className="font-sans font-bold text-xs xl:text-sm uppercase tracking-widest text-primary">
            {t("Official State Platform")}
          </span>

          <h2 className="font-display font-bold uppercase text-foreground leading-tight text-3xl sm:text-4xl md:text-4xl lg:text-5xl mt-2">
            {t("The Next Big ")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {t("Story Starts Here.")}
            </span>
          </h2>

          <div className="h-[4px] w-32 bg-gradient-to-r from-primary to-accent rounded-full mt-4"></div>

          <p className="font-sans text-text-secondary text-sm sm:text-sm md:text-base  leading-relaxed mt-6">
            {t(
              "Behind every creator is a story. Behind every story is a place worth discovering. The Chhattisgarh State Creator & Influencer Awards celebrates the creators who are shaping the state's digital identity through authentic and impactful content. From breathtaking landscapes and tribal heritage to local cuisine, art, music, festivals, innovation, and everyday life—every piece of content that reflects the true spirit of Chhattisgarh deserves to be seen and celebrated."
            )}
          </p>

          <p className="font-sans text-text-secondary text-sm sm:text-sm md:text-base  leading-relaxed mt-4">
            {t(
              "Whether you're a YouTuber, Instagram creator, filmmaker, photographer, blogger, educator, artist, gamer, podcaster, or storyteller, your creativity has the power to inspire people across India and around the world. This is your chance to receive official recognition, amplify your voice, and proudly represent Chhattisgarh on the global digital stage."
            )}
          </p>

          <p className="font-sans font-semibold text-foreground text-sm sm:text-sm md:text-base xl:text-xl leading-relaxed mt-4">
            {t("Because when your content inspires the nation, Chhattisgarh shines with you.")}
          </p>


        </div>
      </div>

    </section>
  );
}