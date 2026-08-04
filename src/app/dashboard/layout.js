"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FaTachometerAlt,
  FaUserCircle,
  FaFileAlt,
  FaBell,
  FaAward,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaTimes
} from "react-icons/fa";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { user, logout, isAdmin, isJury, isSuperAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userName = user?.name || "Verified Creator";
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "CR";

  const userRoleLabel = isSuperAdmin
    ? "Super Admin"
    : isAdmin
    ? "Administrator"
    : isJury
    ? "Jury Panel"
    : "Verified Creator";

  const sidebarLinks = [
    { name: "Overview", href: "/dashboard", icon: FaTachometerAlt },
    { name: "My Profile", href: "/dashboard/profile", icon: FaUserCircle },
    { name: "My Applications", href: "/dashboard/applications", icon: FaFileAlt },
    { name: "Notifications", href: "/dashboard/notifications", icon: FaBell, badge: "3" },
    { name: "Certificates", href: "/dashboard/certificates", icon: FaAward },
    { name: "Settings", href: "/dashboard/settings", icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F0] font-sans text-zinc-950 flex flex-col lg:flex-row relative">
      
      {/* Mobile Top Header Bar with Menu Icon */}
      <div className="lg:hidden bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C45A32] to-[#D4A534] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
            {userInitials}
          </div>
          <div className="flex flex-col text-left">
            <span className="font-poppins font-bold text-xs text-zinc-950 truncate max-w-[180px]">{userName}</span>
            <span className="text-[9.5px] font-inter font-bold text-emerald-700 uppercase">{userRoleLabel}</span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2.5 rounded-xl bg-zinc-100 text-zinc-800 hover:bg-[#C45A32] hover:text-white transition-all cursor-pointer border border-zinc-200"
          aria-label="Toggle Dashboard Menu"
        >
          {isMobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Navigation (Desktop Static, Mobile Sliding Drawer) */}
      <aside
        className={`w-full lg:w-72 bg-white border-r border-zinc-200/90 flex flex-col shrink-0 transition-all duration-300 z-50 ${
          isMobileMenuOpen
            ? "fixed inset-y-0 left-0 w-4/5 max-w-xs shadow-2xl flex"
            : "hidden lg:flex"
        }`}
      >
        
        {/* Top User Profile Header */}
        <div className="p-6 border-b border-zinc-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C45A32] to-[#D4A534] text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              {userInitials}
            </div>
            <div className="flex flex-col text-left min-w-0">
              <h3 className="font-poppins font-bold text-sm text-zinc-950 truncate">
                {userName}
              </h3>
              <span className="text-[11px] font-inter font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 self-start mt-0.5">
                {userRoleLabel}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl font-poppins font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#C45A32] text-white shadow-md"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? "bg-white text-[#C45A32]" : "bg-[#C45A32]/15 text-[#C45A32]"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Home & Logout CTA */}
        <div className="p-4 border-t border-zinc-200/80 flex flex-col gap-2">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-poppins font-bold text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <FaHome className="w-4 h-4 text-zinc-500" />
            <span>Return to Portal Home</span>
          </Link>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              logout();
            }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-poppins font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer w-full text-left"
          >
            <FaSignOutAlt className="w-4 h-4 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
  );
}
