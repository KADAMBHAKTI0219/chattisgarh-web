"use client";

import { useEffect, useState } from "react";
import Heading from "@/components/common/Heading";
import { useLanguage } from "@/context/LanguageContext";
import { galleryService } from "@/services/gallery";
import { FaCamera, FaVideo, FaTimes, FaExpand } from "react-icons/fa";

export default function GalleryPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("photos");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        const res = await galleryService.getAlbums();
        if (res.success && res.data) {
          const list = Array.isArray(res.data) ? res.data : res.data.albums || [];
          setAlbums(list);
        }
      } catch (err) {
        console.error("Failed to load gallery albums:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const defaultPhotos = [
    { id: 1, title: "Chitrakote Waterfalls — Bastar", tag: "Nature", image: "/assets/images/chattisgarh_fall.jpg" },
    { id: 2, title: "7th-Century Laxman Temple — Sirpur", tag: "Heritage", image: "/assets/images/raipur_landmark.jpg" },
    { id: 3, title: "Folk Dance Performers — Raipur Gala", tag: "Culture", image: "/assets/images/event-5.jpg" },
    { id: 4, title: "Digital Creator Summit 2026", tag: "Ecosystem", image: "/assets/images/event_networking.jpg" },
    { id: 5, title: "Sacred Woodlands of Kanger Valley", tag: "Eco-Tourism", image: "/assets/images/about-5.jpg" },
    { id: 6, title: "Women Dhokra Artisans — Kondagaon", tag: "Craftsmanship", image: "/assets/images/event-9.jpg" },
  ];

  const defaultVideos = [
    { id: 1, title: "Chitrakote Falls 4K Reel", tag: "Video Reel", image: "/assets/images/chattisgarh_fall.jpg", url: "https://youtu.be/sample1" },
    { id: 2, title: "Sirpur Heritage Documentary", tag: "Short Film", image: "/assets/images/raipur_landmark.jpg", url: "https://youtu.be/sample2" },
    { id: 3, title: "Bastar Tribal Dance Highlights", tag: "Folk Beat", image: "/assets/images/event-5.jpg", url: "https://youtu.be/sample3" },
  ];

  const photosList = albums.length > 0 ? albums.map(a => ({ id: a._id || a.id, title: a.title, tag: a.category || "Album", image: a.coverImage || "/assets/images/raipur_landmark.jpg" })) : defaultPhotos;
  const videosList = defaultVideos;

  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-10 relative overflow-x-hidden animate-page-enter">
      
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto text-center flex flex-col items-center">
        <Heading
          badge={t("STATE MEDIA REPOSITORY")}
          title={t("CHHATTISGARH MEDIA")}
          highlightText={t("GALLERY")}
          description={t("Explore high-resolution photography, creator reels, event highlights, and cultural moments captured across the state.")}
        />
      </div>

      {/* Media Type Tabs */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveTab("photos")}
          className={`px-6 py-2.5 rounded-full font-poppins font-bold text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2 border ${
            activeTab === "photos"
              ? "bg-[#C45A32] text-white border-[#C45A32] shadow-sm"
              : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <FaCamera className="w-4 h-4" />
          <span>Photos & Visuals</span>
        </button>

        <button
          onClick={() => setActiveTab("videos")}
          className={`px-6 py-2.5 rounded-full font-poppins font-bold text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2 border ${
            activeTab === "videos"
              ? "bg-[#21593D] text-white border-[#21593D] shadow-sm"
              : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <FaVideo className="w-4 h-4" />
          <span>Videos & Reels</span>
        </button>
      </div>

      {/* Masonry / Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs font-bold text-zinc-500 bg-white rounded-3xl border border-zinc-200 max-w-7xl mx-auto w-full">
          Loading state media gallery...
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {(activeTab === "photos" ? photosList : videosList).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="group relative h-64 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-200/80 shadow-xs hover:shadow-md cursor-pointer transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />

              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-poppins font-bold text-[10px] uppercase tracking-wider">
                  {item.tag}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between">
                <h3 className="font-poppins font-bold text-sm text-white tracking-tight leading-snug">
                  {item.title}
                </h3>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xs shrink-0 group-hover:scale-110 transition-transform">
                  <FaExpand className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative max-w-4xl w-full bg-zinc-950 border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-white hover:text-zinc-950 transition-colors cursor-pointer"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            <div className="relative h-[450px] w-full bg-black flex items-center justify-center">
              <img
                src={selectedMedia.image}
                alt={selectedMedia.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 bg-zinc-900 text-white flex items-center justify-between">
              <div className="flex flex-col text-left">
                <span className="text-xs font-poppins font-bold uppercase tracking-wider text-amber-400">
                  {selectedMedia.tag}
                </span>
                <h3 className="font-poppins font-bold text-lg text-white mt-0.5">
                  {selectedMedia.title}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

