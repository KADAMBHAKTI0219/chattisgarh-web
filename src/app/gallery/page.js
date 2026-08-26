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
          alt={item.title || "Gallery image"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          quality={85}
          onLoad={() => setIsLoaded(true)}
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />
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
    { id: 1, image: "/assets/images/gallery/bastar tribal 1.png", aspectRatio: "aspect-[3/4]" },
    { id: 2, image: "/assets/images/gallery/02.png", aspectRatio: "aspect-[16/9]" },
    { id: 3, image: "/assets/images/gallery/03 .png", aspectRatio: "aspect-square" },
    { id: 4, image: "/assets/images/gallery/1001299067.jpg", aspectRatio: "aspect-[4/5]" },
    { id: 5, image: "/assets/images/gallery/757656910_122296226312081376_9155510348415342518_n copy.jpg", aspectRatio: "aspect-[16/9]" },
    { id: 6, image: "/assets/images/gallery/DSC00008.JPG", aspectRatio: "aspect-[3/4]" },
    { id: 7, image: "/assets/images/gallery/DSC00149.JPG", aspectRatio: "aspect-[4/3]" },
    { id: 8, image: "/assets/images/gallery/DSC00580.JPG", aspectRatio: "aspect-[16/9]" },
    { id: 9, image: "/assets/images/gallery/DSC00700.JPG", aspectRatio: "aspect-[4/5]" },
    { id: 10, image: "/assets/images/gallery/DSC01733.JPG", aspectRatio: "aspect-[4/3]" },
    { id: 11, image: "/assets/images/gallery/DSC02119.JPG", aspectRatio: "aspect-[3/4]" },
    { id: 12, image: "/assets/images/gallery/DSC02344.JPG", aspectRatio: "aspect-[4/5]" },
    { id: 13, image: "/assets/images/gallery/DSC02412.JPG", aspectRatio: "aspect-[16/9]" },
    { id: 14, image: "/assets/images/gallery/G9eoIg0aYAYBlk4.jpg", aspectRatio: "aspect-[16/9]" },
    { id: 15, image: "/assets/images/gallery/G9eoIitaYAcVhQN.jpg", aspectRatio: "aspect-[4/3]" },
    { id: 16, image: "/assets/images/gallery/G9eoIivbAAAKiQ8.jpg", aspectRatio: "aspect-square" },
    { id: 17, image: "/assets/images/gallery/GuqpANDXoAA_BM5.jpg", aspectRatio: "aspect-[3/4]" },
    { id: 18, image: "/assets/images/gallery/IMG_20260416_090307.jpg", aspectRatio: "aspect-[4/5]" },
    { id: 19, image: "/assets/images/gallery/IMG_20260703_130421.jpg", aspectRatio: "aspect-[16/9]" },
    { id: 20, image: "/assets/images/gallery/IMG_20260703_133508.jpg", aspectRatio: "aspect-[4/5]" },
    { id: 21, image: "/assets/images/gallery/IMG_20260703_134024.jpg", aspectRatio: "aspect-square" },
    { id: 22, image: "/assets/images/gallery/IMG_4534.JPG", aspectRatio: "aspect-[3/4]" },
  ];

  const apiPhotos = albums.length > 0
    ? albums.map((a, idx) => ({
        id: a._id || a.id,
        image: a.coverImage || "/assets/images/gallery/02.png",
        aspectRatio: ASPECT_RATIOS[idx % ASPECT_RATIOS.length],
      }))
    : [];

  const rawMedia = [...GALLERY_PHOTOS, ...apiPhotos];

  // Remove recurring/duplicate photos so each image appears only once
  const seenImages = new Set();
  const allMedia = [];
  for (const item of rawMedia) {
    if (item.image && !seenImages.has(item.image)) {
      seenImages.add(item.image);
      allMedia.push(item);
    }
  }

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

      {/* Responsive Lightbox Preview Modal — Only Image */}
      {selectedMedia && (
        <div
          onClick={() => setSelectedMedia(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto"
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900/80 text-white flex items-center justify-center hover:bg-[#C45A32] transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <FaTimes className="w-4 h-4" />
            </button>

            <div className="relative h-[75vh] sm:h-[80vh] max-h-[750px] w-full bg-zinc-950 flex items-center justify-center">
              <Image
                src={selectedMedia.image}
                alt={selectedMedia.title || "Gallery image"}
                fill
                quality={90}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
