"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Heading from "@/components/common/Heading";
import { useLanguage } from "@/context/LanguageContext";
import { galleryService } from "@/services/gallery";
import { FaTimes, FaExpand } from "react-icons/fa";

function GalleryCard({ item, onClick }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const aspectClass = item.aspectRatio || "aspect-[4/3]";

  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200/90 shadow-xs hover:shadow-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 break-inside-avoid mb-4 sm:mb-6"
    >
      {/* Photo Container with Dynamic Aspect Ratio for Masonry — Only Image */}
      <div className={`relative w-full ${aspectClass} overflow-hidden`}>
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 animate-pulse z-0" />
        )}

        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          quality={85}
          onLoad={() => setIsLoaded(true)}
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />

        {/* Hover overlay showing Title & Tag over image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left">
          {item.tag && (
            <span className="text-[10px] font-poppins font-bold uppercase tracking-wider text-amber-400 mb-1">
              {item.tag}
            </span>
          )}
          <h3 className="text-white font-poppins font-bold text-xs sm:text-sm leading-snug line-clamp-2 drop-shadow-sm">
            {item.title}
          </h3>
        </div>
      </div>
    </div>
  );
}

const ASPECT_RATIOS = [
  "aspect-[3/4]",
  "aspect-[16/9]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[4/3]",
  "aspect-[3/2]",
];

export default function GalleryPage() {
  const { t } = useLanguage();
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
    { id: 1, title: "Bastar Tribal Heritage & Cultural Art", tag: "Tribal Culture", image: "/assets/images/gallery/bastar tribal 1.png", aspectRatio: "aspect-[3/4]" },
    { id: 2, title: "State Creator & Influencer Awards Gala 2026", tag: "Award Ceremony", image: "/assets/images/gallery/02.png", aspectRatio: "aspect-[16/9]" },
    { id: 3, title: "Digital Creators & Leadership Summit", tag: "Summit & Keynote", image: "/assets/images/gallery/03 .png", aspectRatio: "aspect-square" },
    { id: 4, title: "Sirpur Ancient Sculptured Temple Reliefs", tag: "Heritage & Craft", image: "/assets/images/gallery/DSC01204.JPG", aspectRatio: "aspect-[4/5]" },
    { id: 5, title: "Ancient Temple Sanctum Architecture", tag: "Heritage & Craft", image: "/assets/images/gallery/DSC01214.JPG", aspectRatio: "aspect-[3/4]" },
    { id: 6, title: "Historic Bhoramdeo Temple Compound Ruins", tag: "Heritage & Craft", image: "/assets/images/gallery/DSC01233 copy.JPG", aspectRatio: "aspect-[16/9]" },
    { id: 7, title: "7th-Century Laxman Temple — Sirpur", tag: "Heritage & Craft", image: "/assets/images/gallery/DSC01733.JPG", aspectRatio: "aspect-[4/3]" },
    { id: 8, title: "Archaeological Heritage & Carved Pillar Motifs", tag: "Heritage & Craft", image: "/assets/images/gallery/DSC02108.JPG", aspectRatio: "aspect-square" },
    { id: 9, title: "Ancient Shiva Shrine & Nandi Sculpture", tag: "Heritage & Craft", image: "/assets/images/gallery/DSC02119.JPG", aspectRatio: "aspect-[3/4]" },
    { id: 10, title: "Chaturmukhi Shivling & Sacred Sculptures", tag: "Heritage & Craft", image: "/assets/images/gallery/DSC02344.JPG", aspectRatio: "aspect-[4/5]" },
    { id: 11, title: "Dungal Lake Scenic Landmark & Promenade", tag: "Eco-Tourism", image: "/assets/images/gallery/G9eoIg0aYAYBlk4.jpg", aspectRatio: "aspect-[16/9]" },
    { id: 12, title: "Dungal Waterfront Viewpoint & Pavilion", tag: "Eco-Tourism", image: "/assets/images/gallery/G9eoIitaYAcVhQN.jpg", aspectRatio: "aspect-[4/3]" },
    { id: 13, title: "Digital Media & Innovation Forum Raipur", tag: "Summit & Keynote", image: "/assets/images/gallery/G9eoIivbAAAKiQ8.jpg", aspectRatio: "aspect-square" },
    { id: 14, title: "Chhattisgarhi Culture & Eco Tourism Campaign", tag: "Eco-Tourism", image: "/assets/images/gallery/GuqpANDXoAA_BM5.jpg", aspectRatio: "aspect-[3/4]" },
    { id: 15, title: "Official Felicitation of State Award Winners", tag: "Award Ceremony", image: "/assets/images/gallery/IMG_20260703_130421.jpg", aspectRatio: "aspect-[16/9]" },
    { id: 16, title: "State Press Conference & Government Briefing", tag: "State Event", image: "/assets/images/gallery/IMG_20260703_132332.jpg", aspectRatio: "aspect-[4/3]" },
    { id: 17, title: "Panthi & Raut Nacha Folk Dance Ensemble", tag: "Tribal Culture", image: "/assets/images/gallery/IMG_20260703_133508.jpg", aspectRatio: "aspect-[4/5]" },
    { id: 18, title: "Distinguished Jury & State Guests Gathering", tag: "State Event", image: "/assets/images/gallery/IMG_20260703_134024.jpg", aspectRatio: "aspect-square" },
    { id: 19, title: "Regional Influencer Networking Session", tag: "Summit & Keynote", image: "/assets/images/gallery/757656910_122296226312081376_9155510348415342518_n copy.jpg", aspectRatio: "aspect-[16/9]" },
    { id: 20, title: "Youth Digital Storytellers & Content Creators", tag: "Summit & Keynote", image: "/assets/images/gallery/759164456_2069727690320603_2621193215795883287_n copy.jpg", aspectRatio: "aspect-[3/4]" },
    { id: 21, title: "Chitrakote Waterfalls — Bastar Niagara of India", tag: "Eco-Tourism", image: "/assets/images/chattisgarh_fall.jpg", aspectRatio: "aspect-[4/3]" },
    { id: 22, title: "Raipur Landmark & Cultural Heritage Center", tag: "Eco-Tourism", image: "/assets/images/raipur_landmark.jpg", aspectRatio: "aspect-[16/9]" },
  ];

  const GALLERY_VIDEOS = [
    { id: 101, title: "Chitrakote Waterfalls 4K Drone Reel", tag: "Video Reel", image: "/assets/images/chattisgarh_fall.jpg", url: "https://youtu.be/sample1", aspectRatio: "aspect-[16/9]" },
    { id: 102, title: "Sirpur Archaeological Heritage Documentary", tag: "Short Film", image: "/assets/images/raipur_landmark.jpg", url: "https://youtu.be/sample2", aspectRatio: "aspect-[4/3]" },
    { id: 103, title: "Bastar Tribal Dance Highlights 2026", tag: "Folk Beat", image: "/assets/images/gallery/bastar tribal 1.png", url: "https://youtu.be/sample3", aspectRatio: "aspect-[3/4]" },
    { id: 104, title: "State Creator Awards Grand Finale Gala", tag: "Award Highlights", image: "/assets/images/gallery/02.png", url: "https://youtu.be/sample4", aspectRatio: "aspect-[16/9]" },
  ];

  const apiPhotos = albums.length > 0
    ? albums.map((a, idx) => ({
        id: a._id || a.id,
        title: a.title,
        tag: a.category || "State Album",
        image: a.coverImage || "/assets/images/gallery/02.png",
        aspectRatio: ASPECT_RATIOS[idx % ASPECT_RATIOS.length],
      }))
    : [];

  const allMedia = [...GALLERY_PHOTOS, ...apiPhotos, ...GALLERY_VIDEOS];

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

      {/* Responsive Masonry Layout */}
      {loading ? (
        <div className="p-12 text-center text-xs font-bold text-zinc-500 bg-white rounded-3xl border border-zinc-200 max-w-7xl mx-auto w-full">
          Loading state media gallery...
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6 text-left">
          {allMedia.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              onClick={() => setSelectedMedia(item)}
            />
          ))}
        </div>
      )}

      {/* Responsive Lightbox Preview Modal */}
      {selectedMedia && (
        <div
          onClick={() => setSelectedMedia(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[90vh] bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto"
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900/80 text-white flex items-center justify-center hover:bg-[#C45A32] transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <FaTimes className="w-4 h-4" />
            </button>

            <div className="relative h-[55vh] sm:h-[65vh] max-h-[550px] w-full bg-zinc-950 flex items-center justify-center">
              <Image
                src={selectedMedia.image}
                alt={selectedMedia.title}
                fill
                quality={90}
                className="object-contain"
              />
            </div>

            <div className="p-4 sm:p-5 bg-white text-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-150 shrink-0">
              <div className="flex flex-col text-left">
                <span className="text-[10px] sm:text-xs font-poppins font-bold uppercase tracking-wider text-[#C45A32]">
                  {selectedMedia.tag}
                </span>
                <h3 className="font-poppins font-bold text-sm sm:text-base text-zinc-900 mt-0.5 leading-snug">
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
