"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function NarrativeSection() {
  const { t } = useLanguage();

  const stories = [
    {
      label: "Heritage & Natural Wonders",
      title: "Ancient Sirpur & Breathtaking Landscapes",
      body: "From the magnificent 7th-century Laxman Temple in Sirpur to Chitrakote Falls, celebrated as the Niagara of India, Chhattisgarh holds extraordinary heritage and scenic destinations waiting to be shared with the world through authentic creator storytelling.",
      image: "/assets/images/event-3.jpg",
      alt: "Chitrakote Waterfalls Chhattisgarh",
      link: "/categories/culture",
    },
    {
      label: "State Cultural Beat",
      title: "Hamar Sirmaur Chhattisgarh — A Living Cultural Legacy",
      body: "Raipur and the cultural heartland of Chhattisgarh bring together traditional folk forms like Panthi, Raut Nacha, and Suwa dance alongside modern digital expression. Creators bridge ancient roots with contemporary audiences.",
      image: "/assets/images/raipur_landmark.jpg",
      alt: "Raipur Cultural Landmark",
      link: "/categories/culture",
    },
    {
      label: "Indigenous Craftsmanship",
      title: "Women Preserving Chhattisgarh's Artistic Legacy",
      body: "For generations, women artisans have shaped Chhattisgarh's identity through traditional paintings, Bastar tribal art, handcrafts, murals, and textiles. Digital creators are giving these unsung masters a global stage.",
      image: "/assets/images/event-9.jpg",
      alt: "Chhattisgarh Women Artisans",
      link: "/categories/arts",
    },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24 border-y border-[var(--border)] select-none">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col gap-16 md:gap-24">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-3">
          <span className="text-xs font-poppins font-bold uppercase tracking-widest text-[var(--primary)] px-3.5 py-1 rounded-full bg-[var(--primary)]/5 border border-[var(--primary)]/20">
            {t("Editorial Storytelling")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-extrabold text-[var(--heading)] tracking-tight">
            {t("Stories That Shape Our State")}
          </h2>
          <p className="text-base text-[var(--text-secondary)] font-inter leading-relaxed">
            {t(
              "Discover how creators are documenting Chhattisgarh's rich history, vibrant folk traditions, and emerging digital identity."
            )}
          </p>
        </div>

        {/* 3 Story Blocks (Alternate Image Alignment) */}
        <div className="flex flex-col gap-16 md:gap-24">
          {stories.map((story, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={idx}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center ${isEven ? "" : "lg:flex-row-reverse"
                  }`}
              >
                {/* Image Column */}
                <div
                  className={`lg:col-span-6 relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-[var(--border)] shadow-sm ${isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                >
                  <Image
                    src={story.image}
                    alt={story.alt}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                {/* Content Column */}
                <div
                  className={`lg:col-span-6 flex flex-col items-start text-left gap-4 ${isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                >
                  <span className="text-xs font-poppins font-bold uppercase tracking-widest text-[var(--primary)]">
                    {t(story.label)}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-poppins font-bold text-[var(--heading)] leading-snug">
                    {t(story.title)}
                  </h3>
                  <p className="text-base text-[var(--text-secondary)] font-inter leading-relaxed">
                    {t(story.body)}
                  </p>
                  <Link
                    href={story.link}
                    className="inline-flex items-center gap-2 text-sm font-poppins font-bold text-[var(--primary)] hover:underline mt-2 group"
                  >
                    <span>{t("Explore Relevant Category")}</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}