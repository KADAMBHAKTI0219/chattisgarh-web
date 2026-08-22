"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { FaEdit, FaUserCheck, FaPoll, FaTrophy, FaArrowRight, FaSparkles } from "react-icons/fa";
import Heading from "@/components/common/Heading";

export default function HowToApplySection() {
  const { t } = useLanguage();
  const { openModal } = useParticipateModal();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      stepNum: "01",
      badge: "DIGITAL REGISTRATION",
      title: "Submit Your Nomination",
      desc: "Complete the online application by sharing your creator profile, content links, preferred award category, and a brief summary of your creative work. It only takes a few minutes to begin your journey.",
      icon: FaEdit,
      color: "#C45A32", // Terracotta
      bgGlow: "rgba(196, 90, 50, 0.12)",
    },
    {
      stepNum: "02",
      badge: "VERIFICATION & REVIEW",
      title: "Screening & Verification",
      desc: "Our expert review committee carefully verifies your submission, content authenticity, creator profile, and community compliance to ensure a fair and transparent selection process.",
      icon: FaUserCheck,
      color: "#21593D", // Forest Green
      bgGlow: "rgba(33, 89, 61, 0.12)",
    },
    {
      stepNum: "03",
      badge: "COMMUNITY CHOICE",
      title: "Public Voting",
      desc: "For selected categories, shortlisted creators will be featured for public voting. Community support contributes to the final evaluation alongside the jury’s assessment.",
      icon: FaPoll,
      color: "#D4A534", // Warm Gold
      bgGlow: "rgba(212, 165, 52, 0.15)",
    },
    {
      stepNum: "04",
      badge: "AWARD CEREMONY",
      title: "Grand Recognition",
      desc: "The winners will be officially honoured at the Chhattisgarh State Creator & Influencer Awards Ceremony, receiving government recognition, prestigious trophies, and certificates in front of creators, dignitaries, and industry leaders.",
      icon: FaTrophy,
      color: "#C45A32", // Terracotta
      bgGlow: "rgba(196, 90, 50, 0.12)",
    },
  ];

  return (
    <section
      id="timeline"
      className="relative w-full bg-[#F8F4EA] text-[#1c2c23] py-8 md:py-12 lg:py-14 px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden select-none scroll-mt-24"
    >
      {/* Background Decorative Layer */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {/* Soft Radial Gold Light Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(212,165,52,0.12)_0%,rgba(196,90,50,0.04)_50%,transparent_75%)] blur-3xl rounded-full" />

        {/* Subtle Bastar Tribal Watermark */}
        <div className="absolute inset-0 bg-tribal-watermark opacity-[0.03]" />

        {/* Ambient Floating Particle Dots */}
        <div className="absolute top-20 left-[12%] w-2.5 h-2.5 rounded-full bg-[#D4A534]/40 animate-pulse" />
        <div className="absolute bottom-24 right-[15%] w-3 h-3 rounded-full bg-[#C45A32]/35 animate-pulse duration-1000" />
      </div>

      <div className="mx-auto w-full max-w-[1400px] flex flex-col items-center">

        {/* Section Header */}
        <Heading
          badge={t("Process Timeline")}
          title={t("HOW TO BE")}
          highlightText={t("NOMINATE")}
          description={t("From Submission to State Recognition — Just Four Simple Steps. A transparent and creator-friendly journey designed to recognize the voices shaping the digital identity of Chhattisgarh.")}
          className="mb-14 lg:mb-18"
        />

        {/* Creative Interactive Timeline Flow Container */}
        <div className="relative w-full max-w-[1340px]">

          {/* Connecting Colorful Track Line for Desktop (Always 100% Full) */}
          <div className="hidden lg:block absolute top-[28px] left-[8%] right-[8%] h-[3px] bg-gradient-to-r from-[#C45A32] via-[#D4A534] to-[#21593D] rounded-full z-0 shadow-[0_0_12px_rgba(212,165,52,0.4)]" />

          {/* 4 Steps Flow Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 relative z-10">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              const isCurrent = idx === activeStep;

              return (
                <div
                  key={step.stepNum}
                  onMouseEnter={() => setActiveStep(idx)}
                  className="group relative flex flex-col items-center text-center cursor-pointer"
                >
                  {/* Step Node Circle Badge */}
                  <div
                    className={`relative flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-500 z-20 shadow-md ${isCurrent
                      ? "bg-white border-[#D4A534] scale-110 shadow-[0_0_24px_rgba(212,165,52,0.4)]"
                      : "bg-white/90 border-[#21593D]/20 hover:border-[#C45A32]/60 hover:scale-105"
                      }`}
                  >
                    <span
                      className="font-poppins font-extrabold text-base transition-colors"
                      style={{ color: step.color }}
                    >
                      {idx + 1}
                    </span>
                  </div>

                  {/* Step Card Container */}
                  <div
                    className={`mt-6 w-full flex-1 rounded-[28px] p-6 sm:p-7 flex flex-col items-center text-center gap-4 transition-all duration-500 border ${isCurrent
                      ? "bg-white border-[#D4A534] shadow-[0_20px_50px_rgba(212,165,52,0.18)] -translate-y-2 ring-1 ring-[#D4A534]/30"
                      : "bg-white/80 backdrop-blur-md border-[#21593D]/15 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-[#C45A32]/50 hover:shadow-[0_15px_40px_rgba(196,90,50,0.12)] hover:-translate-y-1"
                      }`}
                  >
                    {/* Top Watermark Step Number & Category Badge */}
                    <div className="w-full flex items-center justify-between">
                      <span
                        className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-poppins font-bold uppercase tracking-wider border"
                        style={{
                          backgroundColor: `${step.color}10`,
                          color: step.color,
                          borderColor: `${step.color}30`,
                        }}
                      >
                        {t(step.badge)}
                      </span>
                      <span className="font-poppins font-extrabold text-sm text-zinc-300 group-hover:text-[#D4A534] transition-colors">
                        {step.stepNum}
                      </span>
                    </div>

                    {/* Colored Icon Container */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner"
                      style={{ backgroundColor: `${step.color}15`, color: step.color }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Step Title & Description */}
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h3
                        className="font-poppins font-bold text-sm sm:text-base md:text-lg uppercase tracking-tight leading-snug transition-colors"
                        style={{ color: isCurrent ? step.color : "#1c2c23" }}
                      >
                        {t(step.title)}
                      </h3>
                      <p className="font-inter text-xs sm:text-sm text-[#3d4a42] leading-relaxed">
                        {t(step.desc)}
                      </p>
                    </div>

                    {/* Hover Glow Highlight Overlay */}
                    <div
                      className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at top, ${step.bgGlow} 0%, transparent 70%)`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>


      </div>
    </section>
  );
}