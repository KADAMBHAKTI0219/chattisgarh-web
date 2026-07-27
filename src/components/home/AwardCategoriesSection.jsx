"use client";

import { useState } from "react";

export default function AwardCategoriesSection() {
  const [activeAwardId, setActiveAwardId] = useState(null);

  // Local image assets matching the uploaded folder list
  const awards = [
    {
      id: 1,
      title: "Best Youtube Creator",
      color: "bg-[#F87C22]",
      image: "/assets/images/category-1.jpg"
    },
    {
      id: 2,
      title: "Best Instagram Creator",
      color: "bg-[#F3819F]",
      image: "/assets/images/instagramaward.avif"
    },
    {
      id: 3,
      title: "Best Emerging Creator",
      color: "bg-[#4585F6]",
      image: "/assets/images/emerging awards.jpg"
    },
    {
      id: 4,
      title: "Best Influencer",
      color: "bg-[#F8D053]",
      image: "/assets/images/creator-award.jpg"
    },
    {
      id: 5,
      title: "Best Food Creator",
      color: "bg-[#6EC192]",
      image: "/assets/images/food-award.webp"
    },
    {
      id: 6,
      title: "Best Travel Creator",
      color: "bg-[#00A3A3]",
      image: "/assets/images/travellor award.jpg"
    },
    {
      id: 7,
      title: "Best Fashion Creator",
      color: "bg-[#E85D3B]",
      image: "/assets/images/fashion-awards.avif"
    },
    {
      id: 8,
      title: "People's Choice Award",
      color: "bg-[#8A3FFC]",
      image: "/assets/images/proplechoiceawards.jpg"
    }
  ];

  return (
    <section id="categories" className="w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto flex flex-col md:flex-row border-4 border-black rounded-[32px] bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10 relative my-8 md:my-16 lg:my-20 xl:my-28 scroll-mt-24 overflow-visible">
      
      {/* Left Column: Vertical Category Title Block */}
      <div className="bg-zinc-950 text-white border-b-4 md:border-b-0 md:border-r-4 border-black flex md:flex-col items-center justify-between p-6 md:py-12 md:px-8 w-full md:w-[140px] xl:w-[180px] 2xl:w-[210px] select-none shrink-0 relative rounded-t-[28px] md:rounded-t-0 md:rounded-l-[28px] z-10">
        <h3 className="font-display font-black text-2xl sm:text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl uppercase tracking-wider md:[writing-mode:vertical-lr] md:rotate-180 text-center mx-auto md:my-auto">
          Award Categories
        </h3>
        
        {/* Smiley Sun face at bottom left */}
        <div className="absolute bottom-4 left-4 hidden md:block">
          <svg 
            className="w-10 h-10 xl:w-12 xl:h-12 drop-shadow-[1.5px_1.5px_0px_rgba(255,255,255,1)]" 
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

      {/* Right Column: Horizontal category banners with alternating left/right click-reveal and hover-reveal */}
      <div className="flex-1 flex flex-col w-full relative overflow-visible">
        {awards.map((award, idx) => {
          const isEven = idx % 2 === 1; // Alternating index (left vs right)
          const isActive = activeAwardId === award.id;

          // Position class: Keep images fully inside the border container (never bleed out horizontally)
          const imagePositionClass = isEven 
            ? "right-[15px] sm:right-[30px] md:right-[40px] xl:right-[60px] 2xl:right-[80px]" 
            : "left-[15px] sm:left-[30px] md:left-[40px] xl:left-[60px] 2xl:left-[80px]";

          // Visibility styling: active stays 100% visible, otherwise triggers on hover
          const visibilityClass = isActive
            ? "scale-100 opacity-100 z-30"
            : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 z-30";

          // Rotation setting: active gets a fixed tilt, hover gets dynamic tilt
          const rotateClass = isEven
            ? isActive ? "rotate-[6deg]" : "group-hover:rotate-[6deg]"
            : isActive ? "rotate-[-6deg]" : "group-hover:rotate-[-6deg]";

          // Dynamic corner rounding for the top and bottom banner items to map to parent container
          let cornerClass = "";
          if (idx === 0) {
            cornerClass = "md:rounded-tr-[28px]";
          } else if (idx === awards.length - 1) {
            cornerClass = "rounded-b-[28px] md:rounded-b-0 md:rounded-br-[28px]";
          }

          return (
            <div
              key={award.id}
              onClick={() => setActiveAwardId(isActive ? null : award.id)}
              className={`group relative flex items-center justify-center h-[90px] sm:h-[100px] md:h-[110px] xl:h-[125px] 2xl:h-[140px] w-full text-center ${award.color} ${cornerClass} ${
                idx < awards.length - 1 ? "border-b-4 border-black" : ""
              } cursor-pointer overflow-visible transition-colors duration-200`}
            >
              {/* Floating Image Preview (Click-Reveal & Hover-Reveal - Fully inside container horizontally, unclipped vertically) */}
              <div 
                className={`absolute ${imagePositionClass} ${visibilityClass} ${rotateClass} top-1/2 -translate-y-1/2 w-[110px] h-[145px] sm:w-[130px] sm:h-[175px] md:w-[150px] md:h-[200px] xl:w-[170px] xl:h-[230px] 2xl:w-[190px] 2xl:h-[255px] pointer-events-none rounded-[20px] sm:rounded-[28px] border-3 border-black bg-white overflow-hidden shadow-[5px_5px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-out origin-center z-20`}
                style={{ willChange: "transform, opacity" }}
              >
                <img
                  src={award.image}
                  alt={award.title}
                  className="w-full h-full object-cover pointer-events-none"
                  loading="lazy"
                />
              </div>

              {/* Banner text */}
              <span className="font-display font-black text-xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[46px] 2xl:text-[54px] uppercase text-white text-stroke-black tracking-wide group-hover:scale-[1.03] transition-transform duration-200 select-none z-10">
                {award.title}
              </span>

              {/* Subtle stripe hover/active feedback */}
              <div className={`absolute inset-0 transition-opacity duration-200 pointer-events-none ${cornerClass} ${
                isActive ? "bg-black/15 opacity-100" : "bg-black/5 opacity-0 group-hover:opacity-100"
              }`}></div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
