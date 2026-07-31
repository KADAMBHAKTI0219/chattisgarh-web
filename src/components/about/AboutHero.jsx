"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

import Heading from "@/components/common/Heading";

export default function AboutHero() {
  const { language, t } = useLanguage();
  const [selectedIdx, setSelectedIdx] = useState(null);

  const bentoItems = [
    {
      src: "/assets/images/about-1.jpg",
      altEn: "Chhattisgarh Creator Fest Keynote",
      altHi: "छत्तीसगढ़ क्रिएटर फेस्ट मुख्य भाषण",
      altCg: "छत्तीसगढ़ क्रिएटर फेस्ट मुख्य भासन",
      titleEn: "Keynote & Panel Discussions",
      titleHi: "मुख्य भाषण और पैनल चर्चा",
      titleCg: "मुख्य भासन अउ पैनल चर्चा",
      tagEn: "Inspiration",
      tagHi: "प्रेरणा",
      tagCg: "प्रेरणा",
      sizeClass: "md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-2 h-[350px] md:h-[500px] lg:h-[520px]"
    },
    {
      src: "/assets/images/about-2.webp",
      altEn: "Networking & Collaborations",
      altHi: "नेटवर्किंग और सहयोग",
      altCg: "नेटवर्किंग अउ सहयोग",
      titleEn: "Networking Meetups",
      titleHi: "नेटवर्किंग बैठकें",
      titleCg: "संगी-जोड़ी मिलन",
      tagEn: "Connection",
      tagHi: "कनेक्शन",
      tagCg: "जुड़ाव",
      sizeClass: "md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1 h-[240px] lg:h-[248px]"
    },
    {
      src: "/assets/images/about-3.jpg",
      altEn: "Emerging Digital Talents",
      altHi: "उभरती डिजिटल प्रतिभाएं",
      altCg: "नवा डिजिटल हुनर",
      titleEn: "Creator Showcase",
      titleHi: "क्रिएटर शोकेस",
      titleCg: "क्रिएटर मंच",
      tagEn: "Exhibition",
      tagHi: "प्रदर्शनी",
      tagCg: "दिखाव",
      sizeClass: "md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1 h-[240px] lg:h-[248px]"
    },
    {
      src: "/assets/images/about-4.webp",
      altEn: "Masterclass Sessions",
      altHi: "मास्टरक्लास सत्र",
      altCg: "मास्टरक्लास सत्र मन",
      titleEn: "Interactive Masterclasses",
      titleHi: "इंटरैक्टिव मास्टरक्लास",
      titleCg: "सीखे-पढ़े के गोठ",
      tagEn: "Learning",
      tagHi: "सीखना",
      tagCg: "सिखना",
      sizeClass: "md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2 h-[350px] md:h-[500px] lg:h-[520px]"
    },
    {
      src: "/assets/images/about-5.jpg",
      altEn: "Award Night Celebrations",
      altHi: "पुरस्कार रात समारोह",
      altCg: "इनाम रात समारोह",
      titleEn: "Celebration Night",
      titleHi: "उत्सव की रात",
      titleCg: "खुसी के रात",
      tagEn: "Celebration",
      tagHi: "उत्सव",
      tagCg: "उत्सव",
      sizeClass: "md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1 h-[240px] lg:h-[248px]"
    },
    {
      src: "/assets/images/about-6.webp",
      altEn: "Tech Workshops",
      altHi: "तकनीकी कार्यशालाएं",
      altCg: "तकनीकी कार्यसाला मन",
      titleEn: "Tech Workshops",
      titleHi: "तकनीकी कार्यशाला",
      titleCg: "तकनीक सीख-गोठ",
      tagEn: "Innovation",
      tagHi: "नवाचार",
      tagCg: "नवा प्रयोग",
      sizeClass: "md:col-span-1 md:row-span-1 lg:col-span-3 lg:row-span-1 h-[240px] lg:h-[248px]"
    }
  ];

  useEffect(() => {
    if (selectedIdx === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedIdx(null);
      } else if (e.key === "ArrowRight") {
        setSelectedIdx((prev) => (prev + 1) % bentoItems.length);
      } else if (e.key === "ArrowLeft") {
        setSelectedIdx((prev) => (prev - 1 + bentoItems.length) % bentoItems.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx]);

  const getTitle = (item) => {
    if (language === "en") return item.titleEn;
    if (language === "hi") return item.titleHi;
    return item.titleCg;
  };

  const getAlt = (item) => {
    if (language === "en") return item.altEn;
    if (language === "hi") return item.altHi;
    return item.altCg;
  };

  const getTag = (item) => {
    if (language === "en") return item.tagEn;
    if (language === "hi") return item.tagHi;
    return item.tagCg;
  };

  const headingSubtitle = {
    en: "About Us",
    hi: "हमारे बारे में",
    cg: "हमर बारे में"
  };

  const headingTitle = {
    en: "PARTICIPATE TO PUT CHHATTISGARH ON THE GLOBAL MAP",
    hi: "छत्तीसगढ़ को वैश्विक मानचित्र पर लाने में भागीदार बनें",
    cg: "छत्तीसगढ़ ला दुनिया के नक्सा म लाने बर सामिल होवव"
  };

  return (
    <section id="about-hero" className="w-full max-w-7xl mx-auto flex flex-col gap-12 py-10 md:py-16 xl:py-20 select-none">

      {/* Header text info */}
      <div className="flex flex-col items-center text-center gap-3 max-w-4xl mx-auto px-4">
        <Heading
          level={1}
          badge={headingSubtitle[language] || headingSubtitle["en"]}
          title={headingTitle[language] || headingTitle["en"]}
          showLine={true}
        />
        <p className="text-foreground font-bold text-sm sm:text-base xl:text-lg leading-relaxed mt-2">
          {t("Every state has a unique identity, shaped by its heritage, traditions, culture, and natural beauty. Chhattisgarh is no exception. Blessed with magnificent forests, vibrant tribal heritage, timeless art forms, rich folklore, authentic cuisine, and diverse cultural traditions, the state possesses an extraordinary legacy that deserves recognition on the global stage.")}
        </p>
        <p className="text-text-secondary font-semibold text-sm sm:text-base xl:text-lg leading-relaxed">
          {t("In today's digital era, every creator has the power to become a storyteller. Whether you share your everyday life through a personal vlog, explore hidden destinations in a travel vlog, celebrate Chhattisgarh's traditional dance, preserve its folk music, showcase its authentic cuisine, promote local crafts, highlight tourism, or create content that reflects the spirit, people, and culture of the state—your creativity has the power to inspire millions.")}
        </p>
        <p className="text-text-secondary font-semibold text-sm sm:text-base xl:text-lg leading-relaxed">
          {t("The Chhattisgarh Creator & Influencer Awards is an initiative by the Government of Chhattisgarh to recognize, encourage, and honour creators whose content authentically represents the state's identity and inspires audiences through meaningful storytelling. Every piece of content that celebrates Chhattisgarh contributes to preserving its heritage while introducing its unique culture, traditions, and values to a wider audience.")}
        </p>
        <p className="text-foreground font-bold text-sm sm:text-base xl:text-lg leading-relaxed mt-1">
          {t("If your content proudly reflects the true spirit of Chhattisgarh, this is your opportunity to receive official recognition for your creativity. Participate in the Chhattisgarh Creator & Influencer Awards and showcase your finest Chhattisgarh-centric content for a chance to be honoured and celebrated on a prestigious state platform. Let your creativity become a source of pride for Chhattisgarh and an inspiration for generations to come.")}
        </p>
      </div>

      {/* Dynamic Bento Grid of Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto px-4 md:px-8">
        {bentoItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className={`relative rounded-2xl overflow-hidden border border-border bg-surface shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group ${item.sizeClass}`}
          >
            {/* Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={item.src}
                alt={getAlt(item)}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={idx === 0}
              />
            </div>

            {/* Accent Border inside card */}
            <div className="absolute inset-0 border border-transparent group-hover:border-primary/50 rounded-2xl pointer-events-none transition-all duration-300" />

            {/* Hover details overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8 text-left">
              <span className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest text-accent bg-black/40 py-1 px-3.5 rounded-full w-fit mb-2 border border-accent/30">
                {getTag(item)}
              </span>
              <h3 className="font-heading font-bold text-lg sm:text-xl md:text-2xl text-white tracking-tight uppercase leading-snug">
                {getTitle(item)}
              </h3>
              <p className="text-zinc-300 font-semibold text-xs mt-1">
                {getAlt(item)}
              </p>
            </div>

            {/* Zoom In Badge Top Right */}
            <div className="absolute top-4 right-4 bg-surface/90 border border-border p-2.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
              <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Lightbox Modal */}
      {selectedIdx !== null && (
        <div className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4 select-none backdrop-blur-md">
          {/* Close button */}
          <button
            onClick={() => setSelectedIdx(null)}
            className="absolute top-6 right-6 bg-surface border border-border p-3 rounded-full shadow-sm hover:translate-y-[-2px] active:translate-y-0 transition-transform cursor-pointer z-50"
          >
            <svg className="w-6 h-6 text-foreground stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Left Arrow Button */}
          <button
            onClick={() => setSelectedIdx((prev) => (prev - 1 + bentoItems.length) % bentoItems.length)}
            className="absolute left-6 bg-surface border border-border p-3 rounded-full shadow-sm hover:translate-y-[-2px] active:translate-y-0 transition-transform cursor-pointer z-50 hidden sm:block"
          >
            <svg className="w-6 h-6 text-foreground stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Image Container */}
          <div className="relative w-full max-w-5xl h-[50vh] sm:h-[70vh] flex flex-col items-center justify-center">
            <div className="relative w-full h-full border border-border rounded-2xl overflow-hidden bg-zinc-900 shadow-lg">
              <Image
                src={bentoItems[selectedIdx].src}
                alt={getAlt(bentoItems[selectedIdx])}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Image Details overlay */}
            <div className="mt-6 text-center text-white max-w-2xl px-4 flex flex-col gap-1.5">
              <span className="font-sans font-extrabold text-xs uppercase tracking-widest text-accent">
                {getTag(bentoItems[selectedIdx])}
              </span>
              <h4 className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-tight text-white leading-none">
                {getTitle(bentoItems[selectedIdx])}
              </h4>
              <p className="text-zinc-300 font-bold text-xs sm:text-sm">
                {getAlt(bentoItems[selectedIdx])}
              </p>
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => setSelectedIdx((prev) => (prev + 1) % bentoItems.length)}
            className="absolute right-6 bg-surface border border-border p-3 rounded-full shadow-sm hover:translate-y-[-2px] active:translate-y-0 transition-transform cursor-pointer z-50 hidden sm:block"
          >
            <svg className="w-6 h-6 text-foreground stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {bentoItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`w-3 h-3 rounded-full border border-white/60 transition-all ${idx === selectedIdx ? "bg-accent scale-125" : "bg-white/30"
                  }`}
              />
            ))}
          </div>

        </div>
      )}

    </section>
  );
}