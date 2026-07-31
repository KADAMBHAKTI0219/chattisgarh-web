"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function VisionMissionSection() {
  const { t } = useLanguage();

  return (
    <section
      id="vision-mission"
      className="w-screen left-1/2 -translate-x-1/2 bg-foreground text-background py-16 sm:py-20 xl:py-24 px-6 sm:px-10 md:px-16 lg:px-20 border-y border-black/20 select-none relative overflow-hidden z-10 my-6"
    >
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto flex flex-col gap-12 items-center">

        {/* Section Header */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold uppercase text-background text-center tracking-tight leading-tight">
          {t("Vision & Mission")}
        </h2>

        {/* 2 Column Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 w-full mt-4">

          {/* Card 1: Our Vision */}
          <div className="bg-background/5 border border-background/15 rounded-2xl p-8 xl:p-12 shadow-sm hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-6 text-left relative overflow-hidden">

            {/* Corner ambient glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header row with eye icon */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 xl:h-14 xl:w-14 items-center justify-center rounded-xl border border-background/15 bg-accent/10 text-accent shrink-0">
                <svg
                  className="w-6 h-6 xl:w-7 xl:h-7 stroke-current stroke-2 fill-none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-xl xl:text-2xl uppercase tracking-wider text-background">
                {t("Our Vision")}
              </h3>
            </div>

            {/* Bold highlight text */}
            <p className="text-background font-extrabold text-base sm:text-lg xl:text-xl leading-relaxed">
              {t("Empowering Every Creator. Elevating Chhattisgarh. Inspiring the World.")}
            </p>

            {/* Descriptive paragraph */}
            <p className="text-background/70 font-semibold text-sm sm:text-base xl:text-lg leading-relaxed mt-2">
              {t("We envision a Chhattisgarh where every creator—whether a filmmaker, vlogger, photographer, musician, artist, gamer, educator, storyteller, or influencer—has the opportunity to transform creativity into meaningful impact. We believe the next generation of creators is not just shaping social media—they are shaping the identity of the state.")}
            </p>
            <p className="text-background font-extrabold text-sm sm:text-base xl:text-lg leading-relaxed">
              {t("Our vision is simple: to make Chhattisgarh one of India's most celebrated creator destinations, where local stories become global inspiration.")}
            </p>
          </div>

          {/* Card 2: Our Mission */}
          <div className="bg-background/5 border border-background/15 rounded-2xl p-8 xl:p-12 shadow-sm hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-6 text-left relative overflow-hidden">

            {/* Corner ambient glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header row with rocket icon */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 xl:h-14 xl:w-14 items-center justify-center rounded-xl border border-background/15 bg-primary/10 text-primary shrink-0">
                <svg
                  className="w-6 h-6 xl:w-7 xl:h-7 stroke-current stroke-2 fill-none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-xl xl:text-2xl uppercase tracking-wider text-background">
                {t("Our Mission")}
              </h3>
            </div>

            {/* Bold highlight text */}
            <p className="text-background font-extrabold text-base sm:text-lg xl:text-xl leading-relaxed">
              {t("Recognising Creators. Celebrating Stories. Building a Digital Legacy.")}
            </p>

            {/* Descriptive paragraph */}
            <p className="text-background/70 font-semibold text-sm sm:text-base xl:text-lg leading-relaxed mt-2">
              {t("The Chhattisgarh Creator & Influencer Awards is more than an award platform—it is a commitment by the Government of Chhattisgarh to discover, encourage, and celebrate creators who are making a meaningful impact through authentic storytelling, showcasing the state's culture, tourism, folk traditions, entrepreneurship, innovation, cuisine, art, music, wildlife, education, and community stories.")}
            </p>
            <p className="text-background font-extrabold text-sm sm:text-base xl:text-lg leading-relaxed">
              {t("Every story shared has the power to inspire. Every creator recognised strengthens the identity of Chhattisgarh. Every award celebrates a voice that deserves to be heard.")}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}