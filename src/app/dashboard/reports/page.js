"use client";

import { useState } from "react";
import {
  FaChartPie,
  FaDownload,
  FaFilePdf,
  FaFileExcel,
  FaUsers,
  FaVoteYea,
  FaTrophy,
  FaCalendarAlt,
  FaFilter,
  FaArrowUp,
  FaChartLine,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaPrint,
  FaSync
} from "react-icons/fa";

export default function ReportsDashboardPage() {
  const [dateRange, setDateRange] = useState("ALL_TIME");
  const [downloading, setDownloading] = useState(null);

  // Key Performance Indicators (KPIs)
  const reportStats = [
    {
      id: "stat-1",
      title: "Total Nominations",
      value: "1,284",
      change: "+18.4%",
      isPositive: true,
      subtext: "vs previous month",
      icon: FaTrophy,
      color: "bg-orange-100/80 text-[#E6532B]"
    },
    {
      id: "stat-2",
      title: "Total Public Votes",
      value: "45,920",
      change: "+24.2%",
      isPositive: true,
      subtext: "verified voter engagements",
      icon: FaVoteYea,
      color: "bg-emerald-100/80 text-emerald-700"
    },
    {
      id: "stat-3",
      title: "Verified Creators",
      value: "892",
      change: "+12.1%",
      isPositive: true,
      subtext: "active creator profiles",
      icon: FaUsers,
      color: "bg-blue-100/80 text-blue-700"
    },
    {
      id: "stat-4",
      title: "Category Diversity Index",
      value: "96.4%",
      change: "+4.5%",
      isPositive: true,
      subtext: "all 33 districts represented",
      icon: FaChartLine,
      color: "bg-purple-100/80 text-purple-700"
    }
  ];

  // District-wise Participation Data
  const districtData = [
    { name: "Raipur", nominations: 342, votes: 14250, percentage: 31 },
    { name: "Bastar", nominations: 215, votes: 9840, percentage: 21 },
    { name: "Bilaspur", nominations: 198, votes: 7620, percentage: 17 },
    { name: "Durg", nominations: 184, votes: 6410, percentage: 14 },
    { name: "Dhamtari", nominations: 125, votes: 4120, percentage: 9 },
    { name: "Janjgir-Champa", nominations: 110, votes: 3680, percentage: 8 }
  ];

  // Top Performing Award Categories
  const categoryReports = [
    { title: "Chhattisgarhiya Sanskriti Ambassador", votes: 14250, share: "31%", color: "bg-[#E6532B]" },
    { title: "Indigenous Handicrafts & Craft Platform", votes: 9840, share: "21.4%", color: "bg-[#21593D]" },
    { title: "Tribal Heritage Creator", votes: 7620, share: "16.5%", color: "bg-amber-600" },
    { title: "Innovation & Digital Empowerment", votes: 6410, share: "14.0%", color: "bg-blue-600" },
    { title: "Education & Literacy Excellence", votes: 4120, share: "9.0%", color: "bg-purple-600" },
    { title: "Youth Leadership & Social Impact", votes: 3680, share: "8.1%", color: "bg-rose-600" }
  ];

  // Pre-configured Downloadable Reports
  const downloadableReports = [
    {
      id: "rep-1",
      title: "State Creator Awards 2026 Executive Summary",
      description: "Full overview report containing total nominations, jury scores, and public voting standings.",
      format: "PDF",
      size: "2.4 MB",
      icon: FaFilePdf,
      badgeColor: "bg-rose-100 text-rose-700 border-rose-200"
    },
    {
      id: "rep-2",
      title: "District-Wise Creator Participation Ledger",
      description: "Granular breakdown of creator accounts, mobile verifications, and district density metrics.",
      format: "EXCEL",
      size: "1.8 MB",
      icon: FaFileExcel,
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
    },
    {
      id: "rep-3",
      title: "Public Voting Audit & Anti-Fraud Log",
      description: "Verified IP, device fingerprinting, and voter authentication timestamps audit trail.",
      format: "CSV",
      size: "4.1 MB",
      icon: FaFileExcel,
      badgeColor: "bg-blue-100 text-blue-700 border-blue-200"
    },
    {
      id: "rep-4",
      title: "Jury Shortlisting & Category Scorecard",
      description: "Jury panel ratings, criteria weights, and finalist recommendations.",
      format: "PDF",
      size: "3.2 MB",
      icon: FaFilePdf,
      badgeColor: "bg-rose-100 text-rose-700 border-rose-200"
    }
  ];

  // Handle Export / Download Simulation
  const handleDownload = (repId, format) => {
    setDownloading(repId);
    setTimeout(() => {
      setDownloading(null);
      alert(`Report downloaded successfully in ${format} format!`);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 animate-page-enter text-left w-full">
      
      {/* 1. Header Banner */}
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100/80 text-[#E6532B] flex items-center justify-center font-bold text-xl shrink-0 border border-orange-200/60">
            <FaChartPie className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-poppins font-extrabold text-zinc-950 tracking-tight">
              Reports & System Analytics
            </h1>
            <p className="text-xs font-inter text-zinc-500 font-medium mt-0.5">
              Comprehensive state-wide creator awards metrics, public engagement, and printable PDF audit reports.
            </p>
          </div>
        </div>

        {/* Date Filter & Export Options */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200/90 rounded-xl px-3 py-2 text-xs font-poppins font-bold text-zinc-700">
            <FaCalendarAlt className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="ALL_TIME">All Time Data</option>
              <option value="THIS_MONTH">This Month (Aug 2025)</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
              <option value="THIS_YEAR">Year 2026</option>
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-poppins font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <FaPrint className="w-3.5 h-3.5" />
            <span>Print View</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards (4 KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {reportStats.map((stat) => {
          const IconComp = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-white border border-zinc-200/90 rounded-3xl p-5 shadow-2xs flex flex-col justify-between gap-4 hover:border-orange-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-poppins font-bold text-zinc-500 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${stat.color}`}>
                  <IconComp className="w-4 h-4" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-poppins font-black text-zinc-950 tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs font-poppins font-bold text-emerald-600 flex items-center gap-0.5">
                    <FaArrowUp className="w-2.5 h-2.5" />
                    {stat.change}
                  </span>
                </div>
                <span className="text-[11px] font-inter text-zinc-400 font-medium">
                  {stat.subtext}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Detailed Data Analytics Section (2 Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* District Participation Breakdown (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-2xs flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
            <div className="flex items-center gap-2.5">
              <FaMapMarkerAlt className="w-4 h-4 text-[#E6532B]" />
              <h2 className="font-poppins font-extrabold text-base text-zinc-950">
                District-Wise Voting & Creator Density
              </h2>
            </div>
            <span className="text-[11px] font-poppins font-bold text-zinc-400 uppercase">
              Top 6 Districts
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {districtData.map((d, i) => (
              <div key={i} className="flex flex-col gap-1.5 text-xs font-inter">
                <div className="flex items-center justify-between font-poppins font-bold text-zinc-900">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E6532B]"></span>
                    <span>{d.name} District</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-600">
                    <span>{d.nominations} Entries</span>
                    <span className="font-mono text-[#E6532B] font-extrabold">
                      {d.votes.toLocaleString("en-IN")} Votes ({d.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#E6532B] to-[#21593D] rounded-full transition-all duration-500"
                    style={{ width: `${d.percentage * 2.8}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Award Category Distribution (5 Columns) */}
        <div className="lg:col-span-5 bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-2xs flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
            <div className="flex items-center gap-2.5">
              <FaTrophy className="w-4 h-4 text-emerald-700" />
              <h2 className="font-poppins font-extrabold text-base text-zinc-950">
                Category Vote Share
              </h2>
            </div>
            <span className="text-[11px] font-poppins font-bold text-zinc-400 uppercase">
              Share %
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {categoryReports.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-150">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${cat.color} shrink-0`}></div>
                  <span className="font-poppins font-bold text-xs text-zinc-900 truncate max-w-[200px]" title={cat.title}>
                    {cat.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-zinc-700">
                    {cat.votes.toLocaleString("en-IN")}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-zinc-200 text-[10px] font-poppins font-extrabold text-[#E6532B]">
                    {cat.share}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Downloadable Executive Audit & Summary Reports */}
      <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-2xs flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
          <div className="flex flex-col">
            <h2 className="font-poppins font-extrabold text-base text-zinc-950">
              Download Official System Reports & Audit Trail
            </h2>
            <span className="text-xs font-inter text-zinc-500 font-medium">
              Export verified data logs in PDF, Excel, and CSV for offline records & government auditing.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {downloadableReports.map((rep) => {
            const IconComponent = rep.icon;
            const isBusy = downloading === rep.id;

            return (
              <div
                key={rep.id}
                className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-white hover:shadow-xs transition-all flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-xl bg-white border border-zinc-200 text-zinc-700 shrink-0">
                    <IconComponent className="w-6 h-6 text-[#E6532B]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-poppins font-bold text-sm text-zinc-950">
                        {rep.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-poppins font-extrabold border ${rep.badgeColor}`}>
                        {rep.format}
                      </span>
                    </div>
                    <p className="text-xs font-inter text-zinc-500 leading-relaxed">
                      {rep.description}
                    </p>
                    <span className="text-[10px] font-mono text-zinc-400 mt-1">
                      File Size: {rep.size} • Generated 08 Aug 2025
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(rep.id, rep.format)}
                  disabled={isBusy}
                  className="px-3.5 py-2 rounded-xl bg-[#E6532B] hover:bg-[#d1451f] text-white font-poppins font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isBusy ? (
                    <FaSync className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FaDownload className="w-3.5 h-3.5" />
                  )}
                  <span>Export</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
