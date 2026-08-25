"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
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

    const response = await login(formData.email, formData.password);
    setLoading(false);

    if (response.success) {
      const loggedUser = response.data?.user || response.data?.data?.user;
      const roleUpper = String(loggedUser?.role || "").toUpperCase();
      const isAdminRole = ["SUPER_ADMIN", "ADMIN", "MODERATOR", "JURY"].includes(roleUpper);

      setSuccessMsg(
        isAdminRole
          ? "Admin Login Successful! Redirecting to Admin Dashboard..."
          : "Login Successful! Redirecting to Website..."
      );
      setTimeout(() => {
        router.push(isAdminRole ? "/dashboard" : "/");
      }, 800);
    } else {
      setErrorMsg(response.message || "Invalid credentials. Please check your email and password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans text-zinc-950 px-4 py-8 md:py-12 flex flex-col items-center justify-center relative overflow-hidden animate-page-enter">
      
      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-[0.02] -z-10">
        <Image src="/assets/images/logoChattisgarh.png" alt="State Watermark" fill sizes="(max-width: 768px) 100vw, 600px" className="object-contain" />
      </div>

      {/* Return Home Button */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-poppins font-bold text-zinc-600 hover:text-[var(--primary)] transition-colors group">
          <FaArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Return to Portal</span>
        </Link>
        <span className="text-[10px] font-inter font-bold text-zinc-500 uppercase tracking-widest">
          Official Creator Portal
        </span>
      </div>

      {/* Login Card Container */}
      <div className="w-full max-w-md max-w-[calc(100vw-32px)] bg-white border border-zinc-200/90 rounded-3xl p-5 sm:p-8 shadow-sm flex flex-col gap-6 text-left relative overflow-hidden">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center gap-3 border-b border-zinc-150 pb-5">
          <Image
            src="/assets/images/logoChattisgarh.png"
            alt="Government of Chhattisgarh Logo"
            width={200}
            height={60}
            className="h-12 w-auto object-contain"
          />
          <div className="flex flex-col items-center">
            <span className="px-3 py-0.5 rounded-full bg-[#C15B3D]/10 text-[#C15B3D] font-poppins font-bold text-[10px] uppercase tracking-wider">
              Chhattisgarh State Awards 2026
            </span>
            <h1 className="text-xl sm:text-2xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-1">
              Creator Login
            </h1>
            <p className="text-xs text-zinc-500 font-inter mt-0.5">
              Sign in to manage your nominations and certificates
            </p>
          </div>
        </div>



        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center justify-between">
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 bg-zinc-50/50 text-base sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
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
                placeholder="Enter your account password"
                required
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-zinc-300 bg-zinc-50/50 text-base sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-zinc-600 font-medium cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
              />
              <span>Remember me</span>
            </label>

            <Link href="/forgot-password" className="text-xs font-poppins font-bold text-[var(--primary)] hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer mt-2 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In to Portal"}
          </button>
        </form>

        {/* Register Redirect CTA */}
        <div className="border-t border-zinc-150 pt-4 text-center">
          <p className="text-xs text-zinc-600 font-inter">
            Don’t have a creator account yet?{" "}
            <Link href="/register" className="font-poppins font-bold text-[#21593D] hover:underline">
              Register Here →
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
