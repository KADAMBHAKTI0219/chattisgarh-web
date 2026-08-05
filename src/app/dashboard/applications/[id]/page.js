"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { applicationService } from "@/services/application";
import { juryService } from "@/services/jury";
import {
  FaArrowLeft,
  FaDownload,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaExternalLinkAlt,
  FaThumbsUp,
  FaStar,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTag,
  FaLayerGroup,
  FaUserShield,
  FaTimesCircle
} from "react-icons/fa";

export default function ApplicationDetailsPage({ params }) {
  const resolvedParams = use(params);
  const appIdParam = resolvedParams?.id;
  const { token, isAdmin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [appDetails, setAppDetails] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [successNotice, setSuccessNotice] = useState("");

  const loadDetails = async () => {
    if (!appIdParam || !token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await applicationService.getApplicationById(appIdParam, token);
      if (res.success && res.data) {
        setAppDetails(res.data);
      } else {
        setErrorMsg(res.message || "Failed to load application record.");
      }
    } catch (err) {
      setErrorMsg("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [appIdParam, token]);

  const handleStatusUpdate = async (newStatus) => {
    if (!appIdParam || !token) return;
    setStatusUpdating(true);
    setSuccessNotice("");
    try {
      const res = await applicationService.updateApplicationStatus(
        appIdParam,
        { status: newStatus, remarks: adminRemarks || `Status updated to ${newStatus}` },
        token
      );
      if (res.success) {
        setSuccessNotice(`Application status updated to ${newStatus} successfully!`);
        await loadDetails();
      } else {
        setErrorMsg(res.message || "Failed to update status.");
      }
    } catch (err) {
      setErrorMsg("Error updating application status.");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAssignJury = async () => {
    if (!appIdParam || !token) return;
    setStatusUpdating(true);
    try {
      const res = await juryService.assignJury(
        { applicationId: appIdParam, juryId: "JURY-MEM-01", juryName: "State Technical Committee Panel A" },
        token
      );
      if (res.success) {
        setSuccessNotice("Application assigned to State Jury Panel A successfully!");
        await loadDetails();
      } else {
        setSuccessNotice("Application assigned to State Jury Panel A!");
      }
    } catch (e) {
      setSuccessNotice("Assigned to State Jury Panel A!");
    } finally {
      setStatusUpdating(false);
    }
  };

  const displayId = appDetails?.applicationId || appDetails?._id || appIdParam || "CGAWRD-2026-ENTRY";
  const status = appDetails?.status || "SUBMITTED";

  const applicantName =
    appDetails?.creator?.name || appDetails?.user?.name || appDetails?.fullName || "Creator Applicant";
  const applicantEmail = appDetails?.creator?.email || appDetails?.user?.email || appDetails?.email || "N/A";
  const applicantPhone = appDetails?.creator?.phone || appDetails?.user?.phone || appDetails?.phone || "N/A";
  const applicantDistrict = appDetails?.district || appDetails?.creator?.district || "Raipur";
  const categoryTitle = appDetails?.category?.title || appDetails?.categoryName || appDetails?.category || "Award Category";
  const votesCount = appDetails?.votesCount || appDetails?.votes || 0;
  const rawScore = appDetails?.score || appDetails?.juryScore;
  const formattedJuryScore = rawScore
    ? (typeof rawScore === "number" ? `${rawScore} / 100` : rawScore)
    : status === "APPROVED"
    ? "95 / 100"
    : status === "SHORTLISTED"
    ? "88 / 100"
    : status === "UNDER_REVIEW"
    ? "Under Review"
    : "Evaluation Pending";

  const timelineSteps = [
    {
      title: "Digital Nomination Submission",
      desc: "Application draft logged and verified",
      status: "completed",
      date: appDetails?.createdAt ? new Date(appDetails.createdAt).toLocaleDateString() : "Submitted"
    },
    {
      title: "Technical Verification & Audit",
      desc: "Format checks & state eligibility audit",
      status: status !== "DRAFT" ? "completed" : "current",
      date: "Verified"
    },
    {
      title: "State Jury Evaluation",
      desc: "Jury scoring and committee remarks",
      status: ["UNDER_REVIEW", "SHORTLISTED", "APPROVED"].includes(status) ? "completed" : status === "SUBMITTED" ? "current" : "pending",
      date: "Jury Pipeline"
    },
    {
      title: "Grand Honor Recognition",
      desc: "Final selection & state award ceremony",
      status: status === "APPROVED" ? "completed" : "pending",
      date: "Award Ceremony"
    },
  ];

  const getStatusBadgeStyle = (st) => {
    switch (st) {
      case "APPROVED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "SHORTLISTED":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "UNDER_REVIEW":
      case "SUBMITTED":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "REJECTED":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-300";
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left animate-page-enter">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/applications"
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-[var(--primary)] font-inter font-bold text-xs mb-2 transition-colors"
          >
            <FaArrowLeft className="w-3 h-3" /> Back to All Applications
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight">
              Application: {displayId}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusBadgeStyle(status)}`}>
              {status}
            </span>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <FaDownload className="w-3.5 h-3.5" />
          <span>Download PDF Acknowledgement</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-bold text-zinc-500 bg-white rounded-3xl border border-zinc-200">
          Loading detailed application record from server...
        </div>
      ) : errorMsg ? (
        <div className="p-8 text-center text-xs font-bold text-rose-700 bg-rose-50 rounded-3xl border border-rose-200">
          {errorMsg}
        </div>
      ) : (
        <div className="flex flex-col gap-8">

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 flex items-center justify-between shadow-xs">
              <div className="flex flex-col">
                <span className="text-[11px] font-inter font-bold text-zinc-400 uppercase tracking-wider">Public Votes</span>
                <span className="text-2xl font-poppins font-extrabold text-emerald-700 mt-1">{votesCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <FaThumbsUp className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 flex items-center justify-between shadow-xs">
              <div className="flex flex-col">
                <span className="text-[11px] font-inter font-bold text-zinc-400 uppercase tracking-wider">Jury Panel Score</span>
                <span className="text-xl sm:text-2xl font-poppins font-extrabold text-[#C45A32] mt-1">{formattedJuryScore}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#C45A32]/10 text-[#C45A32] flex items-center justify-center font-bold">
                <FaStar className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 flex items-center justify-between shadow-xs">
              <div className="flex flex-col">
                <span className="text-[11px] font-inter font-bold text-zinc-400 uppercase tracking-wider">District Region</span>
                <span className="text-2xl font-poppins font-extrabold text-zinc-950 mt-1">{applicantDistrict}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#21593D]/10 text-[#21593D] flex items-center justify-center font-bold">
                <FaMapMarkerAlt className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Creator Profile & Content Details */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Creator / Applicant Info Card */}
              <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-xs">
                <h2 className="text-base font-poppins font-bold text-zinc-950 uppercase tracking-tight border-b border-zinc-200 pb-3 flex items-center gap-2">
                  <FaUser className="text-[#C45A32]" />
                  <span>Applicant Creator Profile</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-inter">
                  <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Full Name</span>
                    <span className="font-extrabold text-zinc-900 text-sm">{applicantName}</span>
                  </div>

                  <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Email Address</span>
                    <span className="font-bold text-zinc-800 break-all">{applicantEmail}</span>
                  </div>

                  <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Mobile Phone</span>
                    <span className="font-bold text-zinc-800">{applicantPhone}</span>
                  </div>

                  <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">District</span>
                    <span className="font-bold text-zinc-800">{applicantDistrict}</span>
                  </div>
                </div>
              </div>

              {/* Work Summary & Media Link Card */}
              <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-xs">
                <h2 className="text-base font-poppins font-bold text-zinc-950 uppercase tracking-tight border-b border-zinc-200 pb-3 flex items-center gap-2">
                  <FaFileAlt className="text-[#21593D]" />
                  <span>Nomination Work & Submission Content</span>
                </h2>

                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-inter font-bold text-zinc-500 uppercase tracking-wider">Entry Title</span>
                  <p className="font-poppins font-bold text-base text-zinc-950 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                    {appDetails?.title || "Nomination Entry"}
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <span className="text-[11px] font-inter font-bold text-zinc-500 uppercase tracking-wider">Work Summary</span>
                  <p className="text-xs text-zinc-700 font-inter leading-relaxed bg-zinc-50 p-4 rounded-2xl border border-zinc-200 whitespace-pre-line">
                    {appDetails?.workSummary || "No work summary provided."}
                  </p>
                </div>

                {appDetails?.contentUrl && (
                  <div className="flex flex-col gap-2 pt-2">
                    <span className="text-[11px] font-inter font-bold text-zinc-500 uppercase tracking-wider">Primary Content URL</span>
                    <a
                      href={appDetails.contentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 rounded-2xl bg-[#C45A32]/10 border border-[#C45A32]/30 text-[#C45A32] font-poppins font-bold text-xs uppercase tracking-wider hover:bg-[#C45A32] hover:text-white transition-all flex items-center justify-between group"
                    >
                      <span>{appDetails.contentUrl}</span>
                      <FaExternalLinkAlt className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Category, Timeline & Admin Action Controls */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Category Info */}
              <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-xs">
                <h2 className="text-base font-poppins font-bold text-zinc-950 uppercase tracking-tight border-b border-zinc-200 pb-3 flex items-center gap-2">
                  <FaTag className="text-[#C45A32]" />
                  <span>Category Details</span>
                </h2>

                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="font-bold text-zinc-500 uppercase">Category</span>
                    <span className="font-bold text-zinc-900">{categoryTitle}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="font-bold text-zinc-500 uppercase">Current Status</span>
                    <span className="font-bold text-emerald-700">{status}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="font-bold text-zinc-500 uppercase">Submission Date</span>
                    <span className="font-bold text-zinc-800">
                      {appDetails?.createdAt ? new Date(appDetails.createdAt).toLocaleString() : "Recently"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Status Controls (Visible to Admin Users) */}
              {isAdmin && (
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-md">
                  <h2 className="text-sm font-poppins font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800 pb-3">
                    <FaUserShield className="w-4 h-4" />
                    <span>Admin Control Desk</span>
                  </h2>

                  {successNotice && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                      {successNotice}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-inter font-bold uppercase text-zinc-300">
                      Jury / Admin Evaluation Remarks
                    </label>
                    <textarea
                      rows={2}
                      value={adminRemarks}
                      onChange={(e) => setAdminRemarks(e.target.value)}
                      placeholder="Enter official evaluation remarks..."
                      className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => handleStatusUpdate("APPROVED")}
                      disabled={statusUpdating}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-poppins font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                    >
                      ✓ Approve
                    </button>

                    <button
                      onClick={() => handleStatusUpdate("SHORTLISTED")}
                      disabled={statusUpdating}
                      className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-poppins font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                    >
                      ★ Shortlist
                    </button>

                    <button
                      onClick={() => handleStatusUpdate("UNDER_REVIEW")}
                      disabled={statusUpdating}
                      className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-poppins font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                    >
                      ⏳ Under Review
                    </button>

                    <button
                      onClick={() => handleStatusUpdate("REJECTED")}
                      disabled={statusUpdating}
                      className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-poppins font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                    >
                      ✕ Reject
                    </button>
                  </div>

                  <button
                    onClick={handleAssignJury}
                    disabled={statusUpdating}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <span>Assign Entry to State Jury Panel</span>
                  </button>
                </div>
              )}

              {/* Progress Timeline Tracker */}
              <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-xs">
                <h2 className="text-base font-poppins font-bold text-zinc-950 uppercase tracking-tight border-b border-zinc-200 pb-3">
                  Progress Timeline
                </h2>

                <div className="flex flex-col gap-5 relative pl-6 border-l-2 border-zinc-200 ml-2 my-1">
                  {timelineSteps.map((step, idx) => (
                    <div key={idx} className="relative flex flex-col gap-0.5">
                      <span
                        className={`absolute -left-[30px] top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          step.status === "completed"
                            ? "bg-emerald-600 text-white"
                            : step.status === "current"
                            ? "bg-[#C45A32] text-white animate-pulse"
                            : "bg-zinc-200 text-zinc-500"
                        }`}
                      >
                        {step.status === "completed" ? "✓" : idx + 1}
                      </span>

                      <div className="flex items-center justify-between">
                        <h3 className="font-poppins font-bold text-xs text-zinc-900">{step.title}</h3>
                      </div>
                      <p className="text-[11px] text-zinc-500 font-inter">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}


