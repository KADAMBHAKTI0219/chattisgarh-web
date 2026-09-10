"use client";

import { useState } from "react";
import { FaFilePdf, FaDownload, FaChevronDown } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export default function DownloadGuidelinesButton({ className = "" }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languageOptions = [
    { lang: "en", label: "English Guidelines", sublabel: "Official English PDF", flag: "🇬🇧" },
    { lang: "hi", label: "हिंदी दिशानिर्देश", sublabel: "आधिकारिक हिंदी PDF", flag: "🇮🇳" },
    { lang: "cg", label: "छत्तीसगढ़ी दिशानिर्देश", sublabel: "आधिकारिक छत्तीसगढ़ी PDF", flag: "🏛️" },
  ];

  const handleDownload = (langCode) => {
    setIsOpen(false);
    window.open(`/api/download-guidelines?lang=${langCode}`, "_blank");
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C15B3D] via-[#D39B2C] to-[#C15B3D] hover:opacity-95 text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer select-none"
      >
        <FaFilePdf className="w-4 h-4" />
        <span>{t("Download Guidelines")}</span>
        <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 p-2 flex flex-col gap-1 text-left animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="px-3 py-1.5 text-[10px] font-poppins font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
              Select PDF Language
            </span>
            {languageOptions.map((opt) => (
              <button
                key={opt.lang}
                type="button"
                onClick={() => handleDownload(opt.lang)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors group cursor-pointer text-left w-full"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{opt.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-poppins font-bold text-xs text-zinc-900 group-hover:text-[#C15B3D]">
                      {opt.label}
                    </span>
                    <span className="text-[10px] font-inter text-zinc-400">
                      {opt.sublabel}
                    </span>
                  </div>
                </div>
                <FaDownload className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#C15B3D] transition-colors" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

