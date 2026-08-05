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

// 25 Official Award Categories
const STATIC_CATEGORIES = [
  // Culture & Tourism (6)
  {
    id: 1,
    tier: "culture",
    tierLabel: "Culture & Tourism",
    title: "Chhattisgarhiya Sanskriti Ambassador",
    image: "/assets/images/raipur_landmark.jpg",
    description: "Celebrating creators showcasing regional heritage, folk music, and local traditions.",
    taskBrief: "Create a video highlighting traditional art, dance, or folk festivals of Chhattisgarh.",
    color: "#C15B3D",
    cashPrizeMin: 50000,
    cashPrizeMax: 50000
  },
  {
    id: 2,
    tier: "culture",
    tierLabel: "Culture & Tourism",
    title: "Tribal Heritage Creator",
    image: "/assets/images/chattisgarh_fall.jpg",
    description: "Showcasing indigenous Bastar arts, tribal life, and folk customs.",
    taskBrief: "Share stories celebrating tribal culture, festivals, and indigenous heritage.",
    color: "#C15B3D",
    cashPrizeMin: 50000,
    cashPrizeMax: 50000
  },
  {
    id: 3,
    tier: "culture",
    tierLabel: "Culture & Tourism",
    title: "Best Food & Culinary Creator",
    image: "/assets/images/category-3.jpg",
    description: "Discovering classic Chhattisgarhi recipes, local ingredients, and street food.",
    taskBrief: "Present authentic Chhattisgarhi dishes and local food culture.",
    color: "#C15B3D",
    cashPrizeMin: 25000,
    cashPrizeMax: 100000
  },
  {
    id: 4,
    tier: "culture",
    tierLabel: "Culture & Tourism",
    title: "Best Travel & Destination Creator",
    image: "/assets/images/category-4.jpg",
    description: "Guiding travelers to hidden waterfalls, forests, and cultural landmarks.",
    taskBrief: "Highlight unexplored travel spots and eco-tourism in Chhattisgarh.",
    color: "#C15B3D",
    cashPrizeMin: 25000,
    cashPrizeMax: 100000
  },
  {
    id: 5,
    tier: "culture",
    tierLabel: "Culture & Tourism",
    title: "Folk Music & Performing Arts",
    image: "/assets/images/category-5.jpg",
    description: "Panthi, Karma, Raut Nacha and traditional musical storytelling.",
    taskBrief: "Perform or document traditional Chhattisgarhi folk dance and music.",
    color: "#C15B3D",
    cashPrizeMin: 25000,
    cashPrizeMax: 50000
  },
  {
    id: 6,
    tier: "culture",
    tierLabel: "Culture & Tourism",
    title: "Heritage Photography & Vlog",
    image: "/assets/images/category-6.jpg",
    description: "Visual documentation of ancient temples, forts, and monuments.",
    taskBrief: "Capture stunning photography or cinematic vlogs of historical sites.",
    color: "#C15B3D",
    cashPrizeMin: 25000,
    cashPrizeMax: 50000
  },

  // Tech & Media (7)
  {
    id: 7,
    tier: "tech",
    tierLabel: "Tech & Media",
    title: "Tech & Civic Innovation Pioneer",
    image: "/assets/images/category-7.jpg",
    description: "Honoring creators bringing awareness to AI, smart governance, and innovation.",
    taskBrief: "Demonstrate how digital initiatives improve public services and civic life.",
    color: "#2E5C31",
    cashPrizeMin: 25000,
    cashPrizeMax: 300000
  },
  {
    id: 8,
    tier: "tech",
    tierLabel: "Tech & Media",
    title: "Best YouTube Creator of the Year",
    image: "/assets/images/category-8.jpg",
    description: "Celebrating high-quality storytelling, cinematography, and long-form video excellence.",
    taskBrief: "Submit your best YouTube long-form content highlighting innovation or story.",
    color: "#2E5C31",
    cashPrizeMin: 50000,
    cashPrizeMax: 200000
  },
  {
    id: 9,
    tier: "tech",
    tierLabel: "Tech & Media",
    title: "Best Instagram Reel Creator",
    image: "/assets/images/category-9.jpg",
    description: "Recognizing high-impact vertical reels, daily trends, and short-form clips.",
    taskBrief: "Submit creative Instagram reel content reaching wide digital audiences.",
    color: "#2E5C31",
    cashPrizeMin: 25000,
    cashPrizeMax: 100000
  },
  {
    id: 10,
    tier: "tech",
    tierLabel: "Tech & Media",
    title: "Digital Educator & Knowledge Creator",
    image: "/assets/images/category-10.jpg",
    description: "EdTech, competitive exam guidance, and skill development content.",
    taskBrief: "Share educational videos helping students and youth gain skills.",
    color: "#2E5C31",
    cashPrizeMin: 25000,
    cashPrizeMax: 100000
  },
  {
    id: 11,
    tier: "tech",
    tierLabel: "Tech & Media",
    title: "Gaming & Esports Innovator",
    image: "/assets/images/category-11.jpg",
    description: "Esports live streaming, game design, and digital gaming entertainment.",
    taskBrief: "Highlight gaming tournaments, streams, or game development in state.",
    color: "#2E5C31",
    cashPrizeMin: 25000,
    cashPrizeMax: 100000
  },
  {
    id: 12,
    tier: "tech",
    tierLabel: "Tech & Media",
    title: "Podcast & Voice Storyteller",
    image: "/assets/images/category-12.jpg",
    description: "Audio podcasts, voice-over commentary, and audio storytelling.",
    taskBrief: "Submit an audio podcast episode discussing state culture or technology.",
    color: "#2E5C31",
    cashPrizeMin: 25000,
    cashPrizeMax: 50000
  },
  {
    id: 13,
    tier: "tech",
    tierLabel: "Tech & Media",
    title: "Infotainment & News Journalist",
    image: "/assets/images/category-13.jpg",
    description: "Fact-checked civic news, regional reporting, and social analysis.",
    taskBrief: "Produce informative news or journalism pieces addressing key local issues.",
    color: "#2E5C31",
    cashPrizeMin: 25000,
    cashPrizeMax: 100000
  },

  // Social Impact & Welfare (6)
  {
    id: 14,
    tier: "impact",
    tierLabel: "Social Impact & Welfare",
    title: "Swachh State & Eco Advocate",
    image: "/assets/images/category-14.jpg",
    description: "Campaigning for public cleanliness, local recycling, and waste management.",
    taskBrief: "Document community environmental campaigns or cleanliness initiatives.",
    color: "#2E5C31",
    cashPrizeMin: 25000,
    cashPrizeMax: 100000
  },
  {
    id: 15,
    tier: "impact",
    tierLabel: "Social Impact & Welfare",
    title: "Women Empowerment Icon",
    image: "/assets/images/category-15.jpg",
    description: "Supporting women entrepreneurs, self-help groups, and social equity.",
    taskBrief: "Share stories of women leaders and community change-makers.",
    color: "#2E5C31",
    cashPrizeMin: 25000,
    cashPrizeMax: 100000
  },
  {
    id: 16,
    tier: "impact",
    tierLabel: "Social Impact & Welfare",
    title: "Youth Upliftment & Career Mentor",
    image: "/assets/images/event_presentation.jpg",
    description: "Guiding youth towards employment, sports, and leadership development.",
    taskBrief: "Create content mentoring youth for career and leadership growth.",
    color: "#2E5C31",
    cashPrizeMin: 25000,
    cashPrizeMax: 50000
  },
  {
    id: 17,
    tier: "impact",
    tierLabel: "Social Impact & Welfare",
    title: "Health, Wellness & Fitness Creator",
    image: "/assets/images/category-17.jpg",
    description: "Promoting physical fitness, mental wellness, and yoga awareness.",
    taskBrief: "Promote healthy lifestyle, mental wellness, or fitness routines.",
    color: "#2E5C31",
    cashPrizeMin: 25000,
    cashPrizeMax: 50000
  },
  {
    id: 18,
    tier: "impact",
    tierLabel: "Social Impact & Welfare",
    title: "Agriculture & Krishi Innovator",
    image: "/assets/images/category-18.jpg",
    description: "Organic farming techniques, smart agriculture, and krishi technology.",
    taskBrief: "Highlight innovative farming methods or agricultural success stories.",
    color: "#2E5C31",
    cashPrizeMin: 25000,
    cashPrizeMax: 100000
  },
  {
    id: 19,
    tier: "impact",
    tierLabel: "Social Impact & Welfare",
    title: "Animal Welfare & Nature Protector",
    image: "/assets/images/category-19.jpg",
    description: "Wildlife conservation, stray animal care, and forest protection.",
    taskBrief: "Share initiatives protecting wildlife or caring for stray animals.",
    color: "#2E5C31",
    cashPrizeMin: 25000,
    cashPrizeMax: 50000
  },

  // Arts & Heritage (6)
  {
    id: 20,
    tier: "arts",
    tierLabel: "Arts & Heritage",
    title: "Digital Craftsman & Micro-Creator",
    image: "/assets/images/category-20.jpg",
    description: "Spotlighting emerging nano creators, digital artists, and handicraft storytellers.",
    taskBrief: "Share a story celebrating local artisan skills, handlooms, or crafts.",
    color: "#D39B2C",
    cashPrizeMin: 10000,
    cashPrizeMax: 100000
  },
  {
    id: 21,
    tier: "arts",
    tierLabel: "Arts & Heritage",
    title: "Dhokra & Bell Metal Craft Promoter",
    image: "/assets/images/category-21.jpg",
    description: "Showcasing the ancient non-ferrous metal casting craft and tribal artisans.",
    taskBrief: "Promote traditional Dhokra art making and artisan craftsmanship.",
    color: "#D39B2C",
    cashPrizeMin: 25000,
    cashPrizeMax: 50000
  },
  {
    id: 22,
    tier: "arts",
    tierLabel: "Arts & Heritage",
    title: "Kosa Silk & Handloom Ambassador",
    image: "/assets/images/category-22.jpg",
    description: "Chhattisgarhi Kosa silk weavers, handlooms, and indigenous fashion.",
    taskBrief: "Highlight traditional Kosa silk weaving and artisan heritage.",
    color: "#D39B2C",
    cashPrizeMin: 25000,
    cashPrizeMax: 50000
  },
  {
    id: 23,
    tier: "arts",
    tierLabel: "Arts & Heritage",
    title: "Terracotta & Clay Art Champion",
    image: "/assets/images/category-23.jpg",
    description: "Traditional pottery, terracotta art, and indigenous clay mural work.",
    taskBrief: "Showcase clay pottery artisans and traditional terracotta art forms.",
    color: "#D39B2C",
    cashPrizeMin: 25000,
    cashPrizeMax: 50000
  },
  {
    id: 24,
    tier: "arts",
    tierLabel: "Arts & Heritage",
    title: "Tattoo & Godna Art Storyteller",
    image: "/assets/images/category-24.jpg",
    description: "Preserving traditional Godna tribal body art, motifs, and history.",
    taskBrief: "Document historical Godna art traditions and indigenous stories.",
    color: "#D39B2C",
    cashPrizeMin: 25000,
    cashPrizeMax: 50000
  },
  {
    id: 25,
    tier: "arts",
    tierLabel: "Arts & Heritage",
    title: "Indigenous Performing Artist",
    image: "/assets/images/category-25.jpg",
    description: "Promoting Pandavani, Raut Nacha, and traditional folk theatre.",
    taskBrief: "Perform or document traditional Chhattisgarhi stage art and theatre.",
    color: "#D39B2C",
    cashPrizeMin: 25000,
    cashPrizeMax: 50000
  }
];

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
      const res = await categoryService.getCategories({ isActive: true });
      if (res.success && res.categories && res.categories.length > 0) {
        setApiCategories(res.categories);
      }
    }
    loadApiCategories();
  }, []);

  // Merge API categories if present with static categories
  const allCategoriesList = apiCategories.length > 0
    ? [
      ...apiCategories.map((cat, idx) => ({
        id: cat._id || `api-${idx}`,
        tier: mapTierSlug(cat.tier),
        title: cat.title,
        image: cat.image || "/assets/images/raipur_landmark.jpg",
        description: cat.shortDescription || cat.taskBrief || "",
        taskBrief: cat.taskBrief || "",
        cashPrizeMin: cat.cashPrizeMin || 25000,
        cashPrizeMax: cat.cashPrizeMax || 100000,
        color: cat.tier?.includes("CULTURE") ? "#C15B3D" : cat.tier?.includes("NATION") ? "#2E5C31" : "#D39B2C"
      })),
      ...STATIC_CATEGORIES
    ]
    : STATIC_CATEGORIES;

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
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/25 group-hover:from-black/98 group-hover:via-black/75 transition-all duration-300 z-10" />

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