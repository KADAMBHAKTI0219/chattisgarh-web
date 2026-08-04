"use client";

import Link from "next/link";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 py-16 flex flex-col items-center justify-center text-center gap-6 animate-page-enter">
      <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl shadow-md">
        <FaExclamationTriangle className="w-10 h-10" />
      </div>

      <span className="px-3.5 py-1 rounded-full bg-red-50 text-red-700 font-poppins font-bold text-xs uppercase tracking-widest border border-red-200">
        404 Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight max-w-lg">
        The Page You Are Looking For Does Not Exist
      </h1>

      <p className="text-xs sm:text-sm text-zinc-600 font-inter max-w-md leading-relaxed">
        The link may be broken or the page has been moved. Please return to the official homepage or explore award categories.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          href="/"
          className="px-7 py-3 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center gap-2"
        >
          <FaHome className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          href="/categories"
          className="px-7 py-3 rounded-full bg-white border border-zinc-300 hover:border-[var(--primary)] text-zinc-800 font-poppins font-bold text-xs uppercase tracking-wider transition-all"
        >
          Explore Award Categories
        </Link>
      </div>
    </div>
  );
}
