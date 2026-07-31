"use client";

import React from "react";
import { cn } from "@/utils/cn";

/**
 * Reusable Heading Component for section titles, page titles, and subheadings.
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
  className = "",
  titleClassName = "",
  badgeClassName = "",
  descriptionClassName = "",
  children,
}) {
  const Tag = typeof level === "number" ? `h${Math.min(Math.max(level, 1), 6)}` : level;
  const headingTitle = title || children;

  const alignmentClasses = {
    center: "items-center text-center mx-auto",
    left: "items-start text-left",
    right: "items-end text-right ml-auto",
  }[align] || "items-center text-center mx-auto";

  const sizeClasses = {
    1: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight",
    2: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-tight",
    3: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
    4: "text-xl sm:text-2xl md:text-3xl font-semibold",
    5: "text-lg sm:text-xl font-semibold",
    6: "text-base sm:text-lg font-medium",
  }[typeof level === "number" ? level : parseInt(String(Tag).replace("h", "")) || 2] || "text-3xl sm:text-4xl md:text-5xl font-bold";

  const themeColors = {
    default: {
      badge: "text-primary bg-primary/10 border-primary/20",
      title: "text-foreground",
      highlight: "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent",
      description: "text-text-secondary",
      line: "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]",
    },
    dark: {
      badge: "text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/20",
      title: "text-white",
      highlight: "bg-gradient-to-r from-amber-300 via-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent",
      description: "text-zinc-300",
      line: "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]",
    },
    light: {
      badge: "text-primary bg-primary/10 border-primary/20",
      title: "text-zinc-900",
      highlight: "text-primary",
      description: "text-zinc-600",
      line: "bg-primary",
    },
    primary: {
      badge: "text-white bg-white/20 border-white/30",
      title: "text-white",
      highlight: "text-amber-200",
      description: "text-white/90",
      line: "bg-white",
    },
  }[variant] || themeColors.default;

  return (
    <div className={cn("flex flex-col gap-2.5 max-w-3xl xl:max-w-5xl px-4", alignmentClasses, className)}>
      {/* Optional Badge / Eyebrow (Inter font) */}
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

      {/* Main Title (Poppins font) */}
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

      {/* Optional Sub-description (Inter font) */}
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

// Export named Headings alias as requested
export { Heading as Headings };
