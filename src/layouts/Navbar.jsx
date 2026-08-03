"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { openModal } = useParticipateModal();
  const { language, changeLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Monitor scroll offset efficiently with requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 20;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const NAV_LINKS = [
    { name: "About", href: "/about" },
    { name: "Categories", href: "/categories" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Top Bar for GIGW compliance and official attributions */}
      <div className="w-full bg-gradient-to-r from-[#1b3827] via-[#2E5C31] to-[#1b3827] text-white py-1.5 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 border-b border-white/10 text-[10px] sm:text-xs select-none relative z-50">
        <div className="mx-auto w-full max-w-[1480px] flex items-center justify-between">
          {/* Left: Indian Emblem & State Gov Name */}
          <div className="flex items-center gap-2 md:gap-3">
            <svg viewBox="0 0 36 24" className="h-3.5 sm:h-4.5 w-auto rounded-[2px] shadow-sm shrink-0 border border-white/20" aria-label="Indian National Flag">
              <rect width="36" height="8" fill="#FF9933" />
              <rect y="8" width="36" height="8" fill="#FFFFFF" />
              <rect y="16" width="36" height="8" fill="#138808" />
              <circle cx="18" cy="12" r="3.2" fill="none" stroke="#000080" strokeWidth="0.7" />
              <circle cx="18" cy="12" r="0.6" fill="#000080" />
            </svg>
            <span className="font-inter font-semibold uppercase tracking-wider text-zinc-100 text-[10px] sm:text-xs">
              {t("Government Of Chattisgarh")}
            </span>
          </div>

          {/* Right: Official Language Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-xs text-zinc-200 font-medium uppercase tracking-wider hidden sm:inline">
              Language:
            </span>
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-[#1f4233] border border-white/25 rounded-md px-2.5 py-0.5 text-white text-[10px] sm:text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer transition-colors"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="cg">छत्तीसगढ़ी</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Premium Navigation Bar */}
      <nav
        className={`w-full sticky top-0 z-50 transform-gpu transition-all duration-300 border-b border-[#E8DFCF]/70 ${isScrolled
          ? "h-[75px] bg-[#FFFDFC]/98 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          : "h-[90px] bg-[#FFFDFC]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          }`}
      >
        {/* Bastar Tribal Pattern Top Border Highlight Line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C15B3D]/40 to-transparent opacity-80 pointer-events-none" />

        <div className="mx-auto h-full w-full max-w-[1480px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between relative">

          {/* Left Side: Government Emblem Logo & Event Title */}
          <div className="flex items-center shrink-0 min-w-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-3.5 group relative py-1 min-w-0">

              {/* Subtle Warm Radial Glow Behind Logo */}
              <div className="absolute -inset-3 bg-[radial-gradient(circle_at_center,rgba(193,91,61,0.18)_0%,transparent_70%)] blur-lg pointer-events-none -z-10 opacity-75 group-hover:opacity-100 transition-opacity" />

              {/* Chhattisgarh State Emblem Logo */}
              <Image
                src="/assets/images/logoChattisgarh.png"
                alt="Government of Chhattisgarh Logo"
                width={260}
                height={75}
                priority
                className={`w-auto object-contain transition-all duration-300 shrink-0 ${isScrolled ? "h-20  scale-95" : "h-20  scale-100"
                  } group-hover:scale-[1.02]`}
              />

              {/* Title & Tagline Branding Block */}
              <div className="flex flex-col text-left justify-center border-l-2 border-[#C15B3D]/30 pl-2.5 sm:pl-3.5 max-w-[190px] min-[370px]:max-w-[220px] min-[410px]:max-w-[260px] sm:max-w-none">
                <span className="font-montserrat font-bold text-[10.5px] min-[370px]:text-[11.5px] min-[410px]:text-[12.5px] sm:text-sm md:text-[15px] lg:text-[16px] xl:text-[17px] leading-tight uppercase tracking-tight text-[#C15B3D] group-hover:text-[#9E3E23] transition-colors duration-300">
                  {t("Chhattisgarh Creator & Influencer Awards")}
                </span>
                <span className="font-montserrat font-bold text-[10px] min-[370px]:text-[10.5px] sm:text-xs md:text-[12.5px] leading-tight tracking-wide mt-0.5 inline-flex items-center gap-1 flex-wrap">
                  <span className="text-[#D96B27]">अपन माटी</span>
                  <span className="text-[#D96B27] text-[8px]">•</span>
                  <span className="text-[#1E56A0]">अपन मान</span>
                  <span className="text-[#2E5C31] text-[8px]">•</span>
                  <span className="text-[#2E5C31]">अपन भविष्य</span>
                </span>
              </div>
            </Link>
          </div>



          {/* Center Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 2xl:gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative group px-3.5 xl:px-4 py-2 rounded-full transition-all duration-300 font-poppins font-semibold text-[15px] xl:text-[18px] text-[#2E5C31] hover:text-[#C15B3D] tracking-normal hover:tracking-wider hover:bg-[#C15B3D]/5 flex items-center justify-center"
              >
                <span>{t(link.name)}</span>

                {/* Terracotta Underline Grows from Center */}
                <span className="absolute bottom-1 left-3.5 right-3.5 h-[2.5px] bg-[#C15B3D] rounded-full scale-x-0 origin-center transition-transform duration-300 ease-out group-hover:scale-x-100" />

                {/* Animated Small Tribal Diamond Motif Underneath on Hover */}
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[#C15B3D] text-[9px] opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-45 transition-all duration-300 pointer-events-none">
                  ◆
                </span>
              </Link>
            ))}
          </div>


          {/* Right Side: Primary CTA Button */}
          <div className="hidden lg:flex items-center shrink-0">
            <button
              onClick={openModal}
              className="relative group overflow-hidden rounded-full p-[1.5px] shadow-[0_4px_16px_rgba(193,91,61,0.3)] hover:shadow-[0_0_24px_rgba(193,91,61,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#C15B3D] via-[#D39B2C] to-[#C15B3D] bg-[length:200%_auto] group-hover:bg-right transition-all duration-500 rounded-full" />
              <span className="relative flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C15B3D] to-[#D39B2C] text-white font-poppins font-bold text-sm xl:text-base tracking-wide">
                <span>{t("Participate Now")}</span>
                <svg
                  className="w-4.5 h-4.5 stroke-white fill-none transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>

          {/* Mobile & Tablet Hamburger Controls */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E8DFCF] bg-[#FFFDFC] text-zinc-800 shadow-sm active:scale-95 transition-all cursor-pointer hover:border-[#C15B3D] hover:text-[#C15B3D]"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Bastar Tribal Pattern Bottom Border Accent */}
        <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#2E5C31]/25 to-transparent pointer-events-none" />
      </nav>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar Drawer */}
          <div className="fixed right-0 top-0 bottom-0 h-dvh w-[88vw] max-w-[360px] bg-[#FFFDFC] z-50 flex flex-col lg:hidden shadow-2xl transition-transform duration-300 border-l border-[#E8DFCF]">

            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#E8DFCF] bg-[#FFFDFC]/90">
              <div className="flex items-center gap-3">
                <Image
                  src="/assets/images/logoChattisgarh.png"
                  alt="Government of Chhattisgarh Logo"
                  width={180}
                  height={50}
                  className="h-9 w-auto object-contain shrink-0"
                />
                <div className="flex flex-col text-left border-l-2 border-[#C15B3D]/30 pl-2.5">
                  <span className="font-montserrat font-bold text-[10.5px] text-[#C15B3D] leading-tight uppercase tracking-tight">
                    Chhattisgarh Awards
                  </span>
                  <span className="font-montserrat font-bold text-[9px] min-[370px]:text-[10px] leading-tight mt-0.5 inline-flex items-center gap-0.5 flex-wrap">
                    <span className="text-[#D96B27]">अपन माटी</span>
                    <span className="text-[#D96B27] text-[7px]">•</span>
                    <span className="text-[#1E56A0]">अपन मान</span>
                    <span className="text-[#2E5C31] text-[7px]">•</span>
                    <span className="text-[#2E5C31]">अपन भविष्य</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="h-9 w-9 flex items-center justify-center rounded-xl border border-[#E8DFCF] bg-white text-zinc-700 shadow-sm active:scale-95 cursor-pointer hover:border-[#C15B3D] hover:text-[#C15B3D]"
                aria-label="Close Menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Links List */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-2 font-poppins font-semibold text-lg text-zinc-900">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="py-3 border-b border-[#E8DFCF]/60 text-[#2E5C31] hover:text-[#C15B3D] hover:pl-2 transition-all duration-300 flex items-center justify-between text-base group"
                >
                  <span>{t(link.name)}</span>
                  <span className="text-[#C15B3D] font-bold text-sm transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              ))}

              {/* Participate Now Mobile CTA Button */}
              <div className="pt-6">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    openModal();
                  }}
                  className="w-full relative group overflow-hidden rounded-full p-[1.5px] shadow-[0_4px_16px_rgba(193,91,61,0.3)] cursor-pointer"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#C15B3D] via-[#D39B2C] to-[#C15B3D] rounded-full" />
                  <span className="relative flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#C15B3D] to-[#D39B2C] text-white font-poppins font-bold text-base tracking-wide">
                    <span>{t("Participate Now")}</span>
                    <svg
                      className="w-5 h-5 stroke-white fill-none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* Drawer Footer with Language Selection */}
            <div className="p-6 border-t border-[#E8DFCF] bg-[#FFFDFC] flex flex-col gap-4">
              <div className="flex items-center justify-between bg-white border border-[#E8DFCF] px-4 py-3 rounded-2xl shadow-sm">
                <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Language</span>
                <select
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="rounded-lg border border-[#E8DFCF] bg-[#FFFDFC] px-3 py-1.5 text-zinc-800 text-xs font-bold focus:outline-none cursor-pointer focus:ring-1 focus:ring-[#C15B3D]"
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
    </>
  );
}