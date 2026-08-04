"use client";

import { useState } from "react";
import Link from "next/link";
import Heading from "@/components/common/Heading";
import { useLanguage } from "@/context/LanguageContext";
import { FaSearch, FaLayerGroup, FaNewspaper, FaQuestionCircle, FaFileAlt } from "react-icons/fa";

export default function SearchPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const searchDatabase = [
    { title: "Culture & Tribal Heritage", type: "Category", link: "/categories/culture", desc: "Showcasing folk dance, art, rituals, and regional traditions of Bastar & Chhattisgarh." },
    { title: "Tourism & Travel Vlogger", type: "Category", link: "/categories/tourism", desc: "Discovering waterfalls, Chitrakote, Sirpur temples, and wildlife sanctuaries." },
    { title: "Who Can Apply for Chhattisgarh Awards?", type: "FAQ", link: "/contact", desc: "Eligibility rules for creators aged 18+ and under-18 creators with guardian consent." },
    { title: "Registration Opened For State Creator Awards 2026", type: "News", link: "/news/1", desc: "Official press announcement by Department of Culture & Tourism." },
    { title: "Accessibility Statement & Guidelines", type: "Page", link: "/accessibility-statement", desc: "Inclusive digital accessibility compliance for screen readers and modern browsers." },
    { title: "Privacy Policy & Data Security", type: "Page", link: "/privacy-policy", desc: "Official data protection rules for applicant creator profiles." },
  ];

  const results = query.trim() === ""
    ? searchDatabase
    : searchDatabase.filter((item) => {
        const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) || item.desc.toLowerCase().includes(query.toLowerCase());
        const matchesType = filterType === "All" || item.type === filterType;
        return matchesQuery && matchesType;
      });

  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-8 relative overflow-x-hidden animate-page-enter">
      
      <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center">
        <Heading
          badge={t("GLOBAL PORTAL SEARCH")}
          title={t("SEARCH THE")}
          highlightText={t("PORTAL")}
          description={t("Find award categories, press announcements, eligibility rules, and state policy pages instantaneously.")}
        />
      </div>

      {/* Search Input Box */}
      <div className="w-full max-w-4xl mx-auto bg-white border border-zinc-200 p-4 rounded-3xl shadow-sm flex flex-col gap-4 text-left">
        <div className="relative w-full">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Type to search categories, news, FAQs, policies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-zinc-300 bg-zinc-50/50 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-150">
          {["All", "Category", "News", "FAQ", "Page"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-poppins font-bold uppercase transition-all cursor-pointer border ${
                filterType === type
                  ? "bg-[#C45A32] text-white border-[#C45A32]"
                  : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results List */}
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 text-left">
        {results.length === 0 ? (
          <div className="p-12 text-center bg-white border border-zinc-200 rounded-3xl">
            <p className="text-sm font-poppins font-bold text-zinc-500">No matching search results found.</p>
          </div>
        ) : (
          results.map((res, idx) => (
            <Link
              key={idx}
              href={res.link}
              className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs hover:shadow-md hover:border-[#C45A32] transition-all flex items-start gap-4 group"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-100 text-[#C45A32] flex items-center justify-center font-bold shrink-0 group-hover:bg-[#C45A32] group-hover:text-white transition-colors">
                <FaSearch className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-poppins font-bold text-base text-zinc-950 group-hover:text-[#C45A32] transition-colors">
                    {res.title}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-poppins font-bold text-[10px] uppercase border border-zinc-200">
                    {res.type}
                  </span>
                </div>
                <p className="font-inter text-xs text-zinc-600 leading-relaxed">{res.desc}</p>
              </div>
            </Link>
          ))
        )}
      </div>

    </div>
  );
}
