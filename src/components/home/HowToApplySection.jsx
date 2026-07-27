"use client";

import { useEffect, useRef, useState } from "react";

export default function HowToApplySection() {
  const [activeNode, setActiveNode] = useState(0);
  const sectionRef = useRef(null);

  const steps = [
    {
      id: "Step 01",
      title: "Register",
      description: "Create your account on our official website by verified OTP verification.",
      icon: (
        <svg className="w-8 h-8 text-[#0B1528] group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
        </svg>
      ),
      color: "#E14B18", // Orange
      bgHover: "hover:bg-[#E14B18]/5",
      nodeColor: "border-[#E14B18] text-[#E14B18]",
      lineColor: "from-[#E14B18] to-[#701B84]",
    },
    {
      id: "Step 02",
      title: "Submit Profile",
      description: "Fill in your personal details, choose categories, and submit your active social media links.",
      icon: (
        <svg className="w-8 h-8 text-[#0B1528] group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      ),
      color: "#701B84", // Purple
      bgHover: "hover:bg-[#701B84]/5",
      nodeColor: "border-[#701B84] text-[#701B84]",
      lineColor: "from-[#701B84] to-[#0E7490]",
    },
    {
      id: "Step 03",
      title: "Verification",
      description: "Our dedicated screening committee verifies your submitted profiles, engagement statistics, and content originality.",
      icon: (
        <svg className="w-8 h-8 text-[#0B1528] group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      color: "#0E7490", // Teal
      bgHover: "hover:bg-[#0E7490]/5",
      nodeColor: "border-[#0E7490] text-[#0E7490]",
      lineColor: "from-[#0E7490] to-[#0F172A]",
    },
    {
      id: "Step 04",
      title: "Nomination Confirmed",
      description: "Once verified, your nomination is officially confirmed and you will receive a confirmation certificate via email.",
      icon: (
        <svg className="w-8 h-8 text-[#0B1528] group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "#0F172A", // Navy
      bgHover: "hover:bg-[#0F172A]/5",
      nodeColor: "border-[#0F172A] text-[#0F172A]",
      lineColor: "from-[#0F172A] to-[#0F172A]",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewOffset = window.innerHeight / 2 - rect.top;
      
      if (viewOffset > 0 && viewOffset < sectionHeight) {
        const progress = viewOffset / sectionHeight;
        const nodeIndex = Math.min(
          Math.floor(progress * steps.length),
          steps.length - 1
        );
        setActiveNode(Math.max(0, nodeIndex));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="how-to-apply"
      className="relative w-full max-w-6xl mx-auto py-8 md:py-20 lg:py-28 px-4 select-none overflow-visible"
    >
      
      {/* Centered Heading and Description */}
      <div className="flex flex-col items-center justify-center gap-3 max-w-3xl mx-auto mb-16 text-center">
        <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-widest text-[#E14B18]">
          Nomination Process
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter leading-none text-zinc-950">
          HOW TO <span className="text-[#701B84]">APPLY</span>
        </h2>
        {/* Centered gradient line */}
        <div className="h-[5px] w-40 bg-gradient-to-r from-[#E14B18] via-[#701B84] to-[#0F172A] rounded-full mt-1"></div>
      </div>

      <div className="relative w-full flex flex-col items-center">
        
        {/* Central Vertical Line (Desktop only, centered) */}
        <div className="absolute left-4 md:left-1/2 top-12 bottom-12 w-[4px] -translate-x-1/2 hidden md:block bg-gradient-to-b from-[#E14B18] via-[#701B84] to-[#0F172A] rounded-full z-0 opacity-20" />

        {/* Central Vertical Line (Mobile only, left aligned) */}
        <div className="absolute left-8 top-12 bottom-12 w-[4px] -translate-x-1/2 md:hidden bg-gradient-to-b from-[#E14B18] via-[#701B84] to-[#0F172A] rounded-full z-0 opacity-20" />

        {/* Steps Wrapper */}
        <div className="w-full flex flex-col gap-16 md:gap-24 z-10 relative">
          {steps.map((step, idx) => {
            const isLeft = idx % 2 === 0;
            const isActive = activeNode >= idx;

            return (
              <div 
                key={idx}
                className="grid grid-cols-1 md:grid-cols-2 w-full items-center relative"
              >
                
                {/* Timeline node square containing step number */}
                <div 
                  className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-none border-2 border-black bg-white z-20 flex items-center justify-center font-display font-black text-lg transition-all duration-500 shadow-[2px_2px_0px_rgba(0,0,0,1)] ${
                    step.nodeColor
                  } ${isActive ? "scale-110 rotate-[360deg]" : "scale-100"}`}
                >
                  {idx + 1}
                </div>

                {/* Horizontal Connector Dotted Line (Desktop only) */}
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 border-t-3 border-dashed border-black/20 hidden md:block z-0 transition-all duration-500 ${
                    isLeft 
                      ? "right-[calc(50%_+_24px)] w-16 lg:w-20 origin-right" 
                      : "left-[calc(50%_+_24px)] w-16 lg:w-20 origin-left"
                  } ${isActive ? "opacity-100 scale-x-100" : "opacity-30 scale-x-0"}`}
                />

                {/* Column 1 (Left on desktop, full-width on mobile for Left cards, hidden for Right cards) */}
                <div className={`flex pl-20 md:pl-0 ${isLeft ? "md:justify-end md:pr-24 lg:pr-28" : "hidden md:block"}`}>
                  {isLeft && (
                    <div className="w-full max-w-md bg-white border-2 border-black rounded-none p-6 flex flex-col lg:flex-row items-center gap-6 shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group text-center lg:text-left cursor-pointer">
                      
                      {/* Step Icon Badge */}
                      <div className="flex items-center justify-center shrink-0 w-16 h-16 rounded-none border-2 border-black bg-zinc-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:bg-[#E14B18]/5 group-hover:rotate-3 transition-all duration-300">
                        {step.icon}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col gap-0.5 items-center lg:items-start text-center lg:text-left">
                        <span className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest text-[#E14B18]">
                          {step.id}
                        </span>
                        <h3 className="font-display font-black text-lg sm:text-xl text-zinc-950 uppercase tracking-tight">
                          {step.title}
                        </h3>
                        <p className="text-zinc-500 font-semibold text-xs sm:text-sm leading-relaxed mt-0.5">
                          {step.description}
                        </p>
                      </div>

                    </div>
                  )}
                </div>

                {/* Column 2 (Right on desktop, full-width on mobile for Right cards, hidden for Left cards) */}
                <div className={`flex pl-20 md:pl-0 ${!isLeft ? "md:justify-start md:pl-24 lg:pl-28" : "hidden md:block"}`}>
                  {!isLeft && (
                    <div className="w-full max-w-md bg-white border-2 border-black rounded-none p-6 flex flex-col lg:flex-row items-center gap-6 shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group text-center lg:text-left cursor-pointer">
                      
                      {/* Step Icon Badge */}
                      <div className="flex items-center justify-center shrink-0 w-16 h-16 rounded-none border-2 border-black bg-zinc-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:bg-[#701B84]/5 group-hover:rotate-3 transition-all duration-300">
                        {step.icon}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col gap-0.5 items-center lg:items-start text-center lg:text-left">
                        <span className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest text-[#701B84]">
                          {step.id}
                        </span>
                        <h3 className="font-display font-black text-lg sm:text-xl text-zinc-950 uppercase tracking-tight">
                          {step.title}
                        </h3>
                        <p className="text-zinc-500 font-semibold text-xs sm:text-sm leading-relaxed mt-0.5">
                          {step.description}
                        </p>
                      </div>

                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
