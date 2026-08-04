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
      question: "WHO CAN APPLY FOR THE AWARDS?",
      answer: "Any creator who produces original digital content related to Chhattisgarh may apply. Whether you’re a YouTuber, influencer, filmmaker, photographer, blogger, artist, educator, gamer, podcaster, or storyteller—if your content inspires, informs, or showcases the spirit of Chhattisgarh, you’re eligible to participate.",
      color: "#F87C22",
      icon: FaUserCheck
    },
    {
      question: "CAN MINOR CREATORS APPLY?",
      answer: "Yes. Creators below 18 years of age are welcome to participate. However, their registration, consent, and all further processes must be completed under the supervision and approval of a parent or legal guardian.",
      color: "#00A3A3",
      icon: FaUserCheck
    },
    {
      question: "IS THERE ANY REGISTRATION OR ENTRY FEE?",
      answer: "No. Registration for the Chhattisgarh State Creator & Influencer Awards is completely free. There are no application or participation charges at any stage.",
      color: "#701B84",
      icon: FaTicketAlt
    },
    {
      question: "CAN I APPLY FOR MULTIPLE CATEGORIES?",
      answer: "Yes. You may submit your nomination in up to three award categories, provided your content meets the eligibility criteria for each category.",
      color: "#4585F6",
      icon: FaLayerGroup
    },
    {
      question: "HOW ARE THE WINNERS SELECTED?",
      answer: "Every nomination goes through a fair and transparent evaluation process based on content quality, originality, creativity, impact, audience engagement, and relevance to Chhattisgarh. Selected categories may also include public voting as part of the final evaluation.",
      color: "#D97706",
      icon: FaSearch
    },
    {
      question: "WHAT DO WINNERS RECEIVE?",
      answer: "Winners receive official government recognition, an award trophy, a certificate of excellence, and the opportunity to be celebrated among Chhattisgarh’s leading digital creators.",
      color: "#10B981",
      icon: FaTrophy
    },
    {
      question: "WHEN AND WHERE WILL THE AWARD CEREMONY TAKE PLACE?",
      answer: "The winners will be honoured at the Chhattisgarh State Creator & Influencer Awards Ceremony in Raipur. The official date, venue, and event schedule will be announced on the website and official communication channels.",
      color: "#C45A32",
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

                <h3 className="flex-1 font-display font-bold text-xs sm:text-sm md:text-base text-zinc-950 tracking-tight leading-snug uppercase">
                  {t(faq.question)}
                </h3>

                {/* Plus / Minus toggle */}
                <span
                  className={`shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl border transition-all duration-300 ${isOpen ? "rotate-180 border-transparent shadow-xs" : "border-zinc-200 bg-zinc-50 text-zinc-700 group-hover:border-zinc-300"
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
                    className={`pl-5 pr-4 pb-4 pt-2 sm:pl-7 sm:pr-6 sm:pb-5 ml-[3.1rem] sm:ml-[3.5rem] border-t border-zinc-200 transition-all duration-300 ${isOpen ? "translate-y-0" : "-translate-y-2"
                      }`}
                  >
                    <p className="text-zinc-600 font-normal text-xs sm:text-sm leading-relaxed pt-2">
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