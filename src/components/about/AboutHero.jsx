"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AboutHero() {
  const [selectedIdx, setSelectedIdx] = useState(null);

  const bentoItems = [
    {
      src: "/assets/images/about-1.jpg",
      alt: "Chhattisgarh Creator Fest Keynote",
      title: "Keynote & Panel Discussions",
      tag: "Inspiration",
      sizeClass: "md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-2 h-[350px] md:h-[500px] lg:h-[520px]"
    },
    {
      src: "/assets/images/about-2.webp",
      alt: "Networking & Collaborations",
      title: "Networking Meetups",
      tag: "Connection",
      sizeClass: "md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1 h-[240px] lg:h-[248px]"
    },
    {
      src: "/assets/images/about-3.jpg",
      alt: "Emerging Digital Talents",
      title: "Creator Showcase",
      tag: "Exhibition",
      sizeClass: "md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1 h-[240px] lg:h-[248px]"
    },
    {
      src: "/assets/images/about-4.webp",
      alt: "Masterclass Sessions",
      title: "Interactive Masterclasses",
      tag: "Learning",
      sizeClass: "md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2 h-[350px] md:h-[500px] lg:h-[520px]"
    },
    {
      src: "/assets/images/about-5.jpg",
      alt: "Award Night Celebrations",
      title: "Celebration Night",
      tag: "Celebration",
      sizeClass: "md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1 h-[240px] lg:h-[248px]"
    },
    {
      src: "/assets/images/about-6.webp",
      alt: "Tech Workshops",
      title: "Tech Workshops",
      tag: "Innovation",
      sizeClass: "md:col-span-1 md:row-span-1 lg:col-span-3 lg:row-span-1 h-[240px] lg:h-[248px]"
    }
  ];

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    if (selectedIdx === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedIdx(null);
      } else if (e.key === "ArrowRight") {
        setSelectedIdx((prev) => (prev + 1) % bentoItems.length);
      } else if (e.key === "ArrowLeft") {
        setSelectedIdx((prev) => (prev - 1 + bentoItems.length) % bentoItems.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx]);

  return (
    <section id="about-hero" className="w-full max-w-7xl mx-auto flex flex-col gap-12 py-10 md:py-16 xl:py-20 select-none">
      
      {/* Header text info */}
      <div className="flex flex-col items-center text-center gap-3 max-w-3xl mx-auto px-4">
        <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-widest text-[#F87C22]">
          Our Journey
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-black uppercase text-zinc-950 tracking-tight leading-none text-stroke-black-thick text-center flex flex-col items-center gap-1 sm:gap-2"
            style={{ textShadow: "4px 4px 0px #000", color: "white" }}>
          <span className="text-white">ABOUT CHHATTISGARH</span>
          <span className="text-[#F8D053] text-2xl sm:text-4xl md:text-5xl xl:text-[3.5rem] tracking-wide leading-tight">
            CREATOR AWARDS
          </span>
        </h1>
        <p className="text-zinc-600 font-semibold text-sm sm:text-base xl:text-lg leading-relaxed mt-4">
          Chhattisgarh Web Awards is the premier regional digital celebration where creators, design leaders, developers, and tech innovators gather to showcase the future of the web ecosystem.
        </p>
      </div>

      {/* Dynamic Bento Grid of Images (about-1 to 6) optimized for aspect ratios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto px-4 md:px-8">
        {bentoItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className={`relative rounded-none overflow-hidden border-2 border-black bg-white shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 transition-all duration-300 cursor-pointer group ${item.sizeClass}`}
          >
            {/* Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={idx === 0}
              />
            </div>

            {/* Neon Accent Border inside card */}
            <div className="absolute inset-0 border border-transparent group-hover:border-[#F3819F] rounded-none pointer-events-none transition-all duration-300" />

            {/* Hover details overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8 text-left">
              <span className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest text-[#F8D053] bg-black/40 py-1 px-3.5 rounded-none w-fit mb-2 border border-[#F8D053]/30">
                {item.tag}
              </span>
              <h3 className="font-display font-black text-lg sm:text-xl md:text-2xl text-white tracking-tight uppercase leading-snug">
                {item.title}
              </h3>
              <p className="text-zinc-300 font-semibold text-xs mt-1 sm:opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                {item.alt}
              </p>
            </div>

            {/* Zoom In Badge Top Right */}
            <div className="absolute top-4 right-4 bg-white/90 border-2 border-black p-2.5 rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
              <svg className="w-4 h-4 text-zinc-950" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Lightbox Modal */}
      {selectedIdx !== null && (
        <div className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4 select-none backdrop-blur-md">
          {/* Close button */}
          <button
            onClick={() => setSelectedIdx(null)}
            className="absolute top-6 right-6 bg-white border-2 border-black p-3 rounded-none shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-0 transition-transform cursor-pointer z-50"
          >
            <svg className="w-6 h-6 text-zinc-950 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Left Arrow Button */}
          <button
            onClick={() => setSelectedIdx((prev) => (prev - 1 + bentoItems.length) % bentoItems.length)}
            className="absolute left-6 bg-white border-2 border-black p-3 rounded-none shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-0 transition-transform cursor-pointer z-50 hidden sm:block"
          >
            <svg className="w-6 h-6 text-zinc-950 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Image Container */}
          <div className="relative w-full max-w-5xl h-[50vh] sm:h-[70vh] flex flex-col items-center justify-center">
            <div className="relative w-full h-full border-2 border-black rounded-none overflow-hidden bg-zinc-900 shadow-[4px_4px_0px_rgba(243,129,159,1)]">
              <Image
                src={bentoItems[selectedIdx].src}
                alt={bentoItems[selectedIdx].alt}
                fill
                className="object-contain"
                priority
              />
            </div>
            
            {/* Image Details overlay at bottom of lightbox screen */}
            <div className="mt-6 text-center text-white max-w-2xl px-4 flex flex-col gap-1.5">
              <span className="font-sans font-extrabold text-xs uppercase tracking-widest text-[#F8D053]">
                {bentoItems[selectedIdx].tag}
              </span>
              <h4 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-white leading-none">
                {bentoItems[selectedIdx].title}
              </h4>
              <p className="text-zinc-400 font-semibold text-xs sm:text-sm">
                {bentoItems[selectedIdx].alt}
              </p>
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => setSelectedIdx((prev) => (prev + 1) % bentoItems.length)}
            className="absolute right-6 bg-white border-4 border-black p-3 rounded-full shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-0 transition-transform cursor-pointer z-50 hidden sm:block"
          >
            <svg className="w-6 h-6 text-zinc-950 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {bentoItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`w-3.5 h-3.5 rounded-full border-2 border-black transition-all ${
                  idx === selectedIdx ? "bg-[#F3819F] scale-125 shadow-[1px_1px_0px_rgba(0,0,0,1)]" : "bg-white/50"
                }`}
              />
            ))}
          </div>

        </div>
      )}

    </section>
  );
}
