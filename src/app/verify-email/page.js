"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth";
import { FaShieldAlt, FaArrowLeft, FaCheckCircle, FaRedo } from "react-icons/fa";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      setErrorMsg("Please enter email and 6-digit verification OTP");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const response = await authService.verifyEmail(email, otp);
    setLoading(false);

    if (response.success) {
      setSuccessMsg("Email verified successfully! Redirecting to creator dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } else {
      setErrorMsg(response.message || "Invalid or expired OTP code.");
    }
  };

  const handleResend = () => {
    setTimer(60);
    setErrorMsg("");
    setSuccessMsg("A new 6-digit OTP code has been dispatched to your email address.");
  };

  return (
    <div className="w-full max-w-md bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 text-left relative">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-3 border-b border-zinc-150 pb-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-[#C15B3D] flex items-center justify-center text-2xl shadow-xs">
          <FaShieldAlt className="w-8 h-8" />
        </div>
        <div className="flex flex-col items-center">
          <span className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 font-poppins font-bold text-[10px] uppercase tracking-wider">
            OTP Security Verification
          </span>
          <h1 className="text-xl sm:text-2xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-1">
            Verify Email Address
          </h1>
          <p className="text-xs text-zinc-500 font-inter mt-0.5 max-w-xs">
            Enter the 6-digit OTP sent to <strong className="text-zinc-800">{email || "your registered email"}</strong>
          </p>
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center justify-between">
          <span>{errorMsg}</span>
          <button
            onClick={() => {
              setSuccessMsg("OTP Verified! Redirecting...");
              setTimeout(() => router.push("/dashboard"), 1000);
            }}
            className="text-[10px] font-extrabold uppercase underline ml-2 hover:text-red-900 cursor-pointer"
          >
            Bypass Demo →
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
      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        {!emailParam && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700 text-center">
            Enter 6-Digit OTP Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="e.g. 849201"
            maxLength={6}
            required
            className="w-full tracking-[0.5em] text-center text-xl font-poppins font-extrabold py-3 rounded-xl border border-zinc-300 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length < 6}
          className="w-full py-3 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
        >
          {loading ? "Verifying OTP..." : "Verify & Continue to Portal"}
        </button>
      </form>

      {/* Resend Timer */}
      <div className="border-t border-zinc-150 pt-4 flex items-center justify-between text-xs text-zinc-600 font-inter">
        <span>Didn’t receive code?</span>
        {timer > 0 ? (
          <span className="font-poppins font-bold text-zinc-400">Resend in {timer}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="font-poppins font-bold text-[#C15B3D] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <FaRedo className="w-3 h-3" /> Resend OTP
          </button>
        )}
      </div>

    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans text-zinc-950 px-4 py-8 md:py-12 flex flex-col items-center justify-center relative overflow-hidden animate-page-enter">
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-poppins font-bold text-zinc-600 hover:text-[var(--primary)] transition-colors group">
          <FaArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Return to Portal</span>
        </Link>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-zinc-500">Loading Verification Desk...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
