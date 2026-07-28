"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function HeroSection() {
  const [cards, setCards] = useState([
    { id: 1, title: "Laxman Temple", src: "/assets/images/about-1.jpg" },
    { id: 2, title: "Chitrakote Falls", src: "/assets/images/about-2.jpg" },
    { id: 3, title: "Chhattisgarh Nature", src: "/assets/images/about-3.jpg" },
    { id: 4, title: "Raipur City", src: "/assets/images/about-4.webp" },
  ]);

  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleToRight, setShuffleToRight] = useState(true);

  // Refs for background parallax shapes
  const shapeRef1 = useRef(null);
  const shapeRef2 = useRef(null);
  const shapeRef3 = useRef(null);
  const shapeRef4 = useRef(null);

  // Ref and state for scroll entrance animation
  const [isCardVisible, setIsCardVisible] = useState(false);
  const cardContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (shapeRef1.current) shapeRef1.current.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0) rotate(${scrollY * 0.05}deg)`;
      if (shapeRef2.current) shapeRef2.current.style.transform = `translate3d(0, ${scrollY * -0.1}px, 0) rotate(${scrollY * -0.03}deg)`;
      if (shapeRef3.current) shapeRef3.current.style.transform = `translate3d(0, ${scrollY * 0.08}px, 0)`;
      if (shapeRef4.current) shapeRef4.current.style.transform = `translate3d(0, ${scrollY * -0.12}px, 0) rotate(${scrollY * 0.08}deg)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsCardVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (cardContainerRef.current) observer.observe(cardContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleShuffle = () => {
    if (isShuffling) return;
    setIsShuffling(true);

    setTimeout(() => {
      setCards((prev) => {
        const next = [...prev];
        const first = next.shift();
        if (first) next.push(first);
        return next;
      });
      setIsShuffling(false);
      // Alternate direction for the next shuffle
      setShuffleToRight((prev) => !prev);
    }, 300);
  };

  return (
    <section 
      id="hero-section" 
      className="flex flex-col items-center justify-center text-center  w-full overflow-visible"
    >
      
      {/* 1. Official Banner Container (Full bleed background negating page wrapper paddings, no borders) */}
      <div className="relative w-screen min-h-screen  -mx-4 md:-mx-8 lg:-mx-12 overflow-hidden flex flex-col items-center justify-center pt-[150px] pb-[70px] lg:pb-12 p-6 select-none z-10 bg-white">
        
        {/* Hero Background Image (Desktop: herosection.png, Mobile/Tablet: mob-hero.png) */}
        <div className="absolute inset-0 -z-10 w-full h-full pointer-events-none select-none hidden lg:block">
          <Image
            src="/assets/images/herosection.png"
            alt="Hero Background Banner"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-100"
          />
        </div>
        <div className="absolute inset-0 -z-10 w-full h-full pointer-events-none select-none hidden md:block lg:hidden">
          <Image
            src="/assets/images/tablet.png"
            alt="Hero Background Banner Tablet"
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom opacity-100"
          />
        </div>
       


        <div className="absolute inset-0 -z-10 w-full h-full pointer-events-none select-none block md:hidden">
          <Image
            src="/assets/images/mob-hero.png"
            alt="Hero Background Banner Mobile"
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom opacity-100"
          />
        </div>

        {/* Butter yellow gradient overlay (top to transparent bottom) */}
        <div className="absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-[#FAF7F0]/20 via-[#FAF7F0]/70 to-transparent pointer-events-none z-0 block md:hidden"></div>
        {/* Dynamic colorful gradient background glow inside the banner */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-gradient-to-tr from-[#FFA025]/15 to-[#8A3FFC]/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none -z-10"></div>



        {/* Hero Text Main Wrapper (Target this container to adjust exact centering or offset positioning) */}
        <div id="hero-text-container" className="flex flex-col items-center justify-center text-center z-10 w-full">
          
          {/* Top Speech Bubble & Smiley Sun Row (Moved to absolute top) */}
          <div className="flex items-center gap-1.5 sm:gap-4 select-none z-10 mb-1.5 xs:mb-2.5 sm:mb-4">
            <div className="relative hover:rotate-12 transition-transform duration-300 cursor-pointer">
              <svg 
                className="w-7 h-7 sm:w-12 sm:h-12 xl:w-14 xl:h-14 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" 
                viewBox="0 0 100 100" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon 
                  points="50,5 57,20 73,12 75,29 91,25 87,41 99,48 89,60 95,76 81,79 81,95 66,90 60,103 48,93 37,101 29,87 15,91 17,75 3,71 11,57 3,42 16,36 15,20 30,22 36,7 48,17" 
                  fill="#F8D053" 
                  stroke="black" 
                  strokeWidth="3.5" 
                />
                <circle cx="40" cy="48" r="4.5" fill="black" />
                <circle cx="60" cy="48" r="4.5" fill="black" />
                <path 
                  d="M 38,60 Q 50,70 62,60" 
                  stroke="black" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  fill="none" 
                />
              </svg>
            </div>

            <div className="relative border border-black sm:border-2 bg-[#F87C22] text-white font-extrabold text-[9px] xs:text-[11px] sm:text-xs xl:text-sm px-2.5 py-0.5 sm:px-3 sm:py-1.5 rounded-none shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] sm:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 h-1.5 w-1.5 rotate-45 border-l border-b border-black sm:border-l-2 sm:border-b-2 bg-[#F87C22]"></div>
              Monday, 31st August 2026
            </div>
          </div>

          {/* Hero Main Typography Block constrained to center 42% sky area */}
          <div className="flex flex-col items-center gap-0.5 xs:gap-1.5 sm:gap-2.5 max-w-[95%] lg:max-w-[45%] z-10 px-4 mx-auto">
            
            {/* Chhattisgarh's Biggest Sub-heading */}
            <span className="font-sans font-black text-[12px] xs:text-[14px] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-[#0B1528] uppercase tracking-[0.08em] select-none text-center whitespace-nowrap">
              CHHATTISGARH'S BIGGEST
            </span>

            {/* Creator & Influencer Title (Responsive wrap on mobile, single line on tablet/desktop) */}
            <h1 className="font-display font-black text-[24px] xs:text-[28px] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-[4.5rem] uppercase tracking-tighter leading-[1.05] sm:leading-none select-none my-1 md:my-2 text-white text-stroke-black-thick text-center block w-full">
              <span style={{ textShadow: "2.5px 2.5px 0px #000" }} className="block sm:inline-block">CREATOR & </span>
              <span style={{ textShadow: "2.5px 2.5px 0px #000" }} className="block sm:inline-block sm:ml-2">INFLUENCER</span>
            </h1>

            {/* Awards 2026 line */}
            <span className="font-display font-black text-[12px] xs:text-[14px] sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl text-[#8A3FFC] uppercase tracking-widest mt-0.5 text-center">
              — AWARDS 2026 —
            </span>

          </div>

          {/* Nomination Status Badge (Scaled down on mobile) */}
          <div className="rotate-[-2deg] bg-[#F3819F] border border-black px-3 py-1 sm:border-2 sm:px-5 sm:py-2 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] lg:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] inline-block mt-2.5 xs:mt-3.5 sm:mt-4 hover:rotate-[0deg] transition-transform duration-200 cursor-default select-none z-20">
            <span className="font-display font-black text-[11px] xs:text-[13px] sm:text-sm md:text-base xl:text-lg uppercase text-black tracking-wide">
              Nomination Opening Soon
            </span>
          </div>

        </div>

      </div>

      {/* 2. Split Grid: Shuffling Cards on Left, Navy Message Box on Right */}
      <div className="w-full max-w-5xl xl:max-w-6xl mx-auto flex flex-col lg:flex-row items-stretch justify-center gap-10 lg:gap-12 xl:gap-16 z-10 relative px-4 mt-12">
        
        {/* COLUMN 1 (LEFT): Interactive Image Shuffle Card Stack */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-w-[280px] w-full">
          {/* Shuffling Card Deck */}
          <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px] xl:w-[390px] xl:h-[390px] 2xl:w-[420px] 2xl:h-[420px] mx-auto z-10 mt-2 mb-10">
              {cards.map((card, idx) => {
                const isTop = idx === 0;
                const isSecond = idx === 1;
                const isThird = idx === 2;

                let rotation = "rotate-0";
                let translateX = "translate-x-0";
                let translateY = "translate-y-0";
                let scale = "scale-100";
                let opacity = "opacity-100";
                let zIndex = "z-30";

                if (isTop) {
                  rotation = "rotate-[-1.5deg]";
                  zIndex = "z-30";
                  if (isShuffling) {
                    rotation = shuffleToRight ? "rotate-[15deg]" : "rotate-[-15deg]";
                    translateX = shuffleToRight 
                      ? "translate-x-[140%] sm:translate-x-[150%]" 
                      : "-translate-x-[140%] sm:-translate-x-[150%]";
                    translateY = "translate-y-4";
                    opacity = "opacity-0";
                  }
                } else if (isSecond) {
                  rotation = "rotate-[2deg]";
                  translateX = "translate-x-2";
                  translateY = "translate-y-2";
                  scale = "scale-[0.98]";
                  opacity = "opacity-95";
                  zIndex = "z-20";
                } else if (isThird) {
                  rotation = "rotate-[-3.5deg]";
                  translateX = "translate-x-4";
                  translateY = "translate-y-4";
                  scale = "scale-[0.96]";
                  opacity = "opacity-80";
                  zIndex = "z-10";
                } else {
                  rotation = "rotate-[1deg]";
                  translateX = "translate-x-6";
                  translateY = "translate-y-6";
                  scale = "scale-[0.94]";
                  opacity = "opacity-0";
                  zIndex = "z-0";
                }

                return (
                  <div
                    key={card.id}
                    className={`absolute inset-0 w-full h-full border-2 border-black rounded-none overflow-hidden bg-white shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all duration-500 ease-out ${rotation} ${translateX} ${translateY} ${scale} ${opacity} ${zIndex}`}
                  >
                    <Image
                      src={card.src}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 280px, 360px"
                      className="object-cover pointer-events-none select-none"
                      priority={idx === 0}
                    />
                    
                    {/* Custom Card label */}
                    <div className="absolute bottom-5 left-5 bg-white border-2 border-black rounded-none px-4 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-xs sm:text-sm select-none">
                      {card.title}
                    </div>
                  </div>
                );
              })}

              {/* Neo-brutalist Shuffle Pill Button */}
              <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 z-40">
                <button
                  onClick={handleShuffle}
                  className="rounded-none border-2 border-black bg-white px-6 py-2.5 font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1.5px] hover:translate-y-[1.5px] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all cursor-pointer flex items-center gap-2 select-none text-xs sm:text-sm"
                >
                  <span>🔁</span> Shuffle
                </button>
              </div>
            </div>
          </div>
        {/* COLUMN 2 (RIGHT): Navy Blue Message Container (Stretched to match Left card stack height) */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
             {/* Navy Blue Message Container (Scroll-animated, Parallax Background) */}
            <div 
              ref={cardContainerRef}
              className={`group border-2 border-black bg-gradient-to-br from-[#080F1E] via-[#0D1830] to-[#122345] p-6 sm:p-8 md:p-10 rounded-none shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 w-full min-h-[280px] sm:min-h-[320px] md:min-h-[360px] xl:min-h-[390px] 2xl:min-h-[420px] flex flex-col justify-center items-center gap-4 text-center z-10 relative overflow-hidden transition-all duration-700 ease-out transform ${
                isCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              
              {/* Glowing Background Spots */}
              <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#FFA025]/8 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#FFA025]/12 transition-colors duration-300"></div>
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-[#F3819F]/8 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#F3819F]/12 transition-colors duration-300"></div>

              {/* Floating Parallax Background Shapes */}
              <div 
                ref={shapeRef1} 
                className="absolute top-8 left-10 text-[#FFA025] text-3xl opacity-20 pointer-events-none select-none transition-transform duration-100 ease-out"
                style={{ willChange: "transform" }}
              >
                ✦
              </div>
              <div 
                ref={shapeRef2} 
                className="absolute bottom-10 left-12 text-[#F3819F] text-2xl opacity-15 pointer-events-none select-none transition-transform duration-100 ease-out"
                style={{ willChange: "transform" }}
              >
                <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <div 
                ref={shapeRef3} 
                className="absolute top-12 right-12 text-[#6EC192] text-2xl font-light opacity-25 pointer-events-none select-none transition-transform duration-100 ease-out"
                style={{ willChange: "transform" }}
              >
                +
              </div>
              <div 
                ref={shapeRef4} 
                className="absolute bottom-16 right-10 text-[#F8D053] text-4xl opacity-20 pointer-events-none select-none transition-transform duration-100 ease-out"
                style={{ willChange: "transform" }}
              >
                ✦
              </div>

              {/* Decorative Giant Quote Marks */}
              <span className="font-serif text-8xl lg:text-[9rem] text-[#F3819F]/10 absolute top-2 left-6 select-none pointer-events-none">“</span>
              <span className="font-serif text-8xl lg:text-[9rem] text-[#FFA025]/10 absolute bottom-[-40px] right-6 select-none pointer-events-none">”</span>

              {/* Main Headline */}
              <p className="text-zinc-100 font-black text-xl sm:text-2xl md:text-3xl leading-snug tracking-tight z-10">
                Are you shaping the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3819F] via-[#FFA025] to-[#F8D053] font-black uppercase tracking-wide">
                  digital heartbeat
                </span>{" "}
                of our state?
              </p>
              
              {/* Premium Gradient Divider */}
              <div className="h-[3px] w-1/3 bg-gradient-to-r from-[#F3819F] via-[#FFA025] to-[#6EC192] my-3 rounded-none z-10"></div>
              
              {/* Sub-text with styled badge */}
              <p className="text-zinc-300 text-sm sm:text-base xl:text-lg font-bold flex flex-col items-center gap-3 z-10">
                <span>The stage is set for</span>
                <span className="inline-block px-4 py-2 bg-[#FFA025] text-zinc-950 font-black rounded-none border-2 border-black rotate-[-1.5deg] shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:rotate-0 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
                  Chhattisgarh's biggest digital celebration
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
  );
}
