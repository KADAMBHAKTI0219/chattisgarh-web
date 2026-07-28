"use client";

import { useState } from "react";

export default function AwardCategoriesSection() {
  const [hoveredId, setHoveredId] = useState(null);

  const awards = [
    { id: 1, title: "Chhattisgarhiya Sanskriti Ambassador", color: "bg-[#F87C22]", tier: "Tier A", image: "/assets/images/chattisgarh_fall.jpg" },
    { id: 2, title: "Bastar & Tribal Heritage Creator", color: "bg-[#F3819F]", tier: "Tier A", image: "/assets/images/about-2.jpg" },
    { id: 3, title: "Emerging Tech & Edu Creator", color: "bg-[#4585F6]", tier: "Tier B", image: "/assets/images/about-1.jpg" },
    { id: 4, title: "Best Youtube Creator", color: "bg-[#F8D053]", tier: "Tier C", image: "/assets/images/category-1.jpg" },
    { id: 5, title: "Best Instagram Creator", color: "bg-[#6EC192]", tier: "Tier C", image: "/assets/images/instagramaward.avif" },
    { id: 6, title: "Best Emerging Creator", color: "bg-[#00A3A3]", tier: "Tier C", image: "/assets/images/emerging awards.jpg" },
    { id: 7, title: "Best Influencer", color: "bg-[#E85D3B]", tier: "Tier C", image: "/assets/images/creator-award.jpg" },
    { id: 8, title: "Best Food Creator", color: "bg-[#8A3FFC]", tier: "Tier C", image: "/assets/images/food-award.webp" },
    { id: 9, title: "Best Travel Creator", color: "bg-[#F87C22]", tier: "Tier C", image: "/assets/images/travellor award.jpg" },
    { id: 10, title: "Best Fashion Creator", color: "bg-[#F3819F]", tier: "Tier C", image: "/assets/images/fashion-awards.avif" },
    { id: 11, title: "People's Choice Award", color: "bg-[#4585F6]", tier: "Tier C", image: "/assets/images/proplechoiceawards.jpg" },
    { id: 12, title: "Swachh Chhattisgarh Advocate", color: "bg-[#F8D053]", tier: "Tier B", image: "/assets/images/about-3.jpg" },
    { id: 13, title: "Agriculture & Farming Innovator", color: "bg-[#6EC192]", tier: "Tier B", image: "/assets/images/about-5.jpg" },
    { id: 14, title: "Local Art & Dhokra Craft Promoter", color: "bg-[#00A3A3]", tier: "Tier A", image: "/assets/images/event_awards.jpg" },
    { id: 15, title: "Folk Music & Song Sensation", color: "bg-[#E85D3B]", tier: "Tier A", image: "/assets/images/event_networking.jpg" },
    { id: 16, title: "Health & Wellness Coach", color: "bg-[#8A3FFC]", tier: "Tier C", image: "/assets/images/event_presentation.jpg" },
    { id: 17, title: "Wildlife & Nature Conservationist", color: "bg-[#F87C22]", tier: "Tier B", image: "/assets/images/raipur_landmark.jpg" },
    { id: 18, title: "Women Empowerment Icon", color: "bg-[#F3819F]", tier: "Tier B", image: "/assets/images/about-2.webp" },
    { id: 19, title: "Youth Voice & Podcaster", color: "bg-[#4585F6]", tier: "Tier C", image: "/assets/images/about-4.webp" },
    { id: 20, title: "Sports & Fitness Promoter", color: "bg-[#F8D053]", tier: "Tier C", image: "/assets/images/about-6.webp" },
    { id: 21, title: "Public Policy & Welfare Explainer", color: "bg-[#6EC192]", tier: "Tier B", image: "/assets/images/chattisgarh_fall.jpg" },
    { id: 22, title: "Gaming & Esports Star", color: "bg-[#00A3A3]", tier: "Tier C", image: "/assets/images/category-1.jpg" },
    { id: 23, title: "Regional Cinema & Acting Talent", color: "bg-[#E85D3B]", tier: "Tier A", image: "/assets/images/creator-award.jpg" },
    { id: 24, title: "Comedy & Clean Humour Artist", color: "bg-[#8A3FFC]", tier: "Tier C", image: "/assets/images/emerging awards.jpg" },
    { id: 25, title: "Green & Organic Farming Pioneer", color: "bg-[#F87C22]", tier: "Tier B", image: "/assets/images/about-5.jpg" }
  ];

  // Split categories: 13 on the left, 12 on the right
  const leftColumnAwards = awards.slice(0, 13);
  const rightColumnAwards = awards.slice(13, 25);

  const renderListColumn = (items) => (
    <div className="flex flex-col w-full border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] divide-y-2 divide-black overflow-visible bg-white">
      {items.map((award) => {
        const isLeftCard = award.id % 2 !== 0;
        const isActive = hoveredId === award.id;

        return (
          <div 
            key={award.id} 
            className={`flex items-center justify-center p-4 sm:p-5 relative ${award.color} ${
              isActive ? "z-30" : "hover:z-20"
            } transition-all duration-200 cursor-pointer overflow-visible min-h-[75px] sm:min-h-[85px]`}
            onMouseEnter={() => setHoveredId(award.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setHoveredId(isActive ? null : award.id)}
          >
            {/* Left Image:
               - Visible on hover/tap/active if isLeftCard is true.
               - Large sizing on desktop (lg:w-[110px] lg:h-[138px]), proportional sizing on mobile.
            */}
            {isLeftCard && (
              <div className={`absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 w-14 h-18 sm:w-18 sm:h-22 lg:w-[110px] lg:h-[138px] transition-all duration-300 pointer-events-none z-20 border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] lg:shadow-[3.5px_3.5px_0px_rgba(0,0,0,1)] overflow-hidden rounded-none ${
                isActive 
                  ? "opacity-100 scale-105 rotate-[-6deg]" 
                  : "opacity-0 scale-75 rotate-0"
              }`}>
                <img 
                  src={award.image} 
                  alt={award.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Right Image:
               - Visible on hover/tap/active if isLeftCard is false.
               - Large sizing on desktop (lg:w-[110px] lg:h-[138px]), proportional sizing on mobile.
            */}
            {!isLeftCard && (
              <div className={`absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 w-14 h-18 sm:w-18 sm:h-22 lg:w-[110px] lg:h-[138px] transition-all duration-300 pointer-events-none z-20 border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] lg:shadow-[3.5px_3.5px_0px_rgba(0,0,0,1)] overflow-hidden rounded-none ${
                isActive 
                  ? "opacity-100 scale-105 rotate-[6deg]" 
                  : "opacity-0 scale-75 rotate-0"
              }`}>
                <img 
                  src={award.image} 
                  alt={award.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Center-Aligned Number & Title */}
            <h3 
              className="font-display font-black text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white uppercase tracking-wide z-10 select-text leading-tight px-12 sm:px-20 lg:px-24"
              style={{ textShadow: "1.5px 1.5px 0px #000" }}
            >
              {String(award.id).padStart(2, '0')}. {award.title}
            </h3>

            {/* Tier tag inline absolute top-1 right-2 */}
            <span 
              className="absolute top-1 sm:top-1.5 right-2.5 text-[8px] font-sans font-black uppercase tracking-wider text-white/50 select-none z-10"
              style={{ textShadow: "1px 1px 0px rgba(0,0,0,0.5)" }}
            >
              {award.tier}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <section 
      id="categories" 
      className="w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1500px] mx-auto py-8 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 select-none scroll-mt-24 overflow-visible text-center"
    >
      
      {/* Centered Heading */}
      <div className="flex flex-col items-center justify-center gap-3 max-w-3xl mx-auto mb-10 md:mb-14">
        <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-widest text-[#4585F6]">
          Award Categories
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter leading-none text-zinc-950">
          THE 25 <span className="text-[#F87C22]">CATEGORIES</span>
        </h2>
        {/* Centered block line divider */}
        <div className="h-[5px] w-44 bg-[#4585F6] rounded-none mt-1"></div>
        <p className="text-zinc-600 font-semibold text-sm sm:text-base leading-relaxed mt-3">
          Recognizing and celebrating digital excellence, social impact, and regional cultural representation across 25 distinct awards.
        </p>
      </div>

      {/* 1. Mobile & Tablet Layout (Single merged list of all 25 categories, no column header labels) */}
      <div className="block lg:hidden w-full overflow-visible">
        {renderListColumn(awards)}
      </div>

      {/* 2. Desktop Layout (Two Column Layout: Left Column (1-13) and Right Column (14-25) with headers) */}
      <div className="hidden lg:grid grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-start overflow-visible">
        {/* Left Column (Categories 1 - 13) */}
        <div className="w-full flex flex-col gap-4">
          <div className="text-left font-display font-black text-xs sm:text-sm text-zinc-400 uppercase tracking-widest pl-2">
            Categories 01 - 13
          </div>
          {renderListColumn(leftColumnAwards)}
        </div>

        {/* Right Column (Categories 14 - 25) */}
        <div className="w-full flex flex-col gap-4">
          <div className="text-left font-display font-black text-xs sm:text-sm text-zinc-400 uppercase tracking-widest pl-2">
            Categories 14 - 25
          </div>
          {renderListColumn(rightColumnAwards)}
        </div>
      </div>

    </section>
  );
}
