"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { applicationService } from "@/services/application";
import { participantService } from "@/services/participant";
import { reportService } from "@/services/report";
import { FaFileAlt, FaEye, FaSearch, FaFilter, FaPlusCircle, FaFileExcel, FaFileCsv, FaUser } from "react-icons/fa";

export default function MyApplicationsPage() {
  const { token, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const handleExportExcel = async () => {
    if (!token) return;
    try {
      await reportService.exportApplicationsExcel(token);
    } catch (e) {
      console.error("Excel export error:", e);
      alert("Downloading applications Excel report...");
    }
  };

  const handleExportCSV = async () => {
    if (!token) return;
    try {
      await reportService.exportApplicationsCSV(token);
    } catch (e) {
      console.error("CSV export error:", e);
      alert("Downloading applications CSV report...");
    }
  };

  useEffect(() => {
    const fetchApps = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await applicationService.getApplications({}, token);
        let list = [];
        if (res.success && res.data) {
          list = Array.isArray(res.data) ? res.data : res.data.applications || [];
        }

        // If Admin, also fetch registered participants to ensure all submissions are displayed
        if (isAdmin) {
          try {
            const partRes = await participantService.getParticipants({}, token);
            if (partRes.success && partRes.data) {
              const partList = Array.isArray(partRes.data) ? partRes.data : partRes.data.participants || [];
              const formattedParts = partList.map((p) => ({
                _id: p._id || p.id,
                applicationId: p.applicationId || p._id || `PART-${p.id}`,
                title: p.title || `${p.name || p.fullName || "Applicant"}'s Nomination`,
                category: { title: p.category || p.categoryName || "State Award Category" },
                district: p.district || "Raipur",
                status: p.status || "SUBMITTED",
                creator: { name: p.name || p.fullName || "Applicant", email: p.email, phone: p.phone },
                createdAt: p.createdAt,
              }));

              // Merge and deduplicate by ID
              const combined = [...list, ...formattedParts];
              list = Array.from(new Map(combined.map((item) => [item._id || item.applicationId, item])).values());
            }
          } catch (pe) {
            console.error("Failed to load participants:", pe);
          }
        }

        setApplications(list);
      } catch (err) {
        console.error("Failed to load applications list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [token, isAdmin]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
      case "SHORTLISTED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "UNDER_REVIEW":
      case "SUBMITTED":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "REJECTED":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-300";
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case "DRAFT": return 25;
      case "SUBMITTED": return 50;
      case "UNDER_REVIEW": return 70;
      case "SHORTLISTED": return 85;
      case "APPROVED": return 100;
      default: return 35;
    }
  };

  const filtered = filterStatus === "All"
    ? applications
    : applications.filter((app) => (app.status || "").toUpperCase() === filterStatus.toUpperCase().replace(" ", "_"));

  return (
    <div className="flex flex-col gap-8 text-left animate-page-enter">
      
      {/* Header Row: Title & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-inter font-bold uppercase tracking-widest text-[#C45A32]">
            Nomination Records
          </span>
          <h1 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-0.5">
            {isAdmin ? "Platform Nominations Audit" : "My Applications"}
          </h1>
        </div>

        {isAdmin ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <FaFileExcel className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <FaFileCsv className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        ) : (
          <Link
            href="/participate"
            className="px-5 py-2.5 rounded-full bg-[#C45A32] hover:bg-[#A9492A] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-xs transition-all inline-flex items-center gap-2"
          >
            <FaPlusCircle className="w-4 h-4" />
            <span>New Application</span>
          </Link>
        )}
      </div>

      {/* Horizontal Status Filter Bar */}
      <div className="w-full bg-white p-2 sm:p-2.5 rounded-2xl border border-zinc-200/90 shadow-xs flex items-center gap-2 overflow-x-auto no-scrollbar">
        {["All", "Draft", "Submitted", "Under Review", "Shortlisted", "Approved"].map((st) => {
          const isSelected = filterStatus === st;
          const count = st === "All"
            ? applications.length
            : applications.filter(a => (a.status || "").toUpperCase() === st.toUpperCase().replace(" ", "_")).length;

          return (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2 border ${
                isSelected
                  ? "bg-[#C45A32] text-white border-[#C45A32] shadow-xs"
                  : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              <span>{st}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isSelected ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applications Cards Grid / Table */}
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-zinc-500 font-medium">Loading nomination applications...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <FaFileAlt className="w-8 h-8 text-zinc-300" />
            <p className="text-sm font-poppins font-bold text-zinc-700">No applications found in this status filter.</p>
            {!isAdmin && (
              <Link href="/participate" className="text-xs font-bold text-[#C45A32] hover:underline">
                Submit a new nomination →
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 text-[11px] font-poppins font-bold uppercase tracking-wider text-zinc-400">
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Applicant & Title / Category</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((app) => {
                  const applicantName = app.creator?.name || app.user?.name || app.fullName || app.title || "Applicant";

                  return (
                    <tr key={app._id || app.applicationId} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-4 px-4 font-poppins font-bold text-xs text-zinc-900">
                        {app.applicationId || app._id}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-poppins font-bold text-xs text-zinc-950 block flex items-center gap-1.5">
                          <FaUser className="w-3 h-3 text-[#C45A32]" />
                          <span>{applicantName}</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium block mt-0.5">
                          {app.title || app.category?.title || app.category || "Nomination Entry"} • {app.category?.title || app.category || "Category"}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-inter text-xs text-zinc-600">
                        {app.district || "Chhattisgarh"}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(app.status)}`}>
                          {app.status || "DRAFT"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-28 bg-zinc-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#C45A32] to-[#21593D] h-full rounded-full"
                            style={{ width: `${getProgressPercentage(app.status)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/dashboard/applications/${app._id || app.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-[var(--primary)] hover:text-white font-poppins font-bold text-xs text-zinc-800 transition-colors"
                        >
                          <FaEye className="w-3 h-3" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

