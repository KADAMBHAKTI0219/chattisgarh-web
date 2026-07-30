"use client";

import { useState, useEffect, useRef } from "react";
import { Users } from "lucide-react";
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

  return (
    <section
      id="about-event"
      className="w-full bg-[#FAF7F0] border-t border-b border-zinc-200 text-zinc-950 py-12 md:py-16 lg:py-20 flex flex-col items-center select-none relative overflow-hidden z-10 my-8 md:my-12 scroll-mt-24"
    >
      <div className="flex flex-col items-center text-center max-w-4xl px-6">
        <span className="font-sans font-bold text-xs xl:text-sm uppercase tracking-widest text-[#F798B4]">
          {t("Official State Platform")}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold uppercase text-zinc-950 leading-tight">
          {t("WHAT IS")}{" "}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B95] to-[#FF6B95]">{t("THIS EVENT?")}</span>
        </h2>
        <div className="h-[4px] w-32 bg-gradient-to-r from-[#F798B4] to-[#EE5D8C] rounded-full mt-1"></div>

        {/* Description */}
        <p className="font-sans font-semibold text-zinc-900 text-base sm:text-lg md:text-xl xl:text-2xl leading-relaxed mt-6 max-w-4xl">
          {t("Chhattisgarh State Creator & Influencer Awards is an initiative to recognize and celebrate the state's most impactful digital creators across every platform.")}
        </p>

        {/* Lucide React Platforms Row */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mt-8 w-full flex-wrap">

          {/* YouTube */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white border border-zinc-200 rounded-xl flex items-center justify-center shadow-sm hover:scale-105 transition-all cursor-pointer">
              <FaYoutube className="w-6 h-6 text-red-600" />
            </div>
            <span className="font-sans font-extrabold text-[10px] text-zinc-500 uppercase tracking-wider">YouTube</span>
          </div>

          <div className="h-8 w-[1.5px] bg-zinc-300 hidden sm:block"></div>

          {/* Instagram */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white border border-zinc-200 rounded-xl flex items-center justify-center shadow-sm hover:scale-105 transition-all cursor-pointer">
              <FaInstagram className="w-6 h-6 text-[#E1306C]" />
            </div>
            <span className="font-sans font-extrabold text-[10px] text-zinc-500 uppercase tracking-wider">Instagram</span>
          </div>

          <div className="h-8 w-[1.5px] bg-zinc-300 hidden sm:block"></div>

          {/* Facebook */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white border border-zinc-200 rounded-xl flex items-center justify-center shadow-sm hover:scale-105 transition-all cursor-pointer">
              <FaFacebookF className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-sans font-extrabold text-[10px] text-zinc-500 uppercase tracking-wider">Facebook</span>
          </div>

          <div className="h-8 w-[1.5px] bg-zinc-300 hidden sm:block"></div>

          {/* Content Creators */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white border border-zinc-200 rounded-xl flex items-center justify-center shadow-sm hover:scale-105 transition-all cursor-pointer">
              <Users className="w-6 h-6 text-emerald-600" />
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
