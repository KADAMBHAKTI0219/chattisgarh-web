"use client";

import { useLanguage } from "@/context/LanguageContext";
import { FaShieldAlt, FaLightbulb, FaLandmark, FaRocket, FaAward } from "react-icons/fa";

export default function ArchitectsTrustSection() {
  const { t } = useLanguage();

  const pillars = [
    {
      icon: FaShieldAlt,
      title: "State-Backed Trust",
      color: "#C15B3D",
      desc: "Official endorsement by the Government of Chhattisgarh providing creators with transparent jury evaluation and legitimate national credibility.",
    },
    {
      icon: FaLightbulb,
      title: "Creative Expression",
      color: "#2E5C31",
      desc: "Encouraging authentic digital storytelling across vlogs, micro-content, podcasts, short films, and indigenous craft forms.",
    },
    {
      icon: FaLandmark,
      title: "Cultural Preservation",
      color: "#D39B2C",
      desc: "Safeguarding ancient tribal heritage, local folk music, culinary traditions, and regional languages for future generations.",
    },
    {
      icon: FaRocket,
      title: "Digital Innovation",
      color: "#2E5C31",
      desc: "Fostering next-gen tech creators, educators, and social media leaders who drive digital literacy and economic growth.",
    },
    {
      icon: FaAward,
      title: "State Citation & Awards",
      color: "#C15B3D",
      desc: "Beyond trophies: official government citations, state platform promotion, media coverage, and networking with policy leaders.",
    },
  ];

  return (
    <section className="w-full bg-[#F8F4EA] py-16 md:py-24 border-b border-[var(--border)] select-none">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col gap-12">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-3">
          <span className="text-xs font-poppins font-bold uppercase tracking-widest text-[var(--primary)] px-3.5 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20">
            {t("Impact & Value")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-extrabold text-[var(--heading)] tracking-tight">
            {t("Why Creators Matter")}
          </h2>
          <p className="text-base text-[var(--text-secondary)] font-inter leading-relaxed">
            {t(
              "Digital creators are the architects of trust and modern storytellers bridging Chhattisgarh's legacy with global opportunities."
            )}
          </p>
        </div>

        {/* 5 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
          {pillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[var(--border)] rounded-[24px] p-7 flex flex-col items-start text-left gap-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                  style={{
                    backgroundColor: `${pillar.color}15`,
                    borderColor: `${pillar.color}30`,
                    color: pillar.color,
                  }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-poppins font-bold text-[var(--heading)]">
                  {t(pillar.title)}
                </h3>
                <p className="text-sm font-inter text-[var(--text-secondary)] leading-relaxed">
                  {t(pillar.desc)}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}