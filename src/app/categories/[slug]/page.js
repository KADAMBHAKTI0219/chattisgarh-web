"use client";

import { use, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { categoryService } from "@/services/api";
import Heading from "@/components/common/Heading";
import CategoryDetailModal from "@/components/common/CategoryDetailModal";
import { categoriesData as fallbackCategories } from "@/data/categoriesData";
import { extractDynamicTiers, getTierSlug, getTierColor, getTierTitle } from "@/utils/tierUtils";
import {
    FaChevronLeft,
    FaChevronRight,
    FaArrowLeft,
    FaSearch,
    FaSpinner
} from "react-icons/fa";

export default function CategorySlugPage({ params }) {
    const resolvedParams = use(params);
    const slug = resolvedParams?.slug?.toLowerCase() || "all";
    const router = useRouter();

    const { t } = useLanguage();
    const { openModal } = useParticipateModal();
    const [searchQuery, setSearchQuery] = useState("");
    const [apiCategories, setApiCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDetailCategory, setSelectedDetailCategory] = useState(null);
    const tabsRef = useRef(null);

    // Fetch Categories from Backend API on mount
    useEffect(() => {
        let isMounted = true;
        async function loadCategories() {
            try {
                setIsLoading(true);
                const res = await categoryService.getCategories({ isActive: true });
                if (isMounted) {
                    if (res?.success && Array.isArray(res.categories) && res.categories.length > 0) {
                        setApiCategories(res.categories);
                    } else if (Array.isArray(res?.data) && res.data.length > 0) {
                        setApiCategories(res.data);
                    } else {
                        setApiCategories(fallbackCategories);
                    }
                }
            } catch (err) {
                console.warn("Failed to load categories from API, using fallback:", err);
                if (isMounted) setApiCategories(fallbackCategories);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        loadCategories();
        return () => { isMounted = false; };
    }, []);

    const rawList = apiCategories.length > 0 ? apiCategories : fallbackCategories;

    // Format category objects
    const allCategoriesList = rawList.map((cat, idx) => {
        const fallbackMatch = fallbackCategories.find(
            (f) => f.slug === cat.slug || f.title.toLowerCase() === (cat.title || cat.name || "").toLowerCase()
        );

        const rawTier = cat.tier || cat.tierName || fallbackMatch?.tier || "General Tier";
        const tierNum = cat.tierNumber || fallbackMatch?.tierNumber || null;
        const tierSlug = getTierSlug(rawTier, tierNum);
        const tierTitle = getTierTitle(rawTier, tierNum);
        const badgeColor = getTierColor(rawTier, tierNum);

        return {
            id: cat._id || cat.slug || `api-${idx}`,
            categoryNumber: cat.categoryNumber || fallbackMatch?.categoryNumber || idx + 1,
            tierNumber: tierNum,
            tierSlug,
            tierTitle,
            badgeColor,
            title: cat.title || cat.name || fallbackMatch?.title || "Award Category",
            slug: cat.slug || fallbackMatch?.slug || "",
            image: cat.image || fallbackMatch?.image || "/assets/images/category-1.jpg",
            shortDescription: cat.shortDescription || cat.description || fallbackMatch?.shortDescription || "",
            fullDescription: cat.fullDescription || fallbackMatch?.fullDescription || "",
            taskBrief: cat.taskBrief || fallbackMatch?.taskBrief || "",
            hashtag: cat.hashtag || fallbackMatch?.hashtag || "",
            isFeatured: cat.isFeatured ?? fallbackMatch?.isFeatured ?? false,
            isActive: cat.isActive ?? fallbackMatch?.isActive ?? true
        };
    });

    // Deduplicate by title
    const uniqueCategories = Array.from(
        new Map(allCategoriesList.map((item) => [item.title.toLowerCase(), item])).values()
    );

    // Extract dynamic tiers (All Categories + 11 Tiers)
    const tierTabs = extractDynamicTiers(uniqueCategories);

    // Match currently active tier object
    const activeTierObj = tierTabs.find((t) => t.slug === slug) || tierTabs[0];

    const handleTabClick = (tierSlug) => {
        router.push(`/categories/${tierSlug}`);
    };

    const scrollTabs = (direction) => {
        if (tabsRef.current) {
            const scrollAmount = direction === "left" ? -220 : 220;
            tabsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    // Filter categories by active tier slug & search text
    const filteredCategories = uniqueCategories.filter((cat) => {
        if (slug !== "all" && cat.tierSlug !== slug) return false;
        if (!searchQuery) return true;
        const title = t(cat.title).toLowerCase();
        const desc = t(cat.shortDescription || "").toLowerCase();
        const query = searchQuery.toLowerCase();
        return title.includes(query) || desc.includes(query);
    });

    return (
        <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-8 md:gap-10 relative overflow-x-hidden animate-page-enter">

            {/* 1. Breadcrumb & Back Navigation */}
            <div className="w-full max-w-7xl xl:max-w-[1400px] mx-auto flex items-center justify-between gap-4">
                <Link
                    href="/#categories"
                    className="inline-flex items-center gap-2 text-zinc-600 hover:text-[var(--primary)] font-inter font-bold text-xs sm:text-sm transition-colors group"
                >
                    <FaArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                    <span>Back to Home</span>
                </Link>
            </div>

            {/* 2. Tier Page Header */}
            <div className="w-full max-w-7xl xl:max-w-[1400px] mx-auto text-center flex flex-col items-center">
                <Heading
                    badge={t(activeTierObj.title)}
                    title={t("CATEGORIES IN")}
                    highlightText={t(activeTierObj.title)}
                    description={t("Explore official state award categories across governance, tech, arts, culture, and social impact.")}
                />
            </div>

            {/* 3. Interactive Filter Tabs Bar & Search Input */}
            <div className="w-full max-w-7xl xl:max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-zinc-200/90 shadow-sm">

                    {/* Scrollable Filter Tabs */}
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
                            className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth px-1 py-1"
                        >
                            {tierTabs.map((tierInfo) => {
                                const isActive = slug === tierInfo.slug;
                                return (
                                    <button
                                        key={tierInfo.slug}
                                        onClick={() => handleTabClick(tierInfo.slug)}
                                        className={`shrink-0 px-4 sm:px-5 py-2.5 rounded-full font-inter font-bold text-xs sm:text-sm transition-all duration-300 border cursor-pointer select-none ${isActive
                                            ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md scale-[1.02]"
                                            : "bg-white text-zinc-700 border-zinc-200/90 hover:border-zinc-400 hover:bg-zinc-50"
                                            }`}
                                    >
                                        {t(tierInfo.title)} ({tierInfo.count})
                                    </button>
                                );
                            })}
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
                        <span className="pl-3.5 text-[var(--primary)]">
                            <FaSearch className="w-3.5 h-3.5" />
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search Categories..."
                            className="w-full py-2.5 px-3 text-zinc-850 font-inter font-semibold text-xs sm:text-sm focus:outline-none placeholder-zinc-400 bg-transparent rounded-full"
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
            </div>

            {/* 4. Category Cards Grid */}
            <div className="w-full max-w-7xl xl:max-w-[1400px] mx-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3 text-zinc-400">
                        <FaSpinner className="w-8 h-8 animate-spin text-[var(--primary)]" />
                        <p className="font-inter font-semibold text-sm">Loading Categories...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
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

                                {/* Tier Badge */}
                                <div className="absolute top-2 left-2 xs:top-2.5 xs:left-2.5 z-20 max-w-[90%]">
                                    <span
                                        className="inline-block text-[8px] xs:text-[9px] sm:text-[9.5px] font-inter font-bold uppercase px-2 py-0.5 rounded-full text-white backdrop-blur-md border border-white/20 shadow-xs tracking-wider truncate max-w-full"
                                        style={{ backgroundColor: cat.badgeColor || "#C15B3D" }}
                                    >
                                        {t(cat.tierTitle)}
                                    </span>
                                </div>

                                {/* Content Overlay */}
                                <div className="relative z-20 flex flex-col justify-end w-full">
                                    <h3 className="font-poppins font-bold text-[11px] xs:text-xs sm:text-xs md:text-sm uppercase !text-white tracking-tight leading-tight line-clamp-3 group-hover:!text-amber-200 transition-colors duration-300">
                                        {t(cat.title)}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && filteredCategories.length === 0 && (
                    <div className="text-zinc-500 font-inter font-bold text-base py-20 bg-white/60 border border-zinc-200 rounded-3xl text-center">
                        No categories match your query.
                    </div>
                )}
            </div>

            {/* Category Detail Popup Modal */}
            <CategoryDetailModal
                category={selectedDetailCategory}
                isOpen={!!selectedDetailCategory}
                onClose={() => setSelectedDetailCategory(null)}
                onNominate={(catTitle) => {
                    openModal(catTitle);
                }}
            />

        </div>
    );
}
