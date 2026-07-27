"use client";

import HeroSection from "@/components/home/HeroSection";
import ConferenceShiftSection from "@/components/home/ConferenceShiftSection";
import WhoCanApplySection from "@/components/home/WhoCanApplySection";
import WhyParticipateSection from "@/components/home/WhyParticipateSection";
import HowToApplySection from "@/components/home/HowToApplySection";
import AwardCategoriesSection from "@/components/home/AwardCategoriesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TermsSection from "@/components/home/TermsSection";
import CrowdSection from "@/components/home/CrowdSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans text-zinc-950 px-4 md:px-8 lg:px-12 pt-0 pb-0 flex flex-col gap-24 relative overflow-x-hidden">
      
      {/* Refactored Hero Section (includes top title, cards shuffle) */}
      <HeroSection />

      {/* 3D rotating inner-cylinder carousel section */}
      <ConferenceShiftSection />

      {/* Interactive checklist of who can apply for the awards */}
      <WhoCanApplySection />

      {/* Tilted cards deck showing key benefits of participating */}
      <WhyParticipateSection />

      {/* Step-by-step timeline of how to nominate/apply */}
      <HowToApplySection />

      {/* Award Categories Section (Horizontal banners with alternating click-reveal) */}
      <AwardCategoriesSection />

      {/* Testimonials Section (Interactive stacked deck / marquee) */}
      <TestimonialsSection />

      {/* Terms & Conditions Section */}
      <TermsSection />

      {/* Walking Crowd Animation */}
      <CrowdSection />

    </div>
  );
}
