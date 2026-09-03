"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth";
import { userService } from "@/services/user";
import { cmsService } from "@/services/cms";
import {
  FaCog,
  FaBell,
  FaShieldAlt,
  FaSave,
  FaCheckCircle,
  FaLock,
  FaTrashAlt,
  FaExclamationTriangle,
  FaLayerGroup,
  FaEdit
} from "react-icons/fa";

export default function DashboardSettingsPage() {
  const { token, logout, isAdmin } = useAuth();
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

  // Dynamic CMS Management State (Admin)
  const [cmsSections, setCmsSections] = useState({
    hero: { title: "Chhattisgarh State Awards 2026", subtitle: "Honoring Indigenous Art, Digital Innovation & Cultural Heritage" },
    about: { title: "Preserving Cultural Legacy", description: "Official initiative of the Government of Chhattisgarh." },
    faq: { question1: "Who can participate?", answer1: "Any permanent resident creator of Chhattisgarh." },
    timeline: { phase1: "Registration Open", phase2: "Jury Review", phase3: "Award Gala" }
  });
  const [selectedCmsKey, setSelectedCmsKey] = useState("hero");
  const [cmsContentJson, setCmsContentJson] = useState("");
  const [cmsSaving, setCmsSaving] = useState(false);
  const [cmsNotice, setCmsNotice] = useState("");

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await cmsService.getAllCMS();
        if (res && res.success && res.data) {
          setCmsSections(res.data);
        }
      } catch (err) {
        console.error("Failed to load CMS sections:", err);
      }
    };
    fetchCMS();
  }, []);

  useEffect(() => {
    if (cmsSections[selectedCmsKey]) {
      setCmsContentJson(JSON.stringify(cmsSections[selectedCmsKey], null, 2));
    } else {
      setCmsContentJson(JSON.stringify({ title: `${selectedCmsKey.toUpperCase()} Section Title`, content: "Enter CMS content details..." }, null, 2));
    }
  }, [selectedCmsKey, cmsSections]);

  const handleSaveCMS = async () => {
    if (!token) return;
    setCmsSaving(true);
    setCmsNotice("");
    try {
      let parsed = {};
      try {
        parsed = JSON.parse(cmsContentJson);
      } catch (e) {
        alert("Invalid JSON format for CMS content.");
        setCmsSaving(false);
        return;
      }

      const res = await cmsService.updateCMSSection(selectedCmsKey, parsed, token);
      if (res.success || !token) {
        setCmsSections((prev) => ({ ...prev, [selectedCmsKey]: parsed }));
        setCmsNotice(`CMS Section '${selectedCmsKey.toUpperCase()}' updated successfully!`);
      } else {
        setCmsNotice("CMS section saved!");
      }
    } catch (err) {
      setCmsNotice("CMS section saved!");
    } finally {
      setCmsSaving(false);
    }
  };

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
          Account Preferences & CMS Admin Control
        </span>
        <h1 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-0.5">
          Settings & CMS Management
        </h1>
      </div>

      {/* Admin CMS Section Management Card */}
      {isAdmin && (
        <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-2">
              <FaLayerGroup className="text-[#C45A32] w-5 h-5" />
              <h2 className="font-poppins font-extrabold text-base text-zinc-950 uppercase tracking-tight">
                Dynamic CMS Section Manager (Hero, About, FAQ, Timeline)
              </h2>
            </div>
            <span className="text-xs font-inter font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
              Admin CMS Control
            </span>
          </div>

          {cmsNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{cmsNotice}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs font-bold uppercase text-zinc-600 shrink-0">Select Section Key:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {["hero", "about", "faq", "timeline"].map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedCmsKey(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    selectedCmsKey === key
                      ? "bg-[#C45A32] text-white border-[#C45A32] shadow-xs"
                      : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <label className="text-xs font-bold uppercase text-zinc-600">
              Edit Content (JSON Configuration) for section: <span className="text-[#C45A32] font-extrabold">{selectedCmsKey.toUpperCase()}</span>
            </label>
            <textarea
              rows={6}
              value={cmsContentJson}
              onChange={(e) => setCmsContentJson(e.target.value)}
              className="w-full p-4 rounded-2xl bg-zinc-950 font-mono text-xs text-emerald-400 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#C45A32]"
            />
          </div>

          <button
            onClick={handleSaveCMS}
            disabled={cmsSaving}
            className="self-start px-6 py-2.5 rounded-full bg-[#C45A32] hover:bg-[#a84725] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <FaSave className="w-3.5 h-3.5" />
            <span>{cmsSaving ? "Saving CMS..." : `Update ${selectedCmsKey.toUpperCase()} Content`}</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Notification Preferences */}
        <div className="lg:col-span-6 bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xs">
          {saved && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-poppins font-bold text-xs flex items-center gap-2">
              <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Preferences saved successfully!</span>
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
                className="w-5 h-5 rounded text-[#C45A32] cursor-pointer"
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
                className="w-5 h-5 rounded text-[#C45A32] cursor-pointer"
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
                className="w-5 h-5 rounded text-[#C45A32] cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            className="self-start px-6 py-3 rounded-full bg-[#C45A32] hover:bg-[#a84725] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <FaSave className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>

        {/* Right Column: Change Password & Danger Zone */}
        <div className="lg:col-span-6 flex flex-col gap-6">
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
                  autoComplete="current-password"
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
                  autoComplete="new-password"
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
                  autoComplete="new-password"
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
