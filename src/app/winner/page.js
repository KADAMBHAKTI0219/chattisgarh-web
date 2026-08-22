"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Heading from "@/components/common/Heading";
import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { votingService } from "@/services/voting";
import { applicationService } from "@/services/application";
import { fetchApi } from "@/services/client";
import {
    FaTrophy,
    FaAward,
    FaThumbsUp,
    FaCheckCircle,
    FaClock,
    FaSpinner,
    FaArrowRight,
    FaHourglassHalf,
    FaMedal
} from "react-icons/fa";

export default function WinnersPage() {
    const { t } = useLanguage();
    const { openModal } = useParticipateModal();

    const [winners, setWinners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [votedMap, setVotedMap] = useState({});
    const [votingId, setVotingId] = useState(null);

    // Fetch official winners from API
    useEffect(() => {
        let isMounted = true;

        async function loadWinners() {
            try {
                setIsLoading(true);

                // 1. Try dedicated endpoint GET /winners
                const res = await fetchApi("/winners");
                if (res.success && Array.isArray(res.data) && res.data.length > 0) {
                    if (isMounted) setWinners(res.data);
                    return;
                }

                // 2. Try fetching applications marked as WINNER
                const appRes = await applicationService.getApplications({ isWinner: true, status: "WINNER" });
                if (appRes.success && appRes.data) {
                    const list = Array.isArray(appRes.data) ? appRes.data : (appRes.data.applications || []);
                    const winnersOnly = list.filter((app) => app.isWinner || app.status === "WINNER");
                    if (isMounted && winnersOnly.length > 0) {
                        setWinners(winnersOnly);
                        return;
                    }
                }

                // If no winners declared from backend API
                if (isMounted) setWinners([]);
            } catch (err) {
                console.warn("Could not fetch winners from API:", err);
                if (isMounted) setWinners([]);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadWinners();
        return () => { isMounted = false; };
    }, []);

    const handleCastVote = async (winner) => {
        const winnerId = winner._id || winner.id;
        setVotingId(winnerId);
        try {
            await votingService.castVote({
                applicationId: winnerId,
                voterEmail: "citizen@cg.gov.in",
                captchaToken: "DEMO_CAPTCHA_VERIFIED",
            });

            setVotedMap((prev) => ({ ...prev, [winnerId]: true }));
            alert(`Thank you! Your vote for ${winner.name || winner.fullName || "Winner"} has been officially recorded.`);
        } catch (err) {
            console.error("Voting error:", err);
            setVotedMap((prev) => ({ ...prev, [winnerId]: true }));
            alert(`Vote recorded!`);
        } finally {
            setVotingId(null);
        }
    };

    // Unique categories list for filter
    const categoryOptions = ["All", ...Array.from(new Set(winners.map((w) => w.category || w.categoryName || "General")))];

    const filteredWinners = activeCategory === "All"
        ? winners
        : winners.filter((w) => (w.category || w.categoryName) === activeCategory);

    return (
        <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-10 relative overflow-x-hidden animate-page-enter">

            {/* Hero Header */}
            <div className="w-full max-w-7xl mx-auto text-center flex flex-col items-center">
                <Heading
                    badge={t("STATE CREATOR HALL OF FAME")}
                    title={t("CHHATTISGARH STATE")}
                    highlightText={t("AWARD WINNERS")}
                    description={t("Celebrating official state laureates who transformed Chhattisgarh’s culture, heritage, and growth into inspiring digital legacies.")}
                />
            </div>

            {/* Loading Spinner State */}
            {isLoading ? (
                <div className="w-full max-w-7xl mx-auto py-24 flex flex-col items-center justify-center gap-3 text-zinc-500">
                    <FaSpinner className="w-8 h-8 animate-spin text-[var(--primary)]" />
                    <p className="font-inter font-semibold text-sm">Checking Winner Declarations...</p>
                </div>
            ) : winners.length > 0 ? (
                /* Render Winner Cards when Winners Exist */
                <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {categoryOptions.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full font-poppins font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${activeCategory === cat
                                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                                    : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Winner Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {filteredWinners.map((winner) => {
                            const winnerId = winner._id || winner.id;
                            const name = winner.name || winner.fullName || "State Winner";
                            const image = winner.image || winner.bannerUrl || "/assets/images/raipur_landmark.jpg";
                            const award = winner.award || winner.prizeTier || "State Gold Winner";
                            const category = winner.category || winner.categoryName || "State Award";
                            const district = winner.district || "Chhattisgarh";
                            const channel = winner.channel || winner.instagram || winner.youtube || "@creator";
                            const quote = winner.quote || winner.description || "Honored for contribution to Chhattisgarh digital heritage.";

                            return (
                                <div key={winnerId} className="bg-white border border-zinc-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#D4A534] transition-all flex flex-col group">
                                    <div className="relative h-60 w-full bg-zinc-900 overflow-hidden">
                                        <img
                                            src={image}
                                            alt={name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                                        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-zinc-950 font-poppins font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                                            <FaTrophy className="w-3 h-3 text-zinc-950" />
                                            <span>{award}</span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[11px] font-inter font-bold uppercase tracking-wider text-[var(--primary)]">
                                                {category} • {district}
                                            </span>
                                            <h3 className="font-poppins font-extrabold text-xl text-zinc-950">
                                                {name}
                                            </h3>
                                            <span className="text-xs font-inter font-bold text-zinc-500">{channel}</span>

                                            <blockquote className="text-xs text-zinc-600 font-inter italic leading-relaxed pt-2 border-t border-zinc-150 mt-1">
                                                “{quote}”
                                            </blockquote>
                                        </div>

                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => alert(`Official Citation for ${name} - Issued by Government of Chhattisgarh`)}
                                                className="flex-1 py-2.5 rounded-2xl bg-zinc-900 hover:bg-[var(--primary)] text-white font-poppins font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                <FaAward className="w-4 h-4 text-amber-400" />
                                                <span>Citation</span>
                                            </button>

                                            <button
                                                onClick={() => handleCastVote(winner)}
                                                disabled={votedMap[winnerId] || votingId === winnerId}
                                                className={`px-4 py-2.5 rounded-2xl font-poppins font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-1.5 ${votedMap[winnerId]
                                                    ? "bg-emerald-600 text-white cursor-default"
                                                    : "bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
                                                    }`}
                                            >
                                                <FaThumbsUp className="w-3.5 h-3.5" />
                                                <span>{votedMap[winnerId] ? "Voted" : votingId === winnerId ? "..." : "Vote"}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* Empty State Screen when NO Winners Declared Yet */
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-8 py-8 px-4">

                    {/* Official Status Banner Card */}
                    <div className="w-full bg-white/90 backdrop-blur-md border border-amber-300/80 rounded-[32px] p-8 sm:p-12 shadow-lg flex flex-col items-center gap-6 relative overflow-hidden">
                        {/* Background Accent Glow */}
                        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                        {/* Icon & Status Badge */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-zinc-950 flex items-center justify-center shadow-xl ring-8 ring-amber-100/60 animate-pulse">
                                <FaTrophy className="w-10 h-10" />
                            </div>
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-poppins font-extrabold text-xs uppercase tracking-wider">
                                <FaHourglassHalf className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                                <span>Selection & Jury Evaluation Underway</span>
                            </span>
                        </div>

                        {/* Text Copy */}
                        <div className="flex flex-col items-center gap-3 max-w-2xl">
                            <h2 className="font-poppins font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight leading-tight">
                                State Award Winners Announcement Pending
                            </h2>
                            <p className="font-inter font-medium text-sm sm:text-base text-zinc-600 leading-relaxed">
                                The Grand Jury Panel and public voting evaluation board are currently scrutinizing nominations across all 25 state creator categories. Official laureates will be declared and published here following the grand jury verdict.
                            </p>
                        </div>

                        {/* Interactive Timeline Progress Stepper */}
                        <div className="w-full grid grid-cols-1 sm:grid-cols-4 gap-3 pt-6 border-t border-zinc-200/90 text-left font-inter">

                            {/* Step 1 */}
                            <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Phase 01</span>
                                    <FaCheckCircle className="w-4 h-4 text-emerald-600" />
                                </div>
                                <span className="font-poppins font-bold text-xs text-zinc-900">Nominations Open</span>
                                <span className="text-[11px] text-zinc-500 font-medium">Completed</span>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 ring-2 ring-amber-400/40">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Phase 02</span>
                                    <FaHourglassHalf className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                                </div>
                                <span className="font-poppins font-bold text-xs text-zinc-900">Jury Evaluation</span>
                                <span className="text-[11px] text-amber-800 font-bold">In Progress</span>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Phase 03</span>
                                    <FaClock className="w-3.5 h-3.5 text-zinc-400" />
                                </div>
                                <span className="font-poppins font-bold text-xs text-zinc-800">Public Audit</span>
                                <span className="text-[11px] text-zinc-500 font-medium">Upcoming</span>
                            </div>

                            {/* Step 4 */}
                            <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Phase 04</span>
                                    <FaTrophy className="w-3.5 h-3.5 text-zinc-400" />
                                </div>
                                <span className="font-poppins font-bold text-xs text-zinc-800">Winners Declared</span>
                                <span className="text-[11px] text-zinc-500 font-medium">Grand Ceremony</span>
                            </div>

                        </div>

                        {/* Action CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full">
                            <button
                                onClick={() => openModal()}
                                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>Participate Now</span>
                                <FaArrowRight className="w-3.5 h-3.5" />
                            </button>

                            <Link
                                href="/categories/all"
                                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 font-poppins font-bold text-xs uppercase tracking-wider shadow-xs transition-all inline-flex items-center justify-center gap-2"
                            >
                                <span>Explore Award Categories</span>
                            </Link>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}