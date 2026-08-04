"use client";

import Link from "next/link";
import { FaRedo, FaHome } from "react-icons/fa";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 py-16 flex flex-col items-center justify-center text-center gap-6 animate-page-enter">
      <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 font-poppins font-bold text-xs uppercase tracking-widest border border-amber-300">
        System Notice
      </span>

      <h1 className="text-3xl sm:text-4xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight max-w-lg">
        Something Went Wrong
      </h1>

      <p className="text-xs sm:text-sm text-zinc-600 font-inter max-w-md leading-relaxed">
        An unexpected error occurred while loading this page. Please try refreshing or return to the main portal.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-full bg-[var(--primary)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <FaRedo className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-white border border-zinc-300 text-zinc-800 font-poppins font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2"
        >
          <FaHome className="w-3.5 h-3.5" />
          <span>Go to Home</span>
        </Link>
      </div>
    </div>
  );
}
