"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

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
      {
        threshold: 0.15,
      }
    );


    if (containerRef.current) {
      observer.observe(containerRef.current);
    }


    return () => observer.disconnect();

  }, [animate]);



  const Tag =
    typeof level === "number"
      ? `h${Math.min(Math.max(level, 1), 6)}`
      : level;


  const headingTitle = title || children;



  const alignmentClasses = {
    center: "items-center text-center mx-auto",
    left: "items-start text-left",
    right: "items-end text-right ml-auto",
  }[align];



  const sizeClasses = {
    1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight",
    2: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-tight",
    3: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight",
    4: "text-lg sm:text-xl md:text-2xl font-semibold",
    5: "text-base sm:text-lg font-semibold",
    6: "text-sm sm:text-base font-medium",
  }[
    typeof level === "number"
      ? level
      : parseInt(String(Tag).replace("h", "")) || 2
  ];




  const themeColors = {
    default: {
      badge:
        "text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)]/20",

      title:
        "!text-[var(--heading)]",

      highlight:
        "text-[var(--primary)]",

      description:
        "text-[var(--text-secondary)]",

      line:
        "bg-[var(--primary)]",
    },

    dark: {
      badge:
        "text-amber-300 bg-amber-300/10 border-amber-300/20",

      title:
        "!text-white font-extrabold",

      highlight:
        "text-amber-300",

      description:
        "!text-zinc-200",

      line:
        "bg-[var(--primary)]",
    },

    light: {
      badge:
        "text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)]/20",

      title:
        "!text-[var(--heading)]",

      highlight:
        "text-[var(--primary)]",

      description:
        "text-[var(--text-secondary)]",

      line:
        "bg-[var(--primary)]",
    },


    primary: {
      badge:
        "text-white bg-white/20 border-white/30",

      title:
        "!text-white",

      highlight:
        "text-amber-200",

      description:
        "!text-white/90",

      line:
        "bg-white",
    },

  }[variant] || themeColors.default;





  return (

    <div

      ref={containerRef}

      className={cn(

        "relative flex flex-col gap-3 max-w-3xl xl:max-w-5xl px-4 transition-all duration-700 ease-out",

        animate && !isVisible
          ? "opacity-0 translate-y-8"
          : "opacity-100 translate-y-0",

        alignmentClasses,

        className

      )}

    >



      {/* ================= TOP TRIBAL DECORATION ================= */}


      {/* <div className="flex items-center justify-center gap-3 mb-3">


        <span
          className="
          h-[2px]
          w-14 sm:w-28
          bg-[var(--secondary)]
          origin-right
          animate-line-left
          "
        />



        <span
          className="
          relative
          h-7 w-7
          rotate-45
          border-2
          border-[var(--secondary)]
          animate-tribal-spin
          "
        >

          <span
            className="
            absolute
            inset-1
            bg-[var(--secondary)]
            animate-tribal-pulse
            "
          />

        </span>



        <span
          className="
          h-[2px]
          w-14 sm:w-28
          bg-[var(--secondary)]
          origin-left
          animate-line-right
          "
        />


      </div> */}





      {/* ================= BADGE ================= */}


      {badge && (

        <span

          className={cn(

            "font-inter font-bold text-xs xl:text-sm uppercase tracking-widest px-3.5 py-1 rounded-full border",

            themeColors.badge,

            badgeClassName

          )}

        >

          {badge}

        </span>

      )}






      {/* ================= HEADING ================= */}


      {headingTitle && (

        <Tag

          className={cn(

            "font-poppins",

            sizeClasses,

            themeColors.title,

            titleClassName

          )}

        >

          {headingTitle}


          {highlightText && (

            <span className={cn("ml-2", themeColors.highlight)}>

              {highlightText}

            </span>

          )}

        </Tag>

      )}




      {/* ================= DESCRIPTION ================= */}


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





      {/* ================= BOTTOM TRIBAL DIVIDER ================= */}


      {/* {showLine && (
        <div className="flex items-center justify-center gap-3 mb-3">


          <span
            className="
          h-[2px]
          w-14 sm:w-28
          bg-[var(--secondary)]
          origin-right
          animate-line-left
          "
          />



          <span
            className="
          relative
          h-7 w-7
          rotate-45
          border-2
          border-[var(--secondary)]
          animate-tribal-spin
          "
          >

            <span
              className="
            absolute
            inset-1
            bg-[var(--secondary)]
            animate-tribal-pulse
            "
            />

          </span>



          <span
            className="
          h-[2px]
          w-14 sm:w-28
          bg-[var(--secondary)]
          origin-left
          animate-line-right
          "
          />


        </div>

      )} */}










    </div>

  );

}



export { Heading as Headings };