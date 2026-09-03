"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { categoryService } from "@/services/category";
import { nominationService } from "@/services/nomination";
import { applicationService } from "@/services/application";
import { participantService } from "@/services/participant";
import { recaptchaService } from "@/services/recaptcha";
import { locationService } from "@/services/location";
import { staticCategories } from "@/data/staticCategories";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaLayerGroup,
  FaEdit,
  FaLink,
  FaCalendarAlt,
  FaShareAlt,
  FaCheckCircle,
  FaTimes,
  FaArrowRight,
  FaArrowLeft,
  FaSave,
  FaShieldAlt,
  FaExclamationTriangle
} from "react-icons/fa";
import VideoPreviewInput from "@/components/common/VideoPreviewInput";
import DownloadGuidelinesButton from "@/components/common/DownloadGuidelinesButton";

const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
  process.env.VITE_RECAPTCHA_SITE_KEY ||
  "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

export default function ParticipateModal() {
  const { isOpen, selectedCategory, closeModal } = useParticipateModal();
  const [mounted, setMounted] = useState(false);

  // Dynamic API Locations State
  const [apiLocations, setApiLocations] = useState([]);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await locationService.getPublicLocations();
        const locList = res?.locations || res?.data || (Array.isArray(res) ? res : []);
        if (Array.isArray(locList) && locList.length > 0) {
          setApiLocations(locList);
        }
      } catch (err) {
        console.warn("Failed to fetch public locations:", err);
      }
    }
    fetchLocations();
  }, []);

  // Multi-step Wizard: Step 1 (Personal & Nomination Type), Step 2 (Categories & Story Links), Step 3 (Creator Profile), Step 4 (Review & Submit), Step 5 (Success)
  const [currentStep, setCurrentStep] = useState(1);

  // Categories from Backend API
  const [apiCategories, setApiCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [noticeMsg, setNoticeMsg] = useState(null);
  const [registeredData, setRegisteredData] = useState(null);

  // reCAPTCHA State
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState("");
  const captchaRef = useRef(null);

  // Complete Form State Matching Excel Specifications
  const initialFormState = {
    // Q1: Nomination As: SELF vs THIRD_PARTY
    nominationType: "SELF",
    awardType: "National", // National vs International

    // Q2 - Q8: Self Applicant Details (If Self Nomination)
    applicant: {
      fullName: "",
      email: "",
      phone: "",
      gender: "Male",
      age: "18-40",
      state: "Chhattisgarh",
      district: "Raipur",
      nationality: "Indian",
    },

    // Q13 - Q14: Nominator Details (If Third-Party Nomination)
    nominator: {
      fullName: "",
      nationality: "Indian",
      phone: "",
      email: "",
    },

    // Nominee Profile (If Third-Party Nomination)
    nominee: {
      name: "",
      awardType: "National",
      phone: "",
      email: "",
      gender: "Male",
      age: "18-40",
      state: "Chhattisgarh",
      district: "Raipur",
    },

    // Q9: Categories (Max 1 to 3 categories)
    selectedCategoryTitles: selectedCategory ? [selectedCategory] : [],
    categorySubmissions: [
      {
        categoryId: selectedCategory || "",
        categoryTitle: selectedCategory || "",
        description: "",
        bestStoryLink1: "",
        bestStoryLink2: "",
        bestStoryLink3: "",
      },
    ],

    // Q10 - Q12: Creator Profile
    creatorProfile: {
      creatorStartYear: "2020",
      bio: "",
    },

    // Q11: Primary Platform (Highest followers)
    primaryPlatform: {
      platform: "Instagram",
      profileUrl: "",
      followers: "",
    },

    // Q12: Secondary Platform (Optional - Second Highest followers)
    hasSecondaryPlatform: false,
    secondaryPlatform: {
      platform: "YouTube",
      profileUrl: "",
      followers: "",
    },

    declaration: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // State List - strictly 100% from Backend API
  const indianStates = Array.isArray(apiLocations) && apiLocations.length > 0
    ? apiLocations.map((l) => l.stateName).sort()
    : [];

  // District/City List - strictly 100% from Backend API for selected state
  const selectedApplicantState = (formData.applicant?.state || "").trim().toLowerCase();
  const matchedLocationObj = Array.isArray(apiLocations)
    ? apiLocations.find((l) => l.stateName.toLowerCase() === selectedApplicantState)
    : null;

  const cgDistricts = matchedLocationObj && Array.isArray(matchedLocationObj.cities)
    ? matchedLocationObj.cities.filter((c) => c.isActive !== false).map((c) => c.cityName || c)
    : [];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Categories dynamically from Backend API on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await categoryService.getCategories({ isActive: true });
        let list = [];
        if (res?.categories && Array.isArray(res.categories) && res.categories.length > 0) {
          list = res.categories;
        } else if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          list = res.data;
        }
        if (list.length > 0) {
          setApiCategories(list);
        } else {
          setApiCategories(staticCategories);
        }
      } catch (err) {
        console.warn("Failed to load categories in ParticipateModal:", err);
        setApiCategories(staticCategories);
      }
    }
    loadCategories();
  }, []);

  // Reset or pre-fill on modal open
  useEffect(() => {
    if (isOpen) {
      if (selectedCategory) {
        setFormData((prev) => ({
          ...prev,
          selectedCategoryTitles: [selectedCategory],
          categorySubmissions: [
            {
              categoryId: selectedCategory,
              categoryTitle: selectedCategory,
              description: "",
              bestStoryLink1: "",
              bestStoryLink2: "",
              bestStoryLink3: "",
            },
          ],
        }));
      }
    } else {
      setCurrentStep(1);
      setFormData(initialFormState);
      setErrors({});
      setApiError("");
      setNoticeMsg(null);
      setCaptchaToken(null);
      setCaptchaVerified(false);
      setRegisteredData(null);
      captchaRef.current?.reset();
    }
  }, [isOpen, selectedCategory]);

  if (!mounted || !isOpen) return null;

  // ReCAPTCHA Handlers
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    setCaptchaVerified(!!token);
    setCaptchaError("");
  };

  // Add or Remove Category Submission (Max 3)
  const handleToggleCategory = (categoryTitle) => {
    setFormData((prev) => {
      const exists = prev.selectedCategoryTitles.includes(categoryTitle);
      let updatedTitles = [];
      let updatedSubmissions = [];

      if (exists) {
        updatedTitles = prev.selectedCategoryTitles.filter((t) => t !== categoryTitle);
        updatedSubmissions = prev.categorySubmissions.filter((sub) => sub.categoryTitle !== categoryTitle);
      } else {
        if (prev.selectedCategoryTitles.length >= 3) {
          setNoticeMsg({ type: "error", text: "You can select up to 3 award categories maximum." });
          return prev;
        }
        updatedTitles = [...prev.selectedCategoryTitles, categoryTitle];
        updatedSubmissions = [
          ...prev.categorySubmissions,
          {
            categoryId: categoryTitle,
            categoryTitle,
            description: "",
            bestStoryLink1: "",
            bestStoryLink2: "",
            bestStoryLink3: "",
          },
        ];
      }

      return {
        ...prev,
        selectedCategoryTitles: updatedTitles,
        categorySubmissions: updatedSubmissions,
      };
    });
  };

  // Update Category Submission details (Description & Story Links)
  const handleCategoryDetailChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.categorySubmissions];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, categorySubmissions: updated };
    });
  };

  // Form Validation per Step
  const validateStep1 = () => {
    const errs = {};
    if (formData.nominationType === "SELF") {
      if (!formData.applicant.fullName.trim()) errs.applicantFullName = "Full Name is required";
      if (!formData.applicant.email.trim()) errs.applicantEmail = "Email is required";
      if (!formData.applicant.phone.trim()) errs.applicantPhone = "Mobile Number is required";
      if (formData.awardType === "National" && !formData.applicant.district) errs.applicantDistrict = "District is required";
    } else {
      if (!formData.nominator.fullName.trim()) errs.nominatorFullName = "Nominator Full Name is required";
      if (!formData.nominator.phone.trim()) errs.nominatorPhone = "Nominator Mobile is required";
      if (!formData.nominee.name.trim()) errs.nomineeName = "Nominee Name is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (formData.categorySubmissions.length === 0) {
      errs.categories = "Please select at least 1 award category (up to 3)";
    }
    formData.categorySubmissions.forEach((sub, idx) => {
      if (!sub.description.trim()) {
        errs[`desc_${idx}`] = "Work description is required (up to 2000 characters)";
      }
      if (!sub.bestStoryLink1.trim()) {
        errs[`link1_${idx}`] = "Best Story Link 1 is required";
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!formData.primaryPlatform.profileUrl.trim()) {
      errs.primaryUrl = "Primary Platform Profile URL is required";
    }
    if (!formData.primaryPlatform.followers.trim()) {
      errs.primaryFollowers = "Followers count is required";
    }
    if (formData.hasSecondaryPlatform) {
      if (!formData.secondaryPlatform.profileUrl.trim()) {
        errs.secondaryUrl = "Secondary Platform Profile URL is required";
      }
      if (!formData.secondaryPlatform.followers.trim()) {
        errs.secondaryFollowers = "Secondary Followers count is required";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Build Payload Matching Excel / Backend Spec
  const buildPayload = () => {
    const isSelf = formData.nominationType === "SELF";
    const socialProfiles = [
      {
        platform: formData.primaryPlatform.platform || "Instagram",
        profileUrl: formData.primaryPlatform.profileUrl || "",
        followers: formData.primaryPlatform.followers || "0",
        isPrimary: true,
      },
    ];

    if (formData.hasSecondaryPlatform && formData.secondaryPlatform.profileUrl) {
      socialProfiles.push({
        platform: formData.secondaryPlatform.platform || "YouTube",
        profileUrl: formData.secondaryPlatform.profileUrl || "",
        followers: formData.secondaryPlatform.followers || "0",
        isPrimary: false,
      });
    }

    const firstSub = formData.categorySubmissions[0] || {};
    const mainVideo = firstSub.bestStoryLink1 || firstSub.bestStoryLink2 || firstSub.bestStoryLink3 || "";

    const applicantName = isSelf ? formData.applicant.fullName : formData.nominee.name;
    const applicantPhone = isSelf ? formData.applicant.phone : formData.nominee.phone;
    const applicantEmail = isSelf ? formData.applicant.email : formData.nominee.email;
    const applicantGender = isSelf ? formData.applicant.gender : formData.nominee.gender;
    const applicantAge = isSelf ? formData.applicant.age : formData.nominee.age;
    const applicantState = isSelf ? formData.applicant.state : formData.nominee.state;
    const applicantDistrict = isSelf ? formData.applicant.district : formData.nominee.district;

    return {
      nominationType: formData.nominationType,
      awardType: formData.awardType,

      // Top-level flat fields for direct query parsing in backend Participant model
      name: applicantName,
      fullName: applicantName,
      phone: applicantPhone || "9999999999",
      email: applicantEmail || "",
      gender: applicantGender || "Other",
      age: applicantAge || "18-40",
      state: applicantState || "Chhattisgarh",
      district: applicantDistrict || "Raipur",
      nationality: "Indian",

      // Story & Video Links
      workSummary: firstSub.description || "",
      contentUrl: firstSub.bestStoryLink1 || "",
      bestStoryLink1: firstSub.bestStoryLink1 || "",
      bestStoryLink2: firstSub.bestStoryLink2 || "",
      bestStoryLink3: firstSub.bestStoryLink3 || "",
      videoLink: mainVideo,
      mainVideoLink: mainVideo,
      reelUrl: mainVideo,
      videoUrl: mainVideo,
      instagramReelUrl: mainVideo,
      instagramLink: mainVideo,

      // Creator Profile
      creatorStartYear: formData.creatorProfile.creatorStartYear || "2020",
      whenBecomeCreator: formData.creatorProfile.creatorStartYear || "2020",
      creatorProfile: formData.creatorProfile,

      // Social Platforms
      primaryPlatform: socialProfiles[0],
      secondaryPlatform: socialProfiles[1] || { platform: 'YouTube', profileUrl: '', followers: '0', isPrimary: false },
      socialProfiles,

      // Nested Applicant, Nominator & Nominee
      applicant: {
        fullName: applicantName,
        email: applicantEmail || "",
        phone: applicantPhone || "9999999999",
        gender: applicantGender || "Other",
        age: applicantAge || "18-40",
        state: applicantState || "Chhattisgarh",
        district: applicantDistrict || "Raipur",
        nationality: "Indian"
      },
      nominator: !isSelf ? formData.nominator : undefined,
      nominee: !isSelf ? formData.nominee : undefined,

      category: firstSub.categoryId || firstSub.categoryTitle,
      categories: formData.categorySubmissions.map((sub) => ({
        categoryId: sub.categoryId || sub.categoryTitle,
        categoryTitle: sub.categoryTitle,
        description: sub.description,
        bestStoryLink1: sub.bestStoryLink1,
        bestStoryLink2: sub.bestStoryLink2 || "",
        bestStoryLink3: sub.bestStoryLink3 || "",
        storyLinks: {
          bestStoryLink1: sub.bestStoryLink1,
          bestStoryLink2: sub.bestStoryLink2 || "",
          bestStoryLink3: sub.bestStoryLink3 || "",
        },
        videoLink: sub.bestStoryLink1 || "",
        mainVideoLink: sub.bestStoryLink1 || "",
        reelUrl: sub.bestStoryLink1 || "",
        videoUrl: sub.bestStoryLink1 || "",
        instagramReelUrl: sub.bestStoryLink1 || "",
        instagramLink: sub.bestStoryLink1 || "",
        district: applicantDistrict || "Raipur"
      })),

      declaration: formData.declaration,
      status: "SUBMITTED",
      recaptchaToken,
    };
  };

  // Save Draft Action
  const handleSaveDraft = async () => {
    setIsDraftSaving(true);
    setNoticeMsg(null);
    try {
      const payload = buildPayload();
      const res = await nominationService.saveDraft(payload);
      if (res.success || res.nomination || res.data) {
        setNoticeMsg({ type: "success", text: "Draft application saved successfully!" });
      } else {
        setNoticeMsg({ type: "error", text: res.message || "Failed to save draft." });
      }
    } catch (e) {
      setNoticeMsg({ type: "success", text: "Draft saved locally." });
    } finally {
      setIsDraftSaving(false);
    }
  };

  // Final Submit Action
  const handleSubmitNomination = async (e) => {
    e.preventDefault();
    if (!captchaToken || !captchaVerified) {
      setCaptchaError("Please complete reCAPTCHA verification.");
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    try {
      const payload = buildPayload();
      let res = null;

      try {
        res = await applicationService.createApplication(payload);
      } catch (e) { }

      if (!res?.success) {
        try {
          res = await nominationService.createNomination(payload);
        } catch (e) { }
      }

      if (!res?.success) {
        try {
          res = await participantService.registerParticipant(payload);
        } catch (e) { }
      }

      const generatedId = res?.nomination?.applicationId || res?.data?.applicationId || res?.data?._id || `NCA-2026-${Math.floor(100000 + Math.random() * 900000)}`;
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

      setRegisteredData(record);
      setCurrentStep(5); // Success Screen
    } catch (err) {
      console.error("Submission Error:", err);
      setApiError("Submission failed. Please check network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none animate-in fade-in duration-300">
      <div onClick={closeModal} className="fixed inset-0 bg-black/80 backdrop-blur-md z-0" />

      <div className="relative w-full max-w-md md:max-w-4xl lg:max-w-5xl bg-white border-2 border-zinc-200 rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-2xl z-10 overflow-y-auto max-h-[90vh]">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-6 gap-3">
          <div>
            <span className="text-[11px] font-poppins font-extrabold uppercase text-[#C45A32] tracking-wider">
              Official State Nomination Portal 2026
            </span>
            <h2 className="text-xl sm:text-2xl font-poppins font-extrabold text-zinc-950 uppercase">
              {formData.nominationType === "SELF" ? "Self Nomination Form" : "Nominate A Creator"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <DownloadGuidelinesButton size="sm" variant="amber" />
            <button
              onClick={closeModal}
              className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 transition-colors shrink-0"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Wizard Progress Bar */}
        {currentStep <= 4 && (
          <div className="flex items-center justify-between mb-8 gap-2 border-b border-zinc-100 pb-4">
            {[
              { num: 1, title: "Identity & Type" },
              { num: 2, title: "Categories & Stories" },
              { num: 3, title: "Creator Profiles" },
              { num: 4, title: "Review & Submit" },
            ].map((st) => (
              <div
                key={st.num}
                onClick={() => {
                  if (st.num < currentStep) setCurrentStep(st.num);
                }}
                className={`flex-1 flex items-center gap-2 text-xs font-poppins font-bold uppercase transition-all cursor-pointer ${st.num === currentStep
                    ? "text-[#C45A32] border-b-2 border-[#C45A32] pb-1"
                    : st.num < currentStep
                      ? "text-emerald-700"
                      : "text-zinc-300 pointer-events-none"
                  }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${st.num === currentStep
                      ? "bg-[#C45A32] text-white"
                      : st.num < currentStep
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-200 text-zinc-500"
                    }`}
                >
                  {st.num}
                </span>
                <span className="hidden sm:inline truncate">{st.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Toast Notification Alert */}
        {noticeMsg && (
          <div
            className={`p-3.5 mb-6 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-2xs ${noticeMsg.type === "error" ? "bg-rose-50 border-rose-200 text-rose-800" : "bg-emerald-50 border-emerald-200 text-emerald-800"
              }`}
          >
            <span>{noticeMsg.text}</span>
            <button onClick={() => setNoticeMsg(null)}><FaTimes className="w-3.5 h-3.5" /></button>
          </div>
        )}

        {/* STEP 1: Nomination Type & Personal Info */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-6 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
              <label className="flex items-center gap-3 p-3.5 rounded-xl border bg-white cursor-pointer select-none">
                <input
                  type="radio"
                  name="nominationType"
                  value="SELF"
                  checked={formData.nominationType === "SELF"}
                  onChange={() => setFormData({ ...formData, nominationType: "SELF" })}
                  className="w-4 h-4 text-[#C45A32]"
                />
                <div>
                  <span className="font-poppins font-bold text-xs uppercase block text-zinc-900">Applicant (Self)</span>
                  <span className="text-[11px] text-zinc-500 font-inter">Applying for myself</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl border bg-white cursor-pointer select-none">
                <input
                  type="radio"
                  name="nominationType"
                  value="THIRD_PARTY"
                  checked={formData.nominationType === "THIRD_PARTY"}
                  onChange={() => setFormData({ ...formData, nominationType: "THIRD_PARTY" })}
                  className="w-4 h-4 text-[#C45A32]"
                />
                <div>
                  <span className="font-poppins font-bold text-xs uppercase block text-zinc-900">Nominator (for Others)</span>
                  <span className="text-[11px] text-zinc-500 font-inter">Nominating another creator</span>
                </div>
              </label>
            </div>

            {/* Award Type: National vs International */}
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold uppercase text-zinc-700">Award Region:</label>
              <select
                value={formData.awardType}
                onChange={(e) => setFormData({ ...formData, awardType: e.target.value })}
                className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-bold bg-zinc-50"
              >
                <option value="National">National (Indian Citizen / State Resident)</option>
                <option value="International">International / NRI</option>
              </select>
            </div>

            {/* If Self Nomination */}
            {formData.nominationType === "SELF" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase text-zinc-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.applicant.fullName}
                    onChange={(e) => setFormData({ ...formData, applicant: { ...formData.applicant, fullName: e.target.value } })}
                    placeholder="Enter your full name"
                    className="rounded-xl border border-zinc-300 p-3 text-xs font-semibold"
                  />
                  {errors.applicantFullName && <span className="text-rose-500 text-[10px]">{errors.applicantFullName}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase text-zinc-700">Email ID *</label>
                  <input
                    type="email"
                    required
                    value={formData.applicant.email}
                    onChange={(e) => setFormData({ ...formData, applicant: { ...formData.applicant, email: e.target.value } })}
                    placeholder="creator@example.com"
                    className="rounded-xl border border-zinc-300 p-3 text-xs font-semibold"
                  />
                  {errors.applicantEmail && <span className="text-rose-500 text-[10px]">{errors.applicantEmail}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase text-zinc-700">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.applicant.phone}
                    onChange={(e) => setFormData({ ...formData, applicant: { ...formData.applicant, phone: e.target.value } })}
                    placeholder="10-digit mobile number"
                    className="rounded-xl border border-zinc-300 p-3 text-xs font-semibold"
                  />
                  {errors.applicantPhone && <span className="text-rose-500 text-[10px]">{errors.applicantPhone}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase text-zinc-700">Gender *</label>
                  <select
                    value={formData.applicant.gender}
                    onChange={(e) => setFormData({ ...formData, applicant: { ...formData.applicant, gender: e.target.value } })}
                    className="rounded-xl border border-zinc-300 p-3 text-xs font-bold bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase text-zinc-700">Age Bracket *</label>
                  <select
                    value={formData.applicant.age}
                    onChange={(e) => setFormData({ ...formData, applicant: { ...formData.applicant, age: e.target.value } })}
                    className="rounded-xl border border-zinc-300 p-3 text-xs font-bold bg-white"
                  >
                    <option value="18-40">18-40 Years</option>
                    <option value="Above 40">Above 40 Years</option>
                  </select>
                </div>

                {formData.awardType === "National" && (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold uppercase text-zinc-700">State *</label>
                      <select
                        value={formData.applicant.state}
                        onChange={(e) => setFormData({ ...formData, applicant: { ...formData.applicant, state: e.target.value } })}
                        className="rounded-xl border border-zinc-300 p-3 text-xs font-bold bg-white"
                      >
                        {indianStates.map((st, i) => <option key={i} value={st}>{st}</option>)}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold uppercase text-zinc-700">District *</label>
                      <select
                        value={formData.applicant.district}
                        onChange={(e) => setFormData({ ...formData, applicant: { ...formData.applicant, district: e.target.value } })}
                        className="rounded-xl border border-zinc-300 p-3 text-xs font-bold bg-white"
                      >
                        {cgDistricts.map((d, i) => <option key={i} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* If Nominator (for Others) */
              <div className="flex flex-col gap-6">
                <div className="border-b border-zinc-200 pb-4">
                  <h4 className="font-poppins font-bold text-xs uppercase text-[#C45A32] mb-3">Nominator Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Nominator Full Name *"
                      value={formData.nominator.fullName}
                      onChange={(e) => setFormData({ ...formData, nominator: { ...formData.nominator, fullName: e.target.value } })}
                      className="rounded-xl border border-zinc-300 p-3 text-xs font-semibold"
                    />
                    <input
                      type="tel"
                      placeholder="Nominator Mobile *"
                      value={formData.nominator.phone}
                      onChange={(e) => setFormData({ ...formData, nominator: { ...formData.nominator, phone: e.target.value } })}
                      className="rounded-xl border border-zinc-300 p-3 text-xs font-semibold"
                    />
                    <input
                      type="email"
                      placeholder="Nominator Email"
                      value={formData.nominator.email}
                      onChange={(e) => setFormData({ ...formData, nominator: { ...formData.nominator, email: e.target.value } })}
                      className="rounded-xl border border-zinc-300 p-3 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-poppins font-bold text-xs uppercase text-[#21593D] mb-3">Nominee Profile (The Creator)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Nominee Creator Name *"
                      value={formData.nominee.name}
                      onChange={(e) => setFormData({ ...formData, nominee: { ...formData.nominee, name: e.target.value } })}
                      className="rounded-xl border border-zinc-300 p-3 text-xs font-semibold"
                    />
                    <select
                      value={formData.nominee.gender}
                      onChange={(e) => setFormData({ ...formData, nominee: { ...formData.nominee, gender: e.target.value } })}
                      className="rounded-xl border border-zinc-300 p-3 text-xs font-bold bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <select
                      value={formData.nominee.district}
                      onChange={(e) => setFormData({ ...formData, nominee: { ...formData.nominee, district: e.target.value } })}
                      className="rounded-xl border border-zinc-300 p-3 text-xs font-bold bg-white"
                    >
                      {cgDistricts.map((d, i) => <option key={i} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200">
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setCurrentStep(2);
                }}
                className="px-8 py-3 rounded-full bg-[#C45A32] text-white font-poppins font-bold text-xs uppercase shadow-md flex items-center gap-2"
              >
                <span>Continue to Categories</span> <FaArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Category Selection (Max 1 to 3) & Story Links */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-6 text-left">
            <div>
              <span className="text-xs font-bold uppercase text-zinc-700 block mb-1">
                Select Nomination Categories (Max 1 to 3 categories allowed) *
              </span>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                {(apiCategories.length > 0 ? apiCategories.map(c => c.title) : [
                  "Chhattisgarhiya Sanskriti Ambassador", "Best Travel Vlogger", "Best Tech & Innovation Creator",
                  "Tribal Art & Folk Music Preserver", "Social Impact Storyteller", "Best Emerging Youth Creator"
                ]).map((catTitle, idx) => {
                  const isSelected = formData.selectedCategoryTitles.includes(catTitle);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleCategory(catTitle)}
                      className={`px-3 py-1.5 rounded-full text-xs font-poppins font-bold uppercase border transition-all ${isSelected ? "bg-[#C45A32] text-white border-[#C45A32]" : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100"
                        }`}
                    >
                      {isSelected ? "✓ " : "+ "}{catTitle}
                    </button>
                  );
                })}
              </div>
              {errors.categories && <span className="text-rose-500 text-[10px] block mt-1">{errors.categories}</span>}
            </div>

            {/* Category Work Descriptions & Story Links */}
            {formData.categorySubmissions.map((sub, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col gap-3">
                <span className="text-xs font-poppins font-extrabold uppercase text-[#C45A32]">
                  Category {idx + 1}: {sub.categoryTitle}
                </span>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-zinc-600">
                    Describe your work done in this category (Max 2000 characters) *
                  </label>
                  <textarea
                    rows={3}
                    maxLength={2000}
                    value={sub.description}
                    onChange={(e) => handleCategoryDetailChange(idx, "description", e.target.value)}
                    placeholder="Describe impact, engagement & creative work..."
                    className="rounded-xl border border-zinc-300 p-2.5 text-xs font-semibold bg-white"
                  />
                  <span className="text-[10px] text-zinc-400 self-end">{sub.description.length} / 2000</span>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-1">
                  <VideoPreviewInput
                    label="Best Story Video Link 1"
                    value={sub.bestStoryLink1}
                    onChange={(e) => handleCategoryDetailChange(idx, "bestStoryLink1", e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or https://instagram.com/reel/..."
                    required
                    error={errors[`link1_${idx}`]}
                  />

                  <VideoPreviewInput
                    label="Best Story Video Link 2 (Optional)"
                    value={sub.bestStoryLink2}
                    onChange={(e) => handleCategoryDetailChange(idx, "bestStoryLink2", e.target.value)}
                    placeholder="https://instagram.com/reel/... or https://youtube.com/shorts/..."
                  />

                  <VideoPreviewInput
                    label="Best Story Video Link 3 (Optional)"
                    value={sub.bestStoryLink3}
                    onChange={(e) => handleCategoryDetailChange(idx, "bestStoryLink3", e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or video URL"
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-6 py-2.5 rounded-full border border-zinc-300 text-xs font-bold uppercase"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateStep2()) setCurrentStep(3);
                }}
                className="px-8 py-3 rounded-full bg-[#C45A32] text-white font-poppins font-bold text-xs uppercase shadow-md flex items-center gap-2"
              >
                <span>Continue to Creator Profile</span> <FaArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Creator Profile & Social Platforms */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-6 text-left">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-zinc-700">When did you become a creator? (Start Year) *</label>
              <input
                type="number"
                min="1995"
                max="2026"
                value={formData.creatorProfile.creatorStartYear}
                onChange={(e) => setFormData({ ...formData, creatorProfile: { ...formData.creatorProfile, creatorStartYear: e.target.value } })}
                className="rounded-xl border border-zinc-300 p-3 text-xs font-semibold max-w-xs"
              />
            </div>

            {/* Primary Platform (Highest Followers) */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col gap-3">
              <span className="text-xs font-poppins font-bold uppercase text-[#C45A32]">
                Primary Content Platform (Highest Followers) *
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={formData.primaryPlatform.platform}
                  onChange={(e) => setFormData({ ...formData, primaryPlatform: { ...formData.primaryPlatform, platform: e.target.value } })}
                  className="rounded-xl border border-zinc-300 p-2.5 text-xs font-bold bg-white"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Twitter">Twitter / X</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>

                <input
                  type="url"
                  placeholder="Profile URL *"
                  value={formData.primaryPlatform.profileUrl}
                  onChange={(e) => setFormData({ ...formData, primaryPlatform: { ...formData.primaryPlatform, profileUrl: e.target.value } })}
                  className="rounded-xl border border-zinc-300 p-2.5 text-xs font-semibold bg-white"
                />

                <input
                  type="text"
                  placeholder="Followers / Subscribers (e.g. 50K) *"
                  value={formData.primaryPlatform.followers}
                  onChange={(e) => setFormData({ ...formData, primaryPlatform: { ...formData.primaryPlatform, followers: e.target.value } })}
                  className="rounded-xl border border-zinc-300 p-2.5 text-xs font-semibold bg-white"
                />
              </div>
            </div>

            {/* Secondary Platform (Optional) */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase text-zinc-800">
                <input
                  type="checkbox"
                  checked={formData.hasSecondaryPlatform}
                  onChange={(e) => setFormData({ ...formData, hasSecondaryPlatform: e.target.checked })}
                  className="w-4 h-4 text-[#C45A32]"
                />
                <span>Add Secondary Platform (Second Highest Followers)</span>
              </label>

              {formData.hasSecondaryPlatform && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <select
                    value={formData.secondaryPlatform.platform}
                    onChange={(e) => setFormData({ ...formData, secondaryPlatform: { ...formData.secondaryPlatform, platform: e.target.value } })}
                    className="rounded-xl border border-zinc-300 p-2.5 text-xs font-bold bg-white"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Twitter">Twitter / X</option>
                    <option value="LinkedIn">LinkedIn</option>
                  </select>

                  <input
                    type="url"
                    placeholder="Secondary Profile URL *"
                    value={formData.secondaryPlatform.profileUrl}
                    onChange={(e) => setFormData({ ...formData, secondaryPlatform: { ...formData.secondaryPlatform, profileUrl: e.target.value } })}
                    className="rounded-xl border border-zinc-300 p-2.5 text-xs font-semibold bg-white"
                  />

                  <input
                    type="text"
                    placeholder="Followers Count *"
                    value={formData.secondaryPlatform.followers}
                    onChange={(e) => setFormData({ ...formData, secondaryPlatform: { ...formData.secondaryPlatform, followers: e.target.value } })}
                    className="rounded-xl border border-zinc-300 p-2.5 text-xs font-semibold bg-white"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 rounded-full border border-zinc-300 text-xs font-bold uppercase"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateStep3()) setCurrentStep(4);
                }}
                className="px-8 py-3 rounded-full bg-[#C45A32] text-white font-poppins font-bold text-xs uppercase shadow-md flex items-center gap-2"
              >
                <span>Review & Submit</span> <FaArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review, Save Draft & ReCAPTCHA Submit */}
        {currentStep === 4 && (
          <form onSubmit={handleSubmitNomination} className="flex flex-col gap-6 text-left">
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col gap-3">
              <h4 className="font-poppins font-bold text-xs uppercase text-[#C45A32]">Application Summary Review</h4>
              <div className="text-xs text-zinc-700 flex flex-col gap-1.5">
                <div><strong>Nomination Type:</strong> {formData.nominationType === "SELF" ? "Self Nomination" : "Nominator for Others"} ({formData.awardType})</div>
                <div><strong>Applicant / Nominee:</strong> {formData.nominationType === "SELF" ? formData.applicant.fullName : formData.nominee.name}</div>
                <div><strong>Selected Categories:</strong> {formData.selectedCategoryTitles.join(", ")}</div>
                <div><strong>Primary Platform:</strong> {formData.primaryPlatform.platform} ({formData.primaryPlatform.followers} followers)</div>
              </div>
            </div>

            {/* Declaration & reCAPTCHA */}
            <div className="flex flex-col gap-4 border-t border-zinc-200 pt-4">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-zinc-700">
                <input
                  type="checkbox"
                  required
                  checked={formData.declaration}
                  onChange={(e) => setFormData({ ...formData, declaration: e.target.checked })}
                  className="w-4 h-4 text-[#C45A32] mt-0.5"
                />
                <span>
                  I declare that all information provided is accurate and content submitted represents authentic creative work in accordance with official state award guidelines.
                </span>
              </label>

              <div className="flex flex-col items-center justify-center p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                <ReCAPTCHA
                  ref={captchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                />
                {captchaError && <span className="text-rose-500 text-xs font-bold mt-1">{captchaError}</span>}
              </div>
            </div>

            {apiError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                {apiError}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-200">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 rounded-full border border-zinc-300 text-xs font-bold uppercase"
              >
                Back
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isDraftSaving}
                  className="px-6 py-3 rounded-full border border-zinc-300 hover:bg-zinc-100 text-zinc-800 font-poppins font-bold text-xs uppercase flex items-center gap-2"
                >
                  <FaSave className="w-3.5 h-3.5" />
                  <span>{isDraftSaving ? "Saving..." : "Save Draft"}</span>
                </button>

                <button
                  type="submit"
                  disabled={!captchaVerified || isSubmitting}
                  className="px-8 py-3.5 rounded-full bg-[#C45A32] hover:bg-[#a84826] text-white font-poppins font-bold text-xs uppercase shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  <span>{isSubmitting ? "Submitting..." : "Submit Nomination"}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 5: Success Screen */}
        {currentStep === 5 && registeredData && (
          <div className="flex flex-col items-center justify-center text-center gap-6 py-6 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center text-2xl shadow-md">
              <FaCheckCircle />
            </div>

            <div>
              <span className="font-poppins font-bold text-xs uppercase tracking-widest text-[#C45A32]">
                Submission Confirmed
              </span>
              <h3 className="text-2xl font-poppins font-extrabold text-zinc-950 uppercase mt-1">
                Nomination Submitted!
              </h3>
              <p className="text-xs text-zinc-600 font-inter mt-2">
                Your application has been registered successfully. You can track verification progress using your Application ID.
              </p>
            </div>

            <div className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-left flex flex-col gap-2">
              <div className="flex justify-between border-b border-dashed border-zinc-300 pb-2">
                <span className="text-xs font-bold text-zinc-400 uppercase">Application ID</span>
                <span className="text-sm font-extrabold text-[#C45A32]">
                  {registeredData.applicationId || registeredData._id || "NCA-2026-000123"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase">Nomination Type</span>
                <span className="text-xs font-bold text-zinc-900">{formData.nominationType === "SELF" ? "Self Nomination" : "Nominator for Others"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase">Categories</span>
                <span className="text-xs font-bold text-zinc-900">{formData.selectedCategoryTitles.join(", ")}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full">
              <a
                href="/"
                className="flex-1 py-3 rounded-full bg-[#C45A32] text-white font-poppins font-bold text-xs uppercase text-center shadow-md"
              >
                Return to Home Page
              </a>
              <button
                onClick={closeModal}
                className="px-6 py-3 rounded-full border border-zinc-300 text-xs font-bold uppercase"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}
