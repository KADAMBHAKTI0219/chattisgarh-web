"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { FaEdit, FaUserCheck, FaPoll, FaTrophy } from "react-icons/fa";

export default function HowToApplySection() {
  const { t } = useLanguage();
  const { openModal } = useParticipateModal();

  const steps = [
    {
      id: "Step 01",
      title: "Submit Nomination",
      desc: "Fill the digital registration form with your profiles links, category choice, and impact statement.",
      icon: <FaEdit className="w-5.5 h-5.5 text-[#F87C22]" />,
      color: "#F87C22"
    },
    {
      id: "Step 02",
      title: "Verification",
      desc: "Our screening committee verifies submission data, channel analytics, and ethical compliance.",
      icon: <FaUserCheck className="w-5.5 h-5.5 text-[#BE2079]" />,
      color: "#BE2079"
    },
    {
      id: "Step 03",
      title: "Public Voting",
      desc: "Selected public choice categories open for citizen voting online with a 30% final weightage.",
      icon: <FaPoll className="w-5.5 h-5.5 text-[#3623B6]" />,
      color: "#3623B6"
    },
    {
      id: "Step 04",
      title: "Grand Ceremony",
      desc: "Final winners receive citations and trophies live at the grand physical ceremony in Raipur in Sept 2026.",
      icon: <FaTrophy className="w-5.5 h-5.5 text-[#00A3A3]" />,
      color: "#00A3A3"
    }
  ];

  return (
    <section
      id="timeline"
      className="relative w-full max-w-7xl xl:max-w-[1400px] mx-auto py-8 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 select-none scroll-mt-24 overflow-visible"
    >
      {/* Centered Title */}
      <div className="flex flex-col items-center text-center gap-2 max-w-2xl xl:max-w-4xl px-6 mx-auto mb-16">
        <span className="font-sans font-bold text-xs xl:text-sm uppercase tracking-widest text-[#F798B4]">
          {t("Process Timeline")}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold uppercase text-zinc-950 leading-tight">
          {t("HOW TO")}{" "}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B95] to-[#FF6B95]">{t("NOMINATE")}</span>
        </h2>
        <div className="h-[4px] w-32 bg-gradient-to-r from-[#F798B4] to-[#EE5D8C] rounded-full mt-1"></div>
      </div>

      {/* Steps horizontal/vertical timeline wrapper */}
      <div className="relative w-full overflow-visible">
        {/* Continuous Connecting Line for Desktop */}
        <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-[2px] bg-zinc-200 z-0"></div>

        {/* Steps Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 overflow-visible relative z-10">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="reveal-child flex flex-col items-center gap-4 overflow-visible"
            >
              {/* Step Badge Node */}
              <div
                className="flex items-center justify-center w-11 h-11 rounded-full border border-zinc-200 font-display font-bold text-sm sm:text-base shadow-sm z-10 transition-transform duration-300 hover:scale-105 select-none bg-white text-zinc-900"
                style={{ borderTop: `3px solid ${step.color}` }}
              >
                {idx + 1}
              </div>

              {/* Card (Modern rounded-2xl shadow) */}
              <div className="w-full flex-1 bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 min-h-[190px]">
                <div
                  className="flex items-center justify-center shrink-0 w-12 h-12 rounded-xl border border-zinc-100"
                  style={{ backgroundColor: `${step.color}0D` }}
                >
                  {step.icon}
                </div>
                <div className="flex flex-col gap-0.5 items-center min-w-0">
                  <span className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest" style={{ color: step.color }}>
                    {t(step.id)}
                  </span>
                  <h3 className="font-display font-bold text-base sm:text-lg text-zinc-950 uppercase tracking-tight leading-tight">
                    {t(step.title)}
                  </h3>
                </div>
                <p className="text-zinc-650 font-bold text-xs sm:text-sm leading-relaxed">
                  {t(step.desc)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>



    </section>
  );
}