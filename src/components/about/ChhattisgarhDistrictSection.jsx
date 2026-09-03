"use client";

import { useState } from "react";
import Heading from "@/components/common/Heading";

const DISTRICTS = [
  "Raipur", "Bilaspur", "Durg", "Bastar", "Surguja", "Rajnandgaon", 
  "Korba", "Raigarh", "Dhamtari", "Janjgir-Champa", "Kanker", "Kabirdham"
];

export default function ChhattisgarhDistrictSection() {
  const [selectedDistrict, setSelectedDistrict] = useState("Raipur");

  return (
    <section className="py-16 md:py-24 bg-white border-t border-zinc-200/80">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex flex-col gap-10">
        
        {/* Section Header */}
        <div className="w-full text-center flex flex-col items-center">
          <Heading
            badge="DISCOVER CHHATTISGARH"
            title="EXPLORE THE HERITAGE &"
            highlightText="33 DISTRICTS OF STATE"
            description="From the sacred groves of Bastar to the industrial heartland of Korba, explore digital creator stories across every district."
          />
        </div>

        {/* District Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {DISTRICTS.map((d) => (
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
    </section>
  );
}
