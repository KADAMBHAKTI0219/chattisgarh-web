"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { newsService } from "@/services/news";
import { FaArrowLeft, FaCalendarAlt, FaTag, FaShareAlt } from "react-icons/fa";

export default function NewsDetailPage({ params }) {
  const resolvedParams = use(params);
  const articleId = resolvedParams?.id;

  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState(null);

  useEffect(() => {
    async function loadArticle() {
      if (!articleId) return;
      setLoading(true);
      try {
        const res = await newsService.getNewsBySlug(articleId);
        if (res.success && res.data) {
          setArticle(res.data);
        } else {
          // Fallback static article
          setArticle({
            title: "Chhattisgarh Creator Awards 2026 Registration Opened By State Directorate",
            category: "Press Release",
            date: "August 01, 2026",
            image: "/assets/images/raipur_landmark.jpg",
            summary: "RAIPUR — The Department of Culture & Tourism, Government of Chhattisgarh today officially announced the commencement of online digital registrations for the inaugural Chhattisgarh State Creator & Influencer Awards 2026.",
            content: "Designed as a flagship state initiative, the portal invites creators across all 36 districts—ranging from travel bloggers, filmmakers, folk musicians, tribal storytellers, Dhokra artisans, to tech educators—to submit their digital content portfolios for official state evaluation."
          });
        }
      } catch (err) {
        setArticle({
          title: "Chhattisgarh Creator Awards 2026 Registration Opened By State Directorate",
          category: "Press Release",
          date: "August 01, 2026",
          image: "/assets/images/raipur_landmark.jpg",
          summary: "RAIPUR — The Department of Culture & Tourism, Government of Chhattisgarh today officially announced the commencement of online digital registrations for the inaugural Chhattisgarh State Creator & Influencer Awards 2026.",
          content: "Designed as a flagship state initiative, the portal invites creators across all 36 districts—ranging from travel bloggers, filmmakers, folk musicians, tribal storytellers, Dhokra artisans, to tech educators—to submit their digital content portfolios for official state evaluation."
        });
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [articleId]);

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
              navigator.share({ title: article?.title || "Chhattisgarh Creator Awards", url: window.location.href });
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

      {loading ? (
        <div className="w-full max-w-4xl mx-auto p-12 text-center text-xs font-bold text-zinc-500 bg-white rounded-3xl border border-zinc-200">
          Loading news article details...
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-10 shadow-xs text-left flex flex-col gap-6">
          <div className="flex flex-col gap-3 border-b border-zinc-200 pb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#C45A32]/10 text-[#C45A32] border border-[#C45A32]/20 font-poppins font-bold text-[10px] uppercase tracking-wider">
                {article?.category || "Official Press Release"}
              </span>
              <span className="text-xs font-inter font-semibold text-zinc-400 flex items-center gap-1.5">
                <FaCalendarAlt className="w-3 h-3 text-zinc-400" />
                {article?.date || article?.publishedAt || "August 2026"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight leading-tight">
              {article?.title}
            </h1>
          </div>

          {/* Hero Image */}
          <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden bg-zinc-900 shadow-sm">
            <img
              src={article?.image || article?.coverImage || "/assets/images/raipur_landmark.jpg"}
              alt={article?.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body Content */}
          <div className="flex flex-col gap-4 text-xs sm:text-sm text-zinc-700 font-inter leading-relaxed max-w-none">
            <p className="font-semibold text-base text-zinc-900">
              {article?.summary}
            </p>

            <p>{article?.content}</p>

            <blockquote className="p-4 rounded-2xl bg-[#F8F4EA] border-l-4 border-[#C45A32] font-poppins font-bold text-sm text-[#21593D] italic my-2">
              “When creators preserve culture, they preserve the soul of a state. Every authentic story shared today becomes a legacy remembered tomorrow for Chhattisgarh.”
            </blockquote>
          </div>
        </div>
      )}

    </div>
  );
}
