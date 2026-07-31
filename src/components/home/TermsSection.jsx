"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Heading from "@/components/common/Heading";

export default function TermsSection() {
  const { t } = useLanguage();

  const sections = [
    {
      id: "who-can-apply",
      title: "1. Who Can Apply?",
      items: [
        { label: "Age Limit", text: "Applicants must be 18 years or older." },
        { label: "Nationality", text: "Open to Indian citizens." },
        { label: "Eligible Platforms", text: "Your content should be published on an active YouTube, Instagram, Facebook, or LinkedIn account." },
        { label: "Category Limit", text: "You may apply in up to three award categories." }
      ]
    },
    {
      id: "evaluation",
      title: "2. How Entries Are Evaluated",
      items: [
        { label: "Review Factors", text: "Every application is reviewed based on Content Quality, Creativity & Originality, Positive Social Impact, Engagement & Audience Reach, and Contribution to Chhattisgarh’s Culture, Tourism, Heritage, Innovation, or Community." }
      ]
    },
    {
      id: "jury",
      title: "3. Jury & Selection Process",
      items: [
        { label: "Independent Panel", text: "Applications are reviewed by an independent jury panel." },
        { label: "Fairness", text: "Each entry is evaluated fairly and transparently." },
        { label: "Public Voting", text: "For selected categories, public voting may also be considered." }
      ]
    },
    {
      id: "conduct",
      title: "4. Code of Conduct & Compliance",
      items: [
        { label: "Original Content", text: "Submit original content and follow the community guidelines of your platform." },
        { label: "No Harmful Content", text: "Do not submit misleading, harmful, or illegal content." },
        { label: "Disqualification", text: "Any false information or copyright violation may lead to disqualification." },
        { label: "Final Authority", text: "The decision of the jury and organizing committee will be final." }
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
          href="/assets/guidelines.pdf"
          download="guidelines.pdf"
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
                <h3 className="font-poppins font-bold text-base md:text-xl uppercase text-zinc-950 tracking-wide">
                  {t(section.title)}
                </h3>

                {/* Plus / Minus indicator, rounded-md */}
                <span
                  className={`shrink-0 flex items-center justify-center w-8 h-8 md:w-9 md:h-9 border border-zinc-200 bg-zinc-50 rounded-lg transition-transform duration-200 ${
                    isOpen ? "rotate-45" : "rotate-0"
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
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <ul className="flex flex-col gap-3 list-none px-5 pb-5 pt-1 md:px-6 md:pb-6 border-t border-zinc-150">
                    {section.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="relative text-xs sm:text-sm xl:text-base text-zinc-700 font-medium leading-relaxed pl-6 xl:pl-8 mt-3"
                      >
                        {/* Custom dot indicator */}
                        <span className="absolute left-0 top-[8px] w-2 h-2 bg-[#C45A32] rounded-full"></span>

                        <strong className="text-zinc-950 font-extrabold uppercase text-[10px] sm:text-xs tracking-wide mr-1">
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