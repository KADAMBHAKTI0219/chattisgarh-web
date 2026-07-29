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
      color: "#E14B18",
      icon: FaUserCheck
    },
    {
      question: "Is there any registration or entry fee?",
      answer: "No, submitting nominations for the State Creator & Influencer Awards is 100% free of cost.",
      color: "#E64C8A",
      icon: FaTicketAlt
    },
    {
      question: "Can I apply for multiple categories?",
      answer: "Yes, creators can submit nominations in up to a maximum of 3 distinct award categories.",
      color: "#701B84",
      icon: FaLayerGroup
    },
    {
      question: "What is the evaluation and selection process?",
      answer: "Submissions undergo verification by our screening committee. The final winners are selected by an expert jury panel based on content originality, audience engagement, state impact, and hyper-local value.",
      color: "#0E7490",
      icon: FaSearch
    },
    {
      question: "What prizes and benefits do winners receive?",
      answer: "Winners receive a prestigious official state trophy, a citation certificate signed by government dignitaries, media features, and exclusive networking access.",
      color: "#F87C22",
      icon: FaTrophy
    },
    {
      question: "When and where is the awards ceremony?",
      answer: "The grand physical awards ceremony will take place in Raipur in September 2026. Official invites will be sent to all finalists.",
      color: "#0F172A",
      icon: FaCalendarAlt
    }
  ];

  return (
    <section
      id="faq"
      className="relative w-full max-w-4xl mx-auto py-8 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 select-none scroll-mt-24 text-center overflow-hidden"
    >
      
      {/* Centered Heading */}
      <div className="relative flex flex-col items-center justify-center gap-3 max-w-3xl mx-auto mb-12 md:mb-16">
        <span className="font-sans font-bold text-xs sm:text-sm uppercase tracking-widest text-[#BE2079]">
          {t("FAQ")}
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight leading-none text-zinc-950">
          {t("Frequently Asked")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BE2079] to-[#E64C8A]">
            {t("Questions")}
          </span>
        </h2>
        <div className="h-[5px] w-40 bg-gradient-to-r from-[#BE2079] to-[#E64C8A] rounded-full mt-1"></div>
      </div>

      {/* Accordion List (Neo-brutalist, playful) */}
      <div className="relative flex flex-col gap-4 sm:gap-5 text-left">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const tilt = idx % 2 === 0 ? "-rotate-[0.4deg]" : "rotate-[0.4deg]" ;
          const IconComponent = faq.icon;

          return (
            <div
              key={idx}
              className={`reveal-child relative bg-white border-2 border-black rounded-none overflow-hidden transition-all duration-500 ease-out ${
                isOpen
                  ? "shadow-[6px_6px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5 rotate-0"
                  : `shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 ${tilt} hover:rotate-0`
              }`}
            >
              {/* Color accent bar on the left, pulses when open */}
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
                    className={`absolute inset-0 flex items-center justify-center rounded-none border-2 border-black font-display font-black text-xs sm:text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-transform duration-500 [backface-visibility:hidden] ${
                      isOpen ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)] group-hover:scale-110"
                    }`}
                    style={{ backgroundColor: `${faq.color}14`, color: faq.color }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`absolute inset-0 flex items-center justify-center rounded-none border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-transform duration-500 [backface-visibility:hidden] ${
                      isOpen ? "[transform:rotateY(0deg)]" : "[transform:rotateY(-180deg)]"
                    }`}
                    style={{ backgroundColor: faq.color, color: "white" }}
                  >
                    <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </span>
                </span>

                <h3 className="flex-1 font-display font-black text-sm sm:text-base md:text-lg text-zinc-950 tracking-tight leading-snug uppercase">
                  {t(faq.question)}
                </h3>

                {/* Plus / Minus toggle */}
                <span
                  className={`shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-none border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-300 ${
                    isOpen ? "rotate-180 scale-105" : "rotate-0 group-hover:scale-110"
                  }`}
                  style={{ backgroundColor: isOpen ? faq.color : "white", color: isOpen ? "white" : "black" }}
                >
                  {isOpen ? <FaMinus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <FaPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                </span>
              </button>

              {/* Answer Panel */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`pl-5 pr-4 pb-5 pt-3 sm:pl-7 sm:pr-6 sm:pb-6 ml-[3.1rem] sm:ml-[3.5rem] border-t-2 border-black/10 transition-all duration-300 ${
                      isOpen ? "translate-y-0" : "-translate-y-2"
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