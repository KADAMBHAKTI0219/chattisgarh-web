"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function VisionMissionSection() {
  const { t } = useLanguage();

  return (
    <section 
      id="vision-mission" 
      className="w-screen left-1/2 -translate-x-1/2 bg-[#080F1E] text-white py-16 sm:py-20 xl:py-24 px-6 sm:px-10 md:px-16 lg:px-20 border-y border-zinc-700 select-none relative overflow-hidden z-10 my-6"
    >
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto flex flex-col gap-12 items-center">
        
        {/* Section Header */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold uppercase text-white text-center tracking-tight leading-none">
          {t("Vision & Mission")}
        </h2>
        
        {/* 2 Column Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 w-full mt-4">
          
          {/* Card 1: Our Vision */}
          <div className="bg-[#121A2E] border border-zinc-700 rounded-2xl p-8 xl:p-12 shadow-sm hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-6 text-left relative overflow-hidden">
            
            {/* Corner ambient glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header row with eye icon */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 xl:h-14 xl:w-14 items-center justify-center rounded-xl border border-zinc-700 bg-amber-500/10 text-[#F8D053] shrink-0">
                <svg 
                  className="w-6 h-6 xl:w-7 xl:h-7 stroke-current stroke-2 fill-none" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl xl:text-2xl uppercase tracking-wider text-white">
                {t("Our Vision")}
              </h3>
            </div>

            {/* Bold highlight text */}
            <p className="text-zinc-100 font-extrabold text-base sm:text-lg xl:text-xl leading-relaxed">
              {t("Empowered youth power a thriving state creator economy, and that economy fuels India's larger digital landscape with unmistakably Chhattisgarhi voices.")}
            </p>

            {/* Descriptive paragraph */}
            <p className="text-zinc-400 font-semibold text-sm sm:text-base xl:text-lg leading-relaxed mt-2">
              {t("We envision a Chhattisgarh where creators don't have to leave home to be heard nationally, where tribal heritage and local culture are celebrated with dignity, and where digital influence is recognized as a powerful force for culture, tourism, innovation, and public service. We are no longer a state asking to be noticed—we are a state that is impossible to scroll past.")}
            </p>
          </div>

          {/* Card 2: Our Mission */}
          <div className="bg-[#121A2E] border border-zinc-700 rounded-2xl p-8 xl:p-12 shadow-sm hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-6 text-left relative overflow-hidden">
            
            {/* Corner ambient glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header row with rocket icon */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 xl:h-14 xl:w-14 items-center justify-center rounded-xl border border-zinc-700 bg-pink-500/10 text-[#F3819F] shrink-0">
                <svg 
                  className="w-6 h-6 xl:w-7 xl:h-7 stroke-current stroke-2 fill-none" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl xl:text-2xl uppercase tracking-wider text-white">
                {t("Our Mission")}
              </h3>
            </div>

            {/* Bold highlight text */}
            <p className="text-zinc-100 font-extrabold text-base sm:text-lg xl:text-xl leading-relaxed">
              {t("The Chhattisgarh State Creator & Influencer Awards exists to identify, recognize, and empower creators across the state by transforming individual talent into a celebrated creator ecosystem.")}
            </p>

            {/* Descriptive paragraph */}
            <p className="text-zinc-400 font-semibold text-sm sm:text-base xl:text-lg leading-relaxed mt-2">
              {t("Through our four core commitments—Spot, Amplify, Connect, and Empower—we provide visibility, mentorship, collaboration, and long-term institutional support, ensuring that creators become trusted storytellers who strengthen civic engagement, promote tourism, preserve culture, and contribute to the national digital narrative.")}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
