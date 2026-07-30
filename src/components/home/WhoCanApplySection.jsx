"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import {
  FaUserAlt, FaYoutube, FaInstagram, FaGlobe, FaPenFancy,
  FaAward, FaCamera, FaMicrophone, FaGamepad, FaTshirt, FaHandsHelping
} from "react-icons/fa";

export default function WhoCanApplySection() {
  const { t } = useLanguage();
  const { openModal } = useParticipateModal();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const candidates = [
    {
      icon: FaUserAlt,
      color: "#F87C22",
      title: "Individual Creators",
      desc: "Solo content makers publishing native audio, video, or graphics."
    },
    {
      icon: FaYoutube,
      color: "#FF0000",
      title: "YouTube Storytellers",
      desc: "Channels generating long-form vlogs, reviews, or educational tutorials."
    },
    {
      icon: FaInstagram,
      color: "#BE2079",
      title: "Instagram Influencers",
      desc: "Active handles producing reels, cultural fashion, and micro-vlogs."
    },
    {
      icon: FaGlobe,
      color: "#4585F6",
      title: "Bloggers & Web Leaders",
      desc: "Website developers, tech writers, and independent newsletter writers."
    },
    {
      icon: FaPenFancy,
      color: "#00A3A3",
      title: "Creative Writers",
      desc: "Poets, short story writers, and digital scriptwriters writing in local languages."
    },
    {
      icon: FaAward,
      color: "#FFA025",
      title: "Artists & Craftsmen",
      desc: "Promoters of state heritage, traditional painting, metal, or wood crafts."
    },
    {
      icon: FaCamera,
      color: "#9C27B0",
      title: "Visual Designers",
      desc: "Digital painters, photographers, UI designers, and animators."
    },
    {
      icon: FaMicrophone,
      color: "#E91E63",
      title: "Podcasters & Hosts",
      desc: "Audio show hosts, interview moderators, and conversational voices."
    },
    {
      icon: FaGamepad,
      color: "#673AB7",
      title: "Gaming & Esports Stars",
      desc: "Gamers streaming active gameplay, tech critics, and developers."
    },
    {
      icon: FaTshirt,
      color: "#FF9800",
      title: "Fashion Stylists",
      desc: "Designers presenting ethnic dress styling, local handloom, and kosa silk."
    },
    {
      icon: FaHandsHelping,
      color: "#4CAF50",
      title: "Social Advocates",
      desc: "Welfare campaigners, environmentalists, and cleanliness advocates."
    }
  ];

  return (
    <section
      id="who-can-apply"
      className="relative w-full max-w-7xl xl:max-w-[1400px] mx-auto py-8 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 select-none scroll-mt-24 text-center overflow-visible"
    >
      {/* Centered Heading */}
      <div className="flex flex-col items-center text-center gap-2 max-w-2xl xl:max-w-4xl px-6 mx-auto mb-16">
        <span className="font-sans font-bold text-xs xl:text-sm uppercase tracking-widest text-[#F798B4]">
          {t("Who Can Apply")}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold uppercase text-zinc-950 leading-tight">
          {t("ELIGIBLE")}{" "}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B95] to-[#FF6B95]">{t("CANDIDATES")}</span>
        </h2>
        <div className="h-[4px] w-32 bg-gradient-to-r from-[#F798B4] to-[#EE5D8C] rounded-full mt-1"></div>
      </div>

      {/* Grid of 11 card categories (Modern rounded corners, soft shadows) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {candidates.map((cand, idx) => {
          const IconComponent = cand.icon;
          const isHovered = hoveredIdx === idx;
          const numString = String(idx + 1).padStart(2, "0");

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="reveal-child relative w-full rounded-2xl border p-6 pl-8 flex flex-col items-start text-left shadow-sm transition-all duration-300 group cursor-pointer overflow-hidden"
              style={{
                borderColor: isHovered ? cand.color : '#e4e4e7',
                backgroundColor: isHovered ? `${cand.color}03` : '#ffffff',
                boxShadow: isHovered ? `0 10px 25px -10px ${cand.color}25` : 'none'
              }}
            >
              {/* Left-side dynamic accent stripe (pill shape that grows to full height on hover) */}
              <div
                className={`absolute left-0 w-1.5 transition-all duration-300 ${isHovered ? "h-full top-0 translate-y-0 rounded-r-none" : "h-8 top-1/2 -translate-y-1/2 rounded-r-full"
                  }`}
                style={{ backgroundColor: cand.color }}
              />

              {/* Dynamic background card number */}
              <span
                className="font-sans font-bold text-7xl select-none pointer-events-none absolute right-3 bottom-1 transition-all duration-300"
                style={{
                  color: isHovered ? `${cand.color}15` : '#f4f4f5',
                }}
              >
                {numString}
              </span>

              {/* Dynamic top right color dot */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-40" style={{ backgroundColor: cand.color }} />

              {/* Icon Badge with soft tinted background */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                style={{
                  backgroundColor: isHovered ? `${cand.color}1F` : `${cand.color}0F`,
                  color: cand.color,
                  transform: isHovered ? 'scale(1.1) rotate(3deg)' : 'scale(1) rotate(0deg)'
                }}
              >
                <IconComponent className="w-5 h-5" />
              </div>

              {/* Title & Desc */}
              <h3 className="font-display font-bold text-sm sm:text-base uppercase text-zinc-950 tracking-tight mb-2 leading-tight relative z-10">
                {t(cand.title)}
              </h3>
              <p className="text-zinc-550 font-bold text-xs sm:text-sm leading-relaxed relative z-10 max-w-[90%]">
                {t(cand.desc)}
              </p>
            </div>
          );
        })}
      </div>


    </section>
  );
}