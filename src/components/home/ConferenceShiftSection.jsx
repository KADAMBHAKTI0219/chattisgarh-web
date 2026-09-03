"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import Heading from "@/components/common/Heading";
import { galleryService } from "@/services/gallery";

const STATIC_GALLERY_CARDS = [
  { id: "event-1", title: "Grand Summit Stage", image: "/assets/images/event-1.jpg", objectPosition: "center" },
  { id: "event-2", title: "State Influencers Meet", image: "/assets/images/event-2.jpg", objectPosition: "center" },
  { id: "event-3", title: "Cultural Heritage Showcase", image: "/assets/images/event-3.jpg", objectPosition: "center" },
  { id: "bhoramdev-temple", title: "Bhoram Dev Temple", image: "/assets/images/bhoramdevmandir.jpg", objectPosition: "top center" },
  { id: "event-4", title: "Digital Innovators Forum", image: "/assets/images/event-4.jpg", objectPosition: "center" },
  { id: "event-5", title: "Creator Awards Night", image: "/assets/images/event-5.jpg", objectPosition: "center" },
  { id: "chattisgarh-fall", title: "Chitrakote Waterfalls", image: "/assets/images/chattisgarh_fall.jpg", objectPosition: "center" },
  { id: "event-6", title: "Youth Creator Conclave", image: "/assets/images/event-6.jpg", objectPosition: "center" },
  { id: "about-2", title: "State Cultural Heritage", image: "/assets/images/about-2.webp", objectPosition: "center" },
  { id: "event-7", title: "State Excellence Gala", image: "/assets/images/event-7.jpg", objectPosition: "center" },
  { id: "raipur-landmark", title: "Raipur Landmark", image: "/assets/images/raipur_landmark.jpg", objectPosition: "top center" },
  { id: "event-8", title: "Indigenous Arts & Media", image: "/assets/images/event-8.jpg", objectPosition: "center" },
  { id: "about-4", title: "Chhattisgarh Tradition", image: "/assets/images/about-4.webp", objectPosition: "center" },
  { id: "gallery-g9eoig0ayayblk4", title: "Summit Gathering", image: "/assets/images/gallery/G9eoIg0aYAYBlk4.jpg", objectPosition: "center" },
  { id: "gallery-757656910", title: "Summit Highlights", image: "/assets/images/gallery/757656910_122296226312081376_9155510348415342518_n copy.jpg", objectPosition: "center" },
];

function SafeCardImage({ src, alt, objectPosition = "center", objectFit = "cover" }) {
  const [currentSrc, setCurrentSrc] = useState(() => encodeURI(src || ""));
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCurrentSrc(encodeURI(src || ""));
    setErrorOccurred(false);
    setIsLoaded(false);
  }, [src]);

  const handleError = () => {
    if (!errorOccurred) {
      setErrorOccurred(true);
      setCurrentSrc("/assets/images/event-1.jpg");
    }
  };

  return (
    <>
      {/* Skeleton loader overlay until image finishes downloading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-300 animate-pulse z-10" />
      )}
      <Image
        src={currentSrc}
        alt={alt || "Chhattisgarh Gallery"}
        fill
        sizes="(max-width: 640px) 220px, 320px"
        quality={75}
        loading="lazy"
        style={{
          objectFit: objectFit,
          objectPosition: objectPosition,
        }}
        className={`transition-all duration-500 ease-out group-hover:scale-105 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
      />
    </>
  );
}

export default function ConferenceShiftSection() {
  const { t } = useLanguage();
  const [galleryCards, setGalleryCards] = useState(STATIC_GALLERY_CARDS);

  // Fetch dynamic albums from API and append if available
  useEffect(() => {
    async function loadAlbums() {
      try {
        const res = await galleryService.getAlbums();
        if (res?.success && res?.data) {
          const list = Array.isArray(res.data) ? res.data : res.data.albums || [];
          if (list.length > 0) {
            const apiItems = list.map((a, idx) => ({
              id: a._id || a.id || `api-album-${idx}`,
              title: a.title || "Chhattisgarh Gallery",
              image: a.coverImage || "/assets/images/gallery/02.png",
            }));
            setGalleryCards((prev) => {
              const seen = new Set(prev.map((c) => c.image));
              const combined = [...prev];
              for (const item of apiItems) {
                if (item.image && !seen.has(item.image)) {
                  seen.add(item.image);
                  combined.push(item);
                }
              }
              return combined;
            });
          }
        }
      } catch (err) {
        // Fallback silently to static gallery
      }
    }
    loadAlbums();
  }, []);

  return (
    <section
      id="about-event"
      className="relative w-full bg-[#F8F4EA] text-[#1c2c23] py-8 md:py-12 lg:py-14 px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden touch-pan-y"
    >
      {/* Inline styles for single-row horizontal marquee animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee-h-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-h-left {
          display: flex;
          width: max-content;
          animation: marquee-h-left 90s linear infinite;
          will-change: transform;
        }
        .animate-marquee-h-left:hover {
          animation-play-state: paused;
        }
      ` }} />

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

      {/* Main 1400px Container with Gap */}
      <div className="mx-auto w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[90px] xl:gap-[100px] items-center">

        {/* ================= LEFT SIDE: SINGLE-ROW HORIZONTAL MARQUEE ================= */}
        <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col items-center justify-center relative w-full py-4">

          {/* Blurred Mandala Backdrop */}
          <div className="absolute w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] rounded-full border border-[#D4A534]/20 bg-[radial-gradient(circle,rgba(212,165,52,0.15)_0%,transparent_70%)] blur-xl pointer-events-none -z-10" />

          {/* Marquee Viewport Container (Clean without outer box/border) */}
          <div className="relative w-full aspect-square h-[320px] md:h-[420px] flex items-center overflow-hidden">

            {/* Gradient Mask Left & Right */}
            <div className="absolute inset-y-0 left-0 w-10 sm:w-14 bg-gradient-to-r from-[#F8F4EA] via-[#F8F4EA]/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-10 sm:w-14 bg-gradient-to-l from-[#F8F4EA] via-[#F8F4EA]/80 to-transparent z-20 pointer-events-none" />

            {/* Single Row Horizontal Marquee Track */}
            <div className="overflow-hidden w-full h-full flex items-center">
              <div className="animate-marquee-h-left flex gap-4 sm:gap-5 h-full items-center">
                {[...galleryCards, ...galleryCards].map((card, idx) => (
                  <div
                    key={`single-row-${card.id}-${idx}`}
                    className="relative h-full aspect-square rounded-[24px] sm:rounded-[28px] overflow-hidden border border-white/60 shadow-lg shrink-0 group hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-stone-200"
                  >
                    <SafeCardImage
                      src={card.image}
                      alt={t(card.title || "Chhattisgarh Gallery")}
                      objectPosition={card.objectPosition || "center"}
                      objectFit={card.objectFit || "cover"}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ================= RIGHT SIDE: LUXURY EDITORIAL STORYTELLING ================= */}
        <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-start text-left relative z-10">

          {/* Reusable Heading Component with Badge, Title, and Highlight */}
          <Heading
            badge={t("Official State Platform")}
            title={t("THE NEXT BIG")}
            highlightText={t("STORY STARTS HERE.")}
            align="left"
            className="px-0 mx-0 text-left items-start"
          />

          {/* Readable Story Content Blocks */}
          <div className="mt-6 flex flex-col gap-4 text-sm sm:text-base font-inter text-[#3d4a42] leading-relaxed">

            {/* Paragraph 1 */}
            <p className="animate-fade-up font-semibold text-base sm:text-lg text-[#1c2c23]">
              {t("Every creator has the power to shape how the world sees Chhattisgarh.")}
            </p>

            {/* Paragraph 2 */}
            <p className="animate-fade-up">
              {t(
                "The Chhattisgarh State Creator & Influencer Awards is a prestigious Government initiative that celebrates creators whose content reflects the state’s culture, heritage, creativity, tourism, innovation, and everyday life. Every authentic story shared today becomes a part of Chhattisgarh’s digital legacy."
              )}
            </p>

            {/* Subheading 1 */}
            <div className="animate-fade-up p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-[#C45A32]/10 via-[#D4A534]/15 to-transparent border-l-4 border-[#C45A32]">
              <h4 className="font-poppins font-bold text-sm sm:text-base text-[#C45A32] tracking-tight">
                {t("No matter your platform, your creativity belongs here.")}
              </h4>
            </div>

            {/* Paragraph 3 */}
            <p className="animate-fade-up">
              {t(
                "Whether you’re a YouTuber, Instagram creator, filmmaker, photographer, blogger, educator, artist, gamer, podcaster, or storyteller, your work has the power to inspire audiences and showcase the true spirit of Chhattisgarh to India and the world."
              )}
            </p>

            {/* Paragraph 3.5 */}
            <p className="animate-fade-up">
              {t(
                "Your single video, photo, story, or reel—has the power to change how the world thinks about Chhattisgarh."
              )}
            </p>

            {/* Subheading 2 */}
            <div className="animate-fade-up p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-[#21593D]/10 via-[#D4A534]/15 to-transparent border-l-4 border-[#21593D]">
              <h4 className="font-poppins font-bold text-sm sm:text-base bg-gradient-to-r from-[#21593D] via-[#C45A32] to-[#D4A534] bg-clip-text text-transparent tracking-tight">
                {t("Get recognized. Get celebrated. Represent Chhattisgarh with pride.")}
              </h4>
            </div>

            {/* Paragraph 4 */}
            <p className="animate-fade-up">
              {t(
                "Receive official recognition, amplify your creative journey, and become part of a community that’s building the future of Chhattisgarh’s digital identity."
              )}
            </p>

          </div>

          {/* Premium Glass Quote Card */}
          <div className="mt-8 w-full relative bg-white/80 backdrop-blur-xl border-2 border-[#21593D]/25 rounded-[20px] p-5 sm:p-6 shadow-[0_12px_40px_rgba(33,89,61,0.08)] group hover:border-[#D4A534] hover:shadow-[0_16px_50px_rgba(212,165,52,0.2)] transition-all duration-500 overflow-hidden">
            {/* Top-Right Decorative Soft Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(212,165,52,0.18)_0%,transparent_70%)] pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="flex items-start gap-4 relative z-10">
              {/* Golden Quotation Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#D4A534]/15 border border-[#D4A534]/40 flex items-center justify-center text-[#D4A534] font-serif text-2xl font-bold shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                “
              </div>

              {/* Quote Content */}
              <div className="flex flex-col gap-1">
                <p className="font-poppins font-bold text-sm sm:text-base leading-snug italic text-[#21593D]">
                  <span className="bg-gradient-to-r from-[#21593D] via-[#C45A32] to-[#21593D] bg-clip-text text-transparent">
                    {t("“Because when your content inspires the nation, Chhattisgarh shines with you.”")}
                  </span>
                </p>
                <span className="font-poppins font-bold text-[11px] uppercase tracking-widest text-[#C45A32] mt-0.5">
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