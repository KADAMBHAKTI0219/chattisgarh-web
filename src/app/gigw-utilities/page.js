"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Heading from "@/components/common/Heading";
import { useLanguage } from "@/context/LanguageContext";
import {
  FaShieldAlt,
  FaUniversalAccess,
  FaLink,
  FaCopyright,
  FaInfoCircle,
  FaExclamationTriangle,
  FaSitemap,
  FaCheckCircle,
  FaArrowLeft,
  FaDownload,
  FaFileAlt
} from "react-icons/fa";

export default function GigwUtilitiesPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("privacy");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (["privacy", "accessibility", "hyperlink", "copyright", "rti", "grievance", "sitemap"].includes(hash)) {
        setActiveTab(hash);
      }
    }
  }, []);

  const tabs = [
    { id: "privacy", label: "Privacy Policy", icon: FaShieldAlt },
    { id: "accessibility", label: "Accessibility Statement", icon: FaUniversalAccess },
    { id: "hyperlink", label: "Hyperlinking Policy", icon: FaLink },
    { id: "copyright", label: "Copyright Policy", icon: FaCopyright },
    { id: "rti", label: "Right to Information (RTI)", icon: FaInfoCircle },
    { id: "grievance", label: "Grievance Redressal", icon: FaExclamationTriangle },
    { id: "sitemap", label: "Sitemap", icon: FaSitemap },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-10 relative overflow-x-hidden animate-page-enter">
      
      {/* Top Navigation */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-[var(--primary)] font-inter font-bold text-xs sm:text-sm transition-colors group"
        >
          <FaArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Return to Home</span>
        </Link>

        <span className="text-[10px] sm:text-xs font-inter font-bold text-zinc-500 uppercase tracking-widest">
          GIGW 3.0 & STQC Compliant Portal
        </span>
      </div>

      {/* Hero Header */}
      <div className="w-full max-w-7xl mx-auto text-center flex flex-col items-center">
        <Heading
          badge={t("GOVERNMENT COMPLIANCE & POLICIES")}
          title={t("GIGW UTILITIES &")}
          highlightText={t("TERMS DESK")}
          description={t("Guidelines for Indian Government Websites (GIGW) compliance policies including privacy, accessibility, hyperlinking, RTI, copyright, and grievance redressal.")}
        />
      </div>

      {/* Interactive Tabs Bar */}
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-white p-2 rounded-2xl border border-zinc-200 shadow-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (typeof window !== "undefined") {
                    window.history.pushState(null, "", `#${tab.id}`);
                  }
                }}
                className={`shrink-0 px-4 py-2.5 rounded-xl font-poppins font-bold text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2 border ${
                  isActive
                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                    : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-7xl mx-auto bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-10 shadow-sm text-left">
        
        {/* TAB 1: Privacy Policy */}
        {activeTab === "privacy" && (
          <div className="flex flex-col gap-6 animate-in fade-in">
            <div className="border-b border-zinc-200 pb-4">
              <span className="text-xs font-poppins font-bold uppercase tracking-wider text-[#C45A32]">
                Data Protection & Privacy
              </span>
              <h2 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-1">
                Privacy Policy Statement
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 font-inter leading-relaxed">
              As a general rule, this website does not collect personal information about you when you visit the site. You can generally visit the site without revealing personal information, unless you choose to provide such information during registration or nomination submission.
            </p>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-poppins font-bold text-zinc-900 uppercase">1. Site Visit Data</h3>
              <p className="text-xs text-zinc-600 font-inter leading-relaxed">
                This website records your visit and logs the following information for statistical purposes: server address, top-level domain name (.gov.in, .com), date and time of visit, pages accessed, and browser type.
              </p>

              <h3 className="text-sm font-poppins font-bold text-zinc-900 uppercase">2. Personal Information Handling</h3>
              <p className="text-xs text-zinc-600 font-inter leading-relaxed">
                Your email address and phone number are recorded only if you choose to register for the Chhattisgarh Creator & Influencer Awards. They are strictly used for contest administration, verification, and state award notifications.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: Accessibility Statement */}
        {activeTab === "accessibility" && (
          <div className="flex flex-col gap-6 animate-in fade-in">
            <div className="border-b border-zinc-200 pb-4">
              <span className="text-xs font-poppins font-bold uppercase tracking-wider text-[#21593D]">
                Universal Web Access
              </span>
              <h2 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-1">
                Accessibility Statement
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 font-inter leading-relaxed">
              The Government of Chhattisgarh is committed to ensuring that the State Creator Awards portal is accessible to all citizens, including individuals with visual, auditory, or motor disabilities, adhering to GIGW 3.0 standards and WCAG 2.1 AA guidelines.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {[
                "High contrast text and scalable font sizing controls",
                "Screen reader friendly semantic HTML layout tags",
                "Complete keyboard focus indicator support",
                "Alternative text descriptions for non-text image elements",
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-start gap-3">
                  <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-inter font-bold text-zinc-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Hyperlinking Policy */}
        {activeTab === "hyperlink" && (
          <div className="flex flex-col gap-6 animate-in fade-in">
            <div className="border-b border-zinc-200 pb-4">
              <span className="text-xs font-poppins font-bold uppercase tracking-wider text-[#C45A32]">
                External & Internal Links
              </span>
              <h2 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-1">
                Hyperlinking Policy
              </h2>
            </div>

            <div className="flex flex-col gap-4 text-xs sm:text-sm text-zinc-700 font-inter leading-relaxed">
              <h3 className="font-poppins font-bold text-sm text-zinc-950 uppercase">Links to External Websites</h3>
              <p>
                At many places in this website, you shall find links to other external websites or portals (e.g., YouTube, Instagram, Department portals). These links have been placed for user convenience and creator portfolio submission purposes.
              </p>

              <h3 className="font-poppins font-bold text-sm text-zinc-950 uppercase">Links to Chhattisgarh Creator Awards Portal</h3>
              <p>
                Prior permission is required before hyperlinking to this website from any external site. Requests specifying the nature of content and exact page URL should be sent to the Directorate of Culture & Tourism.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: Copyright Policy */}
        {activeTab === "copyright" && (
          <div className="flex flex-col gap-6 animate-in fade-in">
            <div className="border-b border-zinc-200 pb-4">
              <span className="text-xs font-poppins font-bold uppercase tracking-wider text-[#C45A32]">
                Intellectual Property & Licensing
              </span>
              <h2 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-1">
                Copyright Policy
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 font-inter leading-relaxed">
              Material featured on this portal may be reproduced free of charge in any format or media without requiring specific permission, subject to the material being reproduced accurately and not being used in a derogatory manner or misleading context.
            </p>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-zinc-800 font-inter font-medium leading-relaxed">
              <strong>Note:</strong> Content submitted by independent digital creators (reels, videos, blog posts) remains the exclusive intellectual property of respective creator nominees.
            </div>
          </div>
        )}

        {/* TAB 5: RTI */}
        {activeTab === "rti" && (
          <div className="flex flex-col gap-6 animate-in fade-in">
            <div className="border-b border-zinc-200 pb-4">
              <span className="text-xs font-poppins font-bold uppercase tracking-wider text-[#21593D]">
                Statutory Transparency
              </span>
              <h2 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-1">
                Right to Information (RTI)
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 font-inter leading-relaxed">
              In accordance with Section 4(1)(b) of the Right to Information Act, 2005, the Directorate of Culture & Tourism, Government of Chhattisgarh provides proactive disclosures concerning the administration, jury composition, and evaluation guidelines of state awards.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
              >
                Submit RTI Query Online
              </a>
            </div>
          </div>
        )}

        {/* TAB 6: Grievance Redressal */}
        {activeTab === "grievance" && (
          <div className="flex flex-col gap-6 animate-in fade-in">
            <div className="border-b border-zinc-200 pb-4">
              <span className="text-xs font-poppins font-bold uppercase tracking-wider text-[#C45A32]">
                Citizen & Creator Redressal
              </span>
              <h2 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-1">
                Grievance Redressal Mechanism
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 font-inter leading-relaxed">
              Creators or citizens with inquiries, complaints regarding technical evaluation, or category eligibility disputes can log a formal grievance through our state support desk.
            </p>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col gap-2">
              <span className="text-xs font-poppins font-bold text-zinc-950 uppercase">Appellate Nodal Officer</span>
              <span className="text-xs text-zinc-700 font-inter font-medium">Directorate of Culture & Information Technology</span>
              <span className="text-xs text-[#C45A32] font-bold">Email: support-creatorawards@cg.gov.in</span>
            </div>
          </div>
        )}

        {/* TAB 7: Sitemap */}
        {activeTab === "sitemap" && (
          <div className="flex flex-col gap-6 animate-in fade-in">
            <div className="border-b border-zinc-200 pb-4">
              <span className="text-xs font-poppins font-bold uppercase tracking-wider text-[#21593D]">
                Portal Structure
              </span>
              <h2 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-1">
                Website Sitemap
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              <div className="flex flex-col gap-2">
                <h4 className="font-poppins font-bold text-xs uppercase tracking-wider text-[#C45A32]">Main Pages</h4>
                <ul className="flex flex-col gap-1.5 text-xs font-inter font-bold text-zinc-700">
                  <li><Link href="/" className="hover:underline">Home</Link></li>
                  <li><Link href="/about" className="hover:underline">About Us</Link></li>
                  <li><Link href="/categories" className="hover:underline">Award Categories</Link></li>
                  <li><Link href="/participate" className="hover:underline">Participate Now</Link></li>
                  <li><Link href="/winners" className="hover:underline">Hall of Fame / Winners</Link></li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="font-poppins font-bold text-xs uppercase tracking-wider text-[#21593D]">Media & Desk</h4>
                <ul className="flex flex-col gap-1.5 text-xs font-inter font-bold text-zinc-700">
                  <li><Link href="/gallery" className="hover:underline">Media Gallery</Link></li>
                  <li><Link href="/news" className="hover:underline">News & Press Releases</Link></li>
                  <li><Link href="/contact" className="hover:underline">Contact & Support Desk</Link></li>
                  <li><Link href="/login" className="hover:underline">Sign In</Link></li>
                  <li><Link href="/register" className="hover:underline">Create Account</Link></li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="font-poppins font-bold text-xs uppercase tracking-wider text-amber-700">GIGW Utilities</h4>
                <ul className="flex flex-col gap-1.5 text-xs font-inter font-bold text-zinc-700">
                  <li><button onClick={() => setActiveTab("privacy")} className="hover:underline cursor-pointer">Privacy Policy</button></li>
                  <li><button onClick={() => setActiveTab("accessibility")} className="hover:underline cursor-pointer">Accessibility Statement</button></li>
                  <li><button onClick={() => setActiveTab("hyperlink")} className="hover:underline cursor-pointer">Hyperlinking Policy</button></li>
                  <li><button onClick={() => setActiveTab("copyright")} className="hover:underline cursor-pointer">Copyright Policy</button></li>
                  <li><button onClick={() => setActiveTab("rti")} className="hover:underline cursor-pointer">RTI Disclosures</button></li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
