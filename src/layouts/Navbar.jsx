"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParticipateModal } from "@/context/ParticipateModalContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { openModal } = useParticipateModal();

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
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
      (isScrolled || isOpen)
        ? "border-b-2 border-black bg-gradient-to-r from-[#FAF7F0]/95 via-[#FCF9F2]/95 to-[#FAF7F0]/95 backdrop-blur-md shadow-sm" 
        : "border-b border-black/5 bg-[#FAF7F0]/20 backdrop-blur-md"
    } px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20`}>
      {/* Maximum width container to prevent layout from stretching too wide on ultra-wide monitors */}
      <div className="mx-auto w-full max-w-[1440px]">
        
        {/* Desktop Layout (Visible from lg / 1024px upwards) */}
        <div className="hidden lg:grid grid-cols-3 items-center w-full py-4 lg:py-4">
          {/* Left Column: Logo */}
          <div className="flex justify-start items-center">
            <Link href="/" className="flex items-center py-1">
              <div className="relative lg:h-16 lg:w-16 xl:h-20 xl:w-20 2xl:h-22 2xl:w-22 overflow-hidden">
                <Image
                  src="/assets/images/logoChattisgarh.png"
                  alt="Chhattisgarh Web Logo"
                  fill
                  priority
                  sizes="(max-width: 1024px) 120px, 160px"
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Center Column: Navigation Links */}
          <div className="flex justify-center items-center gap-4 xl:gap-6 2xl:gap-8 text-zinc-900 font-semibold tracking-wide lg:text-base xl:text-lg ">
            <Link href="/" className="hover:text-[#F082A2] transition-colors duration-200 shrink-0">
              Home
            </Link>
            <Link href="/#awards" className="hover:text-[#F082A2] transition-colors duration-200 shrink-0">
              Awards
            </Link>
            <Link href="/#categories" className="hover:text-[#F082A2] transition-colors duration-200 shrink-0">
              Categories
            </Link>
            <Link href="/about" className="hover:text-[#F082A2] transition-colors duration-200 shrink-0">
              About Us
            </Link>
          </div>

          {/* Right Column: CTA Button */}
          <div className="flex justify-end items-center">
            <button 
              onClick={openModal}
              className="rounded-none border-2 border-black bg-[#F3819F] lg:px-4 lg:py-1.5 lg:text-xs xl:px-5 xl:py-2 xl:text-sm 2xl:px-6 2xl:py-2.5 2xl:text-base font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
            >
              Participate Now
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Layout (Visible below lg / 1024px) */}
        <div className="flex lg:hidden justify-between items-center w-full py-3 sm:py-3.5 relative">
          {/* Mobile/Tablet Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-none border-2 border-black bg-white p-2 text-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer z-10"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
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
            )}
          </button>

          {/* Center Logo for Mobile & Tablet (Absolute Centered) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-10">
            <Link href="/" className="relative h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18 overflow-hidden block">
              <Image
                src="/assets/images/logoChattisgarh.png"
                alt="Chhattisgarh Web Logo"
                fill
                priority
                sizes="(max-width: 768px) 112px, 128px"
                className="object-contain"
              />
            </Link>
          </div>

          {/* Mini CTA button for Mobile & Tablet (Enlarged Participate button) */}
          <div className="z-10">
            <button 
              onClick={openModal}
              className="rounded-none border-2 border-black bg-[#F3819F] px-6 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm md:text-base font-black text-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1.5px] hover:translate-y-[1.5px] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all cursor-pointer"
            >
              Participate
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Drawer Menu (Full width block) */}
        {isOpen && (
          <div className="fixed left-0 right-0 bottom-0 top-[80px] sm:top-[88px] flex flex-col gap-6 border-t-2 border-black bg-white p-6 lg:hidden animate-in slide-in-from-top duration-300 z-50 overflow-y-auto">
            <div className="flex flex-col gap-3 font-semibold text-zinc-950 text-sm sm:text-base">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="rounded-none px-3 py-2.5 hover:bg-[#F3819F]/10 hover:text-[#BE2079] transition-all duration-200"
              >
                Home
              </Link>
              <Link
                href="/#awards"
                onClick={() => setIsOpen(false)}
                className="rounded-none px-3 py-2.5 hover:bg-[#F3819F]/10 hover:text-[#BE2079] transition-all duration-200"
              >
                Awards
              </Link>
              <Link
                href="/#categories"
                onClick={() => setIsOpen(false)}
                className="rounded-none px-3 py-2.5 hover:bg-[#F3819F]/10 hover:text-[#BE2079] transition-all duration-200"
              >
                Categories
              </Link>
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="rounded-none px-3 py-2.5 hover:bg-[#F3819F]/10 hover:text-[#BE2079] transition-all duration-200"
              >
                About Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
