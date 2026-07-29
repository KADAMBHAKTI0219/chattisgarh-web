"use client";

import { FaYoutube, FaInstagram, FaCheckCircle } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export default function TestimonialsSection() {
  const { t } = useLanguage();

  const testimonials = [
    {
      id: 1,
      name: "Technical Guruji",
      handle: "@technicalguruji",
      platform: "YouTube",
      icon: FaYoutube,
      color: "#FF0000",
      role: "Tech Creator & Reviewer",
      quote: "The State Creator Awards is a massive milestone for us. It gives regional creators a national platform to showcase our rich culture, tech, and innovations.",
      link: "https://www.youtube.com/c/TechnicalGuruji",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Gaurav Taneja",
      handle: "@taneja.gaurav",
      platform: "Instagram",
      icon: FaInstagram,
      color: "#E1306C",
      role: "Pilot & Lifestyle Vlogger",
      quote: "Nominating content for these official awards is incredibly seamless! Highlighting our heritage and culture has finally found the recognition it deserves.",
      link: "https://www.instagram.com/taneja.gaurav",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Ashish Chanchlani",
      handle: "@ashishchanchlani",
      platform: "Instagram",
      icon: FaInstagram,
      color: "#E1306C",
      role: "Entertainment & Comedy",
      quote: "This is a proud moment for traditional and new-age artists. Bringing local humor, arts, and lifestyle stories to the digital screen is now celebrated officially!",
      link: "https://www.instagram.com/ashishchanchlani",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Sharan Hegde",
      handle: "@financewithsharan",
      platform: "Instagram",
      icon: FaInstagram,
      color: "#E1306C",
      role: "Personal Finance Educator",
      quote: "Educators and financial creators are finally getting the spotlight. The support from the administration shows their commitment to building a thriving digital economy.",
      link: "https://www.instagram.com/financewithsharan",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "Komal Pandey",
      handle: "@komalpandey212",
      platform: "Instagram",
      icon: FaInstagram,
      color: "#E1306C",
      role: "Fashion & Style Icon",
      quote: "Promoting our local handlooms and sustainable styles on social media is my passion. This platform motivates emerging designers and storytellers to keep building.",
      link: "https://www.instagram.com/komalpandey212",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 6,
      name: "Kabita Singh",
      handle: "@kabitaskitchen",
      platform: "YouTube",
      icon: FaYoutube,
      color: "#FF0000",
      role: "Culinary Artist & Recipe Creator",
      quote: "Teaching traditional cooking online has been a beautiful journey. This initiative validates our effort to make local cuisines accessible to every household.",
      link: "https://www.youtube.com/c/KabitasKitchen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
    }
  ];

  return (
    <section 
      id="testimonials" 
      className="w-screen left-1/2 -translate-x-1/2 bg-[#FAF7F0] text-zinc-950 py-8 md:py-16 lg:py-20 flex flex-col items-center gap-8 md:gap-10 scroll-mt-24 select-none relative  overflow-hidden z-10 my-6 md:my-10"
    >
      {/* Inline styles for CSS keyframe animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-testimonials {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-testimonials {
          display: flex;
          width: max-content;
          animation: marquee-testimonials 30s linear infinite;
        }
        .animate-marquee-testimonials:hover {
          animation-play-state: paused;
        }
      ` }} />

      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 max-w-2xl xl:max-w-4xl px-6">
        <span className="font-sans font-bold text-xs xl:text-sm uppercase tracking-widest text-[#BE2079]">
          {t("The Community")}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-black uppercase text-zinc-950 leading-tight">
          {t("What Creators")}{" "}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BE2079] to-[#E64C8A]">{t("Are Saying")}</span>
        </h2>
        <div className="h-[4px] w-32 bg-gradient-to-r from-[#BE2079] to-[#E64C8A] rounded-full mt-1"></div>
        <p className="text-zinc-700 font-bold text-sm xl:text-base mt-3">
          {t("Hover over any card to pause the scrolling marquee and visit their verified channels.")}
        </p>
      </div>

      {/* 2. AUTOMATIC INFINITE SCROLLING MARQUEE */}
      <div className="w-full relative overflow-hidden py-4 mt-2">
        {/* Double-render list for seamless infinite loop */}
        <div className="animate-marquee-testimonials gap-6">
          {[...testimonials, ...testimonials].map((test, idx) => {
            const PlatformIcon = test.icon;
            return (
              <div
                key={`${test.id}-${idx}`}
                className="w-[260px] h-[340px] sm:w-[310px] sm:h-[370px] xl:w-[350px] xl:h-[410px] 2xl:w-[390px] 2xl:h-[450px] shrink-0 p-6 sm:p-8 xl:p-10 flex flex-col justify-between rounded-none border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] text-left hover:scale-[1.01] hover:-translate-y-1 transition-all duration-200 bg-white"
              >
                {/* Quote */}
                <p className="font-sans font-bold text-sm sm:text-base xl:text-lg 2xl:text-xl leading-relaxed text-zinc-800">
                  &ldquo;{t(test.quote)}&rdquo;
                </p>
                
                {/* Author Info */}
                <div className="flex flex-col gap-3 mt-4 border-t border-zinc-200/40 pt-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={test.avatar} 
                      alt={t(test.name)} 
                      className="w-10 h-10 xl:w-12 xl:h-12 rounded-none border border-black object-cover shrink-0" 
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-sans font-black text-sm xl:text-base text-zinc-950 flex items-center gap-1">
                        {t(test.name)}
                        <FaCheckCircle className="text-[#3897f0] shrink-0" title="Verified Creator" />
                      </span>
                      <span className="font-sans font-bold text-xs xl:text-sm text-zinc-500 truncate">{t(test.role)}</span>
                    </div>
                  </div>

                  {/* Channel Tag Link */}
                  <a
                    href={test.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-50 border border-black text-zinc-900 font-extrabold text-[10px] sm:text-xs tracking-wide uppercase hover:bg-zinc-150 transition-colors shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]"
                  >
                    <PlatformIcon style={{ color: test.color }} className="w-3.5 h-3.5" />
                    <span>{test.handle}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
