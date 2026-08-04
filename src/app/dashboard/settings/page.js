"use client";

import { useState } from "react";
import { FaCog, FaBell, FaShieldAlt, FaSave, FaCheckCircle } from "react-icons/fa";

export default function DashboardSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    emailNotif: true,
    smsNotif: true,
    publicProfile: true,
    whatsappUpdates: true,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 text-left animate-page-enter">
      <div>
        <span className="text-xs font-inter font-bold uppercase tracking-widest text-[#C45A32]">
          Account Preferences
        </span>
        <h1 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-0.5">
          Settings & Notifications
        </h1>
      </div>

      <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xs max-w-3xl">
        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-poppins font-bold text-xs flex items-center gap-2">
            <FaCheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <h3 className="font-poppins font-bold text-sm text-zinc-950 uppercase tracking-tight border-b border-zinc-200 pb-2">
            Notification Preferences
          </h3>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="flex flex-col gap-0.5">
              <span className="font-poppins font-bold text-xs text-zinc-900">Email Notifications</span>
              <span className="text-[11px] font-inter text-zinc-500">Receive application updates and announcements via email</span>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotif}
              onChange={() => handleToggle("emailNotif")}
              className="w-5 h-5 rounded text-[var(--primary)] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="flex flex-col gap-0.5">
              <span className="font-poppins font-bold text-xs text-zinc-900">SMS Alerts</span>
              <span className="text-[11px] font-inter text-zinc-500">Get instant SMS updates regarding shortlist status</span>
            </div>
            <input
              type="checkbox"
              checked={settings.smsNotif}
              onChange={() => handleToggle("smsNotif")}
              className="w-5 h-5 rounded text-[var(--primary)] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="flex flex-col gap-0.5">
              <span className="font-poppins font-bold text-xs text-zinc-900">Public Creator Profile</span>
              <span className="text-[11px] font-inter text-zinc-500">Allow your creator profile to be featured on public choice voting pages</span>
            </div>
            <input
              type="checkbox"
              checked={settings.publicProfile}
              onChange={() => handleToggle("publicProfile")}
              className="w-5 h-5 rounded text-[var(--primary)] cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="self-start px-6 py-3 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center gap-2 cursor-pointer mt-2"
        >
          <FaSave className="w-3.5 h-3.5" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
}
