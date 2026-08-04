"use client";

import Link from "next/link";
import Heading from "@/components/common/Heading";
import { FaArrowLeft, FaCalendarAlt, FaTag, FaShareAlt } from "react-icons/fa";

export default function NewsDetailPage({ params }) {
  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-8 relative overflow-x-hidden animate-page-enter">
      
      {/* Top Navigation */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-[var(--primary)] font-inter font-bold text-xs transition-colors"
        >
          <FaArrowLeft className="w-3.5 h-3.5" /> Back to News & Announcements
        </Link>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: "Chhattisgarh Creator Awards Press Release", url: window.location.href });
            } else {
              alert("Link copied to clipboard!");
            }
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 font-poppins font-bold text-xs uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
        >
          <FaShareAlt className="w-3 h-3 text-[#C45A32]" />
          <span>Share Article</span>
        </button>
      </div>

      {/* Main Article Container */}
      <div className="w-full max-w-4xl mx-auto bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-10 shadow-xs text-left flex flex-col gap-6">
        <div className="flex flex-col gap-3 border-b border-zinc-200 pb-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#C45A32]/10 text-[#C45A32] border border-[#C45A32]/20 font-poppins font-bold text-[10px] uppercase tracking-wider">
              Official Press Release
            </span>
            <span className="text-xs font-inter font-semibold text-zinc-400 flex items-center gap-1.5">
              <FaCalendarAlt className="w-3 h-3 text-zinc-400" />
              August 01, 2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight leading-tight">
            Chhattisgarh Creator Awards 2026 Registration Opened By State Directorate
          </h1>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden bg-zinc-900 shadow-sm">
          <img
            src="/assets/images/raipur_landmark.jpg"
            alt="Chhattisgarh Creator Awards Press Announcement"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="flex flex-col gap-4 text-xs sm:text-sm text-zinc-700 font-inter leading-relaxed max-w-none">
          <p className="font-semibold text-base text-zinc-900">
            RAIPUR — The Department of Culture & Tourism, Government of Chhattisgarh today officially announced the commencement of online digital registrations for the inaugural Chhattisgarh State Creator & Influencer Awards 2026.
          </p>

          <p>
            Designed as a flagship state initiative, the portal invites creators across all 36 districts—ranging from travel bloggers, filmmakers, folk musicians, tribal storytellers, Dhokra artisans, to tech educators—to submit their digital content portfolios for official state evaluation.
          </p>

          <blockquote className="p-4 rounded-2xl bg-[#F8F4EA] border-l-4 border-[#C45A32] font-poppins font-bold text-sm text-[#21593D] italic my-2">
            “When creators preserve culture, they preserve the soul of a state. Every authentic story shared today becomes a legacy remembered tomorrow for Chhattisgarh.”
          </blockquote>

          <p>
            Submissions will undergo a two-tier evaluation process comprising an independent screening committee and an esteemed jury panel of cultural dignitaries and digital leaders. Selected public choice categories will also feature citizen voting on the portal.
          </p>
        </div>

      </div>

    </div>
  );
}
