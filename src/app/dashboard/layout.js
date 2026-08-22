"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FaTachometerAlt,
  FaThList,
  FaVoteYea,
  FaUsers,
  FaFileAlt,
  FaBell,
  FaChartPie,
  FaCog,
  FaUserCircle,
  FaSignOutAlt,
  FaHeadset,
  FaSearch,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaThLarge,
  FaLayerGroup,
  FaCommentDots,
  FaCalendarAlt,
  FaBookOpen,
  FaQuestionCircle,
  FaGlobe,
  FaNewspaper
} from "react-icons/fa";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, logout, isAdmin, isJury, isSuperAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentTab = searchParams.get("tab") || "overview";

  const userName = user?.name || (isAdmin ? "System Administrator" : "Kadam Bhakti");
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "KB";

  const userRoleLabel = isSuperAdmin
    ? "Super Admin"
    : isAdmin
    ? "Administrator"
    : isJury
    ? "Jury Panel"
    : "Creator";

  // Sidebar links configuration (Admin vs Creator)
  const adminMenuLinks = [
    { name: "Dashboard", href: "/dashboard", tabKey: "overview", icon: FaTachometerAlt },
    { name: "Categories", href: "/dashboard?tab=categories", tabKey: "categories", icon: FaThList },
    { name: "Public Votes", href: "/dashboard?tab=votes", tabKey: "votes", icon: FaVoteYea },
    { name: "Participants", href: "/dashboard?tab=participants", tabKey: "participants", icon: FaUsers },
    { name: "Users", href: "/dashboard?tab=users", tabKey: "users", icon: FaUserCircle },
    { name: "News & Press", href: "/dashboard?tab=news", tabKey: "news", icon: FaNewspaper },
    { name: "Notifications", href: "/dashboard/notifications", tabKey: "notifications", icon: FaBell, badge: "3" },
    { name: "Reports", href: "/dashboard/reports", tabKey: "reports", icon: FaChartPie },
    { name: "Settings", href: "/dashboard/settings", tabKey: "settings", icon: FaCog },
    { name: "Move to Website", href: "/", tabKey: "website", icon: FaGlobe },
  ];

  const creatorMenuLinks = [
    { name: "Dashboard", href: "/dashboard", tabKey: "overview", icon: FaThLarge },
    { name: "My Profile", href: "/dashboard/profile", tabKey: "profile", icon: FaUserCircle },
    { name: "My Participation", href: "/dashboard?tab=participation", tabKey: "participation", icon: FaLayerGroup },
    { name: "My Submissions", href: "/dashboard/applications", tabKey: "applications", icon: FaFileAlt },
    { name: "Messages", href: "/dashboard/messages", tabKey: "messages", icon: FaCommentDots, badge: "3" },
    { name: "Notifications", href: "/dashboard/notifications", tabKey: "notifications", icon: FaBell, badge: "5" },
    { name: "Move to Website", href: "/", tabKey: "website", icon: FaGlobe },
  ];

  const mainMenuLinks = isAdmin ? adminMenuLinks : creatorMenuLinks;

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#F8FAFC] font-montserrat text-zinc-900 flex flex-col lg:flex-row relative">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white border-b border-zinc-200/80 px-4 py-3 flex items-center justify-between shrink-0 z-40 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            {userInitials}
          </div>
          <div className="flex flex-col text-left">
            <span className="font-poppins font-bold text-xs text-zinc-950 truncate max-w-[160px]">{userName}</span>
            <span className="text-[10px] font-inter font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full self-start mt-0.5">
              {userRoleLabel}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2.5 rounded-xl bg-zinc-100 text-zinc-800 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer border border-zinc-200"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Static Sidebar Navigation */}
      <aside
        className={`w-full lg:w-64 bg-white border-r border-zinc-200/80 h-full flex flex-col justify-between shrink-0 transition-all duration-300 z-50 ${
          isMobileMenuOpen
            ? "fixed inset-y-0 left-0 w-4/5 max-w-xs shadow-2xl flex"
            : "hidden lg:flex"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto p-4 sm:p-5">
          
          {/* Logo Header: CHHATTISGARH YOUTH PORTAL */}
          <div className="flex items-center gap-3 pb-5 border-b border-zinc-150 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/80">
              <Image
                src="/assets/images/logoChattisgarh.png"
                alt="Chhattisgarh Logo"
                width={32}
                height={32}
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <h2 className="font-poppins font-extrabold text-xs tracking-wider text-emerald-950 uppercase leading-tight">
                CHHATTISGARH
              </h2>
              <span className="font-poppins font-bold text-[11px] text-emerald-700 uppercase tracking-widest">
                YOUTH PORTAL
              </span>
            </div>
          </div>

          {/* MAIN MENU Navigation */}
          <div className="mt-5 flex flex-col gap-1 flex-1">
            {mainMenuLinks.map((link) => {
              const Icon = link.icon;
              const isTabActive = pathname === "/dashboard" && (
                (link.tabKey === "overview" && (!currentTab || currentTab === "overview")) ||
                currentTab === link.tabKey
              );
              const isPageActive = pathname !== "/dashboard" && pathname === link.href.split("?")[0];
              const isActive = isTabActive || isPageActive;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-poppins text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-100/80 text-emerald-900 font-bold shadow-2xs"
                      : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-950"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-700" : "text-zinc-400"}`} />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-600 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                logout();
              }}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-poppins text-xs font-semibold text-zinc-600 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer w-full text-left mt-2"
            >
              <FaSignOutAlt className="w-4 h-4 text-zinc-400" />
              <span>Logout</span>
            </button>
          </div>

        </div>

        {/* Sidebar Bottom Banner Card matching Image 2 */}
        <div className="p-4 border-t border-zinc-150 shrink-0">
          <div className="relative rounded-2xl p-4 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white overflow-hidden shadow-md">
            <div className="relative z-10 flex flex-col text-center">
              <span className="font-poppins font-extrabold text-xs sm:text-sm text-amber-300 drop-shadow-xs leading-relaxed">
                हर एक स्क्रीन पर छाएगा छत्तीसगढ़
              </span>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:8px_8px] opacity-15 pointer-events-none" />
          </div>
        </div>
      </aside>

      {/* Main Dashboard Workspace Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        
        {/* Top Navbar Header */}
        <header className="bg-white border-b border-zinc-200/80 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 shrink-0 z-30 shadow-2xs">
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[11px] sm:text-xs text-zinc-500 font-inter font-medium">Welcome back,</span>
            <h1 className="text-base sm:text-2xl font-poppins font-extrabold text-zinc-950 flex items-center gap-1.5 mt-0.5 truncate">
              <span>{isAdmin ? "Admin" : userName}</span> 👋
            </h1>
            <p className="text-xs font-inter text-zinc-500 hidden sm:block mt-0.5">
              {isAdmin
                ? "Manage public voting, categories, and monitor real-time results."
                : "Keep participating and showcase your talent!"}
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/"
              className="px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#E6532B] font-poppins font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Return to Main Portal Website"
            >
              <FaGlobe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Move to Website</span>
            </Link>

            <button className="p-2.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-600 relative cursor-pointer shadow-2xs">
              <FaBell className="w-4.5 h-4.5" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2 ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-zinc-200">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile Avatar"
                  className="w-10 h-10 rounded-full object-cover border border-zinc-300 shadow-2xs"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white flex items-center justify-center font-bold font-poppins text-xs shadow-2xs border border-emerald-700">
                  {userInitials}
                </div>
              )}
              <div className="flex flex-col text-left hidden sm:flex">
                <span className="font-poppins font-bold text-xs text-zinc-950">{userName}</span>
                <span className="text-[10px] font-inter text-zinc-400 font-medium">{userRoleLabel}</span>
              </div>
              <FaChevronDown className="w-3 h-3 text-zinc-400" />
            </div>
          </div>
        </header>

        {/* Scrollable Main Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
