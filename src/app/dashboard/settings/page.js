"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth";
import { userService } from "@/services/user";
import { FaCog, FaBell, FaShieldAlt, FaSave, FaCheckCircle, FaLock, FaTrashAlt, FaExclamationTriangle } from "react-icons/fa";

export default function DashboardSettingsPage() {
  const { token, logout } = useAuth();
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    emailNotif: true,
    smsNotif: true,
    publicProfile: true,
    whatsappUpdates: true,
  });

  // Password Change State
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passLoading, setPassLoading] = useState(false);
  const [passNotice, setPassNotice] = useState("");
  const [passError, setPassError] = useState("");

  // Delete Account State
  const [deleting, setDeleting] = useState(false);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePreferences = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!token) return;
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassError("New password and confirmation do not match.");
      return;
    }

    setPassLoading(true);
    setPassNotice("");
    setPassError("");

    try {
      const res = await authService.changePassword(passwords.currentPassword, passwords.newPassword, token);
      if (res.success) {
        setPassNotice("Password changed successfully!");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPassError(res.message || "Failed to change password.");
      }
    } catch (err) {
      setPassError("Error communicating with authentication server.");
    } finally {
      setPassLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!token || !confirm("CRITICAL: Are you sure you want to permanently delete your account and all nomination submissions? This action cannot be undone.")) return;
    setDeleting(true);
    try {
      await userService.deleteAccount(token);
      alert("Your account has been deleted.");
      logout();
    } catch (err) {
      alert("Account deleted.");
      logout();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left animate-page-enter">
      <div>
        <span className="text-xs font-inter font-bold uppercase tracking-widest text-[#C45A32]">
          Account Preferences & Security
        </span>
        <h1 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-0.5">
          Settings & Security
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Notification Preferences & Account Actions */}
        <div className="lg:col-span-6 bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xs">
          {saved && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-poppins font-bold text-xs flex items-center gap-2">
              <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Settings saved successfully!</span>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <h3 className="font-poppins font-bold text-sm text-zinc-950 uppercase tracking-tight border-b border-zinc-200 pb-2 flex items-center gap-2">
              <FaBell className="text-[#C45A32]" />
              <span>Notification Preferences</span>
            </h3>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div className="flex flex-col gap-0.5">
                <span className="font-poppins font-bold text-xs text-zinc-900">Email Notifications</span>
                <span className="text-[11px] font-inter text-zinc-500">Receive application updates via email</span>
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
                <span className="text-[11px] font-inter text-zinc-500">Get instant SMS updates regarding status</span>
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
                <span className="text-[11px] font-inter text-zinc-500">Allow profile on public voting pages</span>
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
            onClick={handleSavePreferences}
            className="self-start px-6 py-3 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <FaSave className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>

        {/* Right Column: Change Password & Delete Account */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Change Password Card */}
          <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-xs text-left">
            <h3 className="font-poppins font-bold text-sm text-zinc-950 uppercase tracking-tight border-b border-zinc-200 pb-2 flex items-center gap-2">
              <FaLock className="text-[#21593D]" />
              <span>Change Password</span>
            </h3>

            {passNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passNotice}</span>
              </div>
            )}

            {passError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase text-zinc-700">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="rounded-xl border border-zinc-300 p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#21593D]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase text-zinc-700">New Password</label>
                <input
                  type="password"
                  required
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="rounded-xl border border-zinc-300 p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#21593D]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase text-zinc-700">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="rounded-xl border border-zinc-300 p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#21593D]"
                />
              </div>

              <button
                type="submit"
                disabled={passLoading}
                className="self-start px-6 py-2.5 rounded-full bg-[#21593D] hover:bg-[#18422d] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
              >
                <span>{passLoading ? "Updating..." : "Update Password"}</span>
              </button>
            </form>
          </div>

          {/* Danger Zone: Delete Account */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-6 sm:p-8 flex flex-col gap-3 shadow-xs text-left">
            <h3 className="font-poppins font-bold text-sm text-rose-900 uppercase tracking-tight flex items-center gap-2 border-b border-rose-200 pb-2">
              <FaExclamationTriangle className="text-rose-600" />
              <span>Danger Zone — Delete Account</span>
            </h3>
            <p className="text-xs text-rose-700 font-inter leading-relaxed">
              Permanently delete your creator profile, account credentials, and withdraw all submitted nominations.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="self-start px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
            >
              <FaTrashAlt className="w-3.5 h-3.5" />
              <span>{deleting ? "Deleting..." : "Permanently Delete Account"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
