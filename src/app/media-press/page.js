"use client";

import Heading from "@/components/common/Heading";
import { useLanguage } from "@/context/LanguageContext";
import { FaDownload, FaNewspaper, FaBullhorn, FaFilePdf } from "react-icons/fa";

export default function MediaPressPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-10 relative overflow-x-hidden animate-page-enter">
      
      <div className="w-full max-w-7xl mx-auto text-center flex flex-col items-center">
        <Heading
          badge={t("PRESS & MEDIA RESOURCES")}
          title={t("MEDIA &")}
          highlightText={t("PRESS CENTER")}
          description={t("Download official brand assets, media kits, press releases, and official state government declarations.")}
        />
      </div>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {/* Download Media Kit */}
        <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#C45A32]/10 text-[#C45A32] flex items-center justify-center font-bold text-xl">
            <FaFilePdf className="w-6 h-6" />
          </div>
          <h3 className="font-poppins font-extrabold text-xl text-zinc-950">Official Press & Media Kit (2026)</h3>
          <p className="font-inter text-xs text-zinc-600 leading-relaxed">
            Includes high-resolution Government logos, brand guidelines, award trophy renders, and official state citations.
          </p>
          <button
            onClick={() => alert("Downloading Official Media Kit ZIP...")}
            className="self-start px-6 py-3 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center gap-2 cursor-pointer mt-2"
          >
            <FaDownload className="w-3.5 h-3.5" />
            <span>Download Media Kit (.ZIP)</span>
          </button>
        </div>

        {/* Official Announcements */}
        <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#21593D]/10 text-[#21593D] flex items-center justify-center font-bold text-xl">
            <FaBullhorn className="w-6 h-6" />
          </div>
          <h3 className="font-poppins font-extrabold text-xl text-zinc-950">State Government Declarations</h3>
          <p className="font-inter text-xs text-zinc-600 leading-relaxed">
            Official gazette notifications, jury appointments, and venue announcements for Raipur Sept 2026.
          </p>
          <button
            onClick={() => alert("Downloading State Declaration PDF...")}
            className="self-start px-6 py-3 rounded-full bg-[#21593D] hover:bg-[#1b4731] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center gap-2 cursor-pointer mt-2"
          >
            <FaDownload className="w-3.5 h-3.5" />
            <span>Download Official Gazette (.PDF)</span>
          </button>
        </div>
      </div>

    </div>
  );
}
