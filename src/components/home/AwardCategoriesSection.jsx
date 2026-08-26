"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import Heading from "@/components/common/Heading";
import CategoryDetailModal from "@/components/common/CategoryDetailModal";
import { categoryService } from "@/services/api";
import { extractDynamicTiers, getTierSlug, getTierColor, getTierTitle } from "@/utils/tierUtils";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function AwardCategoriesSection() {
  const { t } = useLanguage();
  const { openModal } = useParticipateModal();
  const [activeTier, setActiveTier] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [apiCategories, setApiCategories] = useState([]);
  const [selectedDetailCategory, setSelectedDetailCategory] = useState(null);
  const tabsRef = useRef(null);

  // Fetch Categories from Backend API on mount
  useEffect(() => {
    async function loadApiCategories() {
      try {
        const res = await categoryService.getCategories({ isActive: true });
        let fetchedList = [];
        if (res?.categories && Array.isArray(res.categories) && res.categories.length > 0) {
          fetchedList = res.categories;
        } else if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          fetchedList = res.data;
        } else if (res?.data?.categories && Array.isArray(res.data.categories) && res.data.categories.length > 0) {
          fetchedList = res.data.categories;
        }

        if (fetchedList.length > 0) {
          setApiCategories(fetchedList);
        }
      } catch (err) {
        console.warn("Error loading categories from API:", err);
      }
    }
    loadApiCategories();
  }, []);

  // Format categories cleanly
  const formattedCategories = apiCategories.map((cat, idx) => {
    const rawTier = cat.tier || cat.tierName || "General Tier";
    const tierNum = cat.tierNumber || null;
    const tierSlug = getTierSlug(rawTier, tierNum);
    const tierTitle = getTierTitle(rawTier, tierNum);
    const badgeColor = getTierColor(rawTier, tierNum);

    return {
      id: cat._id || cat.slug || `cat-${idx}`,
      categoryNumber: cat.categoryNumber || idx + 1,
      tierNumber: tierNum,
      tierSlug,
      tierTitle,
      badgeColor,
      title: cat.title || cat.name || "Award Category",
      slug: cat.slug || "",
      image: cat.image || "/assets/images/category-1.jpg",
      shortDescription: cat.shortDescription || cat.description || "",
      fullDescription: cat.fullDescription || "",
      taskBrief: cat.taskBrief || "",
      hashtag: cat.hashtag || "",
      isFeatured: cat.isFeatured ?? false,
      isActive: cat.isActive ?? true
    };
  });

  // Deduplicate categories by title
  const uniqueCategories = Array.from(
    new Map(formattedCategories.map((item) => [item.title.toLowerCase(), item])).values()
  );

  // Dynamic Tiers generated from category data (11 Tiers + All Categories)
  const tierTabs = extractDynamicTiers(uniqueCategories);

  // Scroll horizontal tabs on mobile
  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Filter categories by active tier tab and search query
  const filteredCategories = uniqueCategories.filter((cat) => {
    if (activeTier !== "all" && cat.tierSlug !== activeTier) return false;
    if (!searchQuery) return true;
    const titleText = t(cat.title).toLowerCase();
    const descText = t(cat.shortDescription || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return titleText.includes(query) || descText.includes(query);
  });

  return (
    <section
      id="categories"
      className="relative w-full max-w-7xl xl:max-w-[1400px] mx-auto py-8 md:py-12 lg:py-14 px-4 sm:px-6 md:px-8 select-none scroll-mt-24 text-center overflow-visible"
    >
      {/* Centered Heading */}
      <Heading
        badge={t("AWARD CATEGORIES")}
        title={t("39 CREATOR")}
        highlightText={t("CATEGORIES ACROSS 11 TIERS")}
        description={t("Explore all 39 official state award categories structured across 11 key governance, technology, culture, and innovation tiers.")}
        className="mb-8 md:mb-10"
      />

      {/* Dynamic Tier Filter Tabs & Search Bar */}
      <div className="w-full mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border border-zinc-200/90 shadow-sm">
        
        {/* Dynamic Filter Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto min-w-0">
          <button
            onClick={() => scrollTabs("left")}
            className="flex md:hidden items-center justify-center w-8 h-8 rounded-full border border-zinc-300 bg-white text-zinc-700 shadow-sm shrink-0"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="w-3 h-3" />
          </button>

          <div
            ref={tabsRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1 py-1 w-full md:w-auto"
          >
            {tierTabs.map((tab) => (
              <button
                key={tab.slug}
                onClick={() => setActiveTier(tab.slug)}
                className={`shrink-0 px-4 py-2 rounded-full font-inter font-bold text-xs sm:text-sm transition-all duration-300 border cursor-pointer select-none ${
                  activeTier === tab.slug
                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md scale-[1.02]"
                    : "bg-white text-zinc-700 border-zinc-200/90 hover:border-zinc-400 hover:bg-zinc-50"
                }`}
              >
                {t(tab.title)} ({tab.count})
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollTabs("right")}
            className="flex md:hidden items-center justify-center w-8 h-8 rounded-full border border-zinc-300 bg-white text-zinc-700 shadow-sm shrink-0"
            aria-label="Scroll right"
          >
            <FaChevronRight className="w-3 h-3" />
          </button>
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

      {/* 39 CATEGORIES GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelectedDetailCategory(cat)}
            className="relative min-h-[175px] xs:min-h-[185px] sm:min-h-[195px] rounded-2xl overflow-hidden group border border-zinc-200/80 hover:border-[var(--primary)] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 select-none cursor-pointer flex flex-col justify-end p-3 sm:p-4 text-left"
          >
            {/* Background Image */}
            <img
              src={cat.image}
              alt={t(cat.title)}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100 z-0 bg-zinc-900"
              loading="lazy"
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/25 group-hover:from-black/98 group-hover:via-black/75 transition-all duration-300 z-10" />



            {/* Title Overlay */}
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