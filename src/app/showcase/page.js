"use client";

import Link from "next/link";
import Heading from "@/components/common/Heading";
import { useLanguage } from "@/context/LanguageContext";
import { FaPaintBrush, FaFeather, FaCampground, FaMusic, FaSeedling } from "react-icons/fa";

export default function ShowcasePage() {
  const { t } = useLanguage();

  const showcases = [
    {
      title: "Dhokra Bell Metal Art",
      category: "Indigenous Craftsmanship",
      desc: "4000-year-old lost-wax metal casting technique preserved by tribal artisans of Kondagaon and Bastar.",
      image: "/assets/images/event-9.jpg",
      color: "border-amber-400/40 bg-amber-500/5",
    },
    {
      title: "Chitrakote & Eco-Tourism",
      category: "Natural Wonders",
      desc: "Horseshoe waterfalls, sacred groves, and pristine eco-tourism destinations.",
      image: "/assets/images/chattisgarh_fall.jpg",
      color: "border-emerald-400/40 bg-emerald-500/5",
    },
    {
      title: "Folk Music & Performing Arts",
      category: "Cultural Beat",
      desc: "Panthi dance, Raut Nacha, and Suwa dance traditions passed down across generations.",
      image: "/assets/images/event-5.jpg",
      color: "border-terracotta-400/40 bg-orange-500/5",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-10 relative overflow-x-hidden animate-page-enter">
      
      <div className="w-full max-w-7xl mx-auto text-center flex flex-col items-center">
        <Heading
          badge={t("PREMIUM CATEGORY SHOWCASE")}
          title={t("CULTURAL & HERITAGE")}
          highlightText={t("SHOWCASE")}
          description={t("Dedicated visual storytelling sections highlighting the official award categories of Chhattisgarh.")}
        />
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {showcases.map((s, idx) => (
          <div key={idx} className={`p-6 rounded-3xl border ${s.color} flex flex-col gap-4 shadow-xs`}>
            <div className="relative h-48 rounded-2xl overflow-hidden bg-zinc-900">
              <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] font-poppins font-bold uppercase tracking-wider text-[#C45A32]">
              {s.category}
            </span>
            <h3 className="font-poppins font-extrabold text-xl text-zinc-950">{s.title}</h3>
            <p className="font-inter text-xs text-zinc-600 leading-relaxed">{s.desc}</p>
            <Link href="/categories" className="text-xs font-poppins font-bold text-[#C45A32] hover:underline mt-2">
              Explore Related Category →
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}
