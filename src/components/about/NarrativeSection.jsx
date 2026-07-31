"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function NarrativeSection() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 xl:gap-16 py-12 px-4 md:px-8 relative z-10 select-none transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
    >

      {/* Left Column: Image with border */}
      <div className="flex-1 w-full relative">
        <div className="relative w-full h-[240px] sm:h-[320px] md:h-[360px] xl:h-[380px] rounded-3xl overflow-hidden border border-border bg-surface shadow-sm">
          <Image
            src="/assets/images/about-4.webp"
            alt="Raipur city hub"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
      {/* Right Column: Narrative content */}
      <div className="flex-1 flex flex-col gap-4 text-left max-w-xl">
        <span className="font-sans font-bold text-xs uppercase tracking-widest text-primary">
          The Creator Manifesto
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold uppercase text-foreground tracking-tight leading-tight">
          Create with Purpose. Inspire with Passion.{" "}
          <span className="text-primary">Represent Chhattisgarh with Pride.</span>
        </h2>
        <p className="text-text-secondary font-semibold text-sm sm:text-base leading-relaxed mt-2">
          Every creator has the power to shape perceptions, preserve heritage, and inspire change. Every story told, every frame captured, every reel created, and every voice shared has the potential to introduce the true spirit of Chhattisgarh to the world.
        </p>
        <p className="text-text-secondary font-semibold text-sm sm:text-base leading-relaxed">
          Whether you celebrate our culture, document our traditions, explore our landscapes, promote our local cuisine, empower communities, or inspire through innovation—your creativity becomes a powerful ambassador for the state.
        </p>

        {/* In Focus box */}
        <div className="border border-border bg-surface-secondary p-5 sm:p-6 rounded-2xl shadow-sm text-foreground flex flex-col gap-2 mt-2">
          <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-accent">
            In Focus
          </span>
          <h4 className="font-heading font-bold text-base sm:text-lg uppercase text-foreground leading-snug">
            More Than an Award, a Digital Legacy
          </h4>
          <p className="text-text-secondary text-xs sm:text-sm font-semibold leading-relaxed">
            This is more than an award. It is a celebration of creators who proudly carry the identity of Chhattisgarh into the digital future.
          </p>
        </div>
      </div>

    </div>
  );
}