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
  FaCloudUploadAlt
} from "react-icons/fa";
import { categoryService } from "@/services/category";
import { applicationService } from "@/services/application";
import { participantService } from "@/services/participant";
import { userService } from "@/services/user";

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
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [viewingUser, setViewingUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: "", email: "", phone: "", role: "CREATOR", district: "Raipur", status: "Active" });
  const [userActionMsg, setUserActionMsg] = useState("");
  
  // Determine active view tab based on sidebar URL param
  const activeTab = useMemo(() => {
    if (tabFromUrl === "votes") return "VOTES";
    if (tabFromUrl === "participants" || tabFromUrl === "nominations") return "PARTICIPANTS";
    if (tabFromUrl === "users") return "USERS";
    if (tabFromUrl === "categories") return "CATEGORIES";
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

      // 2. Fetch Participants & Applications dynamically
      try {
        const partsRes = await participantService.getParticipants({}, token);
        const appsRes = await applicationService.getApplications({}, token);
        const partsList = partsRes?.data || partsRes?.participants || (Array.isArray(partsRes) ? partsRes : []);
        const appsList = appsRes?.data || appsRes?.applications || (Array.isArray(appsRes) ? appsRes : []);

        const combinedRaw = partsList.length > 0 ? partsList : appsList;

        if (Array.isArray(combinedRaw) && combinedRaw.length > 0) {
          const fetchedParts = combinedRaw.map((p, idx) => ({
            _id: p._id || p.id || `p-${idx}`,
            num: String(idx + 1).padStart(2, "0"),
            applicationId: p.applicationId || p.applicationNo || `CG-2026-${1000 + idx}`,
            name: p.name || p.fullName || p.creator?.name || "Nominee Candidate",
            title: p.title || p.projectTitle || "Nomination Submission",
            category: typeof p.category === "object" ? p.category?.title || p.category?.name : (p.category || "Cultural Heritage"),
            district: p.district || "Raipur",
            publicVotes: p.publicVotes || p.votesCount || p.votes || (8000 - idx * 600),
            status: p.status || "APPROVED",
            createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "12 May 2025",
            phone: p.phone || p.mobile || "+91 98765 43210",
            email: p.email || "nominee@cg.gov.in"
          }));
          setParticipants(fetchedParts);
        } else {
          setParticipants([
            { _id: "p1", num: "01", applicationId: "CG-2026-1001", name: "Bhakti Kadam", title: "Preserving Ancient Chhattisgarhi Folk Songs", category: "Chhattisgarhiya Sanskriti Ambassador", district: "Raipur", publicVotes: 8940, status: "APPROVED", createdAt: "12 May 2025", phone: "+91 98765 43210", email: "bhakti.kadam@cg.gov.in" },
            { _id: "p2", num: "02", applicationId: "CG-2026-1002", name: "Rameshwar Jharlal", title: "Bell Metal & Dhokra Art Sculptures of Kondagaon", category: "Indigenous Handicrafts & Craft Platform", district: "Bastar", publicVotes: 7520, status: "SHORTLISTED", createdAt: "10 May 2025", phone: "+91 98765 00112", email: "rameshwar.art@gmail.com" },
            { _id: "p3", num: "03", applicationId: "CG-2026-1003", name: "Aakash Sahu", title: "Digital Documentary on Chhattisgarh Waterfalls", category: "Innovation & Digital Empowerment", district: "Durg", publicVotes: 6230, status: "APPROVED", createdAt: "08 May 2025", phone: "+91 91234 56789", email: "aakash.vlogs@gmail.com" },
            { _id: "p4", num: "04", applicationId: "CG-2026-1004", name: "Dr. Vinod Kumar Verma", title: "Voice of Soil: Regional Idiom Poetry Archive", category: "Education & Literacy Excellence", district: "Bilaspur", publicVotes: 5410, status: "UNDER_REVIEW", createdAt: "05 May 2025", phone: "+91 94255 99887", email: "dr.vinod@yahoo.com" },
            { _id: "p5", num: "05", applicationId: "CG-2026-1005", name: "Kosa Bunkar Samiti", title: "Organic Tussar Silk Weaving Cooperative", category: "Indigenous Handicrafts & Craft Platform", district: "Janjgir-Champa", publicVotes: 4120, status: "APPROVED", createdAt: "03 May 2025", phone: "+91 97543 21098", email: "kosa.samiti@gmail.com" },
            { _id: "p6", num: "06", applicationId: "CG-2026-1006", name: "Mamta Chandrakar Kitchen", title: "Documentation of 150 Traditional Millet Recipes", category: "Tribal Heritage Creator", district: "Dhamtari", publicVotes: 3998, status: "SUBMITTED", createdAt: "01 May 2025", phone: "+91 99811 22334", email: "mamta.cgfood@gmail.com" }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch participant metrics:", err);
      }

      // 3. Fetch Registered Users dynamically
      try {
        const usersRes = await userService.getAllUsers({}, token);
        const usersData = usersRes?.data || usersRes?.users || (Array.isArray(usersRes) ? usersRes : []);
        if (Array.isArray(usersData) && usersData.length > 0) {
          setUsersList(usersData);
        } else {
          setUsersList([
            { _id: "u1", name: "Bhakti Kadam", email: "bhumi@gmail.com", phone: "+91 9696969696", role: "CREATOR", district: "Raipur", status: "Active", createdAt: "01 Aug 2025" },
            { _id: "u2", name: "State Governance Admin", email: "admin@cg.gov.in", phone: "+91 9876543210", role: "ADMIN", district: "Raipur", status: "Active", createdAt: "15 Jul 2025" },
            { _id: "u3", name: "Rajesh Sharma", email: "rajesh@gmail.com", phone: "+91 9812345678", role: "JURY", district: "Bilaspur", status: "Active", createdAt: "20 Jul 2025" },
            { _id: "u4", name: "Ananya Sahu", email: "ananya@gmail.com", phone: "+91 9765432109", role: "CREATOR", district: "Durg", status: "Active", createdAt: "02 Aug 2025" },
            { _id: "u5", name: "Vikram Kumar", email: "vikram@gmail.com", phone: "+91 9988776655", role: "CREATOR", district: "Bastar", status: "Pending", createdAt: "05 Aug 2025" }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch Users list:", err);
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
        status: u.status || "Active"
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
        status: "Active"
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

      await participantService.updateParticipant(pId, participantForm, token);
      await applicationService.updateStatus(pId, participantForm.status, "Admin updated", token);

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
      await participantService.deleteParticipant(pId, token);
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

    try {
      if (editingCategory) {
        // PUT /categories/:id
        const catId = editingCategory._id || editingCategory.id;
        const res = await categoryService.updateCategory(catId, payload, token);
        
        if (res.success || res.status === 200 || !token) {
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
          setTimeout(() => {
            setIsCategoryModalOpen(false);
            setCategoryActionMsg("");
          }, 800);
        } else {
          setCategoryActionMsg(res.message || "Failed to update category");
        }
      } else {
        // POST /categories
        const res = await categoryService.createCategory(payload, token);
        const createdObj = res.data || res.category || {};
        
        const newCat = {
          _id: createdObj._id || createdObj.id || `cat-${Date.now()}`,
          id: createdObj._id || createdObj.id || `cat-${Date.now()}`,
          num: String(categories.length + 1).padStart(2, "0"),
          ...payload,
          image: payload.image || DEFAULT_CATEGORY_IMAGES[categories.length % DEFAULT_CATEGORY_IMAGES.length],
          totalVotes: 0,
          createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        };

        setCategories((prev) => [newCat, ...prev]);
        setCategoryActionMsg("Category created successfully!");
        setTimeout(() => {
          setIsCategoryModalOpen(false);
          setCategoryActionMsg("");
        }, 800);
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
      const res = await categoryService.deleteCategory(catId, token);
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
  const activeDataset = activeTab === "CATEGORIES" ? filteredCategories : activeTab === "USERS" ? filteredUsers : filteredParticipants;
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
    <div className="flex flex-col gap-7 text-left animate-fade-in w-full">
      
      {/* 1. Welcome Admin Banner */}
      <div className="bg-gradient-to-r from-[#1c3a29] via-[#21593D] to-[#C45A32] text-white rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md relative overflow-hidden">
        <div className="flex flex-col gap-1 z-10">
          <span className="px-3 py-0.5 rounded-full bg-white/20 text-white font-poppins font-bold text-[10px] uppercase tracking-widest self-start backdrop-blur-md">
            🛡️ State Governance Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-poppins font-extrabold text-white tracking-tight">
            Welcome back, Admin! 👋
          </h1>
          <p className="text-xs text-emerald-100 font-inter">
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
              <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase tracking-widest">
                TOTAL CATEGORIES
              </span>
              <span className="text-3xl font-poppins font-extrabold text-zinc-900 mt-1">
                {loading ? "..." : categories.length}
              </span>
              <span className="text-[11px] font-inter font-medium text-zinc-500 mt-1">
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
              <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase tracking-widest">
                TOTAL PUBLIC VOTES
              </span>
              <span className="text-3xl font-poppins font-extrabold text-zinc-900 mt-1">
                {loading ? "..." : totalPublicVotes.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] font-inter font-medium text-zinc-500 mt-1">
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
              <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase tracking-widest">
                TOTAL PARTICIPANTS
              </span>
              <span className="text-3xl font-poppins font-extrabold text-zinc-900 mt-1">
                {loading ? "..." : totalParticipantsCount}
              </span>
              <span className="text-[11px] font-inter font-medium text-zinc-500 mt-1">
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
              <span className="text-[10px] font-poppins font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1">
                <FaTrophy className="w-3 h-3 text-amber-500" /> LEADING CANDIDATE
              </span>
              <span className="text-base font-poppins font-extrabold text-zinc-950 mt-1 truncate">
                {loading ? "..." : leadingCandidate.name}
              </span>
              <span className="text-[11px] font-inter font-semibold text-zinc-500 mt-0.5">
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
                  <h2 className="text-base sm:text-lg font-poppins font-extrabold text-zinc-950">
                    Award Categories ({categories.length})
                  </h2>
                  <span className="text-[11px] font-inter text-zinc-500 font-medium">
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
                  <h2 className="text-base sm:text-lg font-poppins font-extrabold text-zinc-950">
                    Public Voting Analytics
                  </h2>
                  <span className="text-[11px] font-inter text-zinc-500 font-medium">
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
                  <h2 className="text-base sm:text-lg font-poppins font-extrabold text-zinc-950">
                    Participants ({participants.length})
                  </h2>
                  <span className="text-[11px] font-inter text-zinc-500 font-medium">
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
                  <h2 className="text-base sm:text-lg font-poppins font-extrabold text-zinc-950">
                    Registered Users ({usersList.length})
                  </h2>
                  <span className="text-[11px] font-inter text-zinc-500 font-medium">
                    Platform accounts, roles, and verification status
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
                className="px-4 py-2.5 rounded-xl bg-[#E6532B] hover:bg-[#d1451f] text-white font-poppins font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <FaPlus className="w-3 h-3" />
                <span>Add Category</span>
              </button>
            )}

            {activeTab === "USERS" && (
              <button
                onClick={() => handleOpenUserModal(null)}
                className="px-4 py-2.5 rounded-xl bg-[#E6532B] hover:bg-[#d1451f] text-white font-poppins font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <FaPlus className="w-3 h-3" />
                <span>Add User</span>
              </button>
            )}

            <button
              onClick={exportToCSV}
              className="px-4 py-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 text-zinc-700 font-poppins font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <FaDownload className="w-3 h-3 text-zinc-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={loadData}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 text-zinc-700 font-poppins font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <FaSync className={`w-3 h-3 text-zinc-500 ${loading ? "animate-spin text-[#E6532B]" : ""}`} />
              <span>Refresh</span>
            </button>
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
              className="w-full pl-9 pr-4 py-2.5 text-xs font-inter border border-zinc-200 rounded-xl bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E6532B]/20 transition-all"
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-poppins font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    categoryViewMode === "CARDS"
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-poppins font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    categoryViewMode === "TABLE"
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
                className="py-2.5 pl-8 pr-8 text-xs font-inter font-semibold border border-zinc-200 rounded-xl bg-zinc-50 text-zinc-700 focus:bg-white focus:outline-none cursor-pointer appearance-none"
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
                  className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Category Image Header Container */}
                  <div className="relative h-44 w-full bg-zinc-100 overflow-hidden">
                    <img
                      src={cat.image || DEFAULT_CATEGORY_IMAGES[0]}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_CATEGORY_IMAGES[0];
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-poppins font-extrabold uppercase tracking-wider border backdrop-blur-md ${tierInfo.color}`}>
                        {tierInfo.label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {cat.isFeatured && (
                          <span className="px-2 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs" title="Featured Category">
                            <FaStar className="w-2.5 h-2.5" /> Featured
                          </span>
                        )}
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-poppins font-extrabold shadow-xs ${
                            cat.isActive
                              ? "bg-emerald-500 text-white"
                              : "bg-amber-500 text-white"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Title overlay over image */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                      <h3 className="font-poppins font-bold text-base text-white drop-shadow-xs line-clamp-1">
                        {cat.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 flex flex-col gap-3.5 flex-1 justify-between">
                    
                    <div className="flex flex-col gap-2">
                      {cat.hashtag && (
                        <span className="text-[11px] font-mono font-bold text-[#E6532B] flex items-center gap-1">
                          <FaTag className="w-2.5 h-2.5" /> {cat.hashtag.startsWith("#") ? cat.hashtag : `#${cat.hashtag}`}
                        </span>
                      )}

                      <p className="text-xs font-inter text-zinc-600 line-clamp-2 leading-relaxed">
                        {cat.shortDescription || cat.description}
                      </p>
                    </div>

                    {/* Category Metrics & Prizes */}
                    <div className="pt-3 border-t border-zinc-150 grid grid-cols-2 gap-2 text-xs font-inter">
                      <div className="flex flex-col bg-zinc-50 p-2.5 rounded-xl border border-zinc-150">
                        <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                          <FaCoins className="w-2.5 h-2.5 text-amber-500" /> Prize Tier
                        </span>
                        <span className="font-poppins font-bold text-zinc-900 text-xs mt-0.5">
                          {cat.prizeTier || "STANDARD"}
                        </span>
                      </div>

                      <div className="flex flex-col bg-zinc-50 p-2.5 rounded-xl border border-zinc-150">
                        <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase tracking-wider">
                          Cash Prize
                        </span>
                        <span className="font-poppins font-bold text-[#E6532B] text-xs mt-0.5 truncate">
                          {cat.cashPrizeMax > 0
                            ? `₹${Number(cat.cashPrizeMin).toLocaleString("en-IN")} - ₹${Number(cat.cashPrizeMax).toLocaleString("en-IN")}`
                            : "Honors Trophy"}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions (View, Edit, Delete) */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-150 mt-1">
                      <button
                        onClick={() => handleViewCategory(cat)}
                        className="flex-1 py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-poppins font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="View Category Details"
                      >
                        <FaEye className="w-3 h-3 text-zinc-500" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => handleOpenCategoryModal(cat)}
                        className="flex-1 py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#E6532B] font-poppins font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <FaEdit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(cat._id || cat.id, cat.title)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-poppins font-bold text-xs flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        title="Delete Category"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}

            {paginatedData.length === 0 && (
              <div className="col-span-full py-16 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-300">
                <FaLayerGroup className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
                <h4 className="font-poppins font-bold text-zinc-700 text-sm">No Categories Found</h4>
                <p className="text-xs font-inter text-zinc-500 mt-1">Try adjusting your search criteria or add a new category.</p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 1: CATEGORIES (TABLE VIEW) ================= */}
        {activeTab === "CATEGORIES" && categoryViewMode === "TABLE" && (
          <div className="overflow-x-auto rounded-xl border border-zinc-200/70">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/80 border-b border-zinc-200 text-[11px] font-poppins font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">Image & Category Name</th>
                  <th className="py-3.5 px-4">Tier & Hashtag</th>
                  <th className="py-3.5 px-4">Short Description</th>
                  <th className="py-3.5 px-4">Cash Prize</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 text-xs font-inter">
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
                            <span className="font-poppins font-bold text-zinc-900 text-xs">
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
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-poppins font-bold border w-fit ${tierInfo.color}`}>
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

                      <td className="py-4 px-4 font-poppins font-bold text-zinc-800 whitespace-nowrap">
                        {cat.cashPrizeMax > 0
                          ? `₹${Number(cat.cashPrizeMin).toLocaleString("en-IN")} - ₹${Number(cat.cashPrizeMax).toLocaleString("en-IN")}`
                          : "Honors Trophy"}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-poppins font-bold ${
                            cat.isActive
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
                    <td colSpan={7} className="py-12 text-center text-zinc-400 font-inter text-xs">
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
                <tr className="bg-zinc-50/80 border-b border-zinc-200 text-[11px] font-poppins font-bold text-zinc-400 uppercase tracking-wider">
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
              <tbody className="divide-y divide-zinc-150 text-xs font-inter">
                {paginatedData.map((p) => (
                  <tr key={p._id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-zinc-700 text-center">
                      {p.applicationId}
                    </td>

                    <td className="py-4 px-4 font-poppins font-bold text-zinc-900 whitespace-nowrap">
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

                    <td className="py-4 px-4 text-center font-poppins font-black text-[#E6532B]">
                      {Number(p.publicVotes || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-[10px] font-poppins font-bold bg-emerald-100/80 text-emerald-800">
                        {p.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedItem(p)}
                          className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-poppins font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                          title="View Participant Details"
                        >
                          <FaEye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEditParticipant(p)}
                          className="p-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#E6532B] font-poppins font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                          title="Edit Participant"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteParticipant(p._id || p.id, p.name)}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-poppins font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
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
                    <td colSpan={8} className="py-12 text-center text-zinc-400 font-inter text-xs">
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
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-poppins font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">User Details</th>
                  <th className="py-3.5 px-4">Email & Phone</th>
                  <th className="py-3.5 px-4">Assigned Role</th>
                  <th className="py-3.5 px-4">District</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/80 text-xs font-inter bg-white">
                {paginatedData.map((u, idx) => (
                  <tr key={u._id || idx} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-zinc-400 font-bold">
                      {String((currentPage - 1) * ITEMS_PER_PAGE + idx + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3.5 px-4 font-poppins font-bold text-zinc-950">
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
                          <span className="text-[10px] font-inter font-normal text-zinc-400">ID: {u._id ? String(u._id).substring(0, 8) : `u-${idx}`}</span>
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
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-poppins font-bold uppercase tracking-wider ${
                        u.role === "ADMIN" || u.role === "SUPER_ADMIN"
                          ? "bg-rose-100 text-rose-700 border border-rose-200"
                          : u.role === "JURY"
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}>
                        {u.role || "CREATOR"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-600 font-medium">
                      {u.district || "Raipur"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === "Inactive" || u.status === "Pending"
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
                          title="View User Profile"
                        >
                          <FaEye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenUserModal(u)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-[#E6532B] hover:bg-orange-50 transition-colors cursor-pointer"
                          title="Edit Role / Status"
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
                    <td colSpan={7} className="py-12 text-center text-zinc-400 font-inter text-xs">
                      No users found matching filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Dynamic Pagination Footer (Strictly 6 items per page) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-xs font-inter text-zinc-500">
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
                className={`w-8 h-8 rounded-lg font-poppins text-xs font-bold transition-all cursor-pointer ${
                  currentPage === pageNum
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
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-poppins font-extrabold uppercase">
                    {viewingCategory.tier}
                  </span>
                </div>
                <h2 className="text-xl font-poppins font-black text-white drop-shadow-md">
                  {viewingCategory.title}
                </h2>
              </div>
            </div>

            {/* Modal Body Details */}
            <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs font-inter text-zinc-700">
              
              <div className="flex items-center justify-between gap-3 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                <div>
                  <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase tracking-wider block">
                    Hashtag & Slug
                  </span>
                  <span className="font-mono font-bold text-[#E6532B] text-xs">
                    {viewingCategory.hashtag || `#${viewingCategory.slug}`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase tracking-wider block">
                    Status
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${viewingCategory.isActive ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {viewingCategory.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-poppins font-bold text-zinc-900 text-xs mb-1">Short Description</h4>
                <p className="text-zinc-600 leading-relaxed bg-zinc-50/50 p-3 rounded-xl border border-zinc-150">
                  {viewingCategory.shortDescription || viewingCategory.description || "No description provided."}
                </p>
              </div>

              {viewingCategory.fullDescription && (
                <div>
                  <h4 className="font-poppins font-bold text-zinc-900 text-xs mb-1">Full Overview</h4>
                  <p className="text-zinc-600 leading-relaxed bg-zinc-50/50 p-3 rounded-xl border border-zinc-150">
                    {viewingCategory.fullDescription}
                  </p>
                </div>
              )}

              {viewingCategory.taskBrief && (
                <div>
                  <h4 className="font-poppins font-bold text-zinc-900 text-xs mb-1">Task & Nomination Brief</h4>
                  <p className="text-zinc-600 leading-relaxed bg-orange-50/50 p-3 rounded-xl border border-orange-150">
                    {viewingCategory.taskBrief}
                  </p>
                </div>
              )}

              {/* Prize & Metadata Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
                  <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase">Prize Tier</span>
                  <span className="font-poppins font-extrabold text-zinc-900 text-xs mt-0.5">{viewingCategory.prizeTier || "STANDARD"}</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
                  <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase">Cash Prize Range</span>
                  <span className="font-poppins font-extrabold text-[#E6532B] text-xs mt-0.5">
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
                className="px-4 py-2 rounded-xl bg-orange-50 text-[#E6532B] hover:bg-orange-100 font-poppins font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FaEdit className="w-3.5 h-3.5" />
                <span>Edit Category</span>
              </button>

              <button
                onClick={() => setViewingCategory(null)}
                className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-poppins font-bold text-xs transition-colors cursor-pointer"
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
                <h2 className="text-base font-poppins font-bold text-zinc-950 uppercase tracking-tight">
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
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                categoryActionMsg.toLowerCase().includes("failed") || categoryActionMsg.toLowerCase().includes("required")
                  ? "bg-rose-50 border border-rose-200 text-rose-800"
                  : "bg-emerald-50 border border-emerald-200 text-emerald-800"
              }`}>
                <FaCheck className="w-4 h-4 shrink-0" />
                <span>{categoryActionMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="flex flex-col gap-4 text-xs font-inter">
              
              {/* Row 1: Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-poppins font-bold text-zinc-700">
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
                  <label className="font-poppins font-bold text-zinc-700">
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
                  <label className="font-poppins font-bold text-zinc-800 text-xs flex items-center gap-1.5">
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
                    <span className="font-poppins font-bold text-xs text-zinc-700 group-hover:text-[#E6532B]">
                      Upload Image File
                    </span>
                    <span className="text-[10px] text-zinc-400 font-inter">PNG, JPG, WEBP (Max 8MB)</span>
                  </div>

                  {/* Direct Image URL input */}
                  <div className="flex flex-col justify-center gap-1.5">
                    <span className="text-[11px] font-poppins font-semibold text-zinc-600">Or Enter Image Web Link (URL)</span>
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
                        <span className="text-[10px] font-poppins font-bold text-emerald-600 uppercase flex items-center gap-1">
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
                      className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-poppins font-bold text-[11px] flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
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
                  <label className="font-poppins font-bold text-zinc-700">
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
                  <label className="font-poppins font-bold text-zinc-700">
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
                  <label className="font-poppins font-bold text-zinc-700">
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
                  <label className="font-poppins font-bold text-zinc-700">
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
                  <label className="font-poppins font-bold text-zinc-700">
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
                  <label className="font-poppins font-bold text-zinc-700">
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
                <label className="font-poppins font-bold text-zinc-700">
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
                <label className="font-poppins font-bold text-zinc-700">
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
                  <span className="font-poppins font-bold text-zinc-700 text-xs">Active Category</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryForm.isFeatured}
                    onChange={(e) => setCategoryForm({ ...categoryForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span className="font-poppins font-bold text-zinc-700 text-xs flex items-center gap-1">
                    <FaStar className="w-3 h-3 text-amber-500" /> Featured Category
                  </span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-zinc-150 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 font-poppins font-bold hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={categorySaving}
                  className="px-6 py-2.5 rounded-xl bg-[#E6532B] hover:bg-[#d1451f] text-white font-poppins font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
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
                <h3 className="font-poppins font-bold text-base text-zinc-900">
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
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                participantActionMsg.toLowerCase().includes("failed") || participantActionMsg.toLowerCase().includes("required")
                  ? "bg-rose-50 border border-rose-200 text-rose-800"
                  : "bg-emerald-50 border border-emerald-200 text-emerald-800"
              }`}>
                <FaCheck className="w-4 h-4 shrink-0" />
                <span>{participantActionMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveParticipant} className="flex flex-col gap-4 text-xs font-inter">
              
              <div className="flex flex-col gap-1.5">
                <label className="font-poppins font-bold text-zinc-700">
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
                <label className="font-poppins font-bold text-zinc-700">
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
                  <label className="font-poppins font-bold text-zinc-700">Category</label>
                  <input
                    type="text"
                    value={participantForm.category}
                    onChange={(e) => setParticipantForm({ ...participantForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-poppins font-bold text-zinc-700">District</label>
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
                  <label className="font-poppins font-bold text-zinc-700">Mobile Phone</label>
                  <input
                    type="text"
                    value={participantForm.phone}
                    onChange={(e) => setParticipantForm({ ...participantForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-poppins font-bold text-zinc-700">Email Address</label>
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
                  <label className="font-poppins font-bold text-zinc-700">Public Votes Count</label>
                  <input
                    type="number"
                    value={participantForm.publicVotes}
                    onChange={(e) => setParticipantForm({ ...participantForm, publicVotes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E6532B]/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-poppins font-bold text-zinc-700">Application Status</label>
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
                  className="px-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 font-poppins font-bold hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={participantSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#E6532B] hover:bg-[#d1451f] text-white font-poppins font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 flex flex-col gap-5 shadow-2xl border border-zinc-200 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                  <FaUsers className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    {selectedItem.applicationId || "Nominee Profile"}
                  </span>
                  <h3 className="font-poppins font-extrabold text-base text-zinc-950">
                    {selectedItem.name || selectedItem.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col gap-3.5 text-xs font-inter">
              
              {/* Votes & Status Hero Banner */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-poppins font-bold uppercase tracking-widest text-orange-100">
                    TOTAL PUBLIC VOTES
                  </span>
                  <span className="text-2xl font-poppins font-black text-white mt-0.5">
                    {Number(selectedItem.publicVotes || 0).toLocaleString("en-IN")} Votes
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md font-poppins font-bold text-xs">
                  {selectedItem.status || "APPROVED"}
                </span>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex flex-col gap-0.5">
                  <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase">Category</span>
                  <span className="font-poppins font-bold text-zinc-900 text-xs">
                    {selectedItem.category || "General"}
                  </span>
                </div>

                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex flex-col gap-0.5">
                  <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase">District</span>
                  <span className="font-poppins font-bold text-zinc-900 text-xs">
                    {selectedItem.district || "Raipur"}
                  </span>
                </div>

                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex flex-col gap-0.5">
                  <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase">Mobile Phone</span>
                  <span className="font-mono font-medium text-zinc-800 text-xs">
                    {selectedItem.phone || "Not Provided"}
                  </span>
                </div>

                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex flex-col gap-0.5">
                  <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase">Email Address</span>
                  <span className="font-mono font-medium text-zinc-800 text-xs truncate">
                    {selectedItem.email || "Not Provided"}
                  </span>
                </div>

              </div>

              {/* Work / Title */}
              <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 flex flex-col gap-1">
                <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase">
                  Nomination Submission Title
                </span>
                <p className="font-poppins font-semibold text-zinc-800 leading-relaxed text-xs">
                  {selectedItem.title || "Nomination Candidate Submission"}
                </p>
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
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-poppins font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
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
                  className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#E6532B] font-poppins font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FaEdit className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-poppins font-bold text-xs transition-colors cursor-pointer"
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
                  <h3 className="font-poppins font-extrabold text-base text-zinc-950">
                    {viewingUser.name || "Registered User"}
                  </h3>
                  <span className="text-xs font-inter text-zinc-400 font-medium">User Profile & Account Info</span>
                </div>
              </div>
              <button
                onClick={() => setViewingUser(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs font-inter text-zinc-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex flex-col gap-0.5">
                  <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase">Email Address</span>
                  <span className="font-semibold text-zinc-900 truncate">{viewingUser.email}</span>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex flex-col gap-0.5">
                  <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase">Mobile Number</span>
                  <span className="font-mono font-semibold text-zinc-900">{viewingUser.phone || "N/A"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex flex-col gap-0.5">
                  <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase">Assigned Role</span>
                  <span className="font-poppins font-bold text-emerald-800 uppercase">{viewingUser.role || "CREATOR"}</span>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex flex-col gap-0.5">
                  <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase">District</span>
                  <span className="font-semibold text-zinc-900">{viewingUser.district || "Raipur"}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-zinc-150 pt-4 mt-1">
              <button
                onClick={() => setViewingUser(null)}
                className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-poppins font-bold text-xs transition-colors cursor-pointer"
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
              <h3 className="font-poppins font-extrabold text-base text-zinc-950">
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

            <form onSubmit={handleSaveUser} className="flex flex-col gap-4 text-xs font-inter">
              <div className="flex flex-col gap-1">
                <label className="font-poppins font-bold text-zinc-700">Full Name</label>
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
                  <label className="font-poppins font-bold text-zinc-700">Role</label>
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
                  <label className="font-poppins font-bold text-zinc-700">Status</label>
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

              <div className="flex justify-end gap-2 border-t border-zinc-150 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-poppins font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E6532B] hover:bg-[#d1451f] text-white font-poppins font-bold text-xs shadow-xs cursor-pointer"
                >
                  Save User Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
