"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Heading from "@/components/common/Heading";
import { useLanguage } from "@/context/LanguageContext";
import { galleryService } from "@/services/gallery";
import { FaCamera, FaVideo, FaTimes, FaExpand } from "react-icons/fa";

function GalleryCard({ item, cardHeight, onClick }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`break-inside-avoid relative ${cardHeight} rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-200/80 shadow-xs hover:shadow-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 group mb-4 sm:mb-6`}
    >
      {/* Loading Skeleton Shimmer */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse z-0" />
      )}

      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={75}
        onLoad={() => setIsLoaded(true)}
        className={`object-cover transition-all duration-700 group-hover:scale-110 ${
          isLoaded ? "opacity-90 group-hover:opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-10" />

      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-amber-300 font-poppins font-bold text-[9.5px] sm:text-[10px] uppercase tracking-wider">
          {item.tag}
        </span>
      </div>

      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20 flex items-end justify-between gap-2.5">
        <h3 className="font-poppins font-bold text-xs sm:text-sm text-white tracking-tight leading-snug line-clamp-2">
          {item.title}
        </h3>
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xs shrink-0 group-hover:bg-[#C45A32] transition-colors">
          <FaExpand className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const { t } = useLanguage();
  const [activeMediaType, setActiveMediaType] = useState("photos"); // "photos" | "videos"
  const [activeCategory, setActiveCategory] = useState("All");
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

  const GALLERY_PHOTOS = [
    { id: 1, title: "Bastar Tribal Heritage & Cultural Art", tag: "Tribal Culture", image: "/assets/images/gallery/bastar tribal 1.png" },
    { id: 2, title: "State Creator & Influencer Awards Gala 2026", tag: "Award Ceremony", image: "/assets/images/gallery/02.png" },
    { id: 3, title: "Digital Creators & Leadership Summit", tag: "Summit & Keynote", image: "/assets/images/gallery/03 .png" },
    { id: 4, title: "Sirpur Ancient Sculptured Temple Reliefs", tag: "Heritage & Craft", image: "/assets/images/gallery/DSC01204.JPG" },
    { id: 5, title: "Ancient Temple Sanctum Architecture", tag: "Heritage & Craft", image: "/assets/images/gallery/DSC01214.JPG" },
    { id: 6, title: "Historic Bhoramdeo Temple Compound Ruins", tag: "Heritage & Craft", image: "/assets/images/gallery/DSC01233 copy.JPG" },
    { id: 7, title: "7th-Century Laxman Temple — Sirpur", tag: "Heritage & Craft", image: "/assets/images/gallery/DSC01733.JPG" },
    { id: 8, title: "Archaeological Heritage & Carved Pillar Motifs", tag: "Heritage & Craft", image: "/assets/images/gallery/DSC02108.JPG" },
    { id: 9, title: "Ancient Shiva Shrine & Nandi Sculpture", tag: "Heritage & Craft", image: "/assets/images/gallery/DSC02119.JPG" },
    { id: 10, title: "Chaturmukhi Shivling & Sacred Sculptures", tag: "Heritage & Craft", image: "/assets/images/gallery/DSC02344.JPG" },
    { id: 11, title: "Dungal Lake Scenic Landmark & Promenade", tag: "Eco-Tourism", image: "/assets/images/gallery/G9eoIg0aYAYBlk4.jpg" },
    { id: 12, title: "Dungal Waterfront Viewpoint & Pavilion", tag: "Eco-Tourism", image: "/assets/images/gallery/G9eoIitaYAcVhQN.jpg" },
    { id: 13, title: "Digital Media & Innovation Forum Raipur", tag: "Summit & Keynote", image: "/assets/images/gallery/G9eoIivbAAAKiQ8.jpg" },
    { id: 14, title: "Chhattisgarhi Culture & Eco Tourism Campaign", tag: "Eco-Tourism", image: "/assets/images/gallery/GuqpANDXoAA_BM5.jpg" },
    { id: 15, title: "Official Felicitation of State Award Winners", tag: "Award Ceremony", image: "/assets/images/gallery/IMG_20260703_130421.jpg" },
    { id: 16, title: "State Press Conference & Government Briefing", tag: "State Event", image: "/assets/images/gallery/IMG_20260703_132332.jpg" },
    { id: 17, title: "Panthi & Raut Nacha Folk Dance Ensemble", tag: "Tribal Culture", image: "/assets/images/gallery/IMG_20260703_133508.jpg" },
    { id: 18, title: "Distinguished Jury & State Guests Gathering", tag: "State Event", image: "/assets/images/gallery/IMG_20260703_134024.jpg" },
    { id: 19, title: "Regional Influencer Networking Session", tag: "Summit & Keynote", image: "/assets/images/gallery/757656910_122296226312081376_9155510348415342518_n copy.jpg" },
    { id: 20, title: "Youth Digital Storytellers & Content Creators", tag: "Summit & Keynote", image: "/assets/images/gallery/759164456_2069727690320603_2621193215795883287_n copy.jpg" },
    { id: 21, title: "Chitrakote Waterfalls — Bastar Niagara of India", tag: "Eco-Tourism", image: "/assets/images/chattisgarh_fall.jpg" },
    { id: 22, title: "Raipur Landmark & Cultural Heritage Center", tag: "Eco-Tourism", image: "/assets/images/raipur_landmark.jpg" },
  ];

  const GALLERY_VIDEOS = [
    { id: 101, title: "Chitrakote Waterfalls 4K Drone Reel", tag: "Video Reel", image: "/assets/images/chattisgarh_fall.jpg", url: "https://youtu.be/sample1" },
    { id: 102, title: "Sirpur Archaeological Heritage Documentary", tag: "Short Film", image: "/assets/images/raipur_landmark.jpg", url: "https://youtu.be/sample2" },
    { id: 103, title: "Bastar Tribal Dance Highlights 2026", tag: "Folk Beat", image: "/assets/images/gallery/bastar tribal 1.png", url: "https://youtu.be/sample3" },
    { id: 104, title: "State Creator Awards Grand Finale Gala", tag: "Award Highlights", image: "/assets/images/gallery/02.png", url: "https://youtu.be/sample4" },
  ];

  const categoriesList = ["All", "Tribal Culture", "Award Ceremony", "State Event", "Summit & Keynote", "Heritage & Craft", "Eco-Tourism"];

  const apiPhotos = albums.length > 0
    ? albums.map((a) => ({
        id: a._id || a.id,
        title: a.title,
        tag: a.category || "State Album",
        image: a.coverImage || "/assets/images/gallery/02.png",
      }))
    : [];

  const combinedPhotos = [...GALLERY_PHOTOS, ...apiPhotos];

  const filteredPhotos = activeCategory === "All"
    ? combinedPhotos
    : combinedPhotos.filter((p) => (p.tag || "").toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-10 relative overflow-x-hidden animate-page-enter">
      
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto text-center flex flex-col items-center">
        <Heading
          badge={t("OFFICIAL STATE REPOSITORY")}
          title={t("CHHATTISGARH MEDIA")}
          highlightText={t("GALLERY")}
          description={t("Explore high-resolution photography, creator summit moments, state award galas, and indigenous cultural heritage captured across Chhattisgarh.")}
        />
      </div>

      {/* Media Type Tabs & Category Filter Toolbar */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-4 sm:gap-6">
        
        {/* Photos / Videos Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setActiveMediaType("photos")}
            className={`px-5 sm:px-6 py-2.5 rounded-full font-poppins font-bold text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2 border ${
              activeMediaType === "photos"
                ? "bg-[#C45A32] text-white border-[#C45A32] shadow-sm"
                : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            <FaCamera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Photos & Visuals ({combinedPhotos.length})</span>
          </button>

          <button
            onClick={() => setActiveMediaType("videos")}
            className={`px-5 sm:px-6 py-2.5 rounded-full font-poppins font-bold text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2 border ${
              activeMediaType === "videos"
                ? "bg-[#21593D] text-white border-[#21593D] shadow-sm"
                : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            <FaVideo className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Videos & Reels ({GALLERY_VIDEOS.length})</span>
          </button>
        </div>

        {/* Category Filters Bar */}
        {activeMediaType === "photos" && (
          <div className="w-full bg-white p-2 sm:p-2.5 rounded-2xl border border-zinc-200/90 shadow-xs flex items-center justify-start md:justify-center gap-2 overflow-x-auto no-scrollbar">
            {categoriesList.map((cat) => {
              const isSelected = activeCategory === cat;
              const count = cat === "All"
                ? combinedPhotos.length
                : combinedPhotos.filter((p) => (p.tag || "").toLowerCase() === cat.toLowerCase()).length;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-poppins font-bold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5 sm:gap-2 border ${
                    isSelected
                      ? "bg-[#C45A32] text-white border-[#C45A32] shadow-xs"
                      : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-extrabold ${isSelected ? "bg-white/25 text-white" : "bg-zinc-200 text-zinc-700"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Responsive Masonry Columns */}
      {loading ? (
        <div className="p-12 text-center text-xs font-bold text-zinc-500 bg-white rounded-3xl border border-zinc-200 max-w-7xl mx-auto w-full">
          Loading state media gallery...
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 text-left">
          {(activeMediaType === "photos" ? filteredPhotos : GALLERY_VIDEOS).map((item, idx) => {
            const heightClasses = [
              "h-56 sm:h-64 lg:h-72",
              "h-72 sm:h-88 lg:h-96",
              "h-64 sm:h-76 lg:h-80",
              "h-60 sm:h-68 lg:h-76",
              "h-80 sm:h-96 lg:h-[380px]",
              "h-52 sm:h-60 lg:h-68"
            ];
            const cardHeight = heightClasses[idx % heightClasses.length];

            return (
              <GalleryCard
                key={item.id}
                item={item}
                cardHeight={cardHeight}
                onClick={() => setSelectedMedia(item)}
              />
            );
          })}
        </div>
      )}

      {/* Responsive Lightbox Preview Modal */}
      {selectedMedia && (
        <div
          onClick={() => setSelectedMedia(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[90vh] bg-zinc-950 border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto"
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="relative h-[50vh] sm:h-[65vh] max-h-[550px] w-full bg-black flex items-center justify-center">
              <Image
                src={selectedMedia.image}
                alt={selectedMedia.title}
                fill
                quality={85}
                className="object-contain"
              />
            </div>

            <div className="p-4 sm:p-6 bg-zinc-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10 shrink-0">
              <div className="flex flex-col text-left">
                <span className="text-[10px] sm:text-xs font-poppins font-bold uppercase tracking-wider text-amber-400">
                  {selectedMedia.tag}
                </span>
                <h3 className="font-poppins font-bold text-sm sm:text-lg text-white mt-0.5 leading-snug">
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
