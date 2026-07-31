"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import Heading from "@/components/common/Heading";

const GALLERY_CARDS = [
  {
    id: "chitrakote",
    title: "Chitrakote Falls",
    subtitle: "The Niagara of India",
    tag: "Natural Wonder",
    image: "/assets/images/chattisgarh_fall.jpg",
    desc: "Breathtaking horseshoe waterfall surrounded by lush Bastar woodlands.",
  },
  {
    id: "sirpur",
    title: "Sirpur Heritage",
    subtitle: "7th-Century Temple Complex",
    tag: "Sacred Architecture",
    image: "/assets/images/raipur_landmark.jpg",
    desc: "Ancient brick monuments reflecting centuries of spiritual wisdom and craftsmanship.",
  },
  {
    id: "bastar-dance",
    title: "Bastar Tribal Culture",
    subtitle: "Living Indigenous Arts",
    tag: "Heritage",
    image: "/assets/images/event-5.jpg",
    desc: "Vibrant rhythms, folk dances, and timeless storytelling passed through generations.",
  },
  {
    id: "creators",
    title: "Digital Innovators",
    subtitle: "Creators Shaping Tomorrow",
    tag: "Digital Ecosystem",
    image: "/assets/images/event_networking.jpg",
    desc: "Local storytellers taking Chhattisgarh's voice to millions across the globe.",
  },
  {
    id: "forests",
    title: "Sacred Woodlands",
    subtitle: "Heartland of Greenery",
    tag: "Eco-Tourism",
    image: "/assets/images/about-5.jpg",
    desc: "44% forest cover harboring rich biodiversity, wildlife sanctuaries, and natural tranquility.",
  },
];

export default function ConferenceShiftSection() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const cardContainerRef = useRef(null);

  // Auto-cycle gallery cards every 4 seconds unless hovered
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % GALLERY_CARDS.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <section
      id="about-event"
      className="relative w-full bg-[#F8F4EA] text-[#1c2c23] py-8 md:py-12 lg:py-14 px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden select-none"
    >
      {/* Background Decorative Layer */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {/* Soft Radial Gold Sunlight Glow */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-[radial-gradient(circle,rgba(212,165,52,0.18)_0%,rgba(196,90,50,0.06)_40%,transparent_75%)] blur-3xl rounded-full" />

        {/* Top-Left Warm Watercolor Gradient Accent */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[radial-gradient(ellipse_at_top_left,rgba(196,90,50,0.12)_0%,transparent_70%)] blur-2xl" />

        {/* Bottom-Right Soft Forest Green Accent */}
        <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_bottom_right,rgba(33,89,61,0.12)_0%,transparent_70%)] blur-3xl" />

        {/* Low-Opacity Geometric Tribal Pattern Grid Line */}
        <div className="absolute inset-0 bg-tribal-watermark opacity-[0.035]" />

        {/* Faded Watermark Chhattisgarh Map */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-[0.018] blur-[1px]">
          <Image
            src="/assets/images/logoChattisgarh.png"
            alt="State Map Watermark"
            fill
            className="object-contain"
          />
        </div>

        {/* Ambient Floating Particle Dots */}
        <div className="absolute top-20 left-[15%] w-2 h-2 rounded-full bg-[#D4A534]/40 animate-pulse" />
        <div className="absolute bottom-32 left-[40%] w-3 h-3 rounded-full bg-[#C45A32]/30 animate-pulse duration-1000" />
        <div className="absolute top-1/3 right-[12%] w-2.5 h-2.5 rounded-full bg-[#21593D]/30 animate-pulse duration-700" />
      </div>

      {/* Main 1400px Container with 100px Column Gap */}
      <div className="mx-auto w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[90px] xl:gap-[100px] items-center">

        {/* ================= LEFT SIDE: PREMIUM INTERACTIVE GALLERY STACK ================= */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative w-full min-h-[480px] sm:min-h-[580px] md:min-h-[640px]">

          {/* Blurred Mandala Backdrop */}
          <div className="absolute w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] rounded-full border border-[#D4A534]/20 bg-[radial-gradient(circle,rgba(212,165,52,0.15)_0%,transparent_70%)] blur-xl pointer-events-none -z-10" />

          {/* Interactive Stack Container */}
          <div
            ref={cardContainerRef}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="relative w-full max-w-[420px] sm:max-w-[480px] h-[440px] sm:h-[520px] flex items-center justify-center"
          >
            {GALLERY_CARDS.map((card, idx) => {
              const total = GALLERY_CARDS.length;
              // Distance relative to active index
              const offset = (idx - activeIndex + total) % total;
              const isActive = offset === 0;

              // Pre-calculated stack transforms for 5 overlapping cards
              let zIndex = total - offset;
              let translateY = offset * 22; // stacked slightly downwards
              let scale = 1 - offset * 0.055;
              let opacity = offset > 3 ? 0 : 1 - offset * 0.18;
              let rotate = (offset % 2 === 0 ? 1 : -1) * (offset * 3.5);

              if (isActive) {
                translateY = 0;
                scale = 1.04;
                rotate = 0;
                zIndex = 40;
                opacity = 1;
              }

              return (
                <div
                  key={card.id}
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    zIndex,
                    transform: `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotate}deg)`,
                    opacity,
                  }}
                  className={`absolute w-full h-[400px] sm:h-[460px] rounded-[32px] overflow-hidden border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer group select-none ${isActive
                      ? "border-[#D4A534] shadow-[0_25px_65px_rgba(33,89,61,0.22)] ring-1 ring-[#D4A534]/50"
                      : "border-white/40 shadow-lg hover:border-[#C45A32]/60 hover:scale-[1.02]"
                    }`}
                >
                  {/* High Quality Card Image */}
                  <Image
                    src={card.image}
                    alt={t(card.title)}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300" />

                  {/* Top Glass Badge */}
                  <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10">
                    <span className="px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-poppins font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md border border-white/20 text-[#F8F4EA]">
                      {t(card.tag)}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xs font-bold border border-white/30">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Bottom Text Content inside Card */}
                  <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col gap-1.5 z-10 text-left">
                    <span className="text-xs sm:text-sm font-poppins font-semibold text-[#D4A534] tracking-wide uppercase">
                      {t(card.subtitle)}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-poppins font-bold text-white tracking-tight leading-tight">
                      {t(card.title)}
                    </h3>
                    <p className="text-xs sm:text-sm font-inter text-zinc-200 line-clamp-2 leading-relaxed opacity-90">
                      {t(card.desc)}
                    </p>
                  </div>

                  {/* Interactive Hover Micro-glow */}
                  <div className="absolute inset-0 bg-[#C45A32]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              );
            })}
          </div>

          {/* Interactive Pagination Indicators Below Cards */}
          <div className="flex items-center gap-2.5 mt-8 sm:mt-10 z-20">
            {GALLERY_CARDS.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Show ${card.title}`}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${idx === activeIndex
                    ? "w-8 bg-[#C45A32] shadow-[0_0_12px_rgba(196,90,50,0.6)]"
                    : "w-2 bg-[#21593D]/25 hover:bg-[#21593D]/50"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* ================= RIGHT SIDE: LUXURY EDITORIAL STORYTELLING ================= */}
        <div className="lg:col-span-6 flex flex-col items-start text-left relative z-10">

          {/* Reusable Heading Component with Badge, Title, and Highlight */}
          <Heading
            badge={t("Official State Platform")}
            title={t("THE NEXT BIG")}
            highlightText={t("STORY STARTS HERE.")}
            align="left"
            className="px-0 mx-0 text-left items-start"
          />

          {/* Readable Story Content Blocks with Color Highlighted Text matching image */}
          <div className="mt-8 flex flex-col gap-6 text-[16px] sm:text-[18px] font-inter text-[#3d4a42] leading-[1.85]">

            {/* Paragraph 1 */}
            <p className="animate-fade-up">
              {t("Behind every creator is a story. Behind every story is a place worth discovering.")}
            </p>

            {/* Paragraph 2 - Bold text converted to vibrant Terracotta color highlight */}
            <p className="animate-fade-up">
              {t("The")}{" "}
              <span className="font-extrabold text-[#C45A32] bg-[#C45A32]/10 px-2 py-0.5 rounded-md border border-[#C45A32]/25 inline-block">
                {t("Chhattisgarh State Creator & Influencer Awards")}
              </span>{" "}
              {t(
                "celebrates the creators who are shaping the state’s digital identity through authentic and impactful content. From breathtaking landscapes and tribal heritage to local cuisine, art, music, festivals, innovation, and everyday life—every piece of content that reflects the true spirit of Chhattisgarh deserves to be seen and celebrated."
              )}
            </p>

            {/* Paragraph 3 - Bold creator roles converted to Forest Green color highlight */}
            <p className="animate-fade-up">
              {t("Whether you’re a")}{" "}
              <span className="font-extrabold text-[#21593D] bg-[#21593D]/10 px-2 py-0.5 rounded-md border border-[#21593D]/25">
                {t("YouTuber, Instagram creator, filmmaker, photographer, blogger, educator, artist, gamer, podcaster, or storyteller")}
              </span>
              {t(", your creativity has the power to inspire people across India and around the world.")}
            </p>

            {/* Paragraph 4 - Call to Action phrase converted to Warm Gold color highlight */}
            <p className="animate-fade-up font-semibold text-[#1c2c23]">
              <span className="font-extrabold text-[#C45A32] bg-gradient-to-r from-[#C45A32] via-[#D4A534] to-[#21593D] bg-clip-text text-transparent">
                {t("This is your chance to receive official recognition, amplify your voice, and proudly represent Chhattisgarh on the global digital stage.")}
              </span>
            </p>

          </div>

          {/* Premium Glass Quote Card with Golden Quotation Icon */}
          <div className="mt-10 w-full relative bg-white/80 backdrop-blur-xl border-2 border-[#21593D]/25 rounded-[24px] p-6 sm:p-8 shadow-[0_12px_40px_rgba(33,89,61,0.08)] group hover:border-[#D4A534] hover:shadow-[0_16px_50px_rgba(212,165,52,0.2)] transition-all duration-500 overflow-hidden">
            {/* Top-Right Decorative Soft Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(212,165,52,0.18)_0%,transparent_70%)] pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="flex items-start gap-4 sm:gap-5 relative z-10">
              {/* Golden Quotation Icon */}
              <div className="w-12 h-12 rounded-2xl bg-[#D4A534]/15 border border-[#D4A534]/40 flex items-center justify-center text-[#D4A534] font-serif text-3xl font-bold shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                “
              </div>

              {/* Quote Content with Colorized Text */}
              <div className="flex flex-col gap-1.5">
                <p className="font-poppins font-extrabold text-base sm:text-lg lg:text-xl leading-snug italic text-[#21593D]">
                  <span className="bg-gradient-to-r from-[#21593D] via-[#C45A32] to-[#21593D] bg-clip-text text-transparent">
                    {t("“Because when your content inspires the nation, Chhattisgarh shines with you.”")}
                  </span>
                </p>
                <span className="font-poppins font-bold text-xs uppercase tracking-widest text-[#C45A32] mt-1">
                  — {t("Government of Chhattisgarh")}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}