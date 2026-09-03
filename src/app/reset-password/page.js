"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth";
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (tokenParam) setToken(tokenParam);
  }, [tokenParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !newPassword) {
      setErrorMsg("Please enter reset token and new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const response = await authService.resetPassword(token, newPassword);
    setLoading(false);

    if (response.success) {
      setSuccessMsg("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } else {
      setErrorMsg(response.message || "Invalid or expired reset token");
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 text-left relative">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-3 border-b border-zinc-150 pb-5">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-[#21593D] flex items-center justify-center text-2xl shadow-xs">
          <FaLock className="w-7 h-7" />
        </div>
        <div className="flex flex-col items-center">
          <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-poppins font-bold text-[10px] uppercase tracking-wider">
            Secure Account Recovery
          </span>
          <h1 className="text-xl sm:text-2xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-1">
            Set New Password
          </h1>
          <p className="text-xs text-zinc-500 font-inter mt-0.5 max-w-xs">
            Enter your new password to regain access to your creator dashboard.
          </p>
        </div>
      </div>

      {/* Messages */}
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!tokenParam && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
              Reset Token Code
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste reset token from email"
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              required
              className="w-full pl-11 pr-11 py-3 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
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

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              required
              className="w-full pl-11 pr-11 py-3 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
        >
          {loading ? "Resetting Password..." : "Update Password & Login"}
        </button>
      </form>

      <div className="border-t border-zinc-150 pt-4 text-center">
        <p className="text-xs text-zinc-600 font-inter">
          Back to{" "}
          <Link href="/login" className="font-poppins font-bold text-[#C15B3D] hover:underline">
            Sign In Screen
          </Link>
        </p>
      </div>

    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans text-zinc-950 px-4 py-8 md:py-12 flex flex-col items-center justify-center relative overflow-hidden animate-page-enter">
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <Link href="/login" className="inline-flex items-center gap-2 text-xs font-poppins font-bold text-zinc-600 hover:text-[var(--primary)] transition-colors group">
          <FaArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Login</span>
        </Link>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-zinc-500">Loading Password Recovery Desk...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
