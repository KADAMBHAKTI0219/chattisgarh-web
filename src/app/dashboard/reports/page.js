"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { applicationService } from "@/services/application";
import { categoryService } from "@/services/category";
import { userService } from "@/services/user";
import { dashboardService } from "@/services/dashboard";
import { reportService } from "@/services/report";
import { staticCategories } from "@/data/staticCategories";
import { CG_DISTRICTS_33 } from "@/utils/constants";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import {
  FaChartPie,
  FaDownload,
  FaFilePdf,
  FaFileExcel,
  FaUsers,
  FaTrophy,
  FaCalendarAlt,
  FaFilter,
  FaMapMarkerAlt,
  FaPrint,
  FaSync,
  FaSpinner,
  FaFileAlt
} from "react-icons/fa";

export default function ReportsDashboardPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("ALL_TIME");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [downloading, setDownloading] = useState(null);
  const [downloadModal, setDownloadModal] = useState({ isOpen: false, message: "" });

  // Dynamic state loaded from APIs
  const [rawApplications, setRawApplications] = useState([]);
  const [rawCategories, setRawCategories] = useState(staticCategories);
  const [rawUsersCount, setRawUsersCount] = useState(0);
  const [overviewStats, setOverviewStats] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Fetch real system analytics & reports data from Backend APIs
  useEffect(() => {
    async function loadReportsData() {
      try {
        setLoading(true);

        // 0. Fetch Analytics Report JSON (/api/v1/reports/analytics)
        try {
          const analyticsRes = await reportService.getAnalytics(token);
          if (analyticsRes?.success && analyticsRes?.data) {
            setAnalyticsData(analyticsRes.data);
          }
        } catch (e) {}

        // 1. Fetch Categories
        try {
          const catRes = await categoryService.getCategories({ isActive: true });
          const catList = catRes?.categories || catRes?.data;
          if (Array.isArray(catList) && catList.length > 0) {
            setRawCategories(catList);
          }
        } catch (e) {}

        // 2. Fetch Applications
        let apiApps = [];
        try {
          const appRes = await applicationService.getApplications({ limit: 1000 }, token);
          if (appRes?.success || appRes?.applications || appRes?.data) {
            const list = appRes.applications || appRes.data || (Array.isArray(appRes) ? appRes : []);
            if (Array.isArray(list)) apiApps = list;
          }
        } catch (e) {}

        // Fallback: local submissions from localStorage if API applications are empty
        if (apiApps.length === 0 && typeof window !== "undefined") {
          try {
            const nomLocal = JSON.parse(localStorage.getItem("submitted_nominations") || "[]");
            const appLocal = JSON.parse(localStorage.getItem("user_applications") || "[]");
            apiApps = [...nomLocal, ...appLocal];
          } catch (e) {}
        }
        setRawApplications(apiApps);

        // 3. Fetch Users Count
        try {
          const userRes = await userService.getUsers({ limit: 1000 }, token);
          const uList = userRes?.users || userRes?.data;
          if (Array.isArray(uList)) {
            setRawUsersCount(uList.length);
          } else if (typeof userRes?.total === "number") {
            setRawUsersCount(userRes.total);
          }
        } catch (e) {}

        // 4. Fetch Admin Overview Stats
        try {
          const dashRes = await dashboardService.getAdminDashboard(token);
          if (dashRes?.success && dashRes?.data) {
            setOverviewStats(dashRes.data);
          }
        } catch (e) {}

      } catch (err) {
        console.warn("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadReportsData();
  }, [token]);

  // Compute Filtered Applications based on selected category & date range
  const filteredApplications = rawApplications.filter((app) => {
    if (selectedCategory !== "ALL") {
      const catVal = selectedCategory.toLowerCase().trim();
      const appCat = (app.categoryTitle || app.category || app.selectedCategory || "").toLowerCase().trim();
      if (!appCat.includes(catVal)) return false;
    }

    if (dateRange !== "ALL_TIME" && app.createdAt) {
      const appDate = new Date(app.createdAt);
      const now = new Date();
      if (dateRange === "THIS_MONTH" && (appDate.getMonth() !== now.getMonth() || appDate.getFullYear() !== now.getFullYear())) {
        return false;
      }
      if (dateRange === "LAST_30_DAYS" && (now - appDate) > 30 * 24 * 60 * 60 * 1000) {
        return false;
      }
    }
    return true;
  });

  const totalNominationsCount = filteredApplications.length;

  // 1. Compute Dynamic District Creator Representation
  const districtMap = new Map();
  filteredApplications.forEach((app) => {
    const dist = (app.district || app.applicant?.district || app.creatorDistrict || "Raipur").trim();
    districtMap.set(dist, (districtMap.get(dist) || 0) + 1);
  });

  // Sort districts by application count
  const sortedDistricts = Array.from(districtMap.entries())
    .map(([name, count]) => ({
      name,
      nominations: count,
      percentage: totalNominationsCount > 0 ? Math.round((count / totalNominationsCount) * 100) : 0
    }))
    .sort((a, b) => b.nominations - a.nominations);

  // Default fallback districts list if application data is empty
  const displayDistricts = sortedDistricts.length > 0
    ? sortedDistricts.slice(0, 6)
    : [
        { name: "Raipur", nominations: 0, percentage: 0 },
        { name: "Bastar", nominations: 0, percentage: 0 },
        { name: "Bilaspur", nominations: 0, percentage: 0 },
        { name: "Durg", nominations: 0, percentage: 0 },
        { name: "Dhamtari", nominations: 0, percentage: 0 },
        { name: "Surguja", nominations: 0, percentage: 0 }
      ];

  // 2. Compute Dynamic Category Share Breakdown
  const categoryMap = new Map();
  filteredApplications.forEach((app) => {
    const catName = app.categoryTitle || app.categoryDetails?.title || (typeof app.category === "object" ? app.category?.title : app.category) || "General Award Category";
    const cleanCat = String(catName).trim();
    categoryMap.set(cleanCat, (categoryMap.get(cleanCat) || 0) + 1);
  });

  const sortedCategories = Array.from(categoryMap.entries())
    .map(([title, count], idx) => {
      const colors = ["bg-[#E6532B]", "bg-[#21593D]", "bg-amber-600", "bg-blue-600", "bg-purple-600", "bg-rose-600"];
      return {
        title,
        nominations: count,
        share: totalNominationsCount > 0 ? `${((count / totalNominationsCount) * 100).toFixed(1)}%` : "0%",
        color: colors[idx % colors.length]
      };
    })
    .sort((a, b) => b.nominations - a.nominations);

  const displayCategoryReports = sortedCategories.length > 0
    ? sortedCategories.slice(0, 6)
    : rawCategories.slice(0, 6).map((c, i) => ({
        title: c.title || c.name || `Category ${i+1}`,
        nominations: 0,
        share: "0%",
        color: ["bg-[#E6532B]", "bg-[#21593D]", "bg-amber-600", "bg-blue-600", "bg-purple-600", "bg-rose-600"][i % 6]
      }));

  // Dynamic Key Performance Indicators Cards
  const reportStats = [
    {
      id: "stat-1",
      title: selectedCategory === "ALL" ? "Total Nominations" : "Category Nominations",
      value: (analyticsData?.overview?.totalNominations || totalNominationsCount).toLocaleString("en-IN"),
      subtext: selectedCategory === "ALL" ? "Total submitted entries" : `Filtered entries count`,
      icon: FaTrophy,
      color: "bg-orange-100/80 text-[#E6532B]"
    },
    {
      id: "stat-2",
      title: "Registered Users",
      value: (analyticsData?.overview?.totalUsers || rawUsersCount || overviewStats?.users || overviewStats?.totalUsers || 0).toLocaleString("en-IN"),
      subtext: "Verified user accounts",
      icon: FaUsers,
      color: "bg-blue-100/80 text-blue-700"
    },
    {
      id: "stat-3",
      title: "Award Categories",
      value: analyticsData?.overview?.totalCategories || rawCategories.length || 40,
      subtext: "Active award tiers",
      icon: FaFileAlt,
      color: "bg-emerald-100/80 text-emerald-700"
    },
    {
      id: "stat-4",
      title: "Districts Represented",
      value: `${districtMap.size || CG_DISTRICTS_33.length} / 33`,
      subtext: "Statewide coverage",
      icon: FaMapMarkerAlt,
      color: "bg-purple-100/80 text-purple-700"
    }
  ];

  // Pre-configured Downloadable Official Audit Reports linked to real backend API endpoints
  const downloadableReports = [
    {
      id: "participants-excel",
      title: "Participants Report Spreadsheet",
      description: "Excel spreadsheet export of all registered participants (Participants_Report.xlsx).",
      format: "EXCEL",
      type: "participants_excel",
      icon: FaFileExcel,
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
    },
    {
      id: "participants-csv",
      title: "Participants Report CSV Ledger",
      description: "Comma-separated text file of all participant records (Participants_Report.csv).",
      format: "CSV",
      type: "participants_csv",
      icon: FaFileExcel,
      badgeColor: "bg-blue-100 text-blue-700 border-blue-200"
    },
    {
      id: "applications-excel",
      title: "Applications Report Spreadsheet",
      description: "Excel spreadsheet of creator applications & nominations (Applications_Report.xlsx).",
      format: "EXCEL",
      type: "applications_excel",
      icon: FaFileExcel,
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
    },
    {
      id: "applications-csv",
      title: "Applications Report CSV Ledger",
      description: "CSV raw dump of application records & nomination data (Applications_Report.csv).",
      format: "CSV",
      type: "applications_csv",
      icon: FaFileExcel,
      badgeColor: "bg-blue-100 text-blue-700 border-blue-200"
    },
    {
      id: "users-excel",
      title: "System Users Report Spreadsheet",
      description: "Excel export of registered user accounts and profile data (Users_Report.xlsx).",
      format: "EXCEL",
      type: "users_excel",
      icon: FaFileExcel,
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
    },
    {
      id: "users-csv",
      title: "System Users Report CSV Ledger",
      description: "CSV export of registered users log (Users_Report.csv).",
      format: "CSV",
      type: "users_csv",
      icon: FaFileExcel,
      badgeColor: "bg-blue-100 text-blue-700 border-blue-200"
    }
  ];

  // Handle Export / Download through reportService API calls
  const handleDownload = async (rep) => {
    setDownloading(rep.id);
    let result = { success: false, message: "" };

    try {
      switch (rep.type) {
        case "participants_excel":
          result = await reportService.exportParticipantsExcel(token);
          break;
        case "participants_csv":
          result = await reportService.exportParticipantsCSV(token);
          break;
        case "applications_excel":
          result = await reportService.exportApplicationsExcel(token);
          break;
        case "applications_csv":
          result = await reportService.exportApplicationsCSV(token);
          break;
        case "users_excel":
          result = await reportService.exportUsersExcel(token);
          break;
        case "users_csv":
          result = await reportService.exportUsersCSV(token);
          break;
        default:
          result = { success: true, message: `Report exported in ${rep.format} format!` };
      }
    } catch (err) {
      result = { success: false, message: err?.message || "Failed to download report" };
    } finally {
      setDownloading(null);
      setDownloadModal({
        isOpen: true,
        message: result.success ? result.message : `Error: ${result.message}`
      });
    }
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
              Real-time state-wide creator awards metrics and system audit reports dynamically loaded from backend database.
            </p>
          </div>
        </div>

        {/* Date & Category Filters & Export Options */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 text-xs font-poppins font-bold text-[#E6532B]">
            <FaFilter className="w-3.5 h-3.5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-[#E6532B] font-bold"
            >
              <option value="ALL" className="text-zinc-900 font-normal">All Award Categories</option>
              {rawCategories.map((cat, i) => (
                <option key={cat._id || cat.slug || i} value={cat.slug || cat.title} className="text-zinc-900 font-normal">
                  {cat.title || cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200/90 rounded-xl px-3 py-2 text-xs font-poppins font-bold text-zinc-700">
            <FaCalendarAlt className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="ALL_TIME">All Time Data</option>
              <option value="THIS_MONTH">This Month</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
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

      {loading ? (
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <FaSpinner className="w-8 h-8 animate-spin text-[#E6532B]" />
          <span className="text-xs font-poppins font-bold text-zinc-600">Loading system analytics...</span>
        </div>
      ) : (
        <>
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
                    District Creator Representation
                  </h2>
                </div>
                <span className="text-[11px] font-poppins font-bold text-zinc-400 uppercase">
                  Top Districts
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {displayDistricts.map((d, i) => (
                  <div key={i} className="flex flex-col gap-1.5 text-xs font-inter">
                    <div className="flex items-center justify-between font-poppins font-bold text-zinc-900">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#E6532B]"></span>
                        <span>{d.name} District</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-600">
                        <span>{d.nominations} Nominations</span>
                        <span className="font-mono text-[#E6532B] font-extrabold">
                          ({d.percentage}% Share)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#E6532B] to-[#21593D] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(d.percentage, 2)}%` }}
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
                    Category Nomination Share
                  </h2>
                </div>
                <span className="text-[11px] font-poppins font-bold text-zinc-400 uppercase">
                  Share %
                </span>
              </div>

              <div className="flex flex-col gap-3.5">
                {displayCategoryReports.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-150">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-3 h-3 rounded-full ${cat.color} shrink-0`}></div>
                      <span className="font-poppins font-bold text-xs text-zinc-900 truncate max-w-[200px]" title={cat.title}>
                        {cat.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-xs text-zinc-700">
                        {cat.nominations} Entries
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
                  Export Official System Reports & Audit Trail
                </h2>
                <span className="text-xs font-inter text-zinc-500 font-medium">
                  Export verified data logs in PDF, Excel, and CSV formats for offline records & government auditing.
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
                          File Size: {rep.size} • Live Data Export
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(rep)}
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
        </>
      )}

      {/* Report Download Notice Modal */}
      <ConfirmationModal
        isOpen={downloadModal.isOpen}
        onClose={() => setDownloadModal({ isOpen: false, message: "" })}
        onConfirm={() => setDownloadModal({ isOpen: false, message: "" })}
        title="Report Export Complete"
        message={downloadModal.message}
        confirmText="OK"
        cancelText="Close"
        type="success"
      />
    </div>
  );
}

