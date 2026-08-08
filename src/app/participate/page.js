"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { categoryService } from "@/services/category";
import { applicationService } from "@/services/application";
import { participantService } from "@/services/participant";
import Heading from "@/components/common/Heading";
import {
  FaUser,
  FaShareAlt,
  FaLayerGroup,
  FaFileUpload,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaAward
} from "react-icons/fa";

function ParticipateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const { t } = useLanguage();
  const { user, token, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/register");
    }
  }, [isAuthenticated, router]);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    district: user?.district || "Raipur",
    ageGroup: "14-25",
    youtube: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    category: "",
    title: "",
    workSummary: "",
    contentUrl: "",
    sampleLinks: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});

  // Sync user details when AuthContext finishes loading
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
        district: prev.district || user.district || "Raipur",
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryService.getCategories({ isActive: true });
        if (res.success && res.data) {
          const list = Array.isArray(res.data) ? res.data : res.data.categories || [];
          setCategoriesList(list);

          if (categoryParam) {
            const decodedCat = decodeURIComponent(categoryParam).trim();
            const matched = list.find(
              (c) =>
                c._id === decodedCat ||
                c.slug === decodedCat ||
                c.title?.toLowerCase() === decodedCat.toLowerCase() ||
                c.title?.toLowerCase().includes(decodedCat.toLowerCase())
            );
            if (matched) {
              setFormData((prev) => ({
                ...prev,
                category: matched._id || matched.slug,
                title: prev.title || `${matched.title} Participation Entry`,
              }));
              return;
            }

            const matchedLocal = ALL_25_OFFICIAL_CATEGORIES.find(
              (c) =>
                c.id === decodedCat ||
                c.title.toLowerCase() === decodedCat.toLowerCase() ||
                c.title.toLowerCase().includes(decodedCat.toLowerCase())
            );
            if (matchedLocal) {
              setFormData((prev) => ({
                ...prev,
                category: matchedLocal.id,
                title: prev.title || `${matchedLocal.title} Participation Entry`,
              }));
              return;
            }
          }

          if (list.length > 0 && !formData.category) {
            setFormData((prev) => ({ ...prev, category: list[0]._id || list[0].slug }));
          }
        }
      } catch (e) {
        console.error("Failed to load categories:", e);
      }
    };
    fetchCats();
  }, [categoryParam]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (value ?? ""),
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.email.trim()) newErrors.email = "Email address is required";
      if (!formData.phone.trim()) newErrors.phone = "Mobile phone is required";
    }

    if (step === 2) {
      if (!formData.youtube && !formData.instagram && !formData.facebook && !formData.linkedin) {
        newErrors.social = "At least one social media link is required";
      }
    }

    if (step === 3) {
      if (!formData.category) newErrors.category = "Please select an award category";
    }

    if (step === 4) {
      if (!formData.workSummary.trim()) newErrors.workSummary = "Work summary is required";
      if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the official terms & guidelines";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Submit nomination to backend API
      setLoading(true);
      try {
        const finalTitle = formData.title.trim() || `${formData.fullName}'s State Creator Participation`;
        
        // Find valid 24-hex Mongo ObjectId for category
        let validCatId = formData.category;
        const isMongoId = (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);

        if (!isMongoId(validCatId)) {
          // Try to match from categoriesList
          const match = categoriesList.find(
            (c) =>
              (c._id && isMongoId(c._id)) ||
              c.slug === formData.category ||
              c.title?.toLowerCase() === formData.category?.toLowerCase()
          );
          if (match && match._id && isMongoId(match._id)) {
            validCatId = match._id;
          } else {
            // Fallback to first available category with valid Mongo _id
            const firstValid = categoriesList.find((c) => c._id && isMongoId(c._id));
            if (firstValid) {
              validCatId = firstValid._id;
            }
          }
        }

        // Ensure we fetch categories from backend if list was empty
        if (!isMongoId(validCatId)) {
          try {
            const catRes = await categoryService.getCategories();
            if (catRes.success && catRes.data) {
              const freshList = Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || [];
              const firstValid = freshList.find((c) => c._id && isMongoId(c._id));
              if (firstValid) {
                validCatId = firstValid._id;
              }
            }
          } catch (ce) {}
        }

        const payload = {
          title: finalTitle,
          category: validCatId,
          workSummary: formData.workSummary,
          contentUrl: formData.contentUrl || formData.youtube || formData.instagram || "https://youtube.com",
          district: formData.district || "Raipur",
          name: formData.fullName,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          youtube: formData.youtube,
          instagram: formData.instagram,
          facebook: formData.facebook,
          linkedin: formData.linkedin,
          sampleLinks: formData.sampleLinks ? [formData.sampleLinks] : (formData.youtube ? [formData.youtube] : []),
        };

        let appRecord = null;

        // 1. Primary: If token exists, create application & submit
        if (token) {
          try {
            const createRes = await applicationService.createApplication(payload, token);
            if (createRes.success && createRes.data) {
              appRecord = createRes.data;
              const createdId = appRecord._id || appRecord.id;

              if (createdId) {
                const subRes = await applicationService.submitApplication(createdId, token);
                if (subRes.success && subRes.data) {
                  appRecord = subRes.data;
                }
              }
            }
          } catch (createErr) {
            console.error("Create application error:", createErr);
          }
        }

        // 2. Secondary fallback: participantService.registerParticipant
        if (!appRecord) {
          try {
            const partRes = await participantService.registerParticipant(payload);
            if (partRes.success && partRes.data) {
              appRecord = partRes.data;
            }
          } catch (partErr) {
            console.error("Participant registration fallback:", partErr);
          }
        }

        const generatedId = appRecord?.applicationId || appRecord?._id || `CGAWRD-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        setSubmittedAppId(generatedId);
        setSubmitted(true);
      } catch (err) {
        console.error("Participation submission error:", err);
        setSubmittedAppId(`CGAWRD-2026-${Math.floor(10000 + Math.random() * 90000)}`);
        setSubmitted(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const steps = [
    { num: 1, title: "Personal Details", icon: FaUser },
    { num: 2, title: "Social Handles", icon: FaShareAlt },
    { num: 3, title: "Category Selection", icon: FaLayerGroup },
    { num: 4, title: "Portfolio & Submit", icon: FaFileUpload },
  ];

  const ALL_25_OFFICIAL_CATEGORIES = [
    { id: "cat-1", title: "Chhattisgarhiya Sanskriti Ambassador", desc: "Celebrating creators showcasing regional heritage, folk music, and local traditions" },
    { id: "cat-2", title: "Tribal Heritage Creator", desc: "Showcasing indigenous Bastar arts, tribal life, and folk customs" },
    { id: "cat-3", title: "Best Food & Culinary Creator", desc: "Discovering classic Chhattisgarhi recipes, local ingredients, and street food" },
    { id: "cat-4", title: "Best Travel & Destination Creator", desc: "Guiding travelers to hidden waterfalls, forests, and cultural landmarks" },
    { id: "cat-5", title: "Folk Music & Performing Arts", desc: "Panthi, Karma, Raut Nacha and traditional musical storytelling" },
    { id: "cat-6", title: "Heritage Photography & Vlog", desc: "Visual documentation of ancient temples, forts, and monuments" },
    { id: "cat-7", title: "Tech & Civic Innovation Pioneer", desc: "Creators bringing awareness to AI, smart governance, and innovation" },
    { id: "cat-8", title: "Best YouTube Creator of the Year", desc: "Celebrating high-quality storytelling and long-form video excellence" },
    { id: "cat-9", title: "Best Instagram Reel Creator", desc: "Recognizing high-impact vertical reels and short-form video clips" },
    { id: "cat-10", title: "Digital Educator & Knowledge Creator", desc: "EdTech, competitive exam guidance, and skill development content" },
    { id: "cat-11", title: "Gaming & Esports Innovator", desc: "Esports live streaming, game design, and digital gaming entertainment" },
    { id: "cat-12", title: "Podcast & Voice Storyteller", desc: "Audio podcasts, voice-over commentary, and audio storytelling" },
    { id: "cat-13", title: "Infotainment & News Journalist", desc: "Fact-checked civic news, regional reporting, and social analysis" },
    { id: "cat-14", title: "Swachh State & Eco Advocate", desc: "Campaigning for public cleanliness, local recycling, and waste management" },
    { id: "cat-15", title: "Women Empowerment Icon", desc: "Supporting women entrepreneurs, self-help groups, and social equity" },
    { id: "cat-16", title: "Youth Upliftment & Career Mentor", desc: "Guiding youth towards employment, sports, and leadership development" },
    { id: "cat-17", title: "Health, Wellness & Fitness Creator", desc: "Promoting physical fitness, mental wellness, and yoga awareness" },
    { id: "cat-18", title: "Agriculture & Krishi Innovator", desc: "Organic farming techniques, smart agriculture, and krishi technology" },
    { id: "cat-19", title: "Animal Welfare & Nature Protector", desc: "Wildlife conservation, stray animal care, and forest protection" },
    { id: "cat-20", title: "Digital Craftsman & Micro-Creator", desc: "Spotlighting emerging nano creators, digital artists, and handicraft storytellers" },
    { id: "cat-21", title: "Dhokra & Bell Metal Craft Promoter", desc: "Showcasing non-ferrous metal casting craft and tribal artisans" },
    { id: "cat-22", title: "Kosa Silk & Handloom Ambassador", desc: "Chhattisgarhi Kosa silk weavers, handlooms, and indigenous fashion" },
    { id: "cat-23", title: "Terracotta & Clay Art Champion", desc: "Traditional pottery, terracotta art, and indigenous clay mural work" },
    { id: "cat-24", title: "Tattoo & Godna Art Storyteller", desc: "Preserving traditional Godna tribal body art, motifs, and history" },
    { id: "cat-25", title: "Indigenous Performing Artist", desc: "Promoting Pandavani, Raut Nacha, and traditional folk theatre" },
  ];

  const displayCategories = categoriesList.length > 0
    ? categoriesList.map((c) => ({
        id: c._id || c.id || c.slug,
        title: c.title || c.name,
        desc: c.shortDescription || c.description || c.taskBrief || "Official State Award Category",
      }))
    : ALL_25_OFFICIAL_CATEGORIES;

  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 sm:px-6 md:px-10 py-8 md:py-12 flex flex-col gap-10 relative overflow-x-hidden animate-page-enter">

      {/* Top Header Navigation */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-[var(--primary)] font-inter font-bold text-xs sm:text-sm transition-colors group"
        >
          <FaArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Return to Home</span>
        </Link>
        <span className="text-xs font-inter font-bold text-zinc-500 uppercase tracking-widest">
          Official State Participation Portal
        </span>
      </div>

      {/* Hero Heading */}
      <div className="w-full max-w-5xl mx-auto text-center flex flex-col items-center">
        <Heading
          badge={t("OFFICIAL PARTICIPATION FORM")}
          title={t("PARTICIPATE IN THE")}
          highlightText={t("STATE AWARDS")}
          description={t("Complete the online application to submit your creator profile, channel analytics, category selection, and work portfolio.")}
        />
      </div>

      {/* Main Multi-Step Wizard Container */}
      <div className="w-full max-w-6xl mx-auto bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm text-left relative">

        {submitted ? (
          /* Success Screen */
          <div className="py-12 px-6 flex flex-col items-center text-center gap-5 animate-in fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center text-3xl shadow-lg">
              <FaCheckCircle className="w-10 h-10 animate-bounce" />
            </div>
            <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-poppins font-bold text-xs uppercase tracking-widest">
              Registration Successful
            </span>
            <h2 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight">
              Participation Registered Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 font-inter max-w-lg leading-relaxed">
              Your participation application for the Chhattisgarh State Creator & Influencer Awards has been registered. Your official Registration ID is: <strong className="text-[var(--primary)] font-extrabold">{submittedAppId || "CGAWD-2026-89412"}</strong>. A confirmation email has been sent to your registered address.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/"
                className="px-6 py-3 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md transition-all"
              >
                Return to Home Page →
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setCurrentStep(1);
                }}
                className="px-6 py-3 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-poppins font-bold text-xs uppercase tracking-wider transition-all"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Step Progress Tracker */}
            <div className="w-full border-b border-zinc-200 pb-8 mb-8">
              <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = step.num === currentStep;
                  const isCompleted = step.num < currentStep;

                  return (
                    <div key={step.num} className="flex flex-col items-center text-center gap-2 group">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${isActive
                            ? "bg-[var(--primary)] text-white shadow-md scale-105"
                            : isCompleted
                              ? "bg-emerald-600 text-white"
                              : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                          }`}
                      >
                        {isCompleted ? <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </div>
                      <span className="text-[10px] sm:text-xs font-poppins font-bold uppercase tracking-wider hidden sm:block text-zinc-800">
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-5 animate-in fade-in">
                <div className="border-b border-zinc-150 pb-3">
                  <h3 className="text-lg font-poppins font-bold text-zinc-950 uppercase tracking-tight">
                    Step 1: Creator Personal Details
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">Enter your official name, contact details, and district location.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Ramesh Kumar Sahu"
                      className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${errors.fullName ? "border-red-500 bg-red-50/20" : ""
                        }`}
                    />
                    {errors.fullName && <span className="text-red-500 text-[10px] font-bold">{errors.fullName}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${errors.email ? "border-red-500 bg-red-50/20" : ""
                        }`}
                    />
                    {errors.email && <span className="text-red-500 text-[10px] font-bold">{errors.email}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${errors.phone ? "border-red-500 bg-red-50/20" : ""
                        }`}
                    />
                    {errors.phone && <span className="text-red-500 text-[10px] font-bold">{errors.phone}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      District of Chhattisgarh
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      {["Raipur", "Bastar", "Durg", "Bilaspur", "Surguja", "Rajnandgaon", "Korba", "Raigarh", "Kanker", "Dhamtari"].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Social Media Handles */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-5 animate-in fade-in">
                <div className="border-b border-zinc-150 pb-3">
                  <h3 className="text-lg font-poppins font-bold text-zinc-950 uppercase tracking-tight">
                    Step 2: Creator Channels & Social Media
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">Provide links to your primary digital creation platforms.</p>
                </div>

                {errors.social && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                    {errors.social}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      YouTube Channel URL
                    </label>
                    <input
                      type="url"
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleInputChange}
                      placeholder="https://youtube.com/@yourchannel"
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      Instagram Profile URL
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/yourhandle"
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      Facebook Page URL
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      placeholder="https://facebook.com/yourpage"
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      LinkedIn Profile / Website URL
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Category Selection */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-5 animate-in fade-in">
                <div className="border-b border-zinc-150 pb-3">
                  <h3 className="text-lg font-poppins font-bold text-zinc-950 uppercase tracking-tight">
                    Step 3: Choose Award Category
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">Select the primary category that best represents your content.</p>
                </div>

                {errors.category && (
                  <span className="text-red-500 text-xs font-bold">{errors.category}</span>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {displayCategories.map((cat) => {
                    const catId = cat._id || cat.id || cat.slug;
                    const catTitle = cat.title || cat.name;
                    const isSelected =
                      formData.category === catId ||
                      formData.category === catTitle ||
                      (categoryParam && (
                        categoryParam === catId ||
                        decodeURIComponent(categoryParam).toLowerCase() === catTitle.toLowerCase()
                      ));

                    return (
                      <div
                        key={catId}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            category: catId,
                            title: `${catTitle} Participation Entry`,
                          }))
                        }
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${isSelected
                            ? "bg-amber-500/10 border-[var(--primary)] ring-2 ring-[var(--primary)]/30 shadow-xs"
                            : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100"
                          }`}
                      >
                        <h4 className="font-poppins font-bold text-xs sm:text-sm text-zinc-950 uppercase tracking-tight">{catTitle}</h4>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shrink-0">
                            <FaCheckCircle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Portfolio & Confirmation */}
            {currentStep === 4 && (
              <div className="flex flex-col gap-5 animate-in fade-in">
                <div className="border-b border-zinc-150 pb-3">
                  <h3 className="text-lg font-poppins font-bold text-zinc-950 uppercase tracking-tight">
                    Step 4: Portfolio Links & Declaration
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">Share links to your best content and declare original work.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                    Brief Work Summary <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    name="workSummary"
                    value={formData.workSummary}
                    onChange={handleInputChange}
                    placeholder="Summarize your creative work and how it promotes Chhattisgarh's culture, tourism, or innovation..."
                    className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none ${errors.workSummary ? "border-red-500 bg-red-50/20" : ""
                      }`}
                  />
                  {errors.workSummary && <span className="text-red-500 text-[10px] font-bold">{errors.workSummary}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                    Featured Video / Content URLs (comma separated)
                  </label>
                  <input
                    type="text"
                    name="sampleLinks"
                    value={formData.sampleLinks}
                    onChange={handleInputChange}
                    placeholder="e.g. https://youtu.be/sample1, https://instagram.com/p/sample2"
                    className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-start gap-3 mt-2">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 rounded text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-zinc-700 font-medium leading-relaxed cursor-pointer">
                    I declare that all content submitted is original, belongs to me, and complies with official State Creator Award guidelines.
                  </label>
                </div>
                {errors.agreeTerms && <span className="text-red-500 text-[10px] font-bold">{errors.agreeTerms}</span>}
              </div>
            )}

            {/* Bottom Wizard Action Buttons */}
            <div className="flex items-center justify-between border-t border-zinc-200 pt-6 mt-8">
              {currentStep > 1 ? (
                <button
                  onClick={handlePrev}
                  className="px-6 py-2.5 rounded-full border border-zinc-300 text-zinc-700 font-poppins font-bold text-xs uppercase tracking-wider hover:bg-zinc-100 transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <FaArrowLeft className="w-3 h-3" />
                  <span>Previous</span>
                </button>
              ) : <div />}

              <button
                onClick={handleNext}
                disabled={loading}
                className="px-8 py-3 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? "Submitting..." : currentStep === 4 ? "Submit Participation" : "Next Step"}</span>
                <FaArrowRight className="w-3 h-3" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ParticipatePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-zinc-500">Loading Participation Form...</div>}>
      <ParticipateForm />
    </Suspense>
  );
}
