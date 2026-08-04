"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    district: "Raipur",
    role: "CREATOR",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const response = await authService.register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      district: formData.district,
      role: formData.role,
      password: formData.password,
    });

    setLoading(false);

    if (response.success || response.status === 201) {
      setSuccessMsg("Registration successful! Redirecting to Login...");
      setTimeout(() => {
        router.push(`/login?email=${encodeURIComponent(formData.email)}&registered=true`);
      }, 1000);
    } else {
      setErrorMsg(response.message || "Registration failed. Please check your details.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans text-zinc-950 px-4 py-8 md:py-12 flex flex-col items-center justify-center relative overflow-hidden animate-page-enter">
      
      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-[0.02] -z-10">
        <Image src="/assets/images/logoChattisgarh.png" alt="State Watermark" fill className="object-contain" />
      </div>

      {/* Return Home Link */}
      <div className="w-full max-w-lg flex items-center justify-between mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-poppins font-bold text-zinc-600 hover:text-[var(--primary)] transition-colors group">
          <FaArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Return to Portal</span>
        </Link>
        <span className="text-[10px] font-inter font-bold text-zinc-500 uppercase tracking-widest">
          Official State Registration
        </span>
      </div>

      {/* Registration Card Container */}
      <div className="w-full max-w-lg bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 text-left relative">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 border-b border-zinc-150 pb-5">
          <Image
            src="/assets/images/logoChattisgarh.png"
            alt="Government of Chhattisgarh Logo"
            width={200}
            height={60}
            className="h-12 w-auto object-contain"
          />
          <div className="flex flex-col items-center">
            <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-poppins font-bold text-[10px] uppercase tracking-wider">
              Create Creator Account
            </span>
            <h1 className="text-xl sm:text-2xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-1">
              State Creator Registration
            </h1>
            <p className="text-xs text-zinc-500 font-inter mt-0.5">
              Register to participate in the Chhattisgarh Creator Awards 2026
            </p>
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              onClick={() => {
                router.push(`/verify-email?email=${encodeURIComponent(formData.email || "demo@cg.gov.in")}`);
              }}
              className="text-[10px] font-extrabold uppercase underline ml-2 hover:text-red-900 cursor-pointer"
            >
              Skip to Verification →
            </button>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
              Full Legal Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar Sahu"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile"
                maxLength={10}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
              District Location
            </label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                {["Raipur", "Bastar", "Durg", "Bilaspur", "Surguja", "Rajnandgaon", "Korba", "Raigarh", "Kanker", "Kondagaon"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
              Account Role / Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="CREATOR">Digital Creator / Nominee (CREATOR)</option>
                <option value="MODERATOR">Department Moderator (MODERATOR)</option>
                <option value="JURY">Evaluation Jury Member (JURY)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                required
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                required
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          <div className="sm:col-span-2 pt-2">
            <label className="flex items-start gap-2.5 text-xs text-zinc-600 font-medium cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer shrink-0"
              />
              <span>I declare all information is true and agree to the State Creator Awards guidelines.</span>
            </label>
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Register & Request OTP"}
            </button>
          </div>

        </form>

        <div className="border-t border-zinc-150 pt-4 text-center">
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
