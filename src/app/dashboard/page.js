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

  useEffect(() => {
    const loadDashboard = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);

        if (isAdmin) {
          // Admin overview handling inside AdminDashboard component
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

  if (isJury) {
    return <JuryEvaluationDesk token={token} />;
  }

  if (isAdmin) {
    return <AdminDashboard token={token} />;
  }

  // Sample Mock Submissions for Creator Dashboard matching Image 2
  const creatorSubmissions = applicationsList.length > 0 ? applicationsList : [
    {
      _id: "sub-1",
      title: "Bastar Dussehra – The World's Longest Festival",
      category: "Tribal Heritage Creator",
      submittedOn: "02 Aug 2025",
      status: "Under Review",
      image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=300&q=80"
    },
    {
      _id: "sub-2",
      title: "Tribal Art – Our Identity, Our Pride",
      category: "Tribal Heritage Creator",
      submittedOn: "28 Jul 2025",
      status: "Submitted",
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80"
    }
  ];

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
                You are participating in the following category
              </p>
            </div>

            {/* Participation Banner Box */}
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
                    Tribal Heritage Creator
                  </h3>
                  <p className="text-xs font-inter text-zinc-600 line-clamp-1 max-w-md">
                    Videos or content showcasing the rich tribal heritage of Chhattisgarh.
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard?tab=participation"
                className="px-4 py-2 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white font-poppins font-bold text-xs transition-all cursor-pointer shrink-0 self-end sm:self-center"
              >
                View Details &rarr;
              </Link>
            </div>
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
                  <span className="text-xl font-poppins font-extrabold text-zinc-950">2</span>
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
                  <span className="text-xl font-poppins font-extrabold text-zinc-950">1</span>
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
                  <span className="text-xl font-poppins font-extrabold text-zinc-950">0</span>
                  <span className="text-[10px] font-inter text-zinc-400">Congratulations!</span>
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
                    <tr key={sub._id} className="hover:bg-zinc-50/80 transition-colors">
                      
                      {/* Title with Image Thumbnail */}
                      <td className="py-3.5 px-4 font-poppins font-bold text-zinc-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={sub.image || "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=300&q=80"}
                            alt={sub.title}
                            className="w-10 h-10 rounded-lg object-cover border border-zinc-200 shrink-0"
                          />
                          <span className="line-clamp-1 max-w-xs">{sub.title}</span>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-100/70 text-amber-800 font-poppins font-semibold text-[11px]">
                          {sub.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-zinc-500 font-mono whitespace-nowrap">
                        {sub.submittedOn || "02 Aug 2025"}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-poppins font-bold ${
                          sub.status === "Under Review"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {sub.status}
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

            <div className="text-center pt-2">
              <Link
                href="/dashboard/applications"
                className="text-xs font-poppins font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
              >
                <span>View All Submissions</span> &rarr;
              </Link>
            </div>

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
              <Link href="/dashboard/events" className="text-xs font-poppins font-bold text-emerald-700 hover:underline">
                View All
              </Link>
            </div>

            <div className="flex flex-col gap-3.5">
              
              {/* Update 1 */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm shrink-0 mt-0.5">
                  <FaCalendarAlt className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="font-poppins font-bold text-xs text-zinc-900">
                    National Creators Award 2025
                  </h4>
                  <p className="text-[11px] font-inter text-zinc-600 leading-relaxed">
                    Registrations are now open. Participate and showcase your talent.
                  </p>
                  <span className="text-[10px] font-mono text-zinc-400 mt-1">01 Aug 2025</span>
                </div>
              </div>

              {/* Update 2 */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-sm shrink-0 mt-0.5">
                  <FaClock className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="font-poppins font-bold text-xs text-zinc-900">
                    Last Date Extended!
                  </h4>
                  <p className="text-[11px] font-inter text-zinc-600 leading-relaxed">
                    The last date for some categories has been extended. Check now.
                  </p>
                  <span className="text-[10px] font-mono text-zinc-400 mt-1">30 Jul 2025</span>
                </div>
              </div>

              {/* Update 3 */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm shrink-0 mt-0.5">
                  <FaUsers className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="font-poppins font-bold text-xs text-zinc-900">
                    Webinar for Participants
                  </h4>
                  <p className="text-[11px] font-inter text-zinc-600 leading-relaxed">
                    Join our webinar to know more about the award and submission guidelines.
                  </p>
                  <span className="text-[10px] font-mono text-zinc-400 mt-1">25 Jul 2025</span>
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
                  {selectedSubmission.category || "Tribal Heritage Creator"}
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
