"use client";

import { use, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { categoryService } from "@/services/api";
import Heading from "@/components/common/Heading";
import CategoryDetailModal from "@/components/common/CategoryDetailModal";
import {
    FaLandmark,
    FaLaptopCode,
    FaHandsHelping,
    FaPalette,
    FaChevronLeft,
    FaChevronRight,
    FaArrowLeft,
    FaSearch,
    FaHashtag,
    FaRupeeSign
} from "react-icons/fa";

// Tier definitions matching system design
const TIERS = {
    all: {
        slug: "all",
        title: "All Categories",
        description: "Explore all official award categories across Culture, Tech, Social Impact, and Arts & Heritage.",
        color: "#C15B3D",
        icon: FaLandmark
    },
    culture: {
        slug: "culture",
        title: "Culture & Tourism",
        description: "Showcasing the beauty of Chhattisgarh's heritage, traditions, festivals, art, cuisine and breathtaking destinations.",
        color: "#C15B3D",
        icon: FaLandmark
    },
    tech: {
        slug: "tech",
        title: "Tech & Media",
        description: "Honouring digital creators, storytellers, influencers and innovators using technology to inform, entertain and inspire.",
        color: "#2E5C31",
        icon: FaLaptopCode
    },
    impact: {
        slug: "impact",
        title: "Social Impact & Welfare",
        description: "Recognising creators driving positive social change, awareness, education, environment and community development.",
        color: "#2E5C31",
        icon: FaHandsHelping
    },
    arts: {
        slug: "arts",
        title: "Arts & Heritage",
        description: "Celebrating artists, artisans and creators preserving Chhattisgarh's rich artistic legacy and indigenous crafts.",
        color: "#D39B2C",
        icon: FaPalette
    }
};

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

// Full fallback list of Award Categories
const STATIC_CATEGORIES = [
    {
        id: 101,
        tier: "culture",
        title: "Chhattisgarhiya Sanskriti Ambassador",
        image: "/assets/images/raipur_landmark.jpg",
        description: "Celebrating creators showcasing regional heritage, folk music, and local cultural traditions.",
        taskBrief: "Create an engaging video highlighting traditional art, dance, or folk festivals of the state.",
        hashtag: "#ChhattisgarhiyaSanskriti",
        cashPrizeMin: 50000,
        cashPrizeMax: 50000
    },
    {
        id: 102,
        tier: "tech",
        title: "Tech & Civic Innovation Pioneer",
        image: "/assets/images/emerging awards.jpg",
        description: "Honoring creators bringing awareness to AI, smart governance, and infrastructure development.",
        taskBrief: "Produce a video demonstrating how digital initiatives improve public services and citizen welfare.",
        hashtag: "#GovTechBuilder",
        cashPrizeMin: 25000,
        cashPrizeMax: 300000
    },
    {
        id: 103,
        tier: "arts",
        title: "Digital Craftsman & Micro-Creator",
        image: "/assets/images/category-1.jpg",
        description: "Spotlighting emerging nano creators, digital artists, and handicraft storytellers.",
        taskBrief: "Share a story celebrating local artisan skills, handlooms, or sustainable eco-crafts.",
        hashtag: "#MicroCraftCreator",
        cashPrizeMin: 10000,
        cashPrizeMax: 100000
    },
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
        id: 12,
        tier: "impact",
        title: "Swachh State Advocate",
        image: "/assets/images/about-1.jpg",
        description: "Campaigning for public cleanliness, local recycling initiatives, and waste management."
    },
    {
        id: 14,
        tier: "arts",
        title: "Dhokra Art Promoter",
        image: "/assets/images/category-1.jpg",
        description: "Showcasing the ancient non-ferrous metal casting craft and its tribal artisans."
    }
];

export default function CategorySlugPage({ params }) {
    const resolvedParams = use(params);
    const slug = resolvedParams?.slug?.toLowerCase() || "all";
    const router = useRouter();

    const { t } = useLanguage();
    const { openModal } = useParticipateModal();
    const [searchQuery, setSearchQuery] = useState("");
    const [apiCategories, setApiCategories] = useState([]);
    const [selectedDetailCategory, setSelectedDetailCategory] = useState(null);
    const tabsRef = useRef(null);

    // Fetch Categories from Backend API on mount
    useEffect(() => {
        async function loadCategories() {
            const res = await categoryService.getCategories({ isActive: true });
            if (res.success && res.categories && res.categories.length > 0) {
                setApiCategories(res.categories);
            }
        }
        loadCategories();
    }, []);

    // Merge API categories with static list
    const allCategoriesList = apiCategories.length > 0
        ? [
            ...apiCategories.map((cat, idx) => ({
                id: cat._id || `api-${idx}`,
                tier: mapTierSlug(cat.tier),
                title: cat.title,
                image: cat.image || "/assets/images/raipur_landmark.jpg",
                description: cat.shortDescription || cat.taskBrief || "",
                taskBrief: cat.taskBrief || "",
                hashtag: cat.hashtag || "",
                cashPrizeMin: cat.cashPrizeMin || 0,
                cashPrizeMax: cat.cashPrizeMax || 0,
                prizeTier: cat.prizeTier || "",
                isApi: true
            })),
            ...STATIC_CATEGORIES
        ]
        : STATIC_CATEGORIES;

    // Deduplicate by title
    const uniqueCategories = Array.from(
        new Map(allCategoriesList.map((item) => [item.title.toLowerCase(), item])).values()
    );

    // Fallback to "all" if slug is unrecognized
    const activeTierObj = TIERS[slug] || TIERS.all;

    const handleTabClick = (tierSlug) => {
        router.push(`/categories/${tierSlug}`);
    };

    const scrollTabs = (direction) => {
        if (tabsRef.current) {
            const scrollAmount = direction === "left" ? -220 : 220;
            tabsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    // Filter categories by slug tier & search text
    const filteredCategories = uniqueCategories.filter((cat) => {
        if (slug !== "all" && cat.tier !== slug) return false;
        if (!searchQuery) return true;
        const title = t(cat.title).toLowerCase();
        const query = searchQuery.toLowerCase();
        return title.includes(query);
    });

    return (
        <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-10 relative overflow-x-hidden animate-page-enter">

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
                    description={t(activeTierObj.description)}
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
                            {Object.keys(TIERS).map((key) => {
                                const tierInfo = TIERS[key];
                                const isActive = slug === tierInfo.slug;

                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleTabClick(tierInfo.slug)}
                                        className={`shrink-0 px-5 py-2.5 rounded-full font-inter font-bold text-xs sm:text-sm transition-all duration-300 border cursor-pointer select-none ${isActive
                                                ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md scale-[1.02]"
                                                : "bg-white text-zinc-700 border-zinc-200/90 hover:border-zinc-400 hover:bg-zinc-50"
                                            }`}
                                    >
                                        {t(tierInfo.title)}
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
            </div>            {/* 4. Category Cards Grid */}
            <div className="w-full max-w-7xl xl:max-w-[1400px] mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5 xl:gap-6">
                    {filteredCategories.map((cat) => {
                        const tierData = TIERS[cat.tier] || TIERS.culture;

                        return (
                            <div
                                key={cat.id}
                                onClick={() => setSelectedDetailCategory(cat)}
                                className="relative aspect-square xs:aspect-[4/3.4] sm:aspect-[4/3] min-h-[165px] xs:min-h-[175px] sm:min-h-[185px] rounded-2xl overflow-hidden group border border-zinc-200/80 hover:border-[var(--primary)] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 select-none cursor-pointer flex flex-col justify-end p-3 sm:p-4 text-left"
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
                                        style={{ backgroundColor: tierData.color }}
                                    >
                                        {t(tierData.title)}
                                    </span>
                                </div>

                                {/* Content Overlay */}
                                <div className="relative z-20 flex flex-col justify-end w-full">
                                    <h3 className="font-poppins font-bold text-[11px] xs:text-xs sm:text-xs md:text-sm uppercase !text-white tracking-tight leading-tight line-clamp-3 group-hover:!text-amber-200 transition-colors duration-300">
                                        {t(cat.title)}
                                    </h3>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredCategories.length === 0 && (
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
