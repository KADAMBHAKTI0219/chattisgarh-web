"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function CulturalQuoteSection() {
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
      className={`w-full max-w-7xl mx-auto py-12 px-4 md:px-8 relative z-10 select-none transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
    >
      <div className="relative w-full aspect-[2.5/1] sm:aspect-[2.8/1] md:aspect-[3/1] rounded-[32px] overflow-hidden border border-border shadow-sm hover:scale-[1.005] transition-transform duration-300 bg-foreground">
        <Image
          src="/assets/images/chhattisgarh-quote-banner.png"
          alt="अपनी आवाज, अपना छत्तीसगढ़, नया भारत"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
    </div>
  );
}