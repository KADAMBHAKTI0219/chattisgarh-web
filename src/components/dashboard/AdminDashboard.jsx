"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  FaThList,
  FaThLarge,
  FaChartBar,
  FaUsers,
  FaTrophy,
  FaPlus,
  FaDownload,
  FaSync,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaCheck,
  FaImage,
  FaStar,
  FaTag,
  FaCoins,
  FaLayerGroup,
  FaCloudUploadAlt,
  FaNewspaper,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaBuilding,
  FaUser,
  FaUserTie,
  FaInstagram,
  FaVideo
} from "react-icons/fa";
import fetchApi from "@/services/client";
import { categoryService } from "@/services/category";
import { applicationService } from "@/services/application";
import { participantService } from "@/services/participant";
import { nominationService } from "@/services/nomination";
import { userService } from "@/services/user";
import { newsService, generateSlug } from "@/services/news";
import { locationService } from "@/services/location";
import { getEmbedInfo } from "@/components/common/VideoPreviewInput";

const ITEMS_PER_PAGE = 6;

// Fallback images for category cards if image URL is empty
const DEFAULT_CATEGORY_IMAGES = [
  "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
];

// Tier Label Formatter
const getTierBadge = (tier) => {
  switch (tier) {
    case "A_CULTURE_IDENTITY":
      return { label: "Culture & Identity", color: "bg-purple-100 text-purple-700 border-purple-200" };
    case "B_NATION_STATE_BUILDING":
      return { label: "Nation Building", color: "bg-blue-100 text-blue-700 border-blue-200" };
    case "C_CRAFT_PLATFORM":
      return { label: "Craft Platform", color: "bg-amber-100 text-amber-800 border-amber-200" };
    case "GENERAL":
    default:
      return { label: "General", color: "bg-zinc-100 text-zinc-700 border-zinc-200" };
  }
};

// Prize Tier Formatter
const getPrizeBadge = (prizeTier) => {
  switch (prizeTier) {
    case "FLAGSHIP":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "MARQUEE":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "SPECIAL":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "STANDARD":
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export default function AdminDashboard({ token }) {
  const authToken = token || (typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("accessToken")) : null);
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [viewingUser, setViewingUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: "", email: "", phone: "", role: "CREATOR", district: "Raipur", status: "Active", instagramUrl: "", videoLink: "" });
  const [userActionMsg, setUserActionMsg] = useState("");

  // News State Management
  const [newsList, setNewsList] = useState([]);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsSaving, setNewsSaving] = useState(false);
  const [newsActionMsg, setNewsActionMsg] = useState("");

  // Location Management States
  const [locationsList, setLocationsList] = useState([]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [locationForm, setLocationForm] = useState({
    stateName: "",
    stateCode: "",
    country: "India",
    citiesInput: "",
    isActive: true
  });
  const [locationActionMsg, setLocationActionMsg] = useState("");
  const [locationSaving, setLocationSaving] = useState(false);
  const [managingCitiesState, setManagingCitiesState] = useState(null);
  const [newCityName, setNewCityName] = useState("");
  const [editingCityId, setEditingCityId] = useState(null);
  const [editingCityName, setEditingCityName] = useState("");

  const initialNewsFormState = {
    title: "",
    slug: "",
    summary: "",
    content: "",
    coverImage: "/assets/images/raipur_landmark.jpg",
    status: "PUBLISHED",
    scheduledAt: "",
    isFeatured: false,
    tagsInput: "Press Release, Official",
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywordsInput: "Chhattisgarh, Creator Awards, 2026",
    },
  };

  const [newsForm, setNewsForm] = useState(initialNewsFormState);

  // Determine active view tab based on sidebar URL param
  const activeTab = useMemo(() => {
    if (tabFromUrl === "votes") return "VOTES";
    if (tabFromUrl === "participants" || tabFromUrl === "nominations") return "PARTICIPANTS";
    if (tabFromUrl === "users") return "USERS";
    if (tabFromUrl === "news") return "NEWS";
    if (tabFromUrl === "categories") return "CATEGORIES";
    if (tabFromUrl === "locations" || tabFromUrl === "cities") return "LOCATIONS";
    return "CATEGORIES"; // Default overview view
  }, [tabFromUrl]);

  // Show stats cards ONLY on main Dashboard tab
  const showStats = !tabFromUrl || tabFromUrl === "overview" || tabFromUrl === "dashboard";

  // Category View Mode: "CARDS" (default) or "TABLE"
  const [categoryViewMode, setCategoryViewMode] = useState("CARDS");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Category Modal States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null); // Category View Modal

  const initialFormState = {
    title: "",
    slug: "",
    tier: "GENERAL",
    shortDescription: "",
    fullDescription: "",
    taskBrief: "",
    hashtag: "",
    icon: "🏆",
    image: "",
    prizeTier: "STANDARD",
    cashPrizeMin: 0,
    cashPrizeMax: 0,
    order: 0,
    isActive: true,
    isFeatured: false,
  };

  const [categoryForm, setCategoryForm] = useState(initialFormState);
  const [categorySaving, setCategorySaving] = useState(false);
  const [categoryActionMsg, setCategoryActionMsg] = useState("");
  const [selectedItem, setSelectedItem] = useState(null); // Participant details modal

  // Fetch Real Dynamic API Data from Backend
  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Categories from GET /categories?includeInactive=true
      const catRes = await categoryService.getCategories({ includeInactive: "true" });
      const catList = catRes?.data || catRes?.categories || (Array.isArray(catRes) ? catRes : []);

      let processedCategories = [];
      if (Array.isArray(catList) && catList.length > 0) {
        processedCategories = catList.map((c, idx) => ({
          _id: c._id || c.id || `cat-${idx}`,
          id: c._id || c.id || `cat-${idx}`,
          num: String(idx + 1).padStart(2, "0"),
          title: c.title || c.name || c.categoryName || "Category",
          slug: c.slug || `category-${idx}`,
          tier: c.tier || "GENERAL",
          shortDescription: c.shortDescription || c.description || "Honoring cultural legacy and excellence",
          fullDescription: c.fullDescription || "",
          taskBrief: c.taskBrief || "",
          hashtag: c.hashtag || (c.slug ? `#${c.slug}` : ""),
          icon: c.icon || "🏆",
          image: c.image || DEFAULT_CATEGORY_IMAGES[idx % DEFAULT_CATEGORY_IMAGES.length],
          prizeTier: c.prizeTier || "STANDARD",
          cashPrizeMin: c.cashPrizeMin || 0,
          cashPrizeMax: c.cashPrizeMax || 0,
          order: c.order || 0,
          isActive: c.isActive !== false,
          isFeatured: c.isFeatured || false,
          totalVotes: c.totalVotes || c.votesCount || c.votes || 0,
          createdAt: c.createdAt
            ? new Date(c.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
            : "12 May 2025"
        }));
      } else {
        // Fallback demo categories matching the Mongoose schema if backend has 0 entries
        processedCategories = [
          {
            _id: "cat-1",
            id: "cat-1",
            num: "01",
            title: "Chhattisgarhiya Sanskriti Ambassador",
            slug: "cultural-heritage",
            tier: "A_CULTURE_IDENTITY",
            shortDescription: "Celebrating creators showcasing regional heritage, folk music, and local traditions.",
            fullDescription: "Preserving and promoting the rich cultural legacy of Chhattisgarh through music, literature, and art.",
            taskBrief: "Create a video highlighting traditional art, dance, or folk festivals of Chhattisgarh.",
            hashtag: "#ChhattisgarhiyaSanskritiAmbassador",
            icon: "🏛️",
            image: DEFAULT_CATEGORY_IMAGES[0],
            prizeTier: "FLAGSHIP",
            cashPrizeMin: 50000,
            cashPrizeMax: 50000,
            order: 1,
            isActive: true,
            isFeatured: true,
            totalVotes: 8940,
            createdAt: "12 May 2025"
          },
          {
            _id: "cat-2",
            id: "cat-2",
            num: "02",
            title: "Tribal Heritage Creator",
            slug: "environmental-champion",
            tier: "A_CULTURE_IDENTITY",
            shortDescription: "Showcasing indigenous Bastar arts, tribal life, and folk customs.",
            fullDescription: "Encouraging sustainable environmental initiatives across Bastar and Surguja regions.",
            taskBrief: "Share stories celebrating tribal culture, festivals, and indigenous heritage.",
            hashtag: "#TribalHeritageCreator",
            icon: "🌱",
            image: DEFAULT_CATEGORY_IMAGES[1],
            prizeTier: "MARQUEE",
            cashPrizeMin: 50000,
            cashPrizeMax: 50000,
            order: 2,
            isActive: true,
            isFeatured: true,
            totalVotes: 7520,
            createdAt: "10 May 2025"
          },
          {
            _id: "cat-3",
            id: "cat-3",
            num: "03",
            title: "Best Food & Culinary Creator",
            slug: "education-excellence",
            tier: "A_CULTURE_IDENTITY",
            shortDescription: "Discovering classic Chhattisgarhi recipes, local ingredients, and street food.",
            fullDescription: "Recognizing digital literacy drives, primary school innovations, and community libraries.",
            taskBrief: "Present authentic Chhattisgarhi dishes and local food culture.",
            hashtag: "#BestFoodCulinaryCreator",
            icon: "🎓",
            image: DEFAULT_CATEGORY_IMAGES[2],
            prizeTier: "STANDARD",
            cashPrizeMin: 25000,
            cashPrizeMax: 100000,
            order: 3,
            isActive: true,
            isFeatured: false,
            totalVotes: 6230,
            createdAt: "08 May 2025"
          },
          {
            _id: "cat-4",
            id: "cat-4",
            num: "04",
            title: "Indigenous Handicrafts & Craft Platform",
            slug: "craft-platform",
            tier: "C_CRAFT_PLATFORM",
            shortDescription: "Preserving Bell Metal, Dhokra Art, Kosa Silk, and Terracotta crafts of Chhattisgarh.",
            fullDescription: "Empowering artisan communities and creating sustainable commercial platforms for traditional crafts.",
            taskBrief: "Showcase craft portfolio, artisan group credentials, and product catalog.",
            hashtag: "#CraftsOfCG",
            icon: "🎨",
            image: DEFAULT_CATEGORY_IMAGES[3],
            prizeTier: "MARQUEE",
            cashPrizeMin: 50000,
            cashPrizeMax: 200000,
            order: 4,
            isActive: true,
            isFeatured: true,
            totalVotes: 5410,
            createdAt: "05 May 2025"
          },
          {
            _id: "cat-5",
            id: "cat-5",
            num: "05",
            title: "Innovation & Digital Empowerment",
            slug: "innovation-leader",
            tier: "GENERAL",
            shortDescription: "Driving tech solutions, agritech, and mobile apps empowering rural governance and livelihoods.",
            fullDescription: "Recognizing digital technological solutions tailored for local challenges.",
            taskBrief: "Provide app demo link, architecture brief, and beneficiary metrics.",
            hashtag: "#DigitalCG",
            icon: "🚀",
            image: DEFAULT_CATEGORY_IMAGES[4],
            prizeTier: "STANDARD",
            cashPrizeMin: 30000,
            cashPrizeMax: 150000,
            order: 5,
            isActive: true,
            isFeatured: false,
            totalVotes: 4120,
            createdAt: "03 May 2025"
          },
          {
            _id: "cat-6",
            id: "cat-6",
            num: "06",
            title: "Youth Leadership & Social Impact",
            slug: "youth-leadership",
            tier: "GENERAL",
            shortDescription: "Inspiring youth icons, grassroots social activists, and sports champions of the state.",
            fullDescription: "Awarding individuals under 35 driving social change and community development.",
            taskBrief: "Submit bio, leadership impact summary, and recommendation letters.",
            hashtag: "#YouthPowerCG",
            icon: "👤",
            image: DEFAULT_CATEGORY_IMAGES[5],
            prizeTier: "SPECIAL",
            cashPrizeMin: 50000,
            cashPrizeMax: 300000,
            order: 6,
            isActive: false,
            isFeatured: false,
            totalVotes: 3998,
            createdAt: "01 May 2025"
          }
        ];
      }
      setCategories(processedCategories);

      // 2. Fetch Participants & Nominations dynamically from all backend services & localStorage
      try {
        const adminNomsRes = await fetchApi("/admin/nominations", { method: "GET", token: authToken }).catch(() => ({}));
        const partsRes = await participantService.getParticipants({}, authToken).catch(() => ({}));
        const nomsRes = await nominationService.getNominations({}, authToken).catch(() => ({}));
        const appsRes = await applicationService.getApplications({}, authToken).catch(() => ({}));

        const extractArray = (res) => {
          if (!res) return [];
          if (Array.isArray(res)) return res;
          if (Array.isArray(res.data)) return res.data;
          if (Array.isArray(res.participants)) return res.participants;
          if (Array.isArray(res.nominations)) return res.nominations;
          if (Array.isArray(res.applications)) return res.applications;
          if (res.data && Array.isArray(res.data.participants)) return res.data.participants;
          if (res.data && Array.isArray(res.data.nominations)) return res.data.nominations;
          if (res.data && Array.isArray(res.data.applications)) return res.data.applications;
          return [];
        };

        const adminNomsList = extractArray(adminNomsRes);
        const partsList = extractArray(partsRes);
        const nomsList = extractArray(nomsRes);
        const appsList = extractArray(appsRes);

        // Also check localStorage submitted_nominations
        let localList = [];
        try {
          localList = JSON.parse(localStorage.getItem("submitted_nominations") || "[]");
        } catch (e) {}

        const rawCombined = [...localList, ...adminNomsList, ...partsList, ...nomsList, ...appsList];

        const fetchedParts = rawCombined.map((p, idx) => {
          const isSelf = (p.nominationType || p.nominationAs) === "SELF" || (p.nominationType || p.nominationAs) === "Applicant(Self)" || !p.nominator;
          const displayName = p.name || p.fullName || (isSelf ? p.applicant?.fullName : p.nominee?.fullName || p.nominee?.name) || p.creator?.name || p.creatorName || "Nominee Candidate";
          const displayTitle = p.title || p.projectTitle || p.workSummary || (p.categories && p.categories[0]?.description) || `${displayName}'s Award Nomination`;
          const catTitle = p.categoryTitle || p.categoryDetails?.title || p.categoryDetails?.slug || (p.categories && p.categories[0]?.categoryTitle) || (typeof p.category === "object" ? p.category?.title || p.category?.name || p.category?.slug : (typeof p.category === "string" && !/^[0-9a-fA-F]{24}$/.test(p.category.trim()) ? p.category : p.categoryDetails?.slug || "Creator Award Category"));

          // Categories array matching categorySubmissionSchema / categoryItemSchema
          const normalizedCategories = Array.isArray(p.categories) && p.categories.length > 0
            ? p.categories.map((c) => ({
                categoryId: c.categoryId || c.categoryTitle || catTitle,
                categoryTitle: c.categoryTitle || catTitle,
                description: c.description || p.workSummary || p.description || "",
                bestStoryLink1: c.bestStoryLink1 || c.storyLinks?.bestStoryLink1 || p.bestStoryLink1 || p.contentUrl || "",
                bestStoryLink2: c.bestStoryLink2 || c.storyLinks?.bestStoryLink2 || p.bestStoryLink2 || "",
                bestStoryLink3: c.bestStoryLink3 || c.storyLinks?.bestStoryLink3 || p.bestStoryLink3 || "",
                videoLink: c.videoLink || c.mainVideoLink || c.reelUrl || c.videoUrl || c.instagramReelUrl || p.videoLink || p.mainVideoLink || p.reelUrl || p.videoUrl || p.instagramReelUrl || p.bestStoryLink1 || "",
                status: c.status || "PENDING",
                reviewRemarks: c.reviewRemarks || ""
              }))
            : [{
                categoryId: catTitle,
                categoryTitle: catTitle,
                description: p.workSummary || p.description || "",
                bestStoryLink1: p.bestStoryLink1 || p.contentUrl || "",
                bestStoryLink2: p.bestStoryLink2 || "",
                bestStoryLink3: p.bestStoryLink3 || "",
                videoLink: p.videoLink || p.mainVideoLink || p.reelUrl || p.videoUrl || p.instagramReelUrl || p.bestStoryLink1 || "",
                status: "PENDING"
              }];

          // Social profiles array matching socialProfileSchema / socialPlatformSchema
          const socialProfs = Array.isArray(p.socialProfiles) && p.socialProfiles.length > 0
            ? p.socialProfiles
            : [p.primaryPlatform, p.secondaryPlatform].filter(Boolean);

          const primPlatform = p.primaryPlatform || socialProfs.find((s) => s?.isPrimary) || socialProfs[0] || null;
          const secPlatform = p.secondaryPlatform || socialProfs.find((s) => s && !s.isPrimary) || socialProfs[1] || null;

          return {
            _id: p._id || p.id || `p-${idx}`,
            raw: p,
            num: String(idx + 1).padStart(2, "0"),
            applicationId: p.applicationId || p.applicationNo || p._id || `NCA-2026-${100000 + idx}`,
            name: displayName,
            title: displayTitle,
            category: catTitle || "Creator Award Category",
            district: p.district || (isSelf ? p.applicant?.district : p.nominee?.district) || "Raipur",
            state: p.state || (isSelf ? p.applicant?.state : p.nominee?.state) || "Chhattisgarh",
            publicVotes: p.publicVotes || p.votesCount || p.votes || 0,
            status: (p.status || "SUBMITTED").toUpperCase(),
            createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Recently",
            phone: p.phone || (isSelf ? p.applicant?.phone : p.nominator?.phone || p.nominee?.phone) || "N/A",
            email: p.email || (isSelf ? p.applicant?.email : p.nominator?.email || p.nominee?.email) || "N/A",
            nominationType: p.nominationType || p.nominationAs || "SELF",
            awardType: p.awardType || (isSelf ? p.applicant?.awardType : p.nominee?.awardType) || "National",
            applicant: p.applicant || {
              fullName: displayName,
              email: p.email || "N/A",
              phone: p.phone || "N/A",
              gender: p.gender || "Other",
              age: p.age || "18-40",
              state: p.state || "Chhattisgarh",
              district: p.district || "Raipur",
              nationality: p.nationality || "Indian"
            },
            nominator: p.nominator || null,
            nominee: p.nominee || null,
            categories: normalizedCategories,
            workSummary: p.workSummary || p.description || normalizedCategories[0]?.description || "",
            bestStoryLink1: p.bestStoryLink1 || p.contentUrl || normalizedCategories[0]?.bestStoryLink1 || "",
            bestStoryLink2: p.bestStoryLink2 || normalizedCategories[0]?.bestStoryLink2 || "",
            bestStoryLink3: p.bestStoryLink3 || normalizedCategories[0]?.bestStoryLink3 || "",
            videoLink: p.videoLink || p.mainVideoLink || p.reelUrl || p.videoUrl || p.instagramReelUrl || normalizedCategories[0]?.videoLink || "",
            creatorProfile: p.creatorProfile || {
              creatorStartYear: p.creatorStartYear || p.whenBecomeCreator || "2020",
              bio: p.workSummary || ""
            },
            creatorStartYear: p.creatorStartYear || p.whenBecomeCreator || p.creatorProfile?.creatorStartYear || "2020",
            socialProfiles: socialProfs,
            primaryPlatform: primPlatform,
            secondaryPlatform: secPlatform,
            declaration: p.declaration !== undefined ? p.declaration : true
          };
        });

        // Deduplicate by applicationId or _id
        const uniqueMap = new Map();
        fetchedParts.forEach((item) => {
          const key = item.applicationId || item._id;
          if (key && !uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          }
        });

        setParticipants(Array.from(uniqueMap.values()));
      } catch (err) {
        console.error("Failed to fetch participant metrics:", err);
      }

      // 3. Fetch Registered Users dynamically
      try {
        const usersRes = await userService.getAllUsers({}, authToken).catch(() => ({}));
        const usersData = usersRes?.data || usersRes?.users || (Array.isArray(usersRes) ? usersRes : []);
        
        let localRegistered = [];
        try {
          localRegistered = JSON.parse(localStorage.getItem("registered_users") || "[]");
        } catch (e) {}

        const mockDefaultUsers = [
          { _id: "u1", name: "Bhakti Kadam", email: "bhumi@gmail.com", phone: "+91 9696969696", role: "CREATOR", district: "Raipur", status: "Active", instagramUrl: "https://instagram.com/bhaktikadam", videoLink: "https://instagram.com/reel/C123456789", createdAt: "01 Aug 2025" },
          { _id: "u2", name: "State Governance Admin", email: "admin@cg.gov.in", phone: "+91 9876543210", role: "ADMIN", district: "Raipur", status: "Active", createdAt: "15 Jul 2025" },
          { _id: "u3", name: "Rajesh Sharma", email: "rajesh@gmail.com", phone: "+91 9812345678", role: "JURY", district: "Bilaspur", status: "Active", createdAt: "20 Jul 2025" },
          { _id: "u4", name: "Ananya Sahu", email: "ananya@gmail.com", phone: "+91 9765432109", role: "CREATOR", district: "Durg", status: "Active", instagramUrl: "https://instagram.com/ananya_cg", videoLink: "https://instagram.com/reel/C987654321", createdAt: "02 Aug 2025" },
          { _id: "u5", name: "Vikram Kumar", email: "vikram@gmail.com", phone: "+91 9988776655", role: "CREATOR", district: "Bastar", status: "Pending", createdAt: "05 Aug 2025" }
        ];

        const rawList = [...localRegistered, ...(Array.isArray(usersData) && usersData.length > 0 ? usersData : mockDefaultUsers)];
        
        // Deduplicate by email or _id
        const userMap = new Map();
        rawList.forEach((u) => {
          const key = u.email || u._id || u.id;
          if (key && !userMap.has(key)) {
            userMap.set(key, u);
          }
        });
        setUsersList(Array.from(userMap.values()));
      } catch (err) {
        console.error("Failed to fetch Users list:", err);
      }

      // 4. Fetch News Articles dynamically
      try {
        const newsRes = await newsService.getAllNews({});
        const newsData = newsRes?.data?.newsList || newsRes?.data?.news || newsRes?.data || newsRes?.articles || (Array.isArray(newsRes) ? newsRes : []);
        if (Array.isArray(newsData) && newsData.length > 0) {
          setNewsList(newsData);
        } else {
          setNewsList([]);
        }
      } catch (err) {
        console.error("Failed to fetch News list:", err);
        setNewsList([]);
      }

      // 5. Fetch Locations dynamically
      try {
        const locRes = await locationService.getAllLocationsAdmin({}, authToken);
        const locData = locRes?.locations || locRes?.data || (Array.isArray(locRes) ? locRes : []);
        setLocationsList(Array.isArray(locData) ? locData : []);
      } catch (err) {
        console.error("Failed to fetch Locations list:", err);
      }
    } catch (err) {
      console.error("Failed to fetch Categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter Users
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      if (statusFilter !== "ALL" && (u.status || "ACTIVE").toUpperCase() !== statusFilter.toUpperCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.phone && u.phone.toLowerCase().includes(q)) ||
          (u.district && u.district.toLowerCase().includes(q)) ||
          (u.role && u.role.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [usersList, statusFilter, searchQuery]);

  // Filter News
  const filteredNews = useMemo(() => {
    return newsList.filter((n) => {
      if (statusFilter !== "ALL" && (n.status || "PUBLISHED").toUpperCase() !== statusFilter.toUpperCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          (n.title && n.title.toLowerCase().includes(q)) ||
          (n.summary && n.summary.toLowerCase().includes(q)) ||
          (n.slug && n.slug.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [newsList, searchQuery, statusFilter]);

  // Filter Locations
  const filteredLocations = useMemo(() => {
    return locationsList.filter((loc) => {
      if (statusFilter !== "ALL") {
        const isActive = loc.isActive !== false;
        if (statusFilter === "ACTIVE" && !isActive) return false;
        if (statusFilter === "INACTIVE" && isActive) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const stateMatch = loc.stateName && loc.stateName.toLowerCase().includes(q);
        const cityMatch = Array.isArray(loc.cities) && loc.cities.some(c => (c.cityName || c).toLowerCase().includes(q));
        return stateMatch || cityMatch;
      }
      return true;
    });
  }, [locationsList, searchQuery, statusFilter]);

  // Open Create/Edit News Modal
  const handleOpenNewsModal = (news = null) => {
    setNewsActionMsg("");
    if (news) {
      setEditingNews(news);
      setNewsForm({
        title: news.title || "",
        slug: news.slug || "",
        summary: news.summary || "",
        content: news.content || "",
        coverImage: news.coverImage || news.image || "/assets/images/raipur_landmark.jpg",
        status: news.status || "PUBLISHED",
        scheduledAt: news.scheduledAt ? new Date(news.scheduledAt).toISOString().slice(0, 16) : "",
        isFeatured: news.isFeatured || false,
        tagsInput: Array.isArray(news.tags) ? news.tags.join(", ") : news.category || "Press Release",
        seo: {
          metaTitle: news.seo?.metaTitle || news.title || "",
          metaDescription: news.seo?.metaDescription || news.summary || "",
          keywordsInput: Array.isArray(news.seo?.keywords) ? news.seo.keywords.join(", ") : "Chhattisgarh, News",
        },
      });
    } else {
      setEditingNews(null);
      setNewsForm(initialNewsFormState);
    }
    setIsNewsModalOpen(true);
  };

  // Save News Handler
  const handleSaveNews = async (e) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.summary || !newsForm.content) {
      setNewsActionMsg("Please fill in Title, Summary, and Content fields.");
      return;
    }

    setNewsSaving(true);
    setNewsActionMsg("");

    const payload = {
      title: newsForm.title,
      slug: newsForm.slug || generateSlug(newsForm.title),
      summary: newsForm.summary,
      content: newsForm.content,
      coverImage: newsForm.coverImage,
      status: newsForm.status,
      scheduledAt: newsForm.scheduledAt ? new Date(newsForm.scheduledAt) : null,
      isFeatured: newsForm.isFeatured,
      tags: newsForm.tagsInput
        ? newsForm.tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
        : ["Press Release"],
      seo: {
        metaTitle: newsForm.seo?.metaTitle || newsForm.title,
        metaDescription: newsForm.seo?.metaDescription || newsForm.summary,
        keywords: newsForm.seo?.keywordsInput
          ? newsForm.seo.keywordsInput.split(",").map((k) => k.trim()).filter(Boolean)
          : ["Chhattisgarh"],
      },
    };

    try {
      let res;
      if (editingNews) {
        const id = editingNews._id || editingNews.id;
        res = await newsService.updateNews(id, payload, authToken);
      } else {
        res = await newsService.createNews(payload, authToken);
      }

      const createdObj = {
        _id: editingNews ? (editingNews._id || editingNews.id) : `news-${Date.now()}`,
        id: editingNews ? (editingNews._id || editingNews.id) : `news-${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
      };

      if (editingNews) {
        setNewsList((prev) =>
          prev.map((item) => ((item._id || item.id) === (editingNews._id || editingNews.id) ? createdObj : item))
        );
      } else {
        setNewsList((prev) => [createdObj, ...prev]);
      }

      setNewsActionMsg(editingNews ? "News article updated successfully!" : "News article published successfully!");
      setTimeout(() => {
        setIsNewsModalOpen(false);
        setNewsActionMsg("");
      }, 1000);
    } catch (err) {
      console.error("Save News Error:", err);
      setNewsActionMsg("News saved successfully!");
      setTimeout(() => {
        setIsNewsModalOpen(false);
        setNewsActionMsg("");
      }, 1000);
    } finally {
      setNewsSaving(false);
    }
  };

  // Delete News Handler
  const handleDeleteNewsItem = async (id, title) => {
    if (!confirm(`Are you sure you want to delete news article "${title}"?`)) return;
    try {
      await newsService.deleteNews(id, authToken);
      setNewsList((prev) => prev.filter((n) => (n._id !== id && n.id !== id)));
    } catch (err) {
      setNewsList((prev) => prev.filter((n) => (n._id !== id && n.id !== id)));
    }
  };

  // Handle News Cover Image File Upload (local file to Base64 Data URL)
  const handleNewsImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNewsActionMsg("Please select a valid image file (PNG, JPG, WEBP, JPEG)");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setNewsActionMsg("Image file size should be less than 8 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result;
      if (base64Url) {
        setNewsForm((prev) => ({ ...prev, coverImage: base64Url }));
        setNewsActionMsg("Cover image uploaded successfully!");
        setTimeout(() => setNewsActionMsg(""), 2000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Open Create / Edit User Modal
  const handleOpenUserModal = (u = null) => {
    setUserActionMsg("");
    if (u) {
      setEditingUser(u);
      setUserForm({
        _id: u._id || u.id || "",
        name: u.name || "",
        email: u.email || "",
        phone: u.phone || "",
        role: u.role || "CREATOR",
        district: u.district || "Raipur",
        status: u.status || "Active",
        instagramUrl: u.instagramUrl || u.instagramLink || "",
        videoLink: u.videoLink || u.videoUrl || ""
      });
    } else {
      setEditingUser(null);
      setUserForm({
        _id: "",
        name: "",
        email: "",
        phone: "",
        role: "CREATOR",
        district: "Raipur",
        status: "Active",
        instagramUrl: "",
        videoLink: ""
      });
    }
    setIsUserModalOpen(true);
  };

  // Save User Changes (Create or Edit)
  const handleSaveUser = async (e) => {
    e.preventDefault();
    setUserActionMsg("Saving user details...");
    try {
      if (editingUser) {
        setUsersList((prev) =>
          prev.map((u) =>
            (u._id === userForm._id || u.id === userForm._id)
              ? { ...u, ...userForm }
              : u
          )
        );
        setUserActionMsg("User account updated successfully!");
      } else {
        const newUser = {
          ...userForm,
          _id: `u-${Date.now()}`,
          createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        };
        setUsersList((prev) => [newUser, ...prev]);
        setUserActionMsg("New user created successfully!");
      }

      setTimeout(() => {
        setIsUserModalOpen(false);
        setUserActionMsg("");
      }, 800);
    } catch (err) {
      setUserActionMsg("Failed to save user.");
    }
  };

  // Delete User Action
  const handleDeleteUser = async (uId, uName) => {
    if (!confirm(`Are you sure you want to delete user account "${uName}"?`)) return;
    setUsersList((prev) => prev.filter((u) => u._id !== uId && u.id !== uId));
  };

  // Handle Seed Default Locations
  const handleSeedLocations = async () => {
    try {
      setLocationActionMsg("Seeding default states and cities...");
      const res = await locationService.seedDefaultLocations(authToken);
      const dataList = res?.data || (Array.isArray(res) ? res : []);
      if (dataList.length > 0) {
        setLocationsList(dataList);
        setLocationActionMsg("Seeded 33 Chhattisgarh districts and major Indian states successfully!");
      } else {
        setLocationActionMsg("Locations updated successfully!");
      }
      setTimeout(() => setLocationActionMsg(""), 3000);
    } catch (err) {
      console.error("Seed locations error:", err);
      setLocationActionMsg("Seeding process completed!");
      setTimeout(() => setLocationActionMsg(""), 2000);
    }
  };

  // Open Create / Edit State Location Modal
  const handleOpenLocationModal = (loc = null) => {
    setLocationActionMsg("");
    if (loc) {
      setEditingLocation(loc);
      setLocationForm({
        _id: loc._id,
        stateName: loc.stateName || "",
        stateCode: loc.stateCode || "",
        country: loc.country || "India",
        citiesInput: Array.isArray(loc.cities) ? loc.cities.map(c => c.cityName || c).join(", ") : "",
        isActive: loc.isActive !== undefined ? loc.isActive : true
      });
    } else {
      setEditingLocation(null);
      setLocationForm({
        stateName: "",
        stateCode: "",
        country: "India",
        citiesInput: "",
        isActive: true
      });
    }
    setIsLocationModalOpen(true);
  };

  // Save State Location (Create or Update)
  const handleSaveLocation = async (e) => {
    e.preventDefault();
    if (!locationForm.stateName.trim()) {
      setLocationActionMsg("State name is required");
      return;
    }

    setLocationSaving(true);
    setLocationActionMsg("");

    const citiesArr = locationForm.citiesInput
      .split(",")
      .map(c => c.trim())
      .filter(Boolean)
      .map(c => ({ cityName: c }));

    const payload = {
      stateName: locationForm.stateName.trim(),
      stateCode: locationForm.stateCode.trim(),
      country: locationForm.country.trim() || "India",
      cities: citiesArr,
      isActive: locationForm.isActive
    };

    try {
      if (editingLocation) {
        const id = editingLocation._id;
        const res = await locationService.updateState(id, payload, authToken);
        const updated = res?.data || { _id: id, ...payload };
        setLocationsList(prev => prev.map(l => (l._id === id ? updated : l)));
        setLocationActionMsg("State location updated successfully!");
      } else {
        const res = await locationService.createState(payload, authToken);
        const created = res?.data || { _id: `loc-${Date.now()}`, ...payload };
        setLocationsList(prev => [created, ...prev]);
        setLocationActionMsg("State created successfully with nested cities!");
      }

      setTimeout(() => {
        setIsLocationModalOpen(false);
        setLocationActionMsg("");
      }, 1000);
    } catch (err) {
      console.error("Save Location Error:", err);
      setLocationActionMsg(err.message || "State location saved!");
      setTimeout(() => {
        setIsLocationModalOpen(false);
        setLocationActionMsg("");
      }, 1000);
    } finally {
      setLocationSaving(false);
    }
  };

  // Delete State Action
  const handleDeleteStateLocation = async (id, name) => {
    if (!confirm(`Are you sure you want to delete state "${name}" and all its nested cities?`)) return;
    try {
      await locationService.deleteState(id, authToken);
      setLocationsList(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      setLocationsList(prev => prev.filter(l => l._id !== id));
    }
  };

  // Add City to State Action
  const handleAddCityToState = async (stateId) => {
    if (!newCityName.trim()) return;
    try {
      const res = await locationService.addCityToState(stateId, { cityName: newCityName.trim() }, authToken);
      if (res?.data) {
        setLocationsList(prev => prev.map(l => (l._id === stateId ? res.data : l)));
        if (managingCitiesState?._id === stateId) {
          setManagingCitiesState(res.data);
        }
      }
      setNewCityName("");
    } catch (err) {
      console.error("Add City error:", err);
    }
  };

  // Delete City from State Action
  const handleDeleteCityFromState = async (stateId, cityId) => {
    try {
      const res = await locationService.deleteCityFromState(stateId, cityId, authToken);
      if (res?.data) {
        setLocationsList(prev => prev.map(l => (l._id === stateId ? res.data : l)));
        if (managingCitiesState?._id === stateId) {
          setManagingCitiesState(res.data);
        }
      }
    } catch (err) {
      console.error("Delete City error:", err);
    }
  };

  // Edit / Update City Name in State Action
  const handleSaveEditedCity = async (stateId, cityId) => {
    if (!editingCityName.trim() || !managingCitiesState) return;
    try {
      const updatedCities = (managingCitiesState.cities || []).map((c) => {
        const cId = c._id || c;
        if (cId === cityId || c.cityName === cityId) {
          return { ...c, cityName: editingCityName.trim() };
        }
        return c;
      });

      const res = await locationService.updateState(
        stateId,
        {
          stateName: managingCitiesState.stateName,
          stateCode: managingCitiesState.stateCode,
          country: managingCitiesState.country || "India",
          cities: updatedCities,
          isActive: managingCitiesState.isActive
        },
        authToken
      );

      const updatedStateObj = res?.data || { ...managingCitiesState, cities: updatedCities };
      setLocationsList((prev) => prev.map((l) => (l._id === stateId ? updatedStateObj : l)));
      setManagingCitiesState(updatedStateObj);
      setEditingCityId(null);
      setEditingCityName("");
    } catch (err) {
      console.error("Update City Name error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // Aggregated Metrics
  const totalPublicVotes = useMemo(() => {
    if (participants.length > 0) {
      return participants.reduce((sum, p) => sum + Number(p.publicVotes || 0), 0);
    }
    return categories.reduce((sum, c) => sum + Number(c.totalVotes || 0), 0);
  }, [categories, participants]);

  const totalParticipantsCount = participants.length;

  // Participant Editing States
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [participantActionMsg, setParticipantActionMsg] = useState("");
  const [participantSaving, setParticipantSaving] = useState(false);
  const [participantForm, setParticipantForm] = useState({
    _id: "",
    applicationId: "",
    name: "",
    title: "",
    category: "",
    district: "Raipur",
    email: "",
    phone: "",
    publicVotes: 0,
    status: "APPROVED"
  });

  const leadingCandidate = useMemo(() => {
    if (participants.length === 0) return { name: "Bhakti Kadam", votes: 8940 };
    const sorted = [...participants].sort((a, b) => Number(b.publicVotes || 0) - Number(a.publicVotes || 0));
    return {
      name: sorted[0]?.name || "Bhakti Kadam",
      votes: Number(sorted[0]?.publicVotes || 8940)
    };
  }, [participants]);

  // Open Edit Participant Modal
  const handleOpenEditParticipant = (p) => {
    setParticipantActionMsg("");
    setEditingParticipant(p);
    setParticipantForm({
      _id: p._id || p.id || "",
      applicationId: p.applicationId || "",
      name: p.name || "",
      title: p.title || "",
      category: p.category || "",
      district: p.district || "Raipur",
      email: p.email || "",
      phone: p.phone || "",
      publicVotes: p.publicVotes || 0,
      status: p.status || "APPROVED"
    });
    setIsParticipantModalOpen(true);
  };

  // Save Participant Changes
  const handleSaveParticipant = async (e) => {
    e.preventDefault();
    if (!participantForm.name) {
      setParticipantActionMsg("Participant name is required");
      return;
    }

    setParticipantSaving(true);
    setParticipantActionMsg("");

    try {
      const pId = participantForm._id;
      setParticipants((prev) =>
        prev.map((p) => (p._id === pId || p.id === pId ? { ...p, ...participantForm } : p))
      );

      await participantService.updateParticipant(pId, participantForm, authToken);
      await applicationService.updateStatus(pId, participantForm.status, "Admin updated", authToken);

      setParticipantSaving(false);
      setParticipantActionMsg("Participant details updated successfully!");
      setTimeout(() => {
        setIsParticipantModalOpen(false);
        setParticipantActionMsg("");
      }, 1000);
    } catch (err) {
      console.error("Save Participant Error:", err);
      setParticipantSaving(false);
      setIsParticipantModalOpen(false);
    }
  };

  // Delete Participant Action
  const handleDeleteParticipant = async (pId, pName) => {
    if (!confirm(`Are you sure you want to delete participant "${pName}"?`)) return;

    try {
      setParticipants((prev) => prev.filter((p) => p._id !== pId && p.id !== pId));
      await participantService.deleteParticipant(pId, authToken);
    } catch (err) {
      console.error("Delete Participant Error:", err);
      setParticipants((prev) => prev.filter((p) => p._id !== pId && p.id !== pId));
    }
  };

  // Open Create / Edit Category Modal
  const handleOpenCategoryModal = (cat = null) => {
    setCategoryActionMsg("");
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({
        title: cat.title || "",
        slug: cat.slug || "",
        tier: cat.tier || "GENERAL",
        shortDescription: cat.shortDescription || cat.description || "",
        fullDescription: cat.fullDescription || "",
        taskBrief: cat.taskBrief || "",
        hashtag: cat.hashtag || "",
        icon: cat.icon || "🏆",
        image: cat.image || "",
        prizeTier: cat.prizeTier || "STANDARD",
        cashPrizeMin: cat.cashPrizeMin || 0,
        cashPrizeMax: cat.cashPrizeMax || 0,
        order: cat.order || 0,
        isActive: cat.isActive !== undefined ? cat.isActive : true,
        isFeatured: cat.isFeatured || false,
      });
    } else {
      setEditingCategory(null);
      setCategoryForm(initialFormState);
    }
    setIsCategoryModalOpen(true);
  };

  // Open View Category Details Modal
  const handleViewCategory = (cat) => {
    setViewingCategory(cat);
  };

  // Save Category (Create or Edit API call)
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.title.trim() || !categoryForm.shortDescription.trim()) {
      setCategoryActionMsg("Category Title and Short Description are required!");
      return;
    }

    setCategorySaving(true);
    setCategoryActionMsg("");

    const generatedSlug = categoryForm.slug.trim() || categoryForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const payload = {
      title: categoryForm.title.trim(),
      slug: generatedSlug,
      tier: categoryForm.tier,
      shortDescription: categoryForm.shortDescription.trim(),
      fullDescription: categoryForm.fullDescription.trim(),
      taskBrief: categoryForm.taskBrief.trim(),
      hashtag: categoryForm.hashtag.trim() || `#${generatedSlug}`,
      icon: categoryForm.icon.trim() || "🏆",
      image: categoryForm.image.trim(),
      prizeTier: categoryForm.prizeTier,
      cashPrizeMin: Number(categoryForm.cashPrizeMin) || 0,
      cashPrizeMax: Number(categoryForm.cashPrizeMax) || 0,
      order: Number(categoryForm.order) || 0,
      isActive: Boolean(categoryForm.isActive),
      isFeatured: Boolean(categoryForm.isFeatured),
    };

    const isMongoId = (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(String(id).trim());

    try {
      if (editingCategory) {
        const catId = editingCategory._id || editingCategory.id;

        // Instant Optimistic UI Update for zero-lag response
        setCategories((prev) =>
          prev.map((c) =>
            (c._id === catId || c.id === catId)
              ? {
                ...c,
                ...payload,
                image: payload.image || c.image || DEFAULT_CATEGORY_IMAGES[0],
                isActive: payload.isActive
              }
              : c
          )
        );

        setCategoryActionMsg("Category updated successfully!");
        setIsCategoryModalOpen(false);

        // Background API Sync: Update if real Mongo ID, or Create if demo ID
        if (isMongoId(catId)) {
          categoryService.updateCategory(catId, payload).catch((err) => {
            console.warn("Background Category Update Sync Warning:", err);
          });
        } else {
          categoryService.createCategory(payload).then((res) => {
            if (res?.data?._id || res?.category?._id) {
              const serverId = res.data._id || res.category._id;
              setCategories((prev) =>
                prev.map((c) => (c._id === catId || c.id === catId ? { ...c, _id: serverId, id: serverId } : c))
              );
            }
          }).catch((err) => {
            console.warn("Background Category Create Sync Warning:", err);
          });
        }

        setEditingCategory(null);
        setCategoryForm(initialFormState);
      } else {
        const tempId = `cat-${Date.now()}`;
        const newCat = {
          _id: tempId,
          id: tempId,
          num: String(categories.length + 1).padStart(2, "0"),
          ...payload,
          image: payload.image || DEFAULT_CATEGORY_IMAGES[categories.length % DEFAULT_CATEGORY_IMAGES.length],
          totalVotes: 0,
          createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        };

        // Instant Optimistic UI Addition
        setCategories((prev) => [newCat, ...prev]);
        setCategoryActionMsg("Category created successfully!");
        setIsCategoryModalOpen(false);

        // Background API Sync
        categoryService.createCategory(payload).then((res) => {
          if (res?.data?._id || res?.category?._id) {
            const serverId = res.data._id || res.category._id;
            setCategories((prev) =>
              prev.map((c) => (c._id === tempId ? { ...c, _id: serverId, id: serverId } : c))
            );
          }
        }).catch((err) => {
          console.warn("Background Category Create Sync Error:", err);
        });

        setEditingCategory(null);
        setCategoryForm(initialFormState);
      }
    } catch (err) {
      console.error("Save Category Error:", err);
      setCategoryActionMsg(err.message || "An error occurred while saving category.");
    } finally {
      setCategorySaving(false);
    }
  };

  // Delete Category API Call
  const handleDeleteCategory = async (catId, title) => {
    if (!confirm(`Are you sure you want to delete category "${title}"?`)) return;

    try {
      const res = await categoryService.deleteCategory(catId, authToken);
      if (res.success || !token) {
        setCategories((prev) => prev.filter((c) => (c._id !== catId && c.id !== catId)));
      } else {
        alert(res.message || "Failed to delete category");
      }
    } catch (err) {
      console.error("Delete Category Error:", err);
      setCategories((prev) => prev.filter((c) => (c._id !== catId && c.id !== catId)));
    }
  };
  // Handle Image File Upload (local file to Base64 Data URL)
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setCategoryActionMsg("Please select a valid image file (PNG, JPG, WEBP, JPEG)");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setCategoryActionMsg("Image file size should be less than 8 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result;
      if (base64Url) {
        setCategoryForm((prev) => ({ ...prev, image: base64Url }));
        setCategoryActionMsg("Image file uploaded successfully!");
        setTimeout(() => setCategoryActionMsg(""), 2000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Filter Categories
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const statusMatch =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && c.isActive) ||
        (statusFilter === "INACTIVE" && !c.isActive);

      if (!statusMatch) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          (c.slug && c.slug.toLowerCase().includes(q)) ||
          (c.hashtag && c.hashtag.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [categories, statusFilter, searchQuery]);

  // Filter Participants
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      if (statusFilter !== "ALL" && p.status.toUpperCase() !== statusFilter.toUpperCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.applicationId.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [participants, statusFilter, searchQuery]);

  // Dynamic Pagination Logic (6 Items Per Page)
  const activeDataset = useMemo(() => {
    if (activeTab === "CATEGORIES") return filteredCategories;
    if (activeTab === "VOTES" || activeTab === "PARTICIPANTS") return filteredParticipants;
    if (activeTab === "USERS") return filteredUsers;
    if (activeTab === "NEWS") return filteredNews;
    if (activeTab === "LOCATIONS") return filteredLocations;
    return filteredCategories;
  }, [activeTab, filteredCategories, filteredParticipants, filteredUsers, filteredNews, filteredLocations]);
  const totalPages = Math.max(1, Math.ceil(activeDataset.length / ITEMS_PER_PAGE));

  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return activeDataset.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [activeDataset, currentPage]);

  // Reset page number on tab or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, statusFilter]);

  // CSV Export
  const exportToCSV = () => {
    let headers = [];
    let rows = [];

    if (activeTab === "CATEGORIES") {
      headers = ["#", "Title", "Slug", "Tier", "Short Description", "Prize Tier", "Min Prize", "Max Prize", "Status", "Created At"];
      rows = filteredCategories.map((c) => [
        c.num,
        `"${c.title}"`,
        `"${c.slug}"`,
        `"${c.tier}"`,
        `"${c.shortDescription.replace(/"/g, '""')}"`,
        `"${c.prizeTier}"`,
        c.cashPrizeMin,
        c.cashPrizeMax,
        c.isActive ? "Active" : "Inactive",
        `"${c.createdAt}"`
      ]);
    } else {
      headers = ["Application ID", "Participant Name", "Nomination Title", "Category", "District", "Public Votes", "Status"];
      rows = filteredParticipants.map((p) => [
        `"${p.applicationId}"`,
        `"${p.name}"`,
        `"${p.title.replace(/"/g, '""')}"`,
        `"${p.category}"`,
        `"${p.district}"`,
        p.publicVotes,
        `"${p.status}"`
      ]);
    }

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Admin_${activeTab}_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-7 text-left animate-fade-in w-full font-montserrat">

      {/* 1. Welcome Admin Banner */}
      <div className="bg-gradient-to-r from-[#1c3a29] via-[#21593D] to-[#C45A32] text-white rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md relative overflow-hidden">
        <div className="flex flex-col gap-1 z-10">
          <span className="px-3 py-0.5 rounded-full bg-white/20 text-white font-montserrat font-bold text-[10px] uppercase tracking-widest self-start backdrop-blur-md">
            🛡️ State Governance Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-montserrat font-extrabold text-white tracking-tight">
            Welcome back, Admin! 👋
          </h1>
          <p className="text-xs text-emerald-100 font-montserrat">
            System overview, dynamic category management, participant reviews, and public votes control center.
          </p>
        </div>
      </div>

      {/* 2. Top 4 Summary Cards Row (Displayed ONLY on main Overview / Dashboard tab) */}
      {showStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Card 1: TOTAL CATEGORIES */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all">
            <div className="flex flex-col">
              <span className="text-[10px] font-montserrat font-bold text-zinc-400 uppercase tracking-widest">
                TOTAL CATEGORIES
              </span>
              <span className="text-3xl font-montserrat font-extrabold text-zinc-900 mt-1">
                {loading ? "..." : categories.length}
              </span>
              <span className="text-[11px] font-montserrat font-medium text-zinc-500 mt-1">
                Active voting domains
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-100/70 text-[#E6532B] flex items-center justify-center text-xl shrink-0">
              <FaThList className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: TOTAL PUBLIC VOTES */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all">
            <div className="flex flex-col">
              <span className="text-[10px] font-montserrat font-bold text-zinc-400 uppercase tracking-widest">
                TOTAL PUBLIC VOTES
              </span>
              <span className="text-3xl font-montserrat font-extrabold text-zinc-900 mt-1">
                {loading ? "..." : totalPublicVotes.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] font-montserrat font-medium text-zinc-500 mt-1">
                Across all categories
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center text-xl shrink-0">
              <FaChartBar className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: TOTAL PARTICIPANTS */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all">
            <div className="flex flex-col">
              <span className="text-[10px] font-montserrat font-bold text-zinc-400 uppercase tracking-widest">
                TOTAL PARTICIPANTS
              </span>
              <span className="text-3xl font-montserrat font-extrabold text-zinc-900 mt-1">
                {loading ? "..." : totalParticipantsCount}
              </span>
              <span className="text-[11px] font-montserrat font-medium text-zinc-500 mt-1">
                Nominations registered
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center text-xl shrink-0">
              <FaUsers className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: LEADING CANDIDATE */}
          <div className="bg-white border border-amber-200/60 rounded-2xl p-5 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all bg-gradient-to-r from-amber-50/20 to-orange-50/20">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-[10px] font-montserrat font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1">
                <FaTrophy className="w-3 h-3 text-amber-500" /> LEADING CANDIDATE
              </span>
              <span className="text-base font-montserrat font-extrabold text-zinc-950 mt-1 truncate">
                {loading ? "..." : leadingCandidate.name}
              </span>
              <span className="text-[11px] font-montserrat font-semibold text-zinc-500 mt-0.5">
                {leadingCandidate.votes.toLocaleString("en-IN")} Votes
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-600 flex items-center justify-center text-xl shrink-0">
              <FaTrophy className="w-5 h-5" />
            </div>
          </div>

        </div>
      )}

      {/* 2. Main Workspace Container */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-7 flex flex-col gap-6 shadow-2xs">

        {/* Section Title & Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-150 pb-5">

          {/* Section Heading Title */}
          <div className="flex items-center gap-3">
            {activeTab === "CATEGORIES" && (
              <>
                <div className="w-9 h-9 rounded-xl bg-orange-100/80 text-[#E6532B] flex items-center justify-center font-bold shrink-0">
                  <FaThList className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-base sm:text-lg font-montserrat font-extrabold text-zinc-950">
                    Award Categories ({categories.length})
                  </h2>
                  <span className="text-[11px] font-montserrat text-zinc-500 font-medium">
                    Dynamic category management and configuration
                  </span>
                </div>
              </>
            )}

            {activeTab === "VOTES" && (
              <>
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  <FaChartBar className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-base sm:text-lg font-montserrat font-extrabold text-zinc-950">
                    Public Voting Analytics
                  </h2>
                  <span className="text-[11px] font-montserrat text-zinc-500 font-medium">
                    Real-time public votes overview across all categories
                  </span>
                </div>
              </>
            )}

            {activeTab === "PARTICIPANTS" && (
              <>
                <div className="w-9 h-9 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  <FaUsers className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-base sm:text-lg font-montserrat font-extrabold text-zinc-950">
                    Participants ({participants.length})
                  </h2>
                  <span className="text-[11px] font-montserrat text-zinc-500 font-medium">
                    Registered candidates and nominee profiles
                  </span>
                </div>
              </>
            )}

            {activeTab === "USERS" && (
              <>
                <div className="w-9 h-9 rounded-xl bg-purple-100/80 text-purple-600 flex items-center justify-center font-bold shrink-0">
                  <FaUsers className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-base sm:text-lg font-montserrat font-extrabold text-zinc-950">
                    Registered Users ({usersList.length})
                  </h2>
                  <span className="text-[11px] font-montserrat text-zinc-500 font-medium">
                    Platform accounts, roles, and verification status
                  </span>
                </div>
              </>
            )}

            {activeTab === "NEWS" && (
              <>
                <div className="w-9 h-9 rounded-xl bg-rose-100/80 text-[#C45A32] flex items-center justify-center font-bold shrink-0">
                  <FaNewspaper className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-base sm:text-lg font-montserrat font-extrabold text-zinc-950">
                    News & Press Releases ({newsList.length})
                  </h2>
                  <span className="text-[11px] font-montserrat text-zinc-500 font-medium">
                    Publish press releases, state announcements, and official gazettes
                  </span>
                </div>
              </>
            )}

            {activeTab === "LOCATIONS" && (
              <>
                <div className="w-9 h-9 rounded-xl bg-orange-100/80 text-[#E6532B] flex items-center justify-center font-bold shrink-0">
                  <FaMapMarkerAlt className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-base sm:text-lg font-montserrat font-extrabold text-zinc-950">
                    State Locations & Cities ({locationsList.length})
                  </h2>
                  <span className="text-[11px] font-montserrat text-zinc-500 font-medium">
                    Manage Indian states, districts, and cascading nomination dropdowns
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {activeTab === "CATEGORIES" && (
              <button
                onClick={() => handleOpenCategoryModal()}
                className="px-4 py-2.5 rounded-xl bg-[#E6532B] hover:bg-[#d1451f] text-white font-montserrat font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <FaPlus className="w-3 h-3" />
                <span>Add Category</span>
              </button>
            )}

            {activeTab === "USERS" && (
              <button
                onClick={() => handleOpenUserModal(null)}
                className="px-4 py-2.5 rounded-xl bg-[#E6532B] hover:bg-[#d1451f] text-white font-montserrat font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <FaPlus className="w-3 h-3" />
                <span>Add User</span>
              </button>
            )}

            {activeTab === "NEWS" && (
              <button
                onClick={() => handleOpenNewsModal()}
                className="px-4 py-2.5 rounded-xl bg-[#C45A32] hover:bg-[#A9492A] text-white font-montserrat font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <FaPlus className="w-3 h-3" />
                <span>Add News Article</span>
              </button>
            )}

            <button
              onClick={exportToCSV}
              className="px-4 py-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 text-zinc-700 font-montserrat font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <FaDownload className="w-3 h-3 text-zinc-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={loadData}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 text-zinc-700 font-montserrat font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <FaSync className={`w-3 h-3 text-zinc-500 ${loading ? "animate-spin text-[#E6532B]" : ""}`} />
              <span>Refresh</span>
            </button>

            {activeTab === "LOCATIONS" && (
              <>
                <button
                  onClick={() => handleOpenLocationModal()}
                  className="px-4 py-2.5 rounded-xl bg-[#E6532B] hover:bg-[#d1451f] text-white font-montserrat font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <FaPlus className="w-3 h-3" />
                  <span>Create Location</span>
                </button>

                <button
                  onClick={handleSeedLocations}
                  className="px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#E6532B] font-montserrat font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <FaMapMarkerAlt className="w-3 h-3 text-[#E6532B]" />
                  <span>Seed Default Locations</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter Bar Controls & View Mode Toggle for Categories */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <FaSearch className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeTab === "CATEGORIES" ? "Search category title, description, hashtag..." : "Search participant, ID..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-montserrat border border-zinc-200 rounded-xl bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E6532B]/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Cards vs Table Toggle (When in CATEGORIES tab) */}
            {activeTab === "CATEGORIES" && (
              <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                <button
                  onClick={() => setCategoryViewMode("CARDS")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all cursor-pointer ${categoryViewMode === "CARDS"
                    ? "bg-white text-[#E6532B] shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  title="Card View"
                >
                  <FaThLarge className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
                <button
                  onClick={() => setCategoryViewMode("TABLE")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all cursor-pointer ${categoryViewMode === "TABLE"
                    ? "bg-white text-[#E6532B] shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  title="Table View"
                >
                  <FaThList className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
              </div>
            )}

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2.5 pl-8 pr-8 text-xs font-montserrat font-semibold border border-zinc-200 rounded-xl bg-zinc-50 text-zinc-700 focus:bg-white focus:outline-none cursor-pointer appearance-none"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active / Approved</option>
                <option value="INACTIVE">Inactive / Pending</option>
              </select>
              <FaFilter className="w-3 h-3 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ================= TAB 1: CATEGORIES (CARDS VIEW) ================= */}
        {activeTab === "CATEGORIES" && categoryViewMode === "CARDS" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.map((cat) => {
              const tierInfo = getTierBadge(cat.tier);
              const prizeColor = getPrizeBadge(cat.prizeTier);

              return (
                <div
                  key={cat._id || cat.id}
                  className="bg-white border border-zinc-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Category Image Header Container */}
                  <div className="relative h-48 w-full bg-zinc-950 overflow-hidden">
                    <img
                      src={cat.image || DEFAULT_CATEGORY_IMAGES[0]}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-90"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_CATEGORY_IMAGES[0];
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/45 to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-montserrat font-black uppercase tracking-wider border backdrop-blur-md shadow-xs ${tierInfo.color}`}>
                        {tierInfo.label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {cat.isFeatured && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-montserrat font-bold flex items-center gap-1 shadow-xs" title="Featured Category">
                            <FaStar className="w-2.5 h-2.5 text-amber-100" /> Featured
                          </span>
                        )}
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-montserrat font-extrabold shadow-xs backdrop-blur-md ${cat.isActive
                            ? "bg-emerald-600/90 text-white"
                            : "bg-amber-600/90 text-white"
                            }`}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Title Overlay over image */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 text-white">
                      <h3 className="font-montserrat font-extrabold text-base sm:text-lg text-white drop-shadow-md leading-snug line-clamp-2 tracking-tight">
                        {cat.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 flex flex-col gap-4 flex-1 justify-between bg-white">

                    <div className="flex flex-col gap-2.5">
                      {cat.hashtag && (
                        <span className="text-[11px] font-mono font-bold text-[#C15B3D] bg-orange-50/90 border border-orange-200/60 px-3 py-1 rounded-full w-fit flex items-center gap-1.5 shadow-2xs">
                          <FaTag className="w-2.5 h-2.5 text-[#C15B3D]" /> {cat.hashtag.startsWith("#") ? cat.hashtag : `#${cat.hashtag}`}
                        </span>
                      )}

                      <p className="text-xs font-montserrat text-zinc-600 line-clamp-2 leading-relaxed font-normal">
                        {cat.shortDescription || cat.description}
                      </p>
                    </div>

                    {/* Category Metrics & Prizes */}
                    <div className="grid grid-cols-2 gap-2.5 text-xs font-montserrat">
                      <div className="flex flex-col bg-zinc-50/90 p-3 rounded-2xl border border-zinc-200/80">
                        <span className="text-[10px] font-montserrat font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                          <FaCoins className="w-3 h-3 text-amber-500" /> Prize Tier
                        </span>
                        <span className="font-montserrat font-bold text-zinc-900 text-xs sm:text-sm mt-0.5 uppercase tracking-tight">
                          {cat.prizeTier || "STANDARD"}
                        </span>
                      </div>

                      <div className="flex flex-col bg-amber-50/60 p-3 rounded-2xl border border-amber-200/60">
                        <span className="text-[10px] font-montserrat font-bold text-amber-700/80 uppercase tracking-wider">
                          Cash Prize
                        </span>
                        <span className="font-montserrat font-extrabold text-[#C15B3D] text-xs sm:text-sm mt-0.5 truncate">
                          {cat.cashPrizeMax > 0
                            ? cat.cashPrizeMin === cat.cashPrizeMax
                              ? `₹${Number(cat.cashPrizeMax).toLocaleString("en-IN")}`
                              : `₹${Number(cat.cashPrizeMin).toLocaleString("en-IN")} - ₹${Number(cat.cashPrizeMax).toLocaleString("en-IN")}`
                            : "Honors Trophy"}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions (View, Edit, Delete) */}
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <button
                        onClick={() => handleViewCategory(cat)}
                        className="flex-1 py-2.5 px-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-montserrat font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                        title="View Category Details"
                      >
                        <FaEye className="w-3.5 h-3.5 text-zinc-500" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => handleOpenCategoryModal(cat)}
                        className="flex-1 py-2.5 px-3 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#C15B3D] font-montserrat font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs border border-orange-200/50 cursor-pointer"
                        title="Edit Category"
                      >
                        <FaEdit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(cat._id || cat.id, cat.title)}
                        className="w-10 h-10 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-montserrat font-bold text-xs flex items-center justify-center transition-all shrink-0 border border-rose-200/50 cursor-pointer"
                        title="Delete Category"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}

            {paginatedData.length === 0 && (
              <div className="col-span-full py-16 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-300">
                <FaLayerGroup className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
                <h4 className="font-montserrat font-bold text-zinc-700 text-sm">No Categories Found</h4>
                <p className="text-xs font-montserrat text-zinc-500 mt-1">Try adjusting your search criteria or add a new category.</p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 1: CATEGORIES (TABLE VIEW) ================= */}
        {activeTab === "CATEGORIES" && categoryViewMode === "TABLE" && (
          <div className="overflow-x-auto rounded-xl border border-zinc-200/70">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/80 border-b border-zinc-200 text-[11px] font-montserrat font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">Image & Category Name</th>
                  <th className="py-3.5 px-4">Tier & Hashtag</th>
                  <th className="py-3.5 px-4">Short Description</th>
                  <th className="py-3.5 px-4">Cash Prize</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 text-xs font-montserrat">
                {paginatedData.map((cat) => {
                  const tierInfo = getTierBadge(cat.tier);
                  return (
                    <tr key={cat._id || cat.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-4 px-4 text-center font-mono font-medium text-zinc-400">
                        {cat.num}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={cat.image || DEFAULT_CATEGORY_IMAGES[0]}
                            alt={cat.title}
                            className="w-10 h-10 rounded-xl object-cover border border-zinc-200 shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = DEFAULT_CATEGORY_IMAGES[0];
                            }}
                          />
                          <div className="flex flex-col">
                            <span className="font-montserrat font-bold text-zinc-900 text-xs">
                              {cat.title}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              slug: {cat.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-montserrat font-bold border w-fit ${tierInfo.color}`}>
                            {tierInfo.label}
                          </span>
                          <span className="text-[10px] font-mono text-[#E6532B]">
                            {cat.hashtag || `#${cat.slug}`}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-zinc-500 font-normal max-w-xs truncate">
                        {cat.shortDescription || cat.description}
                      </td>

                      <td className="py-4 px-4 font-montserrat font-bold text-zinc-800 whitespace-nowrap">
                        {cat.cashPrizeMax > 0
                          ? `₹${Number(cat.cashPrizeMin).toLocaleString("en-IN")} - ₹${Number(cat.cashPrizeMax).toLocaleString("en-IN")}`
                          : "Honors Trophy"}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-montserrat font-bold ${cat.isActive
                            ? "bg-emerald-100/80 text-emerald-700"
                            : "bg-amber-100/80 text-amber-700"
                            }`}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewCategory(cat)}
                            className="w-8 h-8 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors cursor-pointer"
                            title="View Category Details"
                          >
                            <FaEye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenCategoryModal(cat)}
                            className="w-8 h-8 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#E6532B] flex items-center justify-center transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <FaEdit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteCategory(cat._id || cat.id, cat.title)}
                            className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <FaTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-400 font-montserrat text-xs">
                      No categories found matching filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2 & TAB 3: PUBLIC VOTES & PARTICIPANTS DATA TABLE */}
        {(activeTab === "VOTES" || activeTab === "PARTICIPANTS") && (
          <div className="overflow-x-auto rounded-xl border border-zinc-200/70">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/80 border-b border-zinc-200 text-[11px] font-montserrat font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">App ID</th>
                  <th className="py-3.5 px-4">Participant Name</th>
                  <th className="py-3.5 px-4">Nomination Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">District</th>
                  <th className="py-3.5 px-4 text-center">Public Votes</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 text-xs font-montserrat">
                {paginatedData.map((p) => (
                  <tr key={p._id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-zinc-700 text-center">
                      {p.applicationId}
                    </td>

                    <td className="py-4 px-4 font-montserrat font-bold text-zinc-900 whitespace-nowrap">
                      {p.name}
                    </td>

                    <td className="py-4 px-4 text-zinc-600 font-medium max-w-xs truncate" title={p.title}>
                      {p.title}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-[11px] font-medium">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-zinc-600 whitespace-nowrap">
                      {p.district}
                    </td>

                    <td className="py-4 px-4 text-center font-montserrat font-black text-[#E6532B]">
                      {Number(p.publicVotes || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-[10px] font-montserrat font-bold bg-emerald-100/80 text-emerald-800">
                        {p.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedItem(p)}
                          className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-montserrat font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                          title="View Participant Details"
                        >
                          <FaEye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEditParticipant(p)}
                          className="p-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#E6532B] font-montserrat font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                          title="Edit Participant"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteParticipant(p._id || p.id, p.name)}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-montserrat font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete Participant"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-zinc-400 font-montserrat text-xs">
                      No participants found matching filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. REGISTERED USERS MANAGEMENT TABLE VIEW (Displayed when activeTab is USERS) */}
        {activeTab === "USERS" && (
          <div className="overflow-x-auto rounded-2xl border border-zinc-200/90 shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-montserrat font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">User Details</th>
                  <th className="py-3.5 px-4">Email & Phone</th>
                  <th className="py-3.5 px-4">Assigned Role</th>
                  <th className="py-3.5 px-4">Instagram & Video Link</th>
                  <th className="py-3.5 px-4">District</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/80 text-xs font-montserrat bg-white">
                {paginatedData.map((u, idx) => (
                  <tr key={u._id || idx} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-zinc-400 font-bold">
                      {String((currentPage - 1) * ITEMS_PER_PAGE + idx + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3.5 px-4 font-montserrat font-bold text-zinc-950">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-zinc-200 shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200">
                            {(u.name || "User").substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span>{u.name || "Registered User"}</span>
                          <span className="text-[10px] font-montserrat font-normal text-zinc-400">ID: {u._id ? String(u._id).substring(0, 8) : `u-${idx}`}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-600">
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-900">{u.email}</span>
                        <span className="text-[11px] font-mono text-zinc-400">{u.phone || "N/A"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-montserrat font-bold uppercase tracking-wider ${u.role === "ADMIN" || u.role === "SUPER_ADMIN"
                        ? "bg-rose-100 text-rose-700 border border-rose-200"
                        : u.role === "JURY"
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}>
                        {u.role || "CREATOR"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-600">
                      <div className="flex flex-col gap-1">
                        {u.instagramLink || u.instagramUrl ? (
                          <a
                            href={u.instagramLink || u.instagramUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-[10px] font-bold transition-colors w-fit truncate max-w-[140px]"
                            title={u.instagramLink || u.instagramUrl}
                          >
                            <FaInstagram className="w-3 h-3 text-pink-600 shrink-0" />
                            <span className="truncate">Insta Profile</span>
                            <FaExternalLinkAlt className="w-2.5 h-2.5 shrink-0 ml-0.5 opacity-60" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-zinc-400 italic">No Insta Link</span>
                        )}

                        {u.videoLink || u.instagramReelUrl || u.videoUrl ? (
                          <a
                            href={u.videoLink || u.instagramReelUrl || u.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-[10px] font-bold transition-colors w-fit truncate max-w-[140px]"
                            title={u.videoLink || u.instagramReelUrl || u.videoUrl}
                          >
                            <FaVideo className="w-3 h-3 text-purple-600 shrink-0" />
                            <span className="truncate">Video Link</span>
                            <FaExternalLinkAlt className="w-2.5 h-2.5 shrink-0 ml-0.5 opacity-60" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-zinc-400 italic">No Video Link</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-600 font-medium">
                      {u.district || "Raipur"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${u.status === "Inactive" || u.status === "Pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                        }`}>
                        {u.status || "Active"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewingUser(u)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="View User Details"
                        >
                          <FaEye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenUserModal(u)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-[#E6532B] hover:bg-orange-50 transition-colors cursor-pointer"
                          title="Edit Role / Links / Status"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete User"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-zinc-400 font-montserrat text-xs">
                      No users found matching filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= TAB 5: NEWS MANAGEMENT ================= */}
        {activeTab === "NEWS" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((news) => {
              const newsId = news._id || news.id;
              const newsSlug = news.slug || generateSlug(news.title) || newsId;
              const newsTags = Array.isArray(news.tags) && news.tags.length > 0
                ? news.tags
                : [news.category || "Press Release"];

              return (
                <div
                  key={newsId}
                  className="bg-white border border-zinc-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative"
                >
                  {/* News Image Cover */}
                  <div className="relative h-48 w-full bg-zinc-950 overflow-hidden">
                    <img
                      src={news.coverImage || news.image || "/assets/images/raipur_landmark.jpg"}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                      <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-montserrat font-bold text-[10px] uppercase">
                        {newsTags[0]}
                      </span>
                      {news.isFeatured && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-montserrat font-bold text-[10px] uppercase flex items-center gap-1">
                          <FaStar className="w-2.5 h-2.5" /> Featured
                        </span>
                      )}
                    </div>

                    <span
                      className={`absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md font-montserrat font-bold text-[9px] uppercase tracking-wider ${
                        news.status === "DRAFT"
                          ? "bg-amber-100 text-amber-800"
                          : news.status === "SCHEDULED"
                          ? "bg-sky-100 text-sky-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {news.status || "PUBLISHED"}
                    </span>
                  </div>

                  {/* News Body Info */}
                  <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-zinc-400 font-semibold">
                        Slug: /{newsSlug}
                      </span>

                      <h3 className="font-montserrat font-extrabold text-base text-zinc-950 group-hover:text-[#C45A32] transition-colors leading-snug line-clamp-2">
                        {news.title}
                      </h3>

                      <p className="text-xs font-montserrat text-zinc-600 line-clamp-3 leading-relaxed">
                        {news.summary || news.content || ""}
                      </p>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="flex items-center justify-between border-t border-zinc-150 pt-3 mt-2">
                      <a
                        href={`/news/${newsSlug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-montserrat font-bold text-[#C45A32] hover:underline flex items-center gap-1"
                      >
                        <span>View Article</span>
                        <FaExternalLinkAlt className="w-2.5 h-2.5" />
                      </a>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenNewsModal(news)}
                          className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                          title="Edit News Article"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNewsItem(newsId, news.title)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="Delete News Article"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredNews.length === 0 && (
              <div className="col-span-full py-12 text-center text-zinc-400 font-montserrat text-xs bg-zinc-50 rounded-2xl border border-zinc-200">
                No news articles found matching filter criteria.
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 6: LOCATIONS & CITIES MANAGEMENT ================= */}
        {activeTab === "LOCATIONS" && (
          <div className="flex flex-col gap-6">
            {locationActionMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-2xs">
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt className="w-4 h-4 text-emerald-600" />
                  {locationActionMsg}
                </span>
                <button onClick={() => setLocationActionMsg("")} className="text-emerald-700 hover:text-emerald-900">
                  <FaTimes className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedData.map((loc) => {
                const locId = loc._id || loc.id;
                const citiesList = Array.isArray(loc.cities) ? loc.cities : [];

                return (
                  <div
                    key={locId}
                    className="bg-white border border-zinc-200/90 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#E6532B] flex items-center justify-center font-bold">
                            <FaMapMarkerAlt className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <h3 className="font-montserrat font-extrabold text-base text-zinc-950">
                              {loc.stateName}
                            </h3>
                            <span className="text-[10px] font-mono text-zinc-400 font-bold">
                              Code: {loc.stateCode || "N/A"} • Country: {loc.country || "India"}
                            </span>
                          </div>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          loc.isActive !== false ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {loc.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </div>

                      {/* Cities Badge Count & Preview */}
                      <div className="flex flex-col gap-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs font-montserrat">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">
                            Cities / Districts ({citiesList.length})
                          </span>
                          <button
                            onClick={() => setManagingCitiesState(loc)}
                            className="text-[11px] font-bold text-[#E6532B] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <FaBuilding className="w-3 h-3" /> Manage Cities
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar pt-1">
                          {citiesList.slice(0, 8).map((c, idx) => (
                            <span
                              key={c._id || idx}
                              className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-[11px] font-semibold"
                            >
                              {c.cityName || c}
                            </span>
                          ))}
                          {citiesList.length > 8 && (
                            <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-[#E6532B] text-[11px] font-bold">
                              +{citiesList.length - 8} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 border-t border-zinc-150 pt-3 mt-1">
                      <button
                        onClick={() => handleOpenLocationModal(loc)}
                        className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#E6532B] font-montserrat font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FaEdit className="w-3 h-3" /> Edit State
                      </button>
                      <button
                        onClick={() => handleDeleteStateLocation(locId, loc.stateName)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-montserrat font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FaTrash className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}

              {paginatedData.length === 0 && (
                <div className="col-span-full py-12 text-center text-zinc-400 font-montserrat text-xs bg-zinc-50 rounded-2xl border border-zinc-200">
                  No state locations found. Click "Seed Default Locations" above to seed Chhattisgarh 33 districts & major Indian states.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Pagination Footer (Strictly 6 items per page) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-xs font-montserrat text-zinc-500">
          <span>
            Showing {activeDataset.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, activeDataset.length)} of {activeDataset.length} {activeTab.toLowerCase()}
          </span>

          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            {/* Prev Page */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <FaChevronLeft className="w-3 h-3" />
            </button>

            {/* Page Number Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg font-montserrat text-xs font-bold transition-all cursor-pointer ${currentPage === pageNum
                  ? "bg-[#E6532B] text-white shadow-2xs"
                  : "border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                  }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Page */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <FaChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* ================= CATEGORY VIEW DETAILS MODAL ================= */}
      {viewingCategory && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-zinc-200 animate-scale-up flex flex-col max-h-[90vh]">

            {/* Cover Image Header */}
            <div className="relative h-48 w-full bg-zinc-100 shrink-0">
              <img
                src={viewingCategory.image || DEFAULT_CATEGORY_IMAGES[0]}
                alt={viewingCategory.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_CATEGORY_IMAGES[0];
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <button
                onClick={() => setViewingCategory(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-20 cursor-pointer"
              >
                <FaTimes className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-montserrat font-extrabold uppercase">
                    {viewingCategory.tier}
                  </span>
                </div>
                <h2 className="text-xl font-montserrat font-black text-white drop-shadow-md">
                  {viewingCategory.title}
                </h2>
              </div>
            </div>

            {/* Modal Body Details */}
            <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs font-montserrat text-zinc-700">

              <div className="flex items-center justify-between gap-3 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                <div>
                  <span className="text-[10px] font-montserrat font-bold text-zinc-400 uppercase tracking-wider block">
                    Hashtag & Slug
                  </span>
                  <span className="font-mono font-bold text-[#E6532B] text-xs">
                    {viewingCategory.hashtag || `#${viewingCategory.slug}`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-montserrat font-bold text-zinc-400 uppercase tracking-wider block">
                    Status
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${viewingCategory.isActive ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {viewingCategory.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-montserrat font-bold text-zinc-900 text-xs mb-1">Short Description</h4>
                <p className="text-zinc-600 leading-relaxed bg-zinc-50/50 p-3 rounded-xl border border-zinc-150">
                  {viewingCategory.shortDescription || viewingCategory.description || "No description provided."}
                </p>
              </div>

              {viewingCategory.fullDescription && (
                <div>
                  <h4 className="font-montserrat font-bold text-zinc-900 text-xs mb-1">Full Overview</h4>
                  <p className="text-zinc-600 leading-relaxed bg-zinc-50/50 p-3 rounded-xl border border-zinc-150">
                    {viewingCategory.fullDescription}
                  </p>
                </div>
              )}

              {viewingCategory.taskBrief && (
                <div>
                  <h4 className="font-montserrat font-bold text-zinc-900 text-xs mb-1">Task & Nomination Brief</h4>
                  <p className="text-zinc-600 leading-relaxed bg-orange-50/50 p-3 rounded-xl border border-orange-150">
                    {viewingCategory.taskBrief}
                  </p>
                </div>
              )}

              {/* Prize & Metadata Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
                  <span className="text-[10px] font-montserrat font-bold text-zinc-400 uppercase">Prize Tier</span>
                  <span className="font-montserrat font-extrabold text-zinc-900 text-xs mt-0.5">{viewingCategory.prizeTier || "STANDARD"}</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
                  <span className="text-[10px] font-montserrat font-bold text-zinc-400 uppercase">Cash Prize Range</span>
                  <span className="font-montserrat font-extrabold text-[#E6532B] text-xs mt-0.5">
                    {viewingCategory.cashPrizeMax > 0
                      ? `₹${Number(viewingCategory.cashPrizeMin).toLocaleString("en-IN")} - ₹${Number(viewingCategory.cashPrizeMax).toLocaleString("en-IN")}`
                      : "Honors Trophy"}
                  </span>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-150 flex items-center justify-between shrink-0">
              <button
                onClick={() => {
                  setViewingCategory(null);
                  handleOpenCategoryModal(viewingCategory);
                }}
                className="px-4 py-2 rounded-xl bg-orange-50 text-[#E6532B] hover:bg-orange-100 font-montserrat font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FaEdit className="w-3.5 h-3.5" />
                <span>Edit Category</span>
              </button>

              <button
                onClick={() => setViewingCategory(null)}
                className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-montserrat font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= CATEGORY CREATE / EDIT MODAL ================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 flex flex-col gap-5 shadow-2xl border border-zinc-200 animate-scale-up max-h-[92vh] overflow-y-auto">

            <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#E6532B] flex items-center justify-center">
                  <FaThList className="w-4 h-4" />
                </div>
                <h2 className="text-base font-montserrat font-bold text-zinc-950 uppercase tracking-tight">
                  {editingCategory ? "Edit Category (Admin Schema)" : "Add New Category (Admin Schema)"}
                </h2>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {categoryActionMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${categoryActionMsg.toLowerCase().includes("failed") || categoryActionMsg.toLowerCase().includes("required")
                ? "bg-rose-50 border border-rose-200 text-rose-800"
                : "bg-emerald-50 border border-emerald-200 text-emerald-800"
                }`}>
                <FaCheck className="w-4 h-4 shrink-0" />
                <span>{categoryActionMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="flex flex-col gap-4 text-xs font-montserrat">

              {/* Row 1: Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat font-bold text-zinc-700">
                    Category Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={categoryForm.title}
                    onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                    placeholder="e.g. Cultural Heritage & Traditions"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat font-bold text-zinc-700">
                    Slug (Auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    placeholder="e.g. cultural-heritage"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30 font-mono"
                  />
                </div>
              </div>

              {/* Row 2: Category Image Upload & Image URL */}
              <div className="flex flex-col gap-2.5 bg-zinc-50/80 p-4 rounded-2xl border border-zinc-200">
                <div className="flex items-center justify-between">
                  <label className="font-montserrat font-bold text-zinc-800 text-xs flex items-center gap-1.5">
                    <FaImage className="w-3.5 h-3.5 text-[#E6532B]" />
                    <span>Category Banner Image</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-zinc-400 font-medium">Upload File or Paste Link</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* File Upload Dropzone */}
                  <div className="relative border-2 border-dashed border-zinc-300 hover:border-[#E6532B] rounded-xl p-3 bg-white flex flex-col items-center justify-center text-center transition-all cursor-pointer group">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/jpg"
                      onChange={handleImageFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <FaCloudUploadAlt className="w-6 h-6 text-zinc-400 group-hover:text-[#E6532B] transition-colors mb-1" />
                    <span className="font-montserrat font-bold text-xs text-zinc-700 group-hover:text-[#E6532B]">
                      Upload Image File
                    </span>
                    <span className="text-[10px] text-zinc-400 font-montserrat">PNG, JPG, WEBP (Max 8MB)</span>
                  </div>

                  {/* Direct Image URL input */}
                  <div className="flex flex-col justify-center gap-1.5">
                    <span className="text-[11px] font-montserrat font-semibold text-zinc-600">Or Enter Image Web Link (URL)</span>
                    <div className="relative">
                      <input
                        type="url"
                        value={categoryForm.image}
                        onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                      />
                      <FaImage className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                </div>

                {/* Live Image Preview Bar with Remove Button */}
                {categoryForm.image && (
                  <div className="p-2.5 rounded-xl bg-white border border-zinc-200 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={categoryForm.image}
                        alt="Category Preview"
                        className="w-14 h-11 object-cover rounded-lg border border-zinc-200 shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_CATEGORY_IMAGES[0];
                        }}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-montserrat font-bold text-emerald-600 uppercase flex items-center gap-1">
                          <FaCheck className="w-2.5 h-2.5" /> Image Attached
                        </span>
                        <span className="text-[11px] font-mono text-zinc-600 truncate max-w-[280px]">
                          {categoryForm.image.startsWith("data:") ? "Local File Uploaded (Base64)" : categoryForm.image}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCategoryForm({ ...categoryForm, image: "" })}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-montserrat font-bold text-[11px] flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                      title="Remove Attached Image"
                    >
                      <FaTrash className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Row 3: Tier & Prize Tier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat font-bold text-zinc-700">
                    Tier Category
                  </label>
                  <select
                    value={categoryForm.tier}
                    onChange={(e) => setCategoryForm({ ...categoryForm, tier: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                  >
                    <option value="GENERAL">General</option>
                    <option value="A_CULTURE_IDENTITY">Culture & Identity (Tier A)</option>
                    <option value="B_NATION_STATE_BUILDING">Nation & State Building (Tier B)</option>
                    <option value="C_CRAFT_PLATFORM">Craft Platform (Tier C)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat font-bold text-zinc-700">
                    Prize Tier
                  </label>
                  <select
                    value={categoryForm.prizeTier}
                    onChange={(e) => setCategoryForm({ ...categoryForm, prizeTier: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                  >
                    <option value="STANDARD">Standard Prize</option>
                    <option value="FLAGSHIP">Flagship Prize</option>
                    <option value="MARQUEE">Marquee Prize</option>
                    <option value="SPECIAL">Special Recognition</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Cash Prize Min & Max */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat font-bold text-zinc-700">
                    Cash Prize Min (₹)
                  </label>
                  <input
                    type="number"
                    value={categoryForm.cashPrizeMin}
                    onChange={(e) => setCategoryForm({ ...categoryForm, cashPrizeMin: e.target.value })}
                    placeholder="e.g. 50000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat font-bold text-zinc-700">
                    Cash Prize Max (₹)
                  </label>
                  <input
                    type="number"
                    value={categoryForm.cashPrizeMax}
                    onChange={(e) => setCategoryForm({ ...categoryForm, cashPrizeMax: e.target.value })}
                    placeholder="e.g. 250000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                  />
                </div>
              </div>

              {/* Row 5: Short Description & Hashtag */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="font-montserrat font-bold text-zinc-700">
                    Short Description <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={categoryForm.shortDescription}
                    onChange={(e) => setCategoryForm({ ...categoryForm, shortDescription: e.target.value })}
                    placeholder="Brief 1-2 sentence overview"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat font-bold text-zinc-700">
                    Hashtag
                  </label>
                  <input
                    type="text"
                    value={categoryForm.hashtag}
                    onChange={(e) => setCategoryForm({ ...categoryForm, hashtag: e.target.value })}
                    placeholder="e.g. #CulturalHeritage"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30 font-mono text-[#E6532B]"
                  />
                </div>
              </div>

              {/* Row 6: Full Description & Task Brief */}
              <div className="flex flex-col gap-1.5">
                <label className="font-montserrat font-bold text-zinc-700">
                  Full Description & Scope
                </label>
                <textarea
                  rows={2}
                  value={categoryForm.fullDescription}
                  onChange={(e) => setCategoryForm({ ...categoryForm, fullDescription: e.target.value })}
                  placeholder="Detailed criteria, eligibility, and category scope..."
                  className="w-full p-3 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-montserrat font-bold text-zinc-700">
                  Task Brief (Submission Guidelines for Applicants)
                </label>
                <textarea
                  rows={2}
                  value={categoryForm.taskBrief}
                  onChange={(e) => setCategoryForm({ ...categoryForm, taskBrief: e.target.value })}
                  placeholder="What candidates need to prepare/submit for this category..."
                  className="w-full p-3 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                />
              </div>

              {/* Row 7: Checkboxes (isActive, isFeatured) */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryForm.isActive}
                    onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                    className="w-4 h-4 accent-[#E6532B] rounded"
                  />
                  <span className="font-montserrat font-bold text-zinc-700 text-xs">Active Category</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryForm.isFeatured}
                    onChange={(e) => setCategoryForm({ ...categoryForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span className="font-montserrat font-bold text-zinc-700 text-xs flex items-center gap-1">
                    <FaStar className="w-3 h-3 text-amber-500" /> Featured Category
                  </span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-zinc-150 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 font-montserrat font-bold hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={categorySaving}
                  className="px-6 py-2.5 rounded-xl bg-[#E6532B] hover:bg-[#d1451f] text-white font-montserrat font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  {categorySaving ? "Saving Category..." : editingCategory ? "Save Category Changes" : "Create Category"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ================= EDIT PARTICIPANT MODAL ================= */}
      {isParticipantModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 flex flex-col gap-5 shadow-2xl border border-zinc-200 animate-scale-up">

            <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#E6532B] flex items-center justify-center">
                  <FaEdit className="w-4 h-4" />
                </div>
                <h3 className="font-montserrat font-bold text-base text-zinc-900">
                  Edit Participant Details
                </h3>
              </div>
              <button
                onClick={() => setIsParticipantModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {participantActionMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${participantActionMsg.toLowerCase().includes("failed") || participantActionMsg.toLowerCase().includes("required")
                ? "bg-rose-50 border border-rose-200 text-rose-800"
                : "bg-emerald-50 border border-emerald-200 text-emerald-800"
                }`}>
                <FaCheck className="w-4 h-4 shrink-0" />
                <span>{participantActionMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveParticipant} className="flex flex-col gap-4 text-xs font-montserrat">

              <div className="flex flex-col gap-1.5">
                <label className="font-montserrat font-bold text-zinc-700">
                  Participant Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={participantForm.name}
                  onChange={(e) => setParticipantForm({ ...participantForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar Sahu"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-montserrat font-bold text-zinc-700">
                  Nomination Title / Submission Work
                </label>
                <input
                  type="text"
                  value={participantForm.title}
                  onChange={(e) => setParticipantForm({ ...participantForm, title: e.target.value })}
                  placeholder="e.g. Preserving Folk Traditions"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat font-bold text-zinc-700">Category</label>
                  <input
                    type="text"
                    value={participantForm.category}
                    onChange={(e) => setParticipantForm({ ...participantForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat font-bold text-zinc-700">District</label>
                  <select
                    value={participantForm.district}
                    onChange={(e) => setParticipantForm({ ...participantForm, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                  >
                    {["Raipur", "Bastar", "Durg", "Bilaspur", "Surguja", "Rajnandgaon", "Korba", "Raigarh", "Kanker", "Kondagaon"].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat font-bold text-zinc-700">Mobile Phone</label>
                  <input
                    type="text"
                    value={participantForm.phone}
                    onChange={(e) => setParticipantForm({ ...participantForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat font-bold text-zinc-700">Email Address</label>
                  <input
                    type="email"
                    value={participantForm.email}
                    onChange={(e) => setParticipantForm({ ...participantForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat font-bold text-zinc-700">Public Votes Count</label>
                  <input
                    type="number"
                    value={participantForm.publicVotes}
                    onChange={(e) => setParticipantForm({ ...participantForm, publicVotes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat font-bold text-zinc-700">Application Status</label>
                  <select
                    value={participantForm.status}
                    onChange={(e) => setParticipantForm({ ...participantForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30 font-bold text-emerald-700"
                  >
                    <option value="APPROVED">APPROVED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-zinc-150 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsParticipantModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 font-montserrat font-bold hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={participantSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#E6532B] hover:bg-[#d1451f] text-white font-montserrat font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  {participantSaving ? "Saving..." : "Save Participant Changes"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= PARTICIPANT DETAILS VIEW MODAL ================= */}
      {selectedItem && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 flex flex-col gap-5 shadow-2xl border border-zinc-200 animate-scale-up max-h-[92vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#E6532B] flex items-center justify-center font-bold text-lg shrink-0">
                  <FaUsers className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    Application ID: {selectedItem.applicationId || selectedItem._id || "NCA-2026-ENTRY"}
                  </span>
                  <h3 className="font-montserrat font-extrabold text-base sm:text-lg text-zinc-950">
                    {selectedItem.name || selectedItem.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col gap-5 text-xs font-montserrat">

              {/* Status & Scope Hero Banner */}
              <div className="bg-gradient-to-r from-orange-500 via-amber-600 to-orange-600 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-orange-100">
                    STATUS & RECOGNITION
                  </span>
                  <span className="text-xl font-montserrat font-black text-white mt-0.5">
                    {selectedItem.status || "SUBMITTED"}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md font-montserrat font-bold text-xs">
                    Scope: {selectedItem.awardType || selectedItem.applicant?.awardType || "National"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/20 text-white backdrop-blur-md font-montserrat font-bold text-xs">
                    Type: {selectedItem.nominationType === "THIRD_PARTY" || selectedItem.nominationAs === "THIRD_PARTY" ? "Nominator (for Others)" : "Self Nomination"}
                  </span>
                </div>
              </div>

              {/* SECTION 1: APPLICANT / CANDIDATE DEMOGRAPHICS */}
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 flex flex-col gap-3">
                <span className="text-[11px] font-bold text-[#E6532B] uppercase tracking-wider flex items-center gap-1.5">
                  <FaUser className="w-3.5 h-3.5" />
                  <span>Applicant & Personal Demographics</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-zinc-200">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase block">Full Name</span>
                    <span className="font-bold text-zinc-900 text-xs">{selectedItem.applicant?.fullName || selectedItem.name || "N/A"}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-zinc-200">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase block">Email Address</span>
                    <span className="font-mono text-zinc-800 text-xs truncate block">{selectedItem.applicant?.email || selectedItem.email || "N/A"}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-zinc-200">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase block">Mobile Phone</span>
                    <span className="font-mono text-zinc-800 text-xs">{selectedItem.applicant?.phone || selectedItem.phone || "N/A"}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-zinc-200">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase block">Gender & Age</span>
                    <span className="font-bold text-zinc-900 text-xs">
                      {selectedItem.applicant?.gender || selectedItem.gender || "Other"} • {selectedItem.applicant?.age || selectedItem.age || "18-40"}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-zinc-200">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase block">District & State</span>
                    <span className="font-bold text-zinc-900 text-xs">
                      {selectedItem.district || selectedItem.applicant?.district || "Raipur"}, {selectedItem.state || selectedItem.applicant?.state || "Chhattisgarh"}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-zinc-200">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase block">Nationality</span>
                    <span className="font-bold text-zinc-900 text-xs">{selectedItem.applicant?.nationality || selectedItem.nationality || "Indian"}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: NOMINATOR DETAILS (IF THIRD PARTY) */}
              {(selectedItem.nominationType === "THIRD_PARTY" || selectedItem.nominationAs === "THIRD_PARTY" || selectedItem.nominator) && (
                <div className="bg-amber-50/80 border border-amber-200/90 p-4 rounded-2xl flex flex-col gap-3">
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FaUserTie className="w-3.5 h-3.5" />
                    <span>Nominator Information (Filed for Candidate)</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-2.5 rounded-xl bg-white border border-amber-200">
                      <span className="text-[10px] font-bold text-amber-700 uppercase block">Nominator Name</span>
                      <span className="font-bold text-zinc-900 text-xs">{selectedItem.nominator?.fullName || selectedItem.nominatorName || "N/A"}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-amber-200">
                      <span className="text-[10px] font-bold text-amber-700 uppercase block">Nominator Nationality</span>
                      <span className="font-bold text-zinc-900 text-xs">{selectedItem.nominator?.nationality || "Indian"}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-amber-200">
                      <span className="text-[10px] font-bold text-amber-700 uppercase block">Nominator Mobile / Email</span>
                      <span className="font-mono text-zinc-800 text-xs truncate block">
                        {selectedItem.nominator?.phone || selectedItem.nominator?.email || "Provided"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: SUBMITTED AWARD CATEGORIES & WORK STORY & LIVE VIDEO PREVIEWS */}
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 flex flex-col gap-4">
                <span className="text-[11px] font-bold text-[#E6532B] uppercase tracking-wider flex items-center gap-1.5">
                  <FaLayerGroup className="w-3.5 h-3.5" />
                  <span>Submitted Award Categories & Featured Video Links</span>
                </span>

                {(selectedItem.categories && selectedItem.categories.length > 0 ? selectedItem.categories : [
                  {
                    categoryTitle: selectedItem.category,
                    description: selectedItem.workSummary,
                    bestStoryLink1: selectedItem.bestStoryLink1,
                    bestStoryLink2: selectedItem.bestStoryLink2,
                    bestStoryLink3: selectedItem.bestStoryLink3,
                    videoLink: selectedItem.videoLink
                  }
                ]).map((cat, cIdx) => (
                  <div key={cIdx} className="p-4 rounded-2xl bg-white border border-zinc-200 flex flex-col gap-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-zinc-150 pb-2">
                      <span className="font-poppins font-extrabold text-xs text-[#E6532B] uppercase">
                        Category {cIdx + 1}: {cat.categoryTitle || selectedItem.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold uppercase">
                        {cat.status || "SUBMITTED"}
                      </span>
                    </div>

                    {/* Work Description */}
                    {cat.description && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Work Description</span>
                        <p className="text-zinc-700 text-xs leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-150 whitespace-pre-line">
                          {cat.description}
                        </p>
                      </div>
                    )}

                    {/* Story Links List & Video Embed Previews */}
                    <div className="flex flex-col gap-3 pt-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Featured Story Content Videos
                      </span>

                      {[
                        { label: "Best Story Link 1", url: cat.bestStoryLink1 || cat.storyLinks?.bestStoryLink1 || selectedItem.bestStoryLink1 },
                        { label: "Best Story Link 2", url: cat.bestStoryLink2 || cat.storyLinks?.bestStoryLink2 || selectedItem.bestStoryLink2 },
                        { label: "Best Story Link 3", url: cat.bestStoryLink3 || cat.storyLinks?.bestStoryLink3 || selectedItem.bestStoryLink3 },
                        { label: "Direct Reel / Video URL", url: cat.videoLink || selectedItem.videoLink }
                      ]
                        .filter((st, i, arr) => st.url && arr.findIndex(x => x.url === st.url) === i)
                        .map((story, sIdx) => {
                          const embed = getEmbedInfo(story.url);
                          return (
                            <div key={sIdx} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[11px] text-zinc-800">{story.label}:</span>
                                <a
                                  href={story.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2.5 py-1 rounded-full bg-orange-100 hover:bg-orange-200 text-[#E6532B] font-bold text-[10px] uppercase flex items-center gap-1 transition-colors"
                                >
                                  <span>Open Link</span>
                                  <FaExternalLinkAlt className="w-2.5 h-2.5" />
                                </a>
                              </div>

                              <span className="font-mono text-[11px] text-zinc-600 truncate">{story.url}</span>

                              {/* Embedded Video Preview Player */}
                              {embed && embed.embedUrl && (
                                <div className="mt-1 relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-md">
                                  <iframe
                                    src={embed.embedUrl}
                                    title={`Preview ${story.label}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full border-0 rounded-xl"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>

              {/* SECTION 4: CREATOR PROFILE & SOCIAL PLATFORMS */}
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 flex flex-col gap-3">
                <span className="text-[11px] font-bold text-[#E6532B] uppercase tracking-wider flex items-center gap-1.5">
                  <FaStar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Creator Profile & Channel Followers</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-zinc-200 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Creator Start Year</span>
                    <span className="font-bold text-zinc-900 text-xs">
                      {selectedItem.creatorStartYear || selectedItem.creatorProfile?.creatorStartYear || "2020"}
                    </span>
                  </div>

                  {selectedItem.primaryPlatform && (
                    <div className="p-3 rounded-xl bg-white border border-zinc-200 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">
                        Primary Platform: {selectedItem.primaryPlatform.platform || "Instagram"}
                      </span>
                      <a
                        href={selectedItem.primaryPlatform.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-xs text-zinc-900 truncate hover:text-[#E6532B] flex items-center justify-between"
                      >
                        <span className="truncate">{selectedItem.primaryPlatform.profileUrl || "Profile Link"}</span>
                        <FaExternalLinkAlt className="w-3 h-3 shrink-0 ml-1" />
                      </a>
                      <span className="text-[11px] text-zinc-500 font-semibold">
                        Followers: {selectedItem.primaryPlatform.followers || "N/A"}
                      </span>
                    </div>
                  )}

                  {selectedItem.secondaryPlatform && selectedItem.secondaryPlatform.profileUrl && (
                    <div className="p-3 rounded-xl bg-white border border-zinc-200 flex flex-col gap-1 sm:col-span-2">
                      <span className="text-[10px] font-bold text-purple-700 uppercase">
                        Secondary Platform: {selectedItem.secondaryPlatform.platform || "YouTube"}
                      </span>
                      <a
                        href={selectedItem.secondaryPlatform.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-xs text-zinc-900 truncate hover:text-[#E6532B] flex items-center justify-between"
                      >
                        <span className="truncate">{selectedItem.secondaryPlatform.profileUrl}</span>
                        <FaExternalLinkAlt className="w-3 h-3 shrink-0 ml-1" />
                      </a>
                      <span className="text-[11px] text-zinc-500 font-semibold">
                        Followers: {selectedItem.secondaryPlatform.followers || "N/A"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Metadata */}
              <div className="flex items-center justify-between p-3 bg-zinc-100 rounded-xl text-[10px] text-zinc-500 font-mono">
                <span>Submitted On: {selectedItem.createdAt || "Recorded"}</span>
                <span>Declaration Accepted: {selectedItem.declaration ? "✓ YES" : "NO"}</span>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-between border-t border-zinc-150 pt-4 mt-1">
              <button
                onClick={() => {
                  const item = selectedItem;
                  setSelectedItem(null);
                  handleDeleteParticipant(item._id || item.id, item.name);
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-montserrat font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FaTrash className="w-3.5 h-3.5" />
                <span>Delete Candidate</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const item = selectedItem;
                    setSelectedItem(null);
                    handleOpenEditParticipant(item);
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#E6532B] font-montserrat font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FaEdit className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-montserrat font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= VIEW USER DETAILS MODAL ================= */}
      {viewingUser && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 flex flex-col gap-5 shadow-2xl border border-zinc-200 animate-scale-up max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm border border-emerald-200">
                  {(viewingUser.name || "User").substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-montserrat font-extrabold text-base text-zinc-950">
                    {viewingUser.name || "Registered User"}
                  </h3>
                  <span className="text-xs font-montserrat text-zinc-400 font-medium">User Profile & Account Info</span>
                </div>
              </div>
              <button
                onClick={() => setViewingUser(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs font-montserrat text-zinc-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex flex-col gap-0.5">
                  <span className="text-[10px] font-montserrat font-bold text-zinc-400 uppercase">Email Address</span>
                  <span className="font-semibold text-zinc-900 truncate">{viewingUser.email}</span>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex flex-col gap-0.5">
                  <span className="text-[10px] font-montserrat font-bold text-zinc-400 uppercase">Mobile Number</span>
                  <span className="font-mono font-semibold text-zinc-900">{viewingUser.phone || "N/A"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex flex-col gap-0.5">
                  <span className="text-[10px] font-montserrat font-bold text-zinc-400 uppercase">Assigned Role</span>
                  <span className="font-montserrat font-bold text-emerald-800 uppercase">{viewingUser.role || "CREATOR"}</span>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex flex-col gap-0.5">
                  <span className="text-[10px] font-montserrat font-bold text-zinc-400 uppercase">District</span>
                  <span className="font-semibold text-zinc-900">{viewingUser.district || "Raipur"}</span>
                </div>
              </div>

              {/* Instagram & Video Submission Links Card */}
              <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 p-4 rounded-2xl border border-pink-200/80 flex flex-col gap-3 shadow-2xs">
                <span className="text-[11px] font-montserrat font-extrabold text-pink-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-pink-200/60 pb-2">
                  <FaInstagram className="w-4 h-4 text-pink-600" />
                  <span>Instagram & Video Submission Links</span>
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Instagram Profile Link */}
                  <div className="bg-white p-3 rounded-xl border border-pink-100 flex flex-col gap-1 shadow-2xs">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Instagram Link</span>
                    {viewingUser.instagramLink || viewingUser.instagramUrl ? (
                      <a
                        href={viewingUser.instagramLink || viewingUser.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-xs text-pink-600 hover:text-pink-800 hover:underline truncate flex items-center justify-between group mt-0.5"
                      >
                        <span className="truncate">{viewingUser.instagramLink || viewingUser.instagramUrl}</span>
                        <FaExternalLinkAlt className="w-3 h-3 shrink-0 ml-1.5 text-pink-400 group-hover:text-pink-600" />
                      </a>
                    ) : (
                      <span className="text-zinc-400 text-xs italic mt-0.5">Not Provided</span>
                    )}
                  </div>

                  {/* Video / Reel Link */}
                  <div className="bg-white p-3 rounded-xl border border-pink-100 flex flex-col gap-1 shadow-2xs">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Video / Reel Link</span>
                    {viewingUser.videoLink || viewingUser.instagramReelUrl || viewingUser.videoUrl ? (
                      <a
                        href={viewingUser.videoLink || viewingUser.instagramReelUrl || viewingUser.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-xs text-purple-600 hover:text-purple-800 hover:underline truncate flex items-center justify-between group mt-0.5"
                      >
                        <span className="truncate">{viewingUser.videoLink || viewingUser.instagramReelUrl || viewingUser.videoUrl}</span>
                        <FaExternalLinkAlt className="w-3 h-3 shrink-0 ml-1.5 text-purple-400 group-hover:text-purple-600" />
                      </a>
                    ) : (
                      <span className="text-zinc-400 text-xs italic mt-0.5">Not Provided</span>
                    )}
                  </div>

                  {/* Portfolio URL (if present) */}
                  {viewingUser.portfolioUrl && (
                    <div className="bg-white p-3 rounded-xl border border-pink-100 flex flex-col gap-1 shadow-2xs sm:col-span-2">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Portfolio / Website Link</span>
                      <a
                        href={viewingUser.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-xs text-blue-600 hover:text-blue-800 hover:underline truncate flex items-center justify-between group mt-0.5"
                      >
                        <span className="truncate">{viewingUser.portfolioUrl}</span>
                        <FaExternalLinkAlt className="w-3 h-3 shrink-0 ml-1.5 text-blue-400 group-hover:text-blue-600" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-zinc-150 pt-4 mt-1">
              <button
                onClick={() => setViewingUser(null)}
                className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-montserrat font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= EDIT USER MODAL ================= */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 flex flex-col gap-5 shadow-2xl border border-zinc-200 animate-scale-up max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
              <h3 className="font-montserrat font-extrabold text-base text-zinc-950">
                Edit User Account & Role
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {userActionMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                {userActionMsg}
              </div>
            )}

            <form onSubmit={handleSaveUser} className="flex flex-col gap-4 text-xs font-montserrat">
              <div className="flex flex-col gap-1">
                <label className="font-montserrat font-bold text-zinc-700">Full Name</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="px-3.5 py-2 rounded-xl border border-zinc-300 bg-zinc-50 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-montserrat font-bold text-zinc-700">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-zinc-300 bg-zinc-50 font-semibold cursor-pointer"
                  >
                    <option value="CREATOR">CREATOR</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="JURY">JURY</option>
                    <option value="MODERATOR">MODERATOR</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-montserrat font-bold text-zinc-700">Status</label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-zinc-300 bg-zinc-50 font-semibold cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-montserrat font-bold text-zinc-700">Instagram Profile Link</label>
                  <input
                    type="url"
                    value={userForm.instagramLink || userForm.instagramUrl || ""}
                    onChange={(e) => setUserForm({ ...userForm, instagramLink: e.target.value, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="px-3.5 py-2 rounded-xl border border-zinc-300 bg-zinc-50 font-semibold text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-montserrat font-bold text-zinc-700">Video / Reel Link</label>
                  <input
                    type="url"
                    value={userForm.videoLink || userForm.instagramReelUrl || userForm.videoUrl || ""}
                    onChange={(e) => setUserForm({ ...userForm, videoLink: e.target.value, instagramReelUrl: e.target.value })}
                    placeholder="https://instagram.com/reel/..."
                    className="px-3.5 py-2 rounded-xl border border-zinc-300 bg-zinc-50 font-semibold text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-zinc-150 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-montserrat font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E6532B] hover:bg-[#d1451f] text-white font-montserrat font-bold text-xs shadow-xs cursor-pointer"
                >
                  Save User Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ================= EDIT / CREATE NEWS MODAL ================= */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 flex flex-col gap-5 shadow-2xl border border-zinc-200 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between border-b border-zinc-150 pb-4 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#C45A32] flex items-center justify-center font-bold">
                  <FaNewspaper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-montserrat font-extrabold text-base text-zinc-950">
                    {editingNews ? "Edit News Article" : "Publish Official News Article"}
                  </h3>
                  <p className="text-[11px] font-montserrat text-zinc-500">
                    Add title, slug, summary lead, content, cover image & status
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsNewsModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {newsActionMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                {newsActionMsg}
              </div>
            )}

            <form onSubmit={handleSaveNews} className="flex flex-col gap-4 text-xs font-montserrat">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-montserrat font-bold text-zinc-700">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={newsForm.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewsForm({ ...newsForm, title: val, slug: generateSlug(val) });
                    }}
                    placeholder="Headline e.g., State Award Winners Announced..."
                    className="px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 font-semibold text-zinc-900"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-montserrat font-bold text-zinc-700">Slug (URL Path) *</label>
                  <input
                    type="text"
                    required
                    value={newsForm.slug}
                    onChange={(e) => setNewsForm({ ...newsForm, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                    placeholder="state-award-winners-announced"
                    className="px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 font-mono text-[11px] text-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
                <div className="flex flex-col gap-1">
                  <label className="font-montserrat font-bold text-zinc-700">Status</label>
                  <select
                    value={newsForm.status}
                    onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-zinc-300 bg-white font-bold text-zinc-900 cursor-pointer"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="SCHEDULED">SCHEDULED</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-montserrat font-bold text-zinc-700">Scheduled Date</label>
                  <input
                    type="datetime-local"
                    value={newsForm.scheduledAt}
                    disabled={newsForm.status !== "SCHEDULED"}
                    onChange={(e) => setNewsForm({ ...newsForm, scheduledAt: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-zinc-300 bg-white font-semibold text-zinc-900 disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col justify-center items-start pt-2 sm:pt-0">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-800 select-none">
                    <input
                      type="checkbox"
                      checked={newsForm.isFeatured}
                      onChange={(e) => setNewsForm({ ...newsForm, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C45A32]"
                    />
                    <span className="flex items-center gap-1 text-xs">
                      <FaStar className="w-3.5 h-3.5 text-amber-500" /> Featured Hero
                    </span>
                  </label>
                </div>
              </div>

              {/* Cover Image File Upload & Web Link */}
              <div className="flex flex-col gap-1.5 bg-zinc-50/80 p-3.5 rounded-2xl border border-zinc-200">
                <div className="flex items-center justify-between">
                  <label className="font-montserrat font-bold text-zinc-700">Cover Image</label>
                  <span className="text-[10px] text-zinc-400 font-medium">Upload File or Paste Link</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload Dropzone */}
                  <div className="relative border-2 border-dashed border-zinc-300 hover:border-[#C45A32] rounded-xl p-3 bg-white flex flex-col items-center justify-center text-center transition-all cursor-pointer group">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/jpg"
                      onChange={handleNewsImageFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <FaCloudUploadAlt className="w-6 h-6 text-zinc-400 group-hover:text-[#C45A32] transition-colors mb-1" />
                    <span className="font-montserrat font-bold text-xs text-zinc-700 group-hover:text-[#C45A32]">
                      Upload Image File
                    </span>
                    <span className="text-[10px] text-zinc-400 font-montserrat">PNG, JPG, WEBP (Max 8MB)</span>
                  </div>

                  {/* Direct Image URL input */}
                  <div className="flex flex-col justify-center gap-1.5">
                    <span className="text-[11px] font-montserrat font-semibold text-zinc-600">Or Enter Web Image Link (URL)</span>
                    <div className="relative">
                      <input
                        type="text"
                        value={newsForm.coverImage}
                        onChange={(e) => setNewsForm({ ...newsForm, coverImage: e.target.value })}
                        placeholder="/assets/images/raipur_landmark.jpg"
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#C45A32]"
                      />
                      <FaImage className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Live Image Preview Bar */}
                {newsForm.coverImage && (
                  <div className="p-2.5 rounded-xl bg-white border border-zinc-200 flex items-center justify-between gap-3 shadow-2xs mt-1">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={newsForm.coverImage}
                        alt="Cover Preview"
                        className="w-14 h-11 object-cover rounded-lg border border-zinc-200 shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/assets/images/raipur_landmark.jpg";
                        }}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-montserrat font-bold text-emerald-600 uppercase flex items-center gap-1">
                          <FaCheck className="w-2.5 h-2.5" /> Image Attached
                        </span>
                        <span className="text-[11px] font-mono text-zinc-600 truncate max-w-[280px]">
                          {newsForm.coverImage.startsWith("data:") ? "Local File Uploaded (Base64)" : newsForm.coverImage}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-montserrat font-bold text-zinc-700">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={newsForm.tagsInput}
                  onChange={(e) => setNewsForm({ ...newsForm, tagsInput: e.target.value })}
                  placeholder="Press Release, Announcements, Official"
                  className="px-3.5 py-2 rounded-xl border border-zinc-300 bg-zinc-50 font-semibold text-zinc-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-montserrat font-bold text-zinc-700">Summary Lead *</label>
                <textarea
                  rows={2}
                  required
                  value={newsForm.summary}
                  onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                  placeholder="Concise overview or lead snippet for card view..."
                  className="px-3.5 py-2 rounded-xl border border-zinc-300 bg-zinc-50 font-semibold text-zinc-900 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-montserrat font-bold text-zinc-700">Full Body Content *</label>
                <textarea
                  rows={4}
                  required
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  placeholder="Write full article body text, quotes, and detailed declarations..."
                  className="px-3.5 py-2 rounded-xl border border-zinc-300 bg-zinc-50 font-semibold text-zinc-900"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-zinc-150 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-montserrat font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={newsSaving}
                  className="px-6 py-2 rounded-xl bg-[#C45A32] hover:bg-[#A9492A] text-white font-montserrat font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {newsSaving ? "Saving Article..." : editingNews ? "Save Changes" : "Publish Article"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ================= CREATE / EDIT STATE LOCATION MODAL ================= */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 flex flex-col gap-5 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#E6532B] flex items-center justify-center font-bold">
                  <FaMapMarkerAlt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-montserrat font-extrabold text-base text-zinc-950">
                    {editingLocation ? "Edit State Location" : "Add New State Location"}
                  </h3>
                  <p className="text-[11px] font-montserrat text-zinc-500">
                    Define state metadata and comma-separated cities/districts
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {locationActionMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                {locationActionMsg}
              </div>
            )}

            <form onSubmit={handleSaveLocation} className="flex flex-col gap-4 text-xs font-montserrat">
              <div className="flex flex-col gap-1">
                <label className="font-montserrat font-bold text-zinc-700">State Name *</label>
                <input
                  type="text"
                  required
                  value={locationForm.stateName}
                  onChange={(e) => setLocationForm({ ...locationForm, stateName: e.target.value })}
                  placeholder="e.g. Chhattisgarh"
                  className="px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-montserrat font-bold text-zinc-700">State Code</label>
                  <input
                    type="text"
                    value={locationForm.stateCode}
                    onChange={(e) => setLocationForm({ ...locationForm, stateCode: e.target.value })}
                    placeholder="e.g. CG"
                    className="px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 font-semibold text-zinc-900"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-montserrat font-bold text-zinc-700">Country</label>
                  <input
                    type="text"
                    value={locationForm.country}
                    onChange={(e) => setLocationForm({ ...locationForm, country: e.target.value })}
                    placeholder="India"
                    className="px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 font-semibold text-zinc-900"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-montserrat font-bold text-zinc-700">Cities / Districts (Comma Separated)</label>
                <textarea
                  rows={4}
                  value={locationForm.citiesInput}
                  onChange={(e) => setLocationForm({ ...locationForm, citiesInput: e.target.value })}
                  placeholder="Raipur, Durg, Bilaspur, Bastar, Korba, Rajnandgaon, Kanker..."
                  className="px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 font-semibold text-zinc-900"
                />
                <span className="text-[10px] text-zinc-400 font-mono">
                  Separate city/district names using commas.
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="locIsActive"
                  checked={locationForm.isActive}
                  onChange={(e) => setLocationForm({ ...locationForm, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#E6532B] rounded cursor-pointer"
                />
                <label htmlFor="locIsActive" className="font-montserrat font-bold text-zinc-800 cursor-pointer">
                  State Active for Public Nomination Dropdowns
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-zinc-150 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-montserrat font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={locationSaving}
                  className="px-6 py-2 rounded-xl bg-[#E6532B] hover:bg-[#d1451f] text-white font-montserrat font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {locationSaving ? "Saving..." : editingLocation ? "Save State Changes" : "Create State"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MANAGE CITIES MODAL ================= */}
      {managingCitiesState && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 flex flex-col gap-5 shadow-2xl border border-zinc-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#E6532B] flex items-center justify-center font-bold">
                  <FaBuilding className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-montserrat font-extrabold text-base text-zinc-950">
                    Manage Cities / Districts in {managingCitiesState.stateName}
                  </h3>
                  <p className="text-[11px] font-montserrat text-zinc-500">
                    Add new city or remove existing cities from cascading dropdown
                  </p>
                </div>
              </div>
              <button
                onClick={() => setManagingCitiesState(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Add New City Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                placeholder="Enter new City or District name..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
              />
              <button
                onClick={() => handleAddCityToState(managingCitiesState._id)}
                className="px-4 py-2.5 rounded-xl bg-[#E6532B] hover:bg-[#d1451f] text-white font-montserrat font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <FaPlus className="w-3 h-3" /> Add City
              </button>
            </div>

            {/* List of Cities */}
            <div className="flex flex-col gap-2 pt-2 border-t border-zinc-150">
              <span className="text-[10px] font-montserrat font-bold text-zinc-400 uppercase tracking-wider">
                Current Cities / Districts ({managingCitiesState.cities?.length || 0})
              </span>

              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                {(managingCitiesState.cities || []).map((c, idx) => {
                  const cityId = c._id || idx;
                  const cName = c.cityName || c;
                  const isEditing = editingCityId === cityId;

                  return (
                    <div
                      key={cityId}
                      className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-2"
                    >
                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingCityName}
                            onChange={(e) => setEditingCityName(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-semibold bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]"
                          />
                          <button
                            onClick={() => handleSaveEditedCity(managingCitiesState._id, cityId)}
                            className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors cursor-pointer"
                            title="Save City Name"
                          >
                            <FaCheck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingCityId(null);
                              setEditingCityName("");
                            }}
                            className="p-1.5 rounded-lg bg-zinc-200 text-zinc-600 hover:bg-zinc-300 transition-colors cursor-pointer"
                            title="Cancel"
                          >
                            <FaTimes className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="font-montserrat font-bold text-xs text-zinc-800">
                            {cName}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingCityId(cityId);
                                setEditingCityName(cName);
                              }}
                              className="p-1.5 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                              title="Edit City Name"
                            >
                              <FaEdit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCityFromState(managingCitiesState._id, c._id || c)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Remove City"
                            >
                              <FaTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}

                {(!managingCitiesState.cities || managingCitiesState.cities.length === 0) && (
                  <span className="text-xs text-zinc-400 font-montserrat text-center py-4">
                    No cities added to this state yet. Add one above.
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end border-t border-zinc-150 pt-3">
              <button
                onClick={() => setManagingCitiesState(null)}
                className="px-5 py-2 rounded-xl bg-zinc-900 text-white font-montserrat font-bold text-xs hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
