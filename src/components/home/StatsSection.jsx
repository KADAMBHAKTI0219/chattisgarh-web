"use client";

import { useEffect, useRef, useState } from "react";

export default function StatsSection() {
  const [activeNode, setActiveNode] = useState(0);
  const sectionRef = useRef(null);

  const stats = [
    {
      id: "01 / 04",
      number: "33",
      title: "Districts",
      description: "Every district of Chhattisgarh represented on the platform.",
      color: "from-blue-500 to-indigo-600",
      nodeColor: "border-blue-500",
      lineColor: "from-blue-500 to-purple-500",
    },
    {
      id: "02 / 04",
      number: "25+",
      title: "Categories",
      description: "From education to entertainment — a category for every creator.",
      color: "from-purple-500 to-fuchsia-600",
      nodeColor: "border-purple-500",
      lineColor: "from-purple-500 to-purple-400",
    },
    {
      id: "03 / 04",
      isCheck: true,
      title: "Government Recognition",
      description: "Officially backed and recognised by the Government of Chhattisgarh.",
      color: "from-purple-400 to-orange-400",
      nodeColor: "border-purple-400",
      lineColor: "from-purple-400 to-orange-500",
    },
    {
      id: "04 / 04",
      number: "1",
      title: "Creator Community",
      description: "One unified home for Chhattisgarh's creator ecosystem.",
      color: "from-orange-500 to-amber-500",
      nodeColor: "border-orange-500",
      lineColor: "from-orange-500 to-amber-500",
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
          Math.floor(progress * stats.length),
          stats.length - 1
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
      className="relative w-full max-w-6xl mx-auto py-20 px-4 select-none overflow-visible"
    >
      {/* Title block */}
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-5xl font-black uppercase text-zinc-950 tracking-tight leading-none text-stroke-black-thick"
            style={{ textShadow: "3px 3px 0px #000", color: "white" }}>
          <span className="text-white">IMPACT & </span>
          <span className="text-[#F8D053]">REACH</span>
        </h2>
      </div>

      <div className="relative w-full flex flex-col items-center">
        
        {/* Central Vertical Line (Desktop only, centered) */}
        <div className="absolute left-4 md:left-1/2 top-10 bottom-10 w-[4px] -translate-x-1/2 hidden md:block bg-gradient-to-b from-blue-500 via-purple-500 to-orange-500 rounded-full z-0 opacity-80" />

        {/* Central Vertical Line (Mobile only, left aligned) */}
        <div className="absolute left-8 top-10 bottom-10 w-[4px] -translate-x-1/2 md:hidden bg-gradient-to-b from-blue-500 via-purple-500 to-orange-500 rounded-full z-0 opacity-80" />

        {/* Stats Items Wrapper */}
        <div className="w-full flex flex-col gap-16 md:gap-24 z-10 relative">
          {stats.map((stat, idx) => {
            const isLeft = idx % 2 === 0;
            const isActive = activeNode >= idx;

            return (
              <div 
                key={idx}
                className="grid grid-cols-1 md:grid-cols-2 w-full items-center relative"
              >
                {/* Timeline node circle */}
                <div 
                  className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 bg-white z-20 transition-all duration-500 ${
                    stat.nodeColor
                  } ${isActive ? "scale-125 shadow-[0_0_15px_rgba(0,0,0,0.15)]" : "scale-100"}`}
                />

                {/* Horizontal Connector Line (Desktop only) */}
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 h-[3px] bg-gradient-to-r ${
                    stat.lineColor
                  } hidden md:block z-0 transition-all duration-500 ${
                    isLeft 
                      ? "right-1/2 w-12 lg:w-16 origin-right" 
                      : "left-1/2 w-12 lg:w-16 origin-left"
                  } ${isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-30"}`}
                />

                {/* Column 1 (Left on desktop, full-width on mobile for Left cards, hidden for Right cards) */}
                <div className={`flex pl-16 md:pl-0 ${isLeft ? "md:justify-end md:pr-12 lg:pr-16" : "hidden md:block"}`}>
                  {isLeft && (
                    <div className="w-full max-w-md bg-white border-2 border-black/5 hover:border-black/10 rounded-[28px] p-6 flex items-center gap-6 shadow-[0_15px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group text-left">
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500`} />
                      
                      <div className="flex items-center justify-center shrink-0 w-20 h-20 select-none">
                        {stat.isCheck ? (
                          <svg className="w-12 h-12 text-[#0B1528] stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        ) : (
                          <span className="font-display font-black text-4xl sm:text-5xl text-[#0B1528] tracking-tight">
                            {stat.number}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 text-left">
                        <span className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest text-indigo-600">
                          {stat.id}
                        </span>
                        <h3 className="font-sans font-black text-lg sm:text-xl text-[#0B1528] tracking-tight">
                          {stat.title}
                        </h3>
                        <p className="text-zinc-500 font-semibold text-xs sm:text-sm leading-relaxed mt-0.5">
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Column 2 (Right on desktop, full-width on mobile for Right cards, hidden for Left cards) */}
                <div className={`flex pl-16 md:pl-0 ${!isLeft ? "md:justify-start md:pl-12 lg:pl-16" : "hidden md:block"}`}>
                  {!isLeft && (
                    <div className="w-full max-w-md bg-white border-2 border-black/5 hover:border-black/10 rounded-[28px] p-6 flex items-center gap-6 shadow-[0_15px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group text-left">
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500`} />
                      
                      <div className="flex items-center justify-center shrink-0 w-20 h-20 select-none">
                        <span className="font-display font-black text-4xl sm:text-5xl text-[#0B1528] tracking-tight">
                          {stat.number}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1 text-left">
                        <span className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest text-indigo-600">
                          {stat.id}
                        </span>
                        <h3 className="font-sans font-black text-lg sm:text-xl text-[#0B1528] tracking-tight">
                          {stat.title}
                        </h3>
                        <p className="text-zinc-500 font-semibold text-xs sm:text-sm leading-relaxed mt-0.5">
                          {stat.description}
                        </p>
                      </div>

                      {/* Small moving TV/Mascot element on card 4 */}
                      {idx === 3 && (
                        <div className="absolute bottom-2 right-3 opacity-60 hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5 text-amber-500 fill-current animate-bounce" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2H6v2h12v-2h-2v-2h5c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12zM8.5 9.5l5 3-5 3v-6z"/>
                          </svg>
                        </div>
                      )}
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
