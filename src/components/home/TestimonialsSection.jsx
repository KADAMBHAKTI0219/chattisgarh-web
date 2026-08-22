"use client";

import { FaYoutube, FaInstagram, FaCheckCircle } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import Heading from "@/components/common/Heading";

export default function TestimonialsSection() {
  const { t } = useLanguage();

  const testimonials = [{ id: 1, name: "Technical Guruji", handle: "@technicalguruji", platform: "YouTube", icon: FaYoutube, color: "#FF0000", role: "Tech Creator & Reviewer", quote: "Content creation makes technology easier to understand and accessible to everyone. By sharing knowledge, reviews, and innovations, creators can help people make better decisions and stay connected with a rapidly changing digital world.", link: "https://www.youtube.com/c/TechnicalGuruji", avatar: "/assets/images/technicalguruji.webp", cardBg: "bg-gradient-to-br from-[#FFF0F5] via-[#FFF6FA] to-[#FCE4EC]", borderColor: "border-[#FBCFE8]", tagBg: "bg-white/90 border-[#F472B6]/40 text-[#BE185D]" }, { id: 2, name: "Gaurav Taneja", handle: "@taneja.gaurav", platform: "Instagram", icon: FaInstagram, color: "#E1306C", role: "Pilot & Lifestyle Vlogger", quote: "Content creation gives people a chance to share real experiences, inspire others, and see life from different perspectives. Sharing journeys, challenges, and everyday experiences can motivate people to explore, learn, and believe in themselves.", link: "https://www.instagram.com/taneja.gaurav", avatar: "/assets/images/gauravtaneja.webp", cardBg: "bg-gradient-to-br from-[#F0FDF4] via-[#F6FDF9] to-[#DCFCE7]", borderColor: "border-[#BBF7D0]", tagBg: "bg-white/90 border-[#4ADE80]/40 text-[#15803D]" }, { id: 3, name: "Ashish Chanchlani", handle: "@ashishchanchlani", platform: "Instagram", icon: FaInstagram, color: "#E1306C", role: "Entertainment & Comedy", quote: "Content creation is not just about entertainment; it is about connecting people through stories, humor, and shared experiences. Comedy and creative storytelling can spread positivity, bring people together, and make everyday moments more meaningful.", link: "https://www.instagram.com/ashishchanchlani", avatar: "/assets/images/AshishChanchlani.webp", cardBg: "bg-gradient-to-br from-[#FFF7ED] via-[#FFFAF3] to-[#FFEDD5]", borderColor: "border-[#FED7AA]", tagBg: "bg-white/90 border-[#FB923C]/40 text-[#C2410C]" }, { id: 4, name: "Sharan Hegde", handle: "@financewithsharan", platform: "Instagram", icon: FaInstagram, color: "#E1306C", role: "Personal Finance Educator", quote: "Financial content creation can turn complicated money concepts into simple, practical knowledge. When creators educate people about saving, investing, and managing money, they help build better financial habits and a more financially aware generation.", link: "https://www.instagram.com/financewithsharan", avatar: "/assets/images/SharanHegde.webp", cardBg: "bg-gradient-to-br from-[#F0F9FF] via-[#F5FCFF] to-[#E0F2FE]", borderColor: "border-[#BAE6FD]", tagBg: "bg-white/90 border-[#38BDF8]/40 text-[#0369A1]" }, { id: 5, name: "Komal Pandey", handle: "@komalpandey212", platform: "Instagram", icon: FaInstagram, color: "#E1306C", role: "Fashion & Style Icon", quote: "Content creation gives creators the power to express identity, creativity, and culture through fashion and storytelling. It helps bring local styles, traditional crafts, and new ideas to a wider audience while inspiring the next generation of creators.", link: "https://www.instagram.com/komalpandey212", avatar: "/assets/images/komalpandey.jpg", cardBg: "bg-gradient-to-br from-[#FAF5FF] via-[#FCF8FF] to-[#F3E8FF]", borderColor: "border-[#E9D5FF]", tagBg: "bg-white/90 border-[#C084FC]/40 text-[#6B21A8]" }, { id: 6, name: "Kabita Singh", handle: "@kabitaskitchen", platform: "YouTube", icon: FaYoutube, color: "#FF0000", role: "Culinary Artist & Recipe Creator", quote: "Content creation helps preserve traditions by passing knowledge from one generation to another. Sharing traditional recipes and local cuisines online keeps our food culture alive and allows people everywhere to discover and celebrate their heritage.", link: "https://www.youtube.com/c/KabitasKitchen", avatar: "/assets/images/kabitaSingh.jpg", cardBg: "bg-gradient-to-br from-[#FEFCE8] via-[#FFFDF0] to-[#FEF9C3]", borderColor: "border-[#FEF08A]", tagBg: "bg-white/90 border-[#FACC15]/40 text-[#854D0E]" }];

  return (
    <section
      id="testimonials"
      className="w-full bg-[#FAF7F0] text-zinc-950 py-8 md:py-16 lg:py-20 flex flex-col items-center gap-8 md:gap-10 scroll-mt-24 select-none relative overflow-hidden z-10 my-6 md:my-10"
    >
      {/* Inline styles for CSS keyframe animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee-testimonials {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-testimonials {
          display: flex;
          width: max-content;
          animation: marquee-testimonials 30s linear infinite;
          will-change: transform;
          transform: translateZ(0);
        }
        .animate-marquee-testimonials:hover {
          animation-play-state: paused;
        }
      ` }} />

      {/* Header Component */}
      <Heading
        badge={t("The Community")}
        title={t("What Creators")}
        highlightText={t("Are Saying")}
        description={t("Hover over any card to pause the scrolling marquee and visit their verified channels.")}
      />

      {/* 2. AUTOMATIC INFINITE SCROLLING MARQUEE */}
      <div className="w-full relative overflow-hidden py-4 mt-2">
        {/* Double-render list for seamless infinite loop */}
        <div className="animate-marquee-testimonials gap-6">
          {[...testimonials, ...testimonials].map((test, idx) => {
            const PlatformIcon = test.icon;
            return (
              <div
                key={`${test.id}-${idx}`}
                className="w-[260px] h-[340px] sm:w-[310px] sm:h-[370px] xl:w-[350px] xl:h-[410px] 2xl:w-[390px] 2xl:h-[450px] shrink-0 p-6 sm:p-8 xl:p-10 flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-md hover:border-zinc-300 text-left hover:scale-[1.01] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Quote */}
                <p className="font-sans font-medium text-xs sm:text-sm xl:text-base 2xl:text-base leading-relaxed text-zinc-900">
                  &ldquo;{t(test.quote)}&rdquo;
                </p>

                {/* Author Info */}
                <div className="flex flex-col gap-3 mt-4 border-t border-zinc-200/60 pt-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={test.avatar}
                      alt={t(test.name)}
                      className="w-10 h-10 xl:w-12 xl:h-12 rounded-full border border-zinc-200 object-cover shrink-0 shadow-xs"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-sans font-bold text-sm xl:text-base text-zinc-950 flex items-center gap-1">
                        {t(test.name)}
                        <FaCheckCircle className="text-[#3897f0] shrink-0" title="Verified Creator" />
                      </span>
                      <span className="font-sans font-semibold text-xs xl:text-sm text-zinc-600 truncate">{t(test.role)}</span>
                    </div>
                  </div>

                  {/* Channel Tag Link */}
                  <a
                    href={test.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-50 border border-zinc-200 rounded-full text-zinc-900 font-extrabold text-[10px] sm:text-xs tracking-wide uppercase hover:bg-zinc-100 transition-colors shadow-xs"
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
