"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Heading from "@/components/common/Heading";

export default function TermsSection() {
  const { t } = useLanguage();

  const sections = [
    {
      id: "who-can-apply",
      title: "WHO CAN APPLY?",
      items: [
        { label: "AGE LIMIT", text: "Applicants must be 18 years of age or above at the time of nomination." },
        { label: "UNDER-18 CREATORS", text: "Creators below 18 years of age may also participate, provided their application, consent, and further process are completed under the supervision and approval of a parent or legal guardian." },
        { label: "NATIONALITY", text: "Open to Indian citizens." },
        { label: "ELIGIBLE PLATFORMS", text: "Your content should be published on an active YouTube, Instagram, Facebook, LinkedIn, or other recognized digital platform." },
        { label: "CATEGORY LIMIT", text: "You may apply in up to three award categories." }
      ]
    },
    {
      id: "evaluation",
      title: "HOW ENTRIES ARE EVALUATED",
      items: [
        { label: "Originality", text: "Fresh ideas and authentic storytelling." },
        { label: "Quality", text: "Creative presentation, editing, and production value." },
        { label: "Impact", text: "Positive engagement and meaningful audience connections." },
        { label: "Relevance", text: "Content that celebrates or contributes to Chhattisgarh’s culture, tourism, innovation, or society." },
        { label: "Overall Excellence", text: "The complete value and consistency of your work." }
      ]
    },
    {
      id: "jury",
      title: "JURY & SELECTION PROCESS",
      items: [
        { label: "Independent Jury", text: "Entries will be reviewed by an independent jury comprising creators, industry experts, and subject specialists." },
        { label: "Verification", text: "Shortlisted entries may undergo additional verification before final selection." },
        { label: "Final Decision", text: "The jury’s decision will be fair, transparent, and final." }
      ]
    },
    {
      id: "conduct",
      title: "CODE OF CONDUCT & COMPLIANCE",
      items: [
        { label: "Original Content", text: "All submitted material must be authentic, original intellectual property fully owned by the applicant or explicitly licensed with verified usage rights." },
        { label: "Community Guidelines", text: "Submissions must strictly adhere to digital platform policies, statutory regulations, and applicable Indian media & IT laws." },
        { label: "Disqualification", text: "Any evidence of plagiarism, copyright infringement, fraudulent engagement, or misleading declarations will result in immediate disqualification." },
        { label: "Official Agreement", text: "Nomination submission constitutes binding agreement to all official award regulations, jury protocols, and verification procedures." }
      ]
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
        <a
          href="/assets/Guidelines.pdf"
          download="State_Creator_Awards_2026_Guidelines.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="self-start sm:self-center rounded-full border border-zinc-200 bg-[#C45A32] hover:bg-[#a84926] px-6 py-3 font-bold text-white text-xs sm:text-sm uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer select-none inline-flex items-center gap-2"
        >
          <span>📁</span> {t("Download Guidelines")} (PDF)
        </a>
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
                  <ul className="flex flex-col gap-2.5 list-none px-5 pb-4 pt-1 md:px-6 md:pb-5 border-t border-zinc-150">
                    {section.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="relative text-xs sm:text-sm text-zinc-700 font-medium leading-relaxed pl-5 sm:pl-6 mt-2"
                      >
                        {/* Custom dot indicator */}
                        <span className="absolute left-0 top-[7px] w-2 h-2 bg-[#C45A32] rounded-full"></span>

                        <strong className="text-zinc-950 font-bold uppercase text-[10px] sm:text-xs tracking-wide mr-1">
                          {t(item.label)}:
                        </strong>{" "}
                        {t(item.text)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}