"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParticipateModal } from "@/context/ParticipateModalContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-black bg-[#F9F6EE] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
      {/* Maximum width container to prevent layout from stretching too wide on ultra-wide monitors */}
      <div className="mx-auto w-full max-w-[1440px]">
        
        {/* Desktop Layout (Visible from lg / 1024px upwards) */}
        <div className="hidden lg:grid grid-cols-3 items-center w-full py-4 lg:py-4">
          {/* Left Column: Logo */}
          <div className="flex justify-start items-center">
            <Link href="/" className="flex items-center">
              <div className="relative lg:h-16 lg:w-32 xl:h-18 xl:w-36 2xl:h-18 2xl:w-40 overflow-hidden">
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
              className="rounded-full border-2 border-black bg-[#F3819F] lg:px-4 lg:py-1.5 lg:text-xs xl:px-5 xl:py-2 xl:text-sm 2xl:px-6 2xl:py-2.5 2xl:text-base font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
            >
              Participate Now
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Layout (Visible below lg / 1024px) */}
        <div className="flex lg:hidden justify-between items-center w-full py-5">
          {/* Mobile/Tablet Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border-2 border-black bg-white p-2 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
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
                className="h-5 w-5 sm:h-6 sm:w-6"
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

          {/* Center Logo for Mobile & Tablet */}
          <div className="flex justify-center items-center">
            <Link href="/" className="relative h-12 w-24 sm:h-12 sm:w-28 md:h-12 md:w-32 overflow-hidden">
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

          {/* Mini CTA button for Mobile & Tablet */}
          <div>
            <button 
              onClick={openModal}
              className="rounded-full border-2 border-black bg-[#F3819F] px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs md:text-sm font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
            >
              Participate
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Drawer Menu (Full width block) */}
        {isOpen && (
          <div className="fixed left-0 right-0 bottom-0 top-[80px] md:top-[88px] flex flex-col gap-6 border-t-2 border-black bg-white p-6 lg:hidden animate-in slide-in-from-top duration-300 z-50 overflow-y-auto">
            <div className="flex flex-col gap-3 font-semibold text-zinc-950 text-sm sm:text-base">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2.5 hover:bg-[#F3819F]/10 hover:text-[#BE2079] transition-all duration-200"
              >
                Home
              </Link>
              <Link
                href="/#awards"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2.5 hover:bg-[#F3819F]/10 hover:text-[#BE2079] transition-all duration-200"
              >
                Awards
              </Link>
              <Link
                href="/#categories"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2.5 hover:bg-[#F3819F]/10 hover:text-[#BE2079] transition-all duration-200"
              >
                Categories
              </Link>
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2.5 hover:bg-[#F3819F]/10 hover:text-[#BE2079] transition-all duration-200"
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
