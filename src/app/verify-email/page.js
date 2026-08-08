"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaArrowLeft } from "react-icons/fa";

function VerifyEmailForm() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to home after 1 second since Email OTP/Verification is removed
    const timer = setTimeout(() => {
      router.push("/");
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-full max-w-md bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 text-center relative">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-sm">
          <FaCheckCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl sm:text-2xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-2">
          Email Verified
        </h1>
        <p className="text-xs text-zinc-600 font-inter max-w-xs">
          Email verification / OTP is disabled. Your account is automatically verified. Redirecting to portal...
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[var(--primary)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[var(--primary-hover)] transition-all"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Portal</span>
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans text-zinc-950 px-4 py-8 md:py-12 flex flex-col items-center justify-center relative overflow-hidden animate-page-enter">
      <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-zinc-500">Redirecting...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
