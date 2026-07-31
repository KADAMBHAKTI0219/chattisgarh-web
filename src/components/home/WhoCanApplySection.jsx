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

  // Pastel palette: c1/c2 = soft gradient stops for icon + hover wash,
  // accent = a slightly deeper tone of the same hue for icon/border/text contrast.
  const candidates = [
    {
      icon: FaUserAlt,
      c1: "#FFD9C2", c2: "#FFB8A3", accent: "#E07A4E",
      title: "Individual Creators",
      desc: "Solo content makers publishing native audio, video, or graphics."
    },
    {
      icon: FaYoutube,
      c1: "#FFD0D3", c2: "#FFA5AC", accent: "#E0616C",
      title: "YouTube Storytellers",
      desc: "Channels generating long-form vlogs, reviews, or educational tutorials."
    },
    {
      icon: FaInstagram,
      c1: "#F5CCFB", c2: "#E3B4FA", accent: "#B85FDA",
      title: "Instagram Influencers",
      desc: "Active handles producing reels, cultural fashion, and micro-vlogs."
    },
    {
      icon: FaGlobe,
      c1: "#C7E0FF", c2: "#AAC9FF", accent: "#5081E0",
      title: "Bloggers & Web Leaders",
      desc: "Website developers, tech writers, and independent newsletter writers."
    },
    {
      icon: FaPenFancy,
      c1: "#B9F1E8", c2: "#93E4D3", accent: "#189E8C",
      title: "Creative Writers",
      desc: "Poets, short story writers, and digital scriptwriters writing in local languages."
    },
    {
      icon: FaAward,
      c1: "#FFE9AD", c2: "#FFD98E", accent: "#D69A1E",
      title: "Artists & Craftsmen",
      desc: "Promoters of state heritage, traditional painting, metal, or wood crafts."
    },
    {
      icon: FaCamera,
      c1: "#E4CBFF", c2: "#CDA9FF", accent: "#8B5CF6",
      title: "Visual Designers",
      desc: "Digital painters, photographers, UI designers, and animators."
    },
    {
      icon: FaMicrophone,
      c1: "#FFD6E1", c2: "#FFB3C6", accent: "#DE5A81",
      title: "Podcasters & Hosts",
      desc: "Audio show hosts, interview moderators, and conversational voices."
    },
    {
      icon: FaGamepad,
      c1: "#D9D2FF", c2: "#BCADFF", accent: "#6C63D6",
      title: "Gaming & Esports Stars",
      desc: "Gamers streaming active gameplay, tech critics, and developers."
    },
    {
      icon: FaTshirt,
      c1: "#FFD4EC", c2: "#FFB3DE", accent: "#DE56A0",
      title: "Fashion & Stylists",
      desc: "Designers presenting ethnic dress styling, local handloom, and kosa silk."
    },
    {
      icon: FaHandsHelping,
      c1: "#CDF4DD", c2: "#A9E8C1", accent: "#2FA86A",
      title: "Social Advocates",
      desc: "Welfare campaigners, environmentalists, and cleanliness advocates."
    }
  ].map((c) => ({ ...c, grad: `linear-gradient(135deg, ${c.c1}, ${c.c2})` }));

  // Split into two lists: left (lg screens) and right (lg screens).
  const mid = Math.ceil(candidates.length / 2); // 6 left / 5 right
  const leftList = candidates.slice(0, mid).map((c, i) => ({ ...c, idx: i }));
  const rightList = candidates
    .slice(mid)
    .map((c, i) => ({ ...c, idx: i + mid }));

  const toggleReveal = (idx) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  useEffect(() => {
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
          {/* FRONT — icon on the left, title next to it */}
          <div className="absolute inset-0 [backface-visibility:hidden] flex items-center gap-3 sm:gap-4 h-full px-3.5 sm:px-4 rounded-xl border border-zinc-200 bg-white">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: cand.grad, color: cand.accent }}
            >
              <IconComponent className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </div>
            <h3 className="font-display font-bold text-xs sm:text-sm uppercase text-zinc-950 tracking-tight text-left leading-tight">
              {t(cand.title)}
            </h3>
            <span
              className="ml-auto w-1.5 h-1.5 rounded-full shrink-0 opacity-50"
              style={{ background: cand.grad }}
            />
          </div>

          {/* BACK — pastel-gradient panel with description */}
          <div
            className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center gap-3 h-full px-3.5 sm:px-4 rounded-xl border"
            style={{
              background: `linear-gradient(135deg, ${cand.c1}, ${cand.c2})`,
              borderColor: `${cand.accent}30`,
            }}
          >
            <IconComponent className="w-4 h-4 shrink-0" style={{ color: cand.accent }} />
            <p
              className="font-semibold text-[11px] sm:text-xs text-left leading-snug line-clamp-2"
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
      <Heading
        badge={t("Who Can Apply")}
        title={t("ELIGIBLE")}
        highlightText={t("CANDIDATES")}
        className="mb-14"
      />

      {/* Two compact lists side by side on lg+, single stacked list below */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-x-10 gap-2.5 sm:gap-3">
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {leftList.map((cand) => renderRow(cand, leftRefs))}
        </div>
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {rightList.map((cand) => renderRow(cand, rightRefs))}
        </div>
      </div>
    </section>
  );
}