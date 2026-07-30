"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ConferenceShiftSection() {
  const { t } = useLanguage();
  const [viewportWidth, setViewportWidth] = useState(1200);
  const containerRef = useRef(null);
  const requestRef = useRef(null);
  const offsetRef = useRef(0);

  // Array of 12 local high-quality Chhattisgarh-related images
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

  // Infinite Animation Loop (Anti-clockwise sliding left-to-right with overlapping cards)
  useEffect(() => {
    const cardElements = containerRef.current?.querySelectorAll(".shift-card");
    if (!cardElements || cardElements.length === 0) return;

    const animate = () => {
      // Horizontal scrolling offset (moving rightwards for anti-clockwise simulation)
      offsetRef.current += 0.8;

      let w = 175;
      let gap = 8;
      let maxCurveY = 95;

      if (viewportWidth < 640) { // Mobile
        w = 150;
        gap = 4;
        maxCurveY = 55;
      } else if (viewportWidth >= 640 && viewportWidth < 768) { // Small Tablet
        w = 180;
        gap = 6;
        maxCurveY = 70;
      } else if (viewportWidth >= 768 && viewportWidth < 1024) { // Med Tablet
        w = 210;
        gap = 8;
        maxCurveY = 80;
      } else if (viewportWidth >= 1024 && viewportWidth < 1280) { // Laptop lg
        w = 240;
        gap = 10;
        maxCurveY = 95;
      } else if (viewportWidth >= 1280 && viewportWidth < 1536) { // Desktop xl
        w = 280;
        gap = 14;
        maxCurveY = 110;
      } else { // Large Desktop 2xl
        w = 320;
        gap = 18;
        maxCurveY = 125;
      }

      const cardStep = w + gap;
      const loopWidth = cardElements.length * cardStep;

      cardElements.forEach((el, i) => {
        // Calculate X position
        let left = (i * cardStep + offsetRef.current) % loopWidth;

        // Wrap card around to the left side when it slides past the right viewport boundary
        const rightBound = viewportWidth + w;
        if (left > rightBound) {
          left -= loopWidth;
        }

        // Center position of card relative to screen center
        const cardCenter = left + w / 2;
        const viewportCenter = viewportWidth / 2;

        // Normalise distance from center (-1 to +1)
        const maxDist = Math.max(viewportCenter, 600);
        const dist = (cardCenter - viewportCenter) / maxDist;
        const absDist = Math.abs(dist);

        // Keep them perfectly flat and aligned on a straight line (GIGW/institutional polish)
        const translateY = 0;
        const scale = 1;

        // Set styles dynamically
        el.style.transform = `translateX(${left}px) translateY(${translateY}px) scale(${scale})`;
        el.style.zIndex = 10;
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [viewportWidth]);

  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 bg-[#FAF7F0] py-8 md:py-20 lg:py-28 flex flex-col items-center justify-center overflow-hidden select-none">

      {/* Background rays */}
      <div className="absolute top-0 left-0 right-0 h-[550px] pointer-events-none opacity-[0.03] z-0 overflow-hidden flex justify-center">
        <svg className="w-full max-w-[1400px] h-full" viewBox="0 0 1000 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M500 0 L0 500 M500 0 L550 500 M500 0 L600 500 M500 0 L650 500 M500 0 L700 500 M500 0 L750 500 M500 0 L800 500 M500 0 L850 500 M500 0 L900 500 M500 0 L950 500 M500 0 L1000 500"
            stroke="black"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Header Info Block */}
      <div className="flex flex-col items-center text-center gap-2 max-w-2xl xl:max-w-4xl px-6 mx-auto z-10 relative">
        <span className="font-sans font-bold text-xs xl:text-sm uppercase tracking-widest text-[#F798B4]">
          {t("ABOUT THE AWARDS")}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold uppercase text-zinc-950 leading-tight">
          {t("WHAT IS")}{" "}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B95] to-[#FF6B95]">{t("THIS EVENT?")}</span>
        </h2>
        <div className="h-[4px] w-32 bg-gradient-to-r from-[#F798B4] to-[#EE5D8C] rounded-full mt-1"></div>

        {/* Description */}
        <p className="font-sans font-semibold text-zinc-900 text-base sm:text-lg md:text-xl xl:text-2xl leading-relaxed mt-6 max-w-4xl">
          {t("Chhattisgarh State Creator & Influencer Awards is an initiative to recognize and celebrate the state's most impactful digital creators across every platform.")}
        </p>

        {/* Mockup platforms/icons row with dividers */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mt-8 w-full flex-wrap">

          {/* YouTube */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white border border-zinc-200 rounded-xl flex items-center justify-center shadow-sm hover:scale-105 transition-all">
              <svg className="w-6 h-6 fill-red-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.52 3.5 12 3.5 12 3.5s-7.519 0-9.388.556a3.003 3.003 0 0 0-2.11 2.107C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.482 20.5 12 20.5 12 20.5s7.52 0 9.388-.556a3.003 3.003 0 0 0 2.11-2.107C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <span className="font-sans font-extrabold text-[10px] text-zinc-500 uppercase tracking-wider">YouTube</span>
          </div>

          <div className="h-8 w-[1.5px] bg-zinc-300 hidden sm:block"></div>

          {/* Instagram */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white border border-zinc-200 rounded-xl flex items-center justify-center shadow-sm hover:scale-105 transition-all">
              <svg className="w-6 h-6 fill-none stroke-zinc-900 stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
              </svg>
            </div>
            <span className="font-sans font-extrabold text-[10px] text-zinc-500 uppercase tracking-wider">Instagram</span>
          </div>

          <div className="h-8 w-[1.5px] bg-zinc-300 hidden sm:block"></div>

          {/* Facebook */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white border border-zinc-200 rounded-xl flex items-center justify-center shadow-sm hover:scale-105 transition-all">
              <svg className="w-6 h-6 fill-blue-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <span className="font-sans font-extrabold text-[10px] text-zinc-500 uppercase tracking-wider">Facebook</span>
          </div>

          <div className="h-8 w-[1.5px] bg-zinc-300 hidden sm:block"></div>

          {/* Content Creators */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white border border-zinc-200 rounded-xl flex items-center justify-center shadow-sm hover:scale-105 transition-all">
              <svg className="w-6 h-6 text-emerald-600 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 2 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>
            <span className="font-sans font-extrabold text-[10px] text-zinc-500 uppercase tracking-wider">Creators</span>
          </div>

        </div>

      </div>

      {/* Viewport container for flat scrolling card row */}
      <div
        ref={containerRef}
        className="w-full relative h-[200px] sm:h-[260px] md:h-[300px] lg:h-[330px] xl:h-[360px] 2xl:h-[390px] mt-10 md:mt-12 overflow-visible"
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="shift-card absolute top-0 left-0 w-[150px] h-[200px] sm:w-[180px] sm:h-[250px] md:w-[210px] md:h-[290px] lg:w-[240px] lg:h-[320px] xl:w-[280px] xl:h-[350px] 2xl:w-[320px] 2xl:h-[380px] rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-[#BE2079]/50 transition-colors duration-300"
            style={{ willChange: "transform" }}
          >
            <img
              src={card.src}
              alt={`shift-card-${card.id}`}
              className="w-full h-full object-cover pointer-events-none select-none"
              loading="lazy"
            />
          </div>
        ))}
      </div>

    </section>
  );
}
