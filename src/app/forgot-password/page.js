"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/services/auth";
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaKey } from "react-icons/fa";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter your registered email address");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const response = await authService.forgotPassword(email);
    setLoading(false);

    if (response.success) {
      setSuccessMsg(response.message || "A password reset link has been dispatched to your email address.");
    } else {
      setErrorMsg(response.message || "Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans text-zinc-950 px-4 py-8 md:py-12 flex flex-col items-center justify-center relative overflow-hidden animate-page-enter">
      
      {/* Return Link */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <Link href="/login" className="inline-flex items-center gap-2 text-xs font-poppins font-bold text-zinc-600 hover:text-[var(--primary)] transition-colors group">
          <FaArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Login</span>
        </Link>
        <span className="text-[10px] font-inter font-bold text-zinc-500 uppercase tracking-widest">
          Account Recovery
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 text-left relative">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 border-b border-zinc-150 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-[#C15B3D] flex items-center justify-center text-2xl shadow-xs">
            <FaKey className="w-7 h-7" />
          </div>
          <div className="flex flex-col items-center">
            <span className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 font-poppins font-bold text-[10px] uppercase tracking-wider">
              Password Recovery
            </span>
            <h1 className="text-xl sm:text-2xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-1">
              Forgot Password?
            </h1>
            <p className="text-xs text-zinc-500 font-inter mt-0.5 max-w-xs">
              Enter your registered email address to receive password reset instructions.
            </p>
          </div>
        </div>

        {/* Feedback Messages */}
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
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
              Registered Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? "Sending Reset Link..." : "Send Reset Instructions"}
          </button>
        </form>

        <div className="border-t border-zinc-150 pt-4 text-center">
          <p className="text-xs text-zinc-600 font-inter">
            Remembered your password?{" "}
            <Link href="/login" className="font-poppins font-bold text-[#C15B3D] hover:underline">
              Return to Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
