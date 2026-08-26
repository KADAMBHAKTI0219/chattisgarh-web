"use client";

import { FaFilePdf, FaDownload } from "react-icons/fa";

export default function DownloadGuidelinesButton({
  variant = "primary",
  size = "md",
  className = "",
  showText = true,
  customText = "Download Guidelines PDF"
}) {
  const baseClasses =
    "inline-flex items-center gap-2 font-poppins font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-4 py-2 text-xs",
    lg: "px-6 py-3 text-xs sm:text-sm",
  }[size] || "px-4 py-2 text-xs";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white border border-emerald-600/30",
    amber:
      "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border border-amber-500/30",
    outline:
      "border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-50 bg-white",
    dark:
      "bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700",
  }[variant] || "bg-emerald-700 hover:bg-emerald-800 text-white";

  return (
    <a
      href="/assets/Guidelines.pdf"
      download="State_Creator_Awards_2026_Guidelines.pdf"
      target="_blank"
      rel="noopener noreferrer"
      title="Download Official State Creator Awards 2026 Guidelines PDF"
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
    >
      <FaFilePdf className="w-3.5 h-3.5 text-amber-300 shrink-0" />
      {showText && <span>{customText}</span>}
      <FaDownload className="w-3 h-3 text-white/80 shrink-0 ml-0.5" />
    </a>
  );
}
