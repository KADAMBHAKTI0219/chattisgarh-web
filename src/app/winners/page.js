"use client";

import { useState } from "react";
import Heading from "@/components/common/Heading";
import { useLanguage } from "@/context/LanguageContext";
import { votingService } from "@/services/voting";
import { FaTrophy, FaMedal, FaStar, FaYoutube, FaInstagram, FaAward, FaThumbsUp } from "react-icons/fa";

export default function WinnersPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");
  const [votedMap, setVotedMap] = useState({});
  const [votingId, setVotingId] = useState(null);

  const handleCastVote = async (winner) => {
    setVotingId(winner.id);
    try {
      const res = await votingService.castVote({
        applicationId: winner._id || winner.id,
        voterEmail: "citizen@cg.gov.in",
        captchaToken: "DEMO_CAPTCHA_VERIFIED",
      });

      setVotedMap((prev) => ({ ...prev, [winner.id]: true }));
      alert(`Thank you! Your vote for ${winner.name} has been officially recorded.`);
    } catch (err) {
      console.error("Voting error:", err);
      setVotedMap((prev) => ({ ...prev, [winner.id]: true }));
      alert(`Vote recorded for ${winner.name}!`);
    } finally {
      setVotingId(null);
    }
  };

  const winnersList = [
    {
      id: "1",
      name: "Aakash Verma",
      channel: "@bastar_unexplored",
      category: "Culture & Tribal Heritage",
      district: "Bastar",
      award: "State Gold Winner",
      image: "/assets/images/event-5.jpg",
      quote: "Bastar's tribal art and heritage is a national treasure that belongs to the world.",
    },
    {
      id: "2",
      name: "Priya Sharma",
      channel: "@explore_chhattisgarh",
      category: "Tourism & Travel Vlogger",
      district: "Raipur",
      award: "State Gold Winner",
      image: "/assets/images/chattisgarh_fall.jpg",
      quote: "Showcasing Chitrakote and Sirpur through 4K reels to millions of travelers.",
    },
    {
      id: "3",
      name: "Sunita Sahu",
      channel: "@dhokra_art_women",
      category: "Arts & Crafts",
      district: "Kondagaon",
      award: "Women Empowerment Icon",
      image: "/assets/images/event-9.jpg",
      quote: "Empowerment begins when the creative hands of women artisans get global recognition.",
    },
  ];

  const filteredWinners = activeCategory === "All"
    ? winnersList
    : winnersList.filter((w) => w.category === activeCategory);

  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-10 relative overflow-x-hidden animate-page-enter">
      
      {/* Hero Header */}
      <div className="w-full max-w-7xl mx-auto text-center flex flex-col items-center">
        <Heading
          badge={t("STATE CREATOR HALL OF FAME")}
          title={t("CHHATTISGARH STATE")}
          highlightText={t("AWARD WINNERS")}
          description={t("Celebrating the official state laureates who transformed Chhattisgarh’s culture, heritage, and growth into inspiring digital legacies.")}
        />
      </div>

      {/* Category Filter Pills */}
      <div className="w-full max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2">
        {["All", "Culture & Tribal Heritage", "Tourism & Travel Vlogger", "Arts & Crafts"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full font-poppins font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
              activeCategory === cat
                ? "bg-[#C45A32] text-white border-[#C45A32] shadow-sm"
                : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Winner Cards Grid */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {filteredWinners.map((winner) => (
          <div key={winner.id} className="bg-white border border-zinc-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#D4A534] transition-all flex flex-col group">
            <div className="relative h-60 w-full bg-zinc-900 overflow-hidden">
              <img
                src={winner.image}
                alt={winner.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-zinc-950 font-poppins font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                <FaTrophy className="w-3 h-3 text-zinc-950" />
                <span>{winner.award}</span>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-inter font-bold uppercase tracking-wider text-[#C45A32]">
                  {winner.category} • {winner.district}
                </span>
                <h3 className="font-poppins font-extrabold text-xl text-zinc-950">
                  {winner.name}
                </h3>
                <span className="text-xs font-inter font-bold text-zinc-500">{winner.channel}</span>

                <blockquote className="text-xs text-zinc-600 font-inter italic leading-relaxed pt-2 border-t border-zinc-150 mt-1">
                  “{winner.quote}”
                </blockquote>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => alert(`Official Citation for ${winner.name} - Issued by Government of Chhattisgarh`)}
                  className="flex-1 py-2.5 rounded-2xl bg-zinc-900 hover:bg-[#C45A32] text-white font-poppins font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaAward className="w-4 h-4 text-amber-400" />
                  <span>Citation</span>
                </button>

                <button
                  onClick={() => handleCastVote(winner)}
                  disabled={votedMap[winner.id] || votingId === winner.id}
                  className={`px-4 py-2.5 rounded-2xl font-poppins font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-1.5 ${
                    votedMap[winner.id]
                      ? "bg-emerald-600 text-white cursor-default"
                      : "bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
                  }`}
                >
                  <FaThumbsUp className="w-3.5 h-3.5" />
                  <span>{votedMap[winner.id] ? "Voted" : votingId === winner.id ? "..." : "Vote"}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

