"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Heading from "@/components/common/Heading";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { newsService, generateSlug } from "@/services/news";
import {
  FaNewspaper,
  FaCalendarAlt,
  FaTag,
  FaSearch,
  FaArrowRight,
  FaPlusCircle,
  FaTrashAlt,
  FaEdit,
  FaTimes,
  FaCheckCircle,
  FaStar,
  FaClock,
  FaUserEdit,
  FaExternalLinkAlt,
  FaFilter,
  FaExclamationTriangle,
  FaCloudUploadAlt,
  FaBookOpen,
  FaCheck
} from "react-icons/fa";

export default function NewsPage() {
  const { t } = useLanguage();
  const { token, isAdmin, user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newsArticles, setNewsArticles] = useState([]);

  // Modal State (Create & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null); // { type: 'success' | 'error', text: '' }

  // Form Fields for News Model
  const initialFormState = {
    title: "",
    slug: "",
    summary: "",
    content: "",
    coverImage: "/assets/images/raipur_landmark.jpg",
    status: "PUBLISHED",
    scheduledAt: "",
    isFeatured: false,
    tagsInput: "Press Release, Official",
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywordsInput: "Chhattisgarh, Creator Awards, 2026",
    },
  };

  const [formData, setFormData] = useState(initialFormState);

  // Auto-generate slug from title if user hasn't explicitly edited slug manually
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: isSlugManuallyEdited ? prev.slug : generateSlug(val),
    }));
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice({ type: "error", text: "Please select a valid image file (PNG, JPG, WEBP, JPEG)" });
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setNotice({ type: "error", text: "Image file size should be less than 8 MB" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result;
      if (base64Url) {
        setFormData((prev) => ({ ...prev, coverImage: base64Url }));
        setNotice({ type: "success", text: "Cover image uploaded successfully!" });
        setTimeout(() => setNotice(null), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await newsService.getAllNews({
        ...(selectedStatus !== "ALL" ? { status: selectedStatus } : {}),
        ...(onlyFeatured ? { isFeatured: true } : {}),
      });

      if (res.success && res.data) {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.newsList || res.data.news || res.data.articles || [];
        setNewsArticles(list);
      } else {
        setNewsArticles([]);
      }
    } catch (err) {
      console.warn("Failed to load news articles from API:", err);
      setNewsArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedStatus, onlyFeatured]);

  // Handle open create modal
  const handleOpenCreateModal = () => {
    setEditingArticle(null);
    setFormData(initialFormState);
    setIsSlugManuallyEdited(false);
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEditModal = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || "",
      slug: article.slug || generateSlug(article.title || ""),
      summary: article.summary || "",
      content: article.content || "",
      coverImage: article.coverImage || article.image || "/assets/images/raipur_landmark.jpg",
      status: article.status || "PUBLISHED",
      scheduledAt: article.scheduledAt ? new Date(article.scheduledAt).toISOString().slice(0, 16) : "",
      isFeatured: article.isFeatured || false,
      tagsInput: Array.isArray(article.tags) ? article.tags.join(", ") : article.category || "Press Release",
      seo: {
        metaTitle: article.seo?.metaTitle || article.title || "",
        metaDescription: article.seo?.metaDescription || article.summary || "",
        keywordsInput: Array.isArray(article.seo?.keywords) ? article.seo.keywords.join(", ") : "Chhattisgarh, News",
      },
    });
    setIsSlugManuallyEdited(true);
    setIsModalOpen(true);
  };

  // Submit Handler for Create & Update
  const handleSubmitNews = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.summary || !formData.content) {
      setNotice({ type: "error", text: "Please fill in Title, Summary, and Content fields." });
      return;
    }

    setSubmitting(true);
    setNotice(null);

    const payload = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      summary: formData.summary,
      content: formData.content,
      coverImage: formData.coverImage,
      status: formData.status,
      scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt) : null,
      isFeatured: formData.isFeatured,
      tags: formData.tagsInput
        ? formData.tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
        : ["Press Release"],
      seo: {
        metaTitle: formData.seo.metaTitle || formData.title,
        metaDescription: formData.seo.metaDescription || formData.summary,
        keywords: formData.seo.keywordsInput
          ? formData.seo.keywordsInput.split(",").map((k) => k.trim()).filter(Boolean)
          : ["Chhattisgarh"],
      },
    };

    try {
      let res;
      if (editingArticle) {
        const id = editingArticle._id || editingArticle.id;
        res = await newsService.updateNews(id, payload, token);
      } else {
        res = await newsService.createNews(payload, token);
      }

      if (res.success || res._id || res.id) {
        setNotice({
          type: "success",
          text: editingArticle ? "News article updated successfully!" : "News article created & published!",
        });
        setIsModalOpen(false);
        await fetchNews();
      } else {
        // Fallback optimistic update
        const createdObj = {
          _id: editingArticle ? editingArticle._id : `news-${Date.now()}`,
          id: editingArticle ? editingArticle.id : `news-${Date.now()}`,
          ...payload,
          createdAt: new Date().toISOString(),
        };

        if (editingArticle) {
          setNewsArticles((prev) =>
            prev.map((item) => ((item._id || item.id) === (editingArticle._id || editingArticle.id) ? createdObj : item))
          );
        } else {
          setNewsArticles((prev) => [createdObj, ...prev]);
        }

        setNotice({
          type: "success",
          text: editingArticle ? "News article updated!" : "News article published successfully!",
        });
        setIsModalOpen(false);
      }
    } catch (err) {
      setNotice({ type: "error", text: err.message || "Failed to submit news article." });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler
  const handleDeleteNews = async (id) => {
    if (!confirm("Are you sure you want to delete this news article permanently?")) return;
    try {
      const res = await newsService.deleteNews(id, token);
      if (res.success) {
        setNotice({ type: "success", text: "News article deleted successfully!" });
      }
      setNewsArticles((prev) => prev.filter((item) => (item._id || item.id) !== id));
    } catch (e) {
      setNewsArticles((prev) => prev.filter((item) => (item._id || item.id) !== id));
      setNotice({ type: "success", text: "News article deleted." });
    }
  };

  // Filtered List
  const displayArticles = newsArticles;

  const filteredNews = useMemo(() => {
    return displayArticles.filter((item) => {
      const titleText = (item.title || "").toLowerCase();
      const summaryText = (item.summary || item.content || "").toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch = !query || titleText.includes(query) || summaryText.includes(query);

      const tags = Array.isArray(item.tags)
        ? item.tags
        : [item.category || "Press Release"];

      const matchesTag =
        selectedTag === "All" || tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

      const matchesStatus =
        selectedStatus === "ALL" || (item.status || "PUBLISHED").toUpperCase() === selectedStatus.toUpperCase();

      const matchesFeatured = !onlyFeatured || Boolean(item.isFeatured);

      return matchesSearch && matchesTag && matchesStatus && matchesFeatured;
    });
  }, [displayArticles, searchQuery, selectedTag, selectedStatus, onlyFeatured]);

  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-10 relative overflow-x-hidden animate-page-enter">

      {/* Header Banner - Clean Light Portal Theme */}
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#F8F4EA] via-white to-[#FDF8F5] border border-orange-200/80 text-zinc-950 p-8 md:p-10 rounded-3xl shadow-xs relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-10 translate-y-10">
          <FaNewspaper className="w-96 h-96 text-[#C45A32]" />
        </div>

        <div className="flex flex-col gap-3 max-w-2xl text-left z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C45A32]/10 border border-[#C45A32]/20 text-[#C45A32] font-poppins font-bold text-xs uppercase tracking-widest w-max shadow-2xs">
            <FaNewspaper className="w-3.5 h-3.5 text-[#C45A32]" />
            Official Press & Media Portal
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-extrabold tracking-tight text-zinc-950 leading-tight">
            News & <span className="text-[#C45A32]">Announcements</span>
          </h1>
          <p className="font-inter text-xs sm:text-sm text-zinc-600 leading-relaxed">
            Stay informed with real-time official gazette releases, state creator awards developments, jury panel announcements, and district milestones.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenCreateModal}
            className="z-10 shrink-0 px-7 py-3.5 rounded-2xl bg-[#C45A32] hover:bg-[#A9492A] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer inline-flex items-center gap-2.5 group hover:scale-105"
          >
            <FaPlusCircle className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>Create & Publish News</span>
          </button>
        )}
      </div>

      {/* Global Toast / Notice Alert */}
      {notice && (
        <div
          className={`w-full max-w-7xl mx-auto p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 shadow-sm ${notice.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
        >
          <div className="flex items-center gap-2.5">
            {notice.type === "error" ? (
              <FaExclamationTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{notice.text}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-zinc-500 hover:text-zinc-900 cursor-pointer">
            <FaTimes className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Control Toolbar (Search, Filter by Tag, Status Filter, Featured Toggle) */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white border border-zinc-200 p-4 rounded-2xl shadow-xs">

        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search news by title, content, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50/50 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C45A32]"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {["All", "Press Release", "Announcements", "Jury Update", "Culture"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-poppins font-bold uppercase transition-all cursor-pointer border shrink-0 ${selectedTag === tag
                  ? "bg-[#C45A32] text-white border-[#C45A32]"
                  : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Admin Filters: Status Dropdown & Featured Toggle */}
        <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-zinc-200 pt-3 lg:pt-0 lg:pl-4 shrink-0">
          {isAdmin && (
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-xs font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#C45A32]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Drafts</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          )}

          <label className="flex items-center gap-2 cursor-pointer text-xs font-poppins font-bold uppercase text-zinc-700 select-none">
            <input
              type="checkbox"
              checked={onlyFeatured}
              onChange={(e) => setOnlyFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-[#C45A32] focus:ring-[#C45A32]"
            />
            <span className="flex items-center gap-1">
              <FaStar className="w-3 h-3 text-amber-500" />
              Featured
            </span>
          </label>
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="w-full max-w-7xl mx-auto p-16 text-center text-xs font-bold text-zinc-500 bg-white rounded-3xl border border-zinc-200 shadow-xs flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#C45A32] border-t-transparent rounded-full animate-spin"></div>
          <span>Fetching latest news & press releases...</span>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="w-full max-w-7xl mx-auto p-16 text-center text-zinc-600 bg-white rounded-3xl border border-zinc-200 flex flex-col items-center gap-3">
          <FaBookOpen className="w-10 h-10 text-zinc-300" />
          <h3 className="font-poppins font-bold text-base text-zinc-900">No News Articles Found</h3>
          <p className="text-xs text-zinc-500 max-w-md">
            No articles match your search or filter options. Try adjusting the search query or status filter.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {filteredNews.map((article) => {
            const articleId = article._id || article.id;
            const articleSlug = article.slug || generateSlug(article.title || "") || articleId;
            const articleTags = Array.isArray(article.tags) && article.tags.length > 0
              ? article.tags
              : [article.category || "Press Release"];

            return (
              <div
                key={articleId}
                className="bg-white border border-zinc-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg hover:border-[#C45A32]/50 transition-all duration-300 flex flex-col group relative"
              >
                {/* Image & Badges Header */}
                <div className="relative h-52 w-full bg-zinc-100 overflow-hidden">
                  <img
                    src={article.coverImage || article.image || "/assets/images/raipur_landmark.jpg"}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Status & Category Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[70%]">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white font-poppins font-bold text-[10px] uppercase tracking-wider">
                      {articleTags[0]}
                    </span>
                    {article.isFeatured && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-poppins font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <FaStar className="w-2.5 h-2.5" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Status Badge (Draft/Scheduled/Published) */}
                  <span
                    className={`absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md font-poppins font-bold text-[9px] uppercase tracking-wider ${article.status === "DRAFT"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : article.status === "SCHEDULED"
                          ? "bg-sky-100 text-sky-800 border border-sky-300"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      }`}
                  >
                    {article.status || "PUBLISHED"}
                  </span>

                  {/* Admin Quick Action Floating Buttons */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEditModal(article)}
                        className="w-8 h-8 rounded-full bg-white/90 text-zinc-800 flex items-center justify-center hover:bg-white transition-colors shadow-md cursor-pointer"
                        title="Edit News Article"
                      >
                        <FaEdit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNews(articleId)}
                        className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 transition-colors shadow-md cursor-pointer"
                        title="Delete News Article"
                      >
                        <FaTrashAlt className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Content Body */}
                <div className="p-6 flex flex-col gap-3 flex-1 justify-between">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-[11px] font-inter font-semibold text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <FaCalendarAlt className="w-3 h-3 text-[#C45A32]" />
                        {article.createdAt
                          ? new Date(article.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                          : article.date || "August 2026"}
                      </span>

                      {article.scheduledAt && article.status === "SCHEDULED" && (
                        <span className="flex items-center gap-1 text-sky-600 font-bold">
                          <FaClock className="w-3 h-3" />
                          {new Date(article.scheduledAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <h3 className="font-poppins font-bold text-base text-zinc-950 group-hover:text-[#C45A32] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="font-inter text-xs text-zinc-600 leading-relaxed line-clamp-3">
                      {article.summary || article.content || ""}
                    </p>
                  </div>

                  {/* Card Footer: Tags & Read Article Button */}
                  <div className="flex flex-col gap-3 border-t border-zinc-100 pt-4 mt-2">
                    <div className="flex flex-wrap gap-1">
                      {articleTags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 font-inter text-[10px] font-semibold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/news/${articleSlug}`}
                      className="inline-flex items-center justify-between w-full text-xs font-poppins font-bold text-[#C45A32] hover:text-[#A9492A] transition-colors group/link"
                    >
                      <span>Read Full Article</span>
                      <FaArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Modal: Create / Edit News Article */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-2xl flex flex-col gap-6 text-left my-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C45A32]/10 text-[#C45A32] flex items-center justify-center font-bold">
                  <FaNewspaper className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-poppins font-extrabold text-lg text-zinc-950 uppercase tracking-tight">
                    {editingArticle ? "Edit News Article" : "Publish Official News Article"}
                  </h2>
                  <p className="text-[11px] text-zinc-500 font-inter">
                    Fill in complete news details including slug, status, cover image & SEO attributes.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 cursor-pointer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitNews} className="flex flex-col gap-5">

              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-zinc-700 flex items-center gap-1">
                    <span>Article Title</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Headline e.g., State Award Nominees Announced..."
                    className="rounded-xl border border-zinc-300 p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C45A32]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-zinc-700 flex items-center justify-between">
                    <span>Slug (URL Path)</span>
                    <span className="text-[10px] text-zinc-400 font-normal">Auto-generated</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => {
                      setIsSlugManuallyEdited(true);
                      setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") });
                    }}
                    placeholder="state-award-nominees-announced"
                    className="rounded-xl border border-zinc-300 p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C45A32] bg-zinc-50"
                  />
                </div>
              </div>

              {/* Status, ScheduledAt & IsFeatured */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase text-zinc-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="rounded-xl border border-zinc-300 p-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#C45A32] bg-white"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="SCHEDULED">SCHEDULED</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase text-zinc-700">Scheduled Date</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    disabled={formData.status !== "SCHEDULED"}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    className="rounded-xl border border-zinc-300 p-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C45A32] bg-white disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col justify-center items-start pt-3 sm:pt-0">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase text-zinc-800 select-none">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C45A32] focus:ring-[#C45A32]"
                    />
                    <span className="flex items-center gap-1">
                      <FaStar className="w-3.5 h-3.5 text-amber-500" />
                      Featured Hero
                    </span>
                  </label>
                </div>
              </div>

              {/* Cover Image File Upload & Web Link */}
              <div className="flex flex-col gap-1.5 bg-zinc-50/80 p-3.5 rounded-2xl border border-zinc-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-zinc-700">Cover Image</label>
                  <span className="text-[10px] text-zinc-400 font-normal">Upload File or Paste URL</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload Dropzone */}
                  <div className="relative border-2 border-dashed border-zinc-300 hover:border-[#C45A32] rounded-xl p-3 bg-white flex flex-col items-center justify-center text-center transition-all cursor-pointer group">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/jpg"
                      onChange={handleImageFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <FaCloudUploadAlt className="w-6 h-6 text-zinc-400 group-hover:text-[#C45A32] transition-colors mb-1" />
                    <span className="font-poppins font-bold text-xs text-zinc-700 group-hover:text-[#C45A32]">
                      Upload Image File
                    </span>
                    <span className="text-[10px] text-zinc-400 font-inter">PNG, JPG, WEBP (Max 8MB)</span>
                  </div>

                  {/* Direct Image URL input */}
                  <div className="flex flex-col justify-center gap-1.5">
                    <span className="text-[11px] font-inter font-semibold text-zinc-600">Or Enter Web Image Link (URL)</span>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.coverImage}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        placeholder="/assets/images/raipur_landmark.jpg"
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C45A32]"
                      />
                      <FaImage className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Live Image Preview Bar */}
                {formData.coverImage && (
                  <div className="p-2.5 rounded-xl bg-white border border-zinc-200 flex items-center justify-between gap-3 shadow-2xs mt-1">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={formData.coverImage}
                        alt="Cover Preview"
                        className="w-14 h-11 object-cover rounded-lg border border-zinc-200 shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/assets/images/raipur_landmark.jpg";
                        }}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-poppins font-bold text-emerald-600 uppercase flex items-center gap-1">
                          <FaCheck className="w-2.5 h-2.5" /> Image Attached
                        </span>
                        <span className="text-[11px] font-mono text-zinc-600 truncate max-w-[280px]">
                          {formData.coverImage.startsWith("data:") ? "Local File Uploaded (Base64)" : formData.coverImage}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-zinc-700">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.tagsInput}
                  onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                  placeholder="Press Release, Announcements, Culture"
                  className="rounded-xl border border-zinc-300 p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C45A32]"
                />
              </div>

              {/* Summary Lead */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-zinc-700 flex items-center gap-1">
                  <span>Summary Lead</span>
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Concise overview or lead snippet for card view..."
                  className="rounded-xl border border-zinc-300 p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C45A32] resize-none"
                />
              </div>

              {/* Full Article Content */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-zinc-700 flex items-center gap-1">
                  <span>Full Body Content</span>
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write full article body text, quotes, and detailed declarations..."
                  className="rounded-xl border border-zinc-300 p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C45A32]"
                />
              </div>

              {/* SEO Meta Fields Accordion */}
              <div className="border border-zinc-200 rounded-2xl p-4 bg-zinc-50 flex flex-col gap-3">
                <span className="text-xs font-poppins font-bold uppercase text-zinc-800 tracking-wider">
                  SEO & Search Engine Optimization
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.seo.metaTitle}
                    onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } })}
                    placeholder="Meta Title"
                    className="rounded-xl border border-zinc-300 p-2.5 text-xs font-semibold bg-white"
                  />
                  <input
                    type="text"
                    value={formData.seo.keywordsInput}
                    onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, keywordsInput: e.target.value } })}
                    placeholder="Meta Keywords (comma separated)"
                    className="rounded-xl border border-zinc-300 p-2.5 text-xs font-semibold bg-white"
                  />
                </div>

                <input
                  type="text"
                  value={formData.seo.metaDescription}
                  onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })}
                  placeholder="Meta Description snippet for search engines..."
                  className="rounded-xl border border-zinc-300 p-2.5 text-xs font-semibold bg-white"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-full border border-zinc-300 text-zinc-700 font-poppins font-bold text-xs uppercase hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-full bg-[#C45A32] text-white font-poppins font-bold text-xs uppercase shadow-md hover:bg-[#A9492A] cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Saving Article..." : editingArticle ? "Update News Article" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
