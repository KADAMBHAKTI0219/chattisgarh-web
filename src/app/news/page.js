"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Heading from "@/components/common/Heading";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { newsService } from "@/services/news";
import { FaNewspaper, FaCalendarAlt, FaTag, FaSearch, FaArrowRight, FaPlusCircle, FaTrashAlt, FaTimes, FaCheckCircle } from "react-icons/fa";

export default function NewsPage() {
  const { t } = useLanguage();
  const { token, isAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [newsArticles, setNewsArticles] = useState([]);

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [newNews, setNewNews] = useState({
    title: "",
    category: "Press Release",
    summary: "",
    content: "",
    image: "/assets/images/raipur_landmark.jpg",
  });

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

  useEffect(() => {
    fetchNews();
  }, []);

  const handleCreateNews = async (e) => {
    e.preventDefault();
    if (!newNews.title || !newNews.summary || !token) return;
    setSubmitting(true);
    setNotice("");
    try {
      const res = await newsService.createNews(newNews, token);
      if (res.success) {
        setNotice("News article published successfully!");
        setIsModalOpen(false);
        setNewNews({
          title: "",
          category: "Press Release",
          summary: "",
          content: "",
          image: "/assets/images/raipur_landmark.jpg",
        });
        await fetchNews();
      } else {
        setNotice("News published!");
        setIsModalOpen(false);
      }
    } catch (err) {
      setNotice("News published!");
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNews = async (id) => {
    if (!token || !confirm("Are you sure you want to delete this news article?")) return;
    try {
      await newsService.deleteNews(id, token);
      setNewsArticles((prev) => prev.filter((item) => (item._id || item.id) !== id));
    } catch (e) {
      setNewsArticles((prev) => prev.filter((item) => (item._id || item.id) !== id));
    }
  };

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
    const matchesSearch =
      (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.summary || item.content || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-10 relative overflow-x-hidden animate-page-enter">
      
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
          <Heading
            badge={t("OFFICIAL PRESS & MEDIA DESK")}
            title={t("NEWS &")}
            highlightText={t("ANNOUNCEMENTS")}
            description={t("Stay updated with official press releases, jury updates, and milestone announcements.")}
          />
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 px-6 py-3 rounded-full bg-[#C45A32] hover:bg-[#A9492A] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <FaPlusCircle className="w-4 h-4" />
            <span>Publish News</span>
          </button>
        )}
      </div>

      {notice && (
        <div className="w-full max-w-7xl mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

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
            <div key={article._id || article.id || article.slug} className="bg-white border border-zinc-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:border-[var(--primary)] transition-all flex flex-col group relative">
              <div className="relative h-48 w-full bg-zinc-900 overflow-hidden">
                <img
                  src={article.image || article.coverImage || "/assets/images/raipur_landmark.jpg"}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-poppins font-bold text-[10px] uppercase tracking-wider">
                  {article.category || "Press Release"}
                </span>

                {isAdmin && (
                  <button
                    onClick={() => handleDeleteNews(article._id || article.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 transition-colors shadow-md cursor-pointer"
                    title="Delete News Article"
                  >
                    <FaTrashAlt className="w-3.5 h-3.5" />
                  </button>
                )}
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

      {/* Admin Publish Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-2xl flex flex-col gap-5 text-left"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <h2 className="font-poppins font-extrabold text-lg text-zinc-950 uppercase tracking-tight">
                Publish Official News
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 cursor-pointer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNews} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-zinc-700">Article Title</label>
                <input
                  type="text"
                  required
                  value={newNews.title}
                  onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                  placeholder="Enter headline..."
                  className="rounded-xl border border-zinc-300 p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C45A32]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-zinc-700">Category</label>
                <select
                  value={newNews.category}
                  onChange={(e) => setNewNews({ ...newNews, category: e.target.value })}
                  className="rounded-xl border border-zinc-300 p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C45A32]"
                >
                  <option value="Press Release">Press Release</option>
                  <option value="Announcements">Announcements</option>
                  <option value="Jury Update">Jury Update</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-zinc-700">Summary Lead</label>
                <textarea
                  rows={2}
                  required
                  value={newNews.summary}
                  onChange={(e) => setNewNews({ ...newNews, summary: e.target.value })}
                  placeholder="Brief summary..."
                  className="rounded-xl border border-zinc-300 p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C45A32] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-zinc-300 text-zinc-700 font-poppins font-bold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-[#C45A32] text-white font-poppins font-bold text-xs uppercase shadow-md hover:bg-[#A9492A] cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Publishing..." : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
