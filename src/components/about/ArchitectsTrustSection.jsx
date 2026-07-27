"use client";

import { useEffect, useRef, useState } from "react";

export default function ArchitectsTrustSection() {
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
      title: "Creative Autonomy",
      desc: "Empowering creators with absolute freedom of digital voice and expression to capture the genuine stories of Chhattisgarh.",
      icon: "🎨",
      color: "border-[#F3819F] hover:bg-[#F3819F]/5"
    },
    {
      title: "Policies for Progress",
      desc: "Backing digital growth with developer/creator friendly policy frameworks that foster innovation, jobs, and tourist traction.",
      icon: "📈",
      color: "border-[#FFA025] hover:bg-[#FFA025]/5"
    },
    {
      title: "Infrastructure & Service",
      desc: "Bridging the rural-urban gap with robust 5G networks, digital literacy tools, and creator studios across the state.",
      icon: "🌐",
      color: "border-[#6EC192] hover:bg-[#6EC192]/5"
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
          DIGITAL CREATORS AS <span className="text-[#FFA025]">ARCHITECTS OF TRUST</span>
        </h2>
        <p className="text-zinc-500 font-semibold text-xs sm:text-sm mt-1 uppercase tracking-wider">
          Building a robust and transparent creative ecosystem
        </p>
      </div>

      {/* 3 Columns Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
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

      {/* Navy block at bottom */}
      <div className="border-4 border-black bg-[#0B1528] p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_rgba(0,0,0,1)] text-center text-white flex flex-col justify-center items-center gap-2 mt-4 relative overflow-hidden">
        <div className="absolute top-2 right-2 opacity-5 text-4xl">✨</div>
        <p className="font-display font-black text-sm sm:text-base md:text-lg uppercase text-[#FFA025] tracking-wider max-w-3xl leading-relaxed">
          &ldquo;To create a robust, transparent digital ecosystem where local heritage is celebrated, and every creator finds a platform to grow.&rdquo;
        </p>
      </div>

    </div>
  );
}
