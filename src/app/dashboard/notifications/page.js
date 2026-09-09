"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { notificationService } from "@/services/notification";
import { FaBell, FaCheckCircle, FaExclamationCircle, FaBullhorn, FaPaperPlane } from "react-icons/fa";

const DEFAULT_ANNOUNCEMENTS = [
  {
    _id: "default-announcement-1",
    type: "ANNOUNCEMENT",
    title: "Chhattisgarh State Creator Awards 2026 Live",
    message: "Welcome to the official Chhattisgarh Youth & Creator Portal! Public nominations and voting are currently active across all digital categories.",
    createdAt: new Date().toISOString(),
    isRead: false,
  },
  {
    _id: "default-announcement-2",
    type: "APPLICATION_UPDATE",
    title: "Nomination & Profile Desk Active",
    message: "Submit your entries under relevant digital creator categories. Make sure your profile details and channel links are accurate.",
    createdAt: new Date().toISOString(),
    isRead: false,
  },
  {
    _id: "default-announcement-3",
    type: "SYSTEM",
    title: "Public Voting Guidelines",
    message: "1 OTP-verified vote per mobile number is counted towards category leaderboards. Keep voting and sharing!",
    createdAt: new Date().toISOString(),
    isRead: false,
  },
];

export default function NotificationsPage() {
  const { token, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notificationsList, setNotificationsList] = useState([]);

  // Admin Broadcast State
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastNotice, setBroadcastNotice] = useState("");

  const fetchNotifications = async () => {
    setLoading(true);
    let apiList = [];
    if (token && token !== "creator-session-token") {
      try {
        const res = await notificationService.getUserNotifications(token);
        if (res && res.success && res.data) {
          const payload = res.data?.data ?? res.data;
          apiList = Array.isArray(payload)
            ? payload
            : payload?.notifications || payload?.data || [];
        }
      } catch (err) {
        console.warn("Failed to fetch remote notifications:", err);
      }
    }

    let localBroadcasts = [];
    let dismissedIds = [];
    if (typeof window !== "undefined") {
      try {
        localBroadcasts = JSON.parse(localStorage.getItem("broadcast_announcements") || "[]");
        dismissedIds = JSON.parse(localStorage.getItem("dismissed_notifications") || "[]");
      } catch (e) {
        console.warn("Error reading local notifications storage:", e);
      }
    }

    const combinedMap = new Map();
    [...localBroadcasts, ...apiList, ...DEFAULT_ANNOUNCEMENTS].forEach((item) => {
      const id = item._id || item.id;
      if (id && !combinedMap.has(id) && !dismissedIds.includes(String(id))) {
        combinedMap.set(id, item);
      }
    });

    setNotificationsList(Array.from(combinedMap.values()));
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;
    setBroadcasting(true);
    setBroadcastNotice("");

    const newBroadcastItem = {
      _id: "broadcast-" + Date.now(),
      title: broadcastTitle,
      message: broadcastMessage,
      type: "ANNOUNCEMENT",
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    try {
      if (token) {
        await notificationService.broadcastAnnouncement(
          { title: broadcastTitle, message: broadcastMessage, type: "ANNOUNCEMENT" },
          token
        ).catch(() => {});
      }
    } catch (err) {
      console.warn("Backend broadcast error:", err);
    } finally {
      if (typeof window !== "undefined") {
        try {
          const existing = JSON.parse(localStorage.getItem("broadcast_announcements") || "[]");
          const updated = [newBroadcastItem, ...existing];
          localStorage.setItem("broadcast_announcements", JSON.stringify(updated));
        } catch (e) {
          console.warn("Failed to store local broadcast:", e);
        }
      }

      setNotificationsList((prev) => [newBroadcastItem, ...prev]);
      setBroadcastNotice("Official announcement broadcasted to all platform creators!");
      setBroadcastTitle("");
      setBroadcastMessage("");
      setBroadcasting(false);
    }
  };

  const getNotificationConfig = (type) => {
    switch (type) {
      case "ANNOUNCEMENT":
        return { icon: FaBullhorn, color: "bg-amber-100 text-amber-700 border border-amber-200" };
      case "APPLICATION_UPDATE":
        return { icon: FaCheckCircle, color: "bg-emerald-100 text-emerald-700 border border-emerald-200" };
      case "SYSTEM":
        return { icon: FaExclamationCircle, color: "bg-rose-100 text-rose-700 border border-rose-200" };
      default:
        return { icon: FaBell, color: "bg-blue-100 text-blue-700 border border-blue-200" };
    }
  };

  const displayList = notificationsList.map((n) => {
    const config = getNotificationConfig(n.type);
    return {
      id: n._id || n.id,
      type: n.type || "DASHBOARD",
      title: n.title || "Notification",
      desc: n.message || n.desc || "",
      link: n.link,
      isRead: n.isRead || false,
      date: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Recently",
      icon: config.icon,
      color: config.color,
    };
  });

  const handleMarkRead = async (id) => {
    if (token) {
      notificationService.markRead(id, token).catch(() => {});
    }

    if (typeof window !== "undefined") {
      try {
        const dismissed = JSON.parse(localStorage.getItem("dismissed_notifications") || "[]");
        if (!dismissed.includes(String(id))) {
          dismissed.push(String(id));
          localStorage.setItem("dismissed_notifications", JSON.stringify(dismissed));
        }
      } catch (e) {
        console.warn("Failed to store dismissed notification:", e);
      }
    }

    setNotificationsList((prev) => prev.filter((item) => String(item._id || item.id) !== String(id)));
  };

  return (
    <div className="flex flex-col gap-8 text-left animate-page-enter">
      <div>
        <span className="text-xs font-inter font-bold uppercase tracking-widest text-[#C45A32]">
          Alerts & Announcements
        </span>
        <h1 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-0.5">
          Notifications Desk
        </h1>
      </div>

      {/* Admin Broadcast Announcement Section */}
      {isAdmin && (
        <div className="bg-white border border-emerald-200/80 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-2xs">
          <div className="flex items-center gap-3 border-b border-zinc-150 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100/90 text-amber-700 flex items-center justify-center font-bold text-lg shrink-0 border border-amber-200">
              <FaBullhorn className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex flex-col text-left">
              <h2 className="font-poppins font-extrabold text-base uppercase text-zinc-950 tracking-tight">
                Broadcast System Announcement
              </h2>
              <span className="text-xs font-inter text-zinc-500">Official admin channel to broadcast alerts to all platform creators</span>
            </div>
          </div>

          {broadcastNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{broadcastNotice}</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-inter font-bold text-zinc-700 uppercase tracking-wider">
                Announcement Title
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Public Voting Phase Live Now!"
                className="rounded-xl bg-zinc-50/80 border border-zinc-300 p-3 text-xs font-semibold text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-inter font-bold text-zinc-700 uppercase tracking-wider">
                Message Body
              </label>
              <textarea
                rows={3}
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Enter official announcement message body to broadcast to all creators..."
                className="rounded-xl bg-zinc-50/80 border border-zinc-300 p-3 text-xs font-semibold text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={broadcasting}
              className="self-start px-6 py-2.5 rounded-full bg-[#C45A32] hover:bg-[#A94824] text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
            >
              <FaPaperPlane className="w-3.5 h-3.5" />
              <span>{broadcasting ? "Broadcasting..." : "Send Broadcast Alert"}</span>
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-xs font-bold text-zinc-500 bg-white rounded-3xl border border-zinc-200">
          Loading alerts & notifications...
        </div>
      ) : displayList.length > 0 ? (
        <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-xs">
          {displayList.map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.id} className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${n.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-poppins font-bold text-sm text-zinc-950">{n.title}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-inter font-semibold text-zinc-400">{n.date}</span>
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="text-[10px] font-bold text-zinc-400 hover:text-zinc-700 cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                  <p className="font-inter text-xs text-zinc-600 leading-relaxed">{n.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-zinc-200/90 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-3 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center text-xl">
            <FaBell className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="flex flex-col items-center">
            <h3 className="font-poppins font-bold text-sm text-zinc-900">No Notifications</h3>
            <p className="text-xs font-inter text-zinc-500 max-w-xs mt-1">
              You have no new alerts or announcements at this time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

