import AboutHero from "@/components/about/AboutHero";
import NarrativeSection from "@/components/about/NarrativeSection";
import VisionMissionSection from "@/components/about/VisionMissionSection";
import CulturalQuoteSection from "@/components/about/CulturalQuoteSection";
import ArchitectsTrustSection from "@/components/about/ArchitectsTrustSection";

export const metadata = {
  title: "About Us | Chhattisgarh Creator & Influencer Awards",
  description:
    "Discover the mission, vision, and stories behind the official Chhattisgarh Creator & Influencer Awards initiative by the Government of Chhattisgarh.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] font-sans text-zinc-950 flex flex-col relative overflow-x-hidden animate-page-enter">

      {/* 1. About Hero Section */}
      <AboutHero />

      {/* Bastar Tribal Pattern Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

      {/* 2. Narrative Section (Editorial Storytelling) */}
      <NarrativeSection />

      {/* 3. Vision & Mission Section (Dark Green Background) */}
      <VisionMissionSection />

      {/* 4. Cultural Quote & Illustration (White Background) */}
      <CulturalQuoteSection />

      {/* 5. Architects of Trust / Why Creators Matter (Light Beige Background) */}
      <ArchitectsTrustSection />



    </div>
  );
}
