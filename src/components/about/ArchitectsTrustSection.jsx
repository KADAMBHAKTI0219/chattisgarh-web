"use client";

import { useEffect, useRef, useState } from "react";
import Heading from "@/components/common/Heading";

export default function ArchitectsTrustSection() {
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

  const cards = [
    {
      title: "Creative Autonomy",
      desc: "Empowering creators with absolute freedom of digital voice and expression to capture the genuine stories of Chhattisgarh.",
      icon: "🎨",
      color: "bg-primary/10 text-primary"
    },
    {
      title: "Policies for Progress",
      desc: "Backing digital growth with developer/creator friendly policy frameworks that foster innovation, jobs, and tourist traction.",
      icon: "📈",
      color: "bg-accent/10 text-accent"
    },
    {
      title: "Infrastructure & Service",
      desc: "Bridging the rural-urban gap with robust 5G networks, digital literacy tools, and creator studios across the state.",
      icon: "🌐",
      color: "bg-secondary/10 text-secondary"
    }
  ];

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-7xl mx-auto flex flex-col gap-10 py-12 px-4 md:px-8 relative z-10 select-none transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
    >
      {/* Title block */}
      <Heading
        badge="Ecosystem Trust"
        title="DIGITAL CREATORS AS"
        highlightText="ARCHITECTS OF TRUST"
        description="Building a robust and transparent creative ecosystem"
      />

      {/* 3 Columns Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="border border-border bg-surface rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-left flex flex-col gap-3 group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${card.color} group-hover:scale-110 transition-transform duration-300`}>
              {card.icon}
            </div>
            <h3 className="font-heading font-bold text-lg sm:text-xl uppercase text-foreground">
              {card.title}
            </h3>
            <p className="text-text-secondary font-semibold text-xs sm:text-sm leading-relaxed">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Dark quote block at bottom */}
      <div className="bg-foreground p-6 sm:p-8 rounded-3xl shadow-sm text-center text-background flex flex-col justify-center items-center gap-2 mt-4 relative overflow-hidden">
        <div className="absolute top-2 right-2 opacity-10 text-4xl">✨</div>
        <p className="font-heading font-bold text-sm sm:text-base md:text-lg uppercase text-accent tracking-wider max-w-3xl leading-relaxed">
          &ldquo;To create a robust, transparent digital ecosystem where local heritage is celebrated, and every creator finds a platform to grow.&rdquo;
        </p>
      </div>

    </div>
  );
}