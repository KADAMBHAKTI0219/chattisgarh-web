"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Heading from "@/components/common/Heading";

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
      heading: <>BEYOND THE <span className="text-primary">TROPHY</span></>,
      sub: "Providing long-term values, growth opportunities, and trust metrics"
    },
    hi: {
      heading: <>ट्रॉफी <span className="text-primary">से परे</span></>,
      sub: "दीर्घकालिक मूल्य, विकास के अवसर और विश्वास के पैमाने प्रदान करना"
    },
    cg: {
      heading: <>ट्रॉफी ले <span className="text-primary">आगू (परे)</span></>,
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
      color: "bg-info/10 text-info"
    },
    {
      titleEn: "Credibility",
      titleHi: "विश्वसनीयता",
      titleCg: "नाव-पहचान (विश्वसनीयता)",
      descEn: "Highlighting premium authentic content, digital honesty, and positive local impact on public screens.",
      descHi: "सार्वजनिक स्क्रीन पर प्रीमियम प्रामाणिक सामग्री, डिजिटल ईमानदारी और सकारात्मक स्थानीय प्रभाव को उजागर करना।",
      descCg: "मंच म असली अउ ईमानदारी से भरे काम ला आगू देखाना, जेकर से समाज म अच्छा प्रभाव पड़े।",
      icon: "🎖️",
      color: "bg-primary/10 text-primary"
    },
    {
      titleEn: "Jury Review",
      titleHi: "जूरी समीक्षा",
      titleCg: "जूरी के जांच (समीक्षा)",
      descEn: "Fair, unbiased evaluation by an esteemed panel of creators, industry experts, and government representatives.",
      descHi: "रचनाकारों, उद्योग विशेषज्ञों और सरकारी प्रतिनिधियों के एक सम्मानित पैनल द्वारा निष्पक्ष, तटस्थ मूल्यांकन।",
      descCg: "वरिष्ठ अधिकारी मन, क्रिएटर जूरी अउ माहिर मनखे मन डहर ले बिना कोई भेदभाव के सही जांच।",
      icon: "⚖️",
      color: "bg-secondary/10 text-secondary"
    },
    {
      titleEn: "Recognition",
      titleHi: "मान्यता",
      titleCg: "मान-सम्मान (मान्यता)",
      descEn: "Providing national visibility, brand partnerships, and future growth channels for local creative minds.",
      descHi: "स्थानीय रचनात्मक दिमागों के लिए राष्ट्रीय दृश्यता, ब्रांड साझेदारी और भविष्य के विकास के अवसर प्रदान करना।",
      descCg: "जम्मो नवा क्रिएटर मन बर राष्ट्रीय पहिचान, बड़े ब्रांड के संग काम अउ आगू बढ़े के रद्दा देवइ।",
      icon: "🌟",
      color: "bg-accent/10 text-accent"
    }
  ];

  const t = translations[language] || translations["en"];

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-7xl mx-auto flex flex-col gap-10 py-12 px-4 md:px-8 relative z-10 select-none transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
    >
      {/* Title block */}
      <Heading
        badge="Core Principles"
        title={t.heading}
        description={t.sub}
      />

      {/* 4 Columns Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {cards.map((card, idx) => {
          const title = language === "en" ? card.titleEn : (language === "hi" ? card.titleHi : card.titleCg);
          const desc = language === "en" ? card.descEn : (language === "hi" ? card.descHi : card.descCg);

          return (
            <div
              key={idx}
              className="border border-border bg-surface rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-left flex flex-col gap-3 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              <h3 className="font-heading font-bold text-lg sm:text-xl uppercase text-foreground">
                {title}
              </h3>
              <p className="text-text-secondary font-semibold text-xs sm:text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
}