"use client";

import Link from "next/link";
import { PhoneCall, Mail, Clock, ArrowUp } from "lucide-react";
import { FaYoutube, FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const ownedText = "Content owned, updated and maintained by the Creator Awards Cell, Directorate of Culture & Tourism. Designed, developed and hosted by State Informatics Centre (SIC).";
  const copyrightText = "© 2026 Directorate of Culture & Tourism. All rights reserved.";
  const backToTopText = "BACK TO TOP";

  const socialLinks = [
    { name: "Twitter", icon: FaTwitter, link: "#twitter" },
    { name: "Facebook", icon: FaFacebookF, link: "#facebook" },
    { name: "YouTube", icon: FaYoutube, link: "#youtube" },
    { name: "Instagram", icon: FaInstagram, link: "#instagram" },
    { name: "LinkedIn", icon: FaLinkedinIn, link: "#linkedin" },
  ];

  return (
    <footer
      id="contact"
      className="w-full bg-background border-t border-zinc-200/80 text-zinc-950 relative z-30 scroll-mt-24 text-left overflow-hidden"
    >
      {/* Top Accent Strip with Forest Green & Terracotta Brand Colors */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[var(--secondary)] via-[var(--primary)] to-[var(--accent)]" />

      {/* Subtle Forest Green Ambient Watermark Glow */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[var(--secondary)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 pt-12 pb-8 md:pt-16 xl:pt-20 xl:pb-12 relative z-10">
        
        {/* Top Section: 5 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-300/60">
          
          {/* Column 1: Logo & Department Attribution */}
          <div className="flex flex-col items-start gap-4 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/images/chattisgarh-logo.webp" 
                alt="Chhattisgarh Logo" 
                className="w-14 h-14 xl:w-16 xl:h-16 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="font-poppins font-extrabold tracking-wide uppercase text-sm xl:text-base text-[var(--primary)]">
                  {t("Digital State")}
                </span>
                <span className="font-poppins font-bold text-xs text-[var(--secondary)]">
                  छत्तीसगढ़ सबले बढ़िया
                </span>
              </div>
            </div>
            <p className="text-zinc-700 font-medium text-xs sm:text-sm leading-relaxed max-w-sm">
              {t(ownedText)}
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-4">
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
                <Link href="/#who-can-apply" className="hover:text-[var(--primary)] hover:pl-1 transition-all duration-200">
                  {t("Eligibility")}
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-[var(--primary)] hover:pl-1 transition-all duration-200">
                  {t("Categories")}
                </Link>
              </li>
              <li>
                <Link href="/#timeline" className="hover:text-[var(--primary)] hover:pl-1 transition-all duration-200">
                  {t("Timeline")}
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[var(--primary)] hover:pl-1 transition-all duration-200">
                  {t("FAQ")}
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-[var(--primary)] hover:pl-1 transition-all duration-200">
                  {t("Contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: GIGW Utility Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-poppins font-bold text-xs xl:text-sm uppercase tracking-widest text-[var(--secondary)] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              {t("GIGW Utilities")}
            </h4>
            <ul className="flex flex-col gap-2.5 text-zinc-800 font-semibold text-sm xl:text-base">
              <li>
                <Link href="/#terms" className="hover:text-[var(--primary)] hover:pl-1 transition-all duration-200">
                  {t("Privacy Policy")}
                </Link>
              </li>
              <li>
                <Link href="/#terms" className="hover:text-[var(--primary)] hover:pl-1 transition-all duration-200">
                  {t("Accessibility Statement")}
                </Link>
              </li>
              <li>
                <Link href="/#terms" className="hover:text-[var(--primary)] hover:pl-1 transition-all duration-200">
                  {t("Hyperlinking Policy")}
                </Link>
              </li>
              <li>
                <Link href="/#terms" className="hover:text-[var(--primary)] hover:pl-1 transition-all duration-200">
                  {t("Copyright Policy")}
                </Link>
              </li>
              <li>
                <Link href="/#terms" className="hover:text-[var(--primary)] hover:pl-1 transition-all duration-200">
                  {t("RTI & Grievances")}
                </Link>
              </li>
              <li>
                <Link href="/#terms" className="hover:text-[var(--primary)] hover:pl-1 transition-all duration-200">
                  {t("Sitemap")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Helpline Desk */}
          <div className="flex flex-col gap-4">
            <h4 className="font-poppins font-bold text-xs xl:text-sm uppercase tracking-widest text-[var(--secondary)] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              {t("Support Desk")}
            </h4>
            <ul className="flex flex-col gap-3.5 text-zinc-700 font-semibold text-sm xl:text-base">
              <li>
                <div className="text-zinc-900 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-[var(--secondary)]" />
                  {t("Helpline")}
                </div>
                <a 
                  href="tel:+917712510123" 
                  className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-extrabold mt-0.5 text-base xl:text-lg block transition-colors duration-200"
                >
                  +91-771-2510123
                </a>
              </li>
              <li>
                <div className="text-zinc-900 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[var(--secondary)]" />
                  {t("Email")}
                </div>
                <a 
                  href="mailto:support-creatorawards@cg.gov.in" 
                  className="text-zinc-800 hover:text-[var(--primary)] font-bold mt-0.5 text-sm xl:text-base break-words block transition-colors duration-200"
                >
                  support-creatorawards@cg.gov.in
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

          {/* Column 5: Connect With Us */}
          <div className="flex flex-col gap-4">
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
                    className="bg-white border border-zinc-200 text-[var(--secondary)] hover:bg-[var(--secondary)] hover:text-white hover:border-[var(--secondary)] flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                    aria-label={`Follow on ${soc.name}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="bg-white p-2 rounded-2xl w-20 h-20 xl:w-24 xl:h-24 flex items-center justify-center shrink-0 border border-zinc-200 select-none shadow-sm">
                <svg className="w-16 h-16 xl:w-20 xl:h-20 text-[var(--secondary)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="5" width="30" height="30" stroke="currentColor" strokeWidth="6" />
                  <rect x="13" y="13" width="14" height="14" fill="currentColor" />
                  <rect x="65" y="5" width="30" height="30" stroke="currentColor" strokeWidth="6" />
                  <rect x="73" y="13" width="14" height="14" fill="currentColor" />
                  <rect x="5" y="65" width="30" height="30" stroke="currentColor" strokeWidth="6" />
                  <rect x="13" y="73" width="14" height="14" fill="currentColor" />
                  <rect x="45" y="5" width="8" height="20" fill="currentColor" />
                  <rect x="57" y="15" width="4" height="12" fill="currentColor" />
                  <rect x="45" y="35" width="15" height="8" fill="currentColor" />
                  <rect x="80" y="45" width="15" height="10" fill="currentColor" />
                  <rect x="68" y="50" width="8" height="6" fill="currentColor" />
                  <rect x="45" y="65" width="8" height="15" fill="currentColor" />
                  <rect x="57" y="75" width="15" height="8" fill="currentColor" />
                  <rect x="75" y="65" width="10" height="8" fill="currentColor" />
                  <rect x="80" y="80" width="15" height="15" fill="currentColor" />
                  <circle cx="50" cy="50" r="4" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section: Back to Top & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-zinc-300/60 mt-10">
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
