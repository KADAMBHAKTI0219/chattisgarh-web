"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Lock body scroll during preloader
    document.body.style.overflow = "hidden";

    // Progress counter animation from 0% to 100% over 2.6 seconds
    const intervalTime = 30; // ms
    const totalSteps = 2600 / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(100, Math.round((currentStep / totalSteps) * 100));
      setProgress(nextProgress);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        // Start smooth fade out at 2.7s, complete by 3s
        setTimeout(() => {
          setIsFading(true);
        }, 100);

        setTimeout(() => {
          setIsDone(true);
          document.body.style.overflow = "";
        }, 700);
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "";
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#0D0B0A] text-white select-none transition-all duration-700 ease-in-out ${
        isFading ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Dynamic Background Glowing Spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(193,91,61,0.25)_0%,rgba(211,155,44,0.12)_45%,transparent_70%)] blur-3xl pointer-events-none animate-pulse" />
      
      {/* Subtle Bastar Tribal Radial Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(248,124,34,0.08)_0%,transparent_60%)] pointer-events-none" />

      {/* Main Content Box */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-lg w-full">
        
        {/* Animated Glowing Ring & Logo Container */}
        <div className="relative mb-6 flex items-center justify-center">
          
          {/* Rotating Spinner Ring */}
          <div className="absolute -inset-6 sm:-inset-8 rounded-full border-2 border-transparent border-t-[#C15B3D] border-r-[#D39B2C] animate-spin opacity-80" style={{ animationDuration: '3s' }} />
          <div className="absolute -inset-10 sm:-inset-12 rounded-full border border-transparent border-b-[#F87C22] border-l-[#C15B3D] animate-spin opacity-40" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />

          {/* Logo with Smooth Zoom-In CSS Animation */}
          <div className="relative w-[220px] xs:w-[260px] sm:w-[320px] h-[75px] xs:h-[90px] sm:h-[105px] transform transition-transform duration-1000 ease-out animate-preloaderZoom">
            <Image
              src="/assets/images/logoChattisgarh.png"
              alt="Government of Chhattisgarh Logo"
              fill
              priority
              sizes="(max-width: 640px) 260px, 320px"
              className="object-contain filter drop-shadow-[0_4px_24px_rgba(211,155,44,0.35)]"
            />
          </div>
        </div>

        {/* Title & State Tagline */}
        <div className="flex flex-col items-center space-y-1.5 mb-8">
          <span className="font-montserrat font-bold text-xs xs:text-sm sm:text-base tracking-wider uppercase bg-gradient-to-r from-[#F87C22] via-[#E2A438] to-[#C15B3D] bg-clip-text text-transparent">
            State Creator & Influencer Awards 2026
          </span>
          <span className="font-poppins font-semibold text-sm xs:text-base sm:text-lg text-amber-100/90 tracking-wide">
            छत्तीसगढ़ शासन • हर एक स्क्रीन पर छाएगा छत्तीसगढ़
          </span>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-2.5">
          <div className="w-full h-1.5 bg-zinc-900/90 rounded-full overflow-hidden border border-amber-900/30 p-[1px] shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#C15B3D] via-[#D39B2C] to-[#F87C22] rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(248,124,34,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between w-full text-[11px] sm:text-xs font-mono font-bold text-zinc-400 px-1">
            <span className="tracking-widest uppercase text-amber-500/80">Loading Portal...</span>
            <span className="text-amber-300 font-extrabold">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Embedded Custom Keyframe CSS for smooth zoom in */}
      <style jsx global>{`
        @keyframes preloaderZoom {
          0% {
            opacity: 0;
            transform: scale(0.65) translateY(12px);
          }
          60% {
            opacity: 1;
            transform: scale(1.08) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-preloaderZoom {
          animation: preloaderZoom 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
