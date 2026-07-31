"use client";

import { useState, useEffect, useRef } from "react";
import { Users } from "lucide-react";
import { FaYoutube, FaInstagram, FaFacebookF } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import Heading from "@/components/common/Heading";

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
  const [direction, setDirection] = useState(1); // 1 = moving forward (next slides in from right), -1 = backward

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section
      id="about-event"
      className="w-full bg-background border-t border-b border-border text-foreground py-12 md:py-16 lg:py-20 flex flex-col items-center select-none relative overflow-hidden z-10 my-8 md:my-12 scroll-mt-24"
    >
      {/* ================= LEFT IMAGE / RIGHT CONTENT ================= */}
      <div className="w-full max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
        {/* Left: Auto-shuffling Image */}
        <div className="relative w-full order-1">
          <div className="relative w-full aspect-[4/4] rounded-2xl md:rounded-3xl overflow-hidden border border-border shadow-sm bg-surface">
            {heroImages.map((src, idx) => {
              const isActive = idx === heroIndex;
              const isPrev =
                idx === (heroIndex - 1 + heroImages.length) % heroImages.length;
              const isNext = idx === (heroIndex + 1) % heroImages.length;

              let translate = "translate-x-full"; // default: parked off-screen right
              if (isActive) translate = "translate-x-0";
              else if (direction === 1 && isPrev) translate = "-translate-x-full";
              else if (direction === -1 && isNext) translate = "translate-x-full";
              else translate = "translate-x-full";

              return (
                <img
                  key={src + idx}
                  src={src}
                  alt={t("Chhattisgarh State Creator & Influencer Awards")}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-in-out ${translate}`}
                  style={{ zIndex: isActive ? 10 : 1 }}
                  loading="lazy"
                />
              );
            })}

            {/* soft gradient accent overlay at bottom for polish */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-20" />

            {/* Slide indicator dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > heroIndex ? 1 : -1);
                    setHeroIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === heroIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
                    }`}
                  aria-label={`Show image ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          {/* Accent underline strip beneath image for brand consistency */}
          <div className="h-[4px] w-24 bg-gradient-to-r from-primary to-accent rounded-full mt-4 mx-auto md:mx-0"></div>
        </div>

        {/* Right: Heading + Text + Platforms */}
        <div className="flex flex-col items-start text-left order-2">
          <Heading
            badge={t("Official State Platform")}
            title={t("The Next Big")}
            highlightText={t("Story Starts Here.")}
            align="left"
            className="px-0 mx-0"
          />

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