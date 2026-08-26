"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { creatorService } from "@/services/creator";
import { dashboardService } from "@/services/dashboard";
import { applicationService } from "@/services/application";
import { userService } from "@/services/user";
import { participantService } from "@/services/participant";
import JuryEvaluationDesk from "@/components/dashboard/JuryEvaluationDesk";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import {
  FaAward,
  FaFileAlt,
  FaBell,
  FaCheckCircle,
  FaClock,
  FaPlusCircle,
  FaArrowRight,
  FaUserShield,
  FaCalendarAlt,
  FaEye,
  FaHeadset,
  FaCrown,
  FaBullhorn,
  FaQuestionCircle,
  FaUsers,
  FaTimes
} from "react-icons/fa";

export default function DashboardOverviewPage() {
  const { user, token, isAdmin, isJury } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [applicationsList, setApplicationsList] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const resolveCategoryName = (item) => {
    if (!item) return "Tribal Heritage Creator";
    const titleCandidate = item.categoryTitle || item.categoryDetails?.title || item.categoryDetails?.slug || item.categoryName || item.categorySlug;
    if (titleCandidate) return titleCandidate;
    if (typeof item.category === "object" && item.category) {
      return item.category.title || item.category.name || item.category.slug || "Tribal Heritage Creator";
    }
    if (typeof item.category === "string" && item.category && !/^[0-9a-fA-F]{24}$/.test(item.category.trim())) {
      return item.category;
    }
    return item.categoryDetails?.slug || item.categoryTitle || "Tribal Heritage Creator";
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        if (isAdmin) {
          // Admin overview handling inside AdminDashboard component
        } else {
          let apiApps = [];

          // 1. Try creator dashboard API
          if (token) {
            try {
              const creatorRes = await creatorService.getDashboard(token);
              if (creatorRes?.success && creatorRes?.data) {
                setDashboardData(creatorRes.data);
                apiApps = creatorRes.data.applications || creatorRes.data.nominations || [];
              }
            } catch (e) {}

            // 2. If apiApps is empty, try nominationService
            if (apiApps.length === 0) {
              try {
                const nomRes = await nominationService.getNominations({}, token);
                if (nomRes?.data || nomRes?.nominations) {
                  apiApps = nomRes.data || nomRes.nominations || [];
                }
              } catch (e) {}
            }
          }

          // 3. Merge with local submissions saved in localStorage
          let localApps = [];
          try {
            const nomLocal = JSON.parse(localStorage.getItem("submitted_nominations") || "[]");
            const appLocal = JSON.parse(localStorage.getItem("user_applications") || "[]");
            localApps = [...nomLocal, ...appLocal];
          } catch (e) {}

          const combined = [...localApps, ...apiApps];

          // Format items into clean application objects
          const formattedList = combined.map((p, idx) => {
            const isSelf = (p.nominationType || p.nominationAs) === "SELF" || !p.nominator;
            const displayName = p.name || p.fullName || (isSelf ? p.applicant?.fullName : p.nominee?.fullName || p.nominee?.name) || "Nominee Candidate";
            const displayTitle = p.title || p.projectTitle || p.workSummary || (p.categories && p.categories[0]?.description) || `${displayName}'s Nomination`;
            const catTitle = p.categoryTitle || p.categoryDetails?.title || p.categoryDetails?.slug || (p.categories && p.categories[0]?.categoryTitle) || (typeof p.category === "object" ? p.category?.title || p.category?.name || p.category?.slug : (typeof p.category === "string" && !/^[0-9a-fA-F]{24}$/.test(p.category.trim()) ? p.category : "State Award Category"));

            return {
              _id: p._id || p.applicationId || p.id || `sub-${idx}`,
              title: displayTitle,
              category: catTitle || "State Award Category",
              categoryTitle: catTitle || "State Award Category",
              workSummary: p.workSummary || p.description || displayTitle,
              submittedOn: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Recently",
              status: p.status || "Submitted",
              image: p.image || p.categoryImage || "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=300&q=80"
            };
          });

          // Deduplicate by _id
          const uniqueMap = new Map();
          formattedList.forEach((item) => {
            if (!uniqueMap.has(item._id)) {
              uniqueMap.set(item._id, item);
            }
          });

          setApplicationsList(Array.from(uniqueMap.values()));
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token, isAdmin]);

  if (isJury) {
    return <JuryEvaluationDesk token={token} />;
  }

  if (isAdmin) {
    return <AdminDashboard token={token} />;
  }

  // Real creator submissions (empty array when user has 0 applications)
  const creatorSubmissions = applicationsList;
  const underReviewCount = creatorSubmissions.filter((s) => (s.status || "").toLowerCase().includes("review")).length;
  const shortlistedCount = creatorSubmissions.filter((s) => (s.status || "").toLowerCase().includes("shortlist")).length;

  return (
    <div className="flex flex-col gap-6 text-left animate-page-enter w-full">
      
      {/* 2 Column Main Grid Layout matching Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Wide 8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Card 1: My Participation Overview */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
            <div className="flex flex-col gap-0.5">
              <h2 className="font-poppins font-extrabold text-base text-zinc-950">
                My Participation Overview
              </h2>
              <p className="text-xs font-inter text-zinc-500">
                {creatorSubmissions.length > 0
                  ? "You are participating in the following category"
                  : "Track your active participation & category status"}
              </p>
            </div>

            {/* Participation Banner Box */}
            {creatorSubmissions.length > 0 ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  {/* Crown / Heritage Tile */}
                  <div className="w-16 h-16 rounded-2xl bg-amber-100/90 text-amber-700 flex items-center justify-center text-2xl shrink-0 border border-amber-200">
                    <FaCrown className="w-8 h-8 text-amber-600" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-poppins font-extrabold text-amber-700 uppercase tracking-widest">
                        CULTURE
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-poppins font-bold text-[10px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Active
                      </span>
                    </div>
                    <h3 className="font-poppins font-bold text-base text-zinc-950">
                      {resolveCategoryName(creatorSubmissions[0])}
                    </h3>
                    <p className="text-xs font-inter text-zinc-600 line-clamp-1 max-w-md">
                      {creatorSubmissions[0]?.workSummary || creatorSubmissions[0]?.title || "Official Creator Award Entry"}
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard/applications"
                  className="px-4 py-2 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white font-poppins font-bold text-xs transition-all cursor-pointer shrink-0 self-end sm:self-center"
                >
                  View Details &rarr;
                </Link>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center text-xl shrink-0 border border-amber-200">
                    <FaCrown className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-poppins font-bold text-sm text-zinc-900">
                      No Category Selected Yet
                    </h3>
                    <p className="text-xs font-inter text-zinc-500">
                      Explore 25 award categories and select 1 of 2 scheme options to publish your Reel.
                    </p>
                  </div>
                </div>

                <Link
                  href="/participate"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-poppins font-bold text-xs transition-all cursor-pointer shrink-0 self-end sm:self-center shadow-2xs"
                >
                  Participate Now &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Card 2: Your Progress (3 Metric Cards) */}
          <div className="flex flex-col gap-3">
            <h3 className="font-poppins font-bold text-sm text-zinc-900">
              Your Progress
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Metric 1: Submissions */}
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-lg shrink-0">
                  <FaCalendarAlt className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-poppins font-bold text-zinc-500">Submissions</span>
                  <span className="text-xl font-poppins font-extrabold text-zinc-950">{creatorSubmissions.length}</span>
                  <span className="text-[10px] font-inter text-zinc-400">Total Submitted</span>
                </div>
              </div>

              {/* Metric 2: Under Review */}
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-lg shrink-0">
                  <FaFileAlt className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-poppins font-bold text-zinc-500">Under Review</span>
                  <span className="text-xl font-poppins font-extrabold text-zinc-950">{underReviewCount}</span>
                  <span className="text-[10px] font-inter text-zinc-400">Currently Under Review</span>
                </div>
              </div>

              {/* Metric 3: Shortlisted */}
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-cyan-600 text-white flex items-center justify-center text-lg shrink-0">
                  <FaAward className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-poppins font-bold text-zinc-500">Shortlisted</span>
                  <span className="text-xl font-poppins font-extrabold text-zinc-950">{shortlistedCount}</span>
                  <span className="text-[10px] font-inter text-zinc-400">Official Selections</span>
                </div>
              </div>

            </div>
          </div>

          {/* Card 3: Recent Submissions Table */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-poppins font-bold text-sm text-zinc-950">
                Recent Submissions
              </h3>
            </div>

            {creatorSubmissions.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-zinc-150">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50/80 border-b border-zinc-200 text-[10px] font-poppins font-bold text-zinc-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Submission Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Submitted On</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150 text-xs font-inter">
                    {creatorSubmissions.map((sub) => (
                      <tr key={sub._id || sub.id} className="hover:bg-zinc-50/80 transition-colors">
                        
                        {/* Title with Image Thumbnail */}
                        <td className="py-3.5 px-4 font-poppins font-bold text-zinc-900">
                          <div className="flex items-center gap-3">
                            <img
                              src={sub.image || "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=300&q=80"}
                              alt={sub.title || "Submission"}
                              className="w-10 h-10 rounded-lg object-cover border border-zinc-200 shrink-0"
                            />
                            <span className="line-clamp-1 max-w-xs">{sub.title || "Creator Reel Entry"}</span>
                          </div>
                        </td>

                        {/* Category Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-100/70 text-amber-800 font-poppins font-semibold text-[11px]">
                            {resolveCategoryName(sub)}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-zinc-500 font-mono whitespace-nowrap">
                          {sub.submittedOn || sub.createdAt || "Recently"}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-poppins font-bold ${
                            sub.status === "Under Review"
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {sub.status || "Submitted"}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="px-3 py-1 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-poppins font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            View
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-10 px-4 text-center flex flex-col items-center justify-center gap-3 bg-zinc-50/60 rounded-2xl border border-dashed border-zinc-200">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl border border-emerald-200/80">
                  <FaFileAlt className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="font-poppins font-bold text-sm text-zinc-900">No Submissions Found</h4>
                  <p className="text-xs font-inter text-zinc-500 max-w-sm mt-1">
                    You haven't submitted any Reel entries yet. Select a category and publish your Reel link to apply!
                  </p>
                </div>
                <Link
                  href="/participate"
                  className="mt-1 px-5 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-poppins font-bold text-xs shadow-2xs transition-all"
                >
                  Participate Now &rarr;
                </Link>
              </div>
            )}

            {creatorSubmissions.length > 0 && (
              <div className="text-center pt-2">
                <Link
                  href="/dashboard/applications"
                  className="text-xs font-poppins font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>View All Submissions</span> &rarr;
                </Link>
              </div>
            )}

          </div>

        </div>

        {/* Right Column (Narrow 4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Card 1: Important Updates */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaBullhorn className="w-4 h-4 text-emerald-600" />
                <h3 className="font-poppins font-bold text-sm text-zinc-950">
                  Important Updates
                </h3>
              </div>
              <Link href="/news" className="text-xs font-poppins font-bold text-emerald-700 hover:underline">
                View All
              </Link>
            </div>

            <div className="flex flex-col gap-3.5">
              
              {/* Update 1 */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm shrink-0 mt-0.5">
                  <FaBullhorn className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="font-poppins font-bold text-xs text-zinc-900">
                    State Creator Awards 2026 Live
                  </h4>
                  <p className="text-[11px] font-inter text-zinc-600 leading-relaxed">
                    Registrations & nominations are officially open across 25 award categories.
                  </p>
                  <span className="text-[10px] font-mono text-zinc-400 mt-1">Live Phase</span>
                </div>
              </div>

              {/* Update 2 */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-sm shrink-0 mt-0.5">
                  <FaFileAlt className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="font-poppins font-bold text-xs text-zinc-900">
                    Official 2026 Guidelines PDF
                  </h4>
                  <p className="text-[11px] font-inter text-zinc-600 leading-relaxed">
                    Download official rules & scheme options PDF directly from portal header.
                  </p>
                  <span className="text-[10px] font-mono text-zinc-400 mt-1">Official Document</span>
                </div>
              </div>

              {/* Update 3 */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm shrink-0 mt-0.5">
                  <FaUsers className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="font-poppins font-bold text-xs text-zinc-900">
                    Organic Engagement Rules
                  </h4>
                  <p className="text-[11px] font-inter text-zinc-600 leading-relaxed">
                    All Reels must be public. Paid promotion, Meta ads, and bots are prohibited.
                  </p>
                  <span className="text-[10px] font-mono text-zinc-400 mt-1">Compliance Rule</span>
                </div>
              </div>

            </div>
          </div>

          {/* Card 2: Need Help? */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center text-2xl">
              <FaHeadset className="w-7 h-7" />
            </div>

            <div className="flex flex-col items-center">
              <h3 className="font-poppins font-extrabold text-sm text-zinc-950">
                Need Help?
              </h3>
              <p className="text-xs font-inter text-zinc-500 max-w-xs mt-1">
                Our support team is here to help you with any queries.
              </p>
            </div>

            <a
              href="mailto:support@cgawards.gov.in"
              className="mt-1 px-5 py-2.5 rounded-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-poppins font-bold text-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <FaHeadset className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </a>
          </div>

        </div>

      </div>

      {/* ================= SUBMISSION DETAILS MODAL ================= */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-zinc-200 animate-scale-up flex flex-col">
            
            {/* Banner Header Image */}
            <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
              <img
                src={selectedSubmission.image || "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80"}
                alt={selectedSubmission.title}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <button
                onClick={() => setSelectedSubmission(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer z-10"
              >
                <FaTimes className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-4 right-4 z-10 flex flex-col gap-1 text-white">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-poppins font-bold text-[10px] uppercase w-fit">
                  {resolveCategoryName(selectedSubmission)}
                </span>
                <h3 className="font-poppins font-bold text-base text-white drop-shadow-xs line-clamp-1">
                  {selectedSubmission.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex flex-col gap-4 text-xs font-inter text-zinc-700">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex flex-col gap-0.5">
                  <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase">Submitted On</span>
                  <span className="font-mono font-bold text-zinc-900 text-xs">
                    {selectedSubmission.submittedOn || "02 Aug 2025"}
                  </span>
                </div>

                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex flex-col gap-0.5">
                  <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase">Evaluation Status</span>
                  <span className="font-poppins font-bold text-emerald-700 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    {selectedSubmission.status || "Under Review"}
                  </span>
                </div>
              </div>

              <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 flex flex-col gap-1">
                <span className="text-[10px] font-poppins font-bold text-zinc-400 uppercase">Submission Brief & Work Details</span>
                <p className="text-zinc-700 leading-relaxed text-xs">
                  {selectedSubmission.description || "Official creator entry submitted for the Chhattisgarh State Creator Awards 2026. Includes documentary video clips, photography portfolio, and cultural impact narrative."}
                </p>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between">
                <span className="font-poppins font-bold text-emerald-900 text-xs">Public Voting & Jury Score</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-poppins font-bold text-[10px]">
                  Verified Entry
                </span>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-zinc-50 border-t border-zinc-200 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-poppins font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
