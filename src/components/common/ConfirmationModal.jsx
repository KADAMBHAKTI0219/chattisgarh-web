"use client";

import React, { useEffect } from "react";
import { FaExclamationTriangle, FaTrash, FaCheckCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

export default function ConfirmationModal({
  isOpen = false,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // "danger" | "warning" | "info" | "success"
  loading = false,
}) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: <FaTrash className="w-6 h-6 text-red-600" />,
          bgIcon: "bg-red-100/80 border-red-200",
          btnColor: "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20",
        };
      case "warning":
        return {
          icon: <FaExclamationTriangle className="w-6 h-6 text-amber-600" />,
          bgIcon: "bg-amber-100/80 border-amber-200",
          btnColor: "bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/20",
        };
      case "success":
        return {
          icon: <FaCheckCircle className="w-6 h-6 text-emerald-600" />,
          bgIcon: "bg-emerald-100/80 border-emerald-200",
          btnColor: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20",
        };
      case "info":
      default:
        return {
          icon: <FaInfoCircle className="w-6 h-6 text-blue-600" />,
          bgIcon: "bg-blue-100/80 border-blue-200",
          btnColor: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20",
        };
    }
  };

  const style = getTypeStyles();

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={!loading ? onClose : undefined} />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-zinc-200 flex flex-col gap-5 text-left z-10 animate-in zoom-in-95 duration-200">
        
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${style.bgIcon}`}>
              {style.icon}
            </div>
            <div className="flex flex-col">
              <h3 className="text-base sm:text-lg font-poppins font-extrabold text-zinc-950 leading-snug">
                {title}
              </h3>
              <span className="text-[10px] font-inter font-bold text-zinc-400 uppercase tracking-widest">
                Confirmation Required
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 text-zinc-400 hover:text-zinc-700 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-40"
            aria-label="Close modal"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Message */}
        <p className="text-xs sm:text-sm font-inter text-zinc-650 leading-relaxed font-medium bg-zinc-50/80 p-4 rounded-2xl border border-zinc-150">
          {message}
        </p>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-2xl border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-poppins font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2.5 rounded-2xl font-poppins font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${style.btnColor} disabled:opacity-50`}
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
