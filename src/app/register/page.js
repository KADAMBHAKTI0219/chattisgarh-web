"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { locationService } from "@/services/location";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaCheckCircle,
  FaShieldAlt,
  FaRedo,
  FaInstagram,
  FaVideo
} from "react-icons/fa";
import DownloadGuidelinesButton from "@/components/common/DownloadGuidelinesButton";

// Generator for random 6-character Captcha Code
const generateCaptchaCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function RegisterPage() {
  const router = useRouter();

  const [apiLocations, setApiLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "Chhattisgarh",
    district: "Raipur",
    role: "CREATOR",
    password: "",
    confirmPassword: "",
    instagramLink: "",
    videoLink: "",
    portfolioUrl: "",
    gender: "Prefer Not to Say",
    agreeTerms: true,
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Public Locations Dynamically from Backend API
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

  // Helper to normalize state names for matching (e.g. "Chattisgarh" vs "Chhattisgarh")
  const normalizeStateName = (name) => {
    if (!name) return "";
    const s = name.trim().toLowerCase();
    if (s.includes("chattisgarh") || s.includes("chhattisgarh") || s === "cg") {
      return "chhattisgarh";
    }
    return s;
  };

  // Available States List - SSR matched initial state, updated dynamically from Backend API on client mount
  const availableStates = useMemo(() => {
    if (Array.isArray(apiLocations) && apiLocations.length > 0) {
      const states = apiLocations.map((l) => l.stateName);
      return Array.from(new Set(states)).sort();
    }
    return formData.state ? [formData.state] : ["Chhattisgarh"];
  }, [apiLocations, formData.state]);

  // Available Districts / Cities List for Selected State - SSR matched initial district, updated dynamically
  const availableDistricts = useMemo(() => {
    if (formData.state) {
      const normState = normalizeStateName(formData.state);
      if (Array.isArray(apiLocations) && apiLocations.length > 0) {
        const locObj = apiLocations.find(
          (l) => normalizeStateName(l.stateName) === normState || l.stateName.toLowerCase() === formData.state.trim().toLowerCase()
        );
        if (locObj && Array.isArray(locObj.cities) && locObj.cities.length > 0) {
          const validCities = locObj.cities
            .filter((c) => c.isActive !== false)
            .map((c) => c.cityName || c);
          if (validCities.length > 0) return validCities;
        }
      }
    }
    return formData.district ? [formData.district] : ["Raipur"];
  }, [apiLocations, formData.state, formData.district]);

  // Sync state & district to first available backend state on API load
  useEffect(() => {
    if (availableStates.length > 0 && formData.state) {
      if (!availableStates.includes(formData.state)) {
        const matched = availableStates.find((st) => normalizeStateName(st) === normalizeStateName(formData.state));
        if (matched) {
          setFormData((prev) => ({ ...prev, state: matched }));
        } else {
          setFormData((prev) => ({ ...prev, state: availableStates[0] }));
        }
      }
    }
  }, [apiLocations, availableStates]);

  // Auto-sync selected district when selected state changes
  useEffect(() => {
    if (availableDistricts.length > 0) {
      if (!formData.district || !availableDistricts.includes(formData.district)) {
        setFormData((prev) => ({
          ...prev,
          district: availableDistricts[0],
        }));
      }
    }
  }, [availableDistricts]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Custom Security Captcha State
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  // Generate initial Captcha Code on component mount
  useEffect(() => {
    setCaptchaCode(generateCaptchaCode());
  }, []);

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptchaCode());
    setCaptchaInput("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setErrorMsg("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (!formData.agreeTerms) {
      setErrorMsg("You must accept the terms and guidelines to register");
      return;
    }

    // Security Captcha Match Validation
    const cleanInput = captchaInput.trim().toUpperCase();
    const cleanCode = captchaCode.trim().toUpperCase();

    if (!captchaInput || cleanInput !== cleanCode) {
      setErrorMsg("Incorrect CAPTCHA entered! A new 6-character code has been generated. Please try again.");
      refreshCaptcha(); // Refresh Captcha on failed attempt
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      state: formData.state,
      district: formData.district,
      role: formData.role,
      password: formData.password,
      instagramLink: formData.instagramLink,
      instagramUrl: formData.instagramLink,
      videoLink: formData.videoLink,
      instagramReelUrl: formData.videoLink,
      portfolioUrl: formData.portfolioUrl,
      gender: formData.gender,
      captchaId: "OFFLINE_CAPTCHA_ID",
      captchaText: captchaCode,
      captchaToken: "OFFLINE_CAPTCHA_PASS_2026",
    };

    const response = await authService.register(payload);
    setLoading(false);

    if (response.success || response.status === 201 || response.data) {
      setSuccessMsg("Registration successful! Redirecting to Website...");

      // Save tokens/user session with CREATOR role for instant user dashboard access
      const resultData = response.data || response;
      const userObj = resultData?.user || {
        _id: `u-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        state: formData.state,
        district: formData.district,
        role: "CREATOR",
        status: "Active",
        instagramLink: formData.instagramLink,
        instagramUrl: formData.instagramLink,
        videoLink: formData.videoLink,
        instagramReelUrl: formData.videoLink,
        portfolioUrl: formData.portfolioUrl,
        gender: formData.gender,
        createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      };
      const tokenObj = resultData?.accessToken || "creator-session-token";

      // Also persist into registered_users array in localStorage for admin panel sync
      try {
        const existingRegs = JSON.parse(localStorage.getItem("registered_users") || "[]");
        const filteredRegs = existingRegs.filter(u => u.email !== userObj.email);
        localStorage.setItem("registered_users", JSON.stringify([userObj, ...filteredRegs]));
      } catch (e) {
        console.warn("Failed to update registered_users:", e);
      }

      localStorage.setItem("accessToken", tokenObj);
      localStorage.setItem("user", JSON.stringify(userObj));

      setTimeout(() => {
        window.location.href = "/";
      }, 600);
    } else {
      setErrorMsg(response.message || "Registration failed. Please check your details.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] bg-tribal-watermark font-sans text-zinc-950 px-4 sm:px-6 md:px-8 py-6 md:py-8 flex flex-col items-center justify-center relative overflow-hidden animate-page-enter">

      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none opacity-[0.015] -z-10">
        <Image src="/assets/images/logoChattisgarh.png" alt="State Watermark" fill sizes="(max-width: 768px) 100vw, 700px" className="object-contain" />
      </div>

      {/* Top Header Navigation */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-4 z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-poppins font-bold text-zinc-600 hover:text-[var(--primary)] transition-colors group">
          <FaArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Return to Main Portal</span>
        </Link>
        <span className="text-[10px] sm:text-xs font-inter font-bold text-zinc-500 uppercase tracking-widest">
          Official State Registration Portal
        </span>
      </div>

      {/* 3-Column Wide Horizontal Card (No Page Scroll - Fits 1 Screen) */}
      <div className="w-full max-w-6xl bg-white border border-zinc-200/90 rounded-3xl p-5 sm:p-7 shadow-xl flex flex-col gap-4 text-left relative z-10">

        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-150 pb-4">
          <div className="flex items-center gap-3.5">
            <Image
              src="/assets/images/logoChattisgarh.png"
              alt="Government of Chhattisgarh Logo"
              width={180}
              height={55}
              className="h-11 sm:h-12 w-auto object-contain shrink-0"
            />
            <div className="flex flex-col text-left border-l-2 border-[#C15B3D]/30 pl-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-poppins font-bold text-[9.5px] uppercase tracking-wider w-fit">
                State Creator Awards 2026
              </span>
              <h1 className="text-lg sm:text-xl md:text-2xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-0.5">
                State Creator Registration
              </h1>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex flex-col text-left sm:text-right">
              <span className="font-poppins font-extrabold text-xs text-[var(--primary)]">
                हर एक स्क्रीन पर छाएगा छत्तीसगढ़
              </span>
            </div>
            <DownloadGuidelinesButton size="md" variant="primary" />
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center justify-between">
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 3-Column Compact Form Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3.5">

          {/* Row 1: Column 1 - Full Legal Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-inter font-bold uppercase tracking-wider text-zinc-700">
              Full Legal Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar Sahu"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          {/* Row 1: Column 2 - Email Address */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-inter font-bold uppercase tracking-wider text-zinc-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          {/* Row 1: Column 3 - Mobile Number */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-inter font-bold uppercase tracking-wider text-zinc-700">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile"
                maxLength={10}
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          {/* Row 2: Column 1 - State Location */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-inter font-bold uppercase tracking-wider text-zinc-700">
              State Location
            </label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                {availableStates.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Column 2 - District Location */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-inter font-bold uppercase tracking-wider text-zinc-700">
              District Location
            </label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Column 2 - Account Role */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-inter font-bold uppercase tracking-wider text-zinc-700">
              Account Role / Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="CREATOR">Digital Creator / Nominee (CREATOR)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Column 3 - Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-inter font-bold uppercase tracking-wider text-zinc-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                required
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Row 3: Column 1 - Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-inter font-bold uppercase tracking-wider text-zinc-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                required
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          {/* Row 4: Full Width Security Captcha Box (Span 3 Columns) */}
          <div className="md:col-span-3 flex flex-col justify-center gap-1.5 p-3 bg-zinc-50 border border-zinc-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-inter font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                <FaShieldAlt className="w-3.5 h-3.5 text-emerald-600" />
                <span>Security Captcha Verification <span className="text-red-500">*</span></span>
              </label>
              <span className="text-[10px] text-zinc-400 font-medium">Type 6 characters code</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              {/* Visual Captcha Display Box */}
              <div className="relative flex items-center justify-between px-3.5 py-2 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-950 text-white rounded-xl border border-zinc-300 shadow-inner select-none overflow-hidden w-full sm:w-auto shrink-0">
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px]" />

                <div className="flex items-center gap-1.5 relative z-10 font-mono font-black text-lg tracking-widest italic select-none">
                  {captchaCode.split("").map((char, index) => (
                    <span
                      key={index}
                      style={{
                        transform: `rotate(${((index % 2 === 0 ? 1 : -1) * (6 + (index * 2)))}deg)`,
                        color: ["#F87171", "#60A5FA", "#34D399", "#FBBF24", "#C084FC"][index % 5]
                      }}
                      className="inline-block drop-shadow-md select-none"
                    >
                      {char}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="ml-2.5 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0 z-10"
                  title="Generate New Captcha Code"
                >
                  <FaRedo className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Captcha Input */}
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => {
                  setCaptchaInput(e.target.value.toUpperCase());
                  setErrorMsg("");
                }}
                placeholder="Type 6-character code"
                maxLength={6}
                required
                className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-xs font-mono font-bold tracking-widest text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] uppercase"
              />
            </div>
          </div>

          {/* Row 4: Full Width Actions & Guidelines */}
          <div className="md:col-span-3 border-t border-zinc-150 pt-3 mt-1 flex flex-col sm:flex-row items-center justify-between gap-3">

            {/* Terms Checkbox */}
            <label className="flex items-center gap-2 text-xs text-zinc-600 font-medium cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer shrink-0"
              />
              <span>I declare all information is true and agree to State Creator Awards guidelines.</span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || captchaInput.length < 6}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--primary-hover)] hover:to-[var(--secondary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {loading ? "Creating Creator Account..." : "Register Creator Account →"}
            </button>

          </div>

        </form>

        {/* Footer Login Link */}
        <div className="border-t border-zinc-150 pt-3 text-center">
          <p className="text-xs text-zinc-600 font-inter">
            Already have an account?{" "}
            <Link href="/login" className="font-poppins font-bold text-[#C15B3D] hover:underline">
              Sign In Here →
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
