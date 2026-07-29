"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { openModal } = useParticipateModal();
  const { language, changeLanguage, t } = useLanguage();

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      
      {/* Top Bar for GIGW compliance and official attributions */}
      <div className="w-full bg-[#123E4A] text-white py-2.5 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 border-b border-zinc-250 text-[9px] sm:text-[10px] md:text-xs select-none">
        <div className="mx-auto w-full max-w-[1440px] flex items-center justify-between">
          {/* Left: Emblem and Gov Name */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* National Emblem simplified gold vector */}
            <svg viewBox="0 0 24 30" className="h-6 w-5 text-[#F87C22] shrink-0" fill="currentColor" aria-label={t("emblemAlt")}>
              <path d="M12 1a4 4 0 00-4 4c0 1.2.5 2.2 1.3 3A4.5 4.5 0 007 12v6h10v-6a4.5 4.5 0 00-2.3-4c.8-.8 1.3-1.8 1.3-3a4 4 0 00-4-4zm-4.7 19v2c0 2 1.6 3 3.7 3h2c2.1 0 3.7-1 3.7-3v-2H7.3zm4.7 6a2 2 0 100-4 2 2 0 000 4zm-8 4h16v2H4v-2z" />
            </svg>
            <span className="font-extrabold uppercase tracking-wider text-zinc-100">
              {t("Directorate of Culture & Tourism, Govt. of Chhattisgarh")}
            </span>
          </div>

          {/* Right: GIGW Accessibility Toolbar & Language Dropdown */}
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider hidden sm:inline">Select Language:</span>
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-[#0e2f38] border border-white/20 rounded-md px-2.5 py-1 text-white text-[10px] md:text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="cg">छत्तीसगढ़ी</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`w-full bg-[#FAF7F0] border-b border-zinc-200 sticky top-0 z-50 transition-all duration-300 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 ${
        isScrolled ? "shadow-md" : ""
      }`}>
        <div className="mx-auto w-full max-w-[1440px]">
          
          {/* Desktop Layout */}
          <div className={`hidden lg:grid grid-cols-3 items-center w-full transition-all duration-300 ${isScrolled ? "py-2" : "py-4"}`}>
            {/* Left Column: Logo */}
            <div className="flex justify-start items-center">
              <Link href="/" className="flex items-center py-1">
                <div className="relative lg:h-16 lg:w-16 xl:h-20 xl:w-20 2xl:h-22 2xl:w-22 overflow-hidden">
                  <Image
                    src="/assets/images/logoChattisgarh.png"
                    alt="State Awards Logo"
                    fill
                    priority
                    sizes="(max-width: 1024px) 120px, 160px"
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* Center Column: Navigation Links */}
            <div className="flex justify-center items-center gap-2.5 lg:gap-3 xl:gap-5 2xl:gap-6 text-zinc-900 font-bold tracking-wide lg:text-base xl:text-base 2xl:text-lg">
              <Link href="/about" className="hover:text-[#F082A2] transition-colors duration-200 shrink-0">
                {t("About Us")}
              </Link>
              <Link href="/#who-can-apply" className="hover:text-[#F082A2] transition-colors duration-200 shrink-0">
                {t("Eligibility")}
              </Link>
              <Link href="/#categories" className="hover:text-[#F082A2] transition-colors duration-200 shrink-0">
                {t("Categories")}
              </Link>
              <Link href="/#timeline" className="hover:text-[#F082A2] transition-colors duration-200 shrink-0">
                {t("Timeline")}
              </Link>
              <Link href="/#faq" className="hover:text-[#F082A2] transition-colors duration-200 shrink-0">
                {t("FAQ")}
              </Link>
              <Link href="/#contact" className="hover:text-[#F082A2] transition-colors duration-200 shrink-0">
                {t("Contact")}
              </Link>
            </div>

            {/* Right Column: Dynamic Dropdown Selector & CTA Button */}
            <div className="flex justify-end items-center gap-4">
        
              <button 
                onClick={openModal}
                className="rounded-full border border-black/10 bg-[#F3819F] hover:bg-[#e67593] lg:px-5 lg:py-2 lg:text-xs xl:px-6 xl:py-2.5 xl:text-sm 2xl:px-7 2xl:py-3 2xl:text-base font-black text-white shadow-sm transition-all cursor-pointer"
              >
                {t("Apply Now")}
              </button>
            </div>
          </div>

          {/* Mobile & Tablet Layout */}
          <div className={`flex lg:hidden justify-between items-center w-full transition-all duration-300 relative py-6`}>
            {/* Mobile/Tablet Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-zinc-200 bg-white p-2 text-black shadow-sm active:bg-zinc-50 transition-all cursor-pointer z-10"
              aria-label="Toggle Menu"
            >
              <svg
                className="h-5.5 w-5.5 sm:h-6.5 sm:w-6.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Center Logo for Mobile & Tablet (Absolute Centered) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-10">
              <Link href="/" className="relative h-20 w-20 sm:h-22 sm:w-22 md:h-24 md:w-24 overflow-hidden block">
                <Image
                  src="/assets/images/logoChattisgarh.png"
                  alt="State Awards Logo"
                  fill
                  priority
                  sizes="(max-width: 768px) 112px, 128px"
                  className="object-contain"
                />
              </Link>
            </div>

            {/* Mini CTA button & selector for Mobile & Tablet */}
            <div className="z-10 flex items-center gap-2">
            
              <button 
                onClick={openModal}
                className="rounded-full border border-black/10 bg-[#F3819F] px-4 py-3 sm:px-5 sm:py-4 text-[10px] sm:text-sm font-black text-white shadow-sm hover:bg-[#e67593] transition-all cursor-pointer"
              >
                {t("Apply Now")}
              </button>
            </div>
          </div>

          {/* Mobile & Tablet Drawer Menu */}
          {isOpen && (
            <>
              {/* Backdrop overlay */}
              <div 
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={() => setIsOpen(false)}
              />

              {/* Sidebar panel */}
              <div className="fixed left-0 top-0 bottom-0 h-screen w-[285px] sm:w-[320px] bg-[#FAF7F0] border-r border-zinc-250 z-50 p-6 flex flex-col justify-between lg:hidden shadow-lg animate-in slide-in-from-left duration-300 overflow-y-auto">
                
                {/* Top part: logo + close button */}
                <div className="flex justify-between items-center pb-4 border-b border-black/10">
                  <div className="relative h-12 w-12 overflow-hidden">
                    <Image
                      src="/assets/images/logoChattisgarh.png"
                      alt="State Awards Logo"
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="h-10 w-10 flex items-center justify-center border border-zinc-200 bg-white rounded-full shadow-sm cursor-pointer"
                    aria-label="Close Menu"
                  >
                    <svg
                      className="h-5.5 w-5.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-3 font-display font-black text-lg text-zinc-950 uppercase tracking-tight text-left mt-6 flex-1">
                  <Link
                    href="/about"
                    onClick={() => setIsOpen(false)}
                    className="rounded-none py-2 border-b border-black/5 hover:text-[#BE2079] transition-colors"
                  >
                    {t("About Us")}
                  </Link>
                  <Link
                    href="/#who-can-apply"
                    onClick={() => setIsOpen(false)}
                    className="rounded-none py-2 border-b border-black/5 hover:text-[#BE2079] transition-colors"
                  >
                    {t("Eligibility")}
                  </Link>
                  <Link
                    href="/#categories"
                    onClick={() => setIsOpen(false)}
                    className="rounded-none py-2 border-b border-black/5 hover:text-[#BE2079] transition-colors"
                  >
                    {t("Categories")}
                  </Link>
                  <Link
                    href="/#timeline"
                    onClick={() => setIsOpen(false)}
                    className="rounded-none py-2 border-b border-black/5 hover:text-[#BE2079] transition-colors"
                  >
                    {t("Timeline")}
                  </Link>
                  <Link
                    href="/#faq"
                    onClick={() => setIsOpen(false)}
                    className="rounded-none py-2 border-b border-black/5 hover:text-[#BE2079] transition-colors"
                  >
                    {t("FAQ")}
                  </Link>
                  <Link
                    href="/#contact"
                    onClick={() => setIsOpen(false)}
                    className="rounded-none py-2 border-b border-black/5 hover:text-[#BE2079] transition-colors"
                  >
                    {t("Contact")}
                  </Link>
                </div>

                {/* Bottom: Language switch options & Apply CTA */}
                <div className="pt-6 border-t border-black/10 mt-auto flex flex-col gap-4">
                  <div className="flex justify-between items-center bg-white border border-zinc-200 p-2 rounded-xl">
                    <span className="font-sans font-bold text-xs text-zinc-500 uppercase">Language</span>
                    <select
                      value={language}
                      onChange={(e) => changeLanguage(e.target.value)}
                      className="rounded border border-zinc-200 bg-white px-2.5 py-1 text-zinc-800 text-xs font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="en">English</option>
                      <option value="hi">हिन्दी</option>
                      <option value="cg">छत्तीसगढ़ी</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => {
                      setIsOpen(false);
                      openModal();
                    }}
                    className="w-full text-center py-3.5 bg-[#F3819F] text-white font-black uppercase text-white text-sm border border-black/10 rounded-full shadow-sm hover:bg-[#e67593] transition-all cursor-pointer"
                  >
                    {t("Apply Now")}
                  </button>
                </div>

              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
