"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const galleryImages = [
  {
    src: "/images/galeri/FOTO DOKUMENTASI KEGIATAS POSYANDU TGL 12 SEPT 2025 1.jpg",
    alt: "Dokumentasi Kegiatan Posyandu 1"
  },
  {
    src: "/images/galeri/FOTO DOKUMENTASI KEGIATAS POSYANDU TGL 12 SEPT 2025 6.jpg",
    alt: "Dokumentasi Kegiatan Posyandu 2"
  },
  {
    src: "/images/galeri/FOTO DOKUMENTASI KEGIATAS POSYANDU TGL 12 SEPT 2025 7.jpg",
    alt: "Dokumentasi Kegiatan Posyandu 3"
  },
  {
    src: "/images/galeri/FOTO DOKUMENTASI KEGIATAS POSYANDU TGL 12 SEPT 2025 8.jpg",
    alt: "Dokumentasi Kegiatan Posyandu 4"
  },
  {
    src: "/images/galeri/FOTO DOKUMENTASI KEGIATAS POSYANDU TGL 12 SEPT 2025 9.jpg",
    alt: "Dokumentasi Kegiatan Posyandu 5"
  },
  {
    src: "/images/galeri/FOTO DOKUMENTASI KEGIATAS POSYANDU TGL 12 SEPT 2025 10.jpg",
    alt: "Dokumentasi Kegiatan Posyandu 6"
  },
];

export default function GalleryShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* Main Image */}
      <div className="relative h-full w-full overflow-hidden rounded-r-3xl">
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#27548A]/80 via-transparent to-transparent" />
          </div>
        ))}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium">
              Galeri Kegiatan Posyandu
            </div>
            <h2 className="text-3xl font-bold leading-tight">
              Dokumentasi Pembelajaran<br />Kader Posyandu
            </h2>
            <p className="text-white/90 max-w-md">
              Bersama membangun kesehatan masyarakat melalui pemberdayaan kader posyandu yang berkualitas dan terlatih.
            </p>
          </div>

          {/* Image Indicators */}
          <div className="flex gap-2 mt-6">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Tampilkan gambar ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#578FCA]/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#27548A]/20 rounded-full blur-3xl" />
    </div>
  );
}
