"use client";

import Link from "next/link";
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

  return (
    <footer 
      id="contact" 
      className="w-full bg-[#FAF7F0] border-t border-zinc-200 text-zinc-950 relative z-30 scroll-mt-24 text-left"
    >
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 pt-12 pb-8 md:pt-16 xl:pt-20 xl:pb-12">
        
        {/* Top Section: 5 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-black/10">
          
          {/* Column 1: Logo & Department Attribution */}
          <div className="flex flex-col items-start gap-4 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/images/logoChattisgarh.png" 
                alt="Digital State Logo" 
                className="w-14 h-14 xl:w-16 xl:h-16 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="font-display font-black tracking-wide uppercase text-sm xl:text-base text-zinc-950">
                {t("Digital State")}
              </span>
            </div>
            <p className="text-zinc-600 font-bold text-xs sm:text-sm leading-relaxed max-w-sm">
              {t(ownedText)}
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-black text-xs xl:text-sm uppercase tracking-widest text-[#BE2079]">
              {t("Navigation")}
            </h4>
            <ul className="flex flex-col gap-2.5 text-zinc-650 font-bold text-sm xl:text-base">
              <li>
                <Link href="/about" className="hover:text-[#BE2079] transition-colors duration-200">
                  {t("About Us")}
                </Link>
              </li>
              <li>
                <Link href="/#who-can-apply" className="hover:text-[#BE2079] transition-colors duration-200">
                  {t("Eligibility")}
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-[#BE2079] transition-colors duration-200">
                  {t("Categories")}
                </Link>
              </li>
              <li>
                <Link href="/#timeline" className="hover:text-[#BE2079] transition-colors duration-200">
                  {t("Timeline")}
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#BE2079] transition-colors duration-200">
                  {t("FAQ")}
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-[#BE2079] transition-colors duration-200">
                  {t("Contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: GIGW Utility Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-black text-xs xl:text-sm uppercase tracking-widest text-[#BE2079]">
              {t("GIGW Utilities")}
            </h4>
            <ul className="flex flex-col gap-2.5 text-zinc-655 font-bold text-sm xl:text-base">
              <li>
                <Link href="/#terms" className="hover:text-[#BE2079] transition-colors duration-200">
                  {t("Privacy Policy")}
                </Link>
              </li>
              <li>
                <Link href="/#terms" className="hover:text-[#BE2079] transition-colors duration-200">
                  {t("Accessibility Statement")}
                </Link>
              </li>
              <li>
                <Link href="/#terms" className="hover:text-[#BE2079] transition-colors duration-200">
                  {t("Hyperlinking Policy")}
                </Link>
              </li>
              <li>
                <Link href="/#terms" className="hover:text-[#BE2079] transition-colors duration-200">
                  {t("Copyright Policy")}
                </Link>
              </li>
              <li>
                <Link href="/#terms" className="hover:text-[#BE2079] transition-colors duration-200">
                  {t("RTI & Grievances")}
                </Link>
              </li>
              <li>
                <Link href="/#terms" className="hover:text-[#BE2079] transition-colors duration-200">
                  {t("Sitemap")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Helpline Desk */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-black text-xs xl:text-sm uppercase tracking-widest text-[#BE2079]">
              {t("Support Desk")}
            </h4>
            <ul className="flex flex-col gap-3 text-zinc-600 font-bold text-sm xl:text-base">
              <li>
                <div className="text-zinc-950 font-extrabold text-xs uppercase tracking-wider">{t("Helpline")}</div>
                <a 
                  href="tel:+917712510123" 
                  className="text-[#123E4A] hover:text-[#F3819F] font-black mt-0.5 text-base xl:text-lg block transition-colors duration-200"
                >
                  +91-771-2510123
                </a>
              </li>
              <li>
                <div className="text-zinc-950 font-extrabold text-xs uppercase tracking-wider">{t("Email")}</div>
                <a 
                  href="mailto:support-creatorawards@cg.gov.in" 
                  className="text-zinc-700 hover:text-[#F3819F] font-bold mt-0.5 text-sm xl:text-base break-words block transition-colors duration-200"
                >
                  support-creatorawards@cg.gov.in
                </a>
              </li>
              <li>
                <div className="text-zinc-950 font-extrabold text-xs uppercase tracking-wider">{t("Office Hours")}</div>
                <div className="text-zinc-650 text-xs sm:text-sm mt-0.5">Mon-Sat (10:00 AM - 5:30 PM)</div>
              </li>
            </ul>
          </div>

          {/* Column 5: Connect With Us */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-black text-xs xl:text-sm uppercase tracking-widest text-[#BE2079]">
              {t("Connect With Us")}
            </h4>
            
            {/* Social Icons row */}
            <div className="flex gap-2.5">
              {[
                { name: "x", path: "M2.0485 2h3.298l5.2447 7.0272L15.9181 2h2.034l-6.8515 7.966 8.0469 11.034h-3.328l-5.7437-7.6341L4.394 21H2.36l7.391-8.593L2.0485 2zm3.89 1.513l8.6083 11.839h1.498L7.4363 3.513H5.9385z" },
                { name: "fb", path: "M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h2V1h-3A4.5 4.5 0 0 0 9 5.5V8z" },
                { name: "yt", path: "M19.61 5.01a2.5 2.5 0 0 0-1.76-1.78C16.29 2.8 10 2.8 10 2.8s-6.29 0-7.85.43A2.5 2.5 0 0 0 .39 5.01C0 6.6 0 10 0 10s0 3.4.39 4.99a2.5 2.5 0 0 0 1.76 1.78C3.71 17.2 10 17.2 10 17.2s6.29 0 7.85-.43a2.5 2.5 0 0 0 1.76-1.78C20 13.4 20 10 20 10s0-3.4-.39-4.99zM8 13.5V6.5L14 10L8 13.5z" },
                { name: "ig", path: "M10 2c2.4 0 2.7 0 3.7.1 2.3.1 3.5 1.3 3.6 3.6.1 1 .1 1.3.1 3.7s0 2.7-.1 3.7c-.1 2.3-1.3 3.5-3.6 3.6-1 .1-1.3.1-3.7.1s-2.7 0-3.7-.1c-2.3-.1-3.5-1.3-3.6-3.6C2.1 12.7 2 12.4 2 10s0-2.7.1-3.7c.1-2.3 1.3-3.5 3.6-3.6 1-.1 1.3-.1 3.7-.1m0-2C7.5 0 7.2 0 6.3.1 3.6.2 1.8 2 1.7 4.7c-.1.9-.1 1.2-.1 3.6s0 2.7.1 3.6c.1 2.7 2 4.5 4.7 4.6.9.1 1.2.1 3.6.1s2.7 0 3.6-.1c2.7-.1 4.5-2 4.6-4.7.1-.9.1-1.2.1-3.6s0-2.7-.1-3.6c-.1-2.7-2-4.5-4.7-4.6C12.8 0 12.5 0 10 0z M10 4.9A5.1 5.1 0 1 0 15.1 10 5.1 5.1 0 0 0 10 4.9zm0 8.2A3.1 3.1 0 1 1 13.1 10 3.1 3.1 0 0 1 10 13.1z M15.3 3.5a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2z" },
                { name: "in", path: "M19 0H1C.4 0 0 .4 0 1v18c0 .6.4 1 1 1h18c.6 0 1-.4 1-1V1c0-.6-.4-1-1-1zM6 17H3V8h3v9zM4.5 6.5C3.7 6.5 3 5.8 3 5s.7-1.5 1.5-1.5S6 4.2 6 5s-.8 1.5-1.5 1.5zM17 17h-3v-5.5c0-1.3-.5-1.8-1.5-1.8-1.1 0-1.5.8-1.5 1.8V17H8V8h3v1.2c.4-.7 1.3-1.4 2.5-1.4 2.1 0 3.5 1.4 3.5 4.3V17z" }
              ].map((soc, i) => (
                <a 
                  key={i}
                  href={`#${soc.name}`} 
                  className="bg-white border border-zinc-200 text-zinc-950 hover:bg-[#F3819F]/20 flex items-center justify-center w-8 h-8 xl:w-9 xl:h-9 rounded-full transition-all duration-200 hover:-translate-y-0.5"
                  aria-label={`Follow on ${soc.name}`}
                >
                  <svg className="w-4 h-4 xl:w-4.5 xl:h-4.5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d={soc.path} />
                  </svg>
                </a>
              ))}
            </div>

            {/* App Downloads Section */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="bg-white p-1.5 rounded-2xl w-20 h-20 xl:w-24 xl:h-24 flex items-center justify-center shrink-0 border border-zinc-200 select-none shadow-sm">
                <svg className="w-16 h-16 xl:w-20 xl:h-20 text-zinc-950" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-black/10 mt-12">
          <p className="text-zinc-600 font-bold text-xs sm:text-sm">
            {t(copyrightText)}
          </p>

          <button 
            onClick={handleScrollTop}
            className="rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2 font-black text-zinc-950 text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer select-none"
          >
            ▲ {t(backToTopText)}
          </button>
        </div>

      </div>
    </footer>
  );
}
