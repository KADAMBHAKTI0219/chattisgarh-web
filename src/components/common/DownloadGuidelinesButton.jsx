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

  const handleDownload = async (e) => {
    // Detect iOS (iPhone / iPad / iPod)
    const isIOS =
      typeof navigator !== "undefined" &&
      (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

    if (isIOS) {
      // On iOS Safari, synthetic click on blob: URL causes a 404 / WebKit error.
      // Opening the PDF directly in a tab lets iOS Safari open its native PDF viewer cleanly.
      window.open("/assets/Guidelines.pdf", "_blank");
      return;
    }

    e.preventDefault();
    const pdfUrl = "/assets/Guidelines.pdf";
    const fileName = "State_Creator_Awards_2026_Guidelines.pdf";

    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.warn("Direct blob download failed, falling back to window.open", err);
      window.open(pdfUrl, "_blank");
    }
  };

  return (
    <a
      href="/assets/Guidelines.pdf"
      download="State_Creator_Awards_2026_Guidelines.pdf"
      onClick={handleDownload}
      title="Download Official State Creator Awards 2026 Guidelines PDF"
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
    >
      <FaFilePdf className="w-3.5 h-3.5 text-amber-300 shrink-0" />
      {showText && <span>{customText}</span>}
      <FaDownload className="w-3 h-3 text-white/80 shrink-0 ml-0.5" />
    </a>
  );
}
