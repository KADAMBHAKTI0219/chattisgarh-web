"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const [translationCache, setTranslationCache] = useState({});

  // Queue references for rate-limiting API connections
  const queue = useRef([]);
  const activeCount = useRef(0);

  // Load saved language and cache on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("site-lang");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    try {
      const savedCache = localStorage.getItem("translation-api-cache");
      if (savedCache) {
        setTranslationCache(JSON.parse(savedCache));
      }
    } catch (e) {
      console.error("Failed to parse translation cache", e);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("site-lang", lang);
  };

  // Static Translation Dictionary (For instant loads of common UI labels & GIGW standards)
  const staticTranslations = {
    hi: {
      // Navbar Links
      "About Us": "हमारे बारे में",
      "Eligibility": "पात्रता",
      "Categories": "श्रेणियाँ",
      "Timeline": "समयरेखा",
      "FAQ": "अक्सर पूछे जाने वाले प्रश्न",
      "Contact": "संपर्क",
      "Apply Now": "अभी आवेदन करें",
      "Download Guidelines": "दिशानिर्देश डाउनलोड करें",
      "Register Now": "अभी पंजीकरण करें",
      "Search": "खोजें",
      "Search award categories...": "पुरस्कार श्रेणियों की खोज करें...",
      "All": "सभी",
      "All Categories": "सभी श्रेणियां",
      "Culture & Tourism": "संस्कृति और पर्यटन",
      "Tech & Media": "तकनीक और मीडिया",
      "Social Impact & Welfare": "सामाजिक प्रभाव और कल्याण",
      "Digital State": "डिजिटल राज्य",
      "Support Desk": "सहायता डेस्क",
      "Helpline": "हेल्पलाइन",
      "Email": "ईमेल",
      "Office Hours": "कार्यालय समय",
      "Connect With Us": "हमसे जुड़ें",
      "Navigation": "नेविगेशन",
      "GIGW Utilities": "जीआईजीडब्ल्यू उपयोगिताएँ",
      "Privacy Policy": "गोपनीयता नीति",
      "Accessibility Statement": "पहुंच-योग्यता वक्तव्य",
      "Sitemap": "साइटमैप",
      "RTI & Grievances": "आरटीआई और शिकायतें",
      "Hyperlinking Policy": "हाइपरलिंकिंग नीति",
      "Copyright Policy": "कॉपीराइट नीति",
      "Directorate of Culture & Tourism, Govt. of Chhattisgarh": "संस्कृति और पर्यटन निदेशालय, छत्तीसगढ़ सरकार",

      // Hero Section
      "STATE": "राज्य",
      "CREATOR & INFLUENCER AWARDS": "क्रिएटर और इन्फ्लुएंसर पुरस्कार",
      "— AWARDS 2026 —": "— पुरस्कार 2026 —",
      "Deadline": "अंतिम तिथि",
      "Prize Pool": "पुरस्कार राशि",
      "Monday, 31st August 2026": "सोमवार, 31 अगस्त 2026",
      "Are you shaping the digital heartbeat of our state?": "क्या आप हमारे राज्य के डिजिटल दिल की धड़कन को आकार दे रहे हैं?",
      "The State Government invites you to showcase your digital impact. Nominate yourself or your favorite creators and win official trophies, certificates, and state-level recognition.": "राज्य सरकार आपको अपने डिजिटल प्रभाव को प्रदर्शित करने के लिए आमंत्रित करती है। स्वयं या अपने पसंदीदा रचनाकारों को नामांकित करें और आधिकारिक राज्य ट्राफियां, प्रमाण पत्र और मान्यता जीतें।",
      "Active Categories": "सक्रिय श्रेणियां",
      "Download Guidelines (PDF)": "दिशानिर्देश डाउनलोड करें (PDF)",

      // Leadership Section
      "Leadership Messages": "नेतृत्व संदेश",
      "TRUST & VISION": "भरोसा और दृष्टि",
      "Shri Narendra Modi": "श्री नरेन्द्र मोदी",
      "Hon'ble Prime Minister of India": "माननीय प्रधानमंत्री, भारत",
      "Digital India is a journey to empower every citizen. Digital creators are highlighting the creativity, diversity, and talent of our nation to the entire world.": "डिजिटल इंडिया हर नागरिक को सशक्त बनाने की एक यात्रा है। डिजिटल निर्माता हमारे देश की रचनात्मकता, विविधता और प्रतिभा को पूरी दुनिया के सामने ला रहे हैं।",
      "Shri Vishnu Deo Sai": "श्री विष्णु देव साय",
      "Hon'ble Chief Minister of Chhattisgarh": "माननीय मुख्यमंत्री, छत्तीसगढ़",
      "Our creators are shaping the digital narrative of Chhattisgarh. Through their voices, we are showcasing the rich culture, progress, and hospitality of our state.": "हमारे निर्माता छत्तीसगढ़ के डिजिटल आख्यान को आकार दे रहे हैं। उनकी आवाज़ों के माध्यम से, हम अपने राज्य की समृद्ध संस्कृति, प्रगति और आतिथ्य का प्रदर्शन कर रहे हैं।",

      // Testimonials Section
      "The Community": "समुदाय",
      "What Creators Are Saying": "रचनाकार क्या कह रहे हैं",
      "Hover over any card to pause the scrolling marquee and visit their verified channels.": "स्क्रॉलिंग मार्की को रोकने और उनके सत्यापित चैनलों पर जाने के लिए किसी भी कार्ड पर होवर करें।",
      "Technical Guruji": "टेक्निकल गुरुजी",
      "Gaurav Taneja": "गौरव तनेजा",
      "Ashish Chanchlani": "आशीष चंचलानी",
      "Sharan Hegde": "शरण हेगड़े",
      "Komal Pandey": "कोमल पांडे",
      "Kabita Singh": "कविता सिंह",
      "Tech Creator & Reviewer": "टेक क्रिएटर और समीक्षक",
      "Pilot & Lifestyle Vlogger": "पायलट और लाइफस्टाइल व्लॉगर",
      "Entertainment & Comedy": "मनोरंजन और कॉमेडी",
      "Personal Finance Educator": "व्यक्तिगत वित्त शिक्षक",
      "Fashion & Style Icon": "फैशन और स्टाइल आइकन",
      "Culinary Artist & Recipe Creator": "पाक कलाकार और रेसिपी क्रिएटर",
      "The State Creator Awards is a massive milestone for us. It gives regional creators a national platform to showcase our rich culture, tech, and innovations.": "राज्य क्रिएटर पुरस्कार हमारे लिए एक बड़ा मील का पत्थर है। यह क्षेत्रीय रचनाकारों को हमारी समृद्ध संस्कृति, तकनीक और नवाचारों को प्रदर्शित करने के लिए एक राष्ट्रीय मंच देता है।",
      "Nominating content for these official awards is incredibly seamless! Highlighting our heritage and culture has finally found the recognition it deserves.": "इन आधिकारिक पुरस्कारों के लिए सामग्री को नामांकित करना बेहद आसान है! हमारी विरासत और संस्कृति को उजागर करने को आखिरकार वह पहचान मिल गई है जिसकी वह हकदार है।",
      "This is a proud moment for traditional and new-age artists. Bringing local humor, arts, and lifestyle stories to the digital screen is now celebrated officially!": "यह पारंपरिक और नए जमाने के कलाकारों के लिए गर्व का क्षण है। स्थानीय हास्य, कला और जीवन शैली की कहानियों को डिजिटल स्क्रीन पर लाना अब आधिकारिक तौर पर मनाया जाता है!",
      "Educators and financial creators are finally getting the spotlight. The support from the administration shows their commitment to building a thriving digital economy.": "शिक्षकों और वित्तीय रचनाकारों को आखिरकार सुर्खियों में जगह मिल रही है। प्रशासन का समर्थन एक समृद्ध डिजिटल अर्थव्यवस्था के निर्माण के प्रति उनकी प्रतिबद्धता को दर्शाता है।",
      "Promoting our local handlooms and sustainable styles on social media is my passion. This platform motivates emerging designers and storytellers to keep building.": "सोशल मीडिया पर हमारे स्थानीय हथकरघा और टिकाऊ शैलियों को बढ़ावा देना मेरा जुनून है। यह मंच उभरते डिजाइनरों और कहानीकारों को आगे बढ़ते रहने के लिए प्रेरित करता है।",
      "Teaching traditional cooking online has been a beautiful journey. This initiative validates our effort to make local cuisines accessible to every household.": "पारंपरिक खाना पकाने को ऑनलाइन सिखाना एक सुंदर यात्रा रही है। यह पहल स्थानीय व्यंजनों को हर घर तक सुलभ बनाने के हमारे प्रयास को प्रमाणित करती है।"
    },
    cg: {
      // Navbar Links
      "About Us": "अउ हमर बारे में",
      "Eligibility": "पातरता",
      "Categories": "कोठी (श्रेणी)",
      "Timeline": "समय-चक्कर",
      "FAQ": "पुछइया बात",
      "Contact": "पत्ता-ठिकाना",
      "Apply Now": "अबबय अरजी देव",
      "Download Guidelines": "नियम डाउनलोड करव",
      "Register Now": "अबबय नाव लिखवाव",
      "Search": "खोजव",
      "Search award categories...": "पुरस्कार कोठी खोजव...",
      "All": "जम्मो",
      "All Categories": "जम्मो कोठी",
      "Culture & Tourism": "सन्सकीरति अउ पयर्टन",
      "Tech & Media": "तकनीक अउ मीडिया",
      "Social Impact & Welfare": "कल्याण अउ समाज",
      "Digital State": "डिजिटल राज",
      "Support Desk": "सहायता डेस्क",
      "Helpline": "हेल्पलाइन नंबर",
      "Email": "ईमेल पता",
      "Office Hours": "कार्यालय के समय",
      "Connect With Us": "हमर से जुड़व",
      "Navigation": "नेविगेशन",
      "GIGW Utilities": "जीआईजीडब्ल्यू नियम",
      "Privacy Policy": "गोपनीयता नीति",
      "Accessibility Statement": "पहुंच-योग्यता",
      "Sitemap": "साइटमैप",
      "RTI & Grievances": "आरटीआई अउ शिकायत",
      "Hyperlinking Policy": "हाइपरलिंकिंग नियम",
      "Copyright Policy": "कॉपीराइट नियम",
      "Directorate of Culture & Tourism, Govt. of Chhattisgarh": "संसकीरति अउ पयर्टन निदेशालय, छत्तीसगढ़ सरकार",

      // Hero Section
      "STATE": "छत्तीसगढ़ राज्य",
      "CREATOR & INFLUENCER AWARDS": "क्रिएटर अउ इन्फ्लुएंसर पुरस्कार",
      "— AWARDS 2026 —": "— पुरस्कार 2026 —",
      "Deadline": "आखिरी तारीख",
      "Prize Pool": "इनाम के रासी",
      "Monday, 31st August 2026": "सोमवार, 31 अगस्त 2026",
      "Are you shaping the digital heartbeat of our state?": "का आप मन हमर छत्तीसगढ़ राज के डिजिटल धड़कन ला नवा रूप देवत हव?",
      "The State Government invites you to showcase your digital impact. Nominate yourself or your favorite creators and win official trophies, certificates, and state-level recognition.": "छत्तीसगढ़ सरकार आप मन ला अपन डिजिटल काम देखाए बर नेवता देवत हे। अपन या अपन संगी-जोड़ी क्रिएटर मन के नामांकन भरव अउ सरकारी सम्मान पत्र अउ चमचमात ट्रॉफी जीतव।",
      "Active Categories": "कोठी मन",
      "Download Guidelines (PDF)": "नियम डाउनलोड करव (PDF)",

      // Leadership Section
      "Leadership Messages": "नेतृत्व संदेश",
      "TRUST & VISION": "भरोसा अउ सपना",
      "Shri Narendra Modi": "श्री नरेन्द्र मोदी",
      "Hon'ble Prime Minister of India": "माननीय प्रधानमंत्री, भारत सरकार",
      "Digital India is a journey to empower every citizen. Digital creators are highlighting the creativity, diversity, and talent of our nation to the entire world.": "डिजिटल इंडिया हर नागरिक ला ससक्त बनाए के जातरा हे। डिजिटल क्रिएटर मन हमर देश के हुनर अउ कला ला पूरा दुनिया देखावत हें।",
      "Shri Vishnu Deo Sai": "श्री विष्णु देव साय",
      "Hon'ble Chief Minister of Chhattisgarh": "माननीय मुख्यमंत्री, छत्तीसगढ़ सरकार",
      "Our creators are shaping the digital narrative of Chhattisgarh. Through their voices, we are showcasing the rich culture, progress, and hospitality of our state.": "हमर क्रिएटर मन छत्तीसगढ़ के नवा डिजिटल नाव ला गढ़त हें। ओ मन के आवाज डहर ले हमर राज के सुग्घर सन्सकीरति अउ विकास ह दुनिया म छावत हे।",

      // Testimonials Section
      "The Community": "संगी-साथी",
      "What Creators Are Saying": "क्रिएटर मन का कहत हें",
      "Hover over any card to pause the scrolling marquee and visit their verified channels.": "घूमत पट्टी ला रोके बर अउ ओ मन के चैनल देखे बर कार्ड ऊपर माउस (होवर) करव।",
      "Technical Guruji": "टेक्निकल गुरुजी",
      "Gaurav Taneja": "गौरव तनेजा",
      "Ashish Chanchlani": "आशीष चंचलानी",
      "Sharan Hegde": "शरण हेगड़े",
      "Komal Pandey": "कोमल पांडे",
      "Kabita Singh": "कविता सिंह",
      "Tech Creator & Reviewer": "टेक बनाइया अउ जाँचइया",
      "Pilot & Lifestyle Vlogger": "पायलट अउ जिनगी के व्लॉगर",
      "Entertainment & Comedy": "हंसइ-ठठइ अउ मनोरंजन",
      "Personal Finance Educator": "पैसा-कौड़ी के सीख देवइया",
      "Fashion & Style Icon": "कपड़ा-लत्ता अउ फैशन के आइकन",
      "Culinary Artist & Recipe Creator": "रंधइया अउ रेसिपी बनाइया",
      "The State Creator Awards is a massive milestone for us. It gives regional creators a national platform to showcase our rich culture, tech, and innovations.": "राज क्रिएटर अवार्ड्स हमर बर एक बड़े मुकाम हे। एखर से हमर राज के कलाकार मन ला अपन कला, संस्कृति अउ तकनीक ला देखाए के बढ़िया मौका मिलही।",
      "Nominating content for these official awards is incredibly seamless! Highlighting our heritage and culture has finally found the recognition it deserves.": "सरकारी पुरस्कार बर नामांकन भरना बहुते आसान हे! हमर पुरखा के धरम-करम अउ संस्कृति ला अब असली सम्मान मिलत हे।",
      "This is a proud moment for traditional and new-age artists. Bringing local humor, arts, and lifestyle stories to the digital screen is now celebrated officially!": "ये हमर जुन्ना अउ नवा कलाकार मन बर बड़े गर्व के बात हे। हमर छत्तीसगढ़ी बोली-भाखा अउ कला ला अब सरकारी सम्मान मिलत हे!",
      "Educators and financial creators are finally getting the spotlight. The support from the administration shows their commitment to building a thriving digital economy.": "सीख देवइया अउ पैसा के बात बताइया मन ला अब मान मिलत हे। सरकार के ए सहायता से राज के डिजिटल तरक्की ला बल मिलही।",
      "Promoting our local handlooms and sustainable styles on social media is my passion. This platform motivates emerging designers and storytellers to keep building.": "हमर छत्तीसगढ़ के कोसा अउ हथकरघा ला दुनिया भर म ले जाना हमर सपना हे। ये मंच नवा डिज़ाइनर मन ला आगे बढ़े बर हिम्मति देही।",
      "Teaching traditional cooking online has been a beautiful journey. This initiative validates our effort to make local cuisines accessible to every household.": "हमर जुन्ना छत्तीसगढ़ी रंधइ-खवइ ला ऑनलाइन सिखाना बढ़िया काम रीहिस। ये पुरस्कार से हमर छत्तीसगढ़ी खाना ला हर घर म पहचान मिलही।"
    }
  };

  // Sequentially process translation queue with a max concurrency of 3
  const processQueue = useCallback(async () => {
    if (queue.current.length === 0 || activeCount.current >= 3) return;

    activeCount.current += 1;
    const { text, targetLang } = queue.current.shift();
    const cacheKey = `${targetLang}:${text}`;

    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
      );

      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType || !contentType.includes("application/json")) {
        throw new Error(`Google Translate returned invalid format or code: ${response.status}`);
      }

      const data = await response.json();
      const translated = data?.[0]?.[0]?.[0];
      
      if (translated) {
        setTranslationCache((prev) => {
          const updated = { ...prev, [cacheKey]: translated };
          localStorage.setItem("translation-api-cache", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (error) {
      console.warn("Free Google Translate API fallback:", error.message);
    } finally {
      activeCount.current -= 1;
      // Trigger processing of next queued requests
      processQueue();
    }
  }, []);

  const translateText = useCallback((text, targetLang) => {
    const cacheKey = `${targetLang}:${text}`;
    
    // Skip duplicate items already queued
    if (
      queue.current.some((item) => item.text === text && item.targetLang === targetLang)
    ) {
      return;
    }

    queue.current.push({ text, targetLang });
    processQueue();
  }, [processQueue]);

  // Translator Selector with Stale-While-Revalidate and Local Dictionary bypass
  const translate = useCallback((text) => {
    if (!text) return "";

    // 1. If English is selected, return text as-is
    if (language === "en") return text;

    // 2. Check static translations dictionary first (Exact Match)
    if (staticTranslations[language] && staticTranslations[language][text]) {
      return staticTranslations[language][text];
    }

    // Case-insensitive static dictionary check
    if (staticTranslations[language]) {
      const matchedKey = Object.keys(staticTranslations[language]).find(
        (key) => key.toLowerCase() === text.toLowerCase()
      );
      if (matchedKey) {
        return staticTranslations[language][matchedKey];
      }
    }

    // 3. Map language code 'cg' to Chhattisgarhi code 'hne' for Google Translate API
    const apiTargetLang = (language === "cg" || language === "hne") ? "hne" : language;
    const cacheKey = `${apiTargetLang}:${text}`;

    // Check dynamic SWR cache
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    // Push request to the throttled queue
    translateText(text, apiTargetLang);

    // Return the original text as a stale fallback during background fetch
    return text;
  }, [language, translationCache, translateText]);

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage: language, 
      language, 
      changeLanguage, 
      t: translate 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
