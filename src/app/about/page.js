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
    <div className="min-h-screen bg-[#FAF7F0] font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-12 flex flex-col gap-12 relative overflow-x-hidden">
      
      {/* 1. About Hero Section (Bento Gallery of local images about-1 to 6) */}
      <AboutHero />

      {/* 2. A History of Empowerment (Alternating rows about landmarks, festivals, women leadership) */}
      <EmpowermentHistory />

      {/* 3. Vision & Mission Section */}
      <VisionMissionSection />

      {/* 4. Driving the National Narrative (Landmarks & Rural spotlight) */}
      <NarrativeSection />

      {/* 5. Digital Creators as Architects of Trust (3 columns + Navy banner) */}
      <ArchitectsTrustSection />

      {/* 6. Cultural Quote & Illustration (Circular illustration and "अपनी आवाज, अपना छत्तीसगढ़" Quote card) */}
      <CulturalQuoteSection />

      {/* 7. Beyond the Trophy Section (4 columns of values) */}
      <BeyondTrophySection />

      {/* 8. A Future Built by Creators (CTA with social links) */}
      <FutureCreatorsSection />

    </div>
  );
}
