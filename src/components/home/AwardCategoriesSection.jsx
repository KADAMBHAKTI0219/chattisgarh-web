"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function AwardCategoriesSection() {
  const { t } = useLanguage();
  const { openModal } = useParticipateModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const tabsRef = useRef(null);

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const groups = {
    all: { name: "All Categories" },
    culture: { name: "Culture & Tourism", color: "#F87C22", bg: "bg-[#F87C22]/10", border: "border-[#F87C22]" },
    tech: { name: "Tech & Media", color: "#4585F6", bg: "bg-[#4585F6]/10", border: "border-[#4585F6]" },
    impact: { name: "Social Impact & Welfare", color: "#00A3A3", bg: "bg-[#00A3A3]/10", border: "border-[#00A3A3]" }
  };

  const categories = [
    {
      id: 1,
      group: "culture",
      title: "Sanskriti Ambassador",
      image: "/assets/images/raipur_landmark.jpg",
      description: "Promoting Chhattisgarh's rich heritage, historical temples, and vibrant folk festivals."
    },
    {
      id: 2,
      group: "culture",
      title: "Tribal Heritage Creator",
      image: "/assets/images/chattisgarh_fall.jpg",
      description: "Showcasing indigenous Bastar arts, folk traditions, and local languages."
    },
    {
      id: 3,
      group: "tech",
      title: "Emerging Tech & Edu Creator",
      image: "/assets/images/emerging awards.jpg",
      description: "Empowering viewers with coding tutorials, tech reviews, and educational animations."
    },
    {
      id: 4,
      group: "tech",
      title: "Best YouTube Creator",
      image: "/assets/images/creator-award.jpg",
      description: "Celebrating high-quality storytelling, cinematography, and long-form video excellence."
    },
    {
      id: 5,
      group: "tech",
      title: "Best Instagram Creator",
      image: "/assets/images/instagramaward.avif",
      description: "Recognizing high-impact vertical reels, daily trends, and cinematic short-form clips."
    },
    {
      id: 6,
      group: "tech",
      title: "Best Emerging Creator",
      image: "/assets/images/about-4.webp",
      description: "Spotlighting fresh, new channels with high growth potential and creative formats."
    },
    {
      id: 7,
      group: "tech",
      title: "Best Influencer",
      image: "/assets/images/event_networking.jpg",
      description: "Fostering positive communities through lifestyle hacks, motivation, and healthy advice."
    },
    {
      id: 8,
      group: "culture",
      title: "Best Food Creator",
      image: "/assets/images/food-award.webp",
      description: "Discovering classic Chhattisgarhi recipes, local ingredients, and street-food gems."
    },
    {
      id: 9,
      group: "culture",
      title: "Best Travel Creator",
      image: "/assets/images/travellor award.jpg",
      description: "Guiding travelers to hidden waterfalls, forests, and cultural landmarks of Chhattisgarh."
    },
    {
      id: 10,
      group: "culture",
      title: "Best Fashion Creator",
      image: "/assets/images/fashion-awards.avif",
      description: "Celebrating ethnic textiles, local weaves, modern trends, and modeling portfolios."
    },
    {
      id: 11,
      group: "tech",
      title: "People's Choice Award",
      image: "/assets/images/proplechoiceawards.jpg",
      description: "The ultimate creator selected entirely by the public through democratic online votes."
    },
    {
      id: 12,
      group: "impact",
      title: "Swachh State Advocate",
      image: "/assets/images/about-1.jpg",
      description: "Campaigning for public cleanliness, local recycling initiatives, and waste management."
    },
    {
      id: 13,
      group: "impact",
      title: "Agriculture Innovator",
      image: "/assets/images/about-3.jpg",
      description: "Educating regional farmers with smart tools, organic practices, and soil health tips."
    },
    {
      id: 14,
      group: "culture",
      title: "Dhokra Art Promoter",
      image: "/assets/images/category-1.jpg",
      description: "Showcasing the ancient non-ferrous metal casting craft and its tribal artisans."
    },
    {
      id: 15,
      group: "culture",
      title: "Folk Music Sensation",
      image: "/assets/images/about-6.webp",
      description: "Singing, composing, and popularizing traditional regional folk music tracks."
    },
    {
      id: 16,
      group: "impact",
      title: "Health & Wellness Coach",
      image: "/assets/images/about-2.webp",
      description: "Promoting physical fitness, yoga, mental wellness, and local nutritional diets."
    },
    {
      id: 17,
      group: "impact",
      title: "Nature Conservationist",
      image: "/assets/images/chattisgarh_fall.jpg",
      description: "Advocating for forestry, wildlife protection, and environment-friendly habits."
    },
    {
      id: 18,
      group: "impact",
      title: "Women Empowerment Icon",
      image: "/assets/images/about-5.jpg",
      description: "Supporting women entrepreneurs, self-help groups, and gender equality initiatives."
    },
    {
      id: 19,
      group: "tech",
      title: "Youth Voice & Podcaster",
      image: "/assets/images/event_presentation.jpg",
      description: "Amplifying local stories, deep dialogues, and societal debates via podcast series."
    },
    {
      id: 20,
      group: "tech",
      title: "Sports & Fitness Promoter",
      image: "/assets/images/event_awards.jpg",
      description: "Highlighting regional games, kabaddi tournaments, and local athletic champions."
    },
    {
      id: 21,
      group: "impact",
      title: "Welfare Explainer",
      image: "/assets/images/about-2.jpg",
      description: "Breaking down complex government welfare schemes for easy understanding."
    },
    {
      id: 22,
      group: "tech",
      title: "Gaming & Esports Star",
      image: "/assets/images/about-4.webp",
      description: "Streaming live, promoting gaming content, and showcasing esports talents in CG."
    },
    {
      id: 23,
      group: "culture",
      title: "Regional Acting Talent",
      image: "/assets/images/about-3.jpg",
      description: "Inspiring audiences with short plays, theater clips, and regional screen performances."
    },
    {
      id: 24,
      group: "impact",
      title: "Comedy & Clean Humour",
      image: "/assets/images/about-6.webp",
      description: "Bringing joy with clean family humor, everyday observations, and funny skits."
    },
    {
      id: 25,
      group: "impact",
      title: "Organic Farming Pioneer",
      image: "/assets/images/about-1.jpg",
      description: "Guiding the transition to chemical-free agriculture and sustainable local crops."
    }
  ];

  const filteredCategories = categories.filter((cat) => {
    if (activeTab !== "all" && cat.group !== activeTab) return false;
    const title = t(cat.title).toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query);
  });

  return (
    <section
      id="categories"
      className="relative w-full max-w-7xl xl:max-w-[1400px] mx-auto py-8 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 select-none scroll-mt-24 text-center overflow-visible"
    >
      {/* Centered Heading */}
      <div className="flex flex-col items-center text-center gap-2 max-w-2xl xl:max-w-4xl px-6 mx-auto mb-10">
        <span className="font-sans font-bold text-xs xl:text-sm uppercase tracking-widest text-[#F798B4]">
          {t("categories")}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold uppercase text-zinc-950 leading-tight">
          {t("state")}{" "}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B95] to-[#FF6B95]">{t("categories")}</span>
        </h2>
        <div className="h-[4px] w-32 bg-gradient-to-r from-[#F798B4] to-[#EE5D8C] rounded-full mt-1"></div>
      </div>

      {/* Group Navigation Tabs & Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 w-full mb-10">

        {/* Tabs Filter Slider with < and > Navigation Arrows (Hidden on md and lg screens) */}
        <div className="flex items-center gap-2.5 w-full md:w-auto min-w-0">
          {/* Left Arrow Button */}
          <button
            onClick={() => scrollTabs("left")}
            className="flex md:hidden items-center justify-center w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-full border border-zinc-300 bg-white text-zinc-700 hover:text-black hover:border-zinc-500 hover:bg-zinc-100 shadow-sm shrink-0 transition-all cursor-pointer z-10"
            aria-label="Scroll left"
            title="Scroll categories left"
          >
            <FaChevronLeft className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          </button>

          {/* Scrollable Tabs Container with hidden scrollbar */}
          <div className="relative flex-1 min-w-0 overflow-hidden py-1">
            <div
              ref={tabsRef}
              className="flex items-center justify-start gap-2.5 overflow-x-auto no-scrollbar scroll-smooth px-1"
            >
              {Object.keys(groups).map((key) => {
                const grp = groups[key];
                const name = t(grp.name);
                const isActive = activeTab === key;

                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`shrink-0 whitespace-nowrap px-4 py-2 sm:px-5 sm:py-2.5 font-extrabold text-xs sm:text-sm transition-all duration-300 rounded-full border cursor-pointer select-none flex items-center gap-1.5 ${isActive
                      ? "bg-[#123E4A] text-white border-[#123E4A]  scale-[1.02]"
                      : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400"
                      }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#F3819F] animate-pulse"></span>}
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => scrollTabs("right")}
            className="flex md:hidden items-center justify-center w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-full border border-zinc-300 bg-white text-zinc-700 hover:text-black hover:border-zinc-500 hover:bg-zinc-100 shadow-sm shrink-0 transition-all cursor-pointer z-10"
            aria-label="Scroll right"
            title="Scroll categories right"
          >
            <FaChevronRight className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full md:max-w-xs flex items-center border border-zinc-200 focus-within:border-[#F3819F] focus-within:ring-2 focus-within:ring-[#F3819F]/20 bg-white rounded-full shadow-sm shrink-0 transition-all duration-300">
          <span className="pl-3.5 text-zinc-400">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Categories"
            className="w-full py-2.5 px-2 text-zinc-850 font-bold text-xs sm:text-sm focus:outline-none placeholder-zinc-400 bg-transparent rounded-full"
            aria-label="Search Categories"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="pr-3.5 text-zinc-400 hover:text-zinc-700 cursor-pointer font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid of Category Cards — 2 Columns on Mobile, 2 on SM, 3 on MD, 4 on LG, 5 on XL */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
        {filteredCategories.map((cat) => {
          const grpInfo = groups[cat.group];
          const groupColor = grpInfo.color;
          const groupName = grpInfo.name;

          return (
            <div
              key={cat.id}
              onClick={openModal}
              className="reveal-child relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden group border border-zinc-200/50 hover:border-[#F798B4]/60 hover:-translate-y-1.5 transition-all duration-500 select-none cursor-pointer flex flex-col justify-end p-3.5 sm:p-5"
            >
              {/* Background Cover Image */}
              <img
                src={cat.image}
                alt={t(cat.title)}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 saturate-[0.7] contrast-[1.05] opacity-90 group-hover:saturate-100 group-hover:scale-110 group-hover:opacity-100 z-0 bg-zinc-800"
                loading="lazy"
              />

              {/* Gradient Dark Overlay (deepens on hover) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 group-hover:via-black/75 group-hover:to-black/30 transition-all duration-500 z-10" />

              {/* Stream Badge at top left */}
              <span
                className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-20 text-[8px] sm:text-[9px] font-bold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-white backdrop-blur-md border border-white/20 shadow-xs truncate max-w-[80%]"
                style={{ backgroundColor: `${groupColor}d0` }}
              >
                {t(groupName)}
              </span>

              {/* Category Content Overlay at Bottom */}
              <div className="relative z-20 flex flex-col justify-end text-left w-full">
                <h3 className="font-display font-bold text-xs sm:text-sm md:text-base uppercase text-white tracking-tight leading-snug group-hover:text-[#F798B4] transition-colors duration-300">
                  {t(cat.title)}
                </h3>

                {/* Description - Slides up smoothly from bottom on hover */}
                <div className="overflow-hidden">
                  <p className="text-zinc-200 font-medium text-[10px] sm:text-xs leading-snug sm:leading-relaxed transform translate-y-6 opacity-0 max-h-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:max-h-28 group-hover:mt-2 transition-all duration-500 ease-out">
                    {t(cat.description)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-zinc-400 font-bold text-base py-12">
          No categories match your search.
        </div>
      )}

    </section>
  );
}