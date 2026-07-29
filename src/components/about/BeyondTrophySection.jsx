"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function BeyondTrophySection() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const translations = {
    en: {
      heading: <>BEYOND THE <span className="text-[#FFA025]">TROPHY</span></>,
      sub: "Providing long-term values, growth opportunities, and trust metrics"
    },
    hi: {
      heading: <>ट्रॉफी <span className="text-[#FFA025]">से परे</span></>,
      sub: "दीर्घकालिक मूल्य, विकास के अवसर और विश्वास के पैमाने प्रदान करना"
    },
    cg: {
      heading: <>ट्रॉफी ले <span className="text-[#FFA025]">आगू (परे)</span></>,
      sub: "कलाकार मन ला रस्ता देखाना, नवा अवसर अउ भरोसा के संबंध बनाना"
    }
  };

  const cards = [
    {
      titleEn: "Trust",
      titleHi: "विश्वास",
      titleCg: "भरोसा (विश्वास)",
      descEn: "Establishing transparent benchmarks for creator validation, audience safety, and verified engagement profiles.",
      descHi: "निर्माता सत्यापन, दर्शकों की सुरक्षा और सत्यापित जुड़ाव प्रोफाइल के लिए पारदर्शी बेंचमार्क स्थापित करना।",
      descCg: "क्रिएटर मन के काम के सही जांच, सुरक्षित प्रोफाइल अउ साफ-सुथरा आंकड़े तय करना।",
      icon: "🤝",
      color: "border-[#4585F6]"
    },
    {
      titleEn: "Credibility",
      titleHi: "विश्वसनीयता",
      titleCg: "नाव-पहचान (विश्वसनीयता)",
      descEn: "Highlighting premium authentic content, digital honesty, and positive local impact on public screens.",
      descHi: "सार्वजनिक स्क्रीन पर प्रीमियम प्रामाणिक सामग्री, डिजिटल ईमानदारी और सकारात्मक स्थानीय प्रभाव को उजागर करना।",
      descCg: "मंच म असली अउ ईमानदारी से भरे काम ला आगू देखाना, जेकर से समाज म अच्छा प्रभाव पड़े।",
      icon: "🎖️",
      color: "border-[#F3819F]"
    },
    {
      titleEn: "Jury Review",
      titleHi: "जूरी समीक्षा",
      titleCg: "जूरी के जांच (समीक्षा)",
      descEn: "Fair, unbiased evaluation by an esteemed panel of creators, industry experts, and government representatives.",
      descHi: "रचनाकारों, उद्योग विशेषज्ञों और सरकारी प्रतिनिधियों के एक सम्मानित पैनल द्वारा निष्पक्ष, तटस्थ मूल्यांकन।",
      descCg: "वरिष्ठ अधिकारी मन, क्रिएटर जूरी अउ माहिर मनखे मन डहर ले बिना कोई भेदभाव के सही जांच।",
      icon: "⚖️",
      color: "border-[#6EC192]"
    },
    {
      titleEn: "Recognition",
      titleHi: "मान्यता",
      titleCg: "मान-सम्मान (मान्यता)",
      descEn: "Providing national visibility, brand partnerships, and future growth channels for local creative minds.",
      descHi: "स्थानीय रचनात्मक दिमागों के लिए राष्ट्रीय दृश्यता, ब्रांड साझेदारी और भविष्य के विकास के अवसर प्रदान करना।",
      descCg: "जम्मो नवा क्रिएटर मन बर राष्ट्रीय पहिचान, बड़े ब्रांड के संग काम अउ आगू बढ़े के रद्दा देवइ।",
      icon: "🌟",
      color: "border-[#FFA025]"
    }
  ];

  const t = translations[language] || translations["en"];

  return (
    <div 
      ref={containerRef}
      className={`w-full max-w-7xl mx-auto flex flex-col gap-10 py-12 px-4 md:px-8 relative z-10 select-none transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      {/* Title block */}
      <div className="text-center max-w-3xl mx-auto flex flex-col gap-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-zinc-950 tracking-tight leading-none">
          {t.heading}
        </h2>
        <p className="text-zinc-500 font-semibold text-xs sm:text-sm mt-1 uppercase tracking-wider">
          {t.sub}
        </p>
      </div>

      {/* 4 Columns Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {cards.map((card, idx) => {
          const title = language === "en" ? card.titleEn : (language === "hi" ? card.titleHi : card.titleCg);
          const desc = language === "en" ? card.descEn : (language === "hi" ? card.descHi : card.descCg);

          return (
            <div
              key={idx}
              className={`border-2 border-black bg-white rounded-none p-6 shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all duration-200 text-left flex flex-col gap-3 group`}
            >
              <div className="w-12 h-12 rounded-none border-2 border-black flex items-center justify-center text-2xl bg-slate-50 group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              <h3 className="font-display font-black text-lg sm:text-xl uppercase text-zinc-950">
                {title}
              </h3>
              <p className="text-zinc-650 font-bold text-xs sm:text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
}
