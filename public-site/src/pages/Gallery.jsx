import { useState, useEffect, useCallback } from "react";

const FOLDER_ID = "1kWWqi5uP15fL7pyMYEe3aIKmBxHBQRov";
const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API;

const Gallery = ({ t }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&key=${API_KEY}&fields=files(id,name,mimeType,thumbnailLink,imageMediaMetadata)&pageSize=100&orderBy=createdTime desc`
        );
        if (!res.ok) throw new Error("Failed to fetch gallery images");
        const data = await res.json();
        setImages(data.files || []);
      } catch (err) {
        console.error("Gallery fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const getImageUrl = (fileId, size = 800) => {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
  };

  const handleImageLoad = useCallback((id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  }, []);

  const openLightbox = (index) => {
    setLightbox({ open: true, index });
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightbox({ open: false, index: 0 });
    document.body.style.overflow = "";
  };

  const navigateLightbox = (direction) => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + direction + images.length) % images.length,
    }));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKey = (e) => {
      if (!lightbox.open) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateLightbox(-1);
      if (e.key === "ArrowRight") navigateLightbox(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox.open, images.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-rmc-green mb-4 block"></i>
          <p className="text-gray-500 font-medium">{t("gallery_loading") || "Loading gallery..."}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <i className="fas fa-exclamation-triangle text-4xl text-amber-500 mb-4 block"></i>
          <h3 className="text-lg font-bold text-gray-800 mb-2">{t("gallery_error") || "Unable to load gallery"}</h3>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen fade-in">
      {/* Hero Header */}
      <div className="gallery-hero relative overflow-hidden bg-gradient-to-br from-rmc-dark-green via-emerald-800 to-rmc-green py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block bg-white/15 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase border border-white/20">
            <i className="fas fa-images mr-2"></i>{t("gallery_tag") || "Photo Collection"}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            {t("head_gallery") || "Gallery"}
          </h1>
          <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {t("gallery_subtitle") || "A visual journey through our events, activities, and community moments."}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-emerald-200 text-sm">
            <i className="fas fa-camera-retro"></i>
            <span>{images.length} {t("gallery_photos") || "photos"}</span>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {images.length === 0 ? (
          <div className="text-center py-20">
            <i className="fas fa-image text-6xl text-gray-200 mb-4 block"></i>
            <p className="text-gray-400 text-lg">{t("gallery_empty") || "No photos available yet."}</p>
          </div>
        ) : (
          <div className="gallery-masonry columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="gallery-item break-inside-avoid mb-4 relative group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
                onClick={() => openLightbox(index)}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Skeleton placeholder */}
                {!loadedImages[img.id] && (
                  <div className="gallery-skeleton w-full bg-gray-100 rounded-xl animate-pulse" style={{ minHeight: "200px" }}></div>
                )}
                <img
                  src={getImageUrl(img.id, 600)}
                  alt={img.name?.replace(/\.[^/.]+$/, "") || "Gallery image"}
                  className={`w-full block transition-all duration-700 group-hover:scale-105 ${loadedImages[img.id] ? "opacity-100" : "opacity-0 absolute"}`}
                  loading="lazy"
                  onLoad={() => handleImageLoad(img.id)}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white">
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {img.name?.replace(/\.[^/.]+$/, "") || "Photo"}
                    </p>
                    <p className="text-xs text-white/70 mt-1">
                      <i className="fas fa-expand-alt mr-1"></i>{t("gallery_view") || "Click to view"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightbox.open && images[lightbox.index] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md lightbox-backdrop"></div>

          {/* Close button */}
          <button
            className="absolute top-5 right-5 z-60 text-white/80 hover:text-white text-2xl w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
            onClick={closeLightbox}
          >
            <i className="fas fa-times"></i>
          </button>

          {/* Image counter */}
          <div className="absolute top-5 left-5 z-60 text-white/60 text-sm font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            {lightbox.index + 1} / {images.length}
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 z-60 text-white/80 hover:text-white text-xl w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
                onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                className="absolute right-4 z-60 text-white/80 hover:text-white text-xl w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
                onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </>
          )}

          {/* Main image */}
          <div
            className="relative z-50 max-w-[90vw] max-h-[85vh] flex items-center justify-center lightbox-image-container"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(images[lightbox.index].id, 1600)}
              alt={images[lightbox.index].name || "Gallery image"}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl lightbox-image"
            />
          </div>

          {/* Image name */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-60 text-white/70 text-sm bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full max-w-md truncate">
            {images[lightbox.index].name?.replace(/\.[^/.]+$/, "")}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
