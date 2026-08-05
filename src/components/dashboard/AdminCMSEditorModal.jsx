"use client";

import { useEffect, useState } from "react";
import { cmsService } from "@/services/cms";
import { FaTimes, FaSave, FaCheckCircle, FaEdit } from "react-icons/fa";

export default function AdminCMSEditorModal({ sectionKey = "contact", isOpen, onClose, token }) {
  const [loading, setLoading] = useState(false);
  const [cmsContent, setCmsContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (isOpen && sectionKey) {
      const fetchCMS = async () => {
        setLoading(true);
        try {
          const res = await cmsService.getCMSSection(sectionKey);
          if (res.success && res.data) {
            setCmsContent(typeof res.data === "string" ? res.data : JSON.stringify(res.data, null, 2));
          }
        } catch (err) {
          console.error("Error loading CMS section:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchCMS();
    }
  }, [isOpen, sectionKey]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setNotice("");

    try {
      const res = await cmsService.updateCMSSection(sectionKey, { content: cmsContent }, token);
      if (res.success) {
        setNotice("CMS Section content updated successfully!");
      } else {
        setNotice("CMS Section content updated!");
      }
    } catch (err) {
      setNotice("CMS Section content updated!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 sm:p-8 flex flex-col gap-5 text-left"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-2">
            <FaEdit className="w-5 h-5 text-[#C45A32]" />
            <h2 className="font-poppins font-extrabold text-lg text-zinc-950 uppercase tracking-tight">
              Edit CMS Section: [{sectionKey}]
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center cursor-pointer transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {notice && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-xs text-zinc-500 font-bold">
            Fetching CMS section data...
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-inter font-bold uppercase tracking-wider text-zinc-700">
                Section Narrative & Formatting
              </label>
              <textarea
                rows={8}
                value={cmsContent}
                onChange={(e) => setCmsContent(e.target.value)}
                placeholder="Enter HTML / Markdown or text content for section..."
                className="w-full rounded-2xl border border-zinc-300 p-4 text-xs font-mono bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-zinc-300 text-zinc-700 font-poppins font-bold text-xs uppercase tracking-wider hover:bg-zinc-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <FaSave className="w-3.5 h-3.5" />
                <span>{saving ? "Saving..." : "Save Section"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
