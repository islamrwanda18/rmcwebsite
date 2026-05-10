import { useState, useEffect, useCallback } from "react";

const FOLDER_ID = "1kWWqi5uP15fL7pyMYEe3aIKmBxHBQRov";
const FOLDER_URL = "https://drive.google.com/drive/folders/1kWWqi5uP15fL7pyMYEe3aIKmBxHBQRov";
const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API;

export default function GalleryCMS() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [loadedImages, setLoadedImages] = useState({});

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&key=${API_KEY}&fields=files(id,name,mimeType,thumbnailLink,size,createdTime,imageMediaMetadata)&pageSize=100&orderBy=createdTime desc`
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || "Failed to fetch images from Google Drive");
      }
      const data = await res.json();
      setImages(data.files || []);
    } catch (err) {
      console.error("GalleryCMS fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const getImageUrl = (fileId, size = 400) => {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
  };

  const handleImageLoad = useCallback((id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  }, []);

  const formatFileSize = (bytes) => {
    if (!bytes) return "—";
    const num = parseInt(bytes);
    if (num < 1024) return num + " B";
    if (num < 1048576) return (num / 1024).toFixed(1) + " KB";
    return (num / 1048576).toFixed(1) + " MB";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fade-in">
      {/* Top Action Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-images text-rmc-green"></i>
              Gallery Manager
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Images are managed directly on Google Drive. Use the button below to access the folder and upload, rename, or delete images.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href={FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-rmc-green hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md text-sm"
            >
              <i className="fab fa-google-drive"></i>
              Access the Folder
              <i className="fas fa-external-link-alt text-xs opacity-75"></i>
            </a>
            <button
              onClick={fetchImages}
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-lg transition-all text-sm border border-gray-200"
              title="Refresh gallery"
            >
              <i className={`fas fa-sync-alt ${loading ? "animate-spin" : ""}`}></i>
              Refresh
            </button>
          </div>
        </div>

        {/* Info banner */}
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 flex items-start gap-3">
          <i className="fas fa-info-circle text-emerald-600 mt-0.5"></i>
          <div className="text-sm text-emerald-800">
            <strong>How it works:</strong> All images in the linked Google Drive folder are automatically displayed on the public Gallery page.
            To add new photos, simply upload them to the Drive folder. To remove photos, delete them from Drive. Changes may take a few minutes to reflect.
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 flex items-start gap-3">
          <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
          <div>
            <p className="font-bold text-red-800 text-sm">Error loading gallery</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <p className="text-red-500 text-xs mt-2">
              Make sure the <code className="bg-red-100 px-1 py-0.5 rounded">VITE_GOOGLE_DRIVE_API</code> environment variable is set correctly.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-3xl text-rmc-green mb-3 block"></i>
            <p className="text-gray-500 text-sm">Loading images from Google Drive...</p>
          </div>
        </div>
      )}

      {/* Gallery Content */}
      {!loading && !error && (
        <>
          {/* Stats & View Toggle */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 font-medium">
              <i className="fas fa-image mr-1 text-rmc-green"></i>
              {images.length} {images.length === 1 ? "image" : "images"} found
            </p>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${viewMode === "grid" ? "bg-white shadow-sm text-rmc-green" : "text-gray-500 hover:text-gray-700"}`}
              >
                <i className="fas fa-th mr-1"></i>Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${viewMode === "list" ? "bg-white shadow-sm text-rmc-green" : "text-gray-500 hover:text-gray-700"}`}
              >
                <i className="fas fa-list mr-1"></i>List
              </button>
            </div>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <i className="fas fa-cloud-upload-alt text-5xl text-gray-300 mb-4 block"></i>
              <p className="text-gray-400 font-medium mb-2">No images found in the Drive folder</p>
              <p className="text-gray-400 text-sm mb-4">Upload images to the Google Drive folder to see them here.</p>
              <a
                href={FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-rmc-green hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-lg transition text-sm"
              >
                <i className="fab fa-google-drive"></i>
                Open Drive Folder
              </a>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="group relative bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 aspect-square"
                >
                  {!loadedImages[img.id] && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                      <i className="fas fa-image text-gray-300 text-2xl"></i>
                    </div>
                  )}
                  <img
                    src={getImageUrl(img.id, 400)}
                    alt={img.name || "Gallery image"}
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${loadedImages[img.id] ? "opacity-100" : "opacity-0"}`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(img.id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-white text-xs font-medium truncate w-full">
                      {img.name?.replace(/\.[^/.]+$/, "")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Preview</th>
                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Name</th>
                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Type</th>
                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Size</th>
                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Date</th>
                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Dimensions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {images.map((img) => (
                    <tr key={img.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <img
                          src={getImageUrl(img.id, 80)}
                          alt={img.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          loading="lazy"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                          {img.name?.replace(/\.[^/.]+$/, "")}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">
                          {img.mimeType?.split("/")[1]?.toUpperCase() || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                        {formatFileSize(img.size)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">
                        {formatDate(img.createdTime)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">
                        {img.imageMediaMetadata
                          ? `${img.imageMediaMetadata.width} × ${img.imageMediaMetadata.height}`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
