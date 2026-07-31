"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import Heading from "@/components/common/Heading";
import Button from "@/components/common/Button";
import {
  FaLandmark,
  FaLaptopCode,
  FaHandsHelping,
  FaPalette,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
  FaUsers
} from "react-icons/fa";

export default function AwardCategoriesSection() {
  const { t } = useLanguage();
  const { openModal } = useParticipateModal();
  const [activeTier, setActiveTier] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const tabsRef = useRef(null);
  const categoriesGridRef = useRef(null);

  // 4 Main Tier Groups matching reference UI screenshot
  const tiers = [
    {
      slug: "culture",
      title: "Culture & Tourism",
      description:
        "Showcasing the beauty of Chhattisgarh's heritage, traditions, festivals, art, cuisine and breathtaking destinations.",
      icon: FaLandmark,
      color: "#C15B3D", // Primary Terracotta
      bgImage: "/assets/images/raipur_landmark.jpg",
      count: "06 Categories"
    },
    {
      slug: "tech",
      title: "Tech & Media",
      description:
        "Honouring digital creators, storytellers, influencers and innovators using technology to inform, entertain and inspire.",
      icon: FaLaptopCode,
      color: "#2E5C31", // Secondary Forest Green
      bgImage: "/assets/images/event_presentation.jpg",
      count: "07 Categories"
    },
    {
      slug: "impact",
      title: "Social Impact & Welfare",
      description:
        "Recognising creators driving positive social change, awareness, education, environment and community development.",
      icon: FaHandsHelping,
      color: "#4585F6", // Royal Blue Accent
      bgImage: "/assets/images/about-5.jpg",
      count: "05 Categories"
    },
    {
      slug: "arts",
      title: "Arts & Heritage",
      description:
        "Celebrating artists, artisans and creators preserving Chhattisgarh's rich artistic legacy and indigenous crafts.",
      icon: FaPalette,
      color: "#D39B2C", // Amber Gold Accent
      bgImage: "/assets/images/category-1.jpg",
      count: "06 Categories"
    }
  ];

  // Detailed Sub-Categories mapping to tier slugs
  const categories = [
    // Culture & Tourism
    {
      id: 1,
      tier: "culture",
      title: "Sanskriti Ambassador",
      image: "/assets/images/raipur_landmark.jpg",
      description: "Promoting Chhattisgarh's rich heritage, historical temples, and vibrant folk festivals."
    },
    {
      id: 2,
      tier: "culture",
      title: "Tribal Heritage Creator",
      image: "/assets/images/chattisgarh_fall.jpg",
      description: "Showcasing indigenous Bastar arts, folk traditions, and local languages."
    },
    {
      id: 8,
      tier: "culture",
      title: "Best Food Creator",
      image: "/assets/images/food-award.webp",
      description: "Discovering classic Chhattisgarhi recipes, local ingredients, and street-food gems."
    },
    {
      id: 9,
      tier: "culture",
      title: "Best Travel Creator",
      image: "/assets/images/travellor award.jpg",
      description: "Guiding travelers to hidden waterfalls, forests, and cultural landmarks of Chhattisgarh."
    },
    {
      id: 10,
      tier: "culture",
      title: "Best Fashion Creator",
      image: "/assets/images/fashion-awards.avif",
      description: "Celebrating ethnic textiles, local weaves, modern trends, and modeling portfolios."
    },
    {
      id: 15,
      tier: "culture",
      title: "Folk Music Sensation",
      image: "/assets/images/about-6.webp",
      description: "Singing, composing, and popularizing traditional regional folk music tracks."
    },

    // Tech & Media
    {
      id: 3,
      tier: "tech",
      title: "Emerging Tech & Edu Creator",
      image: "/assets/images/emerging awards.jpg",
      description: "Empowering viewers with coding tutorials, tech reviews, and educational animations."
    },
    {
      id: 4,
      tier: "tech",
      title: "Best YouTube Creator",
      image: "/assets/images/creator-award.jpg",
      description: "Celebrating high-quality storytelling, cinematography, and long-form video excellence."
    },
    {
      id: 5,
      tier: "tech",
      title: "Best Instagram Creator",
      image: "/assets/images/instagramaward.avif",
      description: "Recognizing high-impact vertical reels, daily trends, and cinematic short-form clips."
    },
    {
      id: 6,
      tier: "tech",
      title: "Best Emerging Creator",
      image: "/assets/images/about-4.webp",
      description: "Spotlighting fresh, new channels with high growth potential and creative formats."
    },
    {
      id: 7,
      tier: "tech",
      title: "Best Influencer",
      image: "/assets/images/event_networking.jpg",
      description: "Fostering positive communities through lifestyle hacks, motivation, and healthy advice."
    },
    {
      id: 11,
      tier: "tech",
      title: "People's Choice Award",
      image: "/assets/images/proplechoiceawards.jpg",
      description: "The ultimate creator selected entirely by the public through democratic online votes."
    },
    {
      id: 22,
      tier: "tech",
      title: "Gaming & Esports Star",
      image: "/assets/images/about-4.webp",
      description: "Streaming live, promoting gaming content, and showcasing esports talents in CG."
    },

    // Social Impact & Welfare
    {
      id: 12,
      tier: "impact",
      title: "Swachh State Advocate",
      image: "/assets/images/about-1.jpg",
      description: "Campaigning for public cleanliness, local recycling initiatives, and waste management."
    },
    {
      id: 13,
      tier: "impact",
      title: "Agriculture Innovator",
      image: "/assets/images/about-3.jpg",
      description: "Educating regional farmers with smart tools, organic practices, and soil health tips."
    },
    {
      id: 16,
      tier: "impact",
      title: "Health & Wellness Coach",
      image: "/assets/images/about-2.webp",
      description: "Promoting physical fitness, yoga, mental wellness, and local nutritional diets."
    },
    {
      id: 17,
      tier: "impact",
      title: "Nature Conservationist",
      image: "/assets/images/chattisgarh_fall.jpg",
      description: "Advocating for forestry, wildlife protection, and environment-friendly habits."
    },
    {
      id: 18,
      tier: "impact",
      title: "Women Empowerment Icon",
      image: "/assets/images/about-5.jpg",
      description: "Supporting women entrepreneurs, self-help groups, and gender equality initiatives."
    },

    // Arts & Heritage
    {
      id: 14,
      tier: "arts",
      title: "Dhokra Art Promoter",
      image: "/assets/images/category-1.jpg",
      description: "Showcasing the ancient non-ferrous metal casting craft and its tribal artisans."
    },
    {
      id: 23,
      tier: "arts",
      title: "Regional Acting Talent",
      image: "/assets/images/about-3.jpg",
      description: "Inspiring audiences with short plays, theater clips, and regional screen performances."
    },
    {
      id: 24,
      tier: "arts",
      title: "Comedy & Clean Humour",
      image: "/assets/images/about-6.webp",
      description: "Bringing joy with clean family humor, everyday observations, and funny skits."
    },
    {
      id: 25,
      tier: "arts",
      title: "Organic Farming Pioneer",
      image: "/assets/images/about-1.jpg",
      description: "Guiding the transition to chemical-free agriculture and sustainable local crops."
    }
  ];

  // Click handler when a user clicks "View Categories →" on a Tier card
  const handleSelectTier = (slug) => {
    setActiveTier(slug);
    if (categoriesGridRef.current) {
      categoriesGridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Filter categories by active tier and search query
  const filteredCategories = categories.filter((cat) => {
    if (activeTier !== "all" && cat.tier !== activeTier) return false;
    if (!searchQuery) return true;
    const title = t(cat.title).toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query);
  });

  return (
    <section
      id="categories"
      className="relative w-full max-w-7xl xl:max-w-[1400px] mx-auto py-10 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 select-none scroll-mt-24 text-center overflow-visible"
    >
      {/* Centered Heading */}
      <Heading
        badge={t("CATEGORIES")}
        title={t("STATE CREATOR")}
        highlightText={t("CATEGORIES")}
        description={t("Explore categories across our 4 primary tiers. Click any tier to filter its specific award categories.")}
        className="mb-12 md:mb-14"
      />

      {/* ==========================================================
          1. TIER CARDS GRID (2x2 Grid on Desktop, 1 col on Mobile)
         ========================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16 text-left">
        {tiers.map((tier) => {
          const IconComp = tier.icon;
          const isSelected = activeTier === tier.slug;

          return (
            <div
              key={tier.slug}
              onClick={() => handleSelectTier(tier.slug)}
              className={`relative min-h-[300px] sm:min-h-[320px] rounded-3xl overflow-hidden group cursor-pointer border transition-all duration-500 flex flex-col justify-between p-6 sm:p-8 ${
                isSelected
                  ? "border-[var(--primary)] ring-4 ring-[var(--primary)]/20 shadow-xl scale-[1.01]"
                  : "border-zinc-200/80 hover:border-zinc-400 shadow-md hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {/* Card Background Cover Image */}
              <img
                src={tier.bgImage}
                alt={t(tier.title)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 z-0 bg-zinc-900"
                loading="lazy"
              />

              {/* Gradient Dark Overlay for optimal text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/40 group-hover:from-black/98 group-hover:via-black/75 group-hover:to-black/30 transition-colors duration-500 z-10" />

              {/* Top Row: Circular Icon Badge */}
              <div className="relative z-20 flex items-center justify-between">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-lg backdrop-blur-md border border-white/20 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: tier.color }}
                >
                  <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                {isSelected && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--primary)] text-white shadow-md uppercase tracking-wider">
                    Active Tier
                  </span>
                )}
              </div>

              {/* Middle & Bottom Content */}
              <div className="relative z-20 flex flex-col gap-3 mt-8">
                {/* Title */}
                <h3 className="font-poppins font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-snug group-hover:text-amber-200 transition-colors duration-300">
                  {t(tier.title)}
                </h3>

                {/* Description (Visible & smoothly highlights on hover) */}
                <p className="font-inter text-zinc-200 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-3 group-hover:line-clamp-none group-hover:text-white transition-all duration-300">
                  {t(tier.description)}
                </p>

                {/* Card Footer: Action Button & Count Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/15 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTier(tier.slug);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 bg-black/40 hover:bg-white hover:text-zinc-950 text-white font-inter font-bold text-xs sm:text-sm tracking-wide backdrop-blur-md transition-all duration-300 group-hover:border-amber-300"
                  >
                    <span>View Categories</span>
                    <FaArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>

                  <span className="inline-flex items-center gap-1.5 text-zinc-300 font-inter font-bold text-xs sm:text-sm">
                    <FaUsers className="w-3.5 h-3.5 text-amber-300" />
                    <span>{tier.count}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==========================================================
          2. SUB-CATEGORIES SECTION (Scroll Target & Filters)
         ========================================================== */}
      <div ref={categoriesGridRef} className="pt-4 scroll-mt-24">
        {/* Tier Selection Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 w-full mb-10 bg-white/60 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-zinc-200/80 shadow-sm">
          {/* Scrollable Tabs */}
          <div className="flex items-center gap-2 w-full md:w-auto min-w-0">
            <button
              onClick={() => scrollTabs("left")}
              className="flex md:hidden items-center justify-center w-8 h-8 rounded-full border border-zinc-300 bg-white text-zinc-700 shadow-sm shrink-0"
              aria-label="Scroll tabs left"
            >
              <FaChevronLeft className="w-3 h-3" />
            </button>

            <div
              ref={tabsRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1 py-1"
            >
              <button
                onClick={() => setActiveTier("all")}
                className={`shrink-0 px-4 py-2 rounded-full font-inter font-bold text-xs sm:text-sm transition-all cursor-pointer border ${
                  activeTier === "all"
                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md"
                    : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400"
                }`}
              >
                All Categories
              </button>

              {tiers.map((tGroup) => (
                <button
                  key={tGroup.slug}
                  onClick={() => setActiveTier(tGroup.slug)}
                  className={`shrink-0 px-4 py-2 rounded-full font-inter font-bold text-xs sm:text-sm transition-all cursor-pointer border ${
                    activeTier === tGroup.slug
                      ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md"
                      : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  {t(tGroup.title)}
                </button>
              ))}
            </div>

            <button
              onClick={() => scrollTabs("right")}
              className="flex md:hidden items-center justify-center w-8 h-8 rounded-full border border-zinc-300 bg-white text-zinc-700 shadow-sm shrink-0"
              aria-label="Scroll tabs right"
            >
              <FaChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:max-w-xs flex items-center border border-zinc-300 focus-within:border-[var(--primary)] bg-white rounded-full shadow-sm">
            <span className="pl-3.5 text-zinc-400">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Categories..."
              className="w-full py-2 px-2 text-zinc-850 font-inter font-semibold text-xs sm:text-sm focus:outline-none placeholder-zinc-400 bg-transparent rounded-full"
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

        {/* Sub-Categories Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredCategories.map((cat) => {
            const currentTier = tiers.find((tGroup) => tGroup.slug === cat.tier);

            return (
              <div
                key={cat.id}
                onClick={openModal}
                className="relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden group border border-zinc-200/80 hover:border-[var(--primary)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 select-none cursor-pointer flex flex-col justify-end p-4 sm:p-5 text-left"
              >
                {/* Image */}
                <img
                  src={cat.image}
                  alt={t(cat.title)}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100 z-0 bg-zinc-800"
                  loading="lazy"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent group-hover:from-black/98 group-hover:via-black/75 group-hover:to-black/30 transition-all duration-500 z-10" />

                {/* Tier Badge */}
                {currentTier && (
                  <span
                    className="absolute top-3 left-3 z-20 text-[9px] font-inter font-bold uppercase px-2.5 py-1 rounded-full text-white backdrop-blur-md border border-white/20 shadow-sm"
                    style={{ backgroundColor: currentTier.color }}
                  >
                    {t(currentTier.title)}
                  </span>
                )}

                {/* Title & Expandable Description on Hover / Mobile Touch */}
                <div className="relative z-20 flex flex-col justify-end w-full">
                  <h4 className="font-poppins font-bold text-sm sm:text-base md:text-lg uppercase text-white tracking-tight leading-snug group-hover:text-amber-200 transition-colors duration-300">
                    {t(cat.title)}
                  </h4>

                  {/* Description - Expands smoothly on hover / tap */}
                  <div className="overflow-hidden">
                    <p className="font-inter text-zinc-200 text-xs leading-relaxed transform translate-y-4 opacity-0 max-h-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:max-h-32 group-hover:mt-2 transition-all duration-500 ease-out">
                      {t(cat.description)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-zinc-500 font-inter font-bold text-base py-16 bg-white/40 border border-zinc-200 rounded-2xl">
            No categories found matching your search.
          </div>
        )}
      </div>
    </section>
  );
}