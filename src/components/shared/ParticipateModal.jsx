"use client";

import { useState, useEffect, useRef } from "react";
import { useParticipateModal } from "@/context/ParticipateModalContext";

export default function ParticipateModal() {
  const { isOpen, closeModal } = useParticipateModal();
  const [step, setStep] = useState(1); // 1: Details, 2: OTP, 3: Success

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    district: "Raipur",
    platform: "Instagram",
    category: "Best Women Creator of the Year",
    submissionLink: "",
    instagram: "",
    youtube: "",
    isNri: false,
    acceptTerms: true,
    acceptEvaluation: true,
  });

  // Errors
  const [errors, setErrors] = useState({});

  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const otpInputsRef = useRef([]);

  // Reset modal state on close
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setFormData({
        name: "",
        email: "",
        phone: "",
        age: "",
        district: "Raipur",
        platform: "Instagram",
        category: "Best Women Creator of the Year",
        submissionLink: "",
        instagram: "",
        youtube: "",
        isNri: false,
        acceptTerms: true,
        acceptEvaluation: true,
      });
      setOtp(["", "", "", "", "", ""]);
      setErrors({});
    }
  }, [isOpen]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  // Handle Text inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate Details Form
  const handleSendOtp = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    } else {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 12 || ageNum > 100) {
        newErrors.age = "Please enter a valid age (12-100)";
      }
    }

    if (!formData.district) newErrors.district = "District is required";
    if (!formData.platform) newErrors.platform = "Platform is required";
    if (!formData.category) newErrors.category = "Award Category is required";

    if (!formData.submissionLink.trim()) {
      newErrors.submissionLink = "Submission link is required";
    } else if (!/^https?:\/\/.+/.test(formData.submissionLink)) {
      newErrors.submissionLink = "Please enter a valid URL (https://...)";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms & privacy policy";
    }
    if (!formData.acceptEvaluation) {
      newErrors.acceptEvaluation = "You must consent to jury evaluation";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Advance to OTP step and start 60s timer
    setStep(2);
    setTimer(60);
  };

  // Handle OTP digit entry
  const handleOtpChange = (value, idx) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[idx] = value.substring(value.length - 1); // keep only last digit
    setOtp(newOtp);

    // Automatically shift focus to next input
    if (value && idx < 5) {
      otpInputsRef.current[idx + 1]?.focus();
    }
  };

  // Handle backspace focus shifting
  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpInputsRef.current[idx - 1]?.focus();
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(60);
    setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
  };

  // Submit OTP Verification
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    
    if (otpCode.length < 6) {
      setErrors({ otp: "Please enter the full 6-digit verification code" });
      return;
    }

    // Success transition
    setErrors({});
    setStep(3);
  };

  const cgDistricts = [
    "Raipur", "Bilaspur", "Durg", "Bastar", "Korba", "Rajnandgaon", 
    "Jagdalpur", "Dhamtari", "Mahasamund", "Kanker", "Kondagaon", 
    "Dantewada", "Sukma", "Bijapur", "Narayanpur", "Kabirdham", 
    "Bemetara", "Balod", "Baloda Bazar", "Gariaband", "Jashpur", 
    "Surguja", "Balrampur", "Surajpur", "Koriya", "Pendra-Marwahi",
    "Manendragarh", "Sakti", "Sarangarh", "Khairagarh", "Mohla-Manpur",
    "Janjgir-Champa", "Mungeli", "Raigarh"
  ];

  const platforms = [
    "Instagram",
    "YouTube",
    "Facebook",
    "Twitter/X",
    "LinkedIn",
    "Other"
  ];

  const categories = [
    "Best Women Creator of the Year",
    "Best Youtube Creator",
    "Best Instagram Creator",
    "Best Emerging Creator",
    "Best Influencer",
    "Best Food Creator",
    "Best Travel Creator",
    "Best Fashion Creator",
    "People's Choice Award"
  ];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto select-none">
      {/* Backdrop overlay */}
      <div 
        onClick={closeModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Card Container (Wide max-w-7xl, non-scrollable rectangle on desktop) */}
      <div className="relative w-full max-w-md md:max-w-5xl lg:max-w-7xl bg-white border-4 border-black rounded-[36px] p-6 sm:p-8 lg:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10 transition-all duration-300 overflow-y-auto max-h-[92vh]">
        
        {/* Close Button */}
        <button 
          onClick={closeModal}
          className="absolute right-4 top-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-black bg-white flex items-center justify-center text-zinc-950 font-bold hover:bg-[#F3819F] shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] transition-all cursor-pointer z-50"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* STEP 1: Details Registration Form */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-6 text-left">
            <div>
              <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#F87C22]">
                Official Nomination Form
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase text-zinc-950 mt-1 leading-tight">
                Creator Registration
              </h2>
            </div>

            {/* 3-Column Responsive Grid Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-4">
              
              {/* Row 1: Name, Email, Phone */}
              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label className="text-zinc-700 font-extrabold text-[11px] uppercase tracking-wider">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full legal name"
                    className={`w-full rounded-xl border border-zinc-200 bg-[#F4F7FC]/50 focus:bg-white pl-11 pr-4 py-3 text-xs sm:text-sm font-semibold text-zinc-950 focus:outline-none focus:ring-2 focus:ring-[#FFA025] transition-all ${
                      errors.name ? "border-red-500 bg-red-50/20" : ""
                    }`}
                  />
                </div>
                {errors.name && <span className="text-red-500 text-[10px] font-bold pl-1">{errors.name}</span>}
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1">
                <label className="text-zinc-700 font-extrabold text-[11px] uppercase tracking-wider">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full rounded-xl border border-zinc-200 bg-[#F4F7FC]/50 focus:bg-white pl-11 pr-4 py-3 text-xs sm:text-sm font-semibold text-zinc-950 focus:outline-none focus:ring-2 focus:ring-[#FFA025] transition-all ${
                      errors.email ? "border-red-500 bg-red-50/20" : ""
                    }`}
                  />
                </div>
                {errors.email && <span className="text-red-500 text-[10px] font-bold pl-1">{errors.email}</span>}
              </div>

              {/* Mobile Phone */}
              <div className="flex flex-col gap-1">
                <label className="text-zinc-700 font-extrabold text-[11px] uppercase tracking-wider">
                  Mobile Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    className={`w-full rounded-xl border border-zinc-200 bg-[#F4F7FC]/50 focus:bg-white pl-11 pr-4 py-3 text-xs sm:text-sm font-semibold text-zinc-950 focus:outline-none focus:ring-2 focus:ring-[#FFA025] transition-all ${
                      errors.phone ? "border-red-500 bg-red-50/20" : ""
                    }`}
                  />
                </div>
                {errors.phone && <span className="text-red-500 text-[10px] font-bold pl-1">{errors.phone}</span>}
              </div>

              {/* Row 2: Age, District, Platform */}
              {/* Age */}
              <div className="flex flex-col gap-1">
                <label className="text-zinc-700 font-extrabold text-[11px] uppercase tracking-wider">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="25"
                  className={`w-full rounded-xl border border-zinc-200 bg-[#F4F7FC]/50 focus:bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-950 focus:outline-none focus:ring-2 focus:ring-[#FFA025] transition-all ${
                    errors.age ? "border-red-500 bg-red-50/20" : ""
                  }`}
                />
                {errors.age && <span className="text-red-500 text-[10px] font-bold pl-1">{errors.age}</span>}
              </div>

              {/* District Select */}
              <div className="flex flex-col gap-1">
                <label className="text-zinc-700 font-extrabold text-[11px] uppercase tracking-wider">
                  District (Chhattisgarh) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-zinc-200 bg-[#F4F7FC]/50 px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-950 focus:outline-none focus:ring-2 focus:ring-[#FFA025] transition-all appearance-none cursor-pointer"
                  >
                    {cgDistricts.map((dist, idx) => (
                      <option key={idx} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Primary Content Platform */}
              <div className="flex flex-col gap-1">
                <label className="text-zinc-700 font-extrabold text-[11px] uppercase tracking-wider">
                  Primary Content Platform <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-zinc-200 bg-[#F4F7FC]/50 px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-950 focus:outline-none focus:ring-2 focus:ring-[#FFA025] transition-all appearance-none cursor-pointer"
                  >
                    {platforms.map((plat, idx) => (
                      <option key={idx} value={plat}>
                        {plat}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Row 3: Category (Col 1), Submission Link (Col 2-3) */}
              {/* Award Category Select */}
              <div className="flex flex-col gap-1">
                <label className="text-zinc-700 font-extrabold text-[11px] uppercase tracking-wider">
                  Award Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-zinc-200 bg-[#F4F7FC]/50 px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-950 focus:outline-none focus:ring-2 focus:ring-[#FFA025] transition-all appearance-none cursor-pointer"
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content Submission Link (spans 2 columns on desktop) */}
              <div className="flex flex-col gap-1 lg:col-span-2">
                <label className="text-zinc-700 font-extrabold text-[11px] uppercase tracking-wider">
                  Content Submission Link <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    name="submissionLink"
                    value={formData.submissionLink}
                    onChange={handleChange}
                    placeholder="https://instagram.com/p/..."
                    className={`w-full rounded-xl border border-zinc-200 bg-[#F4F7FC]/50 focus:bg-white pl-11 pr-4 py-3 text-xs sm:text-sm font-semibold text-zinc-950 focus:outline-none focus:ring-2 focus:ring-[#FFA025] transition-all ${
                      errors.submissionLink ? "border-red-500 bg-red-50/20" : ""
                    }`}
                  />
                </div>
                {errors.submissionLink && <span className="text-red-500 text-[10px] font-bold pl-1">{errors.submissionLink}</span>}
              </div>

              {/* Row 4: Instagram (Col 1), YouTube (Col 2-3) */}
              {/* Instagram Handle / Link */}
              <div className="flex flex-col gap-1">
                <label className="text-zinc-700 font-extrabold text-[11px] uppercase tracking-wider text-zinc-400">
                  Instagram Handle / Link
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/username"
                  className="w-full rounded-xl border border-zinc-200 bg-[#F4F7FC]/50 focus:bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-950 focus:outline-none focus:ring-2 focus:ring-[#FFA025] transition-all"
                />
              </div>

              {/* YouTube Channel Link (spans 2 columns on desktop) */}
              <div className="flex flex-col gap-1 lg:col-span-2">
                <label className="text-zinc-700 font-extrabold text-[11px] uppercase tracking-wider text-zinc-400">
                  YouTube Channel Link
                </label>
                <input
                  type="text"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  placeholder="https://youtube.com/c/channel"
                  className="w-full rounded-xl border border-zinc-200 bg-[#F4F7FC]/50 focus:bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-950 focus:outline-none focus:ring-2 focus:ring-[#FFA025] transition-all"
                />
              </div>

            </div>

            {/* Bottom Row: Checkboxes on the Left, Submit Button on the Right */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mt-4 border-t border-zinc-100 pt-4">
              
              {/* Checkboxes Block (Left side) */}
              <div className="flex flex-col gap-2.5">
                {/* International / NRI */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="isNri"
                    checked={formData.isNri}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-zinc-300 text-[#FFA025] focus:ring-[#FFA025] cursor-pointer"
                  />
                  <span className="font-sans font-bold text-[11px] uppercase tracking-wide text-zinc-700 leading-none">
                    I am an International / NRI Creator
                  </span>
                </label>

                {/* Accept Terms */}
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-zinc-300 text-[#FFA025] focus:ring-[#FFA025] cursor-pointer"
                    />
                    <span className="font-sans font-semibold text-[11px] text-zinc-600 leading-none">
                      I accept the <strong className="text-zinc-900 font-bold">Privacy Policy</strong> and contest terms. <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {errors.acceptTerms && <span className="text-red-500 text-[10px] font-bold pl-7">{errors.acceptTerms}</span>}
                </div>

                {/* Consent Evaluation */}
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="acceptEvaluation"
                      checked={formData.acceptEvaluation}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-zinc-300 text-[#FFA025] focus:ring-[#FFA025] cursor-pointer"
                    />
                    <span className="font-sans font-semibold text-[11px] text-zinc-600 leading-none">
                      I consent to content evaluation by official jury. <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {errors.acceptEvaluation && <span className="text-red-500 text-[10px] font-bold pl-7">{errors.acceptEvaluation}</span>}
                </div>
              </div>

              {/* Submit Button Block (Right side) */}
              <button
                type="submit"
                className="w-full lg:w-[320px] rounded-xl bg-[#FFA025] hover:bg-[#E28E1D] py-3.5 text-sm font-bold text-white hover:shadow-[0_4px_12px_rgba(250,158,27,0.3)] transition-all cursor-pointer select-none text-center flex items-center justify-center gap-2 shrink-0"
              >
                <svg className="w-4 h-4 fill-current rotate-45 transform translate-y-[-1px] translate-x-[-1px]" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                <span>SEND VERIFICATION OTP</span>
              </button>

            </div>

          </form>
        )}

        {/* STEP 2: OTP Verification Screen */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6 text-left max-w-md mx-auto py-4">
            <div>
              <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#F87C22]">
                Verification Code
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase text-zinc-950 mt-1 leading-tight">
                Enter OTP
              </h2>
              <p className="text-zinc-500 font-semibold text-xs sm:text-sm mt-2">
                We sent a 6-digit confirmation code to <span className="text-zinc-950 font-bold">+91 {formData.phone}</span>.
              </p>
            </div>

            {/* OTP Grid */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 sm:gap-3 justify-center">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (otpInputsRef.current[idx] = el)}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-3 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-[#FFA025] transition-all"
                  />
                ))}
              </div>
              {errors.otp && <span className="text-red-500 text-xs font-bold text-center pl-1">{errors.otp}</span>}

              {/* Resend Actions */}
              <div className="text-center mt-2 select-none">
                {timer > 0 ? (
                  <span className="text-zinc-500 text-xs sm:text-sm font-semibold">
                    Resend code in <strong className="text-zinc-900 font-bold">{timer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[#FFA025] hover:text-[#d3821a] text-xs sm:text-sm font-bold underline cursor-pointer"
                  >
                    Resend OTP Code
                  </button>
                )}
              </div>
            </div>

            {/* Submit & Back Action Row */}
            <div className="flex flex-col gap-3 mt-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-[#6EC192] hover:bg-[#52a674] py-3.5 text-sm font-bold text-white hover:shadow-[0_4px_12px_rgba(110,193,146,0.3)] transition-all cursor-pointer select-none text-center"
              >
                Confirm & Register
              </button>
              
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full rounded-xl border-2 border-zinc-300 bg-white py-3 text-xs sm:text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-all cursor-pointer select-none text-center"
              >
                Back to Details
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Success Screen */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center text-center gap-6 py-4 max-w-md mx-auto">
            
            {/* Checkmark badge */}
            <div className="w-20 h-20 rounded-full border-3 border-black bg-[#6EC192] flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-bounce select-none">
              <svg className="w-10 h-10 text-zinc-950 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <div>
              <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#F87C22]">
                Congratulations!
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase text-zinc-950 mt-1 leading-tight">
                Nomination Registered
              </h2>
              <p className="text-zinc-600 font-semibold text-sm leading-relaxed mt-4 max-w-sm">
                Thank you for participating! Your details have been recorded successfully. We will contact you soon on verification.
              </p>
            </div>

            {/* Registration Ticket Details */}
            <div className="w-full bg-[#F4F7FC]/50 border border-zinc-200 rounded-2xl p-4 sm:p-5 text-left flex flex-col gap-2 mt-2">
              <div className="flex justify-between border-b border-dashed border-zinc-300 pb-2">
                <span className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase">Reg ID</span>
                <span className="text-xs sm:text-sm font-bold text-zinc-900">#CWA-2026-89712</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase">Nominee</span>
                <span className="text-xs sm:text-sm font-bold text-zinc-900 truncate max-w-[200px]">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase">Category</span>
                <span className="text-xs sm:text-sm font-bold text-[#FFA025] truncate max-w-[200px]">{formData.category}</span>
              </div>
            </div>

            {/* Close window */}
            <button
              onClick={closeModal}
              className="w-full mt-4 rounded-xl bg-[#FFA025] hover:bg-[#E28E1D] py-3.5 text-sm font-bold text-white hover:shadow-[0_4px_12px_rgba(250,158,27,0.3)] transition-all cursor-pointer select-none text-center"
            >
              Close Window
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
