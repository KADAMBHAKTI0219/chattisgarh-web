"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/context/LanguageContext";
import {
  FaTimes,
  FaTrophy,
  FaCheckCircle,
  FaLightbulb,
  FaArrowRight,
  FaAward,
  FaCoins
} from "react-icons/fa";

export default function CategoryDetailModal({ category, isOpen, onClose, onNominate }) {
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen || !category) return null;

  // Format currency
  const formatRupees = (amount) => {
    if (!amount) return "50k";
    if (amount >= 100000) {
      const lakhs = (amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1);
      return `₹${lakhs} Lakh`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}k`;
    }
    return `₹${amount}`;
  };

  const prizeText = category.cashPrizeMax
    ? category.cashPrizeMin === category.cashPrizeMax
      ? formatRupees(category.cashPrizeMax)
      : `Up to ${formatRupees(category.cashPrizeMax)}`
    : "State Trophy & Award";

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none animate-in fade-in duration-300">
      {/* Backdrop covering 100% of viewport including navbar */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 z-0 cursor-pointer"
      />

      {/* Modal Content Window */}
      <div className="relative w-full max-w-2xl bg-white border border-zinc-200 rounded-[32px] shadow-2xl z-10 flex flex-col overflow-hidden max-h-[85vh] sm:max-h-[88vh] my-auto">

        {/* Top Cover Image & Banner */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-zinc-900 shrink-0">
          <img
            src={category.image || "/assets/images/raipur_landmark.jpg"}
            alt={category.title}
            className="w-full h-full object-cover opacity-90 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-md transition-all cursor-pointer z-30"
            aria-label="Close detail modal"
          >
            <FaTimes className="w-4 h-4" />
          </button>

          {/* Badges on Banner Top */}
          <div className="absolute top-4 left-4 right-16 flex flex-wrap items-center gap-2 z-20">
            <span
              className="text-[10px] sm:text-[11px] font-inter font-bold uppercase px-3 py-1 rounded-full text-white backdrop-blur-md shadow-md tracking-wider border border-white/20"
              style={{ backgroundColor: category.color || "var(--primary)" }}
            >
              {t(category.tierLabel || category.tier || "Award Category")}
            </span>

            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-inter font-bold px-3 py-1 rounded-full text-amber-200 bg-black/60 backdrop-blur-md border border-amber-400/30 shadow-md">
              <FaCoins className="w-3 h-3 text-amber-400" />
              <span>{prizeText}</span>
            </span>
          </div>

          {/* Category Title in Banner */}
          <div className="absolute bottom-4 left-5 right-5 z-20">
            <h2 className="font-poppins font-extrabold text-lg sm:text-2xl lg:text-3xl text-white uppercase tracking-tight leading-tight drop-shadow-md">
              {language === "hi" && category.titleHi ? category.titleHi : language === "cg" && category.titleCg ? category.titleCg : t(category.title)}
            </h2>
          </div>
        </div>

        {/* Inner Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 sm:p-7 flex flex-col gap-5 sm:gap-6 text-zinc-800 text-left font-inter">

          {/* Category Overview */}
          <div className="flex flex-col gap-2 bg-zinc-50 border border-zinc-200/90 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 text-[var(--primary)] font-poppins font-bold text-xs uppercase tracking-wider">
              <FaAward className="w-4 h-4" />
              <span>{t("Category Overview")}</span>
            </div>
            <p className="text-sm sm:text-base text-zinc-700 leading-relaxed font-medium">
              {language === "hi" && (category.shortDescriptionHi || category.descriptionHi)
                ? (category.shortDescriptionHi || category.descriptionHi)
                : language === "cg" && (category.shortDescriptionCg || category.descriptionCg)
                ? (category.shortDescriptionCg || category.descriptionCg)
                : t(category.shortDescription || category.description || "Recognizing creators, influencers, and storytellers who bring out the best of Chhattisgarh's culture, technology, and social impact.")}
            </p>
          </div>

          {/* Creator Task Brief */}
          <div className="flex flex-col gap-2.5 bg-amber-500/10 border border-amber-400/30 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 text-amber-800 font-poppins font-bold text-xs uppercase tracking-wider">
              <FaLightbulb className="w-4 h-4 text-amber-600" />
              <span>{t("Submission Guidelines & Task Brief")}</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 font-semibold leading-relaxed">
              {language === "hi" && category.taskBriefHi
                ? category.taskBriefHi
                : language === "cg" && category.taskBriefCg
                ? category.taskBriefCg
                : t(category.taskBrief || "Create and submit an original video, vlog, reel, or story highlighting local traditions, innovation, or community initiatives of Chhattisgarh.")}
            </p>
          </div>

          {/* Evaluation Criteria Grid */}
          <div className="flex flex-col gap-3">
            <h4 className="font-poppins font-bold text-sm sm:text-base text-zinc-950 uppercase tracking-tight">
              {t("Jury Evaluation Criteria")}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-zinc-900">{t("Originality & Storytelling")}</span>
                  <span className="text-[11px] text-zinc-500 font-medium">{t("Unique perspective & narrative")}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-zinc-900">{t("Cultural & Regional Impact")}</span>
                  <span className="text-[11px] text-zinc-500 font-medium">{t("Promoting Chhattisgarh heritage")}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-zinc-900">{t("Production Quality")}</span>
                  <span className="text-[11px] text-zinc-500 font-medium">{t("Audio, visual & editing clarity")}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-zinc-900">{t("Audience Appreciation")}</span>
                  <span className="text-[11px] text-zinc-500 font-medium">{t("Relevance & public engagement")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Winner Reward Perks */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#2E5C31]/10 via-[#2E5C31]/5 to-transparent border border-[#2E5C31]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2E5C31] text-amber-300 flex items-center justify-center shrink-0 shadow-md">
                <FaTrophy className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-poppins font-bold text-xs sm:text-sm text-[#2E5C31]">{t("Winner Rewards & Recognition")}</span>
                <span className="text-[11px] sm:text-xs text-zinc-600 font-medium">{t("Official State Award, Trophy & Cash Prize")} ({prizeText})</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-zinc-300 bg-white hover:bg-zinc-100 font-inter font-bold text-xs sm:text-sm text-zinc-700 transition-all cursor-pointer"
          >
            {t("Close Details")}
          </button>

          <button
            onClick={() => {
              onClose();
              if (onNominate) {
                onNominate(category.title);
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>{t("Participate Now")}</span>
            <FaArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
