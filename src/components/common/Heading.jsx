"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

/**
 * Reusable Animated Heading Component for section titles, page titles, and subheadings.
 * Uses clsx & tailwind-merge (via cn) for class merging.
 *
 * @param {Object} props
 * @param {number|string} [props.level=2] - Heading level: 1, 2, 3, 4, 5, 6 or "h1", "h2", etc.
 * @param {React.ReactNode|string} [props.badge] - Small badge/eyebrow text above the title
 * @param {React.ReactNode|string} props.title - Main heading text or node
 * @param {React.ReactNode|string} [props.highlightText] - Text to highlight with gradient/accent color
 * @param {React.ReactNode|string} [props.description] - Sub-description paragraph under title (Inter font)
 * @param {"center"|"left"|"right"} [props.align="center"] - Text alignment
 * @param {boolean} [props.showLine=true] - Whether to render a decorative accent line
 * @param {"default"|"dark"|"light"|"primary"} [props.variant="default"] - Theme variant
 * @param {boolean} [props.animate=true] - Whether to apply smooth scroll reveal animation
 * @param {string} [props.className=""] - Outer container wrapper classes
 * @param {string} [props.titleClassName=""] - Custom classes for the title element
 * @param {string} [props.badgeClassName=""] - Custom classes for the badge element
 * @param {string} [props.descriptionClassName=""] - Custom classes for description paragraph
 */
export default function Heading({
  level = 2,
  badge,
  title,
  highlightText,
  description,
  align = "center",
  showLine = true,
  variant = "default",
  animate = true,
  className = "",
  titleClassName = "",
  badgeClassName = "",
  descriptionClassName = "",
  children,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!animate) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [animate]);

  const Tag = typeof level === "number" ? `h${Math.min(Math.max(level, 1), 6)}` : level;
  const headingTitle = title || children;

  const alignmentClasses = {
    center: "items-center text-center mx-auto",
    left: "items-start text-left",
    right: "items-end text-right ml-auto",
  }[align] || "items-center text-center mx-auto";

  const sizeClasses = {
    1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight",
    2: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-tight",
    3: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
    4: "text-xl sm:text-2xl md:text-3xl font-semibold",
    5: "text-lg sm:text-xl font-semibold",
    6: "text-base sm:text-lg font-medium",
  }[typeof level === "number" ? level : parseInt(String(Tag).replace("h", "")) || 2] || "text-3xl sm:text-4xl md:text-5xl font-bold";

  const themeColors = {
    default: {
      badge: "text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)]/20",
      title: "!text-zinc-900",
      highlight: "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent",
      description: "text-zinc-600",
      line: "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]",
    },
    dark: {
      badge: "text-amber-300 bg-amber-300/10 border-amber-300/20",
      title: "!text-white font-extrabold",
      highlight: "bg-gradient-to-r from-amber-300 via-[var(--primary)] to-amber-400 bg-clip-text text-transparent",
      description: "!text-zinc-200",
      line: "bg-gradient-to-r from-[var(--primary)] to-amber-400",
    },
    light: {
      badge: "text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)]/20",
      title: "!text-zinc-900",
      highlight: "text-[var(--primary)]",
      description: "text-zinc-600",
      line: "bg-[var(--primary)]",
    },
    primary: {
      badge: "text-white bg-white/20 border-white/30",
      title: "!text-white",
      highlight: "text-amber-200",
      description: "!text-white/90",
      line: "bg-white",
    },
  }[variant] || themeColors.default;

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col gap-2.5 max-w-3xl xl:max-w-5xl px-4 transition-all duration-700 ease-out transform",
        animate && !isVisible ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0",
        alignmentClasses,
        className
      )}
    >
      {/* Optional Badge / Eyebrow */}
      {badge && (
        <span
          className={cn(
            "inline-block font-inter font-bold text-xs xl:text-sm uppercase tracking-widest px-3.5 py-1 rounded-full border",
            themeColors.badge,
            badgeClassName
          )}
        >
          {badge}
        </span>
      )}

      {/* Main Title */}
      {headingTitle && (
        <Tag className={cn("font-poppins", sizeClasses, themeColors.title, titleClassName)}>
          {headingTitle}
          {highlightText && (
            <>
              {" "}
              <span className={themeColors.highlight}>{highlightText}</span>
            </>
          )}
        </Tag>
      )}

      {/* Optional Decorative Line */}
      {showLine && (
        <div
          className={cn("h-[4px] w-24 sm:w-32 rounded-full mt-1.5 transition-all duration-300", themeColors.line)}
        />
      )}

      {/* Optional Sub-description */}
      {description && (
        <p
          className={cn(
            "font-inter text-sm sm:text-base md:text-lg leading-relaxed mt-2",
            themeColors.description,
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

// Export named Headings alias
export { Heading as Headings };
