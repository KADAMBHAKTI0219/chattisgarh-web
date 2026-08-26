"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  FaCommentDots,
  FaPaperPlane,
  FaCheckCircle,
  FaUserShield,
  FaHeadset,
  FaQuestionCircle
} from "react-icons/fa";

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: "m1",
      sender: "State Creator Awards Support",
      role: "Official Support",
      text: `Welcome ${user?.name || "Creator"} to the State Creator Awards 2026 portal! You can submit your queries or request assistance directly through this channel.`,
      time: "Official Welcome Note",
      isSupport: true,
    },
    {
      id: "m2",
      sender: "State Guidelines Desk",
      role: "Compliance Help",
      text: "Friendly reminder: Ensure your Instagram Reel is published on a Public account. Trial Reels and paid boosts are strictly prohibited under official competition rules.",
      time: "Portal Notice",
      isSupport: true,
    },
  ]);

  const [inputMsg, setInputMsg] = useState("");
  const [sentNotice, setSentNotice] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: user?.name || "You",
      role: "Creator",
      text: inputMsg.trim(),
      time: "Just now",
      isSupport: false,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg("");
    setSentNotice("Your query has been submitted to the support team!");

    setTimeout(() => {
      setSentNotice("");
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-page-enter max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <div>
          <span className="text-xs font-inter font-bold uppercase tracking-widest text-[#C45A32]">
            Support & Communications
          </span>
          <h1 className="text-2xl sm:text-3xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight mt-0.5 flex items-center gap-2">
            <FaCommentDots className="w-7 h-7 text-[#C45A32]" />
            <span>Messages & Helpdesk</span>
          </h1>
        </div>
      </div>

      {sentNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{sentNotice}</span>
        </div>
      )}

      {/* Messages Thread Container */}
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-5 sm:p-7 flex flex-col gap-6 shadow-2xs min-h-[400px]">
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 p-4 rounded-2xl max-w-xl text-xs ${
                msg.isSupport
                  ? "bg-zinc-50 border border-zinc-200/80 self-start"
                  : "bg-emerald-700 text-white self-end text-left"
              }`}
            >
              <div className="flex items-center justify-between gap-3 border-b border-zinc-200/40 pb-1.5 mb-1">
                <span className={`font-poppins font-bold text-xs ${msg.isSupport ? "text-zinc-900" : "text-amber-300"}`}>
                  {msg.sender}
                </span>
                <span className={`text-[10px] font-mono ${msg.isSupport ? "text-zinc-400" : "text-emerald-100"}`}>
                  {msg.time}
                </span>
              </div>
              <p className="leading-relaxed font-inter text-xs">{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} className="border-t border-zinc-200 pt-4 flex items-center gap-3">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type your support question or message..."
            className="flex-1 px-4 py-3 rounded-2xl border border-zinc-300 bg-zinc-50 text-xs font-semibold text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          />
          <button
            type="submit"
            disabled={!inputMsg.trim()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
          >
            <FaPaperPlane className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
