"use client";

import { useLanguage } from "@/context/LanguageContext";
import { FaShieldAlt, FaLightbulb, FaLandmark, FaRocket, FaAward } from "react-icons/fa";

export default function ArchitectsTrustSection() {
  const { t } = useLanguage();

  const pillars = [
    {
      icon: FaShieldAlt,
      title: "Official Recognition",
      color: "#C15B3D",
      desc: "Receive recognition through an official Government of Chhattisgarh initiative, backed by a transparent selection process and an esteemed jury.",
    },
    {
      icon: FaLightbulb,
      title: "Celebrate Original Creativity",
      color: "#2E5C31",
      desc: "Whether you create reels, films, podcasts, blogs, photography, or digital art, every authentic story that reflects Chhattisgarh deserves to be discovered and celebrated.",
    },
    {
      icon: FaLandmark,
      title: "Preserve Our Heritage",
      color: "#D39B2C",
      desc: "Help document and promote tribal traditions, folk arts, local languages, cuisine, festivals, crafts, and cultural heritage for future generations through meaningful digital storytelling.",
    },
    {
      icon: FaRocket,
      title: "Drive Digital Innovation",
      color: "#2E5C31",
      desc: "Showcase fresh ideas, technology, education, entrepreneurship, and social impact that contribute to a stronger, smarter, and digitally empowered Chhattisgarh.",
    },
    {
      icon: FaAward,
      title: "Recognition Beyond The Trophy",
      color: "#C15B3D",
      desc: "Earn official state recognition, wider visibility, media exposure, networking opportunities, and the honour of representing Chhattisgarh on a larger digital platform.",
    },
  ];

  return (
    <section className="w-full bg-[#F8F4EA] py-12 md:py-20 border-b border-[var(--border)] select-none">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col gap-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-2.5">
          <span className="text-[11px] font-poppins font-bold uppercase tracking-widest text-[var(--primary)] px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20">
            {t("IMPACT & VALUE")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-extrabold text-[var(--heading)] tracking-tight">
            {t("Why Creators Matter")}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[var(--text-secondary)] font-inter leading-relaxed">
            {t(
              "Creators are the storytellers of a new Chhattisgarh—preserving heritage, inspiring communities, driving innovation, and taking the state’s identity to audiences across India and the world."
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
                className="bg-white border border-[var(--border)] rounded-[20px] p-6 flex flex-col items-start text-left gap-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border"
                  style={{
                    backgroundColor: `${pillar.color}15`,
                    borderColor: `${pillar.color}30`,
                    color: pillar.color,
                  }}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-poppins font-bold text-[var(--heading)]">
                  {t(pillar.title)}
                </h3>
                <p className="text-xs sm:text-sm font-inter text-[var(--text-secondary)] leading-relaxed">
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