"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { creatorService } from "@/services/creator";
import { dashboardService } from "@/services/dashboard";
import { applicationService } from "@/services/application";
import { userService } from "@/services/user";
import { participantService } from "@/services/participant";
import JuryEvaluationDesk from "@/components/dashboard/JuryEvaluationDesk";
import {
  FaAward,
  FaFileAlt,
  FaBell,
  FaCheckCircle,
  FaClock,
  FaPlusCircle,
  FaArrowRight,
  FaUserShield
} from "react-icons/fa";

export default function DashboardOverviewPage() {
  const { user, token, isAdmin, isJury } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [applicationsList, setApplicationsList] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [liveUserCount, setLiveUserCount] = useState(0);
  const [liveCreatorCount, setLiveCreatorCount] = useState(0);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);

        if (isAdmin) {
          // Admin Overview API
          const adminRes = await dashboardService.getAdminDashboard(token);
          if (adminRes.success && adminRes.data) {
            setAdminStats(adminRes.data);
          }

          // Fetch overall applications list
          const appsRes = await applicationService.getApplications({}, token);
          let allApps = [];
          if (appsRes.success && appsRes.data) {
            allApps = Array.isArray(appsRes.data) ? appsRes.data : appsRes.data.applications || [];
          }

          // Fetch participants list
          try {
            const partsRes = await participantService.getParticipants({}, token);
            if (partsRes.success && partsRes.data) {
              const partList = Array.isArray(partsRes.data) ? partsRes.data : partsRes.data.participants || [];
              const formattedParts = partList.map((p) => ({
                _id: p._id || p.id,
                applicationId: p.applicationId || p._id || `PART-${p.id}`,
                title: p.title || `${p.name || p.fullName || "Applicant"}'s Nomination`,
                category: { title: p.category || p.categoryName || "State Award Category" },
                district: p.district || "Raipur",
                status: p.status || "SUBMITTED",
                creator: { name: p.name || p.fullName || "Applicant" },
              }));
              allApps = Array.from(new Map([...allApps, ...formattedParts].map(i => [i._id || i.applicationId, i])).values());
            }
          } catch (pe) {}

          setApplicationsList(allApps);

          // Fetch live users for count calculation
          try {
            const usersRes = await userService.getAllUsers(token);
            if (usersRes.success && usersRes.data) {
              const uList = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.users || [];
              setLiveUserCount(uList.length);
              setLiveCreatorCount(uList.filter(u => String(u.role).toUpperCase() === "CREATOR").length || uList.length);
            }
          } catch (ue) {}

        } else {
          // Creator Dashboard API
          const creatorRes = await creatorService.getDashboard(token);
          if (creatorRes.success && creatorRes.data) {
            setDashboardData(creatorRes.data);
            setApplicationsList(creatorRes.data.applications || []);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
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

  const userName = user?.name || "Creator";
  const userDistrict = user?.district || "Chhattisgarh";

  if (isJury) {
    return <JuryEvaluationDesk token={token} />;
  }

  return (
    <div className="flex flex-col gap-8 text-left animate-page-enter">
      
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1c3a29] via-[#21593D] to-[#C45A32] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col gap-2 max-w-2xl relative z-10">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white font-poppins font-bold text-[10px] uppercase tracking-widest self-start backdrop-blur-md flex items-center gap-1.5">
            {isAdmin ? <FaUserShield className="w-3 h-3" /> : null}
            <span>{isAdmin ? "State Governance Overview" : "Official Creator Dashboard"}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-poppins font-extrabold text-white tracking-tight">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-inter leading-relaxed">
            {isAdmin
              ? "System statistics, nomination review pipeline, and district creator analytics."
              : `Your nominations from ${userDistrict} district are under official jury evaluation. Monitor live progress updates below.`}
          </p>
        </div>

        {!isAdmin && (
          <Link
            href="/participate"
            className="shrink-0 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-poppins font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer inline-flex items-center gap-2 relative z-10"
          >
            <FaPlusCircle className="w-4 h-4" />
            <span>New Nomination</span>
          </Link>
        )}
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="flex flex-col">
            <span className="text-[11px] font-inter font-bold text-zinc-400 uppercase tracking-wider">
              {isAdmin ? "Total Platform Users" : "Total Submissions"}
            </span>
            <span className="text-2xl font-poppins font-extrabold text-zinc-950 mt-1">
              {loading
                ? "..."
                : isAdmin
                ? (liveUserCount > 0 ? liveUserCount : (adminStats?.totalUsers || applicationsList.length || 1))
                : dashboardData?.totalApplications || applicationsList.length || 0}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#C45A32]/10 text-[#C45A32] flex items-center justify-center font-bold">
            <FaFileAlt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="flex flex-col">
            <span className="text-[11px] font-inter font-bold text-zinc-400 uppercase tracking-wider">
              {isAdmin ? "Total Applications" : "Shortlisted Entries"}
            </span>
            <span className="text-2xl font-poppins font-extrabold text-emerald-700 mt-1">
              {loading
                ? "..."
                : isAdmin
                ? (adminStats?.totalApplications || applicationsList.length || 1)
                : applicationsList.filter((a) => a.status === "SHORTLISTED" || a.status === "APPROVED").length || 0}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <FaCheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="flex flex-col">
            <span className="text-[11px] font-inter font-bold text-zinc-400 uppercase tracking-wider">Under Evaluation</span>
            <span className="text-2xl font-poppins font-extrabold text-amber-600 mt-1">
              {loading
                ? "..."
                : isAdmin
                ? (adminStats?.pendingApplications || applicationsList.filter((a) => a.status === "UNDER_REVIEW" || a.status === "SUBMITTED").length || 0)
                : applicationsList.filter((a) => a.status === "UNDER_REVIEW" || a.status === "SUBMITTED").length || 0}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <FaClock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="flex flex-col">
            <span className="text-[11px] font-inter font-bold text-zinc-400 uppercase tracking-wider">
              {isAdmin ? "Active Creators" : "District Region"}
            </span>
            <span className="text-2xl font-poppins font-extrabold text-zinc-950 mt-1">
              {isAdmin ? (liveCreatorCount > 0 ? liveCreatorCount : (adminStats?.totalCreators || applicationsList.length || 1)) : userDistrict}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#21593D]/10 text-[#21593D] flex items-center justify-center font-bold">
            <FaAward className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Applications Grid & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Active Applications */}
        <div className="lg:col-span-7 bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-poppins font-bold text-zinc-950 uppercase tracking-tight">
              {isAdmin ? "Recent Platform Applications" : "My Active Applications"}
            </h2>
            <Link href="/dashboard/applications" className="text-xs font-inter font-bold text-[#C45A32] hover:underline flex items-center gap-1">
              <span>View All</span>
              <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-500 font-medium">Loading applications from server...</div>
          ) : applicationsList.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 font-medium bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
              No applications submitted yet. Click <strong>New Nomination</strong> to submit your entry!
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {applicationsList.slice(0, 5).map((app) => (
                <Link
                  key={app._id || app.id || app.applicationId}
                  href={`/dashboard/applications/${app._id || app.id}`}
                  className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-[#C45A32]/50 hover:bg-white transition-all flex flex-col gap-3 group cursor-pointer"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-poppins font-bold text-sm text-zinc-950 group-hover:text-[#C45A32]">
                      {app.category?.title || app.category || app.title || "Nomination Entry"}
                    </span>
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(app.status)}`}>
                      {app.status || "DRAFT"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                    <span>ID: <strong className="text-zinc-800">{app.applicationId || app._id}</strong></span>
                    <span>District: <strong className="text-zinc-800">{app.district || userDistrict}</strong></span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-gradient-to-r from-[#C45A32] to-[#21593D] h-full rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(app.status)}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Notifications & Admin Control Tools Column */}
        <div className="lg:col-span-5 bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-poppins font-bold text-zinc-950 uppercase tracking-tight">
              {isAdmin ? "System Control & Alerts" : "Official Notifications"}
            </h2>
            <FaBell className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="flex flex-col gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col gap-1 text-left">
              <div className="flex items-center justify-between">
                <span className="font-poppins font-bold text-xs text-emerald-950">Registration Verified</span>
                <span className="text-[10px] text-emerald-600 font-bold">Active</span>
              </div>
              <p className="font-inter text-xs text-emerald-800 leading-relaxed">
                Your account is active and verified for the Chhattisgarh State Creator & Influencer Awards 2026.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col gap-1 text-left">
              <div className="flex items-center justify-between">
                <span className="font-poppins font-bold text-xs text-zinc-950">State Jury Evaluation</span>
                <span className="text-[10px] text-zinc-400 font-medium">Ongoing</span>
              </div>
              <p className="font-inter text-xs text-zinc-600 leading-relaxed">
                Technical verification and jury scoring pipeline active across all 33 districts.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
