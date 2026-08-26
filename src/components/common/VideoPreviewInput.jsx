"use client";

import { useState } from "react";
import {
  FaYoutube,
  FaInstagram,
  FaVimeo,
  FaLink,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaVideo,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

/**
 * Helper to extract video embed info from YouTube, Instagram, Vimeo or general video URLs.
 */
export function getEmbedInfo(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return null;
  }

  // 1. YouTube (Watch, Shorts, Embed, Short URLs)
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`,
      videoId: ytMatch[1],
      platformName: "YouTube Video / Reel",
      isShorts: trimmed.includes("/shorts/"),
    };
  }

  // 2. Instagram Reel / Post
  const igMatch = trimmed.match(
    /instagram\.com\/(?:reel|reels|p)\/([a-zA-Z0-9_-]+)/i
  );
  if (igMatch && igMatch[1]) {
    return {
      type: "instagram",
      embedUrl: `https://www.instagram.com/p/${igMatch[1]}/embed`,
      code: igMatch[1],
      platformName: "Instagram Reel / Post",
    };
  }

  // 3. Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      videoId: vimeoMatch[1],
      platformName: "Vimeo Video",
    };
  }

  // 4. Generic valid URL
  try {
    const parsed = new URL(trimmed);
    return {
      type: "generic",
      domain: parsed.hostname.replace("www.", ""),
      platformName: parsed.hostname.replace("www.", ""),
    };
  } catch (e) {
    return null;
  }
}

export default function VideoPreviewInput({
  label,
  name,
  value = "",
  onChange,
  placeholder = "https://youtube.com/watch?v=... or https://instagram.com/reel/...",
  required = false,
  error = "",
  className = "",
  inputClassName = "",
}) {
  const [showPreview, setShowPreview] = useState(true);
  const embedInfo = getEmbedInfo(value);

  const renderIcon = () => {
    if (!embedInfo) return <FaLink className="text-zinc-400 w-3.5 h-3.5" />;
    switch (embedInfo.type) {
      case "youtube":
        return <FaYoutube className="text-red-600 w-4 h-4" />;
      case "instagram":
        return <FaInstagram className="text-pink-600 w-4 h-4" />;
      case "vimeo":
        return <FaVimeo className="text-sky-500 w-4 h-4" />;
      default:
        return <FaVideo className="text-amber-600 w-3.5 h-3.5" />;
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {embedInfo && (
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-[10px] font-bold text-zinc-500 hover:text-zinc-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {showPreview ? <FaEyeSlash className="w-3 h-3" /> : <FaEye className="w-3 h-3" />}
              <span>{showPreview ? "Hide Preview" : "Show Video Preview"}</span>
            </button>
          )}
        </div>
      )}

      {/* Input container with dynamic platform icon badge */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center shrink-0">
          {renderIcon()}
        </div>
        <input
          type="url"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-10 pr-9 py-2.5 rounded-xl border bg-zinc-50/50 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all ${
            error ? "border-red-500 bg-red-50/20" : "border-zinc-300"
          } ${inputClassName}`}
        />
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            title="Open video link in new tab to test"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[var(--primary)] transition-colors p-1"
          >
            <FaExternalLinkAlt className="w-3 h-3" />
          </a>
        )}
      </div>

      {error && <span className="text-red-500 text-[10px] font-bold">{error}</span>}

      {/* Live Video Preview Box */}
      {value && embedInfo && showPreview && (
        <div className="mt-1 p-3 rounded-2xl bg-zinc-900 text-white border border-zinc-800 shadow-md flex flex-col gap-2.5 animate-in fade-in duration-200">
          {/* Header Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/10 flex items-center justify-center">
                {renderIcon()}
              </span>
              <div className="flex flex-col">
                <span className="text-[11px] font-poppins font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FaCheckCircle className="w-3 h-3 text-emerald-400" />
                  <span>{embedInfo.platformName} Verified</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[240px] sm:max-w-[400px]">
                  {value}
                </span>
              </div>
            </div>
          </div>

          {/* Embed Player */}
          {embedInfo.embedUrl ? (
            <div className="relative w-full rounded-xl overflow-hidden bg-black border border-white/10 aspect-video shadow-inner flex items-center justify-center">
              <iframe
                src={embedInfo.embedUrl}
                title="Video Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0 rounded-xl"
              />
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-zinc-300 flex items-center justify-center gap-2">
              <FaVideo className="w-4 h-4 text-amber-400" />
              <span>Link recorded successfully.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
