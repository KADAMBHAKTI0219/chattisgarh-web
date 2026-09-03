/**
 * 39 Static Award Categories matching Proposed Award Categories PDF
 * and mapped strictly to Mongoose Category Schema.
 * Images referenced directly from /assets/images/category/ category-1 to category-39.
 */

export const staticCategories = [
  // -------------------------------------------------------------
  // TIER 1: Nation Building & Governance (tierNumber: 1)
  // -------------------------------------------------------------
  {
    categoryNumber: 1,
    title: "Creator for Nation Building",
    slug: "creator-for-nation-building",
    tier: "Nation Building & Governance",
    tierNumber: 1,
    shortDescription: "Honoring creators who highlight India's growth, infrastructure, policy impact, and national development initiatives.",
    fullDescription: "This award recognizes digital creators dedicated to storytelling around national progress, public infrastructure, policy impact, and developmental initiatives across India.",
    taskBrief: "Share compelling stories, visual content, or documentary-style videos showcasing transformative national projects, policy awareness, or civic progress.",
    hashtag: "#NationBuildingCreator",
    icon: "FaFlag",
    image: "/assets/images/category/category-1.jpg",
    prizeTier: "FLAGSHIP",
    cashPrizeMin: 500000,
    cashPrizeMax: 1000000,
    order: 1,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Creator for Nation Building - National Creators Awards",
      metaDescription: "Recognizing digital creators driving nation building, infrastructure awareness, and national progress storytelling.",
      keywords: ["nation building", "national creators awards", "governance", "development", "india growth"]
    }
  },
  {
    categoryNumber: 2,
    title: "Governance, Public Policy & Civic Awareness Creator",
    slug: "governance-public-policy-civic-awareness-creator",
    tier: "Nation Building & Governance",
    tierNumber: 1,
    shortDescription: "Recognizing content creators educating citizens on governance, constitutional rights, public welfare schemes, and civic duties.",
    fullDescription: "Aimed at creators who demystify public policy, explain government schemes, spread civic awareness, and empower citizens with actionable information.",
    taskBrief: "Create informative videos, infographics, or explainers highlighting civic rights, public welfare schemes, or government mechanisms.",
    hashtag: "#CivicAwarenessCreator",
    icon: "FaBuilding",
    image: "/assets/images/category/category-2.png",
    prizeTier: "MARQUEE",
    cashPrizeMin: 250000,
    cashPrizeMax: 500000,
    order: 2,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Governance & Civic Awareness Creator - National Creators Awards",
      metaDescription: "Honoring content creators who educate citizens on public policy, civic awareness, and government schemes.",
      keywords: ["governance", "public policy", "civic awareness", "welfare schemes", "citizen rights"]
    }
  },
  {
    categoryNumber: 3,
    title: "Defence & Strategic Affairs Creator",
    slug: "defence-strategic-affairs-creator",
    tier: "Nation Building & Governance",
    tierNumber: 1,
    shortDescription: "Celebrating creators dedicated to armed forces history, national security awareness, strategic geopolitics, and defence technology.",
    fullDescription: "This category honors digital voices bringing spotlight to India's armed forces, defence innovation, veterans' stories, and strategic geopolitics.",
    taskBrief: "Produce content focused on national security, military history, defence modernization, or inspiring stories of armed forces personnel.",
    hashtag: "#DefenceStrategicCreator",
    icon: "FaShieldAlt",
    image: "/assets/images/category/category-3.png",
    prizeTier: "STANDARD",
    cashPrizeMin: 100000,
    cashPrizeMax: 250000,
    order: 3,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Defence & Strategic Affairs Creator - National Creators Awards",
      metaDescription: "Celebrating creators sharing stories on defence innovation, armed forces history, and strategic security affairs.",
      keywords: ["defence", "armed forces", "national security", "geopolitics", "strategic affairs"]
    }
  },
  {
    categoryNumber: 4,
    title: "Digital Literacy & Civic Participation Creator",
    slug: "digital-literacy-civic-participation-creator",
    tier: "Nation Building & Governance",
    tierNumber: 1,
    shortDescription: "Awarding creators spreading digital skills, online safety education, and active citizen participation in governance.",
    fullDescription: "Recognizes individuals bridging the digital divide by teaching digital tools, cybersecurity basics, e-governance access, and democratic engagement.",
    taskBrief: "Deliver educational content aimed at improving digital literacy, online safety, or encouraging participation in community governance.",
    hashtag: "#DigitalLiteracyCreator",
    icon: "FaLaptopCode",
    image: "/assets/images/category/category-4.webp",
    prizeTier: "STANDARD",
    cashPrizeMin: 100000,
    cashPrizeMax: 250000,
    order: 4,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Digital Literacy & Civic Participation Creator - National Creators Awards",
      metaDescription: "Honoring creators bridging the digital divide and teaching online safety and e-governance skills.",
      keywords: ["digital literacy", "civic participation", "e-governance", "online safety", "digital skills"]
    }
  },

  // -------------------------------------------------------------
  // TIER 2: Technology & Innovation (tierNumber: 2)
  // -------------------------------------------------------------
  {
    categoryNumber: 5,
    title: "AI, Data & Emerging Technology Creator",
    slug: "ai-data-emerging-technology-creator",
    tier: "Technology & Innovation",
    tierNumber: 2,
    shortDescription: "Celebrating innovators and explainers simplifying Artificial Intelligence, Machine Learning, Data Science, and frontier tech.",
    fullDescription: "Honors creators who make artificial intelligence, data analytics, machine learning, and emerging technical breakthroughs accessible and practical for all.",
    taskBrief: "Create tutorials, deep-dives, or practical demonstrations showcasing AI tools, data science concepts, or futuristic technologies.",
    hashtag: "#AICreator",
    icon: "FaBrain",
    image: "/assets/images/category/category-5.jpg",
    prizeTier: "FLAGSHIP",
    cashPrizeMin: 500000,
    cashPrizeMax: 1000000,
    order: 5,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "AI & Emerging Technology Creator - National Creators Awards",
      metaDescription: "Celebrating creators simplifying AI, Machine Learning, and frontier technology for the masses.",
      keywords: ["ai", "machine learning", "data science", "emerging tech", "artificial intelligence"]
    }
  },
  {
    categoryNumber: 6,
    title: "Cyber Security & Digital Safety Creator",
    slug: "cyber-security-digital-safety-creator",
    tier: "Technology & Innovation",
    tierNumber: 2,
    shortDescription: "Honoring creators raising awareness on cybersecurity, scam protection, data privacy, and ethical hacking.",
    fullDescription: "Dedicated to creators educating the public on avoiding cyber fraud, safeguarding personal data, understanding digital privacy, and cybersecurity best practices.",
    taskBrief: "Publish actionable guides, awareness videos, or tips on preventing cyber crimes, fraud protection, and data privacy.",
    hashtag: "#CyberSafetyCreator",
    icon: "FaLock",
    image: "/assets/images/category/category-6.jpg",
    prizeTier: "STANDARD",
    cashPrizeMin: 100000,
    cashPrizeMax: 250000,
    order: 6,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Cyber Security & Digital Safety Creator - National Creators Awards",
      metaDescription: "Recognizing creators educating citizens on fraud protection, data privacy, and cyber safety.",
      keywords: ["cybersecurity", "digital safety", "scam protection", "data privacy", "ethical hacking"]
    }
  },
  {
    categoryNumber: 7,
    title: "Developer & Coding Creator",
    slug: "developer-coding-creator",
    tier: "Technology & Innovation",
    tierNumber: 2,
    shortDescription: "Recognizing coding educators, open-source contributors, and software development mentors.",
    fullDescription: "Applauds content creators helping aspiring developers learn programming languages, software engineering principles, system architecture, and open-source.",
    taskBrief: "Share code tutorials, tech stack guides, project walkthroughs, or software development best practices.",
    hashtag: "#DevCreator",
    icon: "FaCode",
    image: "/assets/images/category/category-7.jpg",
    prizeTier: "STANDARD",
    cashPrizeMin: 100000,
    cashPrizeMax: 250000,
    order: 7,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Developer & Coding Creator - National Creators Awards",
      metaDescription: "Celebrating programming educators, coding mentors, and open-source content creators.",
      keywords: ["developer", "coding", "software engineering", "programming", "open source"]
    }
  },
  {
    categoryNumber: 8,
    title: "Startup, Entrepreneurship & Creator Economy Creator",
    slug: "startup-entrepreneurship-creator-economy-creator",
    tier: "Technology & Innovation",
    tierNumber: 2,
    shortDescription: "Celebrating founders, mentors, and analysts breaking down startup ecosystems, business strategy, and creator monetization.",
    fullDescription: "Recognizes creators sharing insights on building startups, venture capital, business growth, unit economics, and creator economy trends.",
    taskBrief: "Produce content dissecting business models, startup journeys, funding strategies, or growth tactics.",
    hashtag: "#StartupCreator",
    icon: "FaRocket",
    image: "/assets/images/category/category-8.jpg",
    prizeTier: "MARQUEE",
    cashPrizeMin: 250000,
    cashPrizeMax: 500000,
    order: 8,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Startup & Entrepreneurship Creator - National Creators Awards",
      metaDescription: "Honoring creators inspiring entrepreneurs, startup founders, and creator economy builders.",
      keywords: ["startup", "entrepreneurship", "creator economy", "venture capital", "business strategy"]
    }
  },
  {
    categoryNumber: 9,
    title: "Robotics, AR/VR, Web3 & Innovation Creator",
    slug: "robotics-ar-vr-web3-innovation-creator",
    tier: "Technology & Innovation",
    tierNumber: 2,
    shortDescription: "Honoring pioneers exploring robotics, immersive AR/VR hardware, metaverse, blockchain, and cutting-edge innovations.",
    fullDescription: "Dedicated to creators pushing technological boundaries through hardware projects, robotics experiments, spatial computing, AR/VR experiences, and Web3 innovations.",
    taskBrief: "Showcase physical hardware builds, robotics demos, AR/VR experiences, or Web3 applications.",
    hashtag: "#RoboticsARVRCreator",
    icon: "FaVrCardboard",
    image: "/assets/images/category/category-9.jpg",
    prizeTier: "STANDARD",
    cashPrizeMin: 100000,
    cashPrizeMax: 250000,
    order: 9,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Robotics, AR/VR & Web3 Creator - National Creators Awards",
      metaDescription: "Celebrating innovators building future tech across robotics, spatial computing, AR/VR, and Web3.",
      keywords: ["robotics", "ar vr", "web3", "metaverse", "hardware innovation"]
    }
  },
  {
    categoryNumber: 10,
    title: "Women in Technology Creator",
    slug: "women-in-technology-creator",
    tier: "Technology & Innovation",
    tierNumber: 2,
    shortDescription: "Celebrating outstanding female leaders, engineers, and creators breaking barriers and driving innovation in tech.",
    fullDescription: "Honors female creators championing STEM education, tech leadership, software engineering, and innovative digital solutions.",
    taskBrief: "Create content highlighting women in STEM, tech tutorials, career guidance, or innovation showcases.",
    hashtag: "#WomenInTechCreator",
    icon: "FaUserAstronaut",
    image: "/assets/images/category/category-10.jpg",
    prizeTier: "MARQUEE",
    cashPrizeMin: 250000,
    cashPrizeMax: 500000,
    order: 10,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Women in Technology Creator - National Creators Awards",
      metaDescription: "Honoring pioneering women in STEM, tech leadership, and digital innovation.",
      keywords: ["women in tech", "women in stem", "female tech leaders", "software engineering", "tech creators"]
    }
  },

  // -------------------------------------------------------------
  // TIER 3: Education & Career (tierNumber: 3)
  // -------------------------------------------------------------
  {
    categoryNumber: 11,
    title: "Education, Career Guidance & Skill Development Creator",
    slug: "education-career-guidance-skill-development-creator",
    tier: "Education & Career",
    tierNumber: 3,
    shortDescription: "Honoring educators, career coaches, and skill trainers empowering youth with academic and vocational excellence.",
    fullDescription: "Recognizes creators transforming learning through exam prep, skill development tutorials, career roadmaps, vocational training, and educational content.",
    taskBrief: "Publish clear, structured educational lectures, exam preparation tips, career roadmaps, or vocational skills training.",
    hashtag: "#EduCreator",
    icon: "FaGraduationCap",
    image: "/assets/images/category/category-11.png",
    prizeTier: "FLAGSHIP",
    cashPrizeMin: 500000,
    cashPrizeMax: 1000000,
    order: 11,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Education & Career Guidance Creator - National Creators Awards",
      metaDescription: "Celebrating educators, tutors, and skill trainers transforming career guidance and learning.",
      keywords: ["education", "career guidance", "skill development", "edtech", "exam prep"]
    }
  },

  // -------------------------------------------------------------
  // TIER 4: Health & Social Impact (tierNumber: 4)
  // -------------------------------------------------------------
  {
    categoryNumber: 12,
    title: "Health, Fitness & Public Welfare Creator",
    slug: "health-fitness-public-welfare-creator",
    tier: "Health & Social Impact",
    tierNumber: 4,
    shortDescription: "Recognizing fitness trainers, medical professionals, and wellness advocates inspiring healthier lifestyles.",
    fullDescription: "Applauds content creators focusing on physical fitness, holistic wellness, medical awareness, nutrition science, and mental well-being.",
    taskBrief: "Deliver fitness routines, evidence-based health tips, mental health advocacy, or wellness education.",
    hashtag: "#HealthFitnessCreator",
    icon: "FaHeartbeat",
    image: "/assets/images/category/category-12.jpg",
    prizeTier: "MARQUEE",
    cashPrizeMin: 250000,
    cashPrizeMax: 500000,
    order: 12,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Health, Fitness & Public Welfare Creator - National Creators Awards",
      metaDescription: "Awarding fitness advocates, medical creators, and mental health champions.",
      keywords: ["health", "fitness", "wellness", "nutrition", "public welfare"]
    }
  },
  {
    categoryNumber: 13,
    title: "Social Change Creator",
    slug: "social-change-creator",
    tier: "Health & Social Impact",
    tierNumber: 4,
    shortDescription: "Celebrating creators driving positive social impact, community uplifting, inclusivity, and humanitarian causes.",
    fullDescription: "Honors digital voices using their platform to champion social causes, help vulnerable communities, promote equality, and drive real-world change.",
    taskBrief: "Present impactful campaigns, community stories, social drives, or awareness videos addressing social issues.",
    hashtag: "#SocialChangeCreator",
    icon: "FaHandsHelping",
    image: "/assets/images/category/category-13.jpg",
    prizeTier: "FLAGSHIP",
    cashPrizeMin: 500000,
    cashPrizeMax: 1000000,
    order: 13,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Social Change Creator - National Creators Awards",
      metaDescription: "Recognizing digital creators championing humanitarian causes, social justice, and community empowerment.",
      keywords: ["social change", "humanitarian", "community impact", "social causes", "empowerment"]
    }
  },
  {
    categoryNumber: 14,
    title: "Nari Shakti Creator",
    slug: "nari-shakti-creator",
    tier: "Health & Social Impact",
    tierNumber: 4,
    shortDescription: "Honoring exceptional women leaders and creators inspiring female empowerment, entrepreneurship, and social reform.",
    fullDescription: "A special recognition celebrating female creators who exemplify courage, innovation, leadership, and drive women-led empowerment in society.",
    taskBrief: "Share stories, personal achievements, or campaigns highlighting women's empowerment, leadership, and social reform.",
    hashtag: "#NariShaktiCreator",
    icon: "FaFemale",
    image: "/assets/images/category/category-14.jpg",
    prizeTier: "FLAGSHIP",
    cashPrizeMin: 500000,
    cashPrizeMax: 1000000,
    order: 14,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Nari Shakti Creator - National Creators Awards",
      metaDescription: "Celebrating women creators driving female empowerment, leadership, and social reform.",
      keywords: ["nari shakti", "women empowerment", "female leadership", "women creators", "social reform"]
    }
  },

  // -------------------------------------------------------------
  // TIER 5: Agriculture & Rural Development (tierNumber: 5)
  // -------------------------------------------------------------
  {
    categoryNumber: 15,
    title: "Agriculture & Rural Development Creator",
    slug: "agriculture-rural-development-creator",
    tier: "Agriculture & Rural Development",
    tierNumber: 5,
    shortDescription: "Celebrating creators promoting modern farming practices, agritech innovation, and rural economic empowerment.",
    fullDescription: "Recognizes content creators empowering the agricultural community with modern farming techniques, agritech tools, livestock management, and rural success stories.",
    taskBrief: "Create guides, field vlogs, or technical explainers on modern agricultural tools, organic farming, agritech, or rural growth.",
    hashtag: "#AgriCreator",
    icon: "FaSeedling",
    image: "/assets/images/category/category-15.jpg",
    prizeTier: "MARQUEE",
    cashPrizeMin: 250000,
    cashPrizeMax: 500000,
    order: 15,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Agriculture & Rural Development Creator - National Creators Awards",
      metaDescription: "Honoring creators championing modern farming, agritech, and rural development.",
      keywords: ["agriculture", "rural development", "agritech", "farming", "organic farming"]
    }
  },

  // -------------------------------------------------------------
  // TIER 6: Sustainability & Environment (tierNumber: 6)
  // -------------------------------------------------------------
  {
    categoryNumber: 16,
    title: "Green Champion & Mission LiFE Creator",
    slug: "green-champion-mission-life-creator",
    tier: "Sustainability & Environment",
    tierNumber: 6,
    shortDescription: "Honoring climate action advocates, eco-friendly lifestyle creators, and Mission LiFE champions.",
    fullDescription: "Recognizes creators inspiring eco-friendly living, renewable energy adoption, zero-waste practices, climate change mitigation, and Mission LiFE goals.",
    taskBrief: "Produce content encouraging sustainable living, recycling, renewable energy, tree plantation, or climate conservation.",
    hashtag: "#GreenChampionCreator",
    icon: "FaLeaf",
    image: "/assets/images/category/category-16.jpg",
    prizeTier: "MARQUEE",
    cashPrizeMin: 250000,
    cashPrizeMax: 500000,
    order: 16,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Green Champion & Mission LiFE Creator - National Creators Awards",
      metaDescription: "Celebrating eco-friendly advocates, zero-waste practitioners, and Mission LiFE leaders.",
      keywords: ["green champion", "mission life", "sustainability", "environment", "climate action"]
    }
  },
  {
    categoryNumber: 17,
    title: "Swachhta Ambassador",
    slug: "swachhta-ambassador",
    tier: "Sustainability & Environment",
    tierNumber: 6,
    shortDescription: "Recognizing champions promoting cleanliness drives, waste management, sanitation awareness, and Swachh Bharat.",
    fullDescription: "Honors individuals leading real-world or digital campaigns for cleanliness, civic hygiene, plastic reduction, and community waste management.",
    taskBrief: "Share videos or documentation of cleanup drives, waste segregation tutorials, sanitation awareness, or hygiene initiatives.",
    hashtag: "#SwachhtaAmbassador",
    icon: "FaBroom",
    image: "/assets/images/category/category-17.jpg",
    prizeTier: "STANDARD",
    cashPrizeMin: 100000,
    cashPrizeMax: 250000,
    order: 17,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Swachhta Ambassador - National Creators Awards",
      metaDescription: "Honoring creators advocating cleanliness, sanitation, and Swachh Bharat campaigns.",
      keywords: ["swachhta ambassador", "swachh bharat", "cleanliness drive", "waste management", "sanitation"]
    }
  },

  // -------------------------------------------------------------
  // TIER 7: Culture, Heritage & Languages (tierNumber: 7)
  // -------------------------------------------------------------
  {
    categoryNumber: 18,
    title: "Indian Heritage & Culture Creator",
    slug: "indian-heritage-culture-creator",
    tier: "Culture, Heritage & Languages",
    tierNumber: 7,
    shortDescription: "Celebrating creators preserving and promoting traditional art forms, historical monuments, folk traditions, and cultural glory.",
    fullDescription: "Applauds creators showcasing India's rich history, ancient monuments, classical arts, temple architecture, and cultural traditions.",
    taskBrief: "Produce documentaries, visual essays, or performances showcasing Indian art, architecture, historical monuments, and folk heritage.",
    hashtag: "#HeritageCreator",
    icon: "FaLandmark",
    image: "/assets/images/category/category-18.jpg",
    prizeTier: "FLAGSHIP",
    cashPrizeMin: 500000,
    cashPrizeMax: 1000000,
    order: 18,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Indian Heritage & Culture Creator - National Creators Awards",
      metaDescription: "Recognizing digital creators showcasing Indian art, history, monuments, and cultural traditions.",
      keywords: ["indian heritage", "culture", "monuments", "classical art", "history"]
    }
  },
  {
    categoryNumber: 19,
    title: "Indian Languages & Literature Creator",
    slug: "indian-languages-literature-creator",
    tier: "Culture, Heritage & Languages",
    tierNumber: 7,
    shortDescription: "Honoring creators promoting regional Indian languages, poetry, storytelling, and literary arts.",
    fullDescription: "Dedicated to creators enriching digital spaces with regional language content, classical and modern literature, poetry recitation, and linguistic heritage.",
    taskBrief: "Share original poetry, literary analysis, regional language storytelling, or linguistic education content.",
    hashtag: "#LanguageLiteratureCreator",
    icon: "FaBookOpen",
    image: "/assets/images/category/category-19.jpg",
    prizeTier: "STANDARD",
    cashPrizeMin: 100000,
    cashPrizeMax: 250000,
    order: 19,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Indian Languages & Literature Creator - National Creators Awards",
      metaDescription: "Celebrating creators promoting regional Indian languages, literature, and poetry.",
      keywords: ["indian languages", "literature", "regional languages", "poetry", "storytelling"]
    }
  },
  {
    categoryNumber: 20,
    title: "Heritage Fashion Creator",
    slug: "heritage-fashion-creator",
    tier: "Culture, Heritage & Languages",
    tierNumber: 7,
    shortDescription: "Recognizing designers and stylists promoting traditional handlooms, indigenous weaves, and ethnic fashion.",
    fullDescription: "Honors creators who spotlight Indian weaves, handlooms, traditional textiles, ethnic wear, and sustainable heritage fashion.",
    taskBrief: "Create fashion lookbooks, handloom showcases, styling guides, or weaver spotlight videos.",
    hashtag: "#HeritageFashionCreator",
    icon: "FaTshirt",
    image: "/assets/images/category/category-20.jpg",
    prizeTier: "STANDARD",
    cashPrizeMin: 100000,
    cashPrizeMax: 250000,
    order: 20,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Heritage Fashion Creator - National Creators Awards",
      metaDescription: "Honoring fashion creators spotlighting Indian handlooms, ethnic textiles, and heritage fashion.",
      keywords: ["heritage fashion", "handloom", "ethnic wear", "textiles", "indian fashion"]
    }
  },

  // -------------------------------------------------------------
  // TIER 8: Media & Information (tierNumber: 8)
  // -------------------------------------------------------------
  {
    categoryNumber: 21,
    title: "Journalist, Media & News Creator",
    slug: "journalist-media-news-creator",
    tier: "Media & Information",
    tierNumber: 8,
    shortDescription: "Celebrating independent journalists, ground reporters, and news commentators delivering accurate, balanced reporting.",
    fullDescription: "Honors digital journalists and media creators providing grounded news reporting, investigative journalism, and insightful current affairs analysis.",
    taskBrief: "Produce investigative reports, news breakdowns, ground coverage videos, or balanced editorial commentary.",
    hashtag: "#JournalistCreator",
    icon: "FaNewspaper",
    image: "/assets/images/category/category-21.jpg",
    prizeTier: "MARQUEE",
    cashPrizeMin: 250000,
    cashPrizeMax: 500000,
    order: 21,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Journalist & Media Creator - National Creators Awards",
      metaDescription: "Celebrating digital journalists, ground reporters, and independent news commentary.",
      keywords: ["journalism", "news creator", "independent media", "investigative journalism", "current affairs"]
    }
  },
  {
    categoryNumber: 22,
    title: "Fact-Checking & Legal Awareness Creator",
    slug: "fact-checking-legal-awareness-creator",
    tier: "Media & Information",
    tierNumber: 8,
    shortDescription: "Honoring creators combating fake news, debunking misinformation, and spreading legal rights awareness.",
    fullDescription: "Dedicated to creators who verify viral claims, expose digital misinformation, explain laws, and educate citizens on legal rights.",
    taskBrief: "Publish fact-check breakdowns, legal rights guides, or educational content countering digital fake news.",
    hashtag: "#FactCheckCreator",
    icon: "FaGavel",
    image: "/assets/images/category/category-22.jpg",
    prizeTier: "STANDARD",
    cashPrizeMin: 100000,
    cashPrizeMax: 250000,
    order: 22,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Fact-Checking & Legal Awareness Creator - National Creators Awards",
      metaDescription: "Recognizing creators debunking misinformation and educating citizens on legal rights.",
      keywords: ["fact checking", "legal awareness", "fake news debunking", "citizen rights", "media literacy"]
    }
  },

  // -------------------------------------------------------------
  // TIER 9: Creative & Entertainment (tierNumber: 9)
  // -------------------------------------------------------------
  {
    categoryNumber: 23,
    title: "Storyteller Creator",
    slug: "storyteller-creator",
    tier: "Creative & Entertainment",
    tierNumber: 9,
    shortDescription: "Celebrating master storytellers, narrative artists, short filmmakers, and audio drama creators.",
    fullDescription: "Applauds creators who craft captivating narratives, cinematic short films, emotional audio stories, and visual tales.",
    taskBrief: "Share original short stories, audio dramas, narrative short films, or creative video storytelling.",
    hashtag: "#StorytellerCreator",
    icon: "FaFilm",
    image: "/assets/images/category/category-23.jpg",
    prizeTier: "FLAGSHIP",
    cashPrizeMin: 500000,
    cashPrizeMax: 1000000,
    order: 23,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Storyteller Creator - National Creators Awards",
      metaDescription: "Honoring digital storytellers, short filmmakers, and creative narrative artists.",
      keywords: ["storyteller", "short films", "narrative", "audio drama", "digital storytelling"]
    }
  },
  {
    categoryNumber: 24,
    title: "Creative Arts Creator",
    slug: "creative-arts-creator",
    tier: "Creative & Entertainment",
    tierNumber: 9,
    shortDescription: "Recognizing digital artists, painters, musicians, dancers, and visual performers.",
    fullDescription: "Honors artistic creators across fine arts, digital illustration, choreography, music composition, and performing arts.",
    taskBrief: "Showcase original artwork, digital paintings, dance routines, musical compositions, or craft creations.",
    hashtag: "#CreativeArtsCreator",
    icon: "FaPaintBrush",
    image: "/assets/images/category/category-24.jpg",
    prizeTier: "STANDARD",
    cashPrizeMin: 100000,
    cashPrizeMax: 250000,
    order: 24,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Creative Arts Creator - National Creators Awards",
      metaDescription: "Celebrating visual artists, musicians, dancers, and digital art creators.",
      keywords: ["creative arts", "digital art", "music", "dance", "fine arts"]
    }
  },
  {
    categoryNumber: 25,
    title: "Visual FX & Cinematic Creator",
    slug: "visual-fx-cinematic-creator",
    tier: "Creative & Entertainment",
    tierNumber: 9,
    shortDescription: "Honoring VFX artists, video editors, and cinematic creators setting new benchmarks in video production.",
    fullDescription: "Recognizes creators with outstanding technical mastery in visual effects, video editing, color grading, and cinematic storytelling.",
    taskBrief: "Submit videos featuring exceptional visual effects, cinematic cinematography, or high-end post-production editing.",
    hashtag: "#VFXCinematicCreator",
    icon: "FaVideo",
    image: "/assets/images/category/category-25.jpg",
    prizeTier: "MARQUEE",
    cashPrizeMin: 250000,
    cashPrizeMax: 500000,
    order: 25,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Visual FX & Cinematic Creator - National Creators Awards",
      metaDescription: "Awarding visual effects artists, video editing masters, and cinematic film creators.",
      keywords: ["visual fx", "vfx", "cinematic", "video editing", "filmmaking"]
    }
  },
  {
    categoryNumber: 26,
    title: "Podcast & Long-Form Content Creator",
    slug: "podcast-long-form-content-creator",
    tier: "Creative & Entertainment",
    tierNumber: 9,
    shortDescription: "Celebrating podcasters, interviewers, and deep-dive long-form content producers.",
    fullDescription: "Applauds creators producing high-quality podcast shows, insightful interviews, and comprehensive long-form video essays.",
    taskBrief: "Share podcast episodes, long-form interviews, or deep-dive video essays with high conversational value.",
    hashtag: "#PodcastCreator",
    icon: "FaMicrophone",
    image: "/assets/images/category/category-26.jpg",
    prizeTier: "MARQUEE",
    cashPrizeMin: 250000,
    cashPrizeMax: 500000,
    order: 26,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Podcast & Long-Form Content Creator - National Creators Awards",
      metaDescription: "Celebrating podcasters, interview hosts, and long-form video essay creators.",
      keywords: ["podcast", "long form content", "interviews", "video essay", "talk shows"]
    }
  },
  {
    categoryNumber: 27,
    title: "Comedy Creator",
    slug: "comedy-creator",
    tier: "Creative & Entertainment",
    tierNumber: 9,
    shortDescription: "Recognizing stand-up comedians, sketch creators, and satirical humorists bringing joy to millions.",
    fullDescription: "Honors comedy creators, satirists, and sketch artists who bring wholesome entertainment, humor, and joy.",
    taskBrief: "Publish comedy sketches, stand-up clips, funny skits, or satirical commentary.",
    hashtag: "#ComedyCreator",
    icon: "FaLaugh",
    image: "/assets/images/category/category-27.jpg",
    prizeTier: "STANDARD",
    cashPrizeMin: 100000,
    cashPrizeMax: 250000,
    order: 27,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Comedy Creator - National Creators Awards",
      metaDescription: "Recognizing stand-up comedians, sketch creators, and satirical humorists.",
      keywords: ["comedy", "skits", "stand up", "satire", "humor"]
    }
  },
  {
    categoryNumber: 28,
    title: "Celebrity Creator",
    slug: "celebrity-creator",
    tier: "Creative & Entertainment",
    tierNumber: 9,
    shortDescription: "Celebrating mainstream figures, actors, and public icons leveraging digital channels for positive public engagement.",
    fullDescription: "Honors public icons and celebrities who effectively connect with audiences through meaningful digital content and positive engagement.",
    taskBrief: "Submit digital content produced by established public personalities driving positive audience engagement.",
    hashtag: "#CelebrityCreator",
    icon: "FaStar",
    image: "/assets/images/category/category-28.png",
    prizeTier: "SPECIAL",
    cashPrizeMin: 500000,
    cashPrizeMax: 1000000,
    order: 28,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Celebrity Creator - National Creators Awards",
      metaDescription: "Honoring public icons and mainstream personalities excelling in digital content creation.",
      keywords: ["celebrity", "public icon", "digital content", "actors", "influencer"]
    }
  },

  // -------------------------------------------------------------
  // TIER 10: Lifestyle & Special Interest (tierNumber: 10)
  // -------------------------------------------------------------
  {
    categoryNumber: 29,
    title: "Food Creator",
    slug: "food-creator",
    tier: "Lifestyle & Special Interest",
    tierNumber: 10,
    shortDescription: "Honoring culinary creators, regional recipe preservers, food vloggers, and chefs.",
    fullDescription: "Celebrates creators promoting culinary diversity, authentic regional recipes, cooking tutorials, and food exploration.",
    taskBrief: "Create cooking tutorials, regional food heritage videos, recipe breakdowns, or street food reviews.",
    hashtag: "#FoodCreator",
    icon: "FaUtensils",
    image: "/assets/images/category/category-29.jpg",
    prizeTier: "STANDARD",
    cashPrizeMin: 100000,
    cashPrizeMax: 250000,
    order: 29,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Food Creator - National Creators Awards",
      metaDescription: "Celebrating chefs, regional food vloggers, and culinary recipe creators.",
      keywords: ["food", "recipes", "cooking", "culinary", "food vlog"]
    }
  },
  {
    categoryNumber: 30,
    title: "Travel Creator",
    slug: "travel-creator",
    tier: "Lifestyle & Special Interest",
    tierNumber: 10,
    shortDescription: "Recognizing travel vloggers showcasing Indian tourism, offbeat destinations, and cultural exploration.",
    fullDescription: "Honors travel creators promoting domestic tourism, hidden gems, sustainable travel, and cultural journeys across India.",
    taskBrief: "Publish travel vlogs, destination guides, offbeat exploration videos, or cultural travel itineraries.",
    hashtag: "#TravelCreator",
    icon: "FaPlane",
    image: "/assets/images/category/category-30.jpg",
    prizeTier: "MARQUEE",
    cashPrizeMin: 250000,
    cashPrizeMax: 500000,
    order: 30,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Travel Creator - National Creators Awards",
      metaDescription: "Honoring travel vloggers showcasing Indian tourism and offbeat cultural destinations.",
      keywords: ["travel", "tourism", "travel vlog", "destination guide", "explore india"]
    }
  },
  {
    categoryNumber: 31,
    title: "Gaming Creator",
    slug: "gaming-creator",
    tier: "Lifestyle & Special Interest",
    tierNumber: 10,
    shortDescription: "Celebrating esports athletes, game streamers, and gaming content producers.",
    fullDescription: "Applauds creators in the gaming and esports ecosystem producing live streams, strategy guides, game reviews, and esports commentary.",
    taskBrief: "Share gaming live streams, esports walkthroughs, gameplay tutorials, or game reviews.",
    hashtag: "#GamingCreator",
    icon: "FaGamepad",
    image: "/assets/images/category/category-31.jpg",
    prizeTier: "STANDARD",
    cashPrizeMin: 100000,
    cashPrizeMax: 250000,
    order: 31,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Gaming Creator - National Creators Awards",
      metaDescription: "Recognizing esports athletes, game streamers, and gaming content producers.",
      keywords: ["gaming", "esports", "streamer", "gameplay", "gaming content"]
    }
  },
  {
    categoryNumber: 32,
    title: "Automotive & Mobility Creator",
    slug: "automotive-mobility-creator",
    tier: "Lifestyle & Special Interest",
    tierNumber: 10,
    shortDescription: "Honoring auto reviewers, EV enthusiasts, and mobility tech creators.",
    fullDescription: "Recognizes creators delivering auto reviews, electric vehicle technology breakdowns, road safety guides, and automotive engineering insights.",
    taskBrief: "Create vehicle reviews, EV technology explainers, test-drive vlogs, or road safety guides.",
    hashtag: "#AutoCreator",
    icon: "FaCar",
    image: "/assets/images/category/category-32.jpg",
    prizeTier: "STANDARD",
    cashPrizeMin: 100000,
    cashPrizeMax: 250000,
    order: 32,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Automotive & Mobility Creator - National Creators Awards",
      metaDescription: "Celebrating auto reviewers, EV technology explainers, and mobility creators.",
      keywords: ["automotive", "auto review", "ev", "electric vehicles", "mobility"]
    }
  },
  {
    categoryNumber: 33,
    title: "Home & Lifestyle Creator",
    slug: "home-lifestyle-creator",
    tier: "Lifestyle & Special Interest",
    tierNumber: 10,
    shortDescription: "Recognizing interior decor creators, DIY enthusiasts, personal organization, and lifestyle creators.",
    fullDescription: "Honors creators sharing inspiration on interior design, home organization, DIY crafts, personal aesthetics, and daily living.",
    taskBrief: "Share home makeovers, DIY tutorials, organization tips, or aesthetic lifestyle content.",
    hashtag: "#LifestyleCreator",
    icon: "FaHome",
    image: "/assets/images/category/category-33.jpg",
    prizeTier: "STANDARD",
    cashPrizeMin: 100000,
    cashPrizeMax: 250000,
    order: 33,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Home & Lifestyle Creator - National Creators Awards",
      metaDescription: "Honoring interior decor, DIY, home organization, and lifestyle content creators.",
      keywords: ["home decor", "lifestyle", "diy", "interior design", "home organization"]
    }
  },
  {
    categoryNumber: 34,
    title: "Pets & Wildlife Creator",
    slug: "pets-wildlife-creator",
    tier: "Lifestyle & Special Interest",
    tierNumber: 10,
    shortDescription: "Celebrating animal welfare champions, pet care creators, and wildlife photographers.",
    fullDescription: "Applauds creators dedicated to pet care, stray rescue, wildlife conservation, nature photography, and animal rights.",
    taskBrief: "Produce content on animal welfare, pet care advice, wildlife documentaries, or rescue stories.",
    hashtag: "#PetsWildlifeCreator",
    icon: "FaPaw",
    image: "/assets/images/category/category-34.jpg",
    prizeTier: "STANDARD",
    cashPrizeMin: 100000,
    cashPrizeMax: 250000,
    order: 34,
    isActive: true,
    isFeatured: false,
    seo: {
      metaTitle: "Pets & Wildlife Creator - National Creators Awards",
      metaDescription: "Celebrating animal welfare champions, pet care advice, and wildlife photographers.",
      keywords: ["pets", "wildlife", "animal welfare", "nature photography", "pet care"]
    }
  },

  // -------------------------------------------------------------
  // TIER 11: Special Recognition (tierNumber: 11)
  // -------------------------------------------------------------
  {
    categoryNumber: 35,
    title: "Micro/Nano Creator",
    slug: "micro-nano-creator",
    tier: "Special Recognition",
    tierNumber: 11,
    shortDescription: "Celebrating emerging grassroot creators producing high-quality impactful content with niche communities.",
    fullDescription: "Dedicated to rising creators with growing audiences who demonstrate exceptional creativity, high engagement, and impactful niche content.",
    taskBrief: "Share original high-impact content produced by emerging micro or nano creators.",
    hashtag: "#MicroNanoCreator",
    icon: "FaUserPlus",
    image: "/assets/images/category/category-35.jpg",
    prizeTier: "SPECIAL",
    cashPrizeMin: 250000,
    cashPrizeMax: 500000,
    order: 35,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Micro/Nano Creator - National Creators Awards",
      metaDescription: "Recognizing rising grassroot creators with high impact and niche audiences.",
      keywords: ["micro creator", "nano creator", "grassroot talent", "emerging creators", "niche content"]
    }
  },
  {
    categoryNumber: 36,
    title: "International Creator",
    slug: "international-creator",
    tier: "Special Recognition",
    tierNumber: 11,
    shortDescription: "Honoring global creators promoting Indian culture, tourism, philosophy, and stories internationally.",
    fullDescription: "Recognizes international content creators based outside India who share stories about Indian culture, traditions, travel, and heritage with global audiences.",
    taskBrief: "Submit content produced by global creators showcasing Indian heritage, travel experiences, or cultural appreciation.",
    hashtag: "#InternationalCreator",
    icon: "FaGlobe",
    image: "/assets/images/category/category-36.jpg",
    prizeTier: "FLAGSHIP",
    cashPrizeMin: 500000,
    cashPrizeMax: 1000000,
    order: 36,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "International Creator - National Creators Awards",
      metaDescription: "Celebrating global creators sharing Indian culture and travel with international audiences.",
      keywords: ["international creator", "global creator", "indian culture", "world travel", "global audience"]
    }
  },
  {
    categoryNumber: 37,
    title: "Child Prodigy Creator",
    slug: "child-prodigy-creator",
    tier: "Special Recognition",
    tierNumber: 11,
    shortDescription: "Celebrating exceptional young talents under 18 demonstrating extraordinary skills in digital creation.",
    fullDescription: "Honors talented young creators under the age of 18 showcasing remarkable skill in coding, arts, science, music, or storytelling.",
    taskBrief: "Share creative achievements, talents, or content created by young prodigies under 18 years of age.",
    hashtag: "#ChildProdigyCreator",
    icon: "FaChild",
    image: "/assets/images/category/category-37.jpg",
    prizeTier: "SPECIAL",
    cashPrizeMin: 250000,
    cashPrizeMax: 500000,
    order: 37,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Child Prodigy Creator - National Creators Awards",
      metaDescription: "Honoring young talents under 18 excelling in digital creation, coding, and arts.",
      keywords: ["child prodigy", "young creator", "under 18 talent", "youth innovation", "kid creator"]
    }
  },
  {
    categoryNumber: 38,
    title: "New India Champion",
    slug: "new-india-champion",
    tier: "Special Recognition",
    tierNumber: 11,
    shortDescription: "Awarding creators capturing the spirit of modern, progressive, self-reliant India (Atmanirbhar Bharat).",
    fullDescription: "Honors creators who embody and showcase the energy of modern India—from rural innovation and indigenous manufacturing to global achievements.",
    taskBrief: "Create video stories or documentaries highlighting self-reliance, innovative solutions, and achievements of New India.",
    hashtag: "#NewIndiaChampion",
    icon: "FaMedal",
    image: "/assets/images/category/category-38.jpg",
    prizeTier: "FLAGSHIP",
    cashPrizeMin: 500000,
    cashPrizeMax: 1000000,
    order: 38,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "New India Champion - National Creators Awards",
      metaDescription: "Celebrating creators capturing the self-reliant spirit and achievements of New India.",
      keywords: ["new india champion", "atmanirbhar bharat", "self-reliant india", "progressive india", "innovation"]
    }
  },
  {
    categoryNumber: 39,
    title: "Disruptor of the Year",
    slug: "disruptor-of-the-year",
    tier: "Special Recognition",
    tierNumber: 11,
    shortDescription: "The ultimate honor recognizing a creator who revolutionized digital content creation with unprecedented impact.",
    fullDescription: "The flagship individual honor awarded to a visionary creator whose work redefined content creation, set new trends, and achieved massive national impact.",
    taskBrief: "Present ground-breaking, trend-setting content that redefined digital creation and achieved extraordinary audience engagement.",
    hashtag: "#DisruptorOfTheYear",
    icon: "FaTrophy",
    image: "/assets/images/category/category-39.jpg",
    prizeTier: "FLAGSHIP",
    cashPrizeMin: 1000000,
    cashPrizeMax: 2500000,
    order: 39,
    isActive: true,
    isFeatured: true,
    seo: {
      metaTitle: "Disruptor of the Year - National Creators Awards",
      metaDescription: "The flagship award recognizing the visionary creator who redefined digital content in India.",
      keywords: ["disruptor of the year", "flagship award", "creator of the year", "digital disruption", "national impact"]
    }
  }
];

export default staticCategories;
