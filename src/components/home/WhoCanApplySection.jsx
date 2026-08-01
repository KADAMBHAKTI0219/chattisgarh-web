"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import {
  FaUserAlt, FaYoutube, FaInstagram, FaGlobe, FaPenFancy,
  FaAward, FaCamera, FaMicrophone, FaGamepad, FaTshirt, FaHandsHelping,
  FaTimes, FaCheckCircle, FaFileContract
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
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(() => new Set());
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sectionRef = useRef(null);
  const leftRefs = useRef([]);
  const rightRefs = useRef([]);
  leftRefs.current = [];
  rightRefs.current = [];

  const candidates = [
    {
      number: "01.",
      icon: FaUserAlt,
      c1: "#F5E0D8", c2: "#E8C8BC", accent: "#C15B3D",
      title: "INDIVIDUAL CREATORS",
      desc: "Independent creators sharing original stories through videos, photos, blogs, podcasts, or digital art that inspire, educate, or entertain audiences."
    },
    {
      number: "02.",
      icon: FaYoutube,
      c1: "#E2ECD8", c2: "#C5D8B5", accent: "#2E5C31",
      title: "YOUTUBE STORYTELLERS",
      desc: "Creators producing engaging long-form videos, documentaries, educational content, travel films, reviews, and meaningful visual storytelling."
    },
    {
      number: "03.",
      icon: FaInstagram,
      c1: "#FDF2D6", c2: "#F6E2AB", accent: "#D39B2C",
      title: "INSTAGRAM CREATORS",
      desc: "Digital creators using Reels, carousels, and visual content to celebrate culture, lifestyle, fashion, travel, food, and everyday inspiration."
    },
    {
      number: "04.",
      icon: FaGlobe,
      c1: "#F5E0D8", c2: "#E8C8BC", accent: "#C15B3D",
      title: "BLOGGERS & DIGITAL PUBLISHERS",
      desc: "Writers, bloggers, website publishers, newsletter creators, and independent media voices shaping conversations through original digital content."
    },
    {
      number: "05.",
      icon: FaPenFancy,
      c1: "#E2ECD8", c2: "#C5D8B5", accent: "#2E5C31",
      title: "CREATIVE WRITERS",
      desc: "Storytellers, poets, scriptwriters, copywriters, and authors creating impactful narratives in English, Hindi, Chhattisgarhi, and regional languages."
    },
    {
      number: "06.",
      icon: FaAward,
      c1: "#FDF2D6", c2: "#F6E2AB", accent: "#D39B2C",
      title: "ARTISTS & ARTISANS",
      desc: "Creators preserving Chhattisgarh’s artistic heritage through tribal art, handicrafts, sculptures, paintings, textiles, folk traditions, and indigenous craftsmanship."
    },
    {
      number: "07.",
      icon: FaCamera,
      c1: "#F5E0D8", c2: "#E8C8BC", accent: "#C15B3D",
      title: "VISUAL CREATORS",
      desc: "Photographers, filmmakers, graphic designers, illustrators, animators, UI/UX designers, and digital artists shaping visual experiences."
    },
    {
      number: "08.",
      icon: FaMicrophone,
      c1: "#E2ECD8", c2: "#C5D8B5", accent: "#2E5C31",
      title: "PODCASTERS & VOICE CREATORS",
      desc: "Podcast hosts, interviewers, commentators, educators, and audio storytellers creating engaging conversations that inform and inspire."
    },
    {
      number: "09.",
      icon: FaGamepad,
      c1: "#FDF2D6", c2: "#F6E2AB", accent: "#D39B2C",
      title: "GAMING & ESPORTS CREATORS",
      desc: "Gaming streamers, esports athletes, gaming educators, reviewers, and content creators building communities through interactive entertainment."
    },
    {
      number: "10.",
      icon: FaTshirt,
      c1: "#F5E0D8", c2: "#E8C8BC", accent: "#C15B3D",
      title: "FASHION & LIFESTYLE CREATORS",
      desc: "Fashion stylists, textile designers, beauty creators, handloom promoters, and lifestyle influencers celebrating creativity with a local identity."
    },
    {
      number: "11.",
      icon: FaHandsHelping,
      c1: "#E2ECD8", c2: "#C5D8B5", accent: "#2E5C31",
      title: "SOCIAL IMPACT CREATORS",
      desc: "Creators driving positive change through awareness, sustainability, education, public welfare, environmental initiatives, and community development."
    }
  ].map((cand, i) => ({ ...cand, idx: i }));

  const leftItems = candidates.slice(0, 6);
  const rightItems = candidates.slice(6);

  const handleCardClick = (cand) => {
    setActiveCandidate(cand);
    setShowEligibilityModal(true);
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

    return (
      <div
        key={cand.idx}
        ref={(el) => el && refsArray.current.push(el)}
        onClick={() => handleCardClick(cand)}
        className="relative h-14 sm:h-16 cursor-pointer group"
      >
        <div
          className="relative w-full h-full flex items-center justify-between px-3.5 sm:px-5 rounded-2xl border bg-white shadow-sm hover:shadow-md hover:border-[#D4A534] hover:-translate-y-0.5 transition-all duration-300"
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
            <span className="font-poppins font-bold text-xs sm:text-sm text-zinc-900 truncate">
              {t(cand.title)}
            </span>
          </div>

          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-poppins font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-all duration-300 group-hover:bg-[#C45A32] group-hover:text-white group-hover:border-[#C45A32]"
            style={{
              borderColor: `${cand.accent}40`,
              color: cand.accent,
              backgroundColor: `${cand.c1}40`,
            }}
          >
            <span>{t("View Rules")}</span>
            <span className="text-xs">→</span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="who-can-apply"
      className="relative w-full max-w-7xl xl:max-w-[1400px] mx-auto py-8 md:py-12 lg:py-14 px-4 sm:px-6 md:px-8 select-none scroll-mt-24 text-center overflow-hidden"
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


      {/* ================= GUIDELINES & ELIGIBILITY MODAL POPUP ================= */}
      {showEligibilityModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#FFFDFC] border-2 border-[#D4A534]/50 rounded-[32px] shadow-[0_25px_70px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden text-left">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-[#E8DFCF] bg-[#F8F4EA]/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C45A32]/15 border border-[#C45A32]/30 flex items-center justify-center text-[#C45A32]">
                  <FaFileContract className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs font-poppins font-extrabold uppercase tracking-widest text-[#C45A32]">
                    {t("Official State Portal")}
                  </span>
                  <h3 className="text-lg sm:text-2xl font-poppins font-extrabold text-[#1c2c23] tracking-tight uppercase">
                    {t("GUIDELINES & ELIGIBILITY")}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setShowEligibilityModal(false)}
                className="w-10 h-10 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 hover:border-[#C45A32] hover:text-[#C45A32] transition-colors cursor-pointer"
                aria-label="Close Rules Modal"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col gap-6 text-[#3d4a42] font-inter text-sm sm:text-base leading-relaxed">

              {activeCandidate && (
                <div className="p-4 rounded-2xl bg-[#21593D]/10 border border-[#21593D]/25 flex items-center gap-3">
                  <span className="font-inter font-semibold text-xs sm:text-sm text-[#21593D] leading-relaxed">
                    Selected Category: <strong className="text-[#C45A32] font-extrabold">{activeCandidate.number} {t(activeCandidate.title)}</strong> — {t(activeCandidate.desc)}
                  </span>
                </div>
              )}

              {/* 1. Who Can Apply? */}
              <div className="flex flex-col gap-2">
                <h4 className="font-poppins font-extrabold text-base sm:text-lg text-[#1c2c23] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#C45A32] text-white flex items-center justify-center text-xs font-bold">1</span>
                  {t("Who Can Apply?")}
                </h4>
                <ul className="flex flex-col gap-2 pl-9 list-disc text-sm sm:text-base">
                  <li><strong>Age:</strong> Applicants must be 18 years or older.</li>
                  <li><strong>Nationality:</strong> Open to Indian citizens.</li>
                  <li><strong>Platforms:</strong> Your content should be published on an active YouTube, Instagram, Facebook, or LinkedIn account.</li>
                  <li><strong>Categories:</strong> You may apply in up to three award categories.</li>
                </ul>
              </div>

              {/* 2. How Entries Are Evaluated */}
              <div className="flex flex-col gap-2 border-t border-[#E8DFCF] pt-5">
                <h4 className="font-poppins font-extrabold text-base sm:text-lg text-[#1c2c23] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#21593D] text-white flex items-center justify-center text-xs font-bold">2</span>
                  {t("How Entries Are Evaluated")}
                </h4>
                <p className="pl-9 text-xs sm:text-sm font-semibold text-zinc-600">Every application is reviewed based on:</p>
                <ul className="flex flex-col gap-2 pl-9 list-disc text-sm sm:text-base">
                  <li>Content Quality</li>
                  <li>Creativity & Originality</li>
                  <li>Positive Social Impact</li>
                  <li>Engagement & Audience Reach</li>
                  <li>Contribution to Chhattisgarh’s Culture, Tourism, Heritage, Innovation, or Community</li>
                </ul>
              </div>

              {/* 3. Jury & Selection Process */}
              <div className="flex flex-col gap-2 border-t border-[#E8DFCF] pt-5">
                <h4 className="font-poppins font-extrabold text-base sm:text-lg text-[#1c2c23] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#D4A534] text-white flex items-center justify-center text-xs font-bold">3</span>
                  {t("Jury & Selection Process")}
                </h4>
                <ul className="flex flex-col gap-2 pl-9 list-disc text-sm sm:text-base">
                  <li>Applications are reviewed by an independent jury panel.</li>
                  <li>Each entry is evaluated fairly and transparently.</li>
                  <li>For selected categories, public voting may also be considered.</li>
                </ul>
              </div>

              {/* 4. Code of Conduct */}
              <div className="flex flex-col gap-2 border-t border-[#E8DFCF] pt-5">
                <h4 className="font-poppins font-extrabold text-base sm:text-lg text-[#1c2c23] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#C45A32] text-white flex items-center justify-center text-xs font-bold">4</span>
                  {t("Code of Conduct")}
                </h4>
                <p className="pl-9 text-xs sm:text-sm font-semibold text-zinc-600">To remain eligible:</p>
                <ul className="flex flex-col gap-2 pl-9 list-disc text-sm sm:text-base">
                  <li>Submit original content.</li>
                  <li>Follow the community guidelines of your platform.</li>
                  <li>Do not submit misleading, harmful, or illegal content.</li>
                  <li>Any false information or copyright violation may lead to disqualification.</li>
                  <li>The decision of the jury and organizing committee will be final.</li>
                </ul>
              </div>

            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 sm:p-6 border-t border-[#E8DFCF] bg-[#F8F4EA] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-zinc-600 font-semibold text-center sm:text-left">
                Ready to submit your nomination under these rules?
              </span>
              <button
                onClick={() => {
                  setShowEligibilityModal(false);
                  openModal();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#C45A32] to-[#D4A534] text-white font-poppins font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {t("Proceed To Participate")}
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}