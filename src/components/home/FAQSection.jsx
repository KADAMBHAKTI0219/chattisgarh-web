"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  FaPlus,
  FaMinus,
  FaUserCheck,
  FaTicketAlt,
  FaLayerGroup,
  FaSearch,
  FaTrophy,
  FaCalendarAlt
} from "react-icons/fa";

import Heading from "@/components/common/Heading";

export default function FAQSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Who can apply for the awards?",
      answer: "Any content creator, influencer, blogger, or digital brand who is at least 18 years old and creates original content on eligible social platforms.",
      color: "#F87C22", // Warm Chhattisgarh Orange
      icon: FaUserCheck
    },
    {
      question: "Is there any registration or entry fee?",
      answer: "No, submitting nominations for the State Creator & Influencer Awards is 100% free of cost.",
      color: "#00A3A3", // Teal Cyan
      icon: FaTicketAlt
    },
    {
      question: "Can I apply for multiple categories?",
      answer: "Yes, creators can submit nominations in up to a maximum of 3 distinct award categories.",
      color: "#701B84", // Deep Royal Purple
      icon: FaLayerGroup
    },
    {
      question: "What is the evaluation and selection process?",
      answer: "Submissions undergo verification by our screening committee. The final winners are selected by an expert jury panel based on content originality, audience engagement, state impact, and hyper-local value.",
      color: "#4585F6", // Electric Royal Blue
      icon: FaSearch
    },
    {
      question: "What prizes and benefits do winners receive?",
      answer: "Winners receive a prestigious official state trophy, a citation certificate signed by government dignitaries, media features, and exclusive networking access.",
      color: "#D97706", // Amber Gold
      icon: FaTrophy
    },
    {
      question: "When and where is the awards ceremony?",
      answer: "The grand physical awards ceremony will take place in Raipur in September 2026. Official invites will be sent to all finalists.",
      color: "#10B981", // Emerald Green
      icon: FaCalendarAlt
    }
  ];

  return (
    <section
      id="faq"
      className="relative w-full max-w-4xl mx-auto py-8 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 select-none scroll-mt-24 text-center overflow-hidden"
    >

      {/* Centered Heading Component */}
      <Heading
        badge={t("FAQ")}
        title={t("Frequently Asked")}
        highlightText={t("Questions")}
        className="mb-12 md:mb-16"
      />

      {/* Accordion List (Clean Rounded Cards, Soft Shadows) */}
      <div className="relative flex flex-col gap-4 sm:gap-5 text-left">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const IconComponent = faq.icon;

          return (
            <div
              key={idx}
              className={`reveal-child relative bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen
                ? "border-[#EE5D8C]/50 shadow-md"
                : "border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300"
                }`}
            >
              {/* Color accent bar on the left */}
              <span
                className={`absolute left-0 top-0 bottom-0 w-1.5 sm:w-2 transition-all duration-300 ${isOpen ? "animate-pulse" : ""}`}
                style={{ backgroundColor: faq.color }}
              />

              {/* Question Click Header */}
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full flex items-center gap-3 sm:gap-4 text-left pl-5 pr-4 py-4 sm:pl-7 sm:pr-6 sm:py-5 bg-white hover:bg-zinc-50 transition-colors cursor-pointer select-none group"
                aria-expanded={isOpen}
              >
                {/* Number badge -> flips to React Icon on open */}
                <span
                  className="relative shrink-0 w-9 h-9 sm:w-10 sm:h-10 [perspective:400px]"
                >
                  <span
                    className={`absolute inset-0 flex items-center justify-center rounded-xl border border-zinc-200 font-display font-bold text-xs sm:text-sm shadow-xs transition-transform duration-500 [backface-visibility:hidden] ${isOpen ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)] group-hover:scale-105"
                      }`}
                    style={{ backgroundColor: `${faq.color}14`, color: faq.color }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`absolute inset-0 flex items-center justify-center rounded-xl border border-transparent shadow-xs transition-transform duration-500 [backface-visibility:hidden] ${isOpen ? "[transform:rotateY(0deg)]" : "[transform:rotateY(-180deg)]"
                      }`}
                    style={{ backgroundColor: faq.color, color: "white" }}
                  >
                    <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </span>
                </span>

                <h3 className="flex-1 font-display font-bold text-sm sm:text-base md:text-lg text-zinc-950 tracking-tight leading-snug uppercase">
                  {t(faq.question)}
                </h3>

                {/* Plus / Minus toggle */}
                <span
                  className={`shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border transition-all duration-300 ${isOpen ? "rotate-180 border-transparent shadow-xs" : "border-zinc-200 bg-zinc-50 text-zinc-700 group-hover:border-zinc-300"
                    }`}
                  style={{ backgroundColor: isOpen ? faq.color : undefined, color: isOpen ? "white" : undefined }}
                >
                  {isOpen ? <FaMinus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <FaPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                </span>
              </button>

              {/* Answer Panel */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`pl-5 pr-4 pb-5 pt-3 sm:pl-7 sm:pr-6 sm:pb-6 ml-[3.1rem] sm:ml-[3.5rem] border-t-2 border-black/10 transition-all duration-300 ${isOpen ? "translate-y-0" : "-translate-y-2"
                      }`}
                  >
                    <p className="text-zinc-600 font-semibold text-xs sm:text-sm md:text-base leading-relaxed pt-3">
                      {t(faq.answer)}
                    </p>
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