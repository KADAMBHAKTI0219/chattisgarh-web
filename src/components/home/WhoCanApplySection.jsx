//             </div>

//             {/* Modal Scrollable Content */}
//             <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col gap-6 text-[#3d4a42] font-inter text-sm sm:text-base leading-relaxed">

//               {activeCandidate && (
//                 <div className="p-4 rounded-2xl bg-[#21593D]/10 border border-[#21593D]/25 flex items-center gap-3">
//                   <span className="font-inter font-semibold text-xs sm:text-sm text-[#21593D] leading-relaxed">
//                     Selected Category: <strong className="text-[#C45A32] font-extrabold">{activeCandidate.number} {t(activeCandidate.title)}</strong> — {t(activeCandidate.desc)}
//                   </span>
//                 </div>
//               )}

//               {/* 1. Who Can Apply? */}
//               <div className="flex flex-col gap-2">
//                 <h4 className="font-poppins font-extrabold text-base sm:text-lg text-[#1c2c23] flex items-center gap-2">
//                   <span className="w-7 h-7 rounded-lg bg-[#C45A32] text-white flex items-center justify-center text-xs font-bold">1</span>
//                   {t("Who Can Apply?")}
//                 </h4>
//                 <ul className="flex flex-col gap-2 pl-9 list-disc text-sm sm:text-base">
//                   <li><strong>Age:</strong> Applicants must be 18 years or older.</li>
//                   <li><strong>Nationality:</strong> Open to Indian citizens.</li>
//                   <li><strong>Platforms:</strong> Your content should be published on an active YouTube, Instagram, Facebook, or LinkedIn account.</li>
//                   <li><strong>Categories:</strong> You may apply in up to three award categories.</li>
//                 </ul>
//               </div>

//               {/* 2. How Entries Are Evaluated */}
//               <div className="flex flex-col gap-2 border-t border-[#E8DFCF] pt-5">
//                 <h4 className="font-poppins font-extrabold text-base sm:text-lg text-[#1c2c23] flex items-center gap-2">
//                   <span className="w-7 h-7 rounded-lg bg-[#21593D] text-white flex items-center justify-center text-xs font-bold">2</span>
//                   {t("How Entries Are Evaluated")}
//                 </h4>
//                 <p className="pl-9 text-xs sm:text-sm font-semibold text-zinc-600">Every application is reviewed based on:</p>
//                 <ul className="flex flex-col gap-2 pl-9 list-disc text-sm sm:text-base">
//                   <li>Content Quality</li>
//                   <li>Creativity & Originality</li>
//                   <li>Positive Social Impact</li>
//                   <li>Engagement & Audience Reach</li>
//                   <li>Contribution to Chhattisgarh’s Culture, Tourism, Heritage, Innovation, or Community</li>
//                 </ul>
//               </div>

//               {/* 3. Jury & Selection Process */}
//               <div className="flex flex-col gap-2 border-t border-[#E8DFCF] pt-5">
//                 <h4 className="font-poppins font-extrabold text-base sm:text-lg text-[#1c2c23] flex items-center gap-2">
//                   <span className="w-7 h-7 rounded-lg bg-[#D4A534] text-white flex items-center justify-center text-xs font-bold">3</span>
//                   {t("Jury & Selection Process")}
//                 </h4>
//                 <ul className="flex flex-col gap-2 pl-9 list-disc text-sm sm:text-base">
//                   <li>Applications are reviewed by an independent jury panel.</li>
//                   <li>Each entry is evaluated fairly and transparently.</li>
//                   <li>For selected categories, public voting may also be considered.</li>
//                 </ul>
//               </div>

//               {/* 4. Code of Conduct */}
"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import {
  FaUserAlt, FaYoutube, FaInstagram, FaGlobe, FaPenFancy,
  FaAward, FaCamera, FaMicrophone, FaGamepad, FaTshirt, FaHandsHelping,
  FaTimes, FaCheckCircle
} from "react-icons/fa";
import Heading from "@/components/common/Heading";

export default function WhoCanApplySection() {
  const { t } = useLanguage();
  const { openModal } = useParticipateModal();
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState(null);

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
  ];

  const leftItems = candidates.slice(0, 6);
  const rightItems = candidates.slice(6);

  const handleCardClick = (cand) => {
    setActiveCandidate(cand);
    setShowEligibilityModal(true);
  };

  return (
    <section
      id="who-can-apply"
      className="relative w-full max-w-7xl xl:max-w-[1400px] mx-auto py-12 md:py-16 px-4 sm:px-6 select-none scroll-mt-24 text-center overflow-hidden"
    >
      <Heading
        badge={t("ELIGIBILITY & CANDIDATES")}
        title={t("WHO CAN")}
        highlightText={t("APPLY?")}
        description={t("Discover the diverse creator profiles eligible for the Chhattisgarh State Creator Awards 2026.")}
        className="mb-10"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start text-left">
        <div className="flex flex-col gap-4">
          {leftItems.map((cand) => {
            const Icon = cand.icon;
            return (
              <div
                key={cand.number}
                onClick={() => handleCardClick(cand)}
                className="group relative p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex items-start gap-4"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: cand.c1, color: cand.accent }}
                >
                  <Icon />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-400">{cand.number}</span>
                    <h3 className="font-poppins font-bold text-sm sm:text-base text-zinc-900 group-hover:text-[#C15B3D] transition-colors">
                      {t(cand.title)}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                    {t(cand.desc)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
          {rightItems.map((cand) => {
            const Icon = cand.icon;
            return (
              <div
                key={cand.number}
                onClick={() => handleCardClick(cand)}
                className="group relative p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex items-start gap-4"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: cand.c1, color: cand.accent }}
                >
                  <Icon />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-400">{cand.number}</span>
                    <h3 className="font-poppins font-bold text-sm sm:text-base text-zinc-900 group-hover:text-[#C15B3D] transition-colors">
                      {t(cand.title)}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                    {t(cand.desc)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showEligibilityModal && activeCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative flex flex-col gap-5 text-left border border-zinc-200">
            <button
              onClick={() => setShowEligibilityModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: activeCandidate.c1, color: activeCandidate.accent }}
              >
                <activeCandidate.icon />
              </div>
              <div>
                <span className="text-[10px] font-poppins font-extrabold uppercase tracking-widest text-[#C15B3D]">
                  ELIGIBLE CANDIDATE PROFILE
                </span>
                <h3 className="font-poppins font-extrabold text-lg text-zinc-900">
                  {t(activeCandidate.title)}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
              {t(activeCandidate.desc)}
            </p>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col gap-2">
              <span className="text-xs font-poppins font-bold text-amber-900 flex items-center gap-1.5">
                <FaCheckCircle className="w-4 h-4 text-amber-600" />
                Participation Criteria
              </span>
              <ul className="text-xs text-zinc-700 space-y-1 list-disc list-inside font-medium">
                <li>Submit original creative content.</li>
                <li>Follow official platform guidelines.</li>
                <li>Ensure accurate details and authentic creator handles.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowEligibilityModal(false);
                  openModal();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#C15B3D] to-[#D39B2C] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all cursor-pointer"
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