"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Heading from "@/components/common/Heading";
import { useLanguage } from "@/context/LanguageContext";
import { newsService } from "@/services/news";
import { FaNewspaper, FaCalendarAlt, FaTag, FaSearch, FaArrowRight } from "react-icons/fa";

export default function NewsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [newsArticles, setNewsArticles] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await newsService.getAllNews();
        if (res.success && res.data) {
          const list = Array.isArray(res.data) ? res.data : res.data.news || [];
          setNewsArticles(list);
        }
      } catch (err) {
        console.error("Failed to load news articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const defaultNews = [
    {
      _id: "1",
      id: "1",
      title: "Chhattisgarh Creator Awards 2026 Registration Opened By State Directorate",
      category: "Press Release",
      date: "August 01, 2026",
      summary: "The Department of Culture & Tourism, Government of Chhattisgarh officially invites digital storytellers across 36 districts to submit entries.",
      image: "/assets/images/raipur_landmark.jpg",
    },
    {
      _id: "2",
      id: "2",
      title: "Over 500+ Digital Creators Nominated in First 48 Hours Across 25 Categories",
      category: "Announcements",
      date: "August 03, 2026",
      summary: "Massive participation recorded from Bastar, Raipur, Bilaspur, and Surguja districts highlighting local folk arts, Dhokra craft, and tourism.",
      image: "/assets/images/event-5.jpg",
    },
    {
      _id: "3",
      id: "3",
      title: "Jury Panel Announced Featuring Renowned Filmmakers, Authors & Digital Leaders",
      category: "Jury Update",
      date: "July 28, 2026",
      summary: "Distinguished panel of experts set to evaluate nominations based on content originality, cultural impact, and audience engagement.",
      image: "/assets/images/event-9.jpg",
    },
  ];

  const displayArticles = newsArticles.length > 0 ? newsArticles : defaultNews;

  const filteredNews = displayArticles.filter((item) => {
    const matchesSearch = (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || (item.summary || item.content || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-10 relative overflow-x-hidden animate-page-enter">
      
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto text-center flex flex-col items-center">
        <Heading
          badge={t("OFFICIAL PRESS & MEDIA DESK")}
          title={t("NEWS &")}
          highlightText={t("ANNOUNCEMENTS")}
          description={t("Stay updated with the latest press releases, jury updates, milestone announcements, and ceremony details.")}
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-zinc-200 p-4 rounded-2xl shadow-xs">
        <div className="relative w-full sm:w-96">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search news or announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["All", "Press Release", "Announcements", "Jury Update"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-poppins font-bold uppercase transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? "bg-[#C45A32] text-white border-[#C45A32]"
                  : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs font-bold text-zinc-500 bg-white rounded-3xl border border-zinc-200">
          Loading news & press releases...
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {filteredNews.map((article) => (
            <div key={article._id || article.id || article.slug} className="bg-white border border-zinc-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:border-[var(--primary)] transition-all flex flex-col group">
              <div className="relative h-48 w-full bg-zinc-900 overflow-hidden">
                <img
                  src={article.image || article.coverImage || "/assets/images/raipur_landmark.jpg"}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-poppins font-bold text-[10px] uppercase tracking-wider">
                  {article.category || "Press Release"}
                </span>
              </div>

              <div className="p-6 flex flex-col gap-3 flex-1 justify-between">
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-inter font-semibold text-zinc-400 flex items-center gap-1.5">
                    <FaCalendarAlt className="w-3 h-3 text-[#C45A32]" />
                    {article.date || article.publishedAt || "August 2026"}
                  </span>
                  <h3 className="font-poppins font-bold text-base text-zinc-950 group-hover:text-[#C45A32] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="font-inter text-xs text-zinc-600 leading-relaxed line-clamp-3">
                    {article.summary || article.content || ""}
                  </p>
                </div>

                <Link
                  href={`/news/${article.slug || article._id || article.id}`}
                  className="inline-flex items-center gap-2 text-xs font-poppins font-bold text-[#C45A32] hover:underline mt-2"
                >
                  <span>Read Full Article</span>
                  <FaArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

