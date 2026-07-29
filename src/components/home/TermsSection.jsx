"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function TermsSection() {
  const { t } = useLanguage();

  const sections = [
    {
      id: "eligibility",
      title: "1. Eligibility Criteria",
      items: [
        { label: "Age Limit", text: "Participants must be 18 years of age or above at the time of nomination." },
        { label: "Nationality & Residency", text: "Open to individuals of Indian nationality who publish digital content." },
        { label: "Eligible Platforms", text: "Content must be published on active profiles on Instagram, YouTube, Facebook, or LinkedIn." },
        { label: "Nomination Limits", text: "Creators can self-nominate in a maximum of three categories." }
      ]
    },
    {
      id: "evaluation",
      title: "2. Evaluation Criteria",
      items: [
        { label: "Content Quality (40%)", text: "Originality, presentation, scripting quality, and storytelling value." },
        { label: "Engagement (30%)", text: "Audience reach, organic interactions, comments sentiment, and likes-to-followers ratio." },
        { label: "Social Impact (20%)", text: "Value created for local communities, civic education, and state cultural promotion." },
        { label: "Technical Merit (10%)", text: "Audio/video production quality, editing flow, and digital innovations." }
      ]
    },
    {
      id: "jury",
      title: "3. Jury & Selection Board",
      items: [
        { label: "Board Composition", text: "The selection panel consists of senior administrative secretaries, industry veterans, media heads, and independent digital tech leaders." },
        { label: "Authority", text: "The Jury's decision is final and binding. No representations against selection choices will be entertained." },
        { label: "Public Voting", text: "For select public categories, public votes carry a 30% weightage, combined with 70% Jury evaluation weightage." }
      ]
    },
    {
      id: "compliance",
      title: "4. Code of Conduct & Compliance",
      items: [
        { label: "Ethical Standards", text: "Content must not contain hate speech, defamatory language, copyright violations, or platform guideline infringements." },
        { label: "Verification", text: "All stats and analytics submitted in the nomination form will be cross-checked by the screening committee." },
        { label: "Disqualification", text: "Providing falsified analytics, fake engagement, or bot-driven likes will lead to immediate disqualification." }
      ]
    }
  ];

  // Track which section id is open. First one open by default.
  const [openId, setOpenId] = useState(sections[0].id);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleDownload = (e) => {
    e.preventDefault();
    alert(t("Guidelines PDF is downloading..."));
  };

  return (
    <section 
      id="terms" 
      className="border border-zinc-200 bg-white p-6 sm:p-10 md:p-12 xl:p-16 rounded-2xl shadow-sm z-10 w-[95%] max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto flex flex-col gap-8 scroll-mt-24 my-8 md:my-16 lg:my-20 xl:my-28 text-left"
    >

      {/* Header and Download Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-150 pb-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl md:text-5xl xl:text-6xl font-display font-black uppercase tracking-tight text-zinc-950">
            {t("GUIDELINES &")}{" "}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BE2079] to-[#E64C8A]">{t("TRUST")}</span>
          </h2>
          <div className="h-[4px] bg-gradient-to-r from-[#BE2079] to-[#E64C8A] rounded-full w-24"></div>
        </div>

        {/* Downloadable Official Guidelines Button */}
        <a
          href="/assets/guidelines.pdf"
          download="guidelines.pdf"
          className="self-start sm:self-center rounded-full border border-zinc-200 bg-[#4585F6] hover:bg-[#3474e5] px-6 py-3 font-black text-white text-xs sm:text-sm uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer select-none inline-flex items-center gap-2"
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
                <h3 className="font-display font-black text-base md:text-xl uppercase text-zinc-950 tracking-wide">
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
                        className="relative text-xs sm:text-sm xl:text-base text-zinc-700 font-bold leading-relaxed pl-6 xl:pl-8 mt-3"
                      >
                        {/* Custom dot indicator */}
                        <span className="absolute left-0 top-[8px] w-2 h-2 bg-[#4585F6] rounded-full"></span>

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