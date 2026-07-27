"use client";

import { useEffect, useRef, useState } from "react";

export default function WhyParticipateSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      title: "Gain Recognition",
      desc: "Showcase your talent on the biggest platform in Chhattisgarh. Get noticed by state leaders, media outlets, and millions of viewers.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.195-.49.88-.49 1.075 0l2.22 5.626 5.626.046c.53.004.75.688.35 1.03l-4.225 3.655 1.258 5.568c.117.518-.46.938-.89.673l-4.882-2.996-4.882 2.996c-.43.265-1.007-.155-.89-.673l1.257-5.568-4.225-3.655c-.4-.342-.18-1.026.35-1.03l5.625-.046 2.221-5.626z" />
        </svg>
      ),
      color: "#F87C22", // Orange
      gradient: "from-[#F87C22]/10 to-[#F87C22]/0",
      hoverBg: "hover:bg-[#F87C22]/5"
    },
    {
      title: "Build Your Network",
      desc: "Connect with top creators, digital marketing brands, startup founders, and experts. Unlock collaborations and agency partnerships.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
      ),
      color: "#701B84", // Purple
      gradient: "from-[#701B84]/10 to-[#701B84]/0",
      hoverBg: "hover:bg-[#701B84]/5"
    },
    {
      title: "Media Coverage",
      desc: "Get featured across premium digital news outlets, leading print publications, television features, and high-impact live broadcasts.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
        </svg>
      ),
      color: "#0E7490", // Teal
      gradient: "from-[#0E7490]/10 to-[#0E7490]/0",
      hoverBg: "hover:bg-[#0E7490]/5"
    },
    {
      title: "Official Award Certificate",
      desc: "Every nominated creator receives an official certificate of participation from the State Government, recognizing their digital impact.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.3 8.35.097-.03a.75.75 0 0 1 .788.124l1.32 1.35a.75.75 0 0 0 .979.034l2.126-1.748a.75.75 0 0 1 .772-.075l.136.064c.54.256.634.964.183 1.346l-2.793 2.372a.75.75 0 0 1-.95.03L10.3 14.25a.75.75 0 0 0-.846-.076l-.136.065a.75.75 0 0 1-.772-.075l-2.126-1.748a.75.75 0 0 0-.979.033l-1.32 1.35a.75.75 0 0 1-.788.124l-.097-.03a1.5 1.5 0 0 1-.944-1.4V5.25a1.5 1.5 0 0 1 1.5-1.5h6.75a1.5 1.5 0 0 1 1.5 1.5v6.75a1.5 1.5 0 0 1-.944 1.4Z" />
        </svg>
      ),
      color: "#0F172A", // Navy
      gradient: "from-[#0F172A]/10 to-[#0F172A]/0",
      hoverBg: "hover:bg-[#0F172A]/5"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="why-participate"
      className="relative w-full max-w-7xl xl:max-w-[1400px] mx-auto py-8 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 select-none scroll-mt-24 overflow-visible"
    >
      
      {/* Centered Heading with responsive styling */}
      <div className="flex flex-col items-center justify-center gap-3 max-w-3xl mx-auto mb-16 text-center">
        <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-widest text-[#BE2079]">
          Awards Benefits
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter leading-none text-zinc-950">
          WHY <span className="text-[#F87C22]">PARTICIPATE?</span>
        </h2>
        {/* Underline line from mockup */}
        <div className="h-[5px] w-48 bg-gradient-to-r from-[#F87C22] via-[#BE2079] to-[#3623B6] rounded-none mt-1"></div>
      </div>

      {/* Grid of 4 cards styled in a unique, premium staggered format */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 xl:gap-12 overflow-visible">
        {benefits.map((benefit, idx) => {
          // Add alternating subtle rotation offsets for the staggered "board" feeling
          const rotationClass = idx % 2 === 0 ? "md:rotate-[-0.8deg]" : "md:rotate-[0.8deg]";
          
          return (
            <div
              key={idx}
              className={`relative border-2 border-black bg-white rounded-none p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-5 sm:gap-6 shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:rotate-0 transition-all duration-300 transform text-left overflow-hidden group cursor-pointer ${rotationClass} ${
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
              }`}
              style={{ 
                transitionDelay: isVisible ? `${idx * 100}ms` : "0ms",
                willChange: "transform, opacity"
              }}
            >
              
              {/* Backglow gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

              {/* Large Colored Icon Badge Square */}
              <div 
                className="w-16 h-16 rounded-none border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300"
                style={{ backgroundColor: benefit.color }}
              >
                {benefit.icon}
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-2 relative z-10">
                <h3 className="font-display font-black text-lg sm:text-xl uppercase text-zinc-950 tracking-tight leading-none group-hover:text-[#BE2079] transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-zinc-500 font-semibold text-xs sm:text-sm leading-relaxed">
                  {benefit.desc}
                </p>
              </div>

            </div>
          );
        })}
      </div>

      {/* Mockup exact bottom band with tagline */}
      <div className="mt-16 sm:mt-20 flex flex-col items-center gap-6 text-center max-w-4xl mx-auto overflow-hidden">
        {/* Full-width gradient divider line */}
        <div className="h-[4px] w-full bg-gradient-to-r from-[#F87C22] via-[#BE2079] to-[#3623B6] rounded-full"></div>
        
        <h4 className="font-display font-black text-base sm:text-lg md:text-xl xl:text-2xl uppercase tracking-normal text-zinc-900 leading-snug px-4">
          CELEBRATE YOUR JOURNEY WITH THE BIGGEST CREATOR COMMUNITY OF CHHATTISGARH.
        </h4>
      </div>

    </section>
  );
}
