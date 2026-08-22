"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import Heading from "@/components/common/Heading";
import CategoryDetailModal from "@/components/common/CategoryDetailModal";
import { categoryService } from "@/services/api";
import { FaSearch } from "react-icons/fa";

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

export default function AwardCategoriesSection() {
  const { t } = useLanguage();
  const { openModal } = useParticipateModal();
  const [activeTier, setActiveTier] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [apiCategories, setApiCategories] = useState([]);
  const [selectedDetailCategory, setSelectedDetailCategory] = useState(null);

  // Fetch Categories from Backend API on mount
  useEffect(() => {
    async function loadApiCategories() {
      try {
        const res = await categoryService.getCategories({ isActive: true });
        if (res.success && Array.isArray(res.categories)) {
          setApiCategories(res.categories);
        } else if (Array.isArray(res.data)) {
          setApiCategories(res.data);
        }
      } catch (err) {
        console.warn("Failed to load API categories in AwardCategoriesSection:", err);
      }
    }
    loadApiCategories();
  }, []);

  // Format categories strictly from API
  const allCategoriesList = apiCategories.map((cat, idx) => ({
    id: cat._id || `api-${idx}`,
    tier: mapTierSlug(cat.tier),
    title: cat.title || cat.name || "Award Category",
    image: cat.image || "/assets/images/raipur_landmark.jpg",
    description: cat.shortDescription || cat.description || cat.taskBrief || "",
    taskBrief: cat.taskBrief || "",
    cashPrizeMin: cat.cashPrizeMin || 25000,
    cashPrizeMax: cat.cashPrizeMax || 100000,
    color: cat.tier?.includes("CULTURE") ? "#C15B3D" : cat.tier?.includes("NATION") ? "#2E5C31" : "#D39B2C"
  }));

  // Deduplicate by title
  const uniqueCategories = Array.from(
    new Map(allCategoriesList.map((item) => [item.title.toLowerCase(), item])).values()
  );

  // Filter categories by active tier tab and search query
  const filteredCategories = uniqueCategories.filter((cat) => {
    if (activeTier !== "all" && cat.tier !== activeTier) return false;
    if (!searchQuery) return true;
    const title = t(cat.title).toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query);
  });

  const TIER_TABS = [
    { slug: "all", label: "All Categories", count: uniqueCategories.length },
    { slug: "culture", label: "Culture & Tourism", count: uniqueCategories.filter(c => c.tier === "culture").length },
    { slug: "tech", label: "Tech & Media", count: uniqueCategories.filter(c => c.tier === "tech").length },
    { slug: "impact", label: "Social Impact & Welfare", count: uniqueCategories.filter(c => c.tier === "impact").length },
    { slug: "arts", label: "Arts & Heritage", count: uniqueCategories.filter(c => c.tier === "arts").length },
  ];

  return (
    <section
      id="categories"
      className="relative w-full max-w-7xl xl:max-w-[1400px] mx-auto py-8 md:py-12 lg:py-14 px-4 sm:px-6 md:px-8 select-none scroll-mt-24 text-center overflow-visible"
    >
      {/* Centered Heading */}
      <Heading
        badge={t("AWARD CATEGORIES")}
        title={t("25 STATE CREATOR")}
        highlightText={t("CATEGORIES")}
        description={t("Explore all 25 official award categories. Click any category box to view details and apply directly.")}
        className="mb-8 md:mb-10"
      />

      {/* Interactive Tier Filter Tabs & Search Bar */}
      <div className="w-full mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border border-zinc-200/90 shadow-sm">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full md:w-auto px-1 py-1">
          {TIER_TABS.map((tab) => (
            <button
              key={tab.slug}
              onClick={() => setActiveTier(tab.slug)}
              className={`shrink-0 px-4 py-2 rounded-full font-inter font-bold text-xs sm:text-sm transition-all duration-300 border cursor-pointer select-none ${activeTier === tab.slug
                ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md scale-[1.02]"
                : "bg-white text-zinc-700 border-zinc-200/90 hover:border-zinc-400 hover:bg-zinc-50"
                }`}
            >
              {t(tab.label)} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:max-w-xs flex items-center border border-zinc-300 focus-within:border-[var(--primary)] bg-white rounded-full shadow-sm">
          <span className="pl-3.5 text-[var(--primary)]">
            <FaSearch className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Categories..."
            className="w-full py-2 px-3 text-zinc-850 font-inter font-semibold text-xs sm:text-sm focus:outline-none placeholder-zinc-400 bg-transparent rounded-full"
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

      {/* 25 CATEGORIES GRID — EVEN SPACING & PROPER GAPS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelectedDetailCategory(cat)}
            className="relative aspect-square rounded-2xl overflow-hidden group border border-zinc-200/80 hover:border-[var(--primary)] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 select-none cursor-pointer flex flex-col justify-end p-3 sm:p-4 text-left"
          >
            {/* Background Image */}
            <img
              src={cat.image}
              alt={t(cat.title)}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100 z-0 bg-zinc-900"
              loading="lazy"
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/55 to-black/35 group-hover:from-black/55 group-hover:via-black/65 transition-all duration-300 z-10" />

            {/* Tier Badge */}
            <div className="absolute top-2.5 left-2.5 z-20 max-w-[90%]">
              <span
                className="inline-block text-[8.5px] xs:text-[9px] sm:text-[9.5px] font-inter font-bold uppercase px-2.5 py-0.5 rounded-full text-white backdrop-blur-md border border-white/20 shadow-xs tracking-wider truncate max-w-full"
                style={{ backgroundColor: cat.color || "#C15B3D" }}
              >
                {cat.tier === "culture" ? "Culture" : cat.tier === "tech" ? "Tech & Media" : cat.tier === "impact" ? "Social Impact" : "Arts"}
              </span>
            </div>

            {/* Title & Overlay */}
            <div className="relative z-20 flex flex-col justify-end w-full">
              <h3 className="font-poppins font-bold text-[11px] xs:text-xs sm:text-xs md:text-sm uppercase !text-white tracking-tight leading-tight line-clamp-3 group-hover:!text-amber-200 transition-colors duration-300">
                {t(cat.title)}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-zinc-500 font-inter font-bold text-base py-16 bg-white/60 border border-zinc-200 rounded-3xl text-center">
          No categories match your search.
        </div>
      )}

      {/* Category Detail Popup Modal */}
      <CategoryDetailModal
        category={selectedDetailCategory}
        isOpen={!!selectedDetailCategory}
        onClose={() => setSelectedDetailCategory(null)}
        onNominate={(catTitle) => {
          openModal(catTitle);
        }}
      />
    </section>
  );
}