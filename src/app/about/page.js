import AboutHero from "@/components/about/AboutHero";
import EmpowermentHistory from "@/components/about/EmpowermentHistory";
import VisionMissionSection from "@/components/about/VisionMissionSection";
import NarrativeSection from "@/components/about/NarrativeSection";
import ArchitectsTrustSection from "@/components/about/ArchitectsTrustSection";
import CulturalQuoteSection from "@/components/about/CulturalQuoteSection";
import BeyondTrophySection from "@/components/about/BeyondTrophySection";
import FutureCreatorsSection from "@/components/about/FutureCreatorsSection";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-12 flex flex-col gap-12 relative overflow-x-hidden animate-page-enter">
      
      {/* 1. About Hero Section */}
      <AboutHero />

      {/* 2. A History of Empowerment */}
      <EmpowermentHistory />

      {/* 3. Vision & Mission Section */}
      <VisionMissionSection />

      {/* 4. Driving the National Narrative */}
      <NarrativeSection />

      {/* 5. Digital Creators as Architects of Trust */}
      <ArchitectsTrustSection />

      {/* 6. Cultural Quote & Illustration */}
      <CulturalQuoteSection />

      {/* 7. Beyond the Trophy Section */}
      <BeyondTrophySection />

      {/* 8. A Future Built by Creators */}
      <FutureCreatorsSection />

    </div>
  );
}
