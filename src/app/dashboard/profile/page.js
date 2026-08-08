"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user";
import { creatorService } from "@/services/creator";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaYoutube, FaInstagram, FaFacebook, FaAward, FaEdit, FaSave, FaCheckCircle, FaCamera, FaTrashAlt } from "react-icons/fa";

export default function CreatorProfilePage() {
  const { user, token, refreshUser, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    district: user?.district || "Raipur",
    state: user?.state || "Chhattisgarh",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
    youtube: "",
    instagram: "",
    facebook: "",
    linkedin: "",
  });

  useEffect(() => {
    if (user) {
      const getSocialUrl = (platform) => {
        if (!user.socialLinks || !Array.isArray(user.socialLinks)) return "";
        const found = user.socialLinks.find((s) => s.platform === platform);
        return found ? found.url : "";
      };

      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        district: user.district || "Raipur",
        state: user.state || "Chhattisgarh",
        bio: user.bio || "",
        avatar: user.avatar || "",
        youtube: getSocialUrl("youtube"),
        instagram: getSocialUrl("instagram"),
        facebook: getSocialUrl("facebook"),
        linkedin: getSocialUrl("linkedin"),
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Profile Picture Image Upload
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size should be less than 5 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result;
      if (base64Url) {
        setFormData((prev) => ({ ...prev, avatar: base64Url }));
        setSuccessMsg("Profile picture preview loaded! Click 'Save Profile' to save.");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // 1. Update basic profile info + Avatar
      if (token) {
        await userService.updateProfile(
          {
            name: formData.name,
            phone: formData.phone,
            district: formData.district,
            state: formData.state,
            bio: formData.bio,
            avatar: formData.avatar,
          },
          token
        );
      }

      // 2. Update Social Links
      const socialLinksArray = [
        { platform: "youtube", url: formData.youtube },
        { platform: "instagram", url: formData.instagram },
        { platform: "facebook", url: formData.facebook },
        { platform: "linkedin", url: formData.linkedin },
      ].filter((item) => item.url && item.url.trim() !== "");

      if (token) {
        await creatorService.updateSocialLinks(socialLinksArray, token);
      }

      // 3. Update AuthContext locally so top navbar and sidebar update instantly!
      updateUser({
        name: formData.name,
        phone: formData.phone,
        district: formData.district,
        state: formData.state,
        bio: formData.bio,
        avatar: formData.avatar,
      });

      setSuccessMsg("Profile picture & personal details updated successfully!");
      setIsEditing(false);
      if (token) await refreshUser();
    } catch (err) {
      setErrorMsg("An error occurred while saving profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left animate-page-enter">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-inter font-bold uppercase tracking-widest text-[#C45A32]">
            Creator Identity
          </span>
          <h1 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-0.5">
            My Official Profile
          </h1>
        </div>

        <button
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          disabled={loading}
          className="px-5 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isEditing ? <FaSave className="w-3.5 h-3.5" /> : <FaEdit className="w-3.5 h-3.5" />}
          <span>{loading ? "Saving..." : isEditing ? "Save Profile" : "Edit Profile"}</span>
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Avatar Card & Badges */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center gap-5 shadow-xs">
          
          {/* Avatar Container with Upload Camera Overlay */}
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#C45A32] via-[#D4A534] to-[#21593D] p-1 shadow-md relative overflow-hidden">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={formData.name || "Profile"}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-3xl font-poppins">
                  {formData.name ? formData.name.substring(0, 2).toUpperCase() : "CG"}
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/webp, image/jpg"
              onChange={handleAvatarChange}
              className="hidden"
            />

            {/* Camera Upload Badge Overlay */}
            <div
              className="absolute inset-0 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all backdrop-blur-[2px]"
              title="Upload Profile Picture"
            >
              <FaCamera className="w-6 h-6 text-white mb-0.5" />
              <span className="text-[9px] font-poppins font-bold uppercase tracking-wider">Change Photo</span>
            </div>

            {/* Verified Badge */}
            <span className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-sm border-2 border-white" title="Verified Creator">
              ✓
            </span>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-poppins font-bold text-[#C45A32] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
          >
            <FaCamera className="w-3.5 h-3.5" />
            <span>Upload Profile Picture</span>
          </button>

          <div className="flex flex-col gap-1">
            <h2 className="font-poppins font-extrabold text-xl text-zinc-950">{formData.name || "Creator Profile"}</h2>
            <span className="text-xs font-inter font-medium text-zinc-500 flex items-center justify-center gap-1">
              <FaMapMarkerAlt className="w-3 h-3 text-[#C45A32]" />
              {formData.district}, {formData.state}
            </span>
          </div>

          {/* Achievements */}
          <div className="w-full pt-4 border-t border-zinc-200 flex flex-col gap-2.5 text-left">
            <span className="text-[11px] font-inter font-bold uppercase tracking-wider text-zinc-400">Achievements</span>
            <div className="flex flex-col gap-2">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                <FaAward className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-poppins font-bold text-zinc-900">District Creator Award 2026 Nominee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Social Media */}
        <div className="lg:col-span-8 bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xs">
          <h3 className="text-base font-poppins font-bold text-zinc-950 uppercase tracking-tight border-b border-zinc-200 pb-3">
            Personal & Channel Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-inter font-bold text-zinc-500 uppercase tracking-wider">Full Name</span>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="rounded-xl border border-zinc-300 px-3 py-2 text-xs font-semibold"
                />
              ) : (
                <span className="text-sm font-semibold text-zinc-900">{formData.name}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-inter font-bold text-zinc-500 uppercase tracking-wider">Email Address</span>
              <span className="text-sm font-semibold text-zinc-700 bg-zinc-100/70 px-3 py-2 rounded-xl">{formData.email}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-inter font-bold text-zinc-500 uppercase tracking-wider">Mobile Number</span>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="rounded-xl border border-zinc-300 px-3 py-2 text-xs font-semibold"
                />
              ) : (
                <span className="text-sm font-semibold text-zinc-900">{formData.phone}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-inter font-bold text-zinc-500 uppercase tracking-wider">District Location</span>
              {isEditing ? (
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="rounded-xl border border-zinc-300 px-3 py-2 text-xs font-semibold"
                />
              ) : (
                <span className="text-sm font-semibold text-zinc-900">{formData.district}</span>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1 pt-2">
            <span className="text-xs font-inter font-bold text-zinc-500 uppercase tracking-wider">Creator Bio & Narrative</span>
            {isEditing ? (
              <textarea
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="rounded-xl border border-zinc-300 p-3 text-xs font-semibold resize-none"
              />
            ) : (
              <p className="text-xs sm:text-sm text-zinc-700 font-inter leading-relaxed bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                {formData.bio || "No bio added yet."}
              </p>
            )}
          </div>

          {/* Social Media Channels */}
          <div className="flex flex-col gap-3 pt-2">
            <span className="text-xs font-inter font-bold text-zinc-500 uppercase tracking-wider">Connected Digital Platforms</span>
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  placeholder="YouTube URL"
                  className="rounded-xl border border-zinc-300 px-3 py-2 text-xs font-semibold"
                />
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="Instagram URL"
                  className="rounded-xl border border-zinc-300 px-3 py-2 text-xs font-semibold"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.youtube ? (
                  <a href={formData.youtube} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200 hover:underline">
                    <FaYoutube className="w-4 h-4" /> YouTube Channel
                  </a>
                ) : null}
                {formData.instagram ? (
                  <a href={formData.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 text-pink-700 text-xs font-bold border border-pink-200 hover:underline">
                    <FaInstagram className="w-4 h-4" /> Instagram Handle
                  </a>
                ) : null}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

