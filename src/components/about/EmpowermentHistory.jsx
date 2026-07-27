"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function EmpowermentHistory() {
  const [isVisible0, setIsVisible0] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);

  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);

  useEffect(() => {
    const observer0 = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible0(true);
          observer0.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    const observer1 = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible1(true);
          observer1.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    const observer2 = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible2(true);
          observer2.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (ref0.current) observer0.observe(ref0.current);
    if (ref1.current) observer1.observe(ref1.current);
    if (ref2.current) observer2.observe(ref2.current);

    return () => {
      observer0.disconnect();
      observer1.disconnect();
      observer2.disconnect();
    };
  }, []);

  const historyRows = [
    {
      title: "Majestic Landscapes & Historical Landmarks",
      subtitle: "FROM SIRPUR TO CHITRAKOTE",
      desc: "Chhattisgarh houses the ancient 7th-century Laxman Temple in Sirpur, a monumental testament to brick architecture and spiritual heritage. Alongside Bhoramdeo and the roaring Chitrakote Falls (often hailed as India's Niagara), our land bridges deep mythological origins with breathtaking raw ecology.",
      image: "/assets/images/about-1.jpg",
      badge: "Historical Heritage",
      ref: ref0,
      visible: isVisible0
    },
    {
      title: "Hamar Sirmaur Chhattisgarh - Cultural Legacy",
      subtitle: "RAIPUR & THE HEART OF THE FESTIVALS",
      desc: "Raipur, the vibrant capital city, beats as the central hub of digital expression, connectivity, and modernization. Our cultural landscape comes alive through legendary festivals like Bastar Dussehra, where traditional drummers, folk performers, and creators preserve century-old artistic practices for global screens.",
      image: "/assets/images/about-5.jpg",
      badge: "Raipur & Festivals",
      ref: ref1,
      visible: isVisible1
    },
    {
      title: "Women Empowering the Folk Arts",
      subtitle: "CULTURAL LEADERSHIP & DIGITAL VOICE",
      desc: "From legendary folk performers like Teejan Bai to thousands of rural women craftsmen, women lead the cultural narrative in Chhattisgarh. They champion traditional arts like Pandwani, Karma, and pan-state handlooms, utilizing digital platforms to empower local economies and broadcast Chhattisgarh's female power worldwide.",
      image: "/assets/images/about-2.jpg",
      badge: "Women Empowerment",
      ref: ref2,
      visible: isVisible2
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-16 md:gap-24 py-10 px-4 md:px-8 relative z-10 select-none">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#0B1528] tracking-tight leading-none">
          <span className="text-[#FFA025]">A HISTORY</span> OF EMPOWERMENT
        </h2>
        <p className="text-zinc-500 font-semibold text-xs sm:text-sm mt-3 uppercase tracking-wider">
          How our heritage, nature, and creators drive the narrative forward
        </p>
      </div>


      {/* Alternating Scroll Animated Rows */}
      <div className="flex flex-col gap-16 md:gap-24">
        {historyRows.map((row, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={idx}
              ref={row.ref}
              className={`flex flex-col ${
                isEven ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center justify-between gap-10 xl:gap-16 transition-all duration-700 ease-out transform ${
                row.visible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-12"
              }`}
            >
              
              {/* Row Image with Neo-Brutalist Frame */}
              <div className="flex-1 w-full relative">
                <div className="relative w-full h-[240px] sm:h-[320px] md:h-[360px] xl:h-[400px] rounded-[32px] overflow-hidden border-4 border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all duration-300">
                  <Image
                    src={row.image}
                    alt={row.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-4 left-4 bg-zinc-950 border-2 border-black px-3.5 py-1.5 rounded-full shadow-[2px_2px_0px_rgba(255,255,255,1)]">
                    <span className="text-white font-black text-[10px] uppercase tracking-widest leading-none">
                      {row.badge}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row Text */}
              <div className="flex-1 flex flex-col gap-3.5 text-left max-w-xl">
                <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#F87C22]">
                  {row.subtitle}
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl xl:text-4xl text-zinc-950 uppercase tracking-tight leading-snug">
                  {row.title}
                </h3>
                <p className="text-zinc-600 font-semibold text-sm sm:text-base leading-relaxed">
                  {row.desc}
                </p>
                <div className="h-[3px] w-20 bg-zinc-300 rounded-full mt-2"></div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
