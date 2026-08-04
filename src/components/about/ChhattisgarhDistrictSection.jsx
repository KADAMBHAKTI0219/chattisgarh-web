"use client";

import { useState } from "react";
import Heading from "@/components/common/Heading";
import { useLanguage } from "@/context/LanguageContext";

export default function ChhattisgarhDistrictSection() {
  const { t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState("Bastar");

  const districtsData = {
    Bastar: {
      title: "Bastar — The Cultural & Tribal Heartland",
      desc: "Famous for Chitrakote Falls (Niagara of India), Dhokra brass metal craft, Kanger Valley National Park, and centuries-old tribal traditions.",
      image: "/assets/images/chattisgarh_fall.jpg",
      highlights: ["Chitrakote Falls", "Dhokra Handicraft", "Tribal Folk Art"],
    },
    Raipur: {
      title: "Raipur — Capital of Heritage & Innovation",
      desc: "The vibrant capital combining modern tech ecosystems with historical temples, Swami Vivekananda Sarovar, and cultural gala festivals.",
      image: "/assets/images/raipur_landmark.jpg",
      highlights: ["Mahanadi River Basin", "Digital Hubs", "State Museum"],
    },
    Sirpur: {
      title: "Sirpur — 7th-Century Temple Complex",
      desc: "Sacred archaeological town featuring Laxman Temple, Buddhist monasteries, and Jain stupas dating back over 1400 years.",
      image: "/assets/images/event-3.jpg",
      highlights: ["Laxman Brick Temple", "Archaeological Excavations", "Heritage Circuit"],
    },
    Kondagaon: {
      title: "Kondagaon — Crafts Capital of Chhattisgarh",
      desc: "Home to master artisans producing bell metal Dhokra crafts, terracotta sculptures, and wooden tribal murals.",
      image: "/assets/images/event-9.jpg",
      highlights: ["Bell Metal Dhokra", "Terracotta Art", "Artisan Cooperatives"],
    },
  };

  const activeData = districtsData[selectedDistrict] || districtsData.Bastar;

  return (
    <section className="py-16 md:py-24 bg-white border-t border-zinc-200/80">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex flex-col gap-10">
        
        {/* Section Header */}
        <div className="w-full text-center flex flex-col items-center">
          <Heading
            badge={t("DISCOVER CHHATTISGARH")}
            title={t("OUR HERITAGE")}
            highlightText={t("& CULTURE")}
            description={t("From 44% dense forest cover and roaring waterfalls to 7th-century brick temples and Dhokra art—explore the spirit of Chhattisgarh.")}
          />
        </div>

        {/* Interactive District Explorer Card */}
        <div className="w-full bg-zinc-50 border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm text-left">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-4 gap-4">
              <div>
                <span className="text-[11px] font-inter font-bold uppercase tracking-widest text-[#C45A32]">
                  Interactive District Explorer
                </span>
                <h2 className="text-xl sm:text-2xl font-poppins font-extrabold text-zinc-950 uppercase tracking-tight">
                  Select A District Region
                </h2>
              </div>

              {/* District Buttons */}
              <div className="flex flex-wrap gap-2">
                {Object.keys(districtsData).map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDistrict(d)}
                    className={`px-4 py-2 rounded-full font-poppins font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                      selectedDistrict === d
                        ? "bg-[#21593D] text-white border-[#21593D] shadow-xs"
                        : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    📍 {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected District Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
              <div className="lg:col-span-6 relative h-[280px] sm:h-[340px] rounded-2xl overflow-hidden bg-zinc-900 shadow-sm">
                <img
                  src={activeData.image}
                  alt={activeData.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-6 flex flex-col gap-4">
                <span className="text-xs font-poppins font-bold uppercase tracking-wider text-[#C45A32]">
                  District Spotlight
                </span>
                <h3 className="font-poppins font-extrabold text-2xl text-zinc-950">
                  {activeData.title}
                </h3>
                <p className="font-inter text-xs sm:text-sm text-zinc-700 leading-relaxed">
                  {activeData.desc}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {activeData.highlights.map((h, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-800 font-inter font-bold text-xs">
                      ✦ {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
