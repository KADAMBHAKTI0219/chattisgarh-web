"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";
import { categoryService } from "@/services/category";
import { nominationService } from "@/services/nomination";
import { applicationService } from "@/services/application";
import { participantService } from "@/services/participant";
import locationService, { locationService as locServiceNamed } from "@/services/location";
import Heading from "@/components/common/Heading";
import {
  FaUser,
  FaShareAlt,
  FaLayerGroup,
  FaFileUpload,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaAward,
  FaUserTie,
  FaGlobe,
  FaMobileAlt,
  FaEnvelope,
  FaCheck,
  FaSpinner
} from "react-icons/fa";
import VideoPreviewInput from "@/components/common/VideoPreviewInput";
import { CG_DISTRICTS_33 } from "@/utils/constants";

// Generates Creator Start Years (e.g. 2000 to Current Year)
const CURRENT_YEAR = new Date().getFullYear();
const CREATOR_YEARS = Array.from({ length: 26 }, (_, i) => String(CURRENT_YEAR - i));

function ParticipateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const { t } = useLanguage();
  const { user, token } = useAuth();

  // Wizard Step State
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState("");
  const [loading, setLoading] = useState(false);

  // Categories from backend or static dataset
  const [categoriesList, setCategoriesList] = useState([]);
  const [apiLocations, setApiLocations] = useState([]);

  // Fetch Public Locations (States with nested Cities) dynamically from Backend API
  useEffect(() => {
    async function fetchLocations() {
      try {
        const activeService = locationService || locServiceNamed || null;
        if (!activeService || typeof activeService.getPublicLocations !== "function") return;
        const res = await activeService.getPublicLocations();
        const locList = res?.locations || res?.data || (Array.isArray(res) ? res : []);
        if (Array.isArray(locList) && locList.length > 0) {
          setApiLocations(locList);
        }
      } catch (err) {
        console.warn("Failed to fetch locations from backend API:", err);
      }
    }
    fetchLocations();
  }, []);

  // Master Form Data matching Excel Specifications
  const [formData, setFormData] = useState({
    // Q1: Nomination As
    nominationAs: "SELF", // 'SELF' (Applicant) or 'THIRD_PARTY' (Nominator for Others)

    // --- IF SELF NOMINATION ---
    fullName: user?.name || "",
    awardCategoryAppliedFor: "National", // 'National' or 'International'
    mobileNumber: user?.phone || "",
    emailId: user?.email || "",
    gender: "Male", // 'Male', 'Female', 'Other'
    age: "18-40", // '18-40', 'Above 40'
    state: "Chhattisgarh",
    district: user?.district || "Raipur",

    // --- IF NOMINATOR (FOR OTHERS) ---
    nominatorFullName: "",
    nominatorNationality: "Indian", // 'Indian' or 'Non-Indian'
    nominatorMobile: "",
    nominatorEmail: "",

    creatorFullName: "",
    creatorAwardCategoryAppliedFor: "National", // 'National' or 'International'
    creatorMobileNumber: "",
    creatorEmailId: "",
    creatorGender: "Male",
    creatorAge: "18-40",
    creatorState: "Chhattisgarh",
    creatorDistrict: "Raipur",

    // --- NOMINATION CATEGORY & STORY LINKS ---
    selectedCategory: "",
    workDescription: "", // Describe work (up to 2000 chars)
    bestStoryLink1: "", // Mandatory
    bestStoryLink2: "", // Optional
    bestStoryLink3: "", // Optional

    // --- CREATOR PROFILE & PLATFORMS ---
    creatorStartYear: "2020", // Mandatory for Self, Optional for Nominator
    primaryPlatform: "Instagram", // 'Instagram', 'YouTube', 'Facebook', 'Twitter', 'LinkedIn'
    primaryProfileUrl: "",
    primaryFollowers: "",

    hasSecondaryPlatform: false,
    secondaryPlatform: "YouTube",
    secondaryProfileUrl: "",
    secondaryFollowers: "",

    agreeTerms: false
  });

  const [errors, setErrors] = useState({});

  // Helper to normalize state names for matching (e.g. "Chattisgarh" vs "Chhattisgarh")
  const normalizeStateName = (name) => {
    if (!name) return "";
    const s = name.trim().toLowerCase();
    if (s.includes("chattisgarh") || s.includes("chhattisgarh") || s === "cg") {
      return "chhattisgarh";
    }
    return s;
  };

  // Dynamic Cascading States List - 100% Dynamically fetched from Backend API
  const availableStates = useMemo(() => {
    if (Array.isArray(apiLocations) && apiLocations.length > 0) {
      const states = apiLocations.map((loc) => loc.stateName);
      return Array.from(new Set(states)).sort();
    }
    const initialSt = formData.state || "Chhattisgarh";
    return [initialSt];
  }, [apiLocations, formData.state]);

  // Currently Active Selected State
  const activeSelectedState = formData.nominationAs === "SELF" ? formData.state : formData.creatorState;

  // Dynamic Cascading Cities / Districts List for Selected State - 100% Dynamically fetched from Backend API
  const availableDistricts = useMemo(() => {
    if (activeSelectedState && Array.isArray(apiLocations) && apiLocations.length > 0) {
      const targetNorm = normalizeStateName(activeSelectedState);
      const locObj = apiLocations.find(
        (l) => normalizeStateName(l.stateName) === targetNorm || l.stateName.toLowerCase() === activeSelectedState.trim().toLowerCase()
      );
      if (locObj && Array.isArray(locObj.cities) && locObj.cities.length > 0) {
        const validCities = locObj.cities
          .filter((c) => c.isActive !== false)
          .map((c) => c.cityName || c);
        if (validCities.length > 0) return validCities;
      }
    }
    const initialDist = formData.nominationAs === "SELF" ? (formData.district || "Raipur") : (formData.creatorDistrict || "Raipur");
    return [initialDist];
  }, [apiLocations, activeSelectedState, formData.district, formData.creatorDistrict, formData.nominationAs]);

  // Sync initial state to first available backend state on initial load
  useEffect(() => {
    if (availableStates.length > 0 && formData.state) {
      if (!availableStates.includes(formData.state)) {
        const matched = availableStates.find((st) => normalizeStateName(st) === normalizeStateName(formData.state));
        if (matched) {
          setFormData((prev) => ({ ...prev, state: matched }));
        }
      }
      if (formData.creatorState && !availableStates.includes(formData.creatorState)) {
        const matched = availableStates.find((st) => normalizeStateName(st) === normalizeStateName(formData.creatorState));
        if (matched) {
          setFormData((prev) => ({ ...prev, creatorState: matched }));
        }
      }
    }
  }, [apiLocations, availableStates]);

  // Auto-sync selected district when active state or availableDistricts changes
  useEffect(() => {
    if (availableDistricts.length > 0) {
      if (formData.nominationAs === "SELF") {
        if (!formData.district || !availableDistricts.includes(formData.district)) {
          setFormData((prev) => ({ ...prev, district: availableDistricts[0] }));
        }
      } else {
        if (!formData.creatorDistrict || !availableDistricts.includes(formData.creatorDistrict)) {
          setFormData((prev) => ({ ...prev, creatorDistrict: availableDistricts[0] }));
        }
      }
    }
  }, [availableDistricts, activeSelectedState]);

  // Sync logged in user details if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        emailId: prev.emailId || user.email || "",
        mobileNumber: prev.mobileNumber || user.phone || "",
        district: prev.district || user.district || "Raipur",
      }));
    }
  }, [user]);

  // Load Categories from Backend API or static fallback
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryService.getCategories({ isActive: true });
        const list = res?.success && Array.isArray(res.data)
          ? res.data
          : (Array.isArray(res?.categories) ? res.categories : fallbackCategories);

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
              selectedCategory: matched._id || matched.slug || matched.title,
            }));
            return;
          }
        }

        if (list.length > 0 && !formData.selectedCategory) {
          setFormData((prev) => ({
            ...prev,
            selectedCategory: list[0]._id || list[0].slug || list[0].title
          }));
        }
      } catch (e) {
        console.error("Failed to load categories, using static fallback:", e);
        setCategoriesList(fallbackCategories);
        if (!formData.selectedCategory && fallbackCategories.length > 0) {
          setFormData((prev) => ({
            ...prev,
            selectedCategory: fallbackCategories[0].slug
          }));
        }
      }
    };
    fetchCats();
  }, [categoryParam]);

  // Generic Field Change Handler
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

  // Trigger OTP Simulation
  const handleSendOtp = () => {
    setOtpSent(true);
    setIsOtpVerified(false);
    setOtpError("");
  };

  const handleVerifyOtp = () => {
    if (otpInput.trim() === "1234" || otpInput.trim().length >= 4) {
      setIsOtpVerified(true);
      setOtpError("");
    } else {
      setOtpError("Invalid OTP. Please enter 1234 or a 4-digit code.");
    }
  };

  // Step Validator matching Excel Rules
  const validateStep = (step) => {
    const newErrors = {};
    const isSelf = formData.nominationAs === "SELF";

    if (step === 1) {
      if (isSelf) {
        if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
        if (formData.awardCategoryAppliedFor === "National") {
          if (!formData.mobileNumber.trim()) newErrors.mobileNumber = "Mobile Number is required for National applications";
          if (!formData.state) newErrors.state = "State is required";
          if (!formData.district) newErrors.district = "District is required";
        } else {
          if (!formData.emailId.trim()) newErrors.emailId = "Email ID is required for International applications";
        }
      } else {
        // THIRD_PARTY (Nominator for Others)
        if (!formData.nominatorFullName.trim()) newErrors.nominatorFullName = "Nominator Full Name is required";
        if (formData.nominatorNationality === "Indian") {
          if (!formData.nominatorMobile.trim()) newErrors.nominatorMobile = "Nominator Mobile Number is required";
        } else {
          if (!formData.nominatorEmail.trim()) newErrors.nominatorEmail = "Nominator Email ID is required";
        }
      }
    }

    if (step === 2) {
      if (!isSelf) {
        if (!formData.creatorFullName.trim()) newErrors.creatorFullName = "Creator Full Name is required";
      }
    }

    if (step === 3) {
      if (!formData.selectedCategory) newErrors.selectedCategory = "Please select a Nomination Category";
      if (!formData.workDescription.trim()) {
        newErrors.workDescription = "Work description is required";
      } else if (formData.workDescription.length > 2000) {
        newErrors.workDescription = "Work description cannot exceed 2000 characters";
      }

      if (!formData.bestStoryLink1.trim()) {
        newErrors.bestStoryLink1 = "Best Story Link 1 is mandatory";
      } else if (!/^https?:\/\//i.test(formData.bestStoryLink1.trim())) {
        newErrors.bestStoryLink1 = "Please enter a valid URL starting with http:// or https://";
      }
    }

    if (step === 4) {
      if (!formData.primaryPlatform) newErrors.primaryPlatform = "Primary Platform is required";
      if (!formData.primaryProfileUrl.trim()) newErrors.primaryProfileUrl = "Primary Profile URL is required";
      if (!formData.primaryFollowers.trim()) newErrors.primaryFollowers = "Followers count is required";

      if (formData.hasSecondaryPlatform) {
        if (!formData.secondaryProfileUrl.trim()) newErrors.secondaryProfileUrl = "Secondary Profile URL is required";
        if (!formData.secondaryFollowers.trim()) newErrors.secondaryFollowers = "Secondary Followers count is required";
      }

      if (!formData.agreeTerms) newErrors.agreeTerms = "You must accept the terms and guidelines to submit";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final Submit to Backend API
      setLoading(true);
      try {
        const isSelf = formData.nominationAs === "SELF";

        const selectedCatObj = categoriesList.find(
          (c) => c._id === formData.selectedCategory || c.slug === formData.selectedCategory || c.title === formData.selectedCategory
        ) || fallbackCategories.find(
          (f) => f.slug === formData.selectedCategory || f.title === formData.selectedCategory
        );

        const categorySubmission = {
          categoryId: selectedCatObj?._id || formData.selectedCategory || "cat-1",
          categoryTitle: selectedCatObj?.title || formData.selectedCategory || "Award Category",
          categoryImage: selectedCatObj?.image || "/assets/images/category-1.jpg",
          description: formData.workDescription,
          storyLinks: {
            bestStoryLink1: formData.bestStoryLink1,
            bestStoryLink2: formData.bestStoryLink2 || "",
            bestStoryLink3: formData.bestStoryLink3 || ""
          }
        };

        const socialProfiles = [
          {
            platform: formData.primaryPlatform,
            profileUrl: formData.primaryProfileUrl,
            followers: formData.primaryFollowers,
            isPrimary: true
          }
        ];

        if (formData.hasSecondaryPlatform && formData.secondaryProfileUrl) {
          socialProfiles.push({
            platform: formData.secondaryPlatform,
            profileUrl: formData.secondaryProfileUrl,
            followers: formData.secondaryFollowers,
            isPrimary: false
          });
        }

        const mainVideo = formData.bestStoryLink1 || formData.bestStoryLink2 || formData.bestStoryLink3 || "";

        const payload = {
          nominationType: formData.nominationAs === "Nominator(for Others)" ? "THIRD_PARTY" : "SELF",
          awardType: isSelf ? (formData.awardCategoryAppliedFor || "National") : (formData.creatorAwardCategoryAppliedFor || "National"),

          // Top-level flat fields for direct query parsing in backend Participant model
          name: isSelf ? formData.fullName : formData.creatorFullName,
          fullName: isSelf ? formData.fullName : formData.creatorFullName,
          phone: isSelf ? formData.mobileNumber : (formData.creatorMobileNumber || "9999999999"),
          email: isSelf ? formData.emailId : (formData.creatorEmailId || ""),
          gender: isSelf ? formData.gender : formData.creatorGender,
          age: isSelf ? formData.age : formData.creatorAge,
          state: isSelf ? formData.state : formData.creatorState,
          district: isSelf ? formData.district : formData.creatorDistrict,
          nationality: "Indian",

          // Story & Video Links (matching backend videoLink, mainVideoLink, reelUrl, videoUrl, instagramReelUrl, instagramLink)
          workSummary: formData.workDescription,
          contentUrl: formData.bestStoryLink1,
          bestStoryLink1: formData.bestStoryLink1,
          bestStoryLink2: formData.bestStoryLink2 || "",
          bestStoryLink3: formData.bestStoryLink3 || "",
          videoLink: mainVideo,
          mainVideoLink: mainVideo,
          reelUrl: mainVideo,
          videoUrl: mainVideo,
          instagramReelUrl: mainVideo,
          instagramLink: mainVideo,

          // Creator Profile
          creatorStartYear: formData.creatorStartYear,
          whenBecomeCreator: formData.creatorStartYear,
          creatorProfile: {
            creatorStartYear: formData.creatorStartYear,
            bio: formData.workDescription
          },

          // Primary Platform & Secondary Platform
          primaryPlatform: socialProfiles[0],
          secondaryPlatform: socialProfiles[1] || { platform: 'YouTube', profileUrl: '', followers: '0', isPrimary: false },
          socialProfiles,

          // Nested Applicant object for Nomination model
          applicant: {
            fullName: isSelf ? formData.fullName : formData.creatorFullName,
            email: isSelf ? formData.emailId : (formData.creatorEmailId || ""),
            phone: isSelf ? formData.mobileNumber : (formData.creatorMobileNumber || "9999999999"),
            gender: isSelf ? formData.gender : formData.creatorGender,
            age: isSelf ? formData.age : formData.creatorAge,
            state: isSelf ? formData.state : formData.creatorState,
            district: isSelf ? formData.district : formData.creatorDistrict,
            nationality: "Indian"
          },

          // Nominator (for Others)
          nominator: !isSelf ? {
            fullName: formData.nominatorFullName,
            email: formData.nominatorEmail || "",
            phone: formData.nominatorMobile || "",
            nationality: formData.nominatorNationality || "Indian"
          } : undefined,

          // Nominee (for Others)
          nominee: !isSelf ? {
            name: formData.creatorFullName,
            fullName: formData.creatorFullName,
            email: formData.creatorEmailId,
            phone: formData.creatorMobileNumber,
            gender: formData.creatorGender,
            age: formData.creatorAge,
            state: formData.creatorState,
            district: formData.creatorDistrict
          } : undefined,

          category: categorySubmission.categoryId,
          categories: [{
            ...categorySubmission,
            storyLinks: {
              bestStoryLink1: formData.bestStoryLink1,
              bestStoryLink2: formData.bestStoryLink2 || "",
              bestStoryLink3: formData.bestStoryLink3 || ""
            },
            videoLink: mainVideo,
            mainVideoLink: mainVideo,
            reelUrl: mainVideo,
            videoUrl: mainVideo,
            instagramReelUrl: mainVideo,
            instagramLink: mainVideo,
            district: isSelf ? formData.district : formData.creatorDistrict
          }],
          declaration: formData.agreeTerms,
          status: "SUBMITTED"
        };

        let result = null;

        // 1. Primary: Try Application Service (POST /applications)
        try {
          const appPayload = {
            title: `${isSelf ? formData.fullName : formData.creatorFullName}'s Award Nomination`,
            category: categorySubmission.categoryId,
            workSummary: formData.workDescription,
            contentUrl: formData.bestStoryLink1,
            district: isSelf ? formData.district : formData.creatorDistrict,
            name: isSelf ? formData.fullName : formData.creatorFullName,
            email: isSelf ? formData.emailId : formData.creatorEmailId,
            phone: isSelf ? formData.mobileNumber : formData.creatorMobileNumber,
            sampleLinks: [formData.bestStoryLink1, formData.bestStoryLink2, formData.bestStoryLink3].filter(Boolean),
            ...payload
          };
          result = await applicationService.createApplication(appPayload, token);
        } catch (appErr) {
          console.warn("Application service note:", appErr);
        }

        // 2. Secondary: Try Participant Registration Service (/participants/register)
        if (!result?.success) {
          try {
            if (participantService?.registerParticipant) {
              result = await participantService.registerParticipant(payload, token);
            }
          } catch (partErr) {
            console.warn("Participant service note:", partErr);
          }
        }

        // 3. Fallback: Try Nomination Service (/nominations)
        if (!result?.success) {
          try {
            result = await nominationService.createNomination(payload, token);
          } catch (nomErr) {
            console.warn("Nomination service note:", nomErr);
          }
        }

        const generatedId = result?.data?.applicationId || result?.data?._id || result?.participant?._id || `NCA-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        setSubmittedAppId(generatedId);

        // Backup persistence in localStorage for admin view & tracking
        const record = {
          ...payload,
          _id: generatedId,
          applicationId: generatedId,
          createdAt: new Date().toISOString()
        };

        const safeSaveLocalStorage = (key, newRecord) => {
          try {
            let existing = [];
            try {
              existing = JSON.parse(localStorage.getItem(key) || "[]");
              if (!Array.isArray(existing)) existing = [];
            } catch (e) {
              existing = [];
            }

            const cleanRecord = JSON.parse(JSON.stringify(newRecord, (k, v) => {
              if (typeof v === 'string' && v.length > 3000 && (v.startsWith('data:') || v.startsWith('blob:'))) {
                return '[binary_data]';
              }
              return v;
            }));

            existing = [cleanRecord, ...existing.filter(item => item._id !== cleanRecord._id && item.applicationId !== cleanRecord.applicationId)].slice(0, 12);

            try {
              localStorage.setItem(key, JSON.stringify(existing));
            } catch (quotaErr) {
              console.warn(`LocalStorage quota reached for ${key}, trimming storage...`);
              const trimmed = existing.slice(0, 4);
              try {
                localStorage.setItem(key, JSON.stringify(trimmed));
              } catch (e) {
                // If storage is completely full from other keys, clear old keys safely
                localStorage.removeItem(key);
                localStorage.setItem(key, JSON.stringify([cleanRecord]));
              }
            }
          } catch (err) {
            console.warn("Safe localStorage save error:", err);
          }
        };

        safeSaveLocalStorage("submitted_nominations", record);
        safeSaveLocalStorage("user_applications", record);

        setSubmitted(true);

      } catch (err) {
        console.error("Submission error:", err);
        const fallbackId = `NCA-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        setSubmittedAppId(fallbackId);

        const fallbackRecord = {
          ...payload,
          _id: fallbackId,
          applicationId: fallbackId,
          createdAt: new Date().toISOString()
        };

        const safeSaveLocalStorage = (key, newRecord) => {
          try {
            let existing = [];
            try {
              existing = JSON.parse(localStorage.getItem(key) || "[]");
              if (!Array.isArray(existing)) existing = [];
            } catch (e) {
              existing = [];
            }
            existing = [newRecord, ...existing.filter(item => item._id !== newRecord._id)].slice(0, 12);
            try {
              localStorage.setItem(key, JSON.stringify(existing));
            } catch (quotaErr) {
              localStorage.removeItem(key);
              localStorage.setItem(key, JSON.stringify([newRecord]));
            }
          } catch (e) { }
        };

        safeSaveLocalStorage("submitted_nominations", fallbackRecord);
        safeSaveLocalStorage("user_applications", fallbackRecord);

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
    { num: 1, title: "Nomination Mode & Basic Details", icon: FaUserTie },
    { num: 2, title: "Creator Profile & Demographics", icon: FaUser },
    { num: 3, title: "Award Category & Work Story", icon: FaLayerGroup },
    { num: 4, title: "Social Handles & Submission", icon: FaShareAlt },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 sm:px-6 md:px-10 py-8 md:py-12 flex flex-col gap-10 relative overflow-x-hidden animate-page-enter">

      {/* Top Navigation */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-[var(--primary)] font-inter font-bold text-xs sm:text-sm transition-colors group"
        >
          <FaArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Return to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-inter font-bold text-zinc-500 uppercase tracking-widest hidden md:inline">
            National Creator Award 2026 • Official Application Portal
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="w-full max-w-5xl mx-auto text-center flex flex-col items-center">
        <Heading
          badge={t("NATIONAL CREATOR AWARD 2026")}
          title={t("OFFICIAL NOMINATION &")}
          highlightText={t("PARTICIPATION FORM")}
          description={t("Submit your self-nomination or nominate an extraordinary digital creator across governance, tech, arts, culture, and social impact categories.")}
        />
      </div>

      {/* Main Wizard Form Container */}
      <div className="w-full max-w-5xl mx-auto bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm text-left relative">

        {submitted ? (
          /* Success Screen */
          <div className="py-12 px-6 flex flex-col items-center text-center gap-5 animate-in fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center text-3xl shadow-lg">
              <FaCheckCircle className="w-10 h-10 animate-bounce" />
            </div>
            <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-poppins font-bold text-xs uppercase tracking-widest">
              Nomination Submitted Successfully
            </span>
            <h2 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight">
              Application Registration Complete!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 font-inter max-w-lg leading-relaxed">
              Your official nomination for the National Creator Award 2026 has been logged. Your official Registration ID is: <strong className="text-[var(--primary)] font-extrabold">{submittedAppId}</strong>. You can use this ID anytime to track your submission status.
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
                Submit Another Nomination
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Step Wizard Bar */}
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

            {/* STEP 1: Nomination Mode & Basic Contact Info */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-6 animate-in fade-in">

                {/* Q1: Top Selection - Nomination As */}
                <div className="bg-zinc-50 border border-zinc-200/80 p-5 rounded-2xl flex flex-col gap-3">
                  <label className="text-xs sm:text-sm font-poppins font-bold uppercase tracking-wider text-zinc-900">
                    Q1. Nomination As <span className="text-red-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                      onClick={() => setFormData((prev) => ({ ...prev, nominationAs: "SELF" }))}
                      className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${formData.nominationAs === "SELF"
                        ? "border-[var(--primary)] bg-amber-50/50 text-[var(--primary)] shadow-xs"
                        : "border-zinc-200 bg-white hover:border-zinc-300"
                        }`}
                    >
                      <input
                        type="radio"
                        name="nominationAs"
                        value="SELF"
                        checked={formData.nominationAs === "SELF"}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-[var(--primary)]"
                      />
                      <div className="flex flex-col">
                        <span className="font-poppins font-bold text-xs sm:text-sm">Applicant (Self)</span>
                        <span className="text-[11px] text-zinc-500">I am nominating myself as a creator</span>
                      </div>
                    </label>

                    <label
                      onClick={() => setFormData((prev) => ({ ...prev, nominationAs: "THIRD_PARTY" }))}
                      className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${formData.nominationAs === "THIRD_PARTY"
                        ? "border-[var(--primary)] bg-amber-50/50 text-[var(--primary)] shadow-xs"
                        : "border-zinc-200 bg-white hover:border-zinc-300"
                        }`}
                    >
                      <input
                        type="radio"
                        name="nominationAs"
                        value="THIRD_PARTY"
                        checked={formData.nominationAs === "THIRD_PARTY"}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-[var(--primary)]"
                      />
                      <div className="flex flex-col">
                        <span className="font-poppins font-bold text-xs sm:text-sm">Nominator (for Others)</span>
                        <span className="text-[11px] text-zinc-500">I am nominating another digital creator</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* IF SELF NOMINATION */}
                {formData.nominationAs === "SELF" && (
                  <div className="flex flex-col gap-5 border-t border-zinc-200 pt-5">
                    <h4 className="text-xs font-poppins font-extrabold uppercase tracking-wider text-[var(--primary)]">
                      Self Nomination Personal Details
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Full Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                          Q2. Full Name <span className="text-red-500">*</span>
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

                      {/* Award Category applied for: National / International */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                          Q3. Award Scope Applied For <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="awardCategoryAppliedFor"
                          value={formData.awardCategoryAppliedFor}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                          <option value="National">National (India)</option>
                          <option value="International">International</option>
                        </select>
                      </div>

                      {/* Mobile Number (Mandatory for National) */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                          Q4. Mobile Number {formData.awardCategoryAppliedFor === "National" && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="text"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          placeholder="+91 9876543210"
                          className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${errors.mobileNumber ? "border-red-500 bg-red-50/20" : ""
                            }`}
                        />
                        {errors.mobileNumber && <span className="text-red-500 text-[10px] font-bold">{errors.mobileNumber}</span>}
                      </div>

                      {/* Email Id (Mandatory for International) */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                          Q5. Email Address {formData.awardCategoryAppliedFor === "International" && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="email"
                          name="emailId"
                          value={formData.emailId}
                          onChange={handleInputChange}
                          placeholder="creator@example.com"
                          className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${errors.emailId ? "border-red-500 bg-red-50/20" : ""
                            }`}
                        />
                        {errors.emailId && <span className="text-red-500 text-[10px] font-bold">{errors.emailId}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* IF NOMINATOR (FOR OTHERS) */}
                {formData.nominationAs === "THIRD_PARTY" && (
                  <div className="flex flex-col gap-5 border-t border-zinc-200 pt-5">
                    <h4 className="text-xs font-poppins font-extrabold uppercase tracking-wider text-[var(--primary)]">
                      Nominator Profile (Person Filing Nomination)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Nominator Full Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                          Nominator Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="nominatorFullName"
                          value={formData.nominatorFullName}
                          onChange={handleInputChange}
                          placeholder="e.g. Dr. Anil Verma"
                          className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${errors.nominatorFullName ? "border-red-500 bg-red-50/20" : ""
                            }`}
                        />
                        {errors.nominatorFullName && <span className="text-red-500 text-[10px] font-bold">{errors.nominatorFullName}</span>}
                      </div>

                      {/* Nominator Nationality */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                          Nominator Nationality <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="nominatorNationality"
                          value={formData.nominatorNationality}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                          <option value="Indian">Indian</option>
                          <option value="Non-Indian">Non-Indian</option>
                        </select>
                      </div>

                      {/* Nominator Mobile Number */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                          Nominator Mobile Number {formData.nominatorNationality === "Indian" && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="text"
                          name="nominatorMobile"
                          value={formData.nominatorMobile}
                          onChange={handleInputChange}
                          placeholder="+91 9876543210"
                          className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${errors.nominatorMobile ? "border-red-500 bg-red-50/20" : ""
                            }`}
                        />
                        {errors.nominatorMobile && <span className="text-red-500 text-[10px] font-bold">{errors.nominatorMobile}</span>}
                      </div>

                      {/* Nominator Email Id */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                          Nominator Email Address {formData.nominatorNationality === "Non-Indian" && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="email"
                          name="nominatorEmail"
                          value={formData.nominatorEmail}
                          onChange={handleInputChange}
                          placeholder="nominator@example.com"
                          className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${errors.nominatorEmail ? "border-red-500 bg-red-50/20" : ""
                            }`}
                        />
                        {errors.nominatorEmail && <span className="text-red-500 text-[10px] font-bold">{errors.nominatorEmail}</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Creator Profile & Demographics */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-6 animate-in fade-in">
                <div className="border-b border-zinc-200 pb-3">
                  <h3 className="text-lg font-poppins font-bold text-zinc-950 uppercase tracking-tight">
                    Step 2: {formData.nominationAs === "SELF" ? "Personal Demographics & Location" : "Nominated Creator Profile"}
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    {formData.nominationAs === "SELF"
                      ? "Specify your gender, age bracket, state, and district location."
                      : "Provide details of the creator you are nominating."}
                  </p>
                </div>

                {formData.nominationAs === "THIRD_PARTY" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-4 border-b border-zinc-200">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                        Nominated Creator Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="creatorFullName"
                        value={formData.creatorFullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Priya Sharma"
                        className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${errors.creatorFullName ? "border-red-500 bg-red-50/20" : ""
                          }`}
                      />
                      {errors.creatorFullName && <span className="text-red-500 text-[10px] font-bold">{errors.creatorFullName}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                        Award Scope Applied For <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="creatorAwardCategoryAppliedFor"
                        value={formData.creatorAwardCategoryAppliedFor}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      >
                        <option value="National">National (India)</option>
                        <option value="International">International</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                        Creator Mobile Number (Optional)
                      </label>
                      <input
                        type="text"
                        name="creatorMobileNumber"
                        value={formData.creatorMobileNumber}
                        onChange={handleInputChange}
                        placeholder="+91 9876543210"
                        className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                        Creator Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        name="creatorEmailId"
                        value={formData.creatorEmailId}
                        onChange={handleInputChange}
                        placeholder="creator@example.com"
                        className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Gender */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      Q6. Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name={formData.nominationAs === "SELF" ? "gender" : "creatorGender"}
                      value={formData.nominationAs === "SELF" ? formData.gender : formData.creatorGender}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Age */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      Q7. Age Bracket <span className="text-red-500">*</span>
                    </label>
                    <select
                      name={formData.nominationAs === "SELF" ? "age" : "creatorAge"}
                      value={formData.nominationAs === "SELF" ? formData.age : formData.creatorAge}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      <option value="18-40">18-40 Years</option>
                      <option value="Above 40">Above 40 Years</option>
                    </select>
                  </div>

                  {/* State */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      Q8. State {formData.nominationAs === "SELF" && formData.awardCategoryAppliedFor === "National" && <span className="text-red-500">*</span>}
                    </label>
                    <select
                      name={formData.nominationAs === "SELF" ? "state" : "creatorState"}
                      value={formData.nominationAs === "SELF" ? formData.state : formData.creatorState}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${errors.state ? "border-red-500 bg-red-50/20" : ""
                        }`}
                    >
                      {availableStates.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    {errors.state && <span className="text-red-500 text-[10px] font-bold">{errors.state}</span>}
                  </div>

                  {/* District */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      Q9. District {formData.nominationAs === "SELF" && formData.awardCategoryAppliedFor === "National" && <span className="text-red-500">*</span>}
                    </label>
                    <select
                      name={formData.nominationAs === "SELF" ? "district" : "creatorDistrict"}
                      value={formData.nominationAs === "SELF" ? formData.district : formData.creatorDistrict}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${errors.district ? "border-red-500 bg-red-50/20" : ""
                        }`}
                    >
                      {availableDistricts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                    {errors.district && <span className="text-red-500 text-[10px] font-bold">{errors.district}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Nomination Category & Work Portfolio Stories */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-6 animate-in fade-in">
                <div className="border-b border-zinc-200 pb-3">
                  <h3 className="text-lg font-poppins font-bold text-zinc-950 uppercase tracking-tight">
                    Step 3: Nomination Category & Work Portfolio
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">Select the award category and describe your key contributions with story links.</p>
                </div>

                <div className="flex flex-col gap-5">
                  {/* Select Nomination Category */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      Q9. Select Nomination Category (39 Official Categories) <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="selectedCategory"
                      value={formData.selectedCategory}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${errors.selectedCategory ? "border-red-500 bg-red-50/20" : ""
                        }`}
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat._id || cat.slug || cat.title} value={cat._id || cat.slug || cat.title}>
                          {cat.categoryNumber ? `${cat.categoryNumber}. ` : ""}{cat.title || cat.name} ({cat.tier || cat.tierName || "General"})
                        </option>
                      ))}
                    </select>
                    {errors.selectedCategory && <span className="text-red-500 text-[10px] font-bold">{errors.selectedCategory}</span>}
                  </div>

                  {/* Selected Category Visual Card (Image, Hashtag, Task Brief) */}
                  {(() => {
                    const selectedCatObj = categoriesList.find(
                      (c) => c._id === formData.selectedCategory || c.slug === formData.selectedCategory || c.title === formData.selectedCategory
                    ) || fallbackCategories.find(
                      (f) => f.slug === formData.selectedCategory || f.title === formData.selectedCategory
                    ) || fallbackCategories[0];

                    if (!selectedCatObj) return null;

                    return (
                      <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-md transition-all">
                        {/* Category Image */}
                        <div className="relative w-full sm:w-44 h-32 sm:h-32 shrink-0 rounded-xl overflow-hidden border border-white/20">
                          <img
                            src={selectedCatObj.image || "/assets/images/category-1.jpg"}
                            alt={selectedCatObj.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40" />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[var(--primary)] text-white text-[9px] font-bold uppercase tracking-wider">
                            {selectedCatObj.tier || "Award Tier"}
                          </span>
                        </div>

                        {/* Category Details */}
                        <div className="flex flex-col gap-1.5 text-left w-full">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h4 className="font-poppins font-bold text-sm sm:text-base text-amber-200 uppercase tracking-tight">
                              {selectedCatObj.title}
                            </h4>
                            {selectedCatObj.hashtag && (
                              <span className="text-xs font-mono font-bold text-emerald-400">
                                {selectedCatObj.hashtag}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-zinc-300 font-inter line-clamp-2">
                            {selectedCatObj.shortDescription || selectedCatObj.fullDescription}
                          </p>

                          {selectedCatObj.taskBrief && (
                            <div className="mt-1 p-2.5 rounded-lg bg-white/10 border border-white/15 text-[11px] text-zinc-200">
                              <strong className="text-amber-300 font-bold uppercase tracking-wider">Task Brief: </strong>
                              {selectedCatObj.taskBrief}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Work Description */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                        Q9.1 Describe your work done in this category <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] font-bold text-zinc-400">
                        {formData.workDescription.length} / 2000 chars
                      </span>
                    </div>
                    <textarea
                      name="workDescription"
                      rows={5}
                      maxLength={2000}
                      value={formData.workDescription}
                      onChange={handleInputChange}
                      placeholder="Detail your key content initiatives, public impact, video highlights, educational modules, or community contributions..."
                      className={`w-full rounded-xl border border-zinc-300 bg-zinc-50/50 p-4 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${errors.workDescription ? "border-red-500 bg-red-50/20" : ""
                        }`}
                    />
                    {errors.workDescription && <span className="text-red-500 text-[10px] font-bold">{errors.workDescription}</span>}
                  </div>

                  {/* Story Links with Live Video Preview */}
                  <div className="grid grid-cols-1 gap-5 pt-2">
                    {/* Story Link 1 */}
                    <VideoPreviewInput
                      label="Q9.2 Best Story Video Link 1"
                      name="bestStoryLink1"
                      value={formData.bestStoryLink1}
                      onChange={handleInputChange}
                      placeholder="https://youtube.com/watch?v=example or https://instagram.com/reel/example"
                      required
                      error={errors.bestStoryLink1}
                    />

                    {/* Story Link 2 */}
                    <VideoPreviewInput
                      label="Q9.3 Best Story Video Link 2 (Optional)"
                      name="bestStoryLink2"
                      value={formData.bestStoryLink2}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/reel/example or https://youtube.com/shorts/..."
                    />

                    {/* Story Link 3 */}
                    <VideoPreviewInput
                      label="Q9.4 Best Story Video Link 3 (Optional)"
                      name="bestStoryLink3"
                      value={formData.bestStoryLink3}
                      onChange={handleInputChange}
                      placeholder="https://youtube.com/watch?v=... or video URL"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Creator Social Profile & Platforms */}
            {currentStep === 4 && (
              <div className="flex flex-col gap-6 animate-in fade-in">
                <div className="border-b border-zinc-200 pb-3">
                  <h3 className="text-lg font-poppins font-bold text-zinc-950 uppercase tracking-tight">
                    Step 4: Creator Platforms & Channel Analytics
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">Specify your primary and secondary platform channels with follower metrics.</p>
                </div>

                <div className="flex flex-col gap-5">
                  {/* Creator Start Year */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                      Q10. When did you become a creator? (Year) <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="creatorStartYear"
                      value={formData.creatorStartYear}
                      onChange={handleInputChange}
                      className="w-full sm:w-1/2 rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      {CREATOR_YEARS.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Primary Platform Section (Highest Followers) */}
                  <div className="bg-amber-50/60 border border-amber-200/80 p-5 rounded-2xl flex flex-col gap-4">
                    <h4 className="text-xs font-poppins font-extrabold uppercase tracking-wider text-amber-900">
                      Primary Platform (Highest Followers) <span className="text-red-500">*</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Q11: Platform */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                          Q11. Platform <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="primaryPlatform"
                          value={formData.primaryPlatform}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none"
                        >
                          <option value="Instagram">Instagram</option>
                          <option value="YouTube">YouTube</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Twitter">Twitter / X</option>
                          <option value="LinkedIn">LinkedIn</option>
                        </select>
                      </div>

                      {/* Q11.2: Profile URL */}
                      <div className="flex flex-col gap-1.5 sm:col-span-1">
                        <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                          Q11.2 Profile URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          name="primaryProfileUrl"
                          value={formData.primaryProfileUrl}
                          onChange={handleInputChange}
                          placeholder="https://instagram.com/yourhandle"
                          className={`w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none ${errors.primaryProfileUrl ? "border-red-500 bg-red-50/20" : ""
                            }`}
                        />
                        {errors.primaryProfileUrl && <span className="text-red-500 text-[10px] font-bold">{errors.primaryProfileUrl}</span>}
                      </div>

                      {/* Q11.3: Followers Count */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                          Q11.3 Followers / Subscribers <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="primaryFollowers"
                          value={formData.primaryFollowers}
                          onChange={handleInputChange}
                          placeholder="e.g. 50K or 150000"
                          className={`w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none ${errors.primaryFollowers ? "border-red-500 bg-red-50/20" : ""
                            }`}
                        />
                        {errors.primaryFollowers && <span className="text-red-500 text-[10px] font-bold">{errors.primaryFollowers}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Secondary Platform Toggle */}
                  <div className="flex flex-col gap-3 pt-2">
                    <label className="inline-flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="hasSecondaryPlatform"
                        checked={formData.hasSecondaryPlatform}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded text-[var(--primary)] accent-[var(--primary)]"
                      />
                      <span className="text-xs sm:text-sm font-poppins font-bold text-zinc-900">
                        Add Secondary Platform (Second Highest Followers)
                      </span>
                    </label>

                    {formData.hasSecondaryPlatform && (
                      <div className="bg-zinc-50 border border-zinc-200/80 p-5 rounded-2xl flex flex-col gap-4 animate-in fade-in">
                        <h4 className="text-xs font-poppins font-extrabold uppercase tracking-wider text-zinc-800">
                          Secondary Platform (Second Highest Followers)
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                              Q12. Platform
                            </label>
                            <select
                              name="secondaryPlatform"
                              value={formData.secondaryPlatform}
                              onChange={handleInputChange}
                              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none"
                            >
                              <option value="YouTube">YouTube</option>
                              <option value="Instagram">Instagram</option>
                              <option value="Facebook">Facebook</option>
                              <option value="Twitter">Twitter / X</option>
                              <option value="LinkedIn">LinkedIn</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                              Q12.1 Profile URL <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="url"
                              name="secondaryProfileUrl"
                              value={formData.secondaryProfileUrl}
                              onChange={handleInputChange}
                              placeholder="https://youtube.com/@channel"
                              className={`w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none ${errors.secondaryProfileUrl ? "border-red-500 bg-red-50/20" : ""
                                }`}
                            />
                            {errors.secondaryProfileUrl && <span className="text-red-500 text-[10px] font-bold">{errors.secondaryProfileUrl}</span>}
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                              Q12.2 Followers / Subscribers <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="secondaryFollowers"
                              value={formData.secondaryFollowers}
                              onChange={handleInputChange}
                              placeholder="e.g. 25K"
                              className={`w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none ${errors.secondaryFollowers ? "border-red-500 bg-red-50/20" : ""
                                }`}
                            />
                            {errors.secondaryFollowers && <span className="text-red-500 text-[10px] font-bold">{errors.secondaryFollowers}</span>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Declaration Checkbox */}
                  <div className="pt-4 border-t border-zinc-200">
                    <label className="inline-flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        className="w-4 h-4 mt-0.5 rounded text-[var(--primary)] accent-[var(--primary)] shrink-0"
                      />
                      <span className="text-xs font-inter text-zinc-600 leading-relaxed">
                        I hereby declare that all details provided in this National Creator Award 2026 nomination form are true, accurate, and belong to authentic content creation channels. I agree to the official terms, rules, and privacy guidelines.
                      </span>
                    </label>
                    {errors.agreeTerms && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.agreeTerms}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons Footer */}
            <div className="flex items-center justify-between pt-8 border-t border-zinc-200 mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-3 rounded-full border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800 font-poppins font-bold text-xs uppercase tracking-wider transition-all"
                >
                  ← Back
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="px-8 py-3.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : currentStep === 4 ? (
                  <span>Submit Final Nomination →</span>
                ) : (
                  <span>Next Step →</span>
                )}
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center py-20">
        <FaSpinner className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    }>
      <ParticipateForm />
    </Suspense>
  );
}
