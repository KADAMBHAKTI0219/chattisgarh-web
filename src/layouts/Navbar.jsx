"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { useLanguage } from "@/context/LanguageContext";
import { ParticipateButton } from "@/components/common/Button";

export default function Navbar() {
  const { openModal } = useParticipateModal();
  const { language, changeLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Monitor scroll offset to trigger sticky glassmorphism styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      {/* Top Bar for GIGW compliance and official attributions */}
      <div className="w-full bg-gradient-to-r from-[#1e3e2b] via-[#2E5C31] to-[#1e3b2e] text-white py-2 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 border-b border-white/10 text-[10px] sm:text-xs select-none">
        <div className="mx-auto w-full max-w-[1440px] flex items-center justify-between">
          {/* Left: Emblem and Gov Name */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Indian Flag SVG Icon */}
            <svg viewBox="0 0 36 24" className="h-4 sm:h-5 w-auto rounded-[2px] shadow-sm shrink-0 border border-white/20" aria-label="Indian National Flag">
              <rect width="36" height="8" fill="#FF9933" />
              <rect y="8" width="36" height="8" fill="#FFFFFF" />
              <rect y="16" width="36" height="8" fill="#138808" />
              {/* Ashoka Chakra Wheel */}
              <circle cx="18" cy="12" r="3.2" fill="none" stroke="#000080" strokeWidth="0.7" />
              <circle cx="18" cy="12" r="0.6" fill="#000080" />
            </svg>
            <span className="font-semibold uppercase tracking-wider text-zinc-100 text-[9px] sm:text-xs">
              {t("Government Of Chattisgarh")}
            </span>
          </div>

          {/* Right: Language Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-xs text-zinc-200 font-medium uppercase tracking-wider hidden sm:inline">Language:</span>
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-[#1f4233] border border-white/20 rounded-md px-2.5 py-1 text-white text-[10px] sm:text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="cg">छत्तीसगढ़ी</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`w-full bg-[#FAF7F0] border-b border-zinc-200/80 sticky top-0 z-50 transition-all duration-300 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 ${isScrolled ? "shadow-md bg-[#FAF7F0]/95 backdrop-blur-md py-2" : "py-3"
        }`}>
        <div className="mx-auto w-full max-w-[1440px] flex items-center justify-between">

          {/* Left Side: Logo & Branding Text */}
          <div className="flex items-center shrink-0 max-w-[70%] sm:max-w-none">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group py-0.5">
              <Image
                src="/assets/images/chattisgarh-logo.webp"
                alt="Chhattisgarh State Creator & Influencer Awards"
                width={240}
                height={70}
                priority
                className="h-9 sm:h-11 md:h-13 lg:h-15 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02] shrink-0"
              />
              <div className="flex flex-col text-left justify-center border-l border-zinc-300/80 pl-2.5 sm:pl-3">
                <span className="font-poppins font-extrabold text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg leading-tight uppercase tracking-tight  text-[var(--secondary)]  duration-300">
                  Chhattisgarh Creator & Influencer Awards
                </span>
                <span className="font-poppins font-bold text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-[var(--secondary)] leading-tight tracking-wide group-hover:text-[var(--primary)] transition-colors duration-300">
                  छत्तीसगढ़ सबले बढ़िया
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Right Side: Navigation Links & CTA Button */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <div className="flex items-center gap-1 xl:gap-2">
              <Link
                href="/"
                className="font-inter font-bold text-sm xl:text-base text-zinc-800 hover:text-[var(--primary)] transition-colors duration-300 relative group px-3.5 py-1.5 rounded-full hover:bg-[var(--primary)]/5"
              >
                <span>{t("Home")}</span>
                <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--secondary)] scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 rounded-full" />
              </Link>

              <Link
                href="/about"
                className="font-inter font-bold text-sm xl:text-base text-zinc-800 hover:text-[var(--primary)] transition-colors duration-300 relative group px-3.5 py-1.5 rounded-full hover:bg-[var(--primary)]/5"
              >
                <span>{t("About Us")}</span>
                <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--secondary)] scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 rounded-full" />
              </Link>

              <Link
                href="/categories"
                className="font-inter font-bold text-sm xl:text-base text-zinc-800 hover:text-[var(--primary)] transition-colors duration-300 relative group px-3.5 py-1.5 rounded-full hover:bg-[var(--primary)]/5"
              >
                <span>{t("Categories")}</span>
                <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--secondary)] scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 rounded-full" />
              </Link>

              <Link
                href="/#contact"
                className="font-inter font-bold text-sm xl:text-base text-zinc-800 hover:text-[var(--primary)] transition-colors duration-300 relative group px-3.5 py-1.5 rounded-full hover:bg-[var(--primary)]/5"
              >
                <span>{t("Contact")}</span>
                <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--secondary)] scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 rounded-full" />
              </Link>
            </div>

            {/* Participate Now Button */}
            <ParticipateButton onClick={openModal} size="md">
              {t("Participate Now")}
            </ParticipateButton>
          </div>

          {/* Mobile & Tablet Controls (Hamburger Menu Toggle) */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-300/80 bg-white p-2 text-zinc-800 shadow-sm active:scale-95 transition-all cursor-pointer hover:border-[var(--primary)] hover:text-[var(--primary)]"
              aria-label="Toggle Navigation Menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>

        {/* Mobile & Tablet Drawer Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar drawer */}
            <div className="fixed right-0 top-0 bottom-0 h-dvh w-[85vw] max-w-[340px] bg-[#FAF7F0] z-50 flex flex-col lg:hidden shadow-2xl transition-transform duration-300 animate-in slide-in-from-right">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-zinc-200 bg-white/50 gap-2">
                <div className="flex items-center gap-2 max-w-[80%]">
                  <Image
                    src="/assets/images/chattisgarh-logo.webp"
                    alt="Chhattisgarh Logo"
                    width={160}
                    height={50}
                    className="h-8 w-auto object-contain shrink-0"
                  />
                  <div className="flex flex-col text-left border-l border-zinc-300 pl-2">
                    <span className="font-poppins font-extrabold text-[9px] text-[var(--primary)] leading-tight uppercase tracking-tight">
                      Chhattisgarh Creator & Influencer Awards
                    </span>
                    <span className="font-poppins font-bold text-[8px] text-[var(--primary)] leading-tight">
                      छत्तीसगढ़ सबले बढ़िया
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-9 w-9 flex items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 shadow-sm active:scale-95 cursor-pointer hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  aria-label="Close Menu"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3 font-semibold text-lg text-zinc-900">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="py-3 border-b border-zinc-200/80 text-zinc-900 hover:text-[var(--primary)] hover:pl-2 transition-all duration-300 flex items-center justify-between font-inter font-bold text-base group"
                >
                  <span>{t("Home")}</span>
                  <span className="text-[var(--primary)] font-bold text-sm transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className="py-3 border-b border-zinc-200/80 text-zinc-900 hover:text-[var(--primary)] hover:pl-2 transition-all duration-300 flex items-center justify-between font-inter font-bold text-base group"
                >
                  <span>{t("About Us")}</span>
                  <span className="text-[var(--primary)] font-bold text-sm transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/categories"
                  onClick={() => setIsOpen(false)}
                  className="py-3 border-b border-zinc-200/80 text-zinc-900 hover:text-[var(--primary)] hover:pl-2 transition-all duration-300 flex items-center justify-between font-inter font-bold text-base group"
                >
                  <span>{t("Categories")}</span>
                  <span className="text-[var(--primary)] font-bold text-sm transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/#contact"
                  onClick={() => setIsOpen(false)}
                  className="py-3 border-b border-zinc-200/80 text-zinc-900 hover:text-[var(--primary)] hover:pl-2 transition-all duration-300 flex items-center justify-between font-inter font-bold text-base group"
                >
                  <span>{t("Contact")}</span>
                  <span className="text-[var(--primary)] font-bold text-sm transition-transform group-hover:translate-x-1">→</span>
                </Link>

                {/* Participate Now CTA Button inside Mobile Drawer */}
                <div className="pt-4">
                  <ParticipateButton
                    onClick={() => {
                      setIsOpen(false);
                      openModal();
                    }}
                    fullWidth
                    size="lg"
                    className="w-full justify-center text-sm font-bold shadow-md"
                  >
                    {t("Participate Now")}
                  </ParticipateButton>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-zinc-200 bg-white/40 flex flex-col gap-4">
                <div className="flex items-center justify-between bg-white border border-zinc-200 px-3.5 py-2.5 rounded-xl">
                  <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Language</span>
                  <select
                    value={language}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="rounded border border-zinc-200 bg-white px-2.5 py-1 text-zinc-800 text-xs font-bold focus:outline-none cursor-pointer focus:ring-1 focus:ring-[var(--primary)]"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                    <option value="cg">छत्तीसगढ़ी</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  );
}