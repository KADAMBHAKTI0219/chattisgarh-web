"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import Heading from "@/components/common/Heading";

export default function EmpowermentHistory() {
  const { language } = useLanguage();
  const [isVisible0, setIsVisible0] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);

  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);

  useEffect(() => {
    const observer0 = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible0(true);
          observer0.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    const observer1 = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible1(true);
          observer1.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    const observer2 = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible2(true);
          observer2.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (ref0.current) observer0.observe(ref0.current);
    if (ref1.current) observer1.observe(ref1.current);
    if (ref2.current) observer2.observe(ref2.current);

    return () => {
      observer0.disconnect();
      observer1.disconnect();
      observer2.disconnect();
    };
  }, []);

  const translations = {
    en: {
      heading: <>A HISTORY OF <span className="text-primary">EMPOWERMENT</span></>,
      sub: "How our heritage, nature, and creators drive the narrative forward"
    },
    hi: {
      heading: <>सशक्तिकरण का <span className="text-primary">इतिहास</span></>,
      sub: "हमारी विरासत, प्रकृति और निर्माता कैसे कहानी को आगे बढ़ाते हैं"
    },
    cg: {
      heading: <>ससक्तिकरण के <span className="text-primary">इतिहास</span></>,
      sub: "हमर धरोहर, प्रकृति अउ कलाकार मन कइसे कहानी ला आगू बढ़ावत हें"
    }
  };

  const historyRows = [
    {
      titleEn: "Majestic Landscapes & Timeless Heritage",
      titleHi: "भव्य परिदृश्य और ऐतिहासिक स्थल",
      titleCg: "सुग्घर प्रकृति अउ पुराना धरोहर",
      subtitleEn: "FROM SIRPUR TO CHITRAKOTE",
      subtitleHi: "सिरपुर से चित्रकूट तक",
      subtitleCg: "सिरपुर ले चित्रकूट तक",
      descEn: "From the magnificent 7th-century Laxman Temple in Sirpur to the awe-inspiring Chitrakote Falls, often celebrated as the \"Niagara of India,\" Chhattisgarh is home to breathtaking monuments, sacred heritage sites, and extraordinary natural landscapes that reflect centuries of history and culture. Every ancient temple, majestic monument, and scenic destination tells a story waiting to be discovered and shared with the world through compelling photography, cinematic travel films, and immersive vlogs.",
      descHi: "छत्तीसगढ़ में सिरपुर में प्राचीन 7वीं शताब्दी का लक्ष्मण मंदिर है, जो ईंट वास्तुकला और आध्यात्मिक विरासत का एक ऐतिहासिक प्रमाण है। भोरमदेव और चित्रकूट जलप्रपात के साथ, हमारी भूमि पौराणिक इतिहास को प्राकृतिक सुंदरता से जोड़ती है।",
      descCg: "हमर छत्तीसगढ़ म सिरपुर के 7वीं सदी के पुराना लछमन मंदिर हे, जउन ह ईंटा कला अउ धरम-करम के गवाह हे। संग म भोरमदेव अउ चित्रकूट जलप्रपात हे, जउन ला भारत के नियाग्रा कहे जाथे।",
      image: "/assets/images/about-1.jpg",
      badgeEn: "Historical Heritage",
      badgeHi: "ऐतिहासिक विरासत",
      badgeCg: "धरोहर",
      ref: ref0,
      visible: isVisible0
    },
    {
      titleEn: "Hamar Sirmaur Chhattisgarh - A Living Cultural Legacy",
      titleHi: "हमार सिरमौर छत्तीसगढ़ - सांस्कृतिक विरासत",
      titleCg: "हमार सिरमौर छत्तीसगढ़ - लोक संस्कृति",
      subtitleEn: "RAIPUR & THE HEART OF THE FESTIVALS",
      subtitleHi: "रायपुर और त्योहारों का दिल",
      subtitleCg: "रायपुर अउ तिहार मन के दिल",
      descEn: "Raipur, the vibrant capital of Chhattisgarh, stands as the cultural and creative heartbeat of the state—where tradition and modern digital expression come together. From the grandeur of Bastar Dussehra to the vibrant rhythms of Panthi, Raut Nacha, and Suwa Dance, every festival tells a story of unity, identity, and pride. Every reel, vlog, and photograph that reflects this spirit becomes a digital ambassador for Chhattisgarh.",
      descHi: "जीवंत राजधानी रायपुर डिजिटल अभिव्यक्ति, कनेक्टिविटी और आधुनिकीकरण के केंद्रीय केंद्र के रूप में धड़कता है। बस्तर दशहरा जैसे शानदार त्योहारों के माध्यम से हमारी संस्कृति जीवित है, जहां पारंपरिक कलाकार कला को विश्व मंच पर ले जाते हैं।",
      descCg: "राजधानी रायपुर ह डिजिटल गोठ, इंटरनेट अउ नवा जुग के बड़का केन्द्र हे। बस्तर दसहरा जइसन तिहार मन म मांदर बाजे अउ कलाकार मन छा जाथें, जउन मन पुराना कला ला नया स्क्रीन म देखावत हें।",
      image: "/assets/images/about-5.jpg",
      badgeEn: "Raipur & Festivals",
      badgeHi: "रायपुर और उत्सव",
      badgeCg: "तिहार मनखे",
      ref: ref1,
      visible: isVisible1
    },
    {
      titleEn: "Women Preserving Chhattisgarh's Artistic Legacy",
      titleHi: "लोक कलाओं को सशक्त बनाती महिलाएं",
      titleCg: "लोक कला ला आगू बढ़ावत हमर नोनी-बाबू (महिला शक्ति)",
      subtitleEn: "CULTURAL LEADERSHIP & WOMEN EMPOWERMENT",
      subtitleHi: "सांस्कृतिक नेतृत्व और डिजिटल आवाज",
      subtitleCg: "सांस्कृतिक नेतृत्व अउ डिजिटल आवाज",
      descEn: "The rich artistic identity of Chhattisgarh has been shaped for generations by its talented women artisans, folk artists, and craftswomen, through traditional paintings, tribal art, handcrafts, murals, and textiles. Today, digital creators are bringing these remarkable women and their extraordinary craftsmanship to audiences across India and the world, celebrating women empowerment and rural entrepreneurship along the way.",
      descHi: "तीजन बाई जैसी महान लोक कलाकारों से लेकर हजारों ग्रामीण महिला शिल्पकारों तक, महिलाएं सांस्कृतिक कथा का नेतृत्व करती हैं। वे पंडवानी और कर्मा जैसी पारंपरिक कलाओं को डिजिटल मंचों के माध्यम से सशक्त बनाती हैं।",
      descCg: "तीजन बाई जइसन नामी पंडवानी कलाकार ले लेके हजारों देहाती कारीगर नोनी-बाबू मन छत्तीसगढ़ के नाव ला दुनिया म आगू बढ़ावत हें। कर्मा, पंडवानी अउ कोसा कपड़ा ला इंटरनेट म पहचान देवावत हें।",
      image: "/assets/images/about-2.jpg",
      badgeEn: "Women Empowerment",
      badgeHi: "महिला सशक्तिकरण",
      badgeCg: "महिला शक्ति",
      ref: ref2,
      visible: isVisible2
    }
  ];

  const t = translations[language] || translations["en"];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-16 md:gap-24 py-10 px-4 md:px-8 relative z-10 select-none">

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold uppercase text-foreground tracking-tight leading-tight">
          {t.heading}
        </h2>
        <p className="text-text-muted font-semibold text-xs sm:text-sm mt-3 uppercase tracking-wider">
          {t.sub}
        </p>
      </div>

      {/* Alternating Scroll Animated Rows */}
      <div className="flex flex-col gap-16 md:gap-24">
        {historyRows.map((row, idx) => {
          const isEven = idx % 2 === 0;
          const title = language === "en" ? row.titleEn : (language === "hi" ? row.titleHi : row.titleCg);
          const subtitle = language === "en" ? row.subtitleEn : (language === "hi" ? row.subtitleHi : row.subtitleCg);
          const desc = language === "en" ? row.descEn : (language === "hi" ? row.descHi : row.descCg);
          const badge = language === "en" ? row.badgeEn : (language === "hi" ? row.badgeHi : row.badgeCg);

          return (
            <div
              key={idx}
              ref={row.ref}
              className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center justify-between gap-8 md:gap-12 transition-all duration-700 ease-out transform ${row.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
            >

              {/* Image Block */}
              <div className="w-full lg:w-[48%] relative h-[250px] sm:h-[320px] md:h-[380px] rounded-3xl overflow-hidden border border-border shadow-sm bg-surface shrink-0 group">
                <Image
                  src={row.image}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <span className="absolute top-4 left-4 bg-foreground text-background font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full z-10">
                  {badge}
                </span>
              </div>

              {/* Text Block */}
              <div className="w-full lg:w-[46%] flex flex-col gap-3 text-left">
                <span className="font-sans font-bold text-xs uppercase tracking-widest text-primary">
                  {subtitle}
                </span>
                <h3 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl xl:text-4xl text-foreground uppercase tracking-tight leading-tight">
                  {title}
                </h3>
                <p className="text-text-secondary font-semibold text-sm sm:text-base leading-relaxed mt-2">
                  {desc}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}