"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { notificationService } from "@/services/notification";
import { FaBell, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";

export default function NotificationsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notificationsList, setNotificationsList] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await notificationService.getUserNotifications(token);
        if (res.success && res.data) {
          const list = Array.isArray(res.data) ? res.data : res.data.notifications || [];
          setNotificationsList(list);
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  const defaultNotifications = [
    {
      id: "1",
      type: "Announcement",
      title: "Public Voting Phase Starting Soon",
      desc: "Shortlisted candidates in public choice categories will be featured on the portal for voting starting August 15, 2026.",
      date: "August 04, 2026",
      icon: FaBell,
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      id: "2",
      type: "Application Update",
      title: "Nomination CGAWD-2026-89412 Shortlisted",
      desc: "Congratulations! Your entry in Culture & Tribal Heritage has passed technical audit and shortlisted for jury review.",
      date: "August 02, 2026",
      icon: FaCheckCircle,
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    {
      id: "3",
      type: "Reminder",
      title: "Complete Category Details",
      desc: "Ensure all featured links in your portfolio are publicly accessible to the jury panel.",
      date: "July 30, 2026",
      icon: FaExclamationCircle,
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
  ];

  const displayList = notificationsList.length > 0
    ? notificationsList.map(n => ({
        id: n._id || n.id,
        type: n.type || "Notification",
        title: n.title || "State Alert",
        desc: n.message || n.desc || "",
        date: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Today",
        icon: FaBell,
        color: "bg-blue-100 text-blue-700 border-blue-200",
      }))
    : defaultNotifications;

  const handleMarkRead = async (id) => {
    if (!token) return;
    try {
      await notificationService.markRead(id, token);
      setNotificationsList(prev => prev.filter(item => (item._id || item.id) !== id));
    } catch (e) {
      console.error("Mark read error:", e);
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left animate-page-enter">
      <div>
        <span className="text-xs font-inter font-bold uppercase tracking-widest text-[#C45A32]">
          Alerts & Announcements
        </span>
        <h1 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-0.5">
          Notifications
        </h1>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs font-bold text-zinc-500 bg-white rounded-3xl border border-zinc-200">
          Loading alerts & notifications...
        </div>
      ) : (
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
      )}
    </div>
  );
}

