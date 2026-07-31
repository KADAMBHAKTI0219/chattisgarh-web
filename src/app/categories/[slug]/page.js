"use client";

import { use, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import Heading from "@/components/common/Heading";
import Button, { ParticipateButton } from "@/components/common/Button";
import {
    FaLandmark,
    FaLaptopCode,
    FaHandsHelping,
    FaPalette,
    FaChevronLeft,
    FaChevronRight,
    FaArrowLeft,
    FaSearch
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

// Full list of Award Categories
const CATEGORIES = [
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

export default function CategorySlugPage({ params }) {
    // Unwrap params using React.use() for Next.js 16 compatibility
    const resolvedParams = use(params);
    const slug = resolvedParams?.slug?.toLowerCase() || "all";
    const router = useRouter();

    const { t } = useLanguage();
    const { openModal } = useParticipateModal();
    const [searchQuery, setSearchQuery] = useState("");
    const tabsRef = useRef(null);

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
    const filteredCategories = CATEGORIES.filter((cat) => {
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

            {/* 3. Interactive Filter Tabs Bar & Search Input (Matching exact screenshot design) */}
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

                    {/* Search Input Bar with Icon */}
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

            {/* 4. Category Cards Grid (4 columns on Desktop matching reference screenshot) */}
            <div className="w-full max-w-7xl xl:max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredCategories.map((cat) => {
                        const tierData = TIERS[cat.tier] || TIERS.culture;

                        return (
                            <div
                                key={cat.id}
                                onClick={openModal}
                                className="relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden group border border-zinc-200/90 hover:border-[var(--primary)] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 select-none cursor-pointer flex flex-col justify-end p-5 text-left"
                            >
                                {/* Background Image */}
                                <img
                                    src={cat.image}
                                    alt={t(cat.title)}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100 z-0 bg-zinc-900"
                                    loading="lazy"
                                />

                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent group-hover:from-black/98 group-hover:via-black/75 group-hover:to-black/30 transition-all duration-500 z-10" />

                                {/* Tier Badge at top-left */}
                                <span
                                    className="absolute top-4 left-4 z-20 text-[9px] font-inter font-bold uppercase px-3 py-1 rounded-full text-white backdrop-blur-md border border-white/20 shadow-md"
                                    style={{ backgroundColor: tierData.color }}
                                >
                                    {t(tierData.title)}
                                </span>

                                {/* Content Overlay */}
                                <div className="relative z-20 flex flex-col justify-end w-full">
                                    <h3 className="font-poppins font-bold text-base sm:text-lg md:text-xl uppercase !text-white tracking-tight leading-snug group-hover:!text-amber-200 transition-colors duration-300">
                                        {t(cat.title)}
                                    </h3>

                                    {/* Description - Expands smoothly on hover / mobile tap */}
                                    <div className="overflow-hidden">
                                        <p className="font-inter text-zinc-200 text-xs sm:text-sm leading-relaxed transform translate-y-4 opacity-0 max-h-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:max-h-36 group-hover:mt-2.5 transition-all duration-500 ease-out">
                                            {t(cat.description)}
                                        </p>
                                    </div>
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

        </div>
    );
}
