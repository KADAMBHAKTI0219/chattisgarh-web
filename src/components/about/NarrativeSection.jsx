"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function NarrativeSection() {
  const { t } = useLanguage();

  const stories = [
    {
      label: "HERITAGE • CULTURE • TOURISM",
      title: "Sirpur To Chitrakote — Stories Worth Sharing",
      body: "Every heritage site, every waterfall, and every forgotten trail carries a story waiting to be told. Through authentic content, creators are helping the world experience the true beauty, history, and spirit of Chhattisgarh.",
      image: "/assets/images/event-3.jpg",
      alt: "Sirpur to Chitrakote Chhattisgarh",
      link: "/categories",
      btnText: "Explore This Category",
    },
    {
      label: "HAMAR SIRMAUR CHHATTISGARH",
      title: "A Legacy That Lives Every Day",
      tagline: "Culture That Deserves To Go Viral.",
      body: "Chhattisgarh’s culture is not only preserved in history—it’s celebrated every single day. Through festivals, folk arts, traditions, cuisine, and community life, creators are capturing the state’s vibrant identity and proudly sharing it with audiences across India and the world.",
      image: "/assets/images/raipur_landmark.jpg",
      alt: "Hamar Sirmaur Chhattisgarh Legacy",
      link: "/categories",
      btnText: "Explore Relevant Category",
    },
    {
      label: "INDIGENOUS CRAFTSMANSHIP",
      title: "The Women Who Paint Chhattisgarh’s Identity",
      body: "The hands that create Chhattisgarh’s beautiful folk art also preserve its identity for future generations, the creative spirit of Chhattisgarh lives in the hands of its women artisans. Creators who tell their stories do more than preserve culture, they celebrate women’s empowerment and inspire the world to discover the artistic soul of Chhattisgarh.",
      image: "/assets/images/event-9.jpg",
      alt: "Women Artisans Chhattisgarh",
      link: "/categories",
      btnText: "Explore Relevant Category",
    },
  ];

  return (
    <section className="w-full bg-white py-12 md:py-20 border-y border-[var(--border)] select-none">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col gap-12 md:gap-16">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-2.5">
          <span className="text-[11px] font-poppins font-bold uppercase tracking-widest text-[var(--primary)] px-3 py-1 rounded-full bg-[var(--primary)]/5 border border-[var(--primary)]/20">
            {t("Editorial Storytelling")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-extrabold text-[var(--heading)] tracking-tight">
            {t("Where Heritage Meets Storytelling")}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[var(--text-secondary)] font-inter leading-relaxed">
            {t(
              "The most powerful way to preserve history is to share it. Discover how creators are transforming Chhattisgarh’s monuments, landscapes, traditions, and hidden gems into stories that inspire millions."
            )}
          </p>
        </div>

        {/* 3 Story Blocks (Alternate Image Alignment) */}
        <div className="flex flex-col gap-12 md:gap-16">
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
                  className={`lg:col-span-6 relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-sm ${isEven ? "lg:order-1" : "lg:order-2"
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
                  className={`lg:col-span-6 flex flex-col items-start text-left gap-3 ${isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                >
                  <span className="text-[11px] font-poppins font-bold uppercase tracking-widest text-[var(--primary)]">
                    {t(story.label)}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-poppins font-bold text-[var(--heading)] leading-snug">
                    {t(story.title)}
                  </h3>

                  {story.tagline && (
                    <span className="text-xs font-semibold text-[#C45A32] italic bg-[#C45A32]/10 px-2.5 py-1 rounded-md border border-[#C45A32]/20">
                      {t(story.tagline)}
                    </span>
                  )}

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-inter leading-relaxed">
                    {t(story.body)}
                  </p>
                  <Link
                    href={story.link}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-poppins font-bold text-[var(--primary)] hover:underline mt-1 group"
                  >
                    <span>{t(story.btnText)}</span>
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