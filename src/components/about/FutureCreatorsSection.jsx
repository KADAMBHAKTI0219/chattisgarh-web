"use client";

import { useEffect, useRef, useState } from "react";
import Heading from "@/components/common/Heading";

export default function FutureCreatorsSection() {
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

  const socialLinks = [
    {
      title: "Twitter/X Support",
      handle: "@CGWebAwards",
      url: "https://x.com",
      icon: "🐦",
      bg: "bg-info/10"
    },
    {
      title: "Instagram Page",
      handle: "@cgwebawards",
      url: "https://instagram.com",
      icon: "📸",
      bg: "bg-primary/10"
    },
    {
      title: "YouTube Channel",
      handle: "Chhattisgarh Web Awards",
      url: "https://youtube.com",
      icon: "📺",
      bg: "bg-accent/10"
    }
  ];

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-7xl mx-auto flex flex-col gap-10 py-12 px-4 md:px-8 relative z-10 select-none transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
    >

      {/* Central block */}
      <div className="border border-border bg-surface p-8 sm:p-12 rounded-[32px] shadow-sm text-center flex flex-col items-center gap-4 relative overflow-hidden">
        <Heading
          badge="Join the Future"
          title="A FUTURE"
          highlightText="BUILT BY CREATORS"
          description="Be a part of Chhattisgarh's ultimate digital convergence. Whether you are an aspiring vlogger, a tech innovator, or a digital marketing leader, the stage is yours."
        />

        {/* Social channels flex-row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-6">
          {socialLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`border border-border rounded-2xl p-5 ${link.bg} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center flex flex-col items-center justify-center gap-2 group cursor-pointer`}
            >
              <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                {link.icon}
              </span>
              <h4 className="font-heading font-bold text-sm uppercase text-foreground">
                {link.title}
              </h4>
              <span className="font-sans font-bold text-xs text-text-muted hover:text-foreground transition-colors">
                {link.handle}
              </span>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}