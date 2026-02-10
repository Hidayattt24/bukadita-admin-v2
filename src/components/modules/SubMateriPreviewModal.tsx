"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  Video,
  FileText,
} from "lucide-react";
import { Material, poinsAPI, type Poin } from "@/lib/api";
import ContentRenderer from "@/components/shared/ContentRenderer";

interface SubMateriPreviewModalProps {
  material: Material | null;
  onClose: () => void;
}

export default function SubMateriPreviewModal({
  material,
  onClose,
}: SubMateriPreviewModalProps) {
  const [poins, setPoins] = useState<Poin[]>([]);
  const [currentPoinIndex, setCurrentPoinIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch poin data from /api/v1/materials/:id/points
  useEffect(() => {
    const fetchPoinsData = async () => {
      if (!material?.id) return;

      setLoading(true);
      try {
        console.log("🔍 Fetching poins for material ID:", material.id);
        const response = await poinsAPI.list(material.id);
        console.log("📦 Poins API response:", response);

        if (response.ok && response.data) {
          // Handle different response formats
          let poinsList: Poin[] = [];

          // Try different response structures
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = response.data as any;

          if (Array.isArray(response.data)) {
            // Direct array response
            poinsList = response.data;
          } else if (data.items && Array.isArray(data.items)) {
            // { items: Poin[] } format
            poinsList = data.items;
          } else if (data.data && Array.isArray(data.data)) {
            // { data: Poin[] } format
            poinsList = data.data;
          } else if (data.poinDetails) {
            // Nested poinDetails
            poinsList = data.poinDetails;
          }

          console.log(
            "✅ Poins fetched successfully:",
            poinsList.length,
            "items",
          );
          setPoins(poinsList);
        } else {
          console.error("❌ Failed to fetch poins:", response);
        }
      } catch (error) {
        console.error("💥 Error fetching poins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoinsData();
  }, [material?.id]);

  if (!material) return null;

  const currentPoin = poins[currentPoinIndex];

  const canNavigatePrevious = () => currentPoinIndex > 0;
  const canNavigateNext = () => currentPoinIndex < poins.length - 1;

  const handlePreviousPoin = () => {
    if (canNavigatePrevious()) {
      setCurrentPoinIndex(currentPoinIndex - 1);
    }
  };

  const handleNextPoin = () => {
    if (canNavigateNext()) {
      setCurrentPoinIndex(currentPoinIndex + 1);
    }
  };

  const getContentTypeIcon = (hasMedia: boolean) => {
    if (!hasMedia) return <FileText className="w-5 h-5" />;
    return <Video className="w-5 h-5" />;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Like user view */}
          <div className="bg-gradient-to-r from-[#578FCA] to-[#27548A] p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shrink-0">
                  {currentPoin &&
                    getContentTypeIcon(!!currentPoin.poin_media?.length)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-blue-100 text-sm font-medium mb-1">
                    {material.title}{" "}
                    {currentPoin && `• Poin ${currentPoinIndex + 1}`}
                  </div>
                  <h2 className="text-xl font-bold truncate">
                    {currentPoin ? currentPoin.title : "Preview Sub-Materi"}
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors shrink-0 ml-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {currentPoin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-100">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium text-sm">
                    {currentPoin.duration_minutes || 0} menit
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                  <span className="text-sm text-blue-100">
                    {currentPoinIndex + 1} dari {poins.length}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Content Body - Like user view */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-[#578FCA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Memuat data...</p>
                </div>
              </div>
            ) : poins.length === 0 ? (
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Belum Ada Poin Pembelajaran
                  </h3>
                  <p className="text-gray-600">
                    Tambahkan poin untuk melengkapi sub-materi ini
                  </p>
                </div>
              </div>
            ) : currentPoin ? (
              <div className="p-5">
                {/* Video/Image Placeholder */}
                {currentPoin.poin_media &&
                  currentPoin.poin_media.length > 0 && (
                    <div className="mb-6">
                      {currentPoin.poin_media.some((m) =>
                        m.mime_type.startsWith("video/"),
                      ) && (
                        <div className="aspect-video bg-gradient-to-br from-white to-gray-100 rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm">
                          <div className="text-center p-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-full flex items-center justify-center mb-6 mx-auto">
                              <Video className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#27548A] mb-2">
                              Video Pembelajaran
                            </h3>
                            <p className="text-gray-600">
                              Player video akan ditampilkan di sini
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                {/* Content Renderer - Like user view */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                  <ContentRenderer
                    htmlContent={currentPoin.content_html || ""}
                    mediaItems={currentPoin.poin_media || []}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* Navigation Footer - Like user view */}
          {poins.length > 0 && (
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex justify-between items-center gap-3">
                <button
                  onClick={handlePreviousPoin}
                  disabled={!canNavigatePrevious()}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                    canNavigatePrevious()
                      ? "bg-gradient-to-r from-[#578FCA] to-[#27548A] text-white hover:shadow-lg"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </button>

                <div className="px-4 py-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">
                    <span className="font-bold text-[#578FCA]">
                      {currentPoinIndex + 1}
                    </span>
                    {" / "}
                    <span className="font-medium">{poins.length}</span>
                  </span>
                </div>

                <button
                  onClick={handleNextPoin}
                  disabled={!canNavigateNext()}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                    canNavigateNext()
                      ? "bg-gradient-to-r from-[#578FCA] to-[#27548A] text-white hover:shadow-lg"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <span className="hidden sm:inline">Selanjutnya</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
