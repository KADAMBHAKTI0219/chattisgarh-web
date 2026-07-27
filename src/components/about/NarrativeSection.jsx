"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function NarrativeSection() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 xl:gap-16 py-12 px-4 md:px-8 relative z-10 select-none transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      
      {/* Left Column: Image with border */}
      <div className="flex-1 w-full relative">
        <div className="relative w-full h-[240px] sm:h-[320px] md:h-[360px] xl:h-[380px] rounded-[32px] overflow-hidden border-4 border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)]">
          <Image
            src="/assets/images/about-4.webp"
            alt="Raipur city hub"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
      {/* Right Column: Narrative content */}
      <div className="flex-1 flex flex-col gap-4 text-left max-w-xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-zinc-950 tracking-tight leading-none">
          DRIVING THE <span className="text-[#FFA025]">NATIONAL NARRATIVE</span>
        </h2>
        <p className="text-zinc-600 font-semibold text-sm sm:text-base leading-relaxed mt-2">
          Chhattisgarh's digital creator revolution is not just regional—it is shaping how the rest of India sees our state. Creators are utilizing technology to broadcast raw, authentic stories to millions.
        </p>

        {/* Navy box insert */}
        <div className="border-3 border-black bg-[#0B1528] p-5 sm:p-6 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] text-white flex flex-col gap-2 mt-2">
          <span className="font-sans font-black text-[10px] uppercase tracking-widest text-[#FFA025]">
            In Focus
          </span>
          <h4 className="font-display font-black text-base sm:text-lg uppercase text-white leading-none">
            Spotlighting Rural Talent & Stories
          </h4>
          <p className="text-zinc-300 text-xs sm:text-sm font-semibold leading-relaxed">
            From local bamboo crafts to state-wide tourism, creators are building the bridge between Chhattisgarh's rich history and global screens.
          </p>
        </div>
      </div>

    </div>
  );
}
