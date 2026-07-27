"use client";

import { useEffect, useRef, useState } from "react";

export default function BeyondTrophySection() {
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

  const cards = [
    {
      title: "Trust",
      desc: "Establishing transparent benchmarks for creator validation, audience safety, and verified engagement profiles.",
      icon: "🤝",
      color: "border-[#4585F6]"
    },
    {
      title: "Credibility",
      desc: "Highlighting premium authentic content, digital honesty, and positive local impact on public screens.",
      icon: "🎖️",
      color: "border-[#F3819F]"
    },
    {
      title: "Jury Review",
      desc: "Fair, unbiased evaluation by an esteemed panel of creators, industry experts, and government representatives.",
      icon: "⚖️",
      color: "border-[#6EC192]"
    },
    {
      title: "Recognition",
      desc: "Providing national visibility, brand partnerships, and future growth channels for local creative minds.",
      icon: "🌟",
      color: "border-[#FFA025]"
    }
  ];

  return (
    <div 
      ref={containerRef}
      className={`w-full max-w-7xl mx-auto flex flex-col gap-10 py-12 px-4 md:px-8 relative z-10 select-none transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      {/* Title block */}
      <div className="text-center max-w-3xl mx-auto flex flex-col gap-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-zinc-950 tracking-tight leading-none">
          BEYOND THE <span className="text-[#FFA025]">TROPHY</span>
        </h2>
        <p className="text-zinc-500 font-semibold text-xs sm:text-sm mt-1 uppercase tracking-wider">
          Providing long-term values, growth opportunities, and trust metrics
        </p>
      </div>      {/* 4 Columns Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`border-3 border-black bg-white rounded-[24px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all duration-200 text-left flex flex-col gap-3 group`}
          >
            <div className="w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center text-2xl bg-slate-50 group-hover:scale-110 transition-transform duration-300">
              {card.icon}
            </div>
            <h3 className="font-display font-black text-lg sm:text-xl uppercase text-zinc-950">
              {card.title}
            </h3>
            <p className="text-zinc-600 font-semibold text-xs sm:text-sm leading-relaxed">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
