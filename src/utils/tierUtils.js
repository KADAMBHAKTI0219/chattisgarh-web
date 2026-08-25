// Map of standard 11 Tiers with custom metadata & colors
export const KNOWN_TIERS = {
  1: {
    tierNumber: 1,
    slug: "nation-building-governance",
    title: "Nation Building & Governance",
    color: "#C15B3D"
  },
  2: {
    tierNumber: 2,
    slug: "technology-innovation",
    title: "Technology & Innovation",
    color: "#2563EB"
  },
  3: {
    tierNumber: 3,
    slug: "education-career",
    title: "Education & Career",
    color: "#D97706"
  },
  4: {
    tierNumber: 4,
    slug: "health-social-impact",
    title: "Health & Social Impact",
    color: "#059669"
  },
  5: {
    tierNumber: 5,
    slug: "agriculture-rural-development",
    title: "Agriculture & Rural Development",
    color: "#15803D"
  },
  6: {
    tierNumber: 6,
    slug: "sustainability-environment",
    title: "Sustainability & Environment",
    color: "#16A34A"
  },
  7: {
    tierNumber: 7,
    slug: "culture-heritage-languages",
    title: "Culture, Heritage & Languages",
    color: "#B45309"
  },
  8: {
    tierNumber: 8,
    slug: "media-information",
    title: "Media & Information",
    color: "#4F46E5"
  },
  9: {
    tierNumber: 9,
    slug: "creative-entertainment",
    title: "Creative & Entertainment",
    color: "#7C3AED"
  },
  10: {
    tierNumber: 10,
    slug: "lifestyle-special-interest",
    title: "Lifestyle & Special Interest",
    color: "#DB2777"
  },
  11: {
    tierNumber: 11,
    slug: "special-recognition",
    title: "Special Recognition",
    color: "#DC2626"
  }
};

const PALETTE = ["#C15B3D", "#2563EB", "#D97706", "#059669", "#15803D", "#16A34A", "#B45309", "#4F46E5", "#7C3AED", "#DB2777", "#DC2626"];

// Helper: Normalize string to URL slug
export function slugify(str = "") {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Convert any tier representation to standard slug
export function getTierSlug(tierVal, tierNumber = null) {
  if (tierNumber && KNOWN_TIERS[tierNumber]) {
    return KNOWN_TIERS[tierNumber].slug;
  }
  if (!tierVal) return "all";

  const num = parseInt(tierVal, 10);
  if (!isNaN(num) && KNOWN_TIERS[num]) {
    return KNOWN_TIERS[num].slug;
  }

  const str = String(tierVal).trim();
  
  // Direct matching against known tier titles or slugs
  for (const key in KNOWN_TIERS) {
    const t = KNOWN_TIERS[key];
    if (
      t.slug === str.toLowerCase() ||
      slugify(t.title) === slugify(str) ||
      str.toLowerCase().includes(t.title.toLowerCase())
    ) {
      return t.slug;
    }
  }

  // Fallbacks for old legacy backend tier enums
  if (str === "A_CULTURE_IDENTITY" || str.includes("CULTURE") || str.includes("HERITAGE")) return "culture-heritage-languages";
  if (str === "B_NATION_STATE_BUILDING" || str.includes("NATION") || str.includes("GOVERNANCE")) return "nation-building-governance";
  if (str === "C_CRAFT_PLATFORM" || str.includes("CREATIVE") || str.includes("ARTS")) return "creative-entertainment";
  if (str.includes("TECH") || str.includes("INNOVATION")) return "technology-innovation";

  return slugify(str) || "general";
}

// Get tier display name
export function getTierTitle(tierVal, tierNumber = null) {
  if (tierNumber && KNOWN_TIERS[tierNumber]) {
    return KNOWN_TIERS[tierNumber].title;
  }
  if (!tierVal) return "General Tier";

  const num = parseInt(tierVal, 10);
  if (!isNaN(num) && KNOWN_TIERS[num]) {
    return KNOWN_TIERS[num].title;
  }

  const slug = getTierSlug(tierVal);
  for (const key in KNOWN_TIERS) {
    if (KNOWN_TIERS[key].slug === slug) return KNOWN_TIERS[key].title;
  }

  return String(tierVal);
}

// Get badge color for tier
export function getTierColor(tierVal, tierNumber = null) {
  if (tierNumber && KNOWN_TIERS[tierNumber]) {
    return KNOWN_TIERS[tierNumber].color;
  }

  const slug = getTierSlug(tierVal);
  for (const key in KNOWN_TIERS) {
    if (KNOWN_TIERS[key].slug === slug) return KNOWN_TIERS[key].color;
  }

  const hash = String(tierVal).split("").reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return PALETTE[hash % PALETTE.length];
}

// Extract dynamic list of Tiers from category array (from API or static dataset)
export function extractDynamicTiers(categoriesList = []) {
  const tierMap = new Map();

  categoriesList.forEach((cat) => {
    const rawTier = cat.tier || cat.tierName || "General Tier";
    const tierNum = cat.tierNumber || null;
    const slug = getTierSlug(rawTier, tierNum);
    const title = getTierTitle(rawTier, tierNum);
    const color = getTierColor(rawTier, tierNum);

    if (!tierMap.has(slug)) {
      tierMap.set(slug, {
        slug,
        title,
        color,
        tierNumber: tierNum || 99,
        count: 0
      });
    }
    tierMap.get(slug).count += 1;
  });

  // Convert to array and sort by tierNumber
  const dynamicTiers = Array.from(tierMap.values()).sort(
    (a, b) => a.tierNumber - b.tierNumber
  );

  return [
    {
      slug: "all",
      title: "All Categories",
      color: "#C15B3D",
      tierNumber: 0,
      count: categoriesList.length
    },
    ...dynamicTiers
  ];
}
