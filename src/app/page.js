"use client";

import { useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import ConferenceShiftSection from "@/components/home/ConferenceShiftSection";
import LeadershipSection from "@/components/home/LeadershipSection";
// import WhyParticipateSection from "@/components/home/WhyParticipateSection";
import AwardCategoriesSection from "@/components/home/AwardCategoriesSection";
import WhoCanApplySection from "@/components/home/WhoCanApplySection";
import HowToApplySection from "@/components/home/HowToApplySection";
import FAQSection from "@/components/home/FAQSection";
// import TestimonialsSection from "@/components/home/TestimonialsSection";
import TermsSection from "@/components/home/TermsSection";

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-0 pt-0 pb-0 flex flex-col gap-0 [overflow-x:clip] animate-page-enter">

      {/* 1. Hero Section (includes titles, statistics, cards shuffle) */}
      <div className="reveal-on-scroll">
        <HeroSection />
      </div>

      {/* 2. Flat horizontal scrolling image marquee band */}
      <div className="reveal-on-scroll">
        <ConferenceShiftSection />
      </div>

      {/* 3. Leadership Message Section (Official PM & CM quotes block) */}
      <div className="reveal-on-scroll">
        <LeadershipSection />
      </div>

      {/* 4. Benefits Section (Why Participate?) */}
      {/* <div className="reveal-on-scroll">
        <WhyParticipateSection />
      </div> */}

      {/* 5. Award Categories Section (Search and filter cards) */}
      <div className="reveal-on-scroll">
        <AwardCategoriesSection />
      </div>

      {/* 10. Terms & Evaluation Guidelines Section */}
      <div className="reveal-on-scroll">
        <TermsSection />
      </div>

      {/* 6. Eligibility Section (Who Can Apply?) */}
      {/* <div className="reveal-on-scroll">
        <WhoCanApplySection />
      </div> */}

      {/* 7. Timeline Section (How To Apply Step-by-Step) */}
      <div className="reveal-on-scroll">
        <HowToApplySection />
      </div>

      {/* 9. Testimonials Section (Verified Creators Horizontal Marquee) */}
      {/* <div className="reveal-on-scroll">
        <TestimonialsSection />
      </div> */}


      {/* 8. FAQ Section Accordions */}
      <div className="reveal-on-scroll">
        <FAQSection />
      </div>


    </div>
  );
}
