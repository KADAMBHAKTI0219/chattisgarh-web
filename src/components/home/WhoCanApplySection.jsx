"use client";

import { useEffect, useRef, useState } from "react";
import { useParticipateModal } from "@/context/ParticipateModalContext";

export default function WhoCanApplySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const { openModal } = useParticipateModal();

  const [screenType, setScreenType] = useState("desktop");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScreenType("mobile");
      } else if (window.innerWidth < 1024) {
        setScreenType("tablet");
      } else {
        setScreenType("desktop");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const candidates = [
    {
      title: "YouTubers",
      desc: "Vloggers, filmmakers, review channels, and educational hosts.",
      emoji: "🎥",
      color: "#F87C22",
      bgHover: "hover:bg-[#FFF5ED]"
    },
    {
      title: "Instagram",
      desc: "Reels makers, visual storytellers, and micro-influencers.",
      emoji: "📸",
      color: "#F6662E",
      bgHover: "hover:bg-[#FFF2ED]"
    },
    {
      title: "Podcasters",
      desc: "Audio show hosts, digital voice artists, and interviewers.",
      emoji: "🎙️",
      color: "#F34D3D",
      bgHover: "hover:bg-[#FFF0EF]"
    },
    {
      title: "Speakers",
      desc: "Keynote motivators, educators, and community guides.",
      emoji: "🗣️",
      color: "#E8394F",
      bgHover: "hover:bg-[#FFF0F1]"
    },
    {
      title: "Educators",
      desc: "Tutorial channels, academic mentors, and tech guides.",
      emoji: "🎓",
      color: "#D62963",
      bgHover: "hover:bg-[#FFF0F4]"
    },
    {
      title: "Travelers",
      desc: "Wanderers, explorers, and heritage documenters.",
      emoji: "✈️",
      color: "#BE2079",
      bgHover: "hover:bg-[#FDF2F9]"
    },
    {
      title: "Foodies",
      desc: "Home chefs, street food critics, and recipe creators.",
      emoji: "🍳",
      color: "#A11C8E",
      bgHover: "hover:bg-[#FCF2FC]"
    },
    {
      title: "Tech Gurus",
      desc: "Gadget reviewers, coding channels, and tech analysts.",
      emoji: "💻",
      color: "#801CA0",
      bgHover: "hover:bg-[#FAF2FC]"
    },
    {
      title: "Fashionistas",
      desc: "Stylists, beauty curators, and handloom advocates.",
      emoji: "👗",
      color: "#5D1FAD",
      bgHover: "hover:bg-[#F7F2FD]"
    },
    {
      title: "Lifestyle",
      desc: "Daily life vloggers, wellness guides, and home designers.",
      emoji: "🌿",
      color: "#3623B6",
      bgHover: "hover:bg-[#F4F2FD]"
    },
    {
      title: "Brands",
      desc: "Start-ups, creator-led agencies, and local businesses.",
      emoji: "💼",
      color: "#0B1528",
      bgHover: "hover:bg-[#F2F4F7]"
    }
  ];

  // Clip path styles for standard vertical pointed-top hexagon
  const hexClipPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

  // Reusable Hexagon Card Component
  const HexCard = ({ cand, idx }) => {
    return (
      <div
        className={`relative w-[130px] lg:w-[170px] xl:w-[200px] 2xl:w-[220px] aspect-[1/1.15] bg-black p-[3.5px] shadow-lg transition-all duration-500 transform hover:scale-105 group cursor-pointer shrink-0 ${
          isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-12"
        }`}
        style={{
          clipPath: hexClipPath,
          transitionDelay: isVisible ? `${idx * 40}ms` : "0ms",
          willChange: "transform, opacity"
        }}
      >
        {/* Inner Hexagon Container */}
        <div 
          className={`w-full h-full bg-white flex flex-col items-center justify-center p-3 sm:p-4 text-center transition-colors duration-300 ${cand.bgHover}`}
          style={{ clipPath: hexClipPath }}
        >
          
          {/* Checkbox Badge Circle with white checkmark inside */}
          <div 
            className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-black shrink-0 group-hover:scale-110 transition-transform duration-300 mb-1.5"
            style={{ backgroundColor: cand.color }}
          >
            <svg 
              className="w-3.5 h-3.5 text-white stroke-[3.5]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>

          {/* Emoji Icon */}
          <span className="text-2xl sm:text-3xl lg:text-4xl mb-0.5 group-hover:animate-bounce shrink-0 select-none">
            {cand.emoji}
          </span>

          {/* Card Title */}
          <h3 className="font-display font-black text-xs sm:text-sm lg:text-base uppercase text-zinc-950 tracking-tight leading-tight">
            {cand.title}
          </h3>

          {/* Card Description */}
          <p className="text-zinc-500 font-semibold text-[9px] sm:text-[10px] lg:text-xs leading-tight sm:leading-normal mt-1 max-w-[110px] sm:max-w-[150px] line-clamp-3">
            {cand.desc}
          </p>

        </div>
      </div>
    );
  };

  return (
    <section 
      ref={sectionRef}
      id="who-can-apply"
      className="relative w-full max-w-7xl xl:max-w-[1400px] mx-auto py-16 px-4 sm:px-6 md:px-8 select-none scroll-mt-24 overflow-visible text-center"
    >
      
      {/* Centered Heading and Description */}
      <div className="flex flex-col items-center justify-center gap-3 max-w-3xl mx-auto mb-12 md:mb-16">
        <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-widest text-[#F87C22]">
          Eligibility Guidelines
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter leading-none text-zinc-950">
          WHO CAN <span className="text-[#BE2079]">APPLY?</span>
        </h2>
        {/* Centered gradient line */}
        <div className="h-[5px] w-44 bg-gradient-to-r from-[#F87C22] via-[#BE2079] to-[#3623B6] rounded-full mt-1"></div>
        <p className="text-zinc-600 font-semibold text-sm sm:text-base leading-relaxed mt-3">
          The Chhattisgarh State Creator Awards celebrates all digital creators, influencers, and brands. If you create original content on eligible social platforms, you are invited to nominate yourself or others.
        </p>
      </div>

      {/* Dynamic Responsive Honeycomb Grid */}
      <div className="flex flex-col items-center justify-center overflow-visible z-40">
        {screenType === "desktop" && (
          <div className="flex flex-col items-center justify-center overflow-visible">
            {/* Row 1 (4 Hexagons) */}
            <div className="flex justify-center gap-4 lg:gap-5 xl:gap-6 overflow-visible w-full">
              {candidates.slice(0, 4).map((cand, idx) => (
                <HexCard key={idx} cand={cand} idx={idx} />
              ))}
            </div>
            {/* Row 2 (5 Hexagons) */}
            <div className="flex justify-center gap-4 lg:gap-5 xl:gap-6 overflow-visible w-full -mt-6 lg:-mt-8 xl:-mt-9 2xl:-mt-11">
              {candidates.slice(4, 9).map((cand, idx) => (
                <HexCard key={idx + 4} cand={cand} idx={idx + 4} />
              ))}
            </div>
            {/* Row 3 (2 Hexagons) */}
            <div className="flex justify-center gap-4 lg:gap-5 xl:gap-6 overflow-visible w-full -mt-6 lg:-mt-8 xl:-mt-9 2xl:-mt-11">
              {candidates.slice(9, 11).map((cand, idx) => (
                <HexCard key={idx + 9} cand={cand} idx={idx + 9} />
              ))}
            </div>
          </div>
        )}

        {screenType === "tablet" && (
          <div className="flex flex-col items-center justify-center overflow-visible">
            {/* Row 1 (3 Hexagons) */}
            <div className="flex justify-center gap-4 overflow-visible w-full">
              {candidates.slice(0, 3).map((cand, idx) => (
                <HexCard key={idx} cand={cand} idx={idx} />
              ))}
            </div>
            {/* Row 2 (2 Hexagons) */}
            <div className="flex justify-center gap-4 overflow-visible w-full -mt-6">
              {candidates.slice(3, 5).map((cand, idx) => (
                <HexCard key={idx + 3} cand={cand} idx={idx + 3} />
              ))}
            </div>
            {/* Row 3 (3 Hexagons) */}
            <div className="flex justify-center gap-4 overflow-visible w-full -mt-6">
              {candidates.slice(5, 8).map((cand, idx) => (
                <HexCard key={idx + 5} cand={cand} idx={idx + 5} />
              ))}
            </div>
            {/* Row 4 (2 Hexagons) */}
            <div className="flex justify-center gap-4 overflow-visible w-full -mt-6">
              {candidates.slice(8, 10).map((cand, idx) => (
                <HexCard key={idx + 8} cand={cand} idx={idx + 8} />
              ))}
            </div>
            {/* Row 5 (1 Hexagon) */}
            <div className="flex justify-center gap-4 overflow-visible w-full -mt-6">
              {candidates.slice(10, 11).map((cand, idx) => (
                <HexCard key={idx + 10} cand={cand} idx={idx + 10} />
              ))}
            </div>
          </div>
        )}

        {screenType === "mobile" && (
          <div className="flex flex-col items-center justify-center overflow-visible">
            {/* Row 1 (2 Hexagons) */}
            <div className="flex justify-center gap-3 overflow-visible w-full">
              {candidates.slice(0, 2).map((cand, idx) => (
                <HexCard key={idx} cand={cand} idx={idx} />
              ))}
            </div>
            {/* Row 2 (1 Hexagon) */}
            <div className="flex justify-center gap-3 overflow-visible w-full -mt-5">
              {candidates.slice(2, 3).map((cand, idx) => (
                <HexCard key={idx + 2} cand={cand} idx={idx + 2} />
              ))}
            </div>
            {/* Row 3 (2 Hexagons) */}
            <div className="flex justify-center gap-3 overflow-visible w-full -mt-5">
              {candidates.slice(3, 5).map((cand, idx) => (
                <HexCard key={idx + 3} cand={cand} idx={idx + 3} />
              ))}
            </div>
            {/* Row 4 (1 Hexagon) */}
            <div className="flex justify-center gap-3 overflow-visible w-full -mt-5">
              {candidates.slice(5, 6).map((cand, idx) => (
                <HexCard key={idx + 5} cand={cand} idx={idx + 5} />
              ))}
            </div>
            {/* Row 5 (2 Hexagons) */}
            <div className="flex justify-center gap-3 overflow-visible w-full -mt-5">
              {candidates.slice(6, 8).map((cand, idx) => (
                <HexCard key={idx + 6} cand={cand} idx={idx + 6} />
              ))}
            </div>
            {/* Row 6 (1 Hexagon) */}
            <div className="flex justify-center gap-3 overflow-visible w-full -mt-5">
              {candidates.slice(8, 9).map((cand, idx) => (
                <HexCard key={idx + 8} cand={cand} idx={idx + 8} />
              ))}
            </div>
            {/* Row 7 (2 Hexagons) */}
            <div className="flex justify-center gap-3 overflow-visible w-full -mt-5">
              {candidates.slice(9, 11).map((cand, idx) => (
                <HexCard key={idx + 9} cand={cand} idx={idx + 9} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Centered Participate Now CTA Button (Outside of the hexagons grid) */}
      <div className="flex justify-center mt-12 md:mt-16 z-40 relative">
        <button
          onClick={openModal}
          className="rounded-full border-3 border-black bg-[#F87C22] px-8 py-3.5 sm:px-10 sm:py-4 font-black text-white text-sm sm:text-base md:text-lg tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 select-none uppercase"
        >
          <span>✨</span> PARTICIPATE NOW
        </button>
      </div>

    </section>
  );
}
