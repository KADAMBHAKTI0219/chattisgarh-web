"use client";

import { useState } from "react";
import Link from "next/link";
import { nominationService } from "@/services/nomination";
import {
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaArrowLeft,
  FaShieldAlt,
  FaUserCheck,
  FaFileAlt,
  FaTrophy,
  FaExclamationTriangle
} from "react-icons/fa";
import Heading from "@/components/common/Heading";

export default function TrackApplicationPage() {
  const [appId, setAppId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    const cleanId = appId.trim();
    if (!cleanId) {
      setErrorMsg("Please enter your Application ID (e.g., NCA-2026-000001)");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setTrackingResult(null);

    try {
      const res = await nominationService.trackApplication(cleanId);
      if (res.success && (res.nomination || res.data || res.application)) {
        setTrackingResult(res.nomination || res.data || res.application);
      } else {
        setErrorMsg(res.message || "Application not found. Please check your Application ID.");
      }
    } catch (err) {
      console.warn("Tracking error:", err);
      setErrorMsg("Unable to fetch status. Please check your Application ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStageStep = (stage, status) => {
    if (status === "REJECTED") return -1;
    const stages = [
      "SUBMISSION",
      "ELIGIBILITY_VERIFICATION",
      "PRELIMINARY_ASSESSMENT",
      "TIER1_SCREENING",
      "TIER2_CONTENT_REVIEW",
      "TIER3_DUE_DILIGENCE",
      "JURY_REVIEW",
      "WINNER_SELECTION",
    ];
    const index = stages.indexOf(stage || "SUBMISSION");
    return index >= 0 ? index : 0;
  };

  const stagesList = [
    { label: "Nomination Submitted", stage: "SUBMISSION", icon: FaFileAlt },
    { label: "Eligibility Verification", stage: "ELIGIBILITY_VERIFICATION", icon: FaUserCheck },
    { label: "Preliminary Assessment", stage: "PRELIMINARY_ASSESSMENT", icon: FaShieldAlt },
    { label: "Tier 1: Screening", stage: "TIER1_SCREENING", icon: FaSearch },
    { label: "Tier 2: Content Review", stage: "TIER2_CONTENT_REVIEW", icon: FaShieldAlt },
    { label: "Tier 3: Due Diligence", stage: "TIER3_DUE_DILIGENCE", icon: FaShieldAlt },
    { label: "Jury Review", stage: "JURY_REVIEW", icon: FaTrophy },
  ];

  return (
    <div className="min-h-screen bg-[#F8F4EA] font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-10 relative overflow-x-hidden animate-page-enter">
      
      {/* Navigation Top Bar */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-poppins font-bold text-zinc-600 hover:text-[#C45A32] transition-colors"
        >
          <FaArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <span className="text-[11px] font-poppins font-bold text-[#C45A32] uppercase tracking-wider bg-[#C45A32]/10 px-3 py-1 rounded-full border border-[#C45A32]/20">
          Official Portal Tracking
        </span>
      </div>

      {/* Main Track Section */}
      <div className="w-full max-w-4xl mx-auto bg-white border border-zinc-200/90 rounded-[32px] p-6 sm:p-10 shadow-sm text-left flex flex-col gap-8">
        <Heading
          badge="Live Status Tracker"
          title="TRACK YOUR"
          highlightText="APPLICATION"
          description="Enter your unique Application ID (e.g. NCA-2026-000001) to view live verification & scrutiny progress."
          align="left"
          className="px-0 mx-0"
        />

        {/* Search Input Box */}
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type="text"
              required
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="Enter Application ID (e.g., NCA-2026-000001)"
              className="w-full rounded-2xl border border-zinc-300 bg-zinc-50 pl-11 pr-4 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#C45A32] focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-2xl bg-[#C45A32] hover:bg-[#a54724] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Track Status"}
          </button>
        </form>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5 shadow-2xs">
            <FaExclamationTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Results Card */}
        {trackingResult && (
          <div className="flex flex-col gap-8 border-t border-zinc-200 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div>
                <span className="text-[10px] font-poppins font-bold uppercase text-zinc-400">Application ID</span>
                <h3 className="font-poppins font-extrabold text-xl text-[#C45A32]">
                  {trackingResult.applicationId || trackingResult._id || "NCA-2026-000001"}
                </h3>
                <span className="text-xs text-zinc-600 font-inter">
                  Applicant: <strong>{trackingResult.applicant?.fullName || trackingResult.fullName || "N/A"}</strong>
                </span>
              </div>

              <div className="flex flex-col items-start sm:items-end">
                <span className="text-[10px] font-poppins font-bold uppercase text-zinc-400">Current Status</span>
                <span
                  className={`px-3.5 py-1 rounded-full text-xs font-poppins font-bold uppercase tracking-wider border ${
                    trackingResult.status === "APPROVED"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : trackingResult.status === "REJECTED"
                      ? "bg-rose-100 text-rose-800 border-rose-300"
                      : "bg-sky-100 text-sky-800 border-sky-300"
                  }`}
                >
                  {trackingResult.status || "SUBMITTED"}
                </span>
              </div>
            </div>

            {/* Stages Timeline Progress */}
            <div className="flex flex-col gap-4">
              <h4 className="font-poppins font-bold text-sm uppercase text-zinc-900 tracking-wider">
                Scrutiny & Review Progress
              </h4>

              <div className="flex flex-col gap-4 pl-2 border-l-2 border-zinc-200">
                {stagesList.map((stg, idx) => {
                  const currentStageIdx = getStageStep(trackingResult.currentStage, trackingResult.status);
                  const isPassed = idx <= currentStageIdx;
                  const isCurrent = idx === currentStageIdx;
                  const StgIcon = stg.icon;

                  return (
                    <div key={idx} className="relative flex items-start gap-4 pl-4 group">
                      {/* Step Indicator Node */}
                      <div
                        className={`absolute -left-[13px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                          isPassed
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "bg-white border-zinc-300 text-zinc-400"
                        }`}
                      >
                        {isPassed ? (
                          <FaCheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <span className="text-[10px] font-bold">{idx + 1}</span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <span
                          className={`font-poppins font-bold text-xs sm:text-sm ${
                            isCurrent
                              ? "text-[#C45A32]"
                              : isPassed
                              ? "text-zinc-900"
                              : "text-zinc-400"
                          }`}
                        >
                          {stg.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[11px] font-inter text-zinc-500">
                            Currently undergoing official verification & evaluation under state guidelines.
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
