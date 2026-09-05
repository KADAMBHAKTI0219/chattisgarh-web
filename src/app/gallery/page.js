"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Heading from "@/components/common/Heading";
import { useLanguage } from "@/context/LanguageContext";
import { galleryService } from "@/services/gallery";
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from "react-icons/fa";

const GALLERY_CATEGORIES = ["All", "Heritage & Temples", "Creator Summit", "Culture & Art", "Nature & Tourism"];

const ALL_GALLERY_PHOTOS = [
  { id: 1, image: "/assets/images/bhoramdevmandir.jpg", title: "Bhoram Dev Temple", category: "Heritage & Temples", aspectRatio: "aspect-[3/4]", objectPosition: "top center" },
  { id: 2, image: "/assets/images/madheshwar.JPG", title: "Madheshwar Pahar", category: "Heritage & Temples", aspectRatio: "aspect-[4/5]", objectPosition: "top center" },
  { id: 3, image: "/assets/images/mayalinaturecamp.JPG", title: "Mayali Nature Camp", category: "Nature & Tourism", aspectRatio: "aspect-[16/9]" },
  { id: 4, image: "/assets/images/mahtarisadan.JPG", title: "Mahtari Sadan", category: "Heritage & Temples", aspectRatio: "aspect-[4/3]" },
  { id: 5, image: "/assets/images/goldenislandkorba.jpg", title: "Golden Island Korba", category: "Nature & Tourism", aspectRatio: "aspect-[16/9]" },
  { id: 6, image: "/assets/images/chattisgarh_fall.jpg", title: "Chitrakote Waterfalls", category: "Nature & Tourism", aspectRatio: "aspect-[16/9]" },
  { id: 7, image: "/assets/images/raipur_landmark.jpg", title: "Raipur Landmark", category: "Heritage & Temples", aspectRatio: "aspect-[3/4]" },
  { id: 8, image: "/assets/images/gallery/bastar tribal 1.png", title: "Bastar Tribal Culture", category: "Culture & Art", aspectRatio: "aspect-[3/4]", objectPosition: "top center" },
  { id: 9, image: "/assets/images/gallery/02.png", title: "Chhattisgarh Heritage", category: "Culture & Art", aspectRatio: "aspect-[16/9]" },
  { id: 10, image: "/assets/images/gallery/03 .png", title: "State Event Gala", category: "Creator Summit", aspectRatio: "aspect-square" },
  { id: 11, image: "/assets/images/gallery/1001299067.jpg", title: "Cultural Event", category: "Culture & Art", aspectRatio: "aspect-[4/5]" },
  { id: 12, image: "/assets/images/gallery/757656910_122296226312081376_9155510348415342518_n copy.jpg", title: "Summit Highlights", category: "Creator Summit", aspectRatio: "aspect-[16/9]" },
  { id: 13, image: "/assets/images/gallery/DSC00008.JPG", title: "Chhattisgarh Landscape", category: "Nature & Tourism", aspectRatio: "aspect-[3/4]", objectPosition: "top center" },
  { id: 14, image: "/assets/images/gallery/DSC00149.JPG", title: "State Festival", category: "Culture & Art", aspectRatio: "aspect-[4/3]" },
  { id: 15, image: "/assets/images/gallery/DSC00580.JPG", title: "Traditional Performance", category: "Culture & Art", aspectRatio: "aspect-[16/9]" },
  { id: 16, image: "/assets/images/gallery/DSC00700.JPG", title: "Youth Creator Meet", category: "Creator Summit", aspectRatio: "aspect-[4/5]" },
  { id: 17, image: "/assets/images/gallery/DSC01733.JPG", title: "State Celebration", category: "Creator Summit", aspectRatio: "aspect-[4/3]" },
  { id: 18, image: "/assets/images/gallery/DSC02119.JPG", title: "Indigenous Art", category: "Culture & Art", aspectRatio: "aspect-[3/4]" },
  { id: 19, image: "/assets/images/gallery/DSC02344.JPG", title: "Award Night Moment", category: "Creator Summit", aspectRatio: "aspect-[4/5]" },
  { id: 20, image: "/assets/images/gallery/DSC02412.JPG", title: "Creator Community", category: "Creator Summit", aspectRatio: "aspect-[16/9]" },
  { id: 21, image: "/assets/images/gallery/G9eoIg0aYAYBlk4.jpg", title: "Summit Gathering", category: "Creator Summit", aspectRatio: "aspect-[16/9]" },
  { id: 22, image: "/assets/images/gallery/G9eoIitaYAcVhQN.jpg", title: "State Excellence", category: "Creator Summit", aspectRatio: "aspect-[4/3]" },
  { id: 23, image: "/assets/images/gallery/G9eoIivbAAAKiQ8.jpg", title: "Cultural Showcase", category: "Culture & Art", aspectRatio: "aspect-square" },
  { id: 24, image: "/assets/images/gallery/GuqpANDXoAA_BM5.jpg", title: "Chhattisgarh Pride", category: "Creator Summit", aspectRatio: "aspect-[3/4]" },
  { id: 25, image: "/assets/images/gallery/IMG_20260416_090307.jpg", title: "State Initiative", category: "Creator Summit", aspectRatio: "aspect-[4/5]" },
  { id: 26, image: "/assets/images/gallery/IMG_20260703_130421.jpg", title: "Creator Awards", category: "Creator Summit", aspectRatio: "aspect-[16/9]" },
  { id: 27, image: "/assets/images/gallery/IMG_20260703_134024.jpg", title: "Heritage & Tourism", category: "Nature & Tourism", aspectRatio: "aspect-square" },
  { id: 28, image: "/assets/images/gallery/IMG_4534.JPG", title: "Award Ceremony", category: "Creator Summit", aspectRatio: "aspect-[3/4]" },
  { id: 29, image: "/assets/images/event-1.jpg", title: "Grand Stage", category: "Creator Summit", aspectRatio: "aspect-[16/9]" },
  { id: 30, image: "/assets/images/event-2.jpg", title: "Influencer Conclave", category: "Creator Summit", aspectRatio: "aspect-[4/3]" },
  { id: 31, image: "/assets/images/event-3.jpg", title: "Cultural Heritage Stage", category: "Culture & Art", aspectRatio: "aspect-[16/9]" },
];

const ASPECT_RATIOS = [
  "aspect-[3/4]",
  "aspect-[16/9]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[4/3]",
  "aspect-[3/2]",
];

function GalleryCard({ item, onClick }) {
  const [currentSrc, setCurrentSrc] = useState(() => encodeURI(item.image || ""));
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const aspectClass = item.aspectRatio || "aspect-[4/3]";

  useEffect(() => {
    setCurrentSrc(encodeURI(item.image || ""));
    setErrorOccurred(false);
  }, [item.image]);

  const handleError = () => {
    if (!errorOccurred) {
      setErrorOccurred(true);
      setCurrentSrc("/assets/images/mayalinaturecamp.JPG");
    }
  };

  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200/90 shadow-xs hover:shadow-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 break-inside-avoid mb-4 sm:mb-6"
    >
      {/* Photo Container with Dynamic Aspect Ratio for Masonry */}
      <div className={`relative w-full ${aspectClass} overflow-hidden`}>
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 animate-pulse z-0" />
        )}

        <Image
          src={currentSrc}
          alt={item.title || "Chhattisgarh Gallery image"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          quality={85}
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          style={{
            objectFit: "cover",
            objectPosition: item.objectPosition || "center",
          }}
          className={`transition-all duration-500 group-hover:scale-105 ${isLoaded ? "opacity-100" : "opacity-0"
            }`}
          loading="lazy"
          unoptimized
        />

        {/* Hover Information Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="flex items-center justify-between w-full text-white">
            <span className="font-poppins text-xs font-semibold tracking-wide truncate">
              {item.title || "Chhattisgarh Media"}
            </span>
            <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 ml-2">
              <FaExpand className="w-3 h-3 text-white" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
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

  const apiPhotos = albums.length > 0
    ? albums.map((a, idx) => ({
      id: a._id || a.id || `api-photo-${idx}`,
      title: a.title || "Chhattisgarh Album",
      image: a.coverImage || "/assets/images/gallery/02.png",
      category: a.category || "Creator Summit",
      aspectRatio: ASPECT_RATIOS[idx % ASPECT_RATIOS.length],
    }))
    : [];

  const rawMedia = [...ALL_GALLERY_PHOTOS, ...apiPhotos];

  // Remove recurring/duplicate photos so each image appears only once
  const seenImages = new Set();
  const allMedia = [];
  for (const item of rawMedia) {
    if (item.image && !seenImages.has(item.image)) {
      seenImages.add(item.image);
      allMedia.push(item);
    }
  }

  // Filter media based on active category
  const filteredMedia = selectedCategory === "All"
    ? allMedia
    : allMedia.filter((item) => item.category === selectedCategory);

  const openLightbox = (index) => {
    setSelectedMediaIndex(index);
  };

  const closeLightbox = () => {
    setSelectedMediaIndex(null);
  };

  const prevMedia = useCallback((e) => {
    if (e) e.stopPropagation();
    setSelectedMediaIndex((prev) => (prev !== null ? (prev - 1 + filteredMedia.length) % filteredMedia.length : null));
  }, [filteredMedia.length]);

  const nextMedia = useCallback((e) => {
    if (e) e.stopPropagation();
    setSelectedMediaIndex((prev) => (prev !== null ? (prev + 1) % filteredMedia.length : null));
  }, [filteredMedia.length]);

  // Keyboard navigation for Lightbox modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedMediaIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevMedia();
      if (e.key === "ArrowRight") nextMedia();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMediaIndex, prevMedia, nextMedia]);

  return (
    <div className="min-h-screen bg-background font-sans text-zinc-950 px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-8 relative overflow-x-hidden animate-page-enter">

      {/* Header */}
      <div className="w-full max-w-7xl mx-auto text-center flex flex-col items-center">
        <Heading
          badge={t("OFFICIAL STATE REPOSITORY")}
          title={t("CHHATTISGARH MEDIA")}
          highlightText={t("GALLERY")}
          description={t("Explore high-resolution photography, creator summit moments, state award galas, and indigenous cultural heritage captured across Chhattisgarh.")}
        />
      </div>

      {/* Interactive Category Filter Pills */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-2.5 sm:gap-3 py-2">
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-poppins font-semibold transition-all duration-300 cursor-pointer ${selectedCategory === cat
                ? "bg-[#C45A32] text-white shadow-md shadow-[#C45A32]/30 scale-105"
                : "bg-white border border-zinc-200 text-zinc-700 hover:border-[#C45A32]/60 hover:text-[#C45A32]"
              }`}
          >
            {t(cat)}
          </button>
        ))}
      </div>

      {/* Responsive Masonry Layout */}
      {loading ? (
        <div className="p-12 text-center text-xs font-bold text-zinc-500 bg-white rounded-3xl border border-zinc-200 max-w-7xl mx-auto w-full">
          Loading state media gallery...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="p-12 text-center text-sm font-semibold text-zinc-500 bg-white rounded-3xl border border-zinc-200 max-w-7xl mx-auto w-full">
          No photos found in this category.
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6 text-left">
          {filteredMedia.map((item, idx) => (
            <GalleryCard
              key={`${item.id}-${idx}`}
              item={item}
              onClick={() => openLightbox(idx)}
            />
          ))}
        </div>
      )}

      {/* Responsive Lightbox Preview Modal with Prev/Next Navigation */}
      {selectedMediaIndex !== null && filteredMedia[selectedMediaIndex] && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900/80 text-white flex items-center justify-center hover:bg-[#C45A32] transition-colors cursor-pointer border border-white/10"
              aria-label="Close Lightbox"
            >
              <FaTimes className="w-4 h-4" />
            </button>

            {/* Left Nav Button */}
            {filteredMedia.length > 1 && (
              <button
                onClick={prevMedia}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[#C45A32] transition-colors cursor-pointer backdrop-blur-sm border border-white/10"
                aria-label="Previous Image"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
            )}

            {/* Right Nav Button */}
            {filteredMedia.length > 1 && (
              <button
                onClick={nextMedia}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[#C45A32] transition-colors cursor-pointer backdrop-blur-sm border border-white/10"
                aria-label="Next Image"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Lightbox Image Container */}
            <div className="relative h-[70vh] sm:h-[78vh] max-h-[720px] w-full bg-zinc-950 flex items-center justify-center p-2">
              <Image
                src={encodeURI(filteredMedia[selectedMediaIndex].image)}
                alt={filteredMedia[selectedMediaIndex].title || "Gallery image"}
                fill
                sizes="100vw"
                quality={90}
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Lightbox Footer Bar */}
            <div className="px-6 py-4 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between text-white text-xs sm:text-sm">
              <span className="font-semibold text-zinc-200">
                {filteredMedia[selectedMediaIndex].title || "Chhattisgarh Media Gallery"}
              </span>
              <span className="text-zinc-400 font-mono text-xs">
                {selectedMediaIndex + 1} / {filteredMedia.length}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
