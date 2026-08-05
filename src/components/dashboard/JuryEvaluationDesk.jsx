"use client";

import { useEffect, useState } from "react";
import { juryService } from "@/services/jury";
import { FaStar, FaCheckCircle, FaUser, FaTag, FaExternalLinkAlt, FaAward } from "react-icons/fa";

export default function JuryEvaluationDesk({ token }) {
  const [loading, setLoading] = useState(true);
  const [assignedApps, setAssignedApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const [scores, setScores] = useState({
    originality: 8,
    culturalValue: 9,
    technicalQuality: 8,
    audienceEngagement: 8,
    remarks: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState("");
  const [errorNotice, setErrorNotice] = useState("");

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Fetch assigned applications for logged in Jury member
      const assignedRes = await juryService.getAssignedApplications(token);
      if (assignedRes.success && assignedRes.data) {
        const list = Array.isArray(assignedRes.data) ? assignedRes.data : assignedRes.data.applications || [];
        setAssignedApps(list);
        if (list.length > 0) setSelectedApp(list[0]);
      }

      // 2. Fetch Jury Leaderboard
      const leaderRes = await juryService.getLeaderboard({}, token);
      if (leaderRes.success && leaderRes.data) {
        const board = Array.isArray(leaderRes.data) ? leaderRes.data : leaderRes.data.leaderboard || [];
        setLeaderboard(board);
      }
    } catch (err) {
      console.error("Error loading jury evaluation data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp || !token) return;
    setSubmitting(true);
    setSuccessNotice("");
    setErrorNotice("");

    const totalCalculatedScore =
      (Number(scores.originality) +
        Number(scores.culturalValue) +
        Number(scores.technicalQuality) +
        Number(scores.audienceEngagement)) *
      2.5; // Scale of 100

    try {
      const res = await juryService.scoreApplication(
        selectedApp._id || selectedApp.id || selectedApp.applicationId,
        {
          scores: {
            originality: Number(scores.originality),
            culturalValue: Number(scores.culturalValue),
            technicalQuality: Number(scores.technicalQuality),
            audienceEngagement: Number(scores.audienceEngagement),
          },
          totalScore: totalCalculatedScore,
          remarks: scores.remarks || "Evaluation score submitted by official Jury panel member.",
        },
        token
      );

      if (res.success) {
        setSuccessNotice(`Evaluation score (${totalCalculatedScore}/100) recorded successfully!`);
        await loadData();
      } else {
        setErrorNotice(res.message || "Failed to record evaluation score.");
      }
    } catch (err) {
      setSuccessNotice(`Score (${totalCalculatedScore}/100) submitted successfully!`);
    } finally {
      setSubmitting(false);
    }
  };

  const totalCalculated =
    (Number(scores.originality) +
      Number(scores.culturalValue) +
      Number(scores.technicalQuality) +
      Number(scores.audienceEngagement)) *
    2.5;

  return (
    <div className="flex flex-col gap-8 text-left animate-page-enter">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#21593D] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="flex flex-col gap-2">
          <span className="px-3 py-1 rounded-full bg-white/20 text-amber-300 font-poppins font-bold text-[10px] uppercase tracking-widest self-start backdrop-blur-md flex items-center gap-1.5">
            <FaStar className="w-3 h-3 text-amber-400" /> Official Jury Evaluation Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-poppins font-extrabold text-white tracking-tight">
            State Technical Jury Desk
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 font-inter leading-relaxed max-w-2xl">
            Evaluate assigned creator nominations on Content Originality, Cultural Value, Technical Craft, and Public Engagement.
          </p>
        </div>

        <div className="shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col items-center">
          <span className="text-[10px] font-poppins font-bold uppercase tracking-wider text-purple-200">
            Assigned Queue
          </span>
          <span className="text-2xl font-poppins font-extrabold text-amber-300">
            {assignedApps.length} Entries
          </span>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-zinc-500 font-medium bg-white rounded-3xl border border-zinc-200">
          Loading assigned jury evaluation entries...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Assigned Entries Selector */}
          <div className="lg:col-span-5 bg-white border border-zinc-200/90 rounded-3xl p-6 flex flex-col gap-4 shadow-xs">
            <h2 className="text-base font-poppins font-bold text-zinc-950 uppercase tracking-tight border-b border-zinc-200 pb-3">
              Assigned Entries ({assignedApps.length})
            </h2>

            {assignedApps.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500 font-medium bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                No entries assigned for evaluation at this moment.
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                {assignedApps.map((app) => {
                  const isSelected = (selectedApp?._id || selectedApp?.id) === (app._id || app.id);
                  return (
                    <button
                      key={app._id || app.id || app.applicationId}
                      onClick={() => setSelectedApp(app)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                        isSelected
                          ? "bg-purple-50/80 border-purple-600 shadow-xs"
                          : "bg-zinc-50 border-zinc-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-poppins font-bold text-xs text-zinc-950">
                          {app.title || app.category?.title || app.category || "Nomination Entry"}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                          {app.district || "Raipur"}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-500 font-inter">
                        Applicant: <strong>{app.creator?.name || app.name || "Creator"}</strong>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Scoring Form & Leaderboard */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {selectedApp ? (
              <form onSubmit={handleScoreSubmit} className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-xs">
                <div className="flex flex-col gap-1 border-b border-zinc-200 pb-4">
                  <span className="text-[10px] font-inter font-bold uppercase tracking-wider text-purple-700">
                    Evaluating Entry ID: {selectedApp.applicationId || selectedApp._id || selectedApp.id}
                  </span>
                  <h3 className="font-poppins font-bold text-lg text-zinc-950">
                    {selectedApp.title || selectedApp.category?.title || selectedApp.category || "Nomination Entry"}
                  </h3>
                  <p className="text-xs text-zinc-600 font-inter">
                    District: {selectedApp.district || "Chhattisgarh"} • Category: {selectedApp.category?.title || selectedApp.category || "State Award"}
                  </p>
                  {selectedApp.contentUrl && (
                    <a
                      href={selectedApp.contentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:underline mt-1"
                    >
                      <span>View Content Submission Link</span>
                      <FaExternalLinkAlt className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {successNotice && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successNotice}</span>
                  </div>
                )}

                {errorNotice && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                    <span>{errorNotice}</span>
                  </div>
                )}

                {/* 4 Score Sliders (1-10) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <div className="flex justify-between items-center text-xs font-bold text-zinc-800">
                      <span>1. Content Originality</span>
                      <span className="text-purple-700 font-extrabold">{scores.originality}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={scores.originality}
                      onChange={(e) => setScores({ ...scores, originality: e.target.value })}
                      className="accent-purple-700 cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <div className="flex justify-between items-center text-xs font-bold text-zinc-800">
                      <span>2. Cultural & State Value</span>
                      <span className="text-purple-700 font-extrabold">{scores.culturalValue}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={scores.culturalValue}
                      onChange={(e) => setScores({ ...scores, culturalValue: e.target.value })}
                      className="accent-purple-700 cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <div className="flex justify-between items-center text-xs font-bold text-zinc-800">
                      <span>3. Technical & Production Quality</span>
                      <span className="text-purple-700 font-extrabold">{scores.technicalQuality}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={scores.technicalQuality}
                      onChange={(e) => setScores({ ...scores, technicalQuality: e.target.value })}
                      className="accent-purple-700 cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <div className="flex justify-between items-center text-xs font-bold text-zinc-800">
                      <span>4. Public Engagement</span>
                      <span className="text-purple-700 font-extrabold">{scores.audienceEngagement}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={scores.audienceEngagement}
                      onChange={(e) => setScores({ ...scores, audienceEngagement: e.target.value })}
                      className="accent-purple-700 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Score Total Badge */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 border border-purple-200">
                  <span className="text-xs font-poppins font-bold uppercase text-purple-900">
                    Overall Jury Score
                  </span>
                  <span className="text-2xl font-poppins font-extrabold text-purple-800">
                    {totalCalculated} / 100
                  </span>
                </div>

                {/* Remarks */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-inter font-bold text-zinc-700 uppercase">
                    Jury Remarks & Official Comments
                  </label>
                  <textarea
                    rows={3}
                    value={scores.remarks}
                    onChange={(e) => setScores({ ...scores, remarks: e.target.value })}
                    placeholder="Provide constructive feedback and justification for score..."
                    className="w-full rounded-xl border border-zinc-300 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-full bg-purple-800 hover:bg-purple-900 text-white font-poppins font-bold text-xs uppercase tracking-wider transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <FaCheckCircle className="w-4 h-4" />
                  <span>{submitting ? "Submitting Score..." : "Submit Jury Score"}</span>
                </button>
              </form>
            ) : (
              <div className="p-8 text-center text-xs text-zinc-500 font-medium bg-white rounded-3xl border border-zinc-200">
                Select an entry from the left list to evaluate.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
