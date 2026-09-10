"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Clock, ArrowUp, QrCode, Phone } from "lucide-react";
import { FaYoutube, FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const SITE_URL = "https://innovatecg.in/";

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const copyrightText = "© 2026 Government of Chhattisgarh. All rights reserved.";
  const backToTopText = "BACK TO TOP";

  const socialLinks = [
    { name: "Twitter / X", icon: FaXTwitter, link: "https://x.com/cgmygov" },
    { name: "Facebook", icon: FaFacebookF, link: "https://www.facebook.com/mygovcg/" },
    { name: "YouTube", icon: FaYoutube, link: "https://www.youtube.com/channel/UCOcSIE1R6TlskjcQg3gO_rA" },
    { name: "Instagram", icon: FaInstagram, link: "https://www.instagram.com/cgmygov/" },
    { name: "LinkedIn", icon: FaLinkedinIn, link: "https://www.linkedin.com/in/cg-mygov-10a59a425/" },
  ];

  return (
    <footer
      id="contact"
      className="w-full bg-[#FAF7F0] border-t border-zinc-200/80 text-zinc-950 relative z-10 scroll-mt-24 text-left overflow-hidden mt-auto"
    >
      {/* Top Accent Strip with Forest Green & Terracotta Brand Colors */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[var(--secondary)] via-[var(--primary)] to-[var(--accent)]" />

      {/* Subtle Forest Green Ambient Watermark Glow */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[var(--secondary)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8 md:pt-16 xl:pt-20 xl:pb-12 relative z-10">

        {/* Top Section: 3 Centered Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 xl:gap-16 max-w-5xl mx-auto pb-12 border-b border-zinc-300/60 justify-items-start md:justify-items-center">

          {/* Column 1: Navigation Links (Strictly: About Us, Categories, Gallery, News & Updates, Privacy Policy) */}
          <div className="flex flex-col gap-4 min-w-[180px]">
            <h4 className="font-poppins font-bold text-xs xl:text-sm uppercase tracking-widest text-[var(--secondary)] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              {t("Navigation")}
            </h4>
            <ul className="flex flex-col gap-2.5 text-zinc-800 font-semibold text-sm xl:text-base">
              <li>
                <Link href="/about" className="hover:text-[var(--primary)] hover:pl-1 transition-all duration-200">
                  {t("About Us")}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-[var(--primary)] hover:pl-1 transition-all duration-200">
                  {t("Categories")}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[var(--primary)] hover:pl-1 transition-all duration-200">
                  {t("Gallery")}
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[var(--primary)] hover:pl-1 transition-all duration-200">
                  {t("News & Updates")}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[var(--primary)] hover:pl-1 transition-all duration-200">
                  {t("Privacy Policy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Support Desk */}
          <div className="flex flex-col gap-4 min-w-[200px]">
            <h4 className="font-poppins font-bold text-xs xl:text-sm uppercase tracking-widest text-[var(--secondary)] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              {t("Support Desk")}
            </h4>
            <ul className="flex flex-col gap-3.5 text-zinc-700 font-semibold text-sm xl:text-base">
              <li>
                <div className="text-zinc-900 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[var(--secondary)]" />
                  {t("Helpline Number")}
                </div>
                <span className="text-zinc-700 font-bold mt-0.5 text-sm xl:text-base block">
                  {t("Coming Soon")}
                </span>
              </li>
              <li>
                <div className="text-zinc-900 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[var(--secondary)]" />
                  {t("Email")}
                </div>
                <a
                  href="mailto:supportdeskcg@gmail.com"
                  className="text-zinc-800 hover:text-[var(--primary)] font-bold mt-0.5 text-sm xl:text-base break-words block transition-colors duration-200"
                >
                  supportdeskcg@gmail.com
                </a>
              </li>
              <li>
                <div className="text-zinc-900 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--secondary)]" />
                  {t("Office Hours")}
                </div>
                <div className="text-zinc-650 text-xs sm:text-sm mt-0.5 font-medium">Mon-Sat (10:00 AM - 5:30 PM)</div>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect With Us */}
          <div className="flex flex-col gap-4 min-w-[200px]">
            <h4 className="font-poppins font-bold text-xs xl:text-sm uppercase tracking-widest text-[var(--secondary)] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              {t("Connect With Us")}
            </h4>

            {/* Social Icons row */}
            <div className="flex gap-2.5">
              {socialLinks.map((soc, i) => {
                const IconComponent = soc.icon;
                return (
                  <a
                    key={i}
                    href={soc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border border-zinc-200 text-[var(--secondary)] hover:bg-[var(--secondary)] hover:text-white hover:border-[var(--secondary)] flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                    aria-label={`Follow on ${soc.name}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col gap-2 mt-2 items-start">
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Scan or Click to open website"
                className="group relative bg-white p-2 rounded-2xl w-24 h-24 xl:w-28 xl:h-28 flex items-center justify-center shrink-0 border border-zinc-200 shadow-sm hover:border-[var(--primary)] hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(SITE_URL)}&color=2E5C31&margin=2`}
                  alt="Website QR Code"
                  loading="lazy"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </a>
              <span className="text-[10px] xl:text-[11px] font-inter font-bold text-zinc-600 tracking-tight flex items-center gap-1">
                <QrCode className="w-3 h-3 text-[var(--secondary)]" />
                <span>{t("Scan QR to Visit Website")}</span>
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Section: Back to Top & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-zinc-300/60 mt-10 max-w-5xl mx-auto">
          <p className="text-zinc-700 font-bold text-xs sm:text-sm">
            {t(copyrightText)}
          </p>

          <button
            onClick={handleScrollTop}
            className="rounded-full border border-zinc-200 bg-white hover:border-[var(--primary)] hover:text-[var(--primary)] px-5 py-2.5 font-extrabold text-zinc-900 text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer select-none flex items-center gap-2 group"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[var(--secondary)] group-hover:text-[var(--primary)] transition-colors" />
            <span>{t(backToTopText)}</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
