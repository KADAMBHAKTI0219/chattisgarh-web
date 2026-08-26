"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Heading from "@/components/common/Heading";
import DownloadGuidelinesButton from "@/components/common/DownloadGuidelinesButton";

export default function TermsSection() {
  const { t } = useLanguage();

  const sections = [
    {
      id: "who-can-apply",
      title: "WHO CAN APPLY?",
      content: (
        <p className="text-xs sm:text-sm text-zinc-700 font-medium leading-relaxed">
          Eligible participants with an active Instagram account can participate. Each participant must create an original Reel based on one of the approved competition topics and publish it on their own Instagram page. There is no limit on how many participants can choose the same topic or scheme.
        </p>
      )
    },
    {
      id: "evaluation",
      title: "HOW ENTRIES ARE EVALUATED",
      content: (
        <p className="text-xs sm:text-sm text-zinc-700 font-medium leading-relaxed">
          Entries will be evaluated through a combination of <strong className="text-zinc-950 font-bold">jury evaluation, authentic Instagram engagement and public voting</strong>. The evaluation will consider the quality of the story, creativity, audience impact, visual execution, factual accuracy, editing and overall communication value of the Reel.
        </p>
      )
    },
    {
      id: "jury",
      title: "JURY & SELECTION PROCESS",
      content: (
        <p className="text-xs sm:text-sm text-zinc-700 font-medium leading-relaxed">
          A jury will review eligible submissions and assess their creative and storytelling quality. Audience engagement and public voting will also contribute to the selection process. The strongest entries, as determined by the official evaluation methodology, will be <strong className="text-zinc-950 font-bold">nominated for the next round</strong>. The final weightage and selection criteria will be as per the official competition rules.
        </p>
      )
    },
    {
      id: "conduct",
      title: "CODE OF CONDUCT & COMPLIANCE",
      content: (
        <p className="text-xs sm:text-sm text-zinc-700 font-medium leading-relaxed">
          All submissions must be original, relevant to the selected scheme or initiative, and factually accurate. Participants must not use <strong className="text-zinc-950 font-bold">Trial Reels, paid boosting, advertisements, purchased engagement, bots or any form of artificial engagement</strong> to influence their results. Organic sharing through normal social and personal networks is permitted. Any violation of the competition rules may result in disqualification.
        </p>
      )
    }
  ];

  // Track which section id is open. First one open by default.
  const [openId, setOpenId] = useState(sections[0].id);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="terms"
      className="border border-zinc-200 bg-white p-6 sm:p-10 md:p-12 xl:p-16 rounded-2xl shadow-sm z-10 w-[95%] max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto flex flex-col gap-8 scroll-mt-24 my-6 md:my-10 lg:my-12 text-left"
    >
      {/* Header and Download Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <Heading
          badge={t("Official Rules & Compliance")}
          title={t("GUIDELINES &")}
          highlightText={t("ELIGIBILITY")}
          align="left"
          className="px-0 mx-0"
        />

        {/* Downloadable Official Guidelines Button */}
        <DownloadGuidelinesButton
          size="lg"
          variant="amber"
          customText={`${t("Download Guidelines")} (PDF)`}
          className="self-start sm:self-center"
        />
      </div>

      {/* Accordion list */}
      <div className="flex flex-col gap-4 text-left">
        {sections.map((section) => {
          const isOpen = openId === section.id;
          return (
            <div
              key={section.id}
              className="border border-zinc-200 bg-white rounded-2xl shadow-sm hover:shadow-md overflow-hidden transition-shadow duration-300"
            >
              {/* Accordion Header / Button */}
              <button
                type="button"
                onClick={() => toggle(section.id)}
                aria-expanded={isOpen}
                aria-controls={`panel-${section.id}`}
                id={`heading-${section.id}`}
                className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 sm:px-6 sm:py-5 bg-white hover:bg-zinc-50 transition-colors cursor-pointer select-none"
              >
                <h3 className="font-poppins font-bold text-sm sm:text-base md:text-lg uppercase text-zinc-950 tracking-wide">
                  {t(section.title)}
                </h3>

                {/* Plus / Minus indicator, rounded-md */}
                <span
                  className={`shrink-0 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 border border-zinc-200 bg-zinc-50 rounded-lg transition-transform duration-200 ${isOpen ? "rotate-45" : "rotate-0"
                    }`}
                >
                  <span className="relative w-3.5 h-3.5">
                    <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-zinc-400"></span>
                    <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-zinc-400"></span>
                  </span>
                </span>
              </button>

              {/* Accordion Panel */}
              <div
                id={`panel-${section.id}`}
                role="region"
                aria-labelledby={`heading-${section.id}`}
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-4 pt-3 md:px-6 md:pb-5 border-t border-zinc-150">
                    {section.content}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}