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
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? "fixed top-0 left-0 bg-[#FAF7F0] border-b-2 border-black shadow-md animate-[slideDown_0.2s_ease-in-out]" 
        : "relative bg-[#FAF7F0] border-b-2 border-black"
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
        <div className="flex lg:hidden justify-between items-center w-full py-6 sm:py-8 relative">
          {/* Mobile/Tablet Menu Button (Stays as a hamburger icon, since the sidebar slides from the left and overlays it) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-none border-2 border-black bg-white p-2 text-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer z-10"
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
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-10 ">
            <Link href="/" className="relative h-20 w-20 sm:h-22 sm:w-22 md:h-24 md:w-24 overflow-hidden block">
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

        {/* Mobile & Tablet Drawer Menu (Left-sliding Sidebar overlay of height 100vh, z-50) */}
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <div 
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar panel (Slides in from the Left, overlapping the navbar's menu button) */}
            <div className="fixed left-0 top-0 bottom-0 h-screen w-[285px] sm:w-[320px] bg-[#FAF7F0] border-r-2 border-black z-50 p-6 flex flex-col justify-between lg:hidden shadow-[4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-left duration-300 overflow-y-auto">
              
              {/* Top part: logo + close button */}
              <div className="flex justify-between items-center pb-4 border-b border-black/10">
                <div className="relative h-12 w-12 overflow-hidden">
                  <Image
                    src="/assets/images/logoChattisgarh.png"
                    alt="Chhattisgarh Web Logo"
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-10 w-10 flex items-center justify-center border-2 border-black bg-white rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
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
              <div className="flex flex-col gap-4 font-display font-black text-xl text-zinc-950 uppercase tracking-tight text-left mt-6 flex-1">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="rounded-none py-2.5 border-b border-black/5 hover:text-[#BE2079] transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/#awards"
                  onClick={() => setIsOpen(false)}
                  className="rounded-none py-2.5 border-b border-black/5 hover:text-[#BE2079] transition-colors"
                >
                  Awards
                </Link>
                <Link
                  href="/#categories"
                  onClick={() => setIsOpen(false)}
                  className="rounded-none py-2.5 border-b border-black/5 hover:text-[#BE2079] transition-colors"
                >
                  Categories
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className="rounded-none py-2.5 border-b border-black/5 hover:text-[#BE2079] transition-colors"
                >
                  About Us
                </Link>
              </div>

              {/* Bottom: Participate CTA button */}
              <div className="pt-6 border-t border-black/10 mt-auto">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    openModal();
                  }}
                  className="w-full text-center py-3.5 bg-[#F3819F] text-black font-black uppercase text-sm border-2 border-black rounded-none shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1.5px] hover:translate-y-[1.5px] active:translate-x-[2.5px] active:translate-y-[2.5px] transition-all cursor-pointer"
                >
                  Participate Now
                </button>
              </div>

            </div>
          </>
        )}
      </div>
    </nav>
  );
}
