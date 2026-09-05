"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FaUserShield,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaCheckCircle,
  FaShieldAlt
} from "react-icons/fa";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, updateUser } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: true });
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
    if (!formData.email || !formData.password) {
      setErrorMsg("Please enter both email address and password");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await login(formData.email, formData.password);

      if (response.success || response.status === 200) {
        setSuccessMsg("Admin Authentication Verified! Opening Admin Dashboard...");

        // Ensure Admin Role in session storage
        const userObj = response.data?.user || response.data?.data?.user || {
          _id: `admin-${Date.now()}`,
          name: "State Governance Admin",
          email: formData.email,
          role: "SUPER_ADMIN"
        };
        const tokenObj = response.data?.accessToken || response.data?.data?.accessToken || "admin-session-token-2026";

        // Enforce Admin role if logging through admin portal
        const adminEnforcedUser = {
          ...userObj,
          role: ["SUPER_ADMIN", "ADMIN", "MODERATOR"].includes(String(userObj.role).toUpperCase())
            ? userObj.role
            : "ADMIN"
        };

        localStorage.setItem("accessToken", tokenObj);
        localStorage.setItem("token", tokenObj);
        localStorage.setItem("adminToken", tokenObj);
        localStorage.setItem("user", JSON.stringify(adminEnforcedUser));
        if (updateUser) updateUser(adminEnforcedUser);

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 600);
      } else {
        // Fallback for direct Admin demo access if backend DB lacks seeded admin
        setErrorMsg(response.message || "Invalid Admin credentials. Try standard Admin email or use quick Admin login.");
      }
    } catch (err) {
      console.error("Admin Login Error:", err);
      setErrorMsg("Unable to connect to Admin authentication service.");
    } finally {
      setLoading(false);
    }
  };

  // Direct Quick Admin Login for testing/demo
  const handleQuickAdminLogin = () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("Bypassing Auth: Accessing Admin Dashboard as SUPER_ADMIN...");

    const adminUser = {
      _id: "admin-super-2026",
      name: "State Governance Admin",
      email: formData.email || "admin@cg.gov.in",
      role: "SUPER_ADMIN",
      district: "Raipur"
    };

    localStorage.setItem("accessToken", "super-admin-session-token-2026");
    localStorage.setItem("user", JSON.stringify(adminUser));
    if (updateUser) updateUser(adminUser);

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans text-zinc-950 px-4 py-8 md:py-12 flex flex-col items-center justify-center relative overflow-hidden animate-page-enter">

      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-[0.02] -z-10">
        <Image src="/assets/images/logoChattisgarh.png" alt="State Watermark" fill sizes="600px" className="object-contain" />
      </div>

      {/* Top Header Navigation */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-poppins font-bold text-zinc-600 hover:text-[var(--primary)] transition-colors group">
          <FaArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Return to Portal</span>
        </Link>
        <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-poppins font-extrabold text-[10px] uppercase tracking-wider border border-rose-200">
          Admin Portal
        </span>
      </div>

      {/* Admin Login Card Container */}
      <div className="w-full max-w-md max-w-[calc(100vw-32px)] bg-white border border-zinc-200/90 rounded-3xl p-5 sm:p-8 shadow-md flex flex-col gap-6 text-left relative overflow-hidden">

        {/* Top Decorative Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#21593D] via-[#E6532B] to-[#21593D]"></div>

        {/* Header Branding */}
        <div className="flex flex-col items-center text-center gap-3 border-b border-zinc-150 pb-5 pt-1">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-[#21593D] flex items-center justify-center font-bold text-2xl border border-emerald-200 shrink-0 shadow-2xs">
            <FaUserShield className="w-7 h-7" />
          </div>
          <div className="flex flex-col items-center">
            <span className="px-3 py-0.5 rounded-full bg-[#21593D]/10 text-[#21593D] font-poppins font-bold text-[10px] uppercase tracking-wider">
              Government of Chhattisgarh
            </span>
            <h1 className="text-xl sm:text-2xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-1">
              Admin Access Portal
            </h1>
            <p className="text-xs text-zinc-500 font-inter mt-0.5">
              Authorized State Award Administrators & Jury Personnel
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-shake">
            <span className="shrink-0 font-bold">⚠️</span>
            <p className="leading-snug">{errorMsg}</p>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="leading-snug">{successMsg}</p>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-poppins font-bold text-zinc-700 uppercase tracking-wider flex items-center justify-between">
              <span>Admin Email Address</span>
              <span className="text-[10px] font-normal text-zinc-400 capitalize">Required</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-zinc-400">
                <FaEnvelope className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@cg.gov.in"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/60 focus:bg-white focus:border-[#21593D] text-xs font-inter text-zinc-900 outline-none transition-all placeholder:text-zinc-400 font-medium"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-poppins font-bold text-zinc-700 uppercase tracking-wider flex items-center justify-between">
              <span>Security Password</span>
              <span className="text-[10px] font-normal text-zinc-400 capitalize">Required</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-zinc-400">
                <FaLock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/60 focus:bg-white focus:border-[#21593D] text-xs font-inter text-zinc-900 outline-none transition-all placeholder:text-zinc-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
              >
                {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between text-xs font-inter pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-zinc-300 text-[#21593D] focus:ring-[#21593D] cursor-pointer"
              />
              <span className="text-zinc-600 font-medium">Keep admin session active</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#21593D] hover:bg-[#18422d] active:scale-[0.99] text-white font-poppins font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Authenticating Admin...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FaShieldAlt className="w-4 h-4" />
                <span>SIGN IN TO ADMIN DASHBOARD</span>
              </span>
            )}
          </button>

          {/* Quick Demo Admin Button */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#E6532B] font-poppins font-bold text-xs border border-orange-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>⚡ Direct Admin Dashboard Access (Demo Mode)</span>
            </button>
          </div>

        </form>
      </div>

      {/* Footer System Info */}
      <p className="text-[11px] font-inter text-zinc-400 mt-8 text-center">
        © 2026 Government of Chhattisgarh • Admin Security Portal
      </p>
    </div>
  );
}
