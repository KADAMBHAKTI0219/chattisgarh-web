"use client";

import { useState } from "react";

export default function WhatToExpectSection() {
  const categories = [
    {
      id: 1,
      title: "Expert Talks",
      color: "bg-[#F87C22]",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Fun + Games",
      color: "bg-[#F3819F]",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Food + Drink",
      color: "bg-[#F2A93B]",
      image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Live Music",
      color: "bg-[#F8D053]",
      image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Community",
      color: "bg-[#E85D3B]",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop"
    }
  ];

  return (
    <section id="what-to-expect" className="w-full max-w-5xl mx-auto flex flex-col md:flex-row border-4 border-black rounded-[32px] overflow-hidden bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10 relative mt-12">
      
      {/* Left Column: What to Expect Banner (Vertical on Desktop, Horizontal on Mobile) */}
      <div className="bg-zinc-950 text-white border-b-4 md:border-b-0 md:border-r-4 border-black flex md:flex-col items-center justify-between p-6 md:py-12 md:px-8 w-full md:w-[140px] select-none shrink-0 relative">
        <h3 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider md:[writing-mode:vertical-lr] md:rotate-180 text-center mx-auto md:my-auto">
          What to Expect
        </h3>
        
        {/* Smile face at bottom left */}
        <div className="absolute bottom-4 left-4 hidden md:block">
          <svg 
            className="w-10 h-10 drop-shadow-[1.5px_1.5px_0px_rgba(255,255,255,1)]" 
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="45" fill="#F8D053" stroke="black" strokeWidth="4.5" />
            <circle cx="35" cy="45" r="5" fill="black" />
            <circle cx="65" cy="45" r="5" fill="black" />
            <path 
              d="M 33,62 Q 50,75 67,62" 
              stroke="black" 
              strokeWidth="5" 
              strokeLinecap="round" 
              fill="none" 
            />
          </svg>
        </div>
      </div>

      {/* Right Column: Horizontal category links with hover previews */}
      <div className="flex-1 flex flex-col w-full relative">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className={`group relative flex items-center justify-center h-[90px] sm:h-[110px] md:h-[120px] w-full text-center ${cat.color} ${
              idx < categories.length - 1 ? "border-b-4 border-black" : ""
            } cursor-pointer overflow-visible transition-colors duration-200`}
          >
            {/* Hover Image Preview (Centered horizontally, positioned on the left margin, overlapping boundaries) */}
            <div 
              className="absolute left-[15px] sm:left-[30px] md:left-[-60px] top-1/2 -translate-y-1/2 w-[120px] h-[160px] sm:w-[150px] sm:h-[200px] md:w-[180px] md:h-[240px] z-30 pointer-events-none rounded-[20px] sm:rounded-[28px] border-3 border-black bg-white overflow-hidden shadow-[5px_5px_0px_rgba(0,0,0,1)] scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:rotate-[-6deg] transition-all duration-300 ease-out origin-center"
              style={{ willChange: "transform, opacity" }}
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>

            {/* Banner text */}
            <span className="font-display font-black text-2xl sm:text-4xl md:text-5xl uppercase text-white text-stroke-black tracking-wide group-hover:scale-105 transition-transform duration-200 select-none z-10">
              {cat.title}
            </span>

            {/* Subtle stripe hover feedback */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
          </div>
        ))}
      </div>

    </section>
  );
}
