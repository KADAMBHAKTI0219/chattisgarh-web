"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

/**
 * Reusable Button component styled using global CSS theme colors (from globals.css),
 * with clsx & tailwind-merge (cn) support.
 *
 * @param {Object} props
 * @param {"gradient"|"participate"|"primary"|"secondary"|"outline"|"ghost"|"white"} [props.variant="gradient"] - Color variant
 * @param {"xs"|"sm"|"md"|"lg"|"xl"} [props.size="md"] - Button size
 * @param {React.ReactNode} [props.children] - Button label/content
 * @param {string} [props.href] - Link destination (renders Next.js Link)
 * @param {Function} [props.onClick] - Click handler
 * @param {boolean} [props.fullWidth=false] - Spans 100% width if true
 * @param {React.ReactNode} [props.icon] - Icon component
 * @param {"left"|"right"} [props.iconPosition="left"] - Icon placement
 * @param {boolean} [props.isLoading=false] - Show loading state
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {"button"|"submit"|"reset"} [props.type="button"] - HTML type
 * @param {string} [props.className=""] - Custom classes to merge with clsx
 */
export default function Button({
  variant = "gradient",
  size = "md",
  children,
  href,
  onClick,
  fullWidth = false,
  icon,
  iconPosition = "left",
  isLoading = false,
  disabled = false,
  type = "button",
  className = "",
  ...rest
}) {
  // Base button styles
  const baseStyles =
    "inline-flex items-center justify-center font-inter font-bold tracking-wide transition-all duration-300 select-none cursor-pointer focus:outline-none disabled:opacity-60 disabled:pointer-events-none active:scale-95";

  // Variant styles based on globals.css color variables (Primary: #c15b3d, Secondary: #2e5c31, Accent: #d39b2c)
  const variants = {
    gradient:
      "rounded-full bg-gradient-to-r from-[var(--primary)] via-[#c96646] to-[var(--accent)] hover:opacity-95 text-white shadow-[0_4px_16px_rgba(193,91,61,0.35)] hover:shadow-[0_6px_22px_rgba(193,91,61,0.5)] hover:-translate-y-0.5 active:translate-y-0",
    participate:
      "rounded-full bg-gradient-to-r from-[var(--primary)] via-[#c96646] to-[var(--accent)] hover:opacity-95 text-white shadow-[0_4px_16px_rgba(193,91,61,0.35)] hover:shadow-[0_6px_22px_rgba(193,91,61,0.5)] hover:-translate-y-0.5 active:translate-y-0",
    primary:
      "rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5",
    secondary:
      "rounded-full bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5",
    outline:
      "rounded-full border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white bg-transparent",
    ghost:
      "rounded-full bg-transparent hover:bg-[var(--surface-secondary)] text-[var(--foreground)]",
    white:
      "rounded-full bg-[var(--surface)] hover:bg-[var(--surface-secondary)] text-[var(--foreground)] border border-[var(--border)] shadow-sm hover:shadow",
  };

  // Size styles
  const sizes = {
    xs: "px-3 py-1 text-[11px] gap-1.5",
    sm: "px-4 py-1.5 text-xs sm:text-sm gap-2",
    md: "px-5 py-2.5 text-sm sm:text-base gap-2",
    lg: "px-6 sm:px-7 py-3 sm:py-3.5 text-base sm:text-lg gap-2.5",
    xl: "px-8 sm:px-10 py-4 text-lg sm:text-xl gap-3",
  };

  // Combine classes with cn (clsx + tailwind-merge)
  const combinedClasses = cn(
    baseStyles,
    variants[variant] || variants.gradient,
    sizes[size] || sizes.md,
    fullWidth && "w-full",
    className
  );

  const content = (
    <>
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 shrink-0 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>
      )}
      <span className="whitespace-nowrap">{children}</span>
      {!isLoading && icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClasses} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={combinedClasses}
      {...rest}
    >
      {content}
    </button>
  );
}

/**
 * Pre-styled shortcut CTA component for "Participate Now" using global theme colors
 */
export function ParticipateButton({ onClick, className, size = "md", children, ...props }) {
  return (
    <Button
      variant="gradient"
      size={size}
      onClick={onClick}
      className={cn("font-extrabold tracking-wide shadow-[0_6px_20px_rgba(193,91,61,0.4)]", className)}
      {...props}
    >
      {children || "Participate Now"}
    </Button>
  );
}
