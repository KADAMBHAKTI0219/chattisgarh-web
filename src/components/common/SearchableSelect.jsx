"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSearch, FaCheck, FaMapMarkerAlt } from "react-icons/fa";

export default function SearchableSelect({
  options = [],
  value = "",
  onChange,
  placeholder = "Select District",
  label,
  error,
  disabled = false,
  icon: Icon = FaMapMarkerAlt,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter((opt) => {
    const text = typeof opt === "string" ? opt : opt.label || opt.name || "";
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSelect = (optionValue) => {
    if (disabled) return;
    const selectedVal = typeof optionValue === "string" ? optionValue : optionValue.value || optionValue.name;
    if (onChange) {
      onChange(selectedVal);
    }
    setIsOpen(false);
    setSearchQuery("");
  };

  const displayValue = () => {
    if (!value) return placeholder;
    const found = options.find((opt) => {
      const optVal = typeof opt === "string" ? opt : opt.value || opt.name;
      return optVal === value;
    });
    if (!found) return value;
    return typeof found === "string" ? found : found.label || found.name;
  };

  const isSingleOption = options.length === 1;
  const isFieldDisabled = disabled || isSingleOption;

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-[11px] font-inter font-bold uppercase tracking-wider text-zinc-700 mb-1">
          {label}
        </label>
      )}

      {/* Trigger Button or Read-Only Box */}
      <button
        type="button"
        disabled={isFieldDisabled}
        onClick={() => !isFieldDisabled && setIsOpen((prev) => !prev)}
        className={`w-full relative flex items-center justify-between ${Icon ? "pl-10" : "pl-4"} pr-3.5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm ${
          isFieldDisabled
            ? "bg-zinc-100/80 border-zinc-200 text-zinc-700 cursor-not-allowed"
            : error
            ? "border-red-500 ring-2 ring-red-500/20 text-zinc-900 bg-white"
            : isOpen
            ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20 text-zinc-900 bg-white"
            : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-400"
        }`}
      >
        {/* Leading Icon */}
        {Icon && (
          <Icon className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isFieldDisabled ? "text-[var(--primary)]" : "text-zinc-400"}`} />
        )}

        {/* Selected Text / Placeholder */}
        <span className={`truncate text-left ${!value ? "text-zinc-400" : "text-zinc-900 font-bold"}`}>
          {displayValue()}
        </span>

        {/* Dropdown Chevron Icon (hidden if single option) */}
        {!isSingleOption && (
          <FaChevronDown
            className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[var(--primary)]" : ""
            }`}
          />
        )}
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && !isSingleOption && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search Box inside Dropdown */}
          <div className="relative mb-2 px-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-3 h-3" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search option..."
              className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
            />
          </div>

          {/* Options Scroll List */}
          <div className="max-h-56 overflow-y-auto custom-scrollbar flex flex-col gap-0.5 pr-1">
            {filteredOptions.length === 0 ? (
              <div className="py-3 px-4 text-center text-xs font-medium text-zinc-400">
                No matching option found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const optVal = typeof opt === "string" ? opt : opt.value || opt.name;
                const optLabel = typeof opt === "string" ? opt : opt.label || opt.name;
                const isSelected = optVal === value;

                return (
                  <button
                    key={optVal}
                    type="button"
                    onClick={() => handleSelect(optVal)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-left transition-colors ${
                      isSelected
                        ? "bg-[var(--primary)]/10 text-[var(--primary)] font-bold"
                        : "text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950"
                    }`}
                  >
                    <span className="truncate">{optLabel}</span>
                    {isSelected && <FaCheck className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && <span className="text-red-500 text-[10px] font-bold mt-1 block">{error}</span>}
    </div>
  );
}
