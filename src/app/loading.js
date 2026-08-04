"use client";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 py-16 flex flex-col items-center justify-center text-center gap-6">
      <div className="w-12 h-12 rounded-full border-4 border-zinc-200 border-t-[#C45A32] animate-spin" />
      <span className="text-xs font-poppins font-bold uppercase tracking-widest text-zinc-500">
        Loading Portal Data...
      </span>
    </div>
  );
}
