"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import {
  FaUserAlt, FaYoutube, FaInstagram, FaGlobe, FaPenFancy,
  FaAward, FaCamera, FaMicrophone, FaGamepad, FaTshirt, FaHandsHelping,
} from "react-icons/fa";
import Heading from "@/components/common/Heading";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WhoCanApplySection() {
  const { t } = useLanguage();
  const { openModal } = useParticipateModal();
  const [revealed, setRevealed] = useState(() => new Set());

  const sectionRef = useRef(null);
  const leftRefs = useRef([]);
  const rightRefs = useRef([]);
  leftRefs.current = [];
  rightRefs.current = [];

  // Authentic Desi Earthy Palette (Terracotta, Sal Forest Green, Ochre Gold, Earth Sand)
  const candidates = [
    {
      icon: FaUserAlt,
      c1: "#F5E0D8", c2: "#E8C8BC", accent: "#C15B3D",
      title: "Individual Creators",
      desc: "Solo content makers publishing native audio, video, or graphics."
    },
    {
      icon: FaYoutube,
      c1: "#E2ECD8", c2: "#C5D8B5", accent: "#2E5C31",
      title: "YouTube Storytellers",
      desc: "Channels generating long-form vlogs, reviews, or educational tutorials."
    },
    {
      icon: FaInstagram,
      c1: "#FDF2D6", c2: "#F6E2AB", accent: "#D39B2C",
      title: "Instagram Influencers",
      desc: "Active handles producing reels, cultural fashion, and micro-vlogs."
    },
    {
      icon: FaGlobe,
      c1: "#F5E0D8", c2: "#E8C8BC", accent: "#C15B3D",
      title: "Bloggers & Web Leaders",
      desc: "Website developers, tech writers, and independent newsletter writers."
    },
    {
      icon: FaPenFancy,
      c1: "#E2ECD8", c2: "#C5D8B5", accent: "#2E5C31",
      title: "Creative Writers",
      desc: "Poets, short story writers, and digital scriptwriters writing in local languages."
    },
    {
      icon: FaAward,
      c1: "#FDF2D6", c2: "#F6E2AB", accent: "#D39B2C",
      title: "Artists & Craftsmen",
      desc: "Promoters of state heritage, traditional painting, metal, or wood crafts."
    },
    {
      icon: FaCamera,
      c1: "#F5E0D8", c2: "#E8C8BC", accent: "#C15B3D",
      title: "Visual Designers",
      desc: "Digital painters, photographers, UI designers, and animators."
    },
    {
      icon: FaMicrophone,
      c1: "#E2ECD8", c2: "#C5D8B5", accent: "#2E5C31",
      title: "Podcasters & Educators",
      desc: "Voice artists, podcast hosts, and digital educators creating civic content."
    },
    {
      icon: FaGamepad,
      c1: "#FDF2D6", c2: "#F6E2AB", accent: "#D39B2C",
      title: "Gamers & Esports",
      desc: "Streamers and gaming creators highlighting digital sports culture."
    },
    {
      icon: FaTshirt,
      c1: "#F5E0D8", c2: "#E8C8BC", accent: "#C15B3D",
      title: "Lifestyle & Food",
      desc: "Culinary creators, traditional food vloggers, and lifestyle curators."
    },
    {
      icon: FaHandsHelping,
      c1: "#E2ECD8", c2: "#C5D8B5", accent: "#2E5C31",
      title: "Social Impact Leaders",
      desc: "Community workers and creators advocating for social change."
    }
  ].map((cand, i) => ({ ...cand, idx: i }));

  const leftItems = candidates.slice(0, 6);
  const rightItems = candidates.slice(6);

  const toggleReveal = (idx) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(leftRefs.current, {
        x: -90,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(rightRefs.current, {
        x: 90,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderRow = (cand, refsArray) => {
    const IconComponent = cand.icon;
    const isRevealed = revealed.has(cand.idx);

    return (
      <div
        key={cand.idx}
        ref={(el) => el && refsArray.current.push(el)}
        onClick={() => toggleReveal(cand.idx)}
        className="relative h-14 sm:h-16 cursor-pointer [perspective:1000px]"
        style={{ "--gs": cand.c1, "--ge": cand.c2, "--ac": cand.accent }}
      >
        <div
          className={`group relative w-full h-full transition-transform duration-700 ease-out [transform-style:preserve-3d] lg:hover:[transform:rotateY(180deg)] ${isRevealed ? "[transform:rotateY(180deg)]" : ""
            }`}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 [backface-visibility:hidden] flex items-center justify-between h-full px-3.5 sm:px-5 rounded-2xl border bg-surface shadow-sm transition-all duration-300 group-hover:shadow-md"
            style={{ borderColor: `${cand.accent}40` }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${cand.c1}, ${cand.c2})`,
                  color: cand.accent,
                }}
              >
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <span className="font-poppins font-bold text-xs sm:text-sm text-foreground truncate">
                {t(cand.title)}
              </span>
            </div>

            <span
              className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border transition-colors"
              style={{
                borderColor: `${cand.accent}40`,
                color: cand.accent,
                backgroundColor: `${cand.c1}40`,
              }}
            >
              <span>{t("Hover / Tap")}</span>
            </span>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center gap-3 h-full px-4 rounded-2xl border shadow-md"
            style={{
              background: `linear-gradient(135deg, ${cand.c1}, ${cand.c2})`,
              borderColor: cand.accent,
            }}
          >
            <IconComponent className="w-4 h-4 shrink-0" style={{ color: cand.accent }} />
            <p
              className="font-inter font-bold text-xs text-left leading-snug line-clamp-2"
              style={{ color: cand.accent }}
            >
              {t(cand.desc)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="who-can-apply"
      className="relative w-full max-w-7xl xl:max-w-[1400px] mx-auto py-8 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 select-none scroll-mt-24 text-center overflow-hidden"
    >
      {/* Background Forest Green Ambient Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-[var(--secondary)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Heading */}
      <Heading
        badge={t("ELIGIBILITY CRITERIA")}
        title={t("WHO CAN")}
        highlightText={t("APPLY?")}
        description={t("Open to all digital creators publishing content that reflects the culture, spirit, and growth of Chhattisgarh.")}
        className="mb-10 sm:mb-14"
      />

      {/* 2 Equal Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-6xl mx-auto">
        <div className="flex flex-col gap-4">{leftItems.map((cand) => renderRow(cand, leftRefs))}</div>
        <div className="flex flex-col gap-4">{rightItems.map((cand) => renderRow(cand, rightRefs))}</div>
      </div>
    </section>
  );
}