"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Heading from "@/components/common/Heading";
import { FaPlay, FaShareAlt, FaClock, FaYoutube } from "react-icons/fa";

const videos = [
  {
    id: "K9Lji9NWMF8",
    title: "PM Narendra Modi Presents National Creators Award 2024 at Bharat Mandapam, New Delhi",
    channel: "Narendra Modi",
    initials: "NM",
    badge: "Prime Minister"
  }
];

function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="flex flex-col group/card cursor-pointer w-full">
      {/* Video Container */}
      <div className="relative aspect-video overflow-hidden rounded-3xl border border-zinc-200/90 bg-zinc-950 shadow-lg group-hover/card:shadow-2xl group-hover/card:border-[var(--primary)] transition-all duration-300 w-full">
        {playing ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            aria-label={`Play ${video.title}`}
            className="group relative h-full w-full text-left"
          >
            {/* Thumbnail Image */}
            <img
              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
              alt={t(video.title)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
              loading="lazy"
              draggable={false}
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 transition-opacity duration-300 group-hover/card:opacity-90" />

            {/* Top Channel Bar */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-6 z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xs sm:text-sm font-bold text-white shadow-md border border-white/30">
                  {video.initials}
                </span>
                <span className="truncate text-sm sm:text-base font-bold text-white drop-shadow">
                  {video.channel}
                </span>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/30 uppercase tracking-wider">
                {video.badge}
              </span>
            </div>

            {/* Play Button Icon with pulse hover effect */}
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 sm:h-20 sm:w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[var(--primary)] shadow-2xl transition-all duration-300 group-hover/card:scale-110 group-hover/card:bg-[var(--primary)] group-hover/card:text-white">
              <FaPlay className="h-6 w-6 sm:h-8 sm:w-8 translate-x-0.5" />
            </span>

            {/* Bottom Bar */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 sm:p-6 z-10">
              <div className="flex items-center gap-3 text-white/90">
                <FaShareAlt className="h-4 w-4 hover:text-amber-300 transition-colors" />
                <FaClock className="h-4 w-4 hover:text-amber-300 transition-colors" />
              </div>
              <span className="flex items-center gap-2 rounded-full bg-black/70 px-4 py-1.5 text-xs sm:text-sm font-bold text-white backdrop-blur-md border border-white/20">
                <FaYoutube className="h-4 w-4 text-red-500" />
                <span>{t("Watch Video")}</span>
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Video Title */}
      <h3 className="mt-4 text-base sm:text-lg md:text-xl font-poppins font-bold leading-snug text-zinc-900 group-hover/card:text-[var(--primary)] transition-colors duration-200 text-center ">
        {t(video.title)}
      </h3>
    </div>
  );
}

export default function LeadershipSection() {
  const { t } = useLanguage();

  return (
    <section
      id="leadership"
      className="relative w-full max-w-7xl xl:max-w-[1400px] mx-auto py-8 md:py-12 lg:py-14 px-4 sm:px-6 md:px-8 select-none scroll-mt-24 text-center overflow-visible"
    >
      {/* Centered Heading */}
      <Heading
        badge={t("TRUST & CREATOR VISION")}
        title={t("LEADERSHIP")}
        highlightText={t("Messages")}
        description={t("Watch official messages and creator interactions highlighting digital empowerment across India.")}
        className="mb-8 md:mb-12"
      />

      {/* Single Video Card (Full Width Container) */}
      <div className="w-full max-w-5xl mx-auto flex justify-center">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}