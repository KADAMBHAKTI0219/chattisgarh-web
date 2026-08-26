"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParticipateModal } from "@/context/ParticipateModalContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { FaUser, FaThLarge, FaUserCircle, FaSignOutAlt, FaTrophy, FaTachometerAlt, FaChevronRight } from "react-icons/fa";

export default function Navbar() {
  const { openModal } = useParticipateModal();
  const { language, changeLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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
    // { name: "Winners", href: "/winners" },
    { name: "Gallery", href: "/gallery" },
    { name: "News", href: "/news" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar for GIGW compliance and official attributions */}
      <div className="w-full bg-white text-zinc-900 py-1.5 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 border-b-2 border-[#2E5C31] text-[10px] sm:text-xs select-none relative z-50 shadow-xs">
        <div className="mx-auto w-full max-w-[1480px] flex items-center justify-between">
          {/* Left: Indian Emblem & State Gov Name */}
          <div className="flex items-center gap-2 md:gap-3">
            <Image
              src="/assets/images/govt-cg-logo.png"
              alt="Government of Chhattisgarh Emblem"
              width={120}
              height={36}
              className="h-7 sm:h-12 w-auto rounded-[3px] object-contain shrink-0 p-0.5"
            />
            <span className="font-inter font-bold uppercase tracking-wider text-zinc-900 text-[10px] sm:text-xs">
              {t("Government Of Chattisgarh")}
            </span>
          </div>

          {/* Right: Official Language Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-xs text-zinc-600 font-bold uppercase tracking-wider hidden sm:inline">
              Language:
            </span>
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-zinc-50 border border-zinc-300 rounded-md px-2.5 py-0.5 text-zinc-900 text-[10px] sm:text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#2E5C31] cursor-pointer transition-colors"
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
        className={`w-full transform-gpu transition-all duration-300 border-b border-[#E8DFCF]/70 ${isScrolled
          ? "h-[65px] sm:h-[75px] bg-[#FFFDFC]/98 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          : "h-[75px] sm:h-[90px] bg-[#FFFDFC]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          }`}
      >
        {/* Bastar Tribal Pattern Top Border Highlight Line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C15B3D]/40 to-transparent opacity-80 pointer-events-none" />

        <div className="mx-auto h-full w-full max-w-[1480px] px-2.5 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between relative gap-1.5 sm:gap-4">

          {/* Left Side: Government Emblem Logo & Event Title */}
          <div className="flex items-center shrink-0 min-w-0 flex-1 sm:flex-initial">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-3.5 group relative py-1 min-w-0">

              {/* Subtle Warm Radial Glow Behind Logo */}
              <div className="absolute -inset-3 bg-[radial-gradient(circle_at_center,rgba(193,91,61,0.18)_0%,transparent_70%)] blur-lg pointer-events-none -z-10 opacity-75 group-hover:opacity-100 transition-opacity" />

              {/* Chhattisgarh State Emblem Logo */}
              <Image
                src="/assets/images/logoChattisgarh.png"
                alt="Government of Chhattisgarh Logo"
                width={260}
                height={75}
                priority
                className={`w-auto object-contain transition-all duration-300 shrink-0 ${isScrolled ? "h-10 xs:h-12 sm:h-16 lg:h-20 scale-95" : "h-11 xs:h-13 sm:h-16 lg:h-20 scale-100"
                  } group-hover:scale-[1.02]`}
              />

              {/* Title & Tagline Branding Block */}
              <div className="flex flex-col text-left justify-center border-l-2 border-[#C15B3D]/30 pl-1.5 xs:pl-2.5 sm:pl-3.5 min-w-0 max-w-[130px] min-[380px]:max-w-[170px] xs:max-w-[210px] sm:max-w-none">
                <span className="font-montserrat font-bold text-[8px] min-[360px]:text-[9px] xs:text-[10.5px] sm:text-sm md:text-[15px] lg:text-[16px] xl:text-[17px] leading-[1.15] uppercase tracking-tight text-[#C15B3D] group-hover:text-[#9E3E23] transition-colors duration-300">
                  {t("Chhattisgarh State Creator & Influencer Awards")}
                </span>
                <span className="font-montserrat font-bold text-[7.5px] min-[360px]:text-[8.5px] xs:text-[10px] sm:text-xs md:text-[13px] leading-tight tracking-wide mt-0.5 text-[#D96B27] truncate sm:whitespace-nowrap">
                  हर एक स्क्रीन पर छाएगा छत्तीसगढ़
                </span>
              </div>
            </Link>
          </div>

          {/* Right Side: Primary CTA Button & Profile & Menu Buttons */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0">
            {/* Participate Now Button (Left of Menu Icon) */}
            <button
              onClick={openModal}
              className="relative group overflow-hidden rounded-full p-[1.5px] shadow-[0_4px_16px_rgba(193,91,61,0.3)] hover:shadow-[0_0_24px_rgba(193,91,61,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer shrink-0 hidden lg:block"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#C15B3D] via-[#D39B2C] to-[#C15B3D] bg-[length:200%_auto] group-hover:bg-right transition-all duration-500 rounded-full" />
              <span className="relative flex items-center gap-1.5 xs:gap-2 px-3 py-1.5 xs:px-4 xs:py-2 sm:px-6 sm:py-2.5 rounded-full bg-gradient-to-r from-[#C15B3D] to-[#D39B2C] text-white font-poppins font-bold text-[10.5px] xs:text-xs sm:text-sm xl:text-base tracking-wide whitespace-nowrap">
                <span>{t("Participate Now")}</span>
                <svg
                  className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-white fill-none transition-transform duration-300 group-hover:translate-x-1"
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

            {/* User Profile Icon with Dropdown Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex h-9 w-9 xs:h-10 xs:w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 border-[#2E5C31]/40 bg-emerald-50 text-[#2E5C31] shadow-md hover:border-[#C15B3D] hover:bg-[#C15B3D] hover:text-white active:scale-95 transition-all duration-300 cursor-pointer shrink-0 relative"
                  title={`${user?.name || "User Profile"} - Account Menu`}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="font-poppins font-bold text-[11px] xs:text-xs">
                      {(user?.name || "U").substring(0, 2).toUpperCase()}
                    </span>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 xs:w-3.5 xs:h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <>
                    {/* Backdrop overlay to close dropdown */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    />

                    <div className="absolute right-0 mt-3 w-64 bg-white border border-zinc-200/90 rounded-2xl shadow-xl z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150">

                      {/* Profile Header */}
                      <div className="p-4 bg-gradient-to-br from-emerald-50 via-zinc-50 to-orange-50/50 border-b border-zinc-150 flex items-center gap-3">
                        {user?.avatar ? (
                          <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-emerald-300 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#2E5C31] text-amber-300 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-600">
                            {(user?.name || "U").substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <h4 className="font-poppins font-extrabold text-xs text-zinc-950 truncate">
                            {user?.name || "Registered Creator"}
                          </h4>
                          <span className="text-[10px] font-inter text-zinc-500 truncate">{user?.email || "creator@cg.gov.in"}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-poppins font-bold text-[9px] uppercase tracking-wider w-fit mt-1">
                            {user?.role || "CREATOR"}
                          </span>
                        </div>
                      </div>

                      {/* Links List with Rich Icon Badges */}
                      <div className="p-2 flex flex-col gap-1 text-xs font-poppins font-semibold">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-zinc-800 hover:bg-orange-50/80 hover:text-[#C15B3D] transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-orange-100/90 text-[#C15B3D] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                              <FaTachometerAlt className="w-4 h-4 text-[#C15B3D]" />
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="font-poppins font-bold text-xs">Dashboard</span>
                              <span className="text-[10px] font-inter text-zinc-400 font-normal">Overview & Analytics</span>
                            </div>
                          </div>
                          <FaChevronRight className="w-3 h-3 text-zinc-300 group-hover:text-[#C15B3D] group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        <Link
                          href="/dashboard/profile"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-zinc-800 hover:bg-emerald-50/80 hover:text-[#21593D] transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100/90 text-[#21593D] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                              <FaUserCircle className="w-4 h-4 text-[#21593D]" />
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="font-poppins font-bold text-xs">My Profile</span>
                              <span className="text-[10px] font-inter text-zinc-400 font-normal">Account & Details</span>
                            </div>
                          </div>
                          <FaChevronRight className="w-3 h-3 text-zinc-300 group-hover:text-[#21593D] group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      </div>

                      {/* Logout Section */}
                      <div className="p-2 border-t border-zinc-150 bg-zinc-50/80">
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            logout();
                          }}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-poppins font-bold text-xs transition-all cursor-pointer w-full text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-rose-100/90 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                              <FaSignOutAlt className="w-4 h-4 text-rose-600" />
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="font-poppins font-bold text-xs">Logout</span>
                              <span className="text-[10px] font-inter text-zinc-400 font-normal">Sign out of portal</span>
                            </div>
                          </div>
                          <FaChevronRight className="w-3 h-3 text-zinc-300 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      </div>

                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 border-[#C15B3D]/30 bg-[#FFFDFC] text-[#C15B3D] shadow-md hover:border-[#C15B3D] hover:bg-[#C15B3D] hover:text-white active:scale-95 transition-all duration-300 cursor-pointer shrink-0"
                title="Login / Register Account"
              >
                <FaUser className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </Link>
            )}

            {/* Menu Icon Button (Right of Participate Now) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 border-[#C15B3D]/30 bg-[#FFFDFC] text-[#2E5C31] shadow-md hover:shadow-lg hover:border-[#C15B3D] hover:bg-[#C15B3D] hover:text-white active:scale-95 transition-all duration-300 cursor-pointer group shrink-0"
              aria-label="Toggle Navigation Menu"
              title="Open Menu"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6 stroke-current transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24">
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

      {/* Side Drawer Navigation Panel (Opens from Right Side) */}
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Right-side Sliding Navbar Drawer */}
          <div className="fixed right-0 top-0 bottom-0 h-dvh w-[88vw] max-w-[400px] bg-[#FFFDFC] z-[101] flex flex-col shadow-2xl transition-transform duration-300 border-l-2 border-[#C15B3D]/30 animate-in slide-in-from-right">

            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E8DFCF] bg-[#FFFDFC]/95">
              <div className="flex items-center gap-3">
                <Image
                  src="/assets/images/logoChattisgarh.png"
                  alt="Government of Chhattisgarh Logo"
                  width={180}
                  height={50}
                  className="h-9 sm:h-10 w-auto object-contain shrink-0"
                />
                <div className="flex flex-col text-left border-l-2 border-[#C15B3D]/30 pl-2.5">
                  <span className="font-montserrat font-bold text-[10.5px] sm:text-xs text-[#C15B3D] leading-tight uppercase tracking-tight">
                    Chhattisgarh State Awards
                  </span>
                  <span className="font-montserrat font-bold text-[9.5px] sm:text-[11px] leading-tight mt-0.5 text-[#D96B27] whitespace-nowrap">
                    हर एक स्क्रीन पर छाएगा छत्तीसगढ़
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full border border-[#E8DFCF] bg-white text-zinc-700 shadow-sm active:scale-95 cursor-pointer hover:border-[#C15B3D] hover:bg-[#C15B3D] hover:text-white transition-colors"
                aria-label="Close Menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Links List */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-2 font-poppins font-semibold text-lg text-zinc-900">
              <span className="text-xs font-inter font-bold uppercase tracking-widest text-[#C15B3D] mb-1">
                Navigation Menu
              </span>
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

              {/* Participate Now Mobile/Drawer CTA Button */}
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
    </header>
  );
}