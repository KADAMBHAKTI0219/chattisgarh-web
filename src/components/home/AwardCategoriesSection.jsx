"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import Heading from "@/components/common/Heading";
import { categoryService } from "@/services/api";
import {
  FaLandmark,
  FaLaptopCode,
  FaHandsHelping,
  FaPalette,
  FaArrowRight,
  FaUsers,
  FaHashtag,
  FaTrophy
} from "react-icons/fa";

import { useRouter } from "next/navigation";

export default function AwardCategoriesSection() {
  const router = useRouter();
  const { t } = useLanguage();
  const { openModal } = useParticipateModal();
  const [activeTier, setActiveTier] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [apiCategories, setApiCategories] = useState([]);
  const tabsRef = useRef(null);

  // Map backend tier enum string to frontend slug
  const mapTierSlug = (tierStr) => {
    if (!tierStr) return "culture";
    if (tierStr === "A_CULTURE_IDENTITY") return "culture";
    if (tierStr === "B_NATION_STATE_BUILDING") return "tech";
    if (tierStr === "C_CRAFT_PLATFORM") return "arts";
    const lower = String(tierStr).toLowerCase();
    if (lower.includes("culture") || lower.includes("heritage")) return "culture";
    if (lower.includes("tech") || lower.includes("nation")) return "tech";
    if (lower.includes("impact") || lower.includes("welfare")) return "impact";
    if (lower.includes("craft") || lower.includes("art")) return "arts";
    return "culture";
  };

  // Fetch Categories from Backend API on mount
  useEffect(() => {
    async function loadApiCategories() {
      const res = await categoryService.getCategories({ isActive: true });
      if (res.success && res.categories && res.categories.length > 0) {
        setApiCategories(res.categories);
      }
    }
    loadApiCategories();
  }, []);

  // Click handler when a user clicks "View Categories →" or a Tier card
  const handleSelectTier = (slug) => {
    router.push(`/categories/${slug}`);
  };

  // 4 Main Tier Groups
  const tiers = [
    {
      slug: "culture",
      tierEnum: "A_CULTURE_IDENTITY",
      title: "Culture & Tourism",
      description:
        "Showcasing the beauty of Chhattisgarh's heritage, traditions, festivals, art, cuisine and breathtaking destinations.",
      icon: FaLandmark,
      color: "#C15B3D", // Primary Terracotta
      bgImage: "/assets/images/raipur_landmark.jpg",
      defaultCount: "06 Categories"
    },
    {
      slug: "tech",
      tierEnum: "B_NATION_STATE_BUILDING",
      title: "Tech & Media",
      description:
        "Honouring digital creators, storytellers, influencers and innovators using technology to inform, entertain and inspire.",
      icon: FaLaptopCode,
      color: "#2E5C31", // Secondary Forest Green
      bgImage: "/assets/images/event_presentation.jpg",
      defaultCount: "07 Categories"
    },
    {
      slug: "impact",
      tierEnum: "B_NATION_STATE_BUILDING",
      title: "Social Impact & Welfare",
      description:
        "Recognising creators driving positive social change, awareness, education, environment and community development.",
      icon: FaHandsHelping,
      color: "#2E5C31", // Secondary Forest Green
      bgImage: "/assets/images/about-5.jpg",
      defaultCount: "05 Categories"
    },
    {
      slug: "arts",
      tierEnum: "C_CRAFT_PLATFORM",
      title: "Arts & Heritage",
      description:
        "Celebrating artists, artisans and creators preserving Chhattisgarh's rich artistic legacy and indigenous crafts.",
      icon: FaPalette,
      color: "#D39B2C", // Amber Gold Accent
      bgImage: "/assets/images/category-1.jpg",
      defaultCount: "06 Categories"
    }
  ];

  // Default fallback static categories
  const fallbackCategories = [
    {
      id: 1,
      tier: "culture",
      title: "Chhattisgarhiya Sanskriti Ambassador",
      image: "/assets/images/raipur_landmark.jpg",
      description: "Celebrating creators showcasing regional heritage, folk music, and local cultural traditions.",
      hashtag: "#ChhattisgarhiyaSanskriti",
      cashPrizeMin: 50000,
      cashPrizeMax: 50000
    },
    {
      id: 2,
      tier: "tech",
      title: "Tech & Civic Innovation Pioneer",
      image: "/assets/images/emerging awards.jpg",
      description: "Honoring creators bringing awareness to AI, smart governance, and infrastructure development.",
      hashtag: "#GovTechBuilder",
      cashPrizeMin: 25000,
      cashPrizeMax: 300000
    },
    {
      id: 3,
      tier: "arts",
      title: "Digital Craftsman & Micro-Creator",
      image: "/assets/images/category-1.jpg",
      description: "Spotlighting emerging nano creators, digital artists, and handicraft storytellers.",
      hashtag: "#MicroCraftCreator",
      cashPrizeMin: 10000,
      cashPrizeMax: 100000
    }
  ];

  // Format backend API categories or use fallback
  const categories = apiCategories.length > 0
    ? apiCategories.map((cat, idx) => ({
        id: cat._id || idx,
        tier: mapTierSlug(cat.tier),
        title: cat.title,
        image: cat.image || "/assets/images/raipur_landmark.jpg",
        description: cat.shortDescription || cat.taskBrief || "",
        hashtag: cat.hashtag || "",
        cashPrizeMin: cat.cashPrizeMin || 0,
        cashPrizeMax: cat.cashPrizeMax || 0,
        prizeTier: cat.prizeTier || ""
      }))
    : fallbackCategories;

  // Compute live counts per tier
  const getTierCount = (tierSlug, tierEnum, defaultCount) => {
    if (apiCategories.length === 0) return defaultCount;
    const matchCount = apiCategories.filter(
      (c) => mapTierSlug(c.tier) === tierSlug || c.tier === tierEnum
    ).length;
    return matchCount > 0 ? `${matchCount < 10 ? '0' + matchCount : matchCount} Categories` : defaultCount;
  };

  return (
    <section
      id="categories"
      className="relative w-full max-w-7xl xl:max-w-[1400px] mx-auto py-8 md:py-12 lg:py-14 px-4 sm:px-6 md:px-8 select-none scroll-mt-24 text-center overflow-visible"
    >
      {/* Centered Heading */}
      <Heading
        badge={t("CATEGORIES")}
        title={t("STATE CREATOR")}
        highlightText={t("CATEGORIES")}
        description={t("Explore categories across our primary tiers. Click any tier to view its specific award categories.")}
        className="mb-12 md:mb-14"
      />

      {/* TIER CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16 text-left">
        {tiers.map((tier) => {
          const IconComp = tier.icon;
          const isSelected = activeTier === tier.slug;
          const categoryCount = getTierCount(tier.slug, tier.tierEnum, tier.defaultCount);

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

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/40 group-hover:from-black/98 group-hover:via-black/75 group-hover:to-black/30 transition-colors duration-500 z-10" />

              {/* Top Row: Icon Badge */}
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

              {/* Content */}
              <div className="relative z-20 flex flex-col gap-3 mt-8">
                <h3 className="font-poppins font-bold text-2xl sm:text-3xl lg:text-4xl !text-white tracking-tight leading-snug group-hover:!text-amber-200 transition-colors duration-300">
                  {t(tier.title)}
                </h3>

                <p className="font-inter text-zinc-200 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-3 group-hover:line-clamp-none group-hover:text-white transition-all duration-300">
                  {t(tier.description)}
                </p>

                {/* Footer Action */}
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
                    <span>{categoryCount}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}